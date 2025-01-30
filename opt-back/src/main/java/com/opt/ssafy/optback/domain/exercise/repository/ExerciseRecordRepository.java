package com.opt.ssafy.optback.domain.exercise.repository;

import com.opt.ssafy.optback.domain.exercise.entity.ExerciseRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseRecordRepository extends JpaRepository<ExerciseRecord, Integer> {
}
