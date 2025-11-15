package com.flyon.backend.dto;

import lombok.Data;

@Data
public class ExchangeItem {
    private String cur_unit;    // 통화 (JPY, USD...)
    private String ttb;
    private String tts;
    private String deal_bas_r;  // 기준 환율
}
