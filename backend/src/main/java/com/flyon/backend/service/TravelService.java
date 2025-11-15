package com.flyon.backend.service;

import com.flyon.backend.client.ExchangeApiClient;
import com.flyon.backend.client.OutboundApiClient;
import com.flyon.backend.client.SpendingApiClient;
import com.flyon.backend.dto.*;
import com.flyon.backend.util.TravelIndexCalculator;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TravelService {

    private final ExchangeApiClient exchangeApiClient;
    private final OutboundApiClient outboundApiClient;
    private final SpendingApiClient spendingApiClient;

    // 생성자
    public TravelService(ExchangeApiClient exchangeApiClient,
                         OutboundApiClient outboundApiClient,
                         SpendingApiClient spendingApiClient) {
        this.exchangeApiClient = exchangeApiClient;
        this.outboundApiClient = outboundApiClient;
        this.spendingApiClient = spendingApiClient;
    }


    // 🔵 ① 환율 계산 기능 (이미 있던거)
    public ExchangeDto getExchangeRate(String country) {
        ExchangeItem[] items = exchangeApiClient.getExchangeItems();
        String targetCurrency = convertCountryToCurrency(country);

        for (ExchangeItem item : items) {
            if (item.getCur_unit().equals(targetCurrency)) {

                double today = Double.parseDouble(item.getDeal_bas_r());
                double yesterday = today + 10; // 임시
                double dropRate = ((yesterday - today) / yesterday) * 100;

                return new ExchangeDto(today, yesterday, dropRate);
            }
        }
        // 데이터 없음 → 기본 0값 반환
        return new ExchangeDto(0, 0, 0);
    }

    // 🔵 ② **여기에 넣는 것! 출국자 증가율 기능**
    public OutboundDto getOutboundRate(String country) {

        // 1) 나라 명시 (JP → 일본)
        String countryKr = convertCountryToKorean(country);

        // 2) 전체 데이터 가져오기
        OutboundApiResponseDto result = outboundApiClient.fetchOutboundData();
        if (result == null || result.getData() == null) {
            return new OutboundDto(country, 0, 0, 0);
        }

        // 3) RAW list
        List<OutboundRawItemDto> list = result.getData();

        // 4) 출국 + 특정 국가만 필터링
        List<OutboundRawItemDto> filtered = list.stream()
                .filter(item -> item.getInoutType().equals("출국"))
                .filter(item -> item.getNationalityType() != null)
                .filter(item -> item.getNationalityType().contains(countryKr))   // 일본 포함
                .toList();

        if (filtered.isEmpty()) {
            return new OutboundDto(country, 0, 0, 0);
        }

        // 5) 월별 합계를 Map<"YYYY-MM", 총합>
        Map<String, Integer> monthlySum = new HashMap<>();

        for (OutboundRawItemDto item : filtered) {
            String key = ymToKey(item.getYear(), item.getMonth());
            monthlySum.put(key, monthlySum.getOrDefault(key, 0) + item.getCount());
        }

        // 6) 가장 최근 2개월 찾기
        List<String> sortedMonths = monthlySum.keySet().stream()
                .sorted()
                .toList();

        if (sortedMonths.size() < 2) {
            return new OutboundDto(country, 0, 0, 0);
        }

        String latest = sortedMonths.get(sortedMonths.size() - 1);
        String previous = sortedMonths.get(sortedMonths.size() - 2);

        int latestCount = monthlySum.get(latest);
        int previousCount = monthlySum.get(previous);

        double increaseRate = 0;
        if (previousCount > 0) {
            increaseRate = ((double) (latestCount - previousCount) / previousCount) * 100;
        }

        return new OutboundDto(country, latestCount, previousCount, increaseRate);
    }


    public SpendingDto getSpendingRate(String country) {

        String currentMonth = "2024-04";
        String previousMonth = "2024-03";

        double current = spendingApiClient.getMonthlySpending(currentMonth);
        double previous = spendingApiClient.getMonthlySpending(previousMonth);

        double increaseRate = 0;
        if (previous > 0) {
            increaseRate = ((current - previous) / previous) * 100.0;
        }

        return new SpendingDto(country, current, previous, increaseRate);
    }


    public TravelIndexDto getTravelIndex(String country) {

        // 1. 환율
        ExchangeDto exchange = getExchangeRate(country);

        // 2. 출국자 증가율
        OutboundDto outbound = getOutboundRate(country);

        // 3. 해외소비 증가율
        SpendingDto spending = getSpendingRate(country);

        // 4. 종합 여행심리지수 계산
        double index = TravelIndexCalculator.calculate(
                exchange.getDropRate(),
                outbound.getIncreaseRate(),
                spending.getIncreaseRate()
        );

        return new TravelIndexDto(
                country,
                exchange.getDropRate(),
                outbound.getIncreaseRate(),
                spending.getIncreaseRate(),
                index
        );
    }

    public double getSpendingIncreaseRate() {

        String latestYm = "2024-03";
        String previousYm = "2024-02";

        double latestValue = spendingApiClient.getMonthlySpending(latestYm);
        double previousValue = spendingApiClient.getMonthlySpending(previousYm);

        if (previousValue == 0) return 0;

        return ((latestValue - previousValue) / previousValue) * 100.0;
    }



    private String convertCountryToCurrency(String country) {
        if (country.equals("JP")) return "JPY";
        if (country.equals("US")) return "USD";
        if (country.equals("KR")) return "KRW";
        if (country.equals("VN")) return "VND";
        if (country.equals("EU")) return "EUR";
        return "";
    }

    // 보조 메서드 (그대로 유지)
    private String convertCountryToKorean(String country) {
        if (country.equals("JP")) return "일본";
        if (country.equals("US")) return "미국";
        if (country.equals("VN")) return "베트남";
        return country;
    }
    private String ymToKey(int year, int month) {
        return year + "-" + (month < 10 ? "0" + month : month);
    }

    public SentimentDto getSentiment(String country) {

        // 1) 각 지표 계산
        ExchangeDto ex = getExchangeRate(country);
        if (ex == null) {
            ex = new ExchangeDto(0, 0, 0);
        }
        OutboundDto out = getOutboundRate(country);
        SpendingDto sp = getSpendingRate(country);

        // 2) 여행심리지수 계산 공식
        double sentimentScore =
                (ex.getDropRate() * 0.4) +
                        (out.getIncreaseRate() * 0.4) +
                        (sp.getIncreaseRate() * 0.2);

        // 3) DTO로 묶어서 반환
        return new SentimentDto(country, ex, out, sp, sentimentScore);
    }


}
