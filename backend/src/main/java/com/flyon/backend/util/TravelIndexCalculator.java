package com.flyon.backend.util;

public class TravelIndexCalculator {

    public static double calculate(double exchangeDropRate,
                                   double outboundIncreaseRate,
                                   double spendingIncreaseRate) {

        double index =
                (exchangeDropRate * 0.4) +
                        (outboundIncreaseRate * 0.4) +
                        (spendingIncreaseRate * 0.2);

        return index;
    }
}
