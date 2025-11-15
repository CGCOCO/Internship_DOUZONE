package com.flyon.backend.dto;

import lombok.Data;

@Data
public class SentimentDto {

    private String country;
    private ExchangeDto exchange;
    private OutboundDto outbound;
    private SpendingDto spending;
    private double sentimentScore;

    public SentimentDto(String country,
                        ExchangeDto exchange,
                        OutboundDto outbound,
                        SpendingDto spending,
                        double sentimentScore) {
        this.country = country;
        this.exchange = exchange;
        this.outbound = outbound;
        this.spending = spending;
        this.sentimentScore = sentimentScore;
    }
}
