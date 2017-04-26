'use strict';
/**
 * Whatsapp Direct Messaging API
 * Author: Amirul Zharfan Zalid
 * Web: amirulzharfan.com
 */

var request = require('request');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');

var conf = require('./conf');




/***************************************/
/*******       Dependencies      *******/
/***************************************/
var express = require('express');
var app = express();
app.use("/assets", express.static(__dirname + '/assets'));
app.use(compression());
app.set('case sensitive routing', true);
app.use(bodyParser.json());

var httpServer = http.createServer(app);


var useragent = require('express-useragent');
var path    = require("path");
const port = process.env.PORT || 5000;


/***************************************/
/*******         Router          *******/
/***************************************/

app.get('/webhook/', handleVerify);
app.post('/webhook/', receiveMessage);

function handleVerify(req, res, next) {
    var token = process.env.VERIFY_TOKEN || conf.VERIFY_TOKEN;
    if (req.query['hub.verify_token'] === token) {
        return res.send(req.query['hub.challenge']);
    }
    res.send('Validation failed, Verify token mismatch');
}

function receiveMessage(req, res, next) {
    var message_instances = req.body.entry[0].messaging;
    message_instances.forEach(function(instance){
        var sender = instance.sender.id;
        if(instance.message && instance.message.text) {
            var msg_text = instance.message.text;
            sendMessage(sender, msg_text, true);
        }
    });
    res.sendStatus(200);
}

function sendMessage(receiver, data, isText) {
    var payload = {};
    payload = data;

    if(isText) {
        payload = {
            text: data
        };
    }

    request({
        url: conf.FB_MESSAGE_URL,
        method: 'POST',
        qs: {
            access_token: process.env.PROFILE_TOKEN || conf.PROFILE_TOKEN
        },
        json: {
            recipient: {id: receiver},
            message: payload
        }
    }, function (error, response) {
        if(error) console.log('Error sending message: ', error);
        if(response.body.error) console.log('Error: ', response.body.error);
    });
}



/*
 * http://<domain>
 * Desciption: Main page
 */
app.get('/', (req, res) => {
    /*var data = {
        status: "success",
        message: "Hello to whatsapp direct message api. Developed by Amirul Zharfan Zalid - Github@amizz"
    }*/

    res.sendFile(path.join(__dirname+'/index.html'));
    //res.status(200).json(data);
})

/*
 * http://<domain>
 * Desciption: Main page
 */
app.get('/home',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

/*
 * http://<domain>
 * Desciption: Main page
 */
app.get('/kpapi',function(req,res){
  //res.sendFile(path.join(__dirname+'/index.html'));
    var http = require('http');

    var instanceId = "3"; // TODO: Replace it with your gateway instance ID here
    var clientId = "tarik@quanfey.net";     // TODO: Replace it with your Forever Green client ID here
    var clientSecret = "c13f70ee928a41d4978f32b97663965f";  // TODO: Replace it with your Forever Green client secret here

    var jsonPayload = JSON.stringify({
        number: "12025550108",  // TODO: Specify the recipient's number here. NOT the gateway number
        message: "Howdy, isn't this exciting?"
    });

    var options = {
        hostname: "api.whatsmate.net",
        port: 80,
        path: "/v2/whatsapp/single/message/" + instanceId,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-WM-CLIENT-ID": clientId,
            "X-WM-CLIENT-SECRET": clientSecret,
            "Content-Length": Buffer.byteLength(jsonPayload)
        }
    };



});


// routes will go here
app.get('/api/users', function(req, res) {
  
  var user_id = req.param('id');
  var token = req.param('token');
  var phonenum = req.param('phonenum');  

  if (user_id != 'chakri123')
  {
     var data = {
        status: "error",
        message: "user id not match"
    }   
    res.status(400).json(data);
    //res.status(400).json({status: "error: user_id not match"});

  }
  
  var source = req.header('user-agent');
  var ua = useragent.parse(source);

    if (ua.isDesktop) {
        res.status(308).redirect(`https://web.whatsapp.com/send?phone=+${req.params.phonenum}`);
    } else if (ua.isMobile) {
        res.status(308).redirect(`whatsapp://send?phone=+${req.params.phonenum}`);
    } else {
        res.status(400).json({status: "error"});
    }

  //res.send(user_id + ' ' + token + ' ' + geo);
});



/*
 * http://<domain>/:phonenum
 * Desciption: Redirect url to respective whatsapp api interface without message text
 */
app.get('/:phonenum', (req, res) => {
    var source = req.header('user-agent');
    var ua = useragent.parse(source);

    if (ua.isDesktop) {
        res.status(308).redirect(`https://web.whatsapp.com/send?phone=+${req.params.phonenum}`);
    } else if (ua.isMobile) {
        res.status(308).redirect(`whatsapp://send?phone=+${req.params.phonenum}`);
    } else {
        res.status(400).json({status: "error"});
    }
})

/*
 * http://<domain>/:phonenum/:message
 * Desciption: Redirect url to respective whatsapp api interface with message text
 */
app.get('/:phonenum/:message', (req, res) => {
    var source = req.header('user-agent');
    var ua = useragent.parse(source);

    if (ua.isDesktop) {
        res.status(308).redirect(`https://web.whatsapp.com/send?phone=+${req.params.phonenum}&text=${req.params.message}`);
    } else if (ua.isMobile) {
        res.status(308).redirect(`whatsapp://send?phone=+${req.params.phonenum}&text=${req.params.message}`);
    } else {
        res.status(400).json({status: "error"});
    }
})

/*
 * http://<domain>/whatsapp
 * Desciption: Redirect url to respective whatsapp api interface using predefined phone number
 */
app.get('/whatsapp', (req, res) => {
    var source = req.header('user-agent');
    var ua = useragent.parse(source);
    var phonenum = '0123456789';
    
    if (ua.isDesktop) {
        res.status(308).redirect(`https://web.whatsapp.com/send?phone=+${phonenum}`);
    } else if (ua.isMobile) {
        res.status(308).redirect(`whatsapp://send?phone=+${phonenum}`);
    } else {
        res.status(400).json({status: "error"});
    }
})

// Start server at <port>
app.listen(port, (err) => {
    console.log(`Available at http://localhost:${port}`);
    if (err) {
        console.log(err);
    }
})