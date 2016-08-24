
var socket = io();

// on every message recived update view
socket.on('notification', function (data) {
  $('#challenge').html(data.challenge);

  var deadline = moment.tz(data.deadline, "America/New_York");

  console.log(data.deadline);

  $('#clock').countdown(deadline.toDate(), function(event) {
    $(this).html(event.strftime('%D days %H:%M:%S'))
    .on("finish.countdown", function(){
      console.log("hi");
      socket.emit('expiry', "timesup");
    })
  });


});

//in an ideal world I want the challenge to change in real time following the deadline (and not just by a page request)
socket.on('error', function (data) {
  $('#error').html(data);
});
