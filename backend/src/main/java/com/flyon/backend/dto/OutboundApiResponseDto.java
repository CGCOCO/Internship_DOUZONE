package com.flyon.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class OutboundApiResponseDto {
    private List<OutboundRawItemDto> data;
}
