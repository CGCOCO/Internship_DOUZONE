package com.flyon.backend.controller;

import com.flyon.backend.entity.ExchangeRate;
import com.flyon.backend.repository.ExchangeRateRepository;
import com.flyon.backend.service.TravelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/exchange")
@CrossOrigin(origins = "*")   // ★ CORS 추가
public class ExchangeController {

    private final ExchangeRateRepository exchangeRateRepository;
    private final TravelService travelService;

    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getHistory(@RequestParam String country) {

        String currency = travelService.toCurrencyPublic(country);

        // 최근 7일 데이터 조회
        List<ExchangeRate> list =
                exchangeRateRepository.findTop7ByCurrencyOrderByDateDesc(currency);

        // 최신순 → 오래된순 역순정렬
        Collections.reverse(list);

        List<Map<String, Object>> history = new ArrayList<>();
        for (ExchangeRate e : list) {
            Map<String, Object> item = new HashMap<>();
            item.put("date", e.getDate().toString());
            item.put("rate", e.getRate());
            history.add(item);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("currency", currency);
        result.put("history", history);

        return ResponseEntity.ok(result);
    }
}
