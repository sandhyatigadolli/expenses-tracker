package com.expensetracker.backend.repository;

import com.expensetracker.backend.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;   // ⭐ THIS WAS MISSING

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {

    Income findTopByOrderByIdDesc();

    List<Income> findByUserId(Long userId);

    Income findTopByUserIdOrderByIdDesc(Long userId);
}