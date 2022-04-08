$(function(){

    $('.input-name').focus();

    function updateMessage(){
        $('.windows-messages').html('');
        $.get('/getMessage', {}, function(response){
            for(i in response){
                addOneMessage(response[i]);
            }
        });
    }

    function addOneMessage(message){

        let messageDiv = $('<div class="message"></div>');
        let messageInfo = $('<div class="message-info"><div class="user-name flex"><p class="name" id="' + message.id + '" style="color: rgb(' + message.users.color + '); "><b>' + message.users.name + '</p><p class="time">[' + new Date(message.dateTime).toLocaleTimeString() + ']</p></div></div>');
        let messageText = $('<div class="message-text"><p class="text">' + message.message + '</p></div>');

        messageDiv.append(messageInfo, messageText);
        $('.windows-messages').append(messageDiv);
        $('.windows-messages').scrollTop($('.windows-messages').prop('scrollHeight'));
    }


    function addMessage(){
        setOnline();
        if($('.windows-input').val().length > 0){
            $.post('/message', {message: nl2br($('.windows-input').val())}, function(messageId){
                send(messageId)
            });
        }
        $('.windows-input').val('');
        $('.windows-input').focus();
    }


    function addWindowsMessage(){

        $('.container').html('');
        let windows = $('<div class="windows flex"><div class="top flex"><div class="windows-messages"></div><div class="windows-users flex"><div class="user flex"></div></div></div><div class="bottom flex"><textarea class="windows-input" id="windows-input" maxlength="999"></textarea><button class="btn" id="btn">ОТПРАВИТЬ</button></div></div>');
        $('.container').append(windows);

        setTimeout(function(){

            updateMessage();
            updateUsers();

            $(window).focus(function() {
                setOnline();
            });

            setInterval(function(){
                $.get('/users', {}, function(users){
                    for(i in users){
                        if((new Date().getTime() - users[i].timeOnline > 30000) && users[i].online){
                            $.post('/setOffline', {sessionId : users[i].sessionId});
                            deleteUser(users[i].id);
                        } else if (users[i].online) {
                            if($("#" + users[i].id).length == 0) {
                              addUser(users[i]);
                            }
                        }
                    }
                });
            }, 7000);

        }, 1);
    }

    function addUser(user){
        $('.user').append('<p class="users-name" id="' + user.id + '" style="color: rgb(' + user.color + ')" >' + user.name + '</p>');
    }
    function deleteUser(userId){
        $('#' + userId).remove();
    }
    function setOnline(){
        $.get('/setOnline', {});
    }
    function updateUsers(){
        $('.user').html('');
        $.get('/users', {}, function(users){
            for(i in users){
                addUser(users[i]);
            }
        });
    }

    $.get('/sessionId', {}, function(response){
        if(response == "yes"){
            addWindowsMessage();
        } else {
            let reg = $('<div class="reg flex"><h1 class="welcome">ДОБРО ПОЖАЛОВАТЬ!</h1><h2 class="nik-name">Введите свой никнейм</h2><textarea class="input-name flex" maxlength="12" id="input-name"></textarea><button class="entry" id="entry">ВОЙТИ</button></div>');
            $('.container').append(reg);
        }
    });

    function entry(){
        if($('.input-name').val().length > 0){
            $.post('/nikname', {nik: $('.input-name').val()});
            addWindowsMessage();
        }
    }


    $(document).on('keydown', '.input-name', function(e) {
        if (e.keyCode == 32) {
            e.preventDefault();
        }
    });

    $(document).on('keydown', '.input-name', function(e) {
        if ((e.keyCode == 13 || e.keyCode == 10)) {
            e.preventDefault();
            entry();
        }
    });

    $(document).on('keydown', '.windows-input', function(e) {
        if (e.ctrlKey && (e.keyCode == 13 || e.keyCode == 10)) {
            caretStart = this.selectionStart;
            caretEnd = this.selectionEnd;
            this.value = (this.value.substring(0, caretStart) + "\n" + this.value.substring(caretEnd));
            this.setSelectionRange(caretStart + 1 ,caretEnd + 1);
        } else if ((e.keyCode == 13 || e.keyCode == 10)) {
            e.preventDefault();
            addMessage();
        }
    });

    $(document).on('click', '.btn', addMessage);
    $(document).on('click', '.entry', entry);

    nl2br = function(text){
        return text.replace(/(\r\n|\n\r|\r|\n)/g, "<br>");
    };




//webSocket для тестирования локально
//    let  webSocket = new WebSocket('ws://localhost:8080/webSocket');

    if ('WebSocket' in window){
        webSocket = new WebSocket('wss://chatik-adamrain-prod.herokuapp.com/webSocket');
    } else{
        send("Текущий браузер не поддерживает WebSocket");
    }

    webSocket.onopen = function () {
                 consoleLog("WebSocket успешно подключен!")
    }

    webSocket.onmessage = function (messageId) {
         $.get('/getMessageById', {id : messageId.data}, function(message){
               addOneMessage(message);
         });
    }

    webSocket.onclose = function () {
         consoleLog("Соединение WebSocket закрыто");
    }

    window.onbeforeunload = function () {
        closeWebSocket();
    }

    function closeWebSocket() {
        webSocket.close();
    }

    function send(message) {
        webSocket.send(message);
    }

    function consoleLog(message) {
        console.log(message);
    }
});