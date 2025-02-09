package com.opt.ssafy.optback.domain.ai_report.exception;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice(basePackages = "com.opt.ssafy.optback.domain.ai_report")
public class AiReportExceptionHandler {

    //리뷰 저장 실패
    @ExceptionHandler(AiReportNotSaveException.class)
    ResponseEntity<Map<String, String>> handleSaveException(AiReportNotSaveException e) {
        Map<String, String> map = new HashMap<>();
        map.put("error", e.getMessage());
        return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
    }

    // 데이터 조회 실패
    @ExceptionHandler(AiReportNotFoundException.class)
    ResponseEntity<Map<String, String>> handleNotFoundException(AiReportNotFoundException e) {
        Map<String, String> map = new HashMap<>();
        map.put("error", e.getMessage());
        return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
    }

    //기타 예외
    @ExceptionHandler(Exception.class)
    ResponseEntity<Map<String, String>> handleException(Exception e) {
        Map<String, String> map = new HashMap<>();
        map.put("error", e.getMessage());
        return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
    }
}