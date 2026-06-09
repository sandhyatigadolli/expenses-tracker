package com.expensetracker.backend.controller;

import org.springframework.web.bind.annotation.*;

import com.expensetracker.backend.service.ExpenseService;
import com.expensetracker.backend.service.MLService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ml")
public class MLController {

    private final MLService mlService;
    private final ExpenseService expenseService;

    public MLController(MLService mlService, ExpenseService expenseService) {
        this.mlService = mlService;
        this.expenseService = expenseService;
    }

    @GetMapping("/suggested-goal")
    public Double getSuggestedGoal(@RequestParam Long userId) {
        List<Double> expenses = expenseService.getAllExpensesForUser(userId)
                .stream()
                .map(e -> e.getAmount())
                .collect(Collectors.toList());
        return mlService.getSuggestedGoal(userId, expenses);
    }

    @GetMapping("/detect-anomaly")
    public Map<String, Object> detectAnomaly(@RequestParam Long userId) {
        List<Double> expenses = expenseService.getAllExpensesForUser(userId)
                .stream()
                .map(e -> e.getAmount())
                .collect(Collectors.toList());
        return mlService.detectAnomaly(userId, expenses);
    }
}
