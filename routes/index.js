var moment = require('moment-timezone');
var readSheet = require('../readsheet')
var express = require('express');
var router = express.Router();
var googleData = {}

moment.updateLocale('en', {
  week: {
    // Sunday = 0, Monday = 1 etc
    doy : 7, // This sets the first Monday of the year to be the start of week 2! Trust me it just does!
    dow : 1  // Where Monday is the first day of the week.
  }
});


module.exports = function(io) {

  router.get('/', function(req, res){

    res.render("index")

    var time = moment().tz("America/New_York")

    // //for testing
    // var formattedtime = time.format("HH:mm")
    // console.log(formattedtime);
    // var localeData = moment.localeData()
    // console.log("first date of week: " + localeData.firstDayOfWeek());
    // console.log("first day of year: " + localeData.firstDayOfYear());

    var weeknumber = time.week()

    // //for testing
    // var date = moment("2017-01-01")
    // weeknumber = date.week()
    // console.log(weeknumber);

    readSheet(weeknumber, function(err,data){
      if(err){
        //console.log("oh dear: " + err.message);
        io.emit('error', "Something went wrong: " + err.message)

      } else {
        //console.log("Yay!");
        googleData = data;
        //if page loads before data is ready
        io.emit('notification', data);
        // setTimeout(function(){io.emit('notification', data);},250)
        // setTimeout(function(){io.emit('notification', data);},500)
        // setTimeout(function(){io.emit('notification', data);},1000)
      }
    });
  })


  io.on("connection", function(socket)
  {


    //if page loads after data is ready
    socket.emit('notification', googleData);

    socket.on('expiry', function(data){

      var localtime = moment().tz("America/New_York")
      var newweeknumber = localtime.week()

      readSheet(newweeknumber, function(err,data){
        if(err){
          io.emit('error', "Something went wrong: " + err.message)
        } else {
          //console.log(data);
          // //for testing
          // io.emit('notification', {challenge: "hey there"});
          io.emit('notification', data);
        }

      });
    })
  });


  return router;
}
