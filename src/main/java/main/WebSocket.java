package main;


import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.util.concurrent.CopyOnWriteArraySet;

import org.springframework.stereotype.Component;

import javax.websocket.server.ServerEndpoint;

@Component
@ServerEndpoint("/webSocket")
public class WebSocket {

    private Session session;

    private static CopyOnWriteArraySet<WebSocket> webSockets = new CopyOnWriteArraySet<>();

    @OnOpen
    public void onOpen(Session session){
        this.session = session;
        System.out.println("это this - " + this);
        webSockets.add(this);
        System.out.println ("Всего новых подключений" + webSockets.size ());
    }

    @OnClose
    public void onClose(){
        webSockets.remove(this);
        System.out.println ("Есть новые отключения, всего" + webSockets.size ());
    }


    @OnMessage
    public void onMessage(String message){

        System.out.println(message);

        send(message);
    }

    public void send(String message){
        for (WebSocket webSocket:webSockets){
            try {
                System.out.println("ЭТО ОНО - " + message);
                webSocket.session.getBasicRemote().sendText(message);
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }

}
