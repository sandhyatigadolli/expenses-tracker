package com.expensetracker.backend.service;

import com.expensetracker.backend.model.Goal;
import com.expensetracker.backend.model.Income;
import com.expensetracker.backend.repository.GoalRepository;
import com.expensetracker.backend.repository.IncomeRepository;
import com.expensetracker.backend.repository.ExpenseRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;

   public GoalService(
    GoalRepository goalRepository,
    IncomeRepository incomeRepository,
    ExpenseRepository expenseRepository
) {

    this.goalRepository =
            goalRepository;

    this.incomeRepository =
            incomeRepository;

    this.expenseRepository =
            expenseRepository;
}

    public Goal saveGoal(Goal goal) {

    Income latestIncome =
            incomeRepository
            .findTopByUserIdOrderByIdDesc(
                    goal.getUserId()
            );

    if (
    goal.getPeriod() == null ||
    goal.getPeriod().isBlank()
) {

    goal.setPeriod(
            latestIncome.getPeriod()
    );

    goal.setStartDate(
            latestIncome.getStartDate()
    );

    goal.setEndDate(
            latestIncome.getEndDate()
    );
}

    Double totalExpense =
            expenseRepository
            .sumExpensesByBudgetPeriod(
                    goal.getUserId(),
                    goal.getStartDate(),
                    goal.getEndDate()
                            .plusDays(1)
            );

    totalExpense =
            totalExpense != null
                    ? totalExpense
                    : 0.0;

    if (
        goal.getAmount()
        <= totalExpense
    ) {

        throw new RuntimeException(
            "Goal amount must be greater than total expenses (₹"
            + totalExpense +
            ")"
        );
    }

    return goalRepository.save(goal);
}

   public List<Goal> getGoalsByUser(Long userId) {
    return goalRepository.findByUserId(userId);
}


public Goal getGoalForPeriod(
        Long userId,
        String period,
        LocalDate startDate,
        LocalDate endDate
) {

    return goalRepository
            .findByUserIdAndPeriodAndStartDateAndEndDate(
                    userId,
                    period,
                    startDate,
                    endDate
            )
            .orElse(null);
}

    // Get a goal by id
  public Optional<Goal> getGoal(Long userId, String period) {
    return goalRepository
            .findByUserIdAndPeriod(userId, period)
            .stream()
            .findFirst();
}
    // Get all goals for a given period
    public List<Goal> getGoalsByPeriod(String period) {
        return goalRepository.findByPeriod(period);
    }

    public Goal updateGoal(Long id, Goal goalDetails) {

    return goalRepository.findById(id).map(goal -> {

        goal.setAmount(goalDetails.getAmount());
        goal.setPeriod(goalDetails.getPeriod());
        goal.setStartDate(goalDetails.getStartDate());
        goal.setEndDate(goalDetails.getEndDate());
        goal.setUserId(goalDetails.getUserId());

        return goalRepository.save(goal);

    }).orElseThrow(() -> new RuntimeException("Goal not found"));
}


    public List<Goal> getGoalsWithinDateRange(LocalDate start, LocalDate end) {
        return goalRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(start, end);
    }

    
    public void deleteGoal(Long id) {

    if (!goalRepository.existsById(id)) {
        throw new RuntimeException(
            "Goal not found"
        );
    }

    goalRepository.deleteById(id);
}
}
