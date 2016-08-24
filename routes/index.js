var fs = require('fs');
var request = require('request');
//var moment = require('moment');
var moment = require('moment-timezone');
var async = require('async');
var express = require('express');
var router = express.Router();
var GoogleSpreadsheet = require('google-spreadsheet');

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

    var doc = new GoogleSpreadsheet('12oNY21VWHpS4bxYDv86AEjWPifeIJrVhRaK4_wuu7DY');
    var sheet;

    readSheet(weeknumber, function(err,data){
      if(err){
        io.emit('error', "Something went wrong: " + err.message)
      }
      io.emit('notification', data);
    });

  })


  function readSheet(weeknumber, cb) {

    var doc = new GoogleSpreadsheet('12oNY21VWHpS4bxYDv86AEjWPifeIJrVhRaK4_wuu7DY');
    var sheet;
    var data = {};

    async.series([
      function setAuth(step) {
        // see notes below for authentication instructions!
        var creds = require('../52frames chllenges-d7a4feb4b602.json');
        doc.useServiceAccountAuth(creds, step);
      },
      function getInfoAndWorksheets(step) {
        doc.getInfo(function(err, info) {
          if(err){
            return cb(err, null)
          }
          else{
            console.log('Loaded doc: '+info.title+' by '+info.author.email);
            sheet = info.worksheets[0];
            step();
          }
        });
      },
      function getData(step) {
        // google provides some query options
        sheet.getRows({
          offset: 1,
        }, function( err, rows ){

          if(err){
            return cb(err,null)
          }

          console.log('Read '+rows.length+' rows');

          if(rows[weeknumber-1]){

            data.challenge = rows[weeknumber-1].challenge;
            data.credit = rows[weeknumber-1].extracredit;
            data.deadline = rows[weeknumber-1].deadline;

            return cb(null,data)
          }
          else {
            return cb(new Error("No data found for this week"), null)
          }

          //need to create a timer that fires this when it expires.
          step();
        });
      }
    ]);
  }


  io.on("connection", function(socket)
  {
    //on page load
    //for realtime update, broadcast to all clients
    socket.on('expiry', function(data){
      socket.emit('notification', {challenge: "hello"});
      socket.broadcast.emit('notification', {challenge: "hello"});
    })

  });


  return router;
}
