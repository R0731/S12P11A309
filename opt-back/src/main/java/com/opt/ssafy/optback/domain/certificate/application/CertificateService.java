package com.opt.ssafy.optback.domain.certificate.application;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opt.ssafy.optback.domain.auth.application.UserDetailsServiceImpl;
import com.opt.ssafy.optback.domain.certificate.dto.CertificateDto;
import com.opt.ssafy.optback.domain.certificate.entity.Certificate;
import com.opt.ssafy.optback.domain.certificate.infrastructure.CertificateProducer;
import com.opt.ssafy.optback.domain.certificate.infrastructure.CertificateRepository;
import com.opt.ssafy.optback.global.application.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
@RequiredArgsConstructor
public class CertificateService {

    @Value("${certificate.bucket.name}")
    private String bucketName;
    private final S3Service s3Service;
    private final CertificateProducer certificateProducer;
    private final UserDetailsServiceImpl userDetailsService;
    private final CertificateRepository certificateRepository;
    private final ObjectMapper objectMapper;

    public void registerCertificate(MultipartFile image) {
        try {
            String path = s3Service.uploadImageFile(image, bucketName);
            certificateProducer.sendCertificateMessage(path, userDetailsService.getMemberByContextHolder().getId());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void handleCertificateResponse(JsonNode jsonNode) {
        try {
            String status = jsonNode.get("status").asText();
            if (!"success".equals(status)) {
                log.error("자격증 인증 실패: {}", jsonNode);
                return;
            }
            CertificateDto dto = objectMapper.treeToValue(jsonNode, CertificateDto.class);
            Certificate certificate = Certificate.from(dto);
            certificateRepository.save(certificate);
            log.info("자격증 저장 완료: {}", certificate);
        } catch (Exception e) {
            log.error("자격증 처리 중 오류 발생: {}", e.getMessage());
        }
    }

    public void sendCertificateFailMessage(Integer memberId) {
        // TODO : 실패 메시지 보내기
    }

}
