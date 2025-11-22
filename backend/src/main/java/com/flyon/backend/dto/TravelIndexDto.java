package com.flyon.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TravelIndexDto {
    private String country;
    private double exchangeDropRate;
    private double outboundIncreaseRate;
    private long sentimentIndex;
}
