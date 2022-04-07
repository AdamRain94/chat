package main;


import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@ServerEndpoint(value = "/webSocket")
public class WebSocket {

    private Session session;

    private static CopyOnWriteArraySet<WebSocket> webSockets = new CopyOnWriteArraySet<>();

    @OnOpen
    public void onOpen(Session session,  EndpointConfig config){
        this.session = session;
        System.out.println ("Есть новые подключения, всего " + webSockets.size ());
        webSockets.add(this);
    }

    @OnClose
    public void onClose(){
        webSockets.remove(this);
        System.out.println ("Есть новые отключения, всего " + webSockets.size ());
    }

    @OnMessage
    public void onMessage(String  message) {
        send(message);
    }

    public void send(String message){
        for (WebSocket webSocket:webSockets){
            try {
                webSocket.session.getBasicRemote().sendText(message);
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }

}
