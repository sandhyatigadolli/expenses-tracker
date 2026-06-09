package com.expensetracker.backend.service;

import com.expensetracker.backend.model.Income;
import com.expensetracker.backend.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    // Get incomes by user
    public List<Income> getIncomesByUser(Long userId) {
        return incomeRepository.findByUserId(userId);
    }

    // Add income
    public Income addIncome(Income income) {
        return incomeRepository.save(income);
    }

    public Income updateIncome(Long id, Income incomeDetails) {

        Optional<Income> optionalIncome =
                incomeRepository.findById(id);

        if (optionalIncome.isPresent()) {

            Income income = optionalIncome.get();

            income.setAmount(incomeDetails.getAmount());
            income.setIncomeType(incomeDetails.getIncomeType());
            income.setPeriod(incomeDetails.getPeriod());
            income.setStartDate(incomeDetails.getStartDate());
            income.setEndDate(incomeDetails.getEndDate());

            return incomeRepository.save(income);
        }

        throw new RuntimeException("Income not found");
    }

    // Delete income
    public void deleteIncome(Long id) {
        incomeRepository.deleteById(id);
    }
}