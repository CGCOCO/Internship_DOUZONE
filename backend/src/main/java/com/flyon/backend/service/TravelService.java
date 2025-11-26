package com.flyon.backend.service;

import com.flyon.backend.client.ExchangeApiClient;
import com.flyon.backend.client.OutboundApiClient;
import com.flyon.backend.dto.*;
import com.flyon.backend.entity.ExchangeRate;
import com.flyon.backend.repository.ExchangeRateRepository;
import com.flyon.backend.util.TravelIndexCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TravelService {

    private final ExchangeApiClient exchangeApiClient;
    private final OutboundApiClient outboundApiClient;
    private final ExchangeRateRepository exchangeRateRepository;

    // 최근 7일 캐시 (fallback 용)
    private final Map<String, Double> rateCache =
            new LinkedHashMap<String, Double>() {
                @Override
                protected boolean removeEldestEntry(Map.Entry<String, Double> eldest) {
                    return this.size() > 7;
                }
            };

    // 국가-통화 매핑
    private static final Map<String, String> COUNTRY_TO_CURRENCY = Map.ofEntries(
            Map.entry("JP", "JPY(100)"),
            Map.entry("US", "USD"),
            Map.entry("FR", "EUR"),
            Map.entry("DE", "EUR"),
            Map.entry("IT", "EUR"),
            Map.entry("CA", "CAD"),
            Map.entry("AU", "AUD"),
            Map.entry("NZ", "NZD"),
            Map.entry("TH", "THB"),
            Map.entry("MX", "MXN"),
            Map.entry("KR", "KRW")
    );

    private String toCurrency(String country) {
        return COUNTRY_TO_CURRENCY.getOrDefault(country.toUpperCase(), country.toUpperCase());
    }

    public String toCurrencyPublic(String country) {
        if (country == null) return null;
        return toCurrency(country.toUpperCase());
    }


    // =====================
    // DB + API 기반 환율 처리
    // =====================
    public ExchangeDto getExchangeRate(String country) {

        String currency = toCurrency(country);
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        // 1) 오늘 데이터 먼저 DB에서 조회
        Optional<ExchangeRate> todayDB = exchangeRateRepository.findByCurrencyAndDate(currency, today);

        // 2) 오늘 데이터 DB에 없으면 API 호출 후 저장
        double todayRate;

        if (todayDB.isPresent()) {
            todayRate = todayDB.get().getRate();
        } else {
            // API 호출 (AP01 → AP02)
            ExchangeItem item = findAvailableRate(currency);

            if (item == null || item.getDealBasR() == null) {
                return new ExchangeDto(0, 0, 0);
            }

            todayRate = parse(item.getDealBasR());

            // 중복 저장 방지 로직 추가
            Optional<ExchangeRate> exist =
                    exchangeRateRepository.findByCurrencyAndDate(currency, today);

            if (exist.isEmpty()) {
                exchangeRateRepository.save(
                        ExchangeRate.builder()
                                .currency(currency)
                                .rate(todayRate)
                                .date(today)
                                .build()
                );
            }
        }


        // 3) 어제 데이터 DB 조회
        Optional<ExchangeRate> yesterdayDB =
                exchangeRateRepository.findByCurrencyAndDate(currency, yesterday);

        double yesterdayRate = todayRate;

        if (yesterdayDB.isPresent()) {
            yesterdayRate = yesterdayDB.get().getRate();
        }

        // 4) 변동률 계산
        double dropRate = 0;
        if (yesterdayRate > 0) {
            dropRate = ((yesterdayRate - todayRate) / yesterdayRate) * 100;
        }

        return new ExchangeDto(todayRate, yesterdayRate, dropRate);
    }

    // AP01 → AP02 순서로 조회
    private ExchangeItem findAvailableRate(String currency) {
        ExchangeItem one = findRate(exchangeApiClient.fetchRateAP01(), currency);
        if (one != null && one.getDealBasR() != null) return one;

        return findRate(exchangeApiClient.fetchRateAP02(), currency);
    }

    private ExchangeItem findRate(ExchangeItem[] items, String currency) {
        if (items == null) return null;
        return Arrays.stream(items)
                .filter(i -> currency.equalsIgnoreCase(i.getCurUnit()))
                .findFirst()
                .orElse(null);
    }

    private double parse(String s) {
        if (s == null) return 0;
        try {
            return Double.parseDouble(s.replace(",", ""));
        } catch (Exception e) {
            return 0;
        }
    }

    // =====================
    // 출국자 / 여행지수 (기존 유지)
    // =====================

    public OutboundDto getOutboundRate(String country) {
        OutboundApiResponseDto dto = outboundApiClient.fetchOutboundData();
        if (dto == null || dto.getData() == null || dto.getData().isEmpty()) {
            return new OutboundDto(0, 0, 0);
        }

        int current = dto.getData().get(0).getCount();
        int prev = dto.getData().size() > 1 ? dto.getData().get(1).getCount() : current;

        double increase = prev > 0 ? ((current - prev) / (double) prev) * 100 : 0;

        return new OutboundDto(current, prev, increase);
    }

    public TravelIndexDto getTravelIndex(String country) {

        ExchangeDto ex = getExchangeRate(country);
        OutboundDto out = getOutboundRate(country);

        double index = TravelIndexCalculator.calculate(
                ex.getDropRate(),
                out.getIncreaseRate()
        );

        return new TravelIndexDto(
                country,
                ex.getDropRate(),
                out.getIncreaseRate(),
                Math.round(index)
        );
    }
}
