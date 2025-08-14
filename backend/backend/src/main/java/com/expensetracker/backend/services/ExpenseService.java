package com.expensetracker.backend.service;

import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public Expense updateExpense(Long id, Expense updatedExpense) {
        Expense existing = expenseRepository.findById(id).orElseThrow();
        existing.setAmount(updatedExpense.getAmount());
        existing.setDescription(updatedExpense.getDescription());
        return expenseRepository.save(existing);
    }
}
