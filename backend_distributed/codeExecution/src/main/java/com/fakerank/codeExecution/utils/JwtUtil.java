package com.fakerank.codeExecution.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fakerank.codeExecution.models.User;
import com.fakerank.codeExecution.models.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class JwtUtil {

    @Autowired
    private UserRepository userRepository;
    public User parseToken(String token) {

        DecodedJWT jwt = JWT.decode(token);
        try {
            String user_id = jwt.getClaim("sub").asString().substring(6);
            return userRepository.findById(UUID.fromString(user_id)).get();
        } catch (JwtException | NoSuchElementException e) {
            return null;
        }
    }
}