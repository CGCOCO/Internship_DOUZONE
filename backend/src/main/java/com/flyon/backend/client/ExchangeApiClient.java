package com.flyon.backend.client;

import com.flyon.backend.dto.ExchangeItem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Component
public class ExchangeApiClient {

    @Value("${external-api.exchange.key}")
    private String apiKey;

    @Value("${external-api.exchange.url}")
    private String apiUrl;

    public ExchangeItem[] getExchangeItems() {

        String finalUrl = apiUrl + "?authkey=" + apiKey + "&data=AP01";

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<ExchangeItem[]> response =
                restTemplate.getForEntity(finalUrl, ExchangeItem[].class);

        return response.getBody();
    }

}
