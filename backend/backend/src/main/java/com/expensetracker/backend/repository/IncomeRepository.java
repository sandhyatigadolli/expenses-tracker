package com.expensetracker.backend.repository;

import com.expensetracker.backend.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncomeRepository extends JpaRepository<Income, Long> {
}
