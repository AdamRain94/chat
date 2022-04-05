$(function(){
    let countMessage = 0;
    let countOnline = 0;
    let Online = true;
    $('.input-name').focus();

    let updateMessage = function(){

        $('.windows-messages').html('');

        $.get('/getMessage', {}, function(response){
            countMessage = response.length;
            for(i in response){
                addOneMessage(response[i]);
            };
        });

    }

    let addOneMessage = function(message){

        let messageDiv = $('<div class="message"></div>');
        let messageInfo = $('<div class="message-info"><div class="user-name flex"><p class="name" id="' + message.id + '" style="color: rgb(' + message.users.color + '); "><b>' + message.users.name + '</p><p class="time">[' + new Date(message.dateTime).toLocaleTimeString() + ']</p></div></div>');
        let messageText = $('<div class="message-text"><p>' + message.message + '</p></div>');

        messageDiv.append(messageInfo, messageText);
        $('.windows-messages').append(messageDiv);

        $.get('/getCountMessage', {}, function(response){
            countMessage = response;
        });

        $('.windows-messages').scrollTop($('.windows-messages').prop('scrollHeight'));

    }


    let addMessage = function(){

        if($('.windows-input').val().length > 0){
            $.post('/message', {message: $('.windows-input').val()});
        }

        $('.windows-input').val('');
        $('.windows-input').focus();

    };


    let addWindowsMessage = function(){

        $('.container').html('');
        let windows = $('<div class="windows flex"><div class="top flex"><div class="windows-messages"></div><div class="windows-users flex"><div class="user flex"></div></div></div><div class="bottom flex"><textarea class="windows-input" id="windows-input"></textarea><button class="btn" id="btn">Отправить</button></div></div>');
        $('.container').append(windows);

        setTimeout(function(){

            updateMessage();
            updateUsers();

            setInterval(function(){

                $.get('/getMessage', {}, function(response){
                   if(!(response.length == countMessage)){
                       addOneMessage(response[response.length-1]);
                   }
                });

                $.get('/getCountOnline', {}, function(response){
                   if(!(response == countOnline)){
                       updateUsers();
                   }
                });

                console.log(Online);

                window.onfocus = function(){
                    $.get('/setOnline', {});
                    Online = true;
                }

                window.onblur = function(){
                    Online = false;
                    setTimeout(function(){
                        if(!Online){
                            $.get('/setOffline', {});
                        }
                    }, 10000);
                }


            }, 500);

        }, 1000);

    }

    let addUsers = function(user){

        let usersSpan = ('<p class="users-name" id="' + user.id + '" style="color: rgb(' + user.color + ')" >' + user.name + '</p>');
        $('.user').append(usersSpan);
        $('.user').append('<script>document.getElementById("' + user.id + '").onclick = function () { document.getElementById("windows-input").innerText ="' + user.name  + '" };</script>');

    };

    let updateUsers = function(){

        $('.user').html('');

        $.get('/users', {}, function(response){
            countOnline = 0;
            for(i in response){
                if(response[i].online){
                    countOnline++;
                    addUsers(response[i]);
                };
            };
        });
    };

    $.get('/sessionId', {}, function(response){

        if(response == "yes"){
            addWindowsMessage();
        }

    });

    let entry = function(){

        if($('.input-name').val().length > 0){
            $.post('/nikname', {nik: $('.input-name').val()});
            addWindowsMessage();
        }

    }

    $(document).on('keydown', '.windows-input', function(e) {

        if ((e.ctrlKey || e.metaKey) && (e.keyCode == 13 || e.keyCode == 10)) {
            addMessage();
        }

    });

    $(document).on('keydown', '.input-name', function(e) {

        if ((e.keyCode == 13 || e.keyCode == 10)) {
            entry();
        }

    });

    $(document).on('click', '.btn', addMessage);
    $(document).on('click', '.entry', entry);

});