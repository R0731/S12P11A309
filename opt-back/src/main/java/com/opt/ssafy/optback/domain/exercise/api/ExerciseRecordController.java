package com.opt.ssafy.optback.domain.exercise.api;

import com.opt.ssafy.optback.domain.exercise.application.ExerciseRecordService;
import com.opt.ssafy.optback.domain.exercise.dto.CreateExerciseRecordRequest;
import com.opt.ssafy.optback.domain.exercise.dto.UpdateExerciseRecordRequest;
import com.opt.ssafy.optback.global.dto.SuccessResponse;
import jakarta.annotation.Nullable;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exercise-records")
public class ExerciseRecordController {

    private final ExerciseRecordService exerciseRecordService;

    @PostMapping
    public ResponseEntity<SuccessResponse> createExerciseRecord(
            @RequestPart(name = "data") CreateExerciseRecordRequest request,
            @RequestPart @Nullable List<MultipartFile> medias) throws IOException {
        exerciseRecordService.createExerciseRecord(request, medias);
        return ResponseEntity.ok(SuccessResponse.builder()
                .message("등록되었습니다").build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<SuccessResponse> deleteExerciseRecord(@PathVariable Integer id) {
        exerciseRecordService.deleteExerciseRecord(id);
        return ResponseEntity.ok(SuccessResponse.builder().message("삭제되었습니다").build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SuccessResponse> updateExerciseRecord(
            @PathVariable Integer id,
            @RequestPart(name = "data") UpdateExerciseRecordRequest request,
            @RequestPart @Nullable List<MultipartFile> medias) throws IOException {
        exerciseRecordService.updateExerciseRecord(id, request, medias);
        return ResponseEntity.ok(SuccessResponse.builder()
                .message("수정되었습니다").build());
    }

}
