package com.opt.ssafy.optback.domain.profile;

import com.opt.ssafy.optback.domain.badge.dto.BadgeResponse;
import com.opt.ssafy.optback.domain.badge.entity.Badge;
import com.opt.ssafy.optback.domain.member.entity.Member;
import com.opt.ssafy.optback.domain.member.entity.MemberInterest;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class TrainerProfileResponse extends ProfileResponse {
    private String name;

    public static TrainerProfileResponse from(Member member, Badge mainBadge) {
        return TrainerProfileResponse.builder()
                .id(member.getId())
                .role(member.getRole().name())
                .name(member.getName())
                .mainBadge(mainBadge == null ? null : new BadgeResponse(mainBadge))
                .nickname(member.getNickname())
                .imagePath(member.getImagePath())
                .interests(member.getMemberInterests().stream().map(MemberInterest::getInterest)
                        .collect(Collectors.toList()))
                .build();
    }

    public static TrainerProfileResponse from(Member member) {
        return TrainerProfileResponse.builder()
                .id(member.getId())
                .role(member.getRole().name())
                .name(member.getName())
                .nickname(member.getNickname())
                .imagePath(member.getImagePath())
                .interests(member.getMemberInterests().stream().map(MemberInterest::getInterest)
                        .collect(Collectors.toList()))
                .build();
    }
}
