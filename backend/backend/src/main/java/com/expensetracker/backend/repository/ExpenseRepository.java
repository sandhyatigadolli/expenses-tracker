package com.expensetracker.backend.repository;

import com.expensetracker.backend.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

   
    List<Expense> findByUserId(Long userId);

    
@Query("""
       SELECT COALESCE(SUM(e.amount), 0)
       FROM Expense e
       WHERE e.userId = :userId
         AND e.startDate >= :start
         AND e.endDate <= :endExclusive
       """)
Double sumExpensesByBudgetPeriod(
        @Param("userId") Long userId,
        @Param("start") LocalDate start,
        @Param("endExclusive")
        LocalDate endExclusive
);

@Query("""
       SELECT COALESCE(SUM(e.amount), 0)
       FROM Expense e
       WHERE e.userId = :userId
         AND e.startDate <= :endExclusive
         AND e.endDate >= :start
       """)
Double sumExpensesByExpenseDate(
        @Param("userId") Long userId,
        @Param("start") LocalDate start,
        @Param("endExclusive") LocalDate endExclusive
);

@Query("""
       SELECT COALESCE(SUM(e.amount), 0)
       FROM Expense e
       WHERE e.userId = :userId
         AND e.period = :period
         AND e.startDate <= :endDate
         AND e.endDate >= :startDate
       """)
Double sumExpensesByPeriod(

        @Param("userId")
        Long userId,

        @Param("period")
        String period,

        @Param("startDate")
        LocalDate startDate,

        @Param("endDate")
        LocalDate endDate
);

    @Query("""
           SELECT e.date, COALESCE(SUM(e.amount), 0)
           FROM Expense e
           WHERE e.userId = :userId 
             AND e.date >= :since
           GROUP BY e.date
           ORDER BY e.date ASC
           """)
    List<Object[]> dailyTotalsSince(@Param("userId") Long userId,
                                    @Param("since") LocalDate since);



@Query(value = """
    SELECT
        DATE_FORMAT(MIN(e.date),'%Y-%m') AS month,
        SUM(e.amount) AS total
    FROM expenses e
    WHERE e.user_id = :userId
      AND e.date >= :startDate
      AND e.date < :endDate
    GROUP BY YEAR(e.date), MONTH(e.date)
    ORDER BY YEAR(e.date), MONTH(e.date)
""", nativeQuery = true)
List<Object[]> monthlyTotalsBetween(
        Long userId,
        LocalDate startDate,
        LocalDate endDate
);

  
    @Query("""
           SELECT e.expenseType, COALESCE(SUM(e.amount), 0)
           FROM Expense e
           WHERE e.userId = :userId
             AND e.date >= :start
             AND e.date < :endExclusive
           GROUP BY e.expenseType
           ORDER BY SUM(e.amount) DESC
           """)
    List<Object[]> categoryTotalsBetweenExclusive(@Param("userId") Long userId,
                                                  @Param("start") LocalDate start,
                                                  @Param("endExclusive") LocalDate endExclusive);

  @Query("""
       SELECT COALESCE(SUM(e.amount), 0)
       FROM Expense e
       WHERE e.userId = :userId
         AND :today BETWEEN e.startDate AND e.endDate
       """)
Double sumExpensesForToday(

        @Param("userId")
        Long userId,

        @Param("today")
        LocalDate today
);

@Query("""
       SELECT e.date,
              COALESCE(SUM(e.amount),0)
       FROM Expense e
       WHERE e.userId = :userId
         AND e.startDate <= :endDate
         AND e.endDate >= :startDate
       GROUP BY e.date
       ORDER BY e.date ASC
       """)
List<Object[]> dailyTotalsBetween(

        @Param("userId")
        Long userId,

        @Param("startDate")
        LocalDate startDate,

        @Param("endDate")
        LocalDate endDate
);
}
