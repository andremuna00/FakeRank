package com.fakerank.challenge.models;

import org.json.JSONObject;

import jakarta.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity(name = "challenges")
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false)
    private Date start_date;

    @Column(nullable = false)
    private Date end_date;

    @ManyToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private User owner;

    @Column
    private Date created_at;

    @Column(nullable = false, length = 40)
    private String key;

    @PrePersist
    protected void onCreate() {
        created_at = new Date();
    }

    public UUID getOwnerId() {
        return owner.getId();
    }

    public UUID getId() {
        return id;
    }
    public String getTitle() {
        return title;
    }

    public Date getStart_date() {
        return start_date;
    }

    public Date getEnd_date() {
        return end_date;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public String getKey() {
        return key;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setStart_date(Date start_date) {
        this.start_date = start_date;
    }

    public void setEnd_date(Date end_date) {
        this.end_date = end_date;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public JSONObject get_json() {
        JSONObject json = new JSONObject();
        json.put("id", id);
        json.put("title", title);
        json.put("start_date", start_date);
        json.put("end_date", end_date);
        return json;
    }

    public Challenge() {
    }

    public Challenge(String title, Date start_date, Date end_date, User owner, String key) {
        this.title = title;
        this.start_date = start_date;
        this.end_date = end_date;
        this.owner = owner;
        this.key = key;
    }
}
