package com.example.moneymanager.security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@Order(0)
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String method = request.getMethod();
        String path = request.getRequestURI();
        String origin = request.getHeader("Origin");
        String acrMethod = request.getHeader("Access-Control-Request-Method");
        String acrHeaders = request.getHeader("Access-Control-Request-Headers");

        if ("OPTIONS".equalsIgnoreCase(method) || origin != null) {
            logger.info("Incoming request: method={} path={} origin={} ACR-Method={} ACR-Headers={} remote={}",
                    method, path, origin, acrMethod, acrHeaders, request.getRemoteAddr());
        }

        filterChain.doFilter(request, response);
    }
}
