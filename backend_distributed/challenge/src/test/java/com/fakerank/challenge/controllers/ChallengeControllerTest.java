package com.fakerank.challenge.controllers;

import com.fakerank.challenge.TestSecurityConfig;
import com.fakerank.challenge.models.*;
import com.fakerank.challenge.utils.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.Instant;
import java.util.*;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ChallengeController.class)
@Import(TestSecurityConfig.class)
public class ChallengeControllerTest {

    String TOKEN = "token";

    @Autowired
    MockMvc mockMvc;
    @Autowired
    ObjectMapper mapper;

    @MockBean
    ChallengeRepository challengeRepository;

    @MockBean
    ExerciseRepository exerciseRepository;

    @MockBean
    UserRepository userRepository;

    @MockBean
    JwtUtil jwtUtil;

    User USER_1 = new User("Mario", "mario@mail.com", "mario1234", true, new Date());
    User USER_2 = new User("Luigi", "luigi@mail.com", "luigi1234", true, new Date());

    List<User> USERS = new ArrayList<>(Arrays.asList(USER_1, USER_2));

    Challenge CHALLENGE_1 = new Challenge("challenge_1", Date.from(Instant.now()), Date.from(Instant.now()), USER_1, "12345");
    Challenge CHALLENGE_2 = new Challenge("challenge_2", Date.from(Instant.now()), Date.from(Instant.now()), USER_1, "12345");
    Challenge CHALLENGE_3 = new Challenge("challenge_3", Date.from(Instant.now()), Date.from(Instant.now()), USER_2, "12345");

    List<Challenge> CHALLENGES = new ArrayList<>(Arrays.asList(CHALLENGE_1, CHALLENGE_2, CHALLENGE_3));

    @BeforeEach
     public void setUp(){
        ReflectionTestUtils.setField(CHALLENGE_1, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(CHALLENGE_2, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(CHALLENGE_3, "id", UUID.randomUUID());

        ReflectionTestUtils.setField(USER_1, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(USER_2, "id", UUID.randomUUID());

        Mockito.when(challengeRepository.findAll()).thenReturn(CHALLENGES);
        Mockito.when(userRepository.findAll()).thenReturn(USERS);

        Mockito.when(jwtUtil.parseToken(TOKEN)).thenReturn(USER_1);
        Mockito.when(userRepository.findById(USER_1.getId())).thenReturn(Optional.of(USER_1));
        Mockito.when(userRepository.findById(USER_2.getId())).thenReturn(Optional.of(USER_2));

        Mockito.when(challengeRepository.findById(CHALLENGE_1.getId())).thenReturn(Optional.of(CHALLENGE_1));
        Mockito.when(challengeRepository.findById(CHALLENGE_2.getId())).thenReturn(Optional.of(CHALLENGE_2));
        Mockito.when(challengeRepository.findById(CHALLENGE_3.getId())).thenReturn(Optional.of(CHALLENGE_3));


        Mockito.when(jwtUtil.parseToken(TOKEN)).thenReturn(USER_1);
    }

    @Test
    public void getAllChallenges_success() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/challenges")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
        //.andExpect(jsonPath("$[2].name", is("Jane Doe")));
    }
    @Test
    public void getChallenge_success() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/challenges/"+CHALLENGE_1.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(CHALLENGE_1.getId().toString()));
    }


    @Test
    public void deleteChallenge_success() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/api/challenges/" + CHALLENGE_1.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful());
    }

    @Test
    public void deleteChallenge_forbidden() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/api/challenges/"+CHALLENGE_3.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }
}
