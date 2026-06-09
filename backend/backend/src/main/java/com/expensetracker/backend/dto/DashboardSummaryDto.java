package com.expensetracker.backend.dto;

public class DashboardSummaryDto {

    // ===== DASHBOARD KPI =====
    private Double today;
    private Double yesterday;
    private Double last7Days;
    private Double last30Days;
    private Double currentYear;
    private Double total;

    // ===== GOAL SUMMARY =====
    private Double totalExpenses;
    private Double goalAmount;
    private Boolean overGoal;
    private String periodType;
    private Double remainingAmount;

    public DashboardSummaryDto() {}

    // ===== Dashboard KPI constructor =====
    public DashboardSummaryDto(
            Double today,
            Double yesterday,
            Double last7Days,
            Double last30Days,
            Double currentYear,
            Double total
    ) {
        this.today = today;
        this.yesterday = yesterday;
        this.last7Days = last7Days;
        this.last30Days = last30Days;
        this.currentYear = currentYear;
        this.total = total;
    }

    // ===== Goal Summary constructor =====
    public DashboardSummaryDto(
            Double totalExpenses,
            Double goalAmount,
            Boolean overGoal,
            String periodType,
            Double remainingAmount
    ) {
        this.totalExpenses = totalExpenses;
        this.goalAmount = goalAmount;
        this.overGoal = overGoal;
        this.periodType = periodType;
        this.remainingAmount = remainingAmount;
    }

    // ===== Dashboard Getters =====
    public Double getToday() {
        return today;
    }

    public Double getYesterday() {
        return yesterday;
    }

    public Double getLast7Days() {
        return last7Days;
    }

    public Double getLast30Days() {
        return last30Days;
    }

    public Double getCurrentYear() {
        return currentYear;
    }

    public Double getTotal() {
        return total;
    }

    // ===== Goal Getters =====
    public Double getTotalExpenses() {
        return totalExpenses;
    }

    public Double getGoalAmount() {
        return goalAmount;
    }

    public Boolean getOverGoal() {
        return overGoal;
    }

    public String getPeriodType() {
        return periodType;
    }

    public Double getRemainingAmount() {
        return remainingAmount;
    }

    public void setGoalAmount(Double goalAmount) {
    this.goalAmount = goalAmount;
}

public void setTotalExpenses(Double totalExpenses) {
    this.totalExpenses = totalExpenses;
}

public void setRemainingAmount(Double remainingAmount) {
    this.remainingAmount = remainingAmount;
}

public void setOverGoal(Boolean overGoal) {
    this.overGoal = overGoal;
}

public void setPeriodType(String periodType) {
    this.periodType = periodType;
}
}