package com.flyon.backend.client;

import com.flyon.backend.dto.ExchangeItem;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class ExchangeApiClient {

    @Value("${external-api.exchange.key}")
    private String apiKey;

    @Value("${external-api.exchange.url}")
    private String apiUrl;

    private final WebClient webClient = WebClient.create();

    public ExchangeItem[] fetchRateAP01() {
        String url = apiUrl + "?authkey=" + apiKey + "&data=AP01";
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(ExchangeItem[].class)
                .block();
    }

    public ExchangeItem[] fetchRateAP02() {
        String url = apiUrl + "?authkey=" + apiKey + "&data=AP02";
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(ExchangeItem[].class)
                .block();
    }
}

