package com.fakerank.submission.controllers;

import com.fakerank.submission.TestSecurityConfig;
import com.fakerank.submission.models.*;
import com.fakerank.submission.services.CodeExecutionService;
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

@WebMvcTest(ExerciseSubmissionController.class)
@Import(TestSecurityConfig.class)
public class ExerciseSubmissionControllerTest {

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

    @MockBean
    CodeExecutionService codeExecutionService;

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
    List<Exercise> EXERCISES_CHALLENGE_4 = new ArrayList<>();

    List<Exercise> EXERCISES = new ArrayList<>();

    Map<String, List<TestCase>> TEST_CASES_CHALLENGE_1 = new HashMap<>();
    Map<String, List<TestCase>> TEST_CASES_CHALLENGE_2 = new HashMap<>();
    Map<String, List<TestCase>> TEST_CASES_CHALLENGE_3 = new HashMap<>();

    List<TestCase> TEST_CASES = new ArrayList<>();


    List<ExerciseSubmission> EXERCISE_SUBMISSIONS_CHALLENGE_1 = new ArrayList<>();

    List<ExerciseSubmission> EXERCISE_SUBMISSIONS_CHALLENGE_3 = new ArrayList<>();

    List<ExerciseSubmission> EXERCISE_SUBMISSIONS_CHALLENGE_4 = new ArrayList<>();

    List<ExerciseSubmission> EXERCISE_SUBMISSIONS = new ArrayList<>();

    {
        EXERCISES_CHALLENGE_1.add(new Exercise("es1_challenge1", "", "", "python", CHALLENGE_1));
        EXERCISES_CHALLENGE_1.add(new Exercise("es2_challenge1", "", "", "python", CHALLENGE_1));
        EXERCISES_CHALLENGE_1.add(new Exercise("es3_challenge1", "", "", "python", CHALLENGE_1));

        EXERCISES_CHALLENGE_2.add(new Exercise("es1_challenge2", "", "", "python", CHALLENGE_2));
        EXERCISES_CHALLENGE_2.add(new Exercise("es2_challenge2", "", "", "python", CHALLENGE_2));

        EXERCISES_CHALLENGE_3.add(new Exercise("es1_challenge3", "", "", "python", CHALLENGE_3));

        EXERCISES_CHALLENGE_4.add(new Exercise("es1_challenge4", "", "", "python", CHALLENGE_4));
        EXERCISES_CHALLENGE_4.add(new Exercise("es2_challenge4", "", "", "python", CHALLENGE_4));

        EXERCISES.addAll(EXERCISES_CHALLENGE_1);
        EXERCISES.addAll(EXERCISES_CHALLENGE_2);
        EXERCISES.addAll(EXERCISES_CHALLENGE_3);
        EXERCISES.addAll(EXERCISES_CHALLENGE_4);

        for (Exercise e: EXERCISES_CHALLENGE_1) {
            EXERCISE_SUBMISSIONS_CHALLENGE_1.add(new ExerciseSubmission(USER_2, e, SUBMISSION_CHALLENGE_1, "", "pyhton", new Date(), 0));
        }
        EXERCISE_SUBMISSIONS.addAll(EXERCISE_SUBMISSIONS_CHALLENGE_1);

        for (Exercise e: EXERCISES_CHALLENGE_3) {
            EXERCISE_SUBMISSIONS_CHALLENGE_3.add(new ExerciseSubmission(USER_1, e, SUBMISSION_CHALLENGE_3, "", "pyhton", new Date(), 0));
        }
        EXERCISE_SUBMISSIONS.addAll(EXERCISE_SUBMISSIONS_CHALLENGE_3);

        for (Exercise e: EXERCISES_CHALLENGE_4) {
            EXERCISE_SUBMISSIONS_CHALLENGE_4.add(new ExerciseSubmission(USER_2, e, SUBMISSION_CHALLENGE_4, "", "pyhton", new Date(), 0));
        }
        EXERCISE_SUBMISSIONS.addAll(EXERCISE_SUBMISSIONS_CHALLENGE_4);

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

        for (ExerciseSubmission es : EXERCISE_SUBMISSIONS) {
            ReflectionTestUtils.setField(es, "id", UUID.randomUUID());
        }

        Mockito.when(challengeRepository.findAll()).thenReturn(CHALLENGES);
        Mockito.when(userRepository.findAll()).thenReturn(USERS);
        Mockito.when(exerciseRepository.findAll()).thenReturn(EXERCISES);
        Mockito.when(testCaseRepository.findAll()).thenReturn(TEST_CASES);
        Mockito.when(submissionRepository.findAll()).thenReturn(SUBMISSIONS);
        Mockito.when(exerciseSubmissionRepository.findAll()).thenReturn(EXERCISE_SUBMISSIONS);

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

        for (ExerciseSubmission es : EXERCISE_SUBMISSIONS) {
            Mockito.when(exerciseSubmissionRepository.findById(es.getId())).thenReturn(Optional.of(es));
        }

        Mockito.when(jwtUtil.parseToken(TOKEN)).thenReturn(USER_1);
    }

