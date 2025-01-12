package com.fakerank.challenge.controllers;

import com.fakerank.challenge.models.*;
import com.fakerank.challenge.utils.JwtUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.*;

@RestController
public class ChallengeController {
    @Autowired
    ChallengeRepository challengeRepository;

    @Autowired
    ExerciseRepository exerciseRepository;
    @Autowired
    JwtUtil jwtUtil;

    @GetMapping(value = "/api/challenges", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getAllChallenges(@RequestHeader(name="Authorization") String jwt){
        User user = jwtUtil.parseToken(jwt.substring(7));

        List<Challenge> cs = challengeRepository.findAll().stream().filter(c -> Objects.equals(c.getOwnerId(), user.getId()))
                .toList();

        List<JSONObject> res = new ArrayList<>();
        for(Challenge c:cs){
            res.add(c.get_json());
        }
        return new ResponseEntity<>(res.toString(), HttpStatus.OK);
    }

    @PostMapping(value = "/api/challenges")
    public ResponseEntity<String> CreateChallenge(@RequestBody String body, @RequestHeader(name="Authorization") String jwt){
        try {
            JSONObject json_body = new JSONObject(body);
            User user = jwtUtil.parseToken(jwt.substring(7));

            Challenge challenge = new Challenge(
                    json_body.get("name").toString(),
                    Timestamp.valueOf(json_body.get("start_date").toString()),
                    Timestamp.valueOf(json_body.get("end_date").toString()),
                    user,
                    json_body.get("key").toString());

            Challenge saved_challenge = challengeRepository.save(challenge);

            JSONObject res = saved_challenge.get_json();
            return new ResponseEntity<>(res.toString(), HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping(value = "/api/challenges")
    public ResponseEntity<String> UpdateChallenge(@RequestBody String body, @RequestHeader(name="Authorization") String jwt){
        try{
            JSONObject json_body = new JSONObject(body);
            User user_logged = jwtUtil.parseToken(jwt.substring(7));
            Challenge c = challengeRepository.findById(UUID.fromString(json_body.get("id").toString())).get();
            if(!c.getOwnerId().equals(user_logged.getId()) || c.getStart_date().compareTo(new Date()) < 0)
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);

            c.setTitle(json_body.getString("name"));
            c.setStart_date(Timestamp.valueOf(json_body.getString("start_date")));
            c.setEnd_date(Timestamp.valueOf(json_body.getString("end_date")));
            c.setKey(json_body.getString("key"));

            Challenge saved_challenge = challengeRepository.save(c);

            JSONObject res = saved_challenge.get_json();
            return new ResponseEntity<>(res.toString(), HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/api/challenges/{Id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getChallenge(@RequestHeader(name="Authorization") String jwt, @PathVariable String Id) {
        try {
            User user_logged = jwtUtil.parseToken(jwt.substring(7));
            Challenge c = challengeRepository.findById(UUID.fromString(Id)).get();

            JSONObject res = c.get_json();
            if (c.getOwnerId().equals(user_logged.getId())) {
                res.put("key", c.getKey());
            }
            return new ResponseEntity<>(res.toString(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping(value = "/api/challenges/{Id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteChallenge(@RequestHeader(name="Authorization") String jwt, @PathVariable String Id) {
        try {
            User user_logged = jwtUtil.parseToken(jwt.substring(7));
            Challenge c = challengeRepository.findById(UUID.fromString(Id)).get();

            if(!c.getOwnerId().equals(user_logged.getId()))
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);

            challengeRepository.delete(c);

            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
