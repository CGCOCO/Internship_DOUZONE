package com.flyon.backend.service;

import com.flyon.backend.client.ExchangeApiClient;
import com.flyon.backend.client.OutboundApiClient;
import com.flyon.backend.dto.*;
import com.flyon.backend.util.TravelIndexCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TravelService {

    private final ExchangeApiClient exchangeApiClient;
    private final OutboundApiClient outboundApiClient;

    public ExchangeDto getExchangeRate(String country) {

        ExchangeItem[] items = exchangeApiClient.fetchRate();
        if (items == null || items.length == 0) return new ExchangeDto(0, 0, 0);

        // 오늘 환율 파싱
        String todayStr = items[0].getDealBasR();
        double today = 0;
        try {
            today = Double.parseDouble(todayStr.replace(",", ""));
        } catch (Exception ignored) {}

        // 어제 환율 파싱
        double yesterday = today; // 기본값
        if (items.length > 1) {
            String yStr = items[1].getDealBasR();
            try {
                yesterday = Double.parseDouble(yStr.replace(",", ""));
            } catch (Exception ignored) {}
        }

        double dropRate = yesterday > 0 ? ((yesterday - today) / yesterday) * 100 : 0;

        return new ExchangeDto(today, yesterday, dropRate);
    }


    public OutboundDto getOutboundRate(String country) {

        OutboundApiResponseDto dto = outboundApiClient.fetchOutboundData(); //api 호출
        if (dto == null || dto.getData() == null || dto.getData().isEmpty()) {
            return new OutboundDto(0, 0, 0);
        }

        int current = dto.getData().get(0).getCount();
        int previous = dto.getData().size() > 1 ? dto.getData().get(1).getCount() : current;

        double increase = previous > 0 ? ((current - previous) / (double) previous) * 100 : 0;

        return new OutboundDto(current, previous, increase);
    }

    public TravelIndexDto getTravelIndex(String country) {

        ExchangeDto ex = getExchangeRate(country);
        OutboundDto out = getOutboundRate(country);

        double index = TravelIndexCalculator.calculate(
                ex.getDropRate(),
                out.getIncreaseRate()
        );

        long finalIndex = Math.round(index);

        return new TravelIndexDto(
                country,
                ex.getDropRate(),
                out.getIncreaseRate(),
                finalIndex
        );
    }
}
