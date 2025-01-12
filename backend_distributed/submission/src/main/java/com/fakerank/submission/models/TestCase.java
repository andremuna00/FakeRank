package com.fakerank.submission.models;

import org.json.JSONObject;

import jakarta.persistence.*;
import java.util.UUID;

@Entity(name = "test_cases")
public class TestCase {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(columnDefinition="TEXT")
    private String input;

    @Column Boolean visible;

    @Column(columnDefinition="TEXT")
    private String output;

    @ManyToOne
    @JoinColumn(name = "exercise_id", referencedColumnName = "id")
    private Exercise exercise;

    public UUID getExerciseId(){
        return exercise.getId();
    }

    public UUID getId() {
        return id;
    }

    public Boolean getVisible() { return visible;  }

    public String getInput() {
        return input;
    }

    public String getOutput() {
        return output;
    }

    public Exercise getExercise() {
        return exercise;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public void setVisible(Boolean visible) {
        this.visible = visible;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public JSONObject get_json() {
        JSONObject json = new JSONObject();
        json.put("id", id);
        json.put("visible", visible);
        json.put("input", input);
        json.put("output", output);
        json.put("exercise", exercise.getId());

        return json;
    }

    public TestCase() {
    }

    public TestCase(String input, String output, Boolean visible, Exercise exercise) {
        this.input = input;
        this.output = output;
        this.visible = visible;
        this.exercise = exercise;
    }
}
