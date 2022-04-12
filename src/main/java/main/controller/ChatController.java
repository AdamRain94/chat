package main.controller;

import main.model.Color;
import main.model.Message;
import main.model.Users;
import main.repositories.MessageRepository;
import main.repositories.UserRepository;
import main.web.WebSocket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.servlet.ModelAndView;

import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
public class ChatController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;


    @GetMapping("/client")
    public ModelAndView client() {
        return new ModelAndView("client");
    }

    @GetMapping("/sessionId")
    public boolean SessionId() {
        String sessionId = RequestContextHolder.currentRequestAttributes().getSessionId();
        Optional<Users> optionalUsers = userRepository.findBySessionId(sessionId);
        if (optionalUsers.isPresent()) {
            return true;
        } else return false;
    }

    @PostMapping("/nikname")
    public void nikName(@RequestParam String nik) {
        Users users = new Users();
        users.setSessionId(RequestContextHolder.currentRequestAttributes().getSessionId());
        users.setName(nik);
        users.setOnline(true);
        users.setTimeOnline(new Date().getTime());
        users.setColor(Color.getColor());
        userRepository.save(users);
    }

    @PostMapping("/message")
    public Message message(@RequestParam String message) {
        Message msg = new Message();
        String sessionId = RequestContextHolder.currentRequestAttributes().getSessionId();
        Users user = userRepository.findBySessionId(sessionId).get();
        user.setOnline(true);
        msg.setMessage(message);
        msg.setDateTime(ZonedDateTime.now());
        msg.setUsers(user);
        setOnline();
        messageRepository.save(msg);
        return msg;
    }

    @GetMapping("/users")
    public List<Users> getUsers() {
        return userRepository.findByOnline(true);
    }

    @GetMapping("/getMessage")
    public List<Message> getMessage() {
        List<Message> messages = messageRepository.findFirst30ByOrderByDateTimeDesc();
        Collections.sort(messages);
        return messages;
    }

    @GetMapping("/setOnline")
    public Users setOnline() {
        String sessionId = RequestContextHolder.currentRequestAttributes().getSessionId();
        Users users = userRepository.findBySessionId(sessionId).get();
        users.setTimeOnline(new Date().getTime());
        users.setOnline(true);
        userRepository.save(users);
        return users;
    }

    @PostMapping("/setOffline")
    public void setOffline(@RequestParam String sessionId) {
        Users users = userRepository.findBySessionId(sessionId).get();
        users.setOnline(false);
        userRepository.save(users);
    }
}
