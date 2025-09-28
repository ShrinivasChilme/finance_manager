package com.example.moneymanager.security;

import java.security.Key;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    private Key getSigningKey() {
        // Ensure the secret is at least 32 characters for HS256
        if (jwtSecret.length() < 32) {
            // Pad the secret to meet minimum requirement
            StringBuilder paddedSecret = new StringBuilder(jwtSecret);
            while (paddedSecret.length() < 32) {
                paddedSecret.append("0");
            }
            return Keys.hmacShaKeyFor(paddedSecret.toString().getBytes());
        }
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(String username) {
        try {
            return Jwts.builder()
                    .setSubject(username)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                    .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            logger.error("Error generating token for user {}: {}", username, e.getMessage());
            throw new RuntimeException("Token generation failed", e);
        }
    }

    public String getUsernameFromToken(String token) {
        try {
            if (!isValidTokenFormat(token)) {
                logger.warn("Invalid token format");
                return null;
            }

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            return claims.getSubject();
            
        } catch (ExpiredJwtException e) {
            logger.warn("JWT token expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.warn("Unsupported JWT token: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.warn("Malformed JWT token: {}", e.getMessage());
        } catch (SignatureException e) {
            logger.warn("Invalid JWT signature: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.warn("JWT claims string is empty: {}", e.getMessage());
        } catch (Exception e) {
            logger.warn("Error parsing JWT token: {}", e.getMessage());
        }
        return null;
    }

    public boolean validateToken(String token) {
        try {
            if (!isValidTokenFormat(token)) {
                return false;
            }

            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
            
        } catch (ExpiredJwtException e) {
            logger.warn("JWT token expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.warn("Unsupported JWT token: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.warn("Malformed JWT token: {}", e.getMessage());
        } catch (SignatureException e) {
            logger.warn("Invalid JWT signature: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.warn("JWT claims string is empty: {}", e.getMessage());
        } catch (Exception e) {
            logger.warn("Invalid JWT token: {}", e.getMessage());
        }
        return false;
    }

    private boolean isValidTokenFormat(String token) {
        if (token == null || token.trim().isEmpty()) {
            logger.debug("Token is null or empty");
            return false;
        }
        
        // Check if token has exactly 2 dots (basic JWT format validation)
        long dotCount = token.chars().filter(ch -> ch == '.').count();
        if (dotCount != 2) {
            logger.debug("Invalid JWT format - expected 2 dots, found: {}", dotCount);
            return false;
        }
        
        // Check if token has three parts separated by dots
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            logger.debug("Invalid JWT structure - expected 3 parts, found: {}", parts.length);
            return false;
        }
        
        return true;
    }
}