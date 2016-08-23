var fs = require('fs');
var request = require('request');
var moment = require('moment');
var async = require('async');
var express = require('express');
var router = express.Router();
var GoogleSpreadsheet = require('google-spreadsheet');


module.exports = function(io) {

  router.get('/', function(req, res){

    var weeknumber =  moment().isoWeek();

    var doc = new GoogleSpreadsheet('12oNY21VWHpS4bxYDv86AEjWPifeIJrVhRaK4_wuu7DY');
    var sheet;
    var data = {};
    var deadline;

    console.log(moment.utc().format("DD-MM-YYYY HH mm"));

    async.series([
      function setAuth(step) {
        // see notes below for authentication instructions!
        var creds = require('../52frames chllenges-d7a4feb4b602.json');
        doc.useServiceAccountAuth(creds, step);
      },
      function getInfoAndWorksheets(step) {
        doc.getInfo(function(err, info) {
          console.log('Loaded doc: '+info.title+' by '+info.author.email);
          sheet = info.worksheets[0];
          step();
        });
      },
      function getData(step) {
        // google provides some query options
        sheet.getRows({
          offset: 1,
        }, function( err, rows ){
          console.log('Read '+rows.length+' rows');

          data.challenge = rows[weeknumber-1].challenge;
          data.credit = rows[weeknumber-1].extracredit;
          deadline = rows[weeknumber-1].deadline;
          io.emit('notification', data);

          //need to create a timer that fires this when it expires.
          io.emit('deadline', deadline);

          step();
        });
      }

    ]);
    res.render("index")
  })


  // io.on("connection", function(socket)
  // {
  //   //on page load
  //   //for realtime update, broadcast to all clients
  //   socket.on('expiry', function(data){
  //     socket.emit('notification', {challenge: "hello"});
  //     socket.broadcast.emit('notification', {challenge: "hello"});
  //   })
  //
  // });


  return router;
}
