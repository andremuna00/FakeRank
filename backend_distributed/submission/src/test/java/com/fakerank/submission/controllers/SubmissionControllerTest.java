package com.fakerank.submission.controllers;

import com.fakerank.submission.TestSecurityConfig;
import com.fakerank.submission.models.*;
import com.fakerank.submission.utils.JwtUtil;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SubmissionController.class)
@Import(TestSecurityConfig.class)
public class SubmissionControllerTest {

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
    TestCaseRepository testCaseRepository;

    @MockBean
    SubmissionRepository submissionRepository;

    @MockBean
    ExerciseSubmissionRepository exerciseSubmissionRepository;

    @MockBean
    UserRepository userRepository;

    @MockBean
    JwtUtil jwtUtil;

    User USER_1 = new User("pippo", "pippo@mail.com", "pippo1234", true, new Date());
    User USER_2 = new User("mario_bros", "mariobros@mail.com", "mario1234", true, new Date());

    User USER_3 = new User("gino", "mariobros@mail.com", "gino1234", true, new Date());

    List<User> USERS = new ArrayList<>(Arrays.asList(USER_1, USER_2));

    Challenge CHALLENGE_1 = new Challenge("challenge_1", Date.from(Instant.now()), Date.from(Instant.now()), USER_1, "12345");
    Challenge CHALLENGE_2 = new Challenge("challenge_2", Date.from(Instant.now()), Date.from(Instant.now()), USER_1, "12345");
    Challenge CHALLENGE_3 = new Challenge("challenge_3", Date.from(Instant.now()), Date.from(Instant.now()), USER_2, "12345");

    Challenge CHALLENGE_4 = new Challenge("challenge_4", Date.from(Instant.now()), Date.from(Instant.now()), USER_3, "12345");

    List<Challenge> CHALLENGES = new ArrayList<>(Arrays.asList(CHALLENGE_1, CHALLENGE_2, CHALLENGE_3, CHALLENGE_4));

    Submission SUBMISSION_CHALLENGE_1 = new Submission(USER_2, CHALLENGE_1, new Date(), new Date(), 0);
    Submission SUBMISSION_CHALLENGE_2 = new Submission(USER_2, CHALLENGE_2, new Date(), new Date(), 0);

    Submission SUBMISSION_CHALLENGE_3 = new Submission(USER_1, CHALLENGE_3, new Date(), new Date(), 0);

    Submission SUBMISSION_CHALLENGE_4 = new Submission(USER_2, CHALLENGE_4, new Date(), new Date(), 0);

    List<Submission> SUBMISSIONS = new ArrayList<>(Arrays.asList(SUBMISSION_CHALLENGE_1, SUBMISSION_CHALLENGE_2, SUBMISSION_CHALLENGE_3, SUBMISSION_CHALLENGE_4));

    List<Exercise> EXERCISES_CHALLENGE_1 = new ArrayList<>();
    List<Exercise> EXERCISES_CHALLENGE_2 = new ArrayList<>();
    List<Exercise> EXERCISES_CHALLENGE_3 = new ArrayList<>();

    List<Exercise> EXERCISES = new ArrayList<>();

    Map<String, List<TestCase>> TEST_CASES_CHALLENGE_1 = new HashMap<>();
    Map<String, List<TestCase>> TEST_CASES_CHALLENGE_2 = new HashMap<>();
    Map<String, List<TestCase>> TEST_CASES_CHALLENGE_3 = new HashMap<>();

    List<TestCase> TEST_CASES = new ArrayList<>();

    {
        EXERCISES_CHALLENGE_1.add(new Exercise("es1_challenge1", "", "", "python", CHALLENGE_1));
        EXERCISES_CHALLENGE_1.add(new Exercise("es2_challenge1", "", "", "python", CHALLENGE_1));
        EXERCISES_CHALLENGE_1.add(new Exercise("es3_challenge1", "", "", "python", CHALLENGE_1));

        EXERCISES_CHALLENGE_2.add(new Exercise("es1_challenge2", "", "", "python", CHALLENGE_2));
        EXERCISES_CHALLENGE_2.add(new Exercise("es2_challenge2", "", "", "python", CHALLENGE_2));

        EXERCISES_CHALLENGE_3.add(new Exercise("es1_challenge3", "", "", "python", CHALLENGE_3));

        EXERCISES.addAll(EXERCISES_CHALLENGE_1);
        EXERCISES.addAll(EXERCISES_CHALLENGE_2);
        EXERCISES.addAll(EXERCISES_CHALLENGE_3);

        for (Exercise e: EXERCISES_CHALLENGE_1) {
            TEST_CASES_CHALLENGE_1.put(e.getTitle(), new ArrayList<>());

            TEST_CASES_CHALLENGE_1.get(e.getTitle()).add(new TestCase("","",true, e));
            TEST_CASES_CHALLENGE_1.get(e.getTitle()).add(new TestCase("","",true, e));
            TEST_CASES_CHALLENGE_1.get(e.getTitle()).add(new TestCase("","",true, e));
            TEST_CASES_CHALLENGE_1.get(e.getTitle()).add(new TestCase("","",false, e));
            TEST_CASES_CHALLENGE_1.get(e.getTitle()).add(new TestCase("","",false, e));

            TEST_CASES.addAll(TEST_CASES_CHALLENGE_1.get(e.getTitle()));
        }

        for (Exercise e: EXERCISES_CHALLENGE_2) {
            TEST_CASES_CHALLENGE_2.put(e.getTitle(), new ArrayList<>());

            TEST_CASES_CHALLENGE_2.get(e.getTitle()).add(new TestCase("","",true, e));
            TEST_CASES_CHALLENGE_2.get(e.getTitle()).add(new TestCase("","",true, e));
            TEST_CASES_CHALLENGE_2.get(e.getTitle()).add(new TestCase("","",false, e));

            TEST_CASES.addAll(TEST_CASES_CHALLENGE_2.get(e.getTitle()));
        }

        for (Exercise e: EXERCISES_CHALLENGE_3) {
            TEST_CASES_CHALLENGE_3.put(e.getTitle(), new ArrayList<>());

            TEST_CASES_CHALLENGE_3.get(e.getTitle()).add(new TestCase("","",true, e));
            TEST_CASES_CHALLENGE_3.get(e.getTitle()).add(new TestCase("","",false, e));
            TEST_CASES_CHALLENGE_3.get(e.getTitle()).add(new TestCase("","",false, e));
            TEST_CASES_CHALLENGE_3.get(e.getTitle()).add(new TestCase("","",false, e));

            TEST_CASES.addAll(TEST_CASES_CHALLENGE_3.get(e.getTitle()));
        }
    }

