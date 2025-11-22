package com.flyon.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ExchangeItem {

    @JsonProperty("cur_unit")
    private String curUnit;

    @JsonProperty("deal_bas_r")
    private String dealBasR;  // 원본은 문자열

    // ttb, tts 필요 없음 → 지워도 안전
}
