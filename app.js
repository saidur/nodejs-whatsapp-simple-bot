/**
 * Whatsapp Direct Messaging API
 * Author: Amirul Zharfan Zalid
 * Web: amirulzharfan.com
 */

/***************************************/
/*******       Dependencies      *******/
/***************************************/
var express = require('express');
var app = express();
app.use("/assets", express.static(__dirname + '/assets'));

var useragent = require('express-useragent');
var path    = require("path");
const port = process.env.PORT || 5000;

/***************************************/
/*******         Router          *******/
/***************************************/





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