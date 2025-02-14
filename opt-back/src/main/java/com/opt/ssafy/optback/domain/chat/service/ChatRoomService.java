package com.opt.ssafy.optback.domain.chat.service;

import com.opt.ssafy.optback.domain.auth.application.UserDetailsServiceImpl;
import com.opt.ssafy.optback.domain.chat.entity.ChatMessage;
import com.opt.ssafy.optback.domain.chat.entity.ChatRoom;
import com.opt.ssafy.optback.domain.chat.exception.ChatRoomException;
import com.opt.ssafy.optback.domain.chat.repository.ChatMessageRepository;
import com.opt.ssafy.optback.domain.chat.repository.ChatRoomRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserDetailsServiceImpl userDetailsService;
    private final ChatMessageRepository chatMessageRepository;
    private final SystemMessageService systemMessageService;

    // 채팅방 생성
    @Transactional
    public ChatRoom getOrCreateRoom(int otherMemberId) {
        int loginMemberId = userDetailsService.getMemberByContextHolder().getId();
        String roomName = ChatRoom.generateRoomName(loginMemberId, otherMemberId);

        log.info("📩 채팅방 생성 요청: 로그인 사용자 ID = {}, 상대방 ID = {}", loginMemberId, otherMemberId);

        List<ChatRoom> existingRooms = chatRoomRepository.findByRoomName(roomName);

        // 새 채팅방 생성 판단
        for (ChatRoom room : existingRooms) {
            if (room.getParticipants().contains(loginMemberId) && room.getParticipants().contains(otherMemberId)) {
                log.info("📩 기존 채팅방 반환: Room ID = {}", room.getId());
                return room;
            }
        }

        ChatRoom newRoom = ChatRoom.builder()
                .id(UUID.randomUUID().toString())
                .roomName(roomName)
                .participants(List.of(loginMemberId, otherMemberId))
                .build();

        chatRoomRepository.save(newRoom);
        log.info("📩 새 채팅방 생성 완료: Room ID = {}", newRoom.getId());
        return newRoom;
    }

    //채팅방 나가기
    @Transactional
    public void leaveChatRoom(String roomId) {
        int memberId = userDetailsService.getMemberByContextHolder().getId();
        log.info("📩 채팅방 목록 요청: 사용자 ID = {}", memberId);
        Optional<ChatRoom> optionalChatRoom = chatRoomRepository.findById(roomId);
        if (optionalChatRoom.isEmpty()) {
            throw new ChatRoomException("❌ 채팅방을 찾을 수 없습니다");
        }

        ChatRoom chatRoom = optionalChatRoom.get();

        // 참여자 목록에서 제거
        List<Integer> updatedParticipants = new ArrayList<>(chatRoom.getParticipants());
        log.info("📩 사용자 {}의 채팅방 개수: {}", memberId, updatedParticipants.size());
        updatedParticipants.remove(Integer.valueOf(memberId));

        if (updatedParticipants.isEmpty()) {
            try {
                chatRoomRepository.delete(chatRoom);
            } catch (ChatRoomException e) {
                throw new ChatRoomException("채팅방 나가기 실패");
            }
        } else {
            chatRoom.setParticipants(updatedParticipants);
            chatRoomRepository.save(chatRoom);
        }
    }

    // 사용자가 속한 채팅방 목록 조회
    public List<ChatRoom> getUserChatRooms() {
        int userId = userDetailsService.getMemberByContextHolder().getId();

        List<ChatRoom> chatRooms = chatRoomRepository.findByParticipantsContaining(userId);

        // 최근 메시지 순으로 정렬
        chatRooms.sort((room1, room2) -> {
            ChatMessage latestMessage1 = chatMessageRepository
                    .findTopByRoomIdOrderByCreatedAtDesc(room1.getId());
            ChatMessage latestMessage2 = chatMessageRepository
                    .findTopByRoomIdOrderByCreatedAtDesc(room2.getId());

            LocalDateTime time1 = (latestMessage1 != null) ? latestMessage1.getCreatedAt() : LocalDateTime.MIN;
            LocalDateTime time2 = (latestMessage2 != null) ? latestMessage2.getCreatedAt() : LocalDateTime.MIN;

            return time2.compareTo(time1);
        });

        return chatRooms;
    }
}

