var express = require('express');
var app = express();
var request = require('request-promise');
var BodyParser = require('body-parser');

var Gpio = require('onoff').Gpio;
var Button = new Gpio(17, 'in', 'both');

// POST the state of the button(pressed or not)
var mydata = {
    time: new Date(),
    ispressed: ispressed
}

var options = {
    uri:"http://13.59.174.162:7579/ispressed",
    method: "POST",
    form: mydata
}

// 0 - not pressed, 1 - pressed
mydata.ispressed = 0;

console.log('client start!');

function ispressed(err, state) {
    var current_time = new Date();

    // send data at most one time per 1 minute.
    // state == 1 : when pressed.
    if(state == 1 && mydata.time.getSeconds() != current_time.getSeconds()) {

        mydata.ispressed = 1;
        mydata.time = new Date();

        var options = {
            uri:"http://13.59.174.162:7579/ispressed",
            method: "POST",
            form: mydata
        }

        request(options, function(err, res, body) {
            if(err) {
                console.log("error : " + err);
            }
        });

        console.log('pressed at ' + (new Date()));

        mydata.ispressed = 0;
    } else {
        console.log('running... ispressed : ' + mydata.ispressed);
    }
}

setInterval(function() {
    Button.watch(ispressed);
}, 7000);
