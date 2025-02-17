package com.opt.ssafy.optback.domain.follow.api;

import com.opt.ssafy.optback.domain.follow.application.FollowService;
import com.opt.ssafy.optback.domain.follow.dto.FollowResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @GetMapping("/following")
    public ResponseEntity<List<FollowResponse>> getFollowing() {
        return ResponseEntity.ok(followService.getFollowingList());
    }

    @GetMapping("/follower")
    public ResponseEntity<List<FollowResponse>> getFollower() {
        return ResponseEntity.ok(followService.getFollowerList());
    }



    @PostMapping
    public ResponseEntity<Void> follow(@RequestParam int targetId) {
        followService.follow(targetId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{targetId}")
    public ResponseEntity<Void> unfollow(@PathVariable int targetId) {
        followService.unfollow(targetId);
        return ResponseEntity.ok().build();
    }
}
