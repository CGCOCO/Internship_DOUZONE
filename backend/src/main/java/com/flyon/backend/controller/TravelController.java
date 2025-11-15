package com.flyon.backend.controller;

import com.flyon.backend.dto.*;
import com.flyon.backend.service.TravelService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/travel")
@CrossOrigin("*") // 프론트와 백엔드 포트 달라 CORS 허용
public class TravelController {

    private final TravelService travelService;

    public TravelController(TravelService travelService) {
        this.travelService = travelService;
    }

    // 🔵 환율 엔드포인트
    @GetMapping("/exchange")
    public ExchangeDto getExchange(@RequestParam String country) {
        return travelService.getExchangeRate(country);
    }

    // 🔵 출국자 엔드포인트 (정확한 위치!)
    @GetMapping("/outbound")
    public OutboundDto getOutbound(@RequestParam String country) {
        return travelService.getOutboundRate(country);
    }

    @GetMapping("/spending")
    public SpendingDto getSpending(@RequestParam String country) {
        return travelService.getSpendingRate(country);
    }

    @GetMapping("/index")
    public TravelIndexDto getTravelIndex(@RequestParam String country) {
        return travelService.getTravelIndex(country);
    }

    @GetMapping("/sentiment")
    public SentimentDto getSentiment(@RequestParam String country) {
        return travelService.getSentiment(country);
    }


}
