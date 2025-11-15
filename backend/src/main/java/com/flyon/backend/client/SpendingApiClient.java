package com.flyon.backend.client;

import com.flyon.backend.dto.SpendingApiResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Component
public class SpendingApiClient {

    @Value("${external-api.spending.key}")
    private String apiKey;

    @Value("${external-api.spending.url}")
    private String apiUrl;

    // statCode = 외국인 해외카드 소비액(예: 901Y002)
    private static final String STAT_CODE = "901Y002";
    private static final String PERIOD = "M";
    private static final String ITEM_CODE = "000000";

    public double getMonthlySpending(String ym) {

        // 입력값 2024-04 → 202404
        String yyyymm = ym.replace("-", "");

        // ECOS URL 조합 (정식 규격)
        String url = apiUrl
                + "/" + apiKey
                + "/json/kr/" + yyyymm + "/" + yyyymm
                + "/901Y002/M/000000";


        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<SpendingApiResponseDto> response =
                restTemplate.getForEntity(url, SpendingApiResponseDto.class);

        SpendingApiResponseDto dto = response.getBody();

        if (dto == null ||
                dto.getStatisticSearch() == null ||
                dto.getStatisticSearch().getRow() == null ||
                dto.getStatisticSearch().getRow().isEmpty()) {

            return 0;
        }

        return Double.parseDouble(dto.getStatisticSearch().getRow().get(0).getDATA_VALUE());
    }
}
