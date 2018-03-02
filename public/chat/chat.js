
let socket = {};

$.get('/messages').done(function( msg ) {

    msg = JSON.parse(msg);

    for (let i = 0; i < msg.messages.length; i++) {
        showMessage(msg.messages[i]);
    }

    $("#subscribe").scrollTop(999999999999);

});

$('div#log-text').click(() => {
    socket.send(JSON.stringify({
        sendKey: 'logout',
        id: currentUser.id
    }));
    localStorage['savedUser'] = '';
    window.location.href = '/';
});

let currentUser = {};

function dataTransporter(user, wsc) {

    $('#nickname').append(user.name);

    currentUser = user;

    socket = wsc;
    waitConnection();
}

let inp = $('form#form-chat input.counter');
$("input[name=message]").keyup(function () {
    inp.val(this.value.length + '/200');
});


$('form[name=publish]').submit(function() {
    let outgoingMessage = this.message.value;

    $("input[name=message]").val("").prop("disabled", true);
    inp.val('0/200');

    setTimeout(() => {
        $("input[name=message]").prop("disabled", false);
    }, 15000);

    socket.send(JSON.stringify({
        sendKey: 'message',
        m: outgoingMessage.trim(),
        id: currentUser.id,
        color: currentUser.color,
        name: currentUser.name
    }));
    return false;
});

// waits connection and opens events listeners
function waitConnection() {
    socket.onmessage = (event) => {

        let d = JSON.parse(event.data);

        switch (d.key){
            case 'ids':
                showClientsOnline(d.data);
                break;
            case 'logout':
                showClientsOnline(d.data);
                break;
            case 'ban':
                showClientsOnline(d.data);
                break;
            case 'mute':
                alert('You are muted');
                $("input[name=message]").val("").prop("disabled", true);
                $("form#form-chat input[type=submit]").prop("disabled", true);
                break;
            case 'message':
                showMessage(JSON.parse(d.data));
                break;
            default:
                console.log("cannot get data");
        }

        $("#subscribe").scrollTop(999999999999);

    };
    socket.onclose = (event) => {
        if (event.wasClean) {
            alert('Connection is closed');
        } else {
            alert('Connection gap');
        }
    };
}

function showClientsOnline(c) {

    $.ajax({
        method: "POST",
        url: "/users",
        data: {
            users: c,
        }
    }).done(function( data ) {

        let users = $('#online-users');
        let html = ``;


        JSON.parse(data).forEach((user) => {
            if (user.username !== 'admin') {
                html += `<div style="color: ${user.color}">${user.username}</div>`;
            }
        });

        users.html('<button class="remove"><span class="glyphicon glyphicon-remove"></span></button>' + html);

    });

}
// show messages in the div#subscribe
function showMessage(data) {

    let time = (d) => {

        if (d){
            d = new Date(d);
        } else d = new Date();

        let month = d.getMonth() + 1;
        let date = d.getDate();
        let hours = d.getHours();
        let minutes = d.getMinutes();
        let year = d.getFullYear() % 100;

        if (month < 10) month = '0' + month;
        if (date < 10) date = '0' + date;
        if (hours < 10) hours = '0' + hours;
        if (minutes < 10) minutes = '0' + minutes;
        if (year < 10) year = '0' + year;

        return `${hours}:${minutes} ${date}/${month}/${year}`;
    };
    $('#subscribe').append(`<div class="wrapper-massage" style="color: ${data.color}"><p class="mess"><span class="name">${data.name} </span>: ${data.m}</p><p class="date">${time(data.created)}</p></div>`);
}

$("button.arrow").click(() => {

    $("div#online-users").css('display', 'block');

    $("button.remove").click(() => {

        $("div#online-users").css('display', 'none');

    });
});
// $("button.remove").click(() => {
//     console.log("button.remove).click(()");
//     $("div#online-users").css('display', 'none');
// });