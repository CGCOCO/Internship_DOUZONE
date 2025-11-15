package com.flyon.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class SpendingApiResponseDto {
    private StatisticSearch StatisticSearch;

    @Data
    public static class StatisticSearch {
        private int list_total_count;
        private List<SpendingItemDto> row;
    }
}
