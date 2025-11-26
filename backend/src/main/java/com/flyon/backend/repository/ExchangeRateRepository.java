package com.flyon.backend.repository;

import com.flyon.backend.entity.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, Long> {

    // 최근 7일 조회
    List<ExchangeRate> findTop7ByCurrencyOrderByDateDesc(String currency);

    // 날짜 1건 조회 (중복 제거 후)
    Optional<ExchangeRate> findByCurrencyAndDate(String currency, LocalDate date);
}
