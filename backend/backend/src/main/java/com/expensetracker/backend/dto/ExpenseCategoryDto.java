package com.expensetracker.backend.dto;

public class ExpenseCategoryDto {
    private String category;
    private Double total;

    public ExpenseCategoryDto(String category, Double total) {
        this.category = category;
        this.total = total;
    }
    public String getCategory() { return category; }
    public Double getTotal() { return total; }
}
