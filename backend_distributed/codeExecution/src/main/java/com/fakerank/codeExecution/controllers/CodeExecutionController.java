package com.fakerank.codeExecution.controllers;


import com.fakerank.codeExecution.models.User;
import com.fakerank.codeExecution.services.CodeExecutionService;
import com.fakerank.codeExecution.utils.CreateSubmissionBody;
import com.fakerank.codeExecution.utils.Judge0Util;
import com.fakerank.codeExecution.utils.JwtUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.concurrent.ExecutionException;


@RestController
public class CodeExecutionController {
    private final CodeExecutionService codeExecutionService;

    @Autowired
    private JwtUtil jwtUtil;

    public CodeExecutionController(CodeExecutionService codeExecutionService) {
        this.codeExecutionService = codeExecutionService;
    }


    @PostMapping(value = "/api/execute", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> execute(@RequestBody String body, @RequestHeader (name="Authorization") String jwt)
            throws IOException, InterruptedException, ExecutionException {

        JSONObject json_body = new JSONObject(body);

        Integer language_id = Judge0Util.getLanguage_id(json_body.get("language").toString());
        if (language_id == null) {
            return new ResponseEntity<>("{\"error\": \"Invalid language\"}", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        CreateSubmissionBody submissionBody = new CreateSubmissionBody(language_id, json_body.getString("source_code"));

        if (!json_body.isNull("stdin")) {
            submissionBody.setStdin(json_body.getString("stdin"));
        }

        if (!json_body.isNull("expected_output")) {
            submissionBody.setExpected_output(json_body.getString("expected_output"));
        }

        JSONObject token = codeExecutionService.createSubmission(submissionBody, true);
        return new ResponseEntity<>(token.toString(), HttpStatus.CREATED);
    }

    @GetMapping(value = "/api/results/{token}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String>  getResults(@PathVariable String token, @RequestHeader (name="Authorization") String jwt)
            throws IOException, InterruptedException {

        User user = jwtUtil.parseToken(jwt.substring(7));
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        JSONObject res = codeExecutionService.getSubmission(token, true);
        return new ResponseEntity<>(res.toString(), HttpStatus.OK);
    }

    @DeleteMapping(value = "/api/results/{token}")
    public String delResults(@PathVariable String token) throws IOException, InterruptedException {
        JSONObject res = codeExecutionService.deleteSubmission(token);

        return "";
    }
}
