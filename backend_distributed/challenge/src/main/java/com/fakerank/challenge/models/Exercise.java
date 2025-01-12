package com.fakerank.challenge.models;

import org.json.JSONObject;

import jakarta.persistence.*;
import java.util.UUID;

@Entity(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column
    private String title;

    @Column(columnDefinition="TEXT")
    private String description;

    @Column(columnDefinition="TEXT")
    private String sourceCode;

    @Column
    private String language;


    @ManyToOne
    @JoinColumn(name = "challenge_id", referencedColumnName = "id")
    private Challenge challenge;

    public UUID getChallengeId(){
        return challenge.getId();
    }

    public UUID getId() {
        return id;
    }

    public Challenge getChallenge() {
        return challenge;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setSourceCode(String sourceCode) {
        this.sourceCode = sourceCode;
    }

    public void setLanguage(String language) {
        this.language = language;
    }



    public JSONObject get_json() {
        JSONObject json = new JSONObject();
        json.put("id", id);
        json.put("title", title);
        json.put("description", description);
        json.put("sourceCode", sourceCode);
        json.put("language", language);
        json.put("challenge_id", getChallengeId());

        return json;
    }

    public Exercise() {
    }

    public Exercise(String title, String description, String sourceCode, String language, Challenge challenge) {
        this.title = title;
        this.description = description;
        this.sourceCode = sourceCode;
        this.language = language;
        this.challenge = challenge;
    }

}
