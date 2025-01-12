package com.fakerank.submission.models;

import org.hibernate.annotations.ColumnDefault;
import org.json.JSONObject;
import org.springframework.beans.propertyeditors.StringArrayPropertyEditor;

import jakarta.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, length = 40)
    private String username;

    @Column(nullable = false, unique = true, length = 45)
    private String email;

    @ColumnDefault("false")
    private boolean email_verified;

    @Column(nullable = false, length = 64)
    private String password;
    @Column
    private Date created_at;

    @PrePersist
    protected void onCreate() {
        created_at = new Date();
    }

    public UUID getId() {
        return id;
    }

    public String getPassword() {
        return password;
    }

    public Boolean getEmailVerified() {
        return email_verified;
    }

    public Date getCreatedAt() {
        return created_at;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public JSONObject get_json() {
        JSONObject json = new JSONObject();
        json.put("id", id);
        json.put("username", username);
        json.put("email", email);

        return json;
    }


    public User() {
    }

    public User(String username, String email, String password, boolean email_verified, Date created_at) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.email_verified = email_verified;
        this.created_at = created_at;
    }

}
