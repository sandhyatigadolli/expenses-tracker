
package com.expensetracker.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.backend.dto.DashboardSummaryDto;
import com.expensetracker.backend.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // ===== SUMMARY =====
    @GetMapping("/summary/{userId}")
    public DashboardSummaryDto getSummary(@PathVariable Long userId) {
        return dashboardService.getSummary(userId);
    }

    // ===== DAILY =====
    @GetMapping("/daily/{userId}")
    public List<Object[]> getDailyChart(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "2025-01-01") String sinceDate
    ) {
        LocalDate since = LocalDate.parse(sinceDate);
        return dashboardService.getDailyChart(userId, since);
    }

    // ===== CATEGORY =====
    @GetMapping("/category/{userId}")
    public List<Object[]> getCategoryChart(
            @PathVariable Long userId,
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return dashboardService.getCategoryChart(userId, start, end);
    }

    // ===== MONTHLY (NEW) =====
    @GetMapping("/monthly/{userId}")
    public List<Object[]> getMonthlyChart(
            @PathVariable Long userId,
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return dashboardService.getMonthlyChart(userId, start, end);
    }

    // ===== YEARLY =====
@GetMapping("/yearly/{userId}")
public List<Object[]> getYearlyChart(

        @PathVariable Long userId,

        @RequestParam String startDate,

        @RequestParam String endDate
) {

    LocalDate start =
            LocalDate.parse(
                    startDate
            );

    LocalDate end =
            LocalDate.parse(
                    endDate
            );

    return dashboardService
            .getYearlyChart(
                    userId,
                    start,
                    end
            );
}
}