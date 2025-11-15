package com.flyon.backend.client;

import com.flyon.backend.dto.OutboundApiResponseDto;
import com.flyon.backend.dto.OutboundRawItemDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Component
public class OutboundApiClient {

    @Value("${external-api.outbound.key}")
    private String apiKey;

    @Value("${external-api.outbound.url}")
    private String apiUrl;

    public OutboundApiResponseDto fetchOutboundData() {

        String finalUrl = apiUrl
                + "?serviceKey=" + apiKey
                + "&page=1"
                + "&perPage=500"
                + "&returnType=JSON";

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<OutboundApiResponseDto> response =
                restTemplate.getForEntity(finalUrl, OutboundApiResponseDto.class);

        return response.getBody();
    }
}
