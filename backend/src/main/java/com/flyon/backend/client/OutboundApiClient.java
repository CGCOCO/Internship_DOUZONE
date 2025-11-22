
package com.flyon.backend.client;

import com.flyon.backend.dto.OutboundApiResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class OutboundApiClient {

    @Value("${external-api.outbound.key}")
    private String apiKey;

    @Value("${external-api.outbound.url}")
    private String apiUrl;

    private final WebClient webClient = WebClient.create();

    public OutboundApiResponseDto fetchOutboundData() {

        String url = apiUrl
                + "?serviceKey=" + apiKey
                + "&page=1&perPage=500&returnType=JSON";

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(OutboundApiResponseDto.class)
                .block();
    }
}



/*
        RestTemplate restTemplate = new RestTemplate(); //동기 방식의 호출 메서드 -> return이 올 때까지 무한정 기다림
        //서버에서 api call했을 때, 모든 결과값을 받을 때까지 계속..
        //WebClient -> 비동기 호출하는 툴
        //왜 이걸 쓰는지 이해하는 정도

        ResponseEntity<OutboundApiResponseDto> response =
                restTemplate.getForEntity(finalUrl, OutboundApiResponseDto.class);

        return response.getBody();
    }
}
*/