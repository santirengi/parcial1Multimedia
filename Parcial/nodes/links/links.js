//Dependencies
//const body = require('body-parser');    
var env = require('./env.js');
const express = require('express');

//app
const app = express();					


//rethinkdb setup
var r = require('rethinkdbdash')({
  servers: [
    {host: env.rdb_host, port: env.rdb_port}
  ]
});

//create rethinkdb DB
r.dbCreate('db_links').run().then(function(result) {
  console.log("db_links DB created")
}).error(function(error) {
  console.log("db_links already exist")
}).then(function(){
  r.db('db_links').tableCreate('links').run().then(function(result) {
    console.log("links table created")
  }).error(function(error) {
    console.log("links table already exist")
  });
});

//ROUTES
//get links in DB
app.get('/getLinks', (req, res) => {
  /*
  //base Links
  var links = [
    {id: 0, title:'google', url:'www.google.com', tags:['google', 'search'], date: new Date(Date.now()), views: 0},
    {id: 1, title:'facebook', url:'www.facebook.com', tags:['facebook', 'social'], date: new Date(Date.now()), views: 0},
    {id: 2, title:'whatsapp', url:'www.whatsapp.com', tags:['whatsapp', 'chat', 'social'], date: new Date(Date.now()), views: 0},
    {id: 3, title:'netflix', url:'www.netflix.com', tags:['netflix', 'video', 'social'], date: new Date(Date.now()), views: 0}
  ];

  //insert links    
  r.db('db_links').table('links').insert(links).run().then(function(response){
    console.log('Success ',response);
  }).error(function(err){
    console.log('error occurred ',err);
  })
  */
  //get links
  r.db('db_links').table('links').run().then(function(result){     
    //display responce
    respondHome(res, result);
    console.log('Links got succesfully');
  }).error(function(err){
    console.log('Error geting links',err);
  })
});

//Respond Links 
function respondHome(res, data){
  var text = "<ul>";                                  //list of links
  for (var i = 0; i < data.length; i++) {             
    text = text + "<li>" + "<a href=clicked/" + data[i].id + ">" + data[i].title + "</a><span> Views: " + data[i].views + "</span><a href=delete/" + data[i].id + ">  Delete</a></li>";      //add links to response
  }
  text = text + "</ul><form action=/insert method=post>Title:<br><input type=text name=title><br>Url:<br><input type=text name=url><br><br><input type=submit value=Submit></form>";
  res.send(text);
}

//link clicked trigger
app.get('/clicked/:id', (req, res) => {
  r.db('db_links').table('links').get(parseInt(req.params.id)).run().then(function(response){
    res.send(response);
  }).error(function(err){
    console.log(err);
  })
});

//delete Link
app.get('/delete/:id', (req, res) => {
  r.db('db_links').table('links').get(parseInt(req.params.id)).delete().run().then(function(response){
    res.send('');
    console.log("Link deleted");
  }).error(function(err){
    console.log(err);
  })
});

//insert link
app.get('/insert/:title/:url', (req, res) => {
  r.db('db_links').table('links').isEmpty().run().then(function(response){
    var register = {id: 0,title: req.params.title, url: req.params.url, tags:[], date: new Date(Date.now()), views: 0}
    if(response == true){
      var register = {id: 0,title: req.params.title, url: req.params.url, tags:[], date: new Date(Date.now()), views: 0}
      r.db('db_links').table('links').insert(register).run().then(function(response){
        res.send('');
        console.log('Link lnserted');
      }).error(function(err){
        console.log('error occurred ',err);
      })
    }else{
      r.db('db_links').table('links').max('id')('id').run().then(function(response){
        var register = {id: parseInt(response) + 1,title: req.params.title, url: req.params.url, tags:[], date: new Date(Date.now()), views: 0}
        r.db('db_links').table('links').insert(register).run().then(function(response){
          res.send('');
          console.log('Link lnserted');
        }).error(function(err){
          console.log('error occurred ',err);
        })
      }).error(function(err){
        console.log('error occurred ',err);
      })
    }
  }).error(function(err){
    console.log('error occurred ',err);
  })
});

//Start Listening for Requests
app.set('port', (80));                						//port selection                                                          //set ports and start listening
app.listen(app.get('port'), function(){						//listen on port
	console.log('Links started on port '+app.get('port'));
});