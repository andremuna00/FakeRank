package com.fakerank.submission.controllers;

import com.fakerank.submission.models.*;
import com.fakerank.submission.services.CodeExecutionService;
import com.fakerank.submission.utils.CreateSubmissionBody;
import com.fakerank.submission.utils.Judge0Util;
import com.fakerank.submission.utils.JwtUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class ExerciseSubmissionController {

    @Autowired
    ExerciseRepository exerciseRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    SubmissionRepository submissionRepository;

    @Autowired
    ChallengeRepository challengeRepository;

    @Autowired
    ExerciseSubmissionRepository exerciseSubmissionRepository;

    @Autowired
    TestCaseRepository testCaseRepository;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    CodeExecutionService codeExecutionService;

    /*
     * GET /api/exercise_submission/{id}
     * GET /api/challenge/exercise_submission/{challengeid}
     * POST /api/exercise_submission/
     * PATCH /api/exercise_submission/{id}
     * */


    @GetMapping(value = "/api/exercise_submissions/{Id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getExerciseSubmission(@RequestHeader(name="Authorization") String jwt, @PathVariable String Id){
        User user = jwtUtil.parseToken(jwt.substring(7));
        ExerciseSubmission exerciseSubmission = exerciseSubmissionRepository.findById(UUID.fromString(Id)).get();

        if (!user.getId().equals(exerciseSubmission.getUserId()) &&
                !user.getId().equals(exerciseSubmission.getExercise().getChallenge().getOwnerId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }


        JSONObject res = exerciseSubmission.get_json();
        return new ResponseEntity<>(res.toString(), HttpStatus.OK);
    }

    @GetMapping(value = "/api/exercise_submissions/submissions/{submissionId}/exercises/{exerciseId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getExerciseSubmissionBySubmissionId(@RequestHeader(name="Authorization") String jwt, @PathVariable String submissionId, @PathVariable String exerciseId){
        User user = jwtUtil.parseToken(jwt.substring(7));

        Optional<ExerciseSubmission> exerciseSubmissionOptional = exerciseSubmissionRepository.findAll().stream()
                .filter(es -> Objects.equals(es.getSubmissionId(), UUID.fromString(submissionId)))
                .filter(es -> Objects.equals(es.getExerciseId(), UUID.fromString(exerciseId))).findAny();

        ExerciseSubmission exerciseSubmission = exerciseSubmissionOptional.get();

        if (!user.getId().equals(exerciseSubmission.getUserId()) &&
                !user.getId().equals(exerciseSubmission.getExercise().getChallenge().getOwnerId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        JSONObject res = exerciseSubmission.get_json();
        return new ResponseEntity<>(res.toString(), HttpStatus.OK);
    }

    @DeleteMapping(value = "/api/exercise_submissions/{Id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteExerciseSubmission(@RequestHeader(name="Authorization") String jwt, @PathVariable String Id){
        User user_logged = jwtUtil.parseToken(jwt.substring(7));
        ExerciseSubmission es = exerciseSubmissionRepository.findById(UUID.fromString(Id)).get();

        if(!es.getChallenge().getOwnerId().equals(user_logged.getId()) && !es.getUserId().equals(user_logged.getId()))
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);

        exerciseSubmissionRepository.deleteById(UUID.fromString(Id));

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(value = "/api/exercise_submissions/exercises/{ExerciseId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getExerciseSubmissionsOfExercise(@RequestHeader(name="Authorization") String jwt, @PathVariable String ExerciseId){

        Exercise exercise = exerciseRepository.findById(UUID.fromString(ExerciseId)).get();
        User user_logged = jwtUtil.parseToken(jwt.substring(7));
        if(!Objects.equals(user_logged.getId(), exercise.getChallenge().getOwnerId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        List<ExerciseSubmission> exercise_submissions = exerciseSubmissionRepository.findAll().stream()
                .filter(es -> Objects.equals(es.getExerciseId(), UUID.fromString(ExerciseId)))
                .toList();

        List<JSONObject> res = new ArrayList<>();
        for(ExerciseSubmission s: exercise_submissions){
            res.add(s.get_json().put("user", s.getUser().get_json()));
        }

        return new ResponseEntity<>(res.toString(), HttpStatus.OK);
    }

    @PostMapping(value = "/api/exercise_submissions", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> postSubmission(@RequestHeader(name="Authorization") String jwt, @RequestBody String body){
        try {
            User user_logged = jwtUtil.parseToken(jwt.substring(7));

            JSONObject json_body = new JSONObject(body);
            Submission submission = submissionRepository.findById(UUID.fromString(json_body.get("submission_id").toString())).get();

            Date challenge_end_date = submission.getChallenge().getEnd_date();
            Date submission_end_date = submission.getEnd_date();
            if (submission_end_date.compareTo(challenge_end_date) < 0
                || challenge_end_date.compareTo(new Date()) < 0) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            User user = userRepository.findById(UUID.fromString(json_body.get("user_id").toString())).get();
            Exercise exercise = exerciseRepository.findById(UUID.fromString(json_body.get("exercise_id").toString())).get();

            if (!Objects.equals(user_logged.getId(), submission.getUserId())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }


            List<TestCase> test_cases = testCaseRepository.findAll().stream().
                    filter(t -> Objects.equals(t.getExerciseId(), exercise.getId()))
                    .toList();

            Integer rating = 0;
            Integer language_id = Judge0Util.getLanguage_id(json_body.get("language").toString());
            List<JSONObject> results = new ArrayList<>();

            for (TestCase t : test_cases) {
                CreateSubmissionBody submissionBody = new CreateSubmissionBody(language_id, json_body.get("code").toString());
                submissionBody.setStdin(t.getInput());
                submissionBody.setExpected_output(t.getOutput());

                JSONObject result = codeExecutionService.createSubmission(submissionBody, true, true);
                String stdin = t.getInput();
                String expected_output = t.getOutput();
                String stdout = result.getString("stdout");

                JSONObject r = new JSONObject();
                if (t.getVisible() == true) {
                    r.put("id", t.getId()).put("stdin", stdin).put("expected_output", expected_output).put("stdout", stdout);
                }else{
                    r.put("id", t.getId()).put("stdout", stdout);
                }

                if (result.getJSONObject("status").getInt("id") == 3) {
                    rating++;
                    r.put("passed", true);
                }
                else {
                    r.put("passed", false);
                }

                results.add(r);
            }

            Optional<ExerciseSubmission> exerciseSubmissionOptional = exerciseSubmissionRepository.findAll().stream()
                    .filter(es -> Objects.equals(es.getExerciseId(), exercise.getId()))
                    .filter(es -> Objects.equals(es.getUserId(), user.getId())).findAny();

            ExerciseSubmission exerciseSubmission;
            if (exerciseSubmissionOptional.isPresent()) {
                exerciseSubmission = exerciseSubmissionOptional.get();

                exerciseSubmission.setSourceCode(json_body.getString("code"));
                exerciseSubmission.setLanguage(json_body.get("language").toString());
                exerciseSubmission.setLast_save(new Date());
                exerciseSubmission.setRating(rating);
            } else {
                exerciseSubmission = new ExerciseSubmission(
                        user,
                        exercise,
                        submission,
                        json_body.get("code").toString(),
                        json_body.get("language").toString(),
                        new Date(),
                        rating
                );
            }

            ExerciseSubmission saved_exerciseSubmission = exerciseSubmissionRepository.save(exerciseSubmission);

            JSONObject res = saved_exerciseSubmission.get_json().put("results",results);
            return new ResponseEntity<>(res.toString(), HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping(value = "/api/exercise_submissions", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> patchSubmission(@RequestHeader(name="Authorization") String jwt, @RequestBody String body) {
        try {
            JSONObject json_body = new JSONObject(body);

            User user_logged = jwtUtil.parseToken(jwt.substring(7));
            ExerciseSubmission exerciseSubmission = exerciseSubmissionRepository.findById(UUID.fromString(json_body.getString("id"))).get();
            Submission submission = exerciseSubmission.getSubmission();
            if (!Objects.equals(user_logged.getId(), submission.getUserId())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            Date challenge_end_date = submission.getChallenge().getEnd_date();
            Date submission_end_date = submission.getEnd_date();
            if (submission_end_date.compareTo(challenge_end_date) < 0
                    || challenge_end_date.compareTo(new Date()) < 0) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            Exercise exercise = exerciseSubmission.getExercise();
            String language = json_body.getString("language");

            exerciseSubmission.setSourceCode(json_body.getString("code"));
            exerciseSubmission.setLanguage(language);

            List<TestCase> test_cases = testCaseRepository.findAll().stream().
                    filter(t -> Objects.equals(t.getExerciseId(), exercise.getId()))
                    .toList();

            Integer rating = 0;
            Integer language_id = Judge0Util.getLanguage_id(language);
            List<JSONObject> results = new ArrayList<>();
            for (TestCase t : test_cases) {
                CreateSubmissionBody submissionBody = new CreateSubmissionBody(language_id, json_body.get("code").toString());
                submissionBody.setStdin(t.getInput());
                submissionBody.setExpected_output(t.getOutput());

                JSONObject result = codeExecutionService.createSubmission(submissionBody, true, true);
                if (result.getJSONObject("status").getInt("id") == 3) {
                    rating++;
                    results.add(new JSONObject().put("id", t.getId()).put("passed", true));
                } else {
                    results.add(new JSONObject().put("id", t.getId()).put("passed", false));
                }
            }


            exerciseSubmission.setRating(rating);
            ExerciseSubmission saved_exerciseSubmission = exerciseSubmissionRepository.save(exerciseSubmission);

            JSONObject res = saved_exerciseSubmission.get_json().put("results",results);
            return new ResponseEntity<>(res.toString(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }
}
