package com.expensetracker.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
 import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.expensetracker.backend.security.JwtFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

import java.util.List;

@Configuration
@EnableWebSecurity(debug = true) // enable temporarily to see matcher decisions
public class WebSecurityConfig {

    @Autowired
private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            // Ignore CSRF for all REST API endpoints to avoid 403 on POST/PUT/DELETE during local dev
            .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"))
            .authorizeHttpRequests(auth -> auth
                // Auth endpoints
                .requestMatchers("/api/auth/**").permitAll()
                // Controller base paths (plural) exactly as in your code
                .requestMatchers(
                    "/api/incomes/**",
                    "/api/expenses/**",
                    "/api/goals/**",
                    "/api/dashboard/**",
                    "/api/summary/**"
                ).permitAll()
    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
    .anyRequest().permitAll()
            )
            .formLogin().disable()
            .httpBasic().disable();

            http.addFilterBefore(
        jwtFilter,
        UsernamePasswordAuthenticationFilter.class
);

        return http.build();
    }

   @Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();

    config.setAllowedOrigins(List.of("http://localhost:3000"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    config.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration("/**", config);
    return source;
}

@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
}
