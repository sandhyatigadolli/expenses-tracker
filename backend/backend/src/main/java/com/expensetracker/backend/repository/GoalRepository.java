package com.expensetracker.backend.repository;

import com.expensetracker.backend.model.Goal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByUserId(Long userId);

    List<Goal> findByUserIdAndPeriod(Long userId, String period);

    List<Goal> findByPeriod(String period);

    List<Goal> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(
            LocalDate start,
            LocalDate end
    );

    Optional<Goal> findByUserIdAndPeriodAndStartDateAndEndDate(
        Long userId,
        String period,
        LocalDate startDate,
        LocalDate endDate
);

       Optional<Goal>findTopByUserIdOrderByIdDesc(
        Long userId
);

}
