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
        let messageText = $('<div class="message-text"><p>' + message.message + '</p></div>');

        messageDiv.append(messageInfo, messageText);
        $('.windows-messages').append(messageDiv);

        $.get('/getCountMessage', {}, function(response){
            countMessage = response;
        });

        $('.windows-messages').scrollTop($('.windows-messages').prop('scrollHeight'));
        playAudio();
    }


    function addMessage(){
        setOnline();
        if($('.windows-input').val().length > 0){
            $.post('/message', {message: $('.windows-input').val()});
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
                $.get('/getMessage', {}, function(message){
                    for(i in message){
                        if($("#" + message[i].id).length == 0) {
                          addOneMessage(message[i]);
                        }
                    }
                });
            }, 500);

            setInterval(function(){
                $.get('/users', {}, function(users){
                    for(i in users){
                        if(new Date().getTime() - users[i].timeOnline > 30000){
                            $.post('/setOffline', {sessionId : users[i].sessionId});
                            deleteUser(users[i].id);
                        } else {
                            if($("#" + users[i].id).length == 0) {
                              addUser(users[i]);
                            }
                        }
                    }
                });
            }, 7000);

        }, 1000);
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
        $.get('/users', {}, function(response){
            for(i in response){
                if(response[i].online){
                    addUser(response[i]);
                }
            }
        });
    }

    $.get('/sessionId', {}, function(response){
        if(response == "yes"){
            addWindowsMessage();
        }
    });

    function entry(){
        if($('.input-name').val().length > 0){
            $.post('/nikname', {nik: $('.input-name').val()});
            addWindowsMessage();
        }
    }

    $(document).on('keydown', '.windows-input', function(e) {
        if ((e.keyCode == 13 || e.keyCode == 10)) {
            e.preventDefault();
            addMessage();
        }
    });

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

    $(document).on('click', '.btn', addMessage);
    $(document).on('click', '.entry', entry);

    function playAudio(){
      var myAudio = new Audio;
      myAudio.src = "../audio/notification.wav";
      myAudio.play();
    }

});