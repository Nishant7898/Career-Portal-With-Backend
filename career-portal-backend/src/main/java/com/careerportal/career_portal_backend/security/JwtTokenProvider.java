package com.careerportal.career_portal_backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt-secret}")
    private String jwtSecret;

    @Value("${app.jwt-expiration-milliseconds}")
    private long jwtExpirationDate;

    // Helper method to get the signing key
    private Key key(){
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    // Generate JWT token from user authentication
    public String generateToken(Authentication authentication){
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);

        // Extract user roles/authorities
        String roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        String token = Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .claim("authorities", authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()))
                .setIssuedAt(new Date())
                .setExpiration(expireDate)
                .signWith(key())
                .compact();
        return token;
    }

    // Get username from JWT token
    public String getUsername(String token){
        String cleanToken = token != null ? token.trim() : null;
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(cleanToken)
                .getBody();
        return claims.getSubject();
    }

    // Get roles from JWT token
    public String getRoles(String token){
        String cleanToken = token != null ? token.trim() : null;
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(cleanToken)
                .getBody();
        return claims.get("roles", String.class);
    }

    // Validate JWT token
    public boolean validateToken(String token){
        try{
            // Clean the token of any extra whitespace
            String cleanToken = token != null ? token.trim() : null;
            if (cleanToken == null || cleanToken.isEmpty()) {
                return false;
            }
            Jwts.parserBuilder().setSigningKey(key()).build().parse(cleanToken);
            return true;
        } catch (MalformedJwtException ex){
            System.err.println("Invalid JWT token: " + ex.getMessage());
        } catch (ExpiredJwtException ex){
            System.err.println("JWT token is expired: " + ex.getMessage());
        } catch (UnsupportedJwtException ex){
            System.err.println("JWT token is unsupported: " + ex.getMessage());
        } catch (IllegalArgumentException ex){
            System.err.println("JWT claims string is empty: " + ex.getMessage());
        } catch (Exception ex){
            System.err.println("JWT token validation error: " + ex.getMessage());
        }
        return false;
    }
}