package com.expensetracker.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import java.time.LocalDate;

@Entity
public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;
    private String description;
    private String incomeType;  // new field
    private String period;      // new field
    private LocalDate startDate;
    private LocalDate endDate;
    

    public Income() {}

  public Income(
        Double amount,
        String description,
        String incomeType,
        String period,
        LocalDate startDate,
        LocalDate endDate) {

    this.amount = amount;
    this.description = description;
    this.incomeType = incomeType;
    this.period = period;
    this.startDate = startDate;
    this.endDate = endDate;
}

    @Column(name = "user_id")
private Long userId;

  public Long getId() {
    return id;
}

public void setId(Long id) {
    this.id = id;
}

    public Long getUserId() { return userId; }
public void setUserId(Long userId) { this.userId = userId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getDescription() {
    return description;
}

public void setDescription(String description) {
    this.description = description;
}

    public String getIncomeType() { return incomeType; }
    public void setIncomeType(String incomeType) { this.incomeType = incomeType; }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
}
