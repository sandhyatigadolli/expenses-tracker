package com.expensetracker.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.model.Income;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.repository.GoalRepository;
import com.expensetracker.backend.repository.IncomeRepository;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final GoalRepository goalRepository;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            IncomeRepository incomeRepository,
            GoalRepository goalRepository
    ) {

        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        this.goalRepository = goalRepository;
    }

    // ================= ADD EXPENSE =================
    public Expense addExpense(Expense expense) {

        // Validate user
        if (expense.getUserId() == null) {
            throw new RuntimeException(
                    "User ID is required"
            );
        }

        // Ensure dashboard date exists
        if (expense.getDate() == null) {

    if (expense.getStartDate() != null) {

        expense.setDate(
                expense.getStartDate()
        );

    } else {

        expense.setDate(
                LocalDate.now()
        );
    }
}

        // Auto-sync with latest income
        Income latestIncome =
                incomeRepository
                        .findTopByUserIdOrderByIdDesc(
                                expense.getUserId()
                        );

        if (
    expense.getPeriod() == null ||
    expense.getPeriod().isBlank()
) {

//     expense.setPeriod(
//             latestIncome.getPeriod()
//     );

//     expense.setStartDate(
//             latestIncome.getStartDate()
//     );

//     expense.setEndDate(
//             latestIncome.getEndDate()
//     );
}

        return expenseRepository.save(expense);
    }

    // ================= GET ALL EXPENSES =================
    public List<Expense> getAllExpensesForUser(
            Long userId
    ) {
        return expenseRepository.findByUserId(
                userId
        );
    }

    // ================= TOTAL EXPENSES =================
    public Double getTotalExpensesForPeriod(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    ) {

        Double total =
                expenseRepository
                        .sumExpensesByBudgetPeriod(
                                userId,
                                startDate,
                                endDate.plusDays(1)
                        );

        return total != null
                ? total
                : 0.0;
    }

    // ================= UPDATE EXPENSE =================
    public Expense updateExpense(
            Long id,
            Expense expenseDetails
    ) {

        return expenseRepository
                .findById(id)
                .map(expense -> {

                    expense.setAmount(
                            expenseDetails.getAmount()
                    );

                    expense.setExpenseType(
                            expenseDetails.getExpenseType()
                    );

                    expense.setDescription(
                            expenseDetails.getDescription()
                    );


                    expense.setPeriod(
        expenseDetails.getPeriod()
);

expense.setStartDate(
        expenseDetails.getStartDate()
);

expense.setEndDate(
        expenseDetails.getEndDate()
);

                    // Preserve date
                    expense.setDate(
                            expenseDetails.getDate() != null
                                    ? expenseDetails.getDate()
                                    : expense.getDate()
                    );

                    

                    return expenseRepository
                            .save(expense);

                }).orElseThrow(() ->
                        new RuntimeException(
                                "Expense not found with id: "
                                        + id
                        )
                );
    }

    // ================= DELETE =================
    public void deleteExpense(Long id) {

        if (!expenseRepository.existsById(id)) {
            throw new RuntimeException(
                    "Expense not found with id: "
                            + id
            );
        }

        expenseRepository.deleteById(id);
    }
}