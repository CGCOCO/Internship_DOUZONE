package com.flyon.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class OutboundApiResponseDto {

    private int page;
    private int perPage;
    private int totalCount;
    private int currentCount;
    private int matchCount;
    private List<OutboundRawItemDto> data;
}
