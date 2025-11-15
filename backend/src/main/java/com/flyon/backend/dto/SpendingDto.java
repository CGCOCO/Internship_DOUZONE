package com.flyon.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SpendingDto {
    private String country;            // 예: JP
    private double currentSpending;    // 이번 달 해외 소비액
    private double previousSpending;   // 지난 달 해외 소비액
    private double increaseRate;       // 증가율 (%)
}
