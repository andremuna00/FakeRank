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

@RestController
public class ExerciseController {

    @Autowired
    ExerciseRepository exerciseRepository;

    @Autowired
    ChallengeRepository challengeRepository;

    @Autowired
    JwtUtil jwtUtil;


    @GetMapping(value = "/api/exercises/challenges/{Id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getExercises(@RequestHeader(name="Authorization") String jwt, @PathVariable String Id){
        User user_logged = jwtUtil.parseToken(jwt.substring(7));
        List<Exercise> exercises = exerciseRepository.findAll().stream().filter(c -> Objects.equals(c.getChallengeId().toString(), Id)).toList();
        Challenge c = challengeRepository.findById(UUID.fromString(Id)).get();

        if (!user_logged.getId().equals(c.getOwnerId())
                && c.getStart_date().compareTo(new Date()) > 0) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        List<JSONObject> res = new ArrayList<>();
        for(Exercise ex: exercises){
            res.add(ex.get_json());
        }

        return new ResponseEntity<>(res.toString(), HttpStatus.OK);
    }


    @GetMapping(value = "/api/exercises/{Id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getExercise(@RequestHeader(name="Authorization") String jwt, @PathVariable String Id){
        User user_logged = jwtUtil.parseToken(jwt.substring(7));
        Exercise exercise = exerciseRepository.findById(UUID.fromString(Id)).get();

        if (!user_logged.getId().equals(exercise.getChallenge().getOwnerId())
                && exercise.getChallenge().getStart_date().compareTo(new Date()) > 0) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        JSONObject res = exercise.get_json();

        return new ResponseEntity<>(res.toString(), HttpStatus.OK);
    }

    @DeleteMapping(value = "/api/exercises/{Id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteExercise(@RequestHeader(name="Authorization") String jwt, @PathVariable String Id){
        User user_logged = jwtUtil.parseToken(jwt.substring(7));
        Exercise e = exerciseRepository.findById(UUID.fromString(Id)).get();

        if(!e.getChallenge().getOwnerId().equals(user_logged.getId()))
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);

        exerciseRepository.delete(e);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(value = "/api/exercises")
    public ResponseEntity<String> CreateExercise(@RequestBody String body, @RequestHeader(name="Authorization") String jwt){
        try {
            JSONObject json_body = new JSONObject(body);
            Challenge c = challengeRepository.findById(UUID.fromString(json_body.get("challenge_id").toString())).get();
            User user = jwtUtil.parseToken(jwt.substring(7));
            if(!c.getOwnerId().equals(user.getId()) || c.getStart_date().compareTo(new Date()) < 0)
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);

            Exercise exercise = new Exercise(
                    json_body.getString("title"),
                    json_body.getString("description"),
                    json_body.getString("sourceCode"),
                    json_body.getString("language"),
                    c);
            Exercise saved_exercise = exerciseRepository.save(exercise);

            JSONObject res = saved_exercise.get_json();
            return new ResponseEntity<>(res.toString(), HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping(value = "/api/exercises")
    public ResponseEntity<String> UpdateChallenge(@RequestBody String body, @RequestHeader(name="Authorization") String jwt){
        try{
            JSONObject json_body = new JSONObject(body);
            User user = jwtUtil.parseToken(jwt.substring(7));
            Exercise e = exerciseRepository.findById(UUID.fromString(json_body.get("id").toString())).get();
            if(!e.getChallenge().getOwnerId().equals(user.getId()) || e.getChallenge().getStart_date().compareTo(new Date()) < 0)
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);

            e.setTitle(json_body.getString("title"));
            e.setDescription(json_body.getString("description"));
            e.setSourceCode(json_body.getString("sourceCode"));
            e.setLanguage(json_body.getString("language"));
            Exercise saved_exercise = exerciseRepository.save(e);

            JSONObject res = saved_exercise.get_json();
            return new ResponseEntity<>(res.toString(), HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

}
