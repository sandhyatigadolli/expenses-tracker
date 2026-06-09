package com.expensetracker.backend.controller;

import com.expensetracker.backend.model.Goal;
import com.expensetracker.backend.service.GoalService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:3000") 
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

   
    @PostMapping
    public ResponseEntity<Goal> createGoal(@RequestBody Goal goal) {
        return ResponseEntity.ok(goalService.saveGoal(goal));
    }

   @GetMapping("/user/{userId}")
public ResponseEntity<List<Goal>> getGoalsByUser(@PathVariable Long userId) {
    return ResponseEntity.ok(goalService.getGoalsByUser(userId));
}

   
    @GetMapping("/period/{period}")
    public ResponseEntity<List<Goal>> getGoalsByPeriod(@PathVariable String period) {
        return ResponseEntity.ok(goalService.getGoalsByPeriod(period));
    }

    @GetMapping("/user/{userId}/period")
public ResponseEntity<Goal> getGoalForPeriod(

        @PathVariable Long userId,

        @RequestParam String period,

        @RequestParam LocalDate startDate,

        @RequestParam LocalDate endDate
) {

    return ResponseEntity.ok(

            goalService.getGoalForPeriod(
                    userId,
                    period,
                    startDate,
                    endDate
            )
    );
}

    
    @GetMapping("/range")
    public ResponseEntity<List<Goal>> getGoalsByDateRange(
            @RequestParam("start") String start,
            @RequestParam("end") String end) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return ResponseEntity.ok(goalService.getGoalsWithinDateRange(startDate, endDate));
    }


    @PutMapping("/{id}")
public ResponseEntity<Goal> updateGoal(
        @PathVariable Long id,
        @RequestBody Goal goal) {

    Goal updated = goalService.updateGoal(id, goal);
    return ResponseEntity.ok(updated);
}


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.ok("Goal deleted successfully");
    }
}
