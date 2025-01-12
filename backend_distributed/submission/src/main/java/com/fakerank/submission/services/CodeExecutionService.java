package com.fakerank.submission.services;

import com.fakerank.submission.utils.*;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.ExecutionException;

import com.fakerank.submission.utils.Judge0Util;


@Service
public class CodeExecutionService {

    private static final String JUDGE0_ADDRESS = System.getenv().getOrDefault("JUDGE0_ADDRESS", "localhost");

    public JSONObject createSubmission(CreateSubmissionBody body, boolean base64_encoded, boolean wait) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(String.format("http://%s:2358/submissions/?base64_encoded=%s&wait=%s",JUDGE0_ADDRESS, base64_encoded, wait)))
                .POST(HttpRequest.BodyPublishers.ofString(body.getBody_json().toString()))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        return new JSONObject(response.body());
    }

    public JSONObject createSubmission(CreateSubmissionBody body, boolean base64_encoded) throws IOException, InterruptedException, ExecutionException {
        return this.createSubmission(body, base64_encoded, false);
    }

    public JSONObject getSubmission(String token, boolean base64_encoded, String fields) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(String.format("http://%s:2358/submissions/%s?base64_encoded=%s&fields=%s", JUDGE0_ADDRESS ,token,base64_encoded, fields)))
                .GET()
                .header("Accept", "application/json")
                .build();

        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

        return new JSONObject(response.body());
    }

    public JSONObject  getSubmission(String token, boolean base64_encoded) throws IOException, InterruptedException {
        return this.getSubmission(token, base64_encoded, "stdout,time,memory,stderr,token,compile_output,message,status");
    }

    public JSONObject deleteSubmission(String token, String fields) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder().
                uri(URI.create(String.format("http://%s:2358/submissions/%s?fields=%s", JUDGE0_ADDRESS, token, fields)))
                .DELETE()
                .header(Judge0Util.AUTHZ_HEADER, Judge0Util.AUTHZ_TOKEN)
                .build();

        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

        return new JSONObject(response.body());
    }

    public JSONObject deleteSubmission(String token) throws IOException, InterruptedException {
        return  this.deleteSubmission(token, "stdout,time,memory,stderr,token,compile_output,message,status");
    }
}