    @Test
    public void getExerciseSubmission_success() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/exercise_submissions/" + EXERCISE_SUBMISSIONS_CHALLENGE_1.get(0).getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.id", is(equalTo(EXERCISE_SUBMISSIONS_CHALLENGE_1.get(0).getId().toString()))));

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/exercise_submissions/" + EXERCISE_SUBMISSIONS_CHALLENGE_3.get(0).getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.id", is(equalTo(EXERCISE_SUBMISSIONS_CHALLENGE_3.get(0).getId().toString()))));
    }

    @Test
    public void getExerciseSubmission_forbidden() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/exercise_submissions/" + EXERCISE_SUBMISSIONS_CHALLENGE_4.get(0).getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

    }

    @Test
    public void deleteExerciseSubmission_success() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/api/exercise_submissions/" + EXERCISE_SUBMISSIONS_CHALLENGE_1.get(0).getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful());

        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/api/exercise_submissions/" + EXERCISE_SUBMISSIONS_CHALLENGE_3.get(0).getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful());
    }

    @Test
    public void deleteExerciseSubmission_forbidden() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/api/exercise_submissions/" + EXERCISE_SUBMISSIONS_CHALLENGE_4.get(0).getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    public void getExerciseSubmissionBySubmissionId_success() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/exercise_submissions/submissions/%s/exercises/%s".formatted(SUBMISSION_CHALLENGE_3.getId().toString(), EXERCISES_CHALLENGE_3.get(0).getId().toString()))
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.id", is(equalTo(EXERCISE_SUBMISSIONS_CHALLENGE_3.get(0).getId().toString()))));

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/exercise_submissions/submissions/%s/exercises/%s".formatted(SUBMISSION_CHALLENGE_1.getId().toString(), EXERCISES_CHALLENGE_1.get(0).getId().toString()))
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.id", is(equalTo(EXERCISE_SUBMISSIONS_CHALLENGE_1.get(0).getId().toString()))));

    }

    @Test
    public void getExerciseSubmissionBySubmissionId_forbidden() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/exercise_submissions/submissions/%s/exercises/%s".formatted(SUBMISSION_CHALLENGE_4.getId().toString(), EXERCISES_CHALLENGE_4.get(0).getId().toString()))
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

    }

    @Test
    public void getExerciseSubmissionsOfExercise_success() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/exercise_submissions/exercises/" + EXERCISES_CHALLENGE_1.get(0).getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(equalTo(EXERCISE_SUBMISSIONS_CHALLENGE_1.get(0).getId().toString()))));

    }

    @Test
    public void getExerciseSubmissionsOfExercise_forbidden() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/exercise_submissions/exercises/" + EXERCISES_CHALLENGE_4.get(0).getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/exercise_submissions/exercises/" + EXERCISES_CHALLENGE_3.get(0).getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

    }

}
