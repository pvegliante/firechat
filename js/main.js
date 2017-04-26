var config = {
    apiKey: "AIzaSyDYxCVNAo6Z1b80m8Tx6IxkLTYoH-LidLw",
    authDomain: "firechat-ceb49.firebaseapp.com",
    databaseURL: "https://firechat-ceb49.firebaseio.com",
    projectId: "firechat-ceb49",
    storageBucket: "firechat-ceb49.appspot.com",
    messagingSenderId: "18688101805"
};
firebase.initializeApp(config);

var db = firebase.database();
var messagesRef = db.ref('messages/');

function sendMessage(user) {
    messagesRef.push({
        user: user.displayName,
        message: $("#message-input").val(),
        photo: user.photoURL
    });
    $("#message-input").val("");
    window.scrollTo(0,document.body.scrollHeight);
}

function loadMessages() {
    messagesRef.limitToLast(100).on('value', function(snapshot) {
        //console.log(snapshot.val());
        $("#messages").html("");
        var values = snapshot.val();
        for (var msgId in values) {
            var msg = values[msgId];
            $("#messages").append(`
                <div class="message-container">
                    <img class="user-photo" src=${msg.photo} alt=${msg.user} />
                    <div class="text">
                        <p class="user-name">${msg.user}</p>
                        <p class="message">${msg.message}</p>
                    </div>
                </div>
            `);
        }
    });
}


// DEVELOPMENT CODE; delete the following code for production
loadMessages()
// end development code


function login() {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;

       $('#login-screen').fadeOut(function() {
            $("#chat-screen").css('display', 'flex');
        });

       loadMessages()

       document.addEventListener("keydown", function(e) {
            if (e.keyCode === 13)
                sendMessage(user);
            }
        );
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + " - " + errorMessage);
    });
}

$('#login-btn').click(login)
