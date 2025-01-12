package com.fakerank.userManagement.controllers;

import com.fakerank.userManagement.models.*;
import com.fakerank.userManagement.utils.JwtUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.UUID;

@RestController
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtUtil jwtUtil;

    @GetMapping(value = "/api/users/{UserId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getUser(@RequestHeader(name="Authorization") String jwt, @PathVariable String UserId){
        User user_logged = jwtUtil.parseToken(jwt.substring(7));
        if(!Objects.equals(user_logged.getId().toString(), UserId))
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);

        User user = userRepository.findById(UUID.fromString(UserId)).get();

        JSONObject res = new JSONObject(user);
        return new ResponseEntity<>(res.toString(), HttpStatus.OK);
    }

    @DeleteMapping(value = "/api/users/{UserId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteUser(@RequestHeader(name="Authorization") String jwt, @PathVariable String UserId){
        userRepository.deleteById(UUID.fromString(UserId));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping(value = "/api/users")
    public ResponseEntity<String> UpdateUser(@RequestBody String body, @RequestHeader(name="Authorization") String jwt){
        try{
            JSONObject json_body = new JSONObject(body);
            User user_logged = jwtUtil.parseToken(jwt.substring(7));
            User current = userRepository.findById(UUID.fromString(json_body.get("id").toString())).get();

            if(!current.getId().equals(user_logged.getId()))
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);

            user_logged.setUsername(json_body.getString("username"));
            user_logged.setEmail(json_body.getString("email"));


            User saved_user = userRepository.save(user_logged);

            JSONObject res = saved_user.get_json();
            return new ResponseEntity<>(res.toString(), HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }
}
