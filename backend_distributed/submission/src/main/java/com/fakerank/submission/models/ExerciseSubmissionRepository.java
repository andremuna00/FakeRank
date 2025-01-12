package com.fakerank.submission.models;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ExerciseSubmissionRepository extends JpaRepository<ExerciseSubmission, UUID> {
}
