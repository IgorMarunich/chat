
function validateUsername(str) {

    str = str.trim();

    String.prototype.every = Array.prototype.every;

    return (str.every(el => /[\w\ \+\-\_]/.test(el)) && (str.length >= 3 && str.length <= 20));
}

function onConnectionPermission(data) {

    if (!data) {
        alert('your password does not match');
        return;
    }

    data = JSON.parse(data);

    $('body').html(data.tpl);

    dataTransporter(data.user, new WebSocket("ws://localhost:3001", data.user.id));
}

let savedUser = localStorage["savedUser"];
let username = '';
let password = '';

const buttonSignIn = $('#sign-in');
const elUsername = $('#username');
const elPassword = $('#password');

function countCharInputs (){
    if (username.length >= 3 && password.length >= 3) {
        buttonSignIn.prop('disabled', false);
    } else buttonSignIn.prop('disabled', true);
}
elUsername.keyup(function () {
    username = this.value;
    countCharInputs();
});
elPassword.keyup(function () {
    password = this.value;
    countCharInputs();
});

function onLogin () {

    if (arguments.length > 1) {
        username = arguments[0];
        password = arguments[1];
    }

        if (validateUsername(username) && password !== '') {
            $.ajax({
                method: "POST",
                url: "/check",
                data: {
                    username: username,
                    password: password
                }
            }).done(function( data ) {

                localStorage.setItem("savedUser", JSON.stringify({username: username, password: password}));
                onConnectionPermission(data);

            });
        } else if (password === '') {
            alert('password cannot be blank');
        } else alert('nickname cannot be blank');
    }


if (savedUser) {
    const u = JSON.parse(savedUser);

    onLogin(u.username, u.password);

} else {
    $('div.container').css('display', 'block');
}

buttonSignIn.click(onLogin);






