package com.flyon.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TravelIndexDto {

    private String country;

    private double exchangeDropRate;     // 환율 하락률
    private double outboundIncreaseRate; // 출국자 증가율
    private double spendingIncreaseRate; // 해외소비 증가율

    private double travelIndex;          // 최종 여행심리지수
}
