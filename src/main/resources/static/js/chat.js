$(function () {

    let name = null;
    let color = null;

    $('.input-name').focus();

    function updateMessage() {
        $('.windows-messages').html('');
        $.get('/getMessage', function (response) {
            for (let i in response) {
                addOneMessage(response[i]);
            }
            $('.windows-messages').scrollTop($('.windows-messages').prop('scrollHeight'));
        });
    }

    function addOneMessage(message) {
        let messageDiv = $('<div class="message"></div>');
        let messageInfo = $('<div class="message-info"><div class="user-name flex"><p class="name" style="color: rgb(' + message.users.color + '); " onclick="addNameInInput(\'<g style=&quot;color: rgb(' + message.users.color + ')&quot;>' + message.users.name + '</g>\')"><b>' + message.users.name + '</b></p><p class="time">[' + new Date(message.dateTime).toLocaleTimeString() + ']</p></div></div>');
        let messageText = $('<div class="message-text flex"><div class="text flex">' + message.message + '</div></div>');

        messageDiv.append(messageInfo, messageText);
        $('.windows-messages').append(messageDiv);
    }


    function addMessage() {
        if ($('.windows-input').val().length > 0) {
            $.post('/message', {message: nl2br($('.windows-input').val())});
            let message = {
                type: 'message',
                dateTime: new Date().getTime(),
                message: nl2br($('.windows-input').val()),
                users: {
                    color: color,
                    name: name
                }
            }
            send(JSON.stringify(message));

        }
        $('.windows-input').val('');
        $('.windows-input').focus();
    }


    function addWindowsMessage() {

        $('.container').html('');
        let windows = $('<div class="windows flex"><div class="top flex"><div class="windows-messages"></div><div class="windows-users flex"><div class="user flex"></div></div></div><div class="bottom flex"><textarea class="windows-input" id="windows-input" maxlength="999"></textarea><button class="btn" id="btn">ОТПРАВИТЬ</button></div></div>');
        $('.container').append(windows);

        updateMessage();
        updateUsers();
        setOnline();

        $(window).focus(function () {
            setOnline();
        });

        setInterval(function () {
            $.get('/users', function (users) {
                for (let i in users) {
                    if ((new Date().getTime() - users[i].timeOnline > 30000)) {
                        $.post('/setOffline', {sessionId: users[i].sessionId});
                        let userId = {
                            type: 'delete',
                            id: users[i].id,
                        }
                        send(JSON.stringify(userId));
                    } else {
                        addUser(users[i]);
                    }
                }
            });
        }, 10000);
    }

    function addUser(user) {
        if ($("#" + user.id).length === 0) {
            $('.user').append('<p class="users-name" id="' + user.id + '" style="color: rgb(' + user.color + ')" onclick="addNameInInput(\'<g style=&quot;color: rgb(' + user.color + ')&quot;>' + user.name + '</g>\')" >' + user.name + '</p>');
        }
        // $('#' + user.id).blink(3000);
    }

    function addNameInInput(name) {
        $('.windows-input').append(name);
    }

    function deleteUser(userId) {
        $('#' + userId).remove();
    }

    function setOnline() {
        $.get('/setOnline', function (usr) {
            color = usr.color;
            name = usr.name;
            let user = {
                type: 'add',
                id: usr.id,
                color: usr.color,
                name: usr.name
            }
            send(JSON.stringify(user));
        });
    }

    function updateUsers() {
        $('.user').html('');
        $.get('/users', function (users) {
            for (let i in users) {
                addUser(users[i]);
            }
        });
    }

    $.get('/sessionId', function (response) {
        if (response) {
            addWindowsMessage();
        } else {
            let reg = $('<div class="reg flex"><h1 class="welcome">ДОБРО ПОЖАЛОВАТЬ!</h1><h2 class="nik-name">Введите свой никнейм</h2><textarea class="input-name flex" maxlength="12" id="input-name"></textarea><button class="entry" id="entry">ВОЙТИ</button></div>');
            $('.container').append(reg);
            $('.input-name').focus();
        }
    });

    function entry() {
        if ($('.input-name').val().length > 0) {
            $.post('/nikname', {nik: $('.input-name').val()}, function () {
                addWindowsMessage();
            });
        }
    }


    $(document).on('keydown', '.input-name', function (e) {
        if (e.keyCode === 32) {
            e.preventDefault();
        }
    });

    $(document).on('keydown', '.input-name', function (e) {
        if ((e.keyCode === 13 || e.keyCode === 10)) {
            e.preventDefault();
            entry();
        }
    });

    $(document).on('keydown', '.windows-input', function (e) {
        if (e.ctrlKey && (e.keyCode === 13 || e.keyCode === 10)) {
            let caretStart = this.selectionStart;
            let caretEnd = this.selectionEnd;
            this.value = (this.value.substring(0, caretStart) + "\n" + this.value.substring(caretEnd));
            this.setSelectionRange(caretStart + 1, caretEnd + 1);
        } else if ((e.keyCode === 13 || e.keyCode === 10)) {
            e.preventDefault();
            addMessage();
        }
    });

    $(document).on('click', '.btn', addMessage);
    $(document).on('click', '.entry', entry);

    function nl2br(text) {
        return text.replace(/(\r\n|\n\r|\r|\n)/g, "<br>");
    }

    let webSocket;

    if ('WebSocket' in window) {
        openWebSocket();
    }

    function openWebSocket() {
        webSocket = new WebSocket('wss://chatik-adamrain-prod.herokuapp.com/webSocket');

        webSocket.onopen = function () {
        }

        webSocket.onmessage = function (response) {
            let object = JSON.parse(response.data);
            if (object.type === "message") {
                addOneMessage(object);
                $('.windows-messages').animate({scrollTop: $('.windows-messages').prop('scrollHeight')}, 700);
            } else if (object.type === "delete") {
                deleteUser(object.id);
            } else if (object.type === "add") {
                addUser(object);
            }
        }

        webSocket.onclose = function () {
            openWebSocket();
        }
    }

    function send(message) {
        webSocket.send(message);
    }

    function consoleLog(message) {
        console.log(message);
    }
});