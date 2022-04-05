package main;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
public class ChatController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

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
    public void message(@RequestParam String message) {
        Message msg = new Message();
        String sessionId = RequestContextHolder.currentRequestAttributes().getSessionId();
        Users users = userRepository.findBySessionId(sessionId).get();
        msg.setMessage(message);
        msg.setDateTime(LocalDateTime.from(ZonedDateTime.now()));
        msg.setUsers(users);
        messageRepository.save(msg);
    }

    @GetMapping("/users")
    public List<Users> getUsers() {
        List<Users> listUsers = new ArrayList<>();
        userRepository.findAll().forEach(listUsers::add);
        return listUsers;
    }

    @GetMapping("/usersOnline")
    public List<Users> getUsersOnline() {
        List<Users> listUsersOnline = new ArrayList<>();
        userRepository.findAll().forEach(users -> {
            if (users.isOnline()) {
                listUsersOnline.add(users);
            }
        });
        return listUsersOnline;
    }

    @GetMapping("/getMessage")
    public List<Message> getMessage() {
        List<Message> listMessage = new ArrayList<>();
        messageRepository.findAll().forEach(listMessage::add);
        return listMessage;
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

    @GetMapping("/getCountOnline")
    public int getCountOnline() {
        return (int) userRepository.countByOnline(true);
    }

    @GetMapping("/getCountMessage")
    public int getCountMessage() {
        return (int) messageRepository.count();
    }
}
