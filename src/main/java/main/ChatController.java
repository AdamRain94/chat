package main;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;

import java.time.LocalDateTime;
import java.time.ZoneId;
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

//
//    @GetMapping("/client")
//    public ModelAndView client() {
//        return new ModelAndView("client");
//    }

    @GetMapping("/sessionId")
    public String SessionId() {
        String sessionId = RequestContextHolder.currentRequestAttributes().getSessionId();
        Optional<Users> optionalUsers = userRepository.findBySessionId(sessionId);
        if (optionalUsers.isPresent()) {
            return "yes";
        } else return "no";
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
    public int message(@RequestParam String message) {
        Message msg = new Message();
        String sessionId = RequestContextHolder.currentRequestAttributes().getSessionId();
        Users users = userRepository.findBySessionId(sessionId).get();
        msg.setMessage(message);
        msg.setDateTime(LocalDateTime.from(ZonedDateTime.now()));
        msg.setUsers(users);
        messageRepository.save(msg);
        return msg.getId();
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

    @GetMapping("/getMessageById")
    public Message getMessageById(int id) {
        return messageRepository.findById(id).get();
    }

    @GetMapping("/setOnline")
    public void setOnline() {
        String sessionId = RequestContextHolder.currentRequestAttributes().getSessionId();
        Users users = userRepository.findBySessionId(sessionId).get();
        users.setTimeOnline(new Date().getTime());
        users.setOnline(true);
        userRepository.save(users);
    }

    @PostMapping("/setOffline")
    public void setOffline(@RequestParam String sessionId) {
        Users users = userRepository.findBySessionId(sessionId).get();
        users.setOnline(false);
        userRepository.save(users);
    }

}
