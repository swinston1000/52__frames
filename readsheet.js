var async = require('async');
var GoogleSpreadsheet = require('google-spreadsheet');

module.exports = function readSheet(weeknumber, cb) {

  var doc = new GoogleSpreadsheet('12oNY21VWHpS4bxYDv86AEjWPifeIJrVhRaK4_wuu7DY');
  var sheet;
  var data = {};

  async.series([
    function setAuth(step) {
      // see notes below for authentication instructions!
      var creds = require('./52frames chllenges-d7a4feb4b602.json');
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
