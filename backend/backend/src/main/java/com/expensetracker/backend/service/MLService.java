package com.expensetracker.backend.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class MLService {
    private static final String PYTHON_API_URL = "http://localhost:8000";

    public Double getSuggestedGoal(Long userId, List<Double> expenses) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("user_id", userId);
        requestBody.put("expenses", expenses);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
            PYTHON_API_URL + "/predict-goal",
            request,
            Map.class
        );

        if (response.getBody() != null && response.getBody().containsKey("suggested_goal")) {
            return Double.valueOf(response.getBody().get("suggested_goal").toString());
        }
        return null;
    }

    public Map<String, Object> detectAnomaly(Long userId, List<Double> expenses) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("user_id", userId);
        requestBody.put("expenses", expenses);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
            PYTHON_API_URL + "/detect-anomaly",
            request,
            Map.class
        );

        if (response.getBody() != null) {
            return response.getBody();
        }
        return Map.of();
    }
}
