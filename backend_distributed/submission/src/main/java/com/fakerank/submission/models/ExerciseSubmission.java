package com.fakerank.submission.models;

import org.json.JSONObject;

import jakarta.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity(name = "exercise_submissions")
public class ExerciseSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "exercise_id", referencedColumnName = "id")
    private Exercise exercise;

    @ManyToOne
    @JoinColumn(name = "submission_id", referencedColumnName = "id")
    private Submission submission;

    @Column(columnDefinition="TEXT")
    private String sourceCode;

    @Column
    private String language;

    @Column
    private Date last_save;

    @Column
    private Integer rating;

    public UUID getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public UUID getUserId() {
        return user.getId();
    }

    public Exercise getExercise() {
        return exercise;
    }

    public UUID getExerciseId() {
        return exercise.getId();
    }

    public Submission getSubmission() {
        return submission;
    }

    public UUID getSubmissionId() {
        return submission.getId();
    }

    public Challenge getChallenge() {
        return exercise.getChallenge();
    }

    public String getSourceCode() {
        return sourceCode;
    }

    public Integer getRating() { return rating; }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public void setSourceCode(String sourceCode) {
        this.sourceCode = sourceCode;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setLast_save(Date last_save) {
        this.last_save = last_save;
    }

    public JSONObject get_json() {
        JSONObject json = new JSONObject();
        json.put("id", id);
        json.put("user_id", user.getId());
        json.put("exercise_id", exercise.getId());
        json.put("submission_id", submission.getId());
        json.put("sourceCode", sourceCode);
        json.put("language", language);
        json.put("last_save", last_save);
        json.put("rating", rating);

        return json;
    }

    public ExerciseSubmission() {
    }

    public ExerciseSubmission(User user, Exercise exercise, Submission submission, String sourceCode, String language, Date last_save, Integer rating) {
        this.user = user;
        this.exercise = exercise;
        this.submission = submission;
        this.sourceCode = sourceCode;
        this.language = language;
        this.last_save = last_save;
        this.rating = rating;
    }

}
