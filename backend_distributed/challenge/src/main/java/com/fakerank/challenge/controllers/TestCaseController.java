package com.fakerank.challenge.controllers;

import com.fakerank.challenge.models.*;
import com.fakerank.challenge.utils.JwtUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Stream;

@RestController
public class TestCaseController {

    @Autowired
    ExerciseRepository exerciseRepository;

    @Autowired
    TestCaseRepository testCaseRepository;

    @Autowired
    JwtUtil jwtUtil;

    @GetMapping(value = "/api/testcases/exercises/{ExerciseId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getTestCases(@RequestHeader(name="Authorization") String jwt, @PathVariable String ExerciseId) {
        User user_logged = jwtUtil.parseToken(jwt.substring(7));

        Exercise e = exerciseRepository.findById(UUID.fromString(ExerciseId)).get();

        if (!user_logged.getId().equals(e.getChallenge().getOwnerId())
                && e.getChallenge().getStart_date().compareTo(new Date()) > 0) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        List<TestCase> test_cases = testCaseRepository.findAll().stream().filter(t -> Objects.equals(t.getExerciseId().toString(), ExerciseId)).toList();

        Stream<TestCase> visible_test_cases_stream = test_cases.stream().filter(t -> Objects.equals(t.getVisible(), true));
        Stream<TestCase> private_test_cases_stream = test_cases.stream().filter(t -> Objects.equals(t.getVisible(), false));

        List<JSONObject> res = new ArrayList<>();
        for (TestCase t : visible_test_cases_stream.toList()) {
            res.add(t.get_json());
        }

        if (user_logged.getId().equals(e.getChallenge().getOwnerId())) {
            for (TestCase t : private_test_cases_stream.toList()) {
                res.add(t.get_json());
            }
        } else {
            for (TestCase t : private_test_cases_stream.toList()) {
                res.add(new JSONObject().put("id", t.getId()).put("visible", t.getVisible()));
            }
        }

        return new ResponseEntity<>(res.toString(), HttpStatus.OK);
    }

    @GetMapping(value = "/api/testcases/{Id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getTestcase(@RequestHeader(name="Authorization") String jwt, @PathVariable String Id){
        User user_logged = jwtUtil.parseToken(jwt.substring(7));
        TestCase test_case = testCaseRepository.findById(UUID.fromString(Id)).get();
        Exercise e = exerciseRepository.findById(test_case.getExerciseId()).get();

        if (!user_logged.getId().equals(e.getChallenge().getOwnerId())
                && e.getChallenge().getStart_date().compareTo(new Date()) > 0) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        if (user_logged.getId().equals(e.getChallenge().getOwnerId()) || test_case.getVisible()) {
            JSONObject res = test_case.get_json();
            return new ResponseEntity<>(res.toString(), HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping(value = "/api/testcases/{Id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteTestcase(@RequestHeader(name="Authorization") String jwt, @PathVariable String Id){
        User user = jwtUtil.parseToken(jwt.substring(7));
        TestCase test_case = testCaseRepository.findById(UUID.fromString(Id)).get();
        Exercise e = exerciseRepository.findById(test_case.getExerciseId()).get();

        if (user.getId().equals(e.getChallenge().getOwnerId())) {
            testCaseRepository.deleteById(UUID.fromString(Id));
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }


    @PostMapping(value = "/api/testcases")
    public ResponseEntity<String> CreateTestCase(@RequestBody String body, @RequestHeader(name="Authorization") String jwt){
        try{
            JSONObject json_body = new JSONObject(body);
            User user = jwtUtil.parseToken(jwt.substring(7));
            Exercise e = exerciseRepository.findById(UUID.fromString(json_body.get("exercise_id").toString())).get();

            if(!e.getChallenge().getOwnerId().equals(user.getId()) || e.getChallenge().getStart_date().compareTo(new Date()) < 0)
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);

            TestCase test_case = new TestCase(
                    json_body.get("input").toString(),
                    json_body.get("output").toString(),
                    Boolean.valueOf(json_body.get("visible").toString()),
                    e
            );
            TestCase saved_testcase = testCaseRepository.save(test_case);

            JSONObject res = saved_testcase.get_json();
            return new ResponseEntity<>(res.toString(), HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping(value = "/api/testcases")
    public ResponseEntity<String> UpdateTestCase(@RequestBody String body, @RequestHeader(name="Authorization") String jwt){
        try{
            JSONObject json_body = new JSONObject(body);
            User user = jwtUtil.parseToken(jwt.substring(7));
            Exercise e = exerciseRepository.findById(UUID.fromString(json_body.get("exercise_id").toString())).get();
            TestCase t = testCaseRepository.findById(UUID.fromString(json_body.get("id").toString())).get();

            if(!e.getChallenge().getOwnerId().equals(user.getId()) || e.getChallenge().getStart_date().compareTo(new Date()) < 0)
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);

            t.setInput(json_body.getString("input"));
            t.setOutput(json_body.getString("output"));
            t.setVisible(Boolean.valueOf(json_body.getString("visible")));
            TestCase saved_testcase = testCaseRepository.save(t);

            JSONObject res = saved_testcase.get_json();
            return new ResponseEntity<>(res.toString(), HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }
}
