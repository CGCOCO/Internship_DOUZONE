package com.flyon.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OutboundDto {
    private String country;        // 예: JP
    private int currentMonth;      // 이번 달 출국자 수
    private int previousMonth;     // 지난 달 출국자 수
    private double increaseRate;   // 증가율 (%)
}
