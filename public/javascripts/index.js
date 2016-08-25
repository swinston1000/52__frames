
var socket = io();
var emit = true

// on every message recived update view
socket.on('notification', function (data) {
  emit = true; //wait for the next expiry
  $('#challenge').html(data.challenge);
  $('#credit').html("Extra Credit: " + data.credit);

  var deadline = moment.tz(data.deadline, "America/New_York");

  //console.log(data.deadline);

  $('#clock').countdown(deadline.toDate(), function(event) {
    $(this).html(event.strftime('%-D day%!D, %-H hour%!H, %-M minute%!M and %-S second%!S'))
    .on("finish.countdown", function(){
      //for some reason there are multiple events but we only want to fire the expiry once.
      if(emit)  {
        socket.emit('expiry', "times_is_up");
        emit = false;
      }
    })
  });


});

//in an ideal world I want the challenge to change in real time following the deadline (and not just by a page request)
socket.on('error', function (data) {
  $('#error').html(data);
});
