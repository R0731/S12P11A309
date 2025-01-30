package com.opt.ssafy.optback.domain.member.entity;

import com.opt.ssafy.optback.domain.exercise.entity.FavoriteExercise;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@DynamicInsert
@Getter
@Table(name = "member")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "password", length = 100)
    private String password;

    @Column(name = "name", length = 10)
    private String name;

    @Column(name = "nickname", length = 10, unique = true)
    private String nickname;

    @Column(name = "oauth_type", length = 10)
    private String oauthType;

    @Column(name = "image_path", length = 255)
    private String imagePath;

    @Column(name = "email", length = 100, unique = true)
    private String email;

    @Column(name = "created_date")
    @Temporal(TemporalType.DATE)
    private Date createdDate = new Date();

    @Column(name = "is_deleted")
    private boolean isDeleted;

    @Column(name = "is_onboarded")
    private boolean isOnboarded;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<MemberInterest> memberInterests;

    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private TrainerDetail trainerDetail;

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updateProfileImage(String imagePath) {
        this.imagePath = imagePath;
    }

    public void updateInterests(List<MemberInterest> newInterests) {
        this.memberInterests.clear();
        this.memberInterests.addAll(newInterests);
    }

    @OneToMany(mappedBy = "member")
    private List<FavoriteExercise> favoriteExercises;

}
