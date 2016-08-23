
var socket = io();

// on every message recived update view
socket.on('notification', function (data) {
  $('#challenge').html(data.challenge);
});

//in an ideal world I want the challenge to change in real time following the deadline (and not just by a page request)
socket.on('deadline', function (data) {
  $('#challenge').html(data.challenge);
});


// $('#send').click(function () {
//   console.log("sf");
//   socket.emit('expiry', "timesup");
//   return
// });