    @BeforeEach
    public void setUp(){
        ReflectionTestUtils.setField(CHALLENGE_1, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(CHALLENGE_2, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(CHALLENGE_3, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(CHALLENGE_4, "id", UUID.randomUUID());

        ReflectionTestUtils.setField(SUBMISSION_CHALLENGE_1, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(SUBMISSION_CHALLENGE_2, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(SUBMISSION_CHALLENGE_3, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(SUBMISSION_CHALLENGE_4, "id", UUID.randomUUID());

        ReflectionTestUtils.setField(USER_1, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(USER_2, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(USER_3, "id", UUID.randomUUID());

        for (Exercise e: EXERCISES) {
            ReflectionTestUtils.setField(e, "id", UUID.randomUUID());
        }

        for (TestCase t: TEST_CASES) {
            ReflectionTestUtils.setField(t, "id", UUID.randomUUID());
        }

        Mockito.when(challengeRepository.findAll()).thenReturn(CHALLENGES);
        Mockito.when(userRepository.findAll()).thenReturn(USERS);
        Mockito.when(exerciseRepository.findAll()).thenReturn(EXERCISES);
        Mockito.when(testCaseRepository.findAll()).thenReturn(TEST_CASES);
        Mockito.when(submissionRepository.findAll()).thenReturn(new ArrayList<>(SUBMISSIONS));

        Mockito.when(jwtUtil.parseToken(TOKEN)).thenReturn(USER_1);
        Mockito.when(userRepository.findById(USER_1.getId())).thenReturn(Optional.of(USER_1));
        Mockito.when(userRepository.findById(USER_2.getId())).thenReturn(Optional.of(USER_2));

        Mockito.when(challengeRepository.findById(CHALLENGE_1.getId())).thenReturn(Optional.of(CHALLENGE_1));
        Mockito.when(challengeRepository.findById(CHALLENGE_2.getId())).thenReturn(Optional.of(CHALLENGE_2));
        Mockito.when(challengeRepository.findById(CHALLENGE_3.getId())).thenReturn(Optional.of(CHALLENGE_3));

        for (Exercise e: EXERCISES) {
            Mockito.when(exerciseRepository.findById(e.getId())).thenReturn(Optional.of(e));
        }

        for (TestCase t: TEST_CASES) {
            Mockito.when(testCaseRepository.findById(t.getId())).thenReturn(Optional.of(t));
        }

        for (Submission s: SUBMISSIONS) {
            Mockito.when(submissionRepository.findById(s.getId())).thenReturn(Optional.of(s));
        }

        Mockito.when(jwtUtil.parseToken(TOKEN)).thenReturn(USER_1);
    }

    @Test
    public void getUserSubmissions_success() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/submissions")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    public void getSubmission_success() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/submissions/" + SUBMISSION_CHALLENGE_3.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.id", is(equalTo(SUBMISSION_CHALLENGE_3.getId().toString()))));

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/submissions/" + SUBMISSION_CHALLENGE_1.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.id", is(equalTo(SUBMISSION_CHALLENGE_1.getId().toString()))));
    }

    @Test
    public void getSubmission_forbidden() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/submissions/" + SUBMISSION_CHALLENGE_4.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    public void deleteSubmission_success() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/api/submissions/" + SUBMISSION_CHALLENGE_1.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful());

        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/api/submissions/" + SUBMISSION_CHALLENGE_3.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful());
    }

    @Test
    public void deleteSubmission_forbidden() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/api/submissions/" + SUBMISSION_CHALLENGE_4.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    public void getChallengeSubmissions_success() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/submissions/challenges/" + CHALLENGE_1.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(equalTo(SUBMISSION_CHALLENGE_1.getId().toString()))));
    }

    @Test
    public void getChallengeSubmissions_forbidden() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/submissions/challenges/" + CHALLENGE_3.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }
}
