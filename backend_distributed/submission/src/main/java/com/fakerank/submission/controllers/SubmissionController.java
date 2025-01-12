package com.fakerank.submission.controllers;

import com.fakerank.submission.models.*;
import com.fakerank.submission.utils.JwtUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
public class SubmissionController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ChallengeRepository challengeRepository;

    @Autowired
    SubmissionRepository submissionRepository;

    @Autowired
    ExerciseSubmissionRepository exerciseSubmissionRepository;

    @Autowired
    TestCaseRepository testCaseRepository;
    @Autowired
    JwtUtil jwtUtil;

    /*
     * GET /api/user/submission/{userid}
     * GET /api/submission/{id}
     * GET /api/challenge/submission/{challengeid}
     * POST /api/submission/
     * PATCH /api/submission/
     * (only for rating from professor)
     * */

    @GetMapping(value = "/api/submissions", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getUserSubmissions(@RequestHeader(name="Authorization") String jwt){
        User user = jwtUtil.parseToken(jwt.substring(7));
        List<Submission> submissions = submissionRepository.findAll().stream()
                .filter(c -> Objects.equals(c.getUser().getId(), user.getId()))
                .toList();

        List<JSONObject> res = new ArrayList<>();
        for (Submission s: submissions) {
            Challenge c = challengeRepository.findById(s.getChallenge().getId()).get();
            res.add(s.get_json().put("challenge_title", c.getTitle()).put("challenge_end", c.getEnd_date()));
        }

        return new ResponseEntity<>(res.toString(), HttpStatus.OK);
    }

    @GetMapping(value = "/api/submissions/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getSubmission(@RequestHeader(name="Authorization") String jwt, @PathVariable String id){
        User user = jwtUtil.parseToken(jwt.substring(7));
        Submission submission = submissionRepository.findById(UUID.fromString(id)).get();

        if (!Objects.equals(user.getId(), submission.getUserId()) && !Objects.equals(user.getId(), submission.getChallenge().getOwnerId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        JSONObject res = submission.get_json();

        return new ResponseEntity<>(res.toString(), HttpStatus.OK);
    }

    @DeleteMapping(value = "/api/submissions/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteSubmission(@RequestHeader(name="Authorization") String jwt, @PathVariable String id){
        User user_logged = jwtUtil.parseToken(jwt.substring(7));
        Submission s = submissionRepository.findById(UUID.fromString(id)).get();

        if(!s.getChallenge().getOwnerId().equals(user_logged.getId()) && !s.getUserId().equals(user_logged.getId()))
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);

        submissionRepository.deleteById(UUID.fromString(id));

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(value = "/api/submissions/challenges/{ChallengeId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getChallengeSubmissions(@RequestHeader(name="Authorization") String jwt, @PathVariable String ChallengeId){
        Challenge challenge = challengeRepository.findById(UUID.fromString(ChallengeId)).get();
        User user = jwtUtil.parseToken(jwt.substring(7));
        if(!Objects.equals(user.getId(), challenge.getOwnerId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        List<Submission> submissions = submissionRepository.findAll().stream()
                .filter(c -> Objects.equals(c.getChallenge().getId(), UUID.fromString(ChallengeId)))
                .toList();

        List<JSONObject> res = new ArrayList<>();
        for (Submission s: submissions) {
            res.add(s.get_json().put("user", s.getUser().get_json()));
        }

        return new ResponseEntity<>(res.toString(), HttpStatus.OK);
    }

    @PostMapping(value = "/api/submissions", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> postSubmission(@RequestHeader(name="Authorization") String jwt, @RequestBody String body){
        try {
            JSONObject json_body = new JSONObject(body);

            User user = jwtUtil.parseToken(jwt.substring(7));
            Challenge c = challengeRepository.findById(UUID.fromString(json_body.get("challenge_id").toString())).get();

            String challenge_key = c.getKey();

            if (!Objects.equals(challenge_key, json_body.getString("key")) || c.getStart_date().compareTo(new Date()) > 0) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            if (c.getEnd_date().compareTo(new Date()) < 0) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            Submission submission = new Submission(
                    user,
                    c,
                    new Date(),
                    c.getEnd_date(),
                    0
            );

            Submission saved_submission = submissionRepository.save(submission);
            JSONObject res = saved_submission.get_json();

            return new ResponseEntity<>(res.toString(), HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping(value = "/api/submissions", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> patchSubmission(@RequestHeader(name="Authorization") String jwt, @RequestBody String body){
        try {
            JSONObject json_body = new JSONObject(body);
            User user = jwtUtil.parseToken(jwt.substring(7));
            Submission submission = submissionRepository.findById(UUID.fromString(json_body.getString("id"))).get();

            if (!Objects.equals(user.getId(), submission.getUserId())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            if (submission.getChallenge().getEnd_date().compareTo(new Date()) < 0) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            List<ExerciseSubmission> exerciseSubmissions = exerciseSubmissionRepository.findAll().stream()
                    .filter(e -> Objects.equals(e.getSubmissionId(), submission.getId()))
                    .toList();

            int passed = 0;
            int total = 0;
            for (ExerciseSubmission es : exerciseSubmissions) {
                String sourceCode = es.getSourceCode();
                List<TestCase> testCases = testCaseRepository.findAll().stream()
                        .filter(t -> Objects.equals(t.getExerciseId(), es.getExerciseId()))
                        .toList();

                //TODO: Evaluate sc with testcases
                total += testCases.size();
                //TODO: count passed testcases
                passed += es.getRating();
            }

            int rating = (int) Math.round((double) passed / total * 30);

            submission.setRating(rating);

            Submission saved_submission = submissionRepository.save(submission);

            JSONObject res = saved_submission.get_json();
            return new ResponseEntity<>(res.toString(), HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping(value = "/api/submissions/rating", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> patchRatingSubmission(@RequestHeader(name="Authorization") String jwt, @RequestBody String body) {
        try {
            JSONObject json_body = new JSONObject(body);
            User user = jwtUtil.parseToken(jwt.substring(7));
            Submission submission = submissionRepository.findById(UUID.fromString(json_body.get("id").toString())).get();
            Challenge challenge = submission.getChallenge();

            if (!Objects.equals(user.getId(), challenge.getOwnerId())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            if(json_body.has("rating"))
                submission.setRating(json_body.getInt("rating"));

            Submission saved_submission = submissionRepository.save(submission);

            JSONObject res = saved_submission.get_json();
            return new ResponseEntity<>(res.toString(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping(value = "/api/submissions/{id}/submit", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> submitChallenge(@RequestHeader(name="Authorization") String jwt, @PathVariable String id) {
        try {
            User user = jwtUtil.parseToken(jwt.substring(7));
            Submission submission = submissionRepository.findById(UUID.fromString(id)).get();

            if (!Objects.equals(user.getId(), submission.getUserId())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            Date now_time = new Date();
            if (submission.getChallenge().getEnd_date().compareTo(now_time) > 0) {
                submission.setEnd_date(now_time);
            }

            List<ExerciseSubmission> exerciseSubmissions = exerciseSubmissionRepository.findAll().stream()
                    .filter(e -> Objects.equals(e.getSubmissionId(), submission.getId()))
                    .toList();

            int passed = 0;
            int total = 0;
            for (ExerciseSubmission es : exerciseSubmissions) {
                String sourceCode = es.getSourceCode();
                List<TestCase> testCases = testCaseRepository.findAll().stream()
                        .filter(t -> Objects.equals(t.getExerciseId(), es.getExerciseId()))
                        .toList();

                total += testCases.size();
                passed += es.getRating();
            }

            int rating = (int) Math.round((double) passed / total * 30);

            submission.setRating(rating);

            Submission saved_submission = submissionRepository.save(submission);

            JSONObject res = saved_submission.get_json();
            return new ResponseEntity<>(res.toString(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }
}
