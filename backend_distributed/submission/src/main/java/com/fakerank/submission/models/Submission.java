package com.fakerank.submission.models;

import org.json.JSONObject;

import jakarta.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;


    @ManyToOne
    @JoinColumn(name = "challenge_id", referencedColumnName = "id")
    private Challenge challenge;

    @Column
    private Date start_date;

    @Column
    private Date end_date;

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
    public Challenge getChallenge() {
        return challenge;
    }

    public Date getEnd_date() {
        return end_date;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public void setEnd_date(Date end_date) { this.end_date = end_date; }

    public JSONObject get_json() {
        JSONObject json = new JSONObject();
        json.put("id", id);
        json.put("user_id", user.getId());
        json.put("challenge", challenge.getId());
        json.put("start_date", start_date);
        json.put("end_date", end_date);
        json.put("rating", rating);

        return json;
    }

    public Submission() {
    }

    public Submission(User user, Challenge challenge, Date start_date, Date end_date, Integer rating) {
        this.user = user;
        this.challenge = challenge;
        this.start_date = start_date;
        this.end_date = end_date;
        this.rating = rating;
    }

}
