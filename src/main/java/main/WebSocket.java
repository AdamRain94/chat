package main;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@ServerEndpoint("/webSocket")
public class WebSocket {

    @Autowired
    private MessageRepository messageRepository;

    private Session session;

    private static CopyOnWriteArraySet<WebSocket> webSockets = new CopyOnWriteArraySet<>();

    @OnOpen
    public void onOpen(Session session,  EndpointConfig config){
        this.session = session;
        webSockets.add(this);
    }

    @OnClose
    public void onClose(){
        webSockets.remove(this);
        System.out.println ("Есть новые отключения, всего " + webSockets.size ());
    }

    @OnMessage
    public void onMessage(String message){
        send(message);
    }

    public void send(String message){
        for (WebSocket webSocket:webSockets){
            try {
                System.out.println("сообщение - " + message);
                webSocket.session.getBasicRemote().sendText(message);
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }

}
