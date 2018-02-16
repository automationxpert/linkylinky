'use strict';

var request = require("request");
var config = require("dotenv").config();


export function handler(event, context, callback) {

  // get the details of what we are creating
  var code = event.queryStringParameters['code'];

  // where is the data?
  var url = "https://api.netlify.com/api/v1/forms/" + process.env.ROUTES_FORM_ID + "/submissions/?access_token=" + process.env.API_AUTH;

  request(url, function(err, response, body){

    // look for this code in our stash
    if(!err && response.statusCode === 200){
      var roots = JSON.parse(body);
      for(var item in roots) {
        // return the result when we find the match
        if(roots[item].data.code == code) {
          console.log("We searched for " + code + " and we found " + roots[item].data.destination);
          return callback(null, {
            statusCode: 200,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({code: code, url: roots[item].data.destination})
          })
        }
      }
    } else {
      return callback(null, {
        statusCode: 200,
        body: err
      })
    }
  });

}
