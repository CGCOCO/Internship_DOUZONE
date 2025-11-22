package com.flyon.backend.util;

public class TravelIndexCalculator {

    public static double calculate(double dropRate, double outboundIncrease) {

        return (outboundIncrease * 0.6) + (dropRate * 0.4);
    }
}
