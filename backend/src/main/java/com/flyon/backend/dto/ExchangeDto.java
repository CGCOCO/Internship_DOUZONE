package com.flyon.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExchangeDto {
    private double todayRate;      // 오늘 환율
    private double yesterdayRate;  // 어제 환율
    private double dropRate;       // 하락률(%)
}
