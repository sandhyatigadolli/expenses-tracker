package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.DashboardSummaryDto;
import com.expensetracker.backend.model.Goal;
import com.expensetracker.backend.service.ExpenseService;
import com.expensetracker.backend.service.GoalService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.Optional;

@RestController
@RequestMapping("/api/summary")
@CrossOrigin(origins = "http://localhost:3000") // ✅ keep but can be externalized later
public class SummaryController {

    private final ExpenseService expenseService;
    private final GoalService goalService;

    public SummaryController(ExpenseService expenseService, GoalService goalService) {
        this.expenseService = expenseService;
        this.goalService = goalService;
    }

   @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<?> getSummary(
        @RequestParam Long userId,
        @RequestParam String type
) {

    LocalDate start;
    LocalDate end;

    switch (type.toUpperCase()) {

        case "WEEKLY" -> {
            start = LocalDate.now()
                    .with(java.time.DayOfWeek.MONDAY);

            end = start.plusDays(6);
        }

        case "MONTHLY" -> {
            start = LocalDate.now()
                    .with(
                        TemporalAdjusters
                                .firstDayOfMonth()
                    );

            end = LocalDate.now()
                    .with(
                        TemporalAdjusters
                                .lastDayOfMonth()
                    );
        }

        default -> {

            return ResponseEntity
                    .badRequest()
                    .body(
                      "Invalid type. " +
                      "Use WEEKLY or MONTHLY"
                    );
        }
    }

    // Total expenses
    Double totalExpenses =
            expenseService
                    .getTotalExpensesForPeriod(
                            userId,
                            start,
                            end
                    );

    totalExpenses =
            totalExpenses != null
            ? totalExpenses
            : 0.0;

    // Goal
    Optional<Goal> goalOpt =
            goalService
                    .getGoal(
                            userId,
                            type.toUpperCase()
                    );

    Double goalAmount =
            goalOpt
                    .map(Goal::getAmount)
                    .orElse(0.0);

    Boolean overGoal =
            totalExpenses >
            goalAmount;

    Double remainingAmount =
            Math.max(
                    goalAmount
                    - totalExpenses,
                    0
            );

    DashboardSummaryDto dto =
            new DashboardSummaryDto(
                    totalExpenses,
                    goalAmount,
                    overGoal,
                    type.toUpperCase(),
                    remainingAmount
            );

    return ResponseEntity.ok(dto);
}
}
