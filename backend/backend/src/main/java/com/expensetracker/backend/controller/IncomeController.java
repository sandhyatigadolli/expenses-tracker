package com.expensetracker.backend.controller;

import com.expensetracker.backend.model.Income;
import com.expensetracker.backend.service.IncomeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
@CrossOrigin(origins = "http://localhost:3000")
public class IncomeController {

    @Autowired
    private IncomeService incomeService;

    // Get incomes by user
    @GetMapping("/user/{userId}")
    public List<Income> getIncomesByUser(
            @PathVariable Long userId) {

        return incomeService.getIncomesByUser(userId);
    }

    // Add income
    @PostMapping
    public Income addIncome(
            @RequestBody Income income) {

        return incomeService.addIncome(income);
    }

    // Update income
    @PutMapping("/{id}")
    public Income updateIncome(
            @PathVariable Long id,
            @RequestBody Income incomeDetails) {

        return incomeService.updateIncome(
                id,
                incomeDetails
        );
    }

    // Delete income
    @DeleteMapping("/{id}")
    public String deleteIncome(
            @PathVariable Long id) {

        incomeService.deleteIncome(id);

        return "Income deleted successfully";
    }
}