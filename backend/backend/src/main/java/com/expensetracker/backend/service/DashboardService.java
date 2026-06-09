

package com.expensetracker.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.expensetracker.backend.dto.DashboardSummaryDto;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.model.Goal;
import com.expensetracker.backend.repository.GoalRepository;
import java.util.Optional;

@Service
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final GoalRepository goalRepository;

   public DashboardService(
        ExpenseRepository expenseRepository,
        GoalRepository goalRepository
) {
    this.expenseRepository = expenseRepository;
    this.goalRepository = goalRepository;
}
    // ================= SUMMARY =================
    public DashboardSummaryDto getSummary(Long userId) {
        LocalDate today =
        LocalDate.now();

// ===== WEEKLY =====
// ===== LAST 7 DAYS =====
Double last7DaysTotal =
        safeSum(
                userId,
                today.minusDays(6),
                today
        );

// ===== MONTHLY =====
LocalDate monthStart =
        today.withDayOfMonth(1);

LocalDate monthEnd =
        today.withDayOfMonth(
                today.lengthOfMonth()
        );

Double last30DaysTotal =
        expenseRepository
                .sumExpensesByPeriod(
                        userId,
                        "Monthly",
                        monthStart,
                        monthEnd
                );

// ===== YEARLY =====
Double currentYearTotal =
        safeSum(
                userId,
                today.withDayOfYear(1),
                today
        );

// ===== TODAY =====
// ===== TODAY =====
Double todayTotal =
        expenseRepository
                .sumExpensesForToday(
                        userId,
                        today
                );

// ===== YESTERDAY =====
Double yesterdayTotal =
        safeSum(
                userId,
                today.minusDays(1),
                today.minusDays(1)
        );

// ===== TOTAL =====
Double allTimeTotal =
        safeSum(
                userId,
                LocalDate.of(1970,1,1),
                today
        );

        // ===== GOAL =====
Optional<Goal> latestGoal =
        goalRepository
                .findTopByUserIdOrderByIdDesc(userId);

Double goalAmount = 0.0;
Double totalExpenses = allTimeTotal;
Double remainingAmount = 0.0;
Boolean overGoal = false;
String periodType = null;

if (latestGoal.isPresent()) {

    Goal goal = latestGoal.get();

    goalAmount = goal.getAmount();
periodType = goal.getPeriod();

totalExpenses =
        periodType.equalsIgnoreCase("Weekly")
        ? last7DaysTotal
        : last30DaysTotal;

remainingAmount =
        goalAmount - totalExpenses;

overGoal =
        totalExpenses > goalAmount;
}

// ===== RETURN DTO =====
DashboardSummaryDto dto =
        new DashboardSummaryDto(
                todayTotal,
                yesterdayTotal,
                last7DaysTotal,
                last30DaysTotal,
                currentYearTotal,
                allTimeTotal
        );

dto.setGoalAmount(goalAmount);
dto.setTotalExpenses(totalExpenses);
dto.setRemainingAmount(remainingAmount);
dto.setOverGoal(overGoal);
dto.setPeriodType(periodType);

return dto;
   
}

    // ================= DAILY CHART =================
   public List<Object[]> getDailyChart(
        Long userId,
        LocalDate since
) {

    LocalDate today =
            LocalDate.now();

    List<Object[]> results =
            expenseRepository
                    .dailyTotalsBetween(
                            userId,
                            since,
                            today.plusDays(1)
                    );

    return results != null
            ? results
            : List.of();
}
    

    // ================= CATEGORY CHART =================
    public List<Object[]> getCategoryChart(Long userId,
                                           LocalDate start,
                                           LocalDate endInclusive) {

        List<Object[]> results =
                expenseRepository.categoryTotalsBetweenExclusive(
                        userId,
                        start,
                        endInclusive.plusDays(1)
                );

        return results != null ? results : List.of();
    }

    // ================= MONTHLY CHART (NEW) =================
    public List<Object[]> getMonthlyChart(Long userId,
                                          LocalDate start,
                                          LocalDate endInclusive) {

        List<Object[]> results =
                expenseRepository.monthlyTotalsBetween(
                        userId,
                        start,
                        endInclusive.plusDays(1)
                );

        return results != null ? results : List.of();
    }

    // ================= YEARLY CHART =================
public List<Object[]> getYearlyChart(
        Long userId,
        LocalDate start,
        LocalDate endInclusive
) {

    List<Object[]> results =
            expenseRepository
                    .monthlyTotalsBetween(
                            userId,
                            start,
                            endInclusive.plusDays(1)
                    );

    return results != null
            ? results
            : List.of();
}

    // ================= SAFE SUM =================
    private Double safeSum(Long userId,
                           LocalDate startInclusive,
                           LocalDate endInclusive) {

        Double value =
                expenseRepository.sumExpensesByExpenseDate(
                        userId,
                        startInclusive,
                        endInclusive.plusDays(1)
                );

        return value != null ? value : 0.0;
    }
}