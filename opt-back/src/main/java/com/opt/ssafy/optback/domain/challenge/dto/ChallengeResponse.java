package com.opt.ssafy.optback.domain.challenge.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.Date;

@Getter
@Builder
public class ChallengeResponse {
    private int id;
    private String type;
    private String title;
    private String description;
    private String reward;
    private int templateId;
    private int hostId;
    private Integer winnerId;
    private Date startDate;
    private Date endDate;
    private String status;
    private Date createdAt;
    private Integer currentParticipants;
    private int maxParticipants;
    private int frequency;
    private Float progress;
    private String imagePath;
    private String exerciseType;
    private int exerciseCount;
}
