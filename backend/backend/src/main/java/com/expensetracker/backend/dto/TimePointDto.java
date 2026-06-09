package com.expensetracker.backend.dto;

import java.time.LocalDate;

public class TimePointDto {
    private LocalDate date;
    private Double total;

    public TimePointDto(LocalDate date, Double total) {
        this.date = date;
        this.total = total;
    }
    public LocalDate getDate() { return date; }
    public Double getTotal() { return total; }
}
