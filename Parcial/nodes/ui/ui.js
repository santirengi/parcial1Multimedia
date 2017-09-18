//Dependencies
const bodyParser = require('body-parser');    
const express = require('express');
var request = require('request');

//app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));       //body parser needed for user input   
app.use(bodyParser.json());

//ROUTES
//home
app.get('/', (req, res) => {
  request('http://lbapi:80/getLinks', function (error, response, body) { //url: container name port: internal port of conainer
    if (!error && response.statusCode == 200) {
      res.send(body); // Print web page.
      console.log("links brought sucessfully");
    }else{
      console.log(error);
    }
  })
});

//clicked link
app.get('/clicked/:id', (req, res) => {
  request('http://lbapi:80/clicked/' + req.params.id, function (error, response, body) { //url: container name port: internal port of conainer
    if (!error && response.statusCode == 200) {
      console.log(response.body);
      res.redirect(response.body);
    }else{
      console.log(error);
    }
  })
});

//delete Link  
app.get('/delete/:id', (req, res) => {
  request('http://lbapi:80/delete/' + req.params.id, function (error, response, body) { //url: container name port: internal port of conainer
    if (!error && response.statusCode == 200) {
      res.redirect('http://localhost/');
    }else{
      console.log(error);
    }
  })
});

//insert Link
app.post('/insert', (req, res) => {
  request('http://lbapi:80/insert/' + req.body.title + '/' + req.body.url, function (error, response, body) { //url: container name port: internal port of conainer
    if (!error && response.statusCode == 200) {
      res.redirect('http://localhost/');
    }else{
      console.log(error);
    }
  })
});

//Start Listening for Requests
app.set('port', (80));                            //port selection                                                          //set ports and start listening
app.listen(app.get('port'), function(){           //listen on port
  console.log('Metric started on port '+app.get('port'));
});