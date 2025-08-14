package com.expensetracker.backend.controller;

import com.expensetracker.backend.model.Income;
import com.expensetracker.backend.repository.IncomeRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/income")
@CrossOrigin(origins = "http://localhost:3000")
public class IncomeController {

    @Autowired
    private IncomeRepository incomeRepository;

    @PostMapping
    public Income addIncome(@RequestBody Income income) {
        return incomeRepository.save(income);
    }

    @GetMapping
    public List<Income> getAllIncome() {
        return incomeRepository.findAll();
    }

    @PutMapping("/{id}")
    public Income updateIncome(@PathVariable Long id, @RequestBody Income updatedIncome) {
        Income income = incomeRepository.findById(id).orElseThrow();
        income.setAmount(updatedIncome.getAmount());
        return incomeRepository.save(income);
    }

    @DeleteMapping("/{id}")
    public void deleteIncome(@PathVariable Long id) {
        incomeRepository.deleteById(id);
    }
}
