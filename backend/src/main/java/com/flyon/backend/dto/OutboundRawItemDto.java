package com.flyon.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OutboundRawItemDto {

    @JsonProperty("년")
    private int year;

    @JsonProperty("월")
    private int month;

    @JsonProperty("국민 외국인 구분")
    private String nationalityType;

    @JsonProperty("승객 승무원 구분")
    private String passengerType;

    @JsonProperty("출입국 구분")
    private String inoutType; // 출국 / 입국

    @JsonProperty("출입국자 수")
    private int count;
}
