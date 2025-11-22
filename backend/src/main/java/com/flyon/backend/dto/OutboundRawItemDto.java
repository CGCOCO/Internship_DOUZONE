package com.flyon.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OutboundRawItemDto {

    @JsonProperty("년")
    private int year;

    @JsonProperty("월")
    private int month;

    @JsonProperty("출입국 구분")
    private String type;

    @JsonProperty("출입국자 수")
    private int count;
}
