//Dependencies
//const bodyParser = require('body-parser');    
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

//ROUTES
//link clicked trigger
app.get('/clicked/:id', (req, res) => {
  console.log("entro",req.params.id)
  r.db('db_links').table('links').get(parseInt(req.params.id)).update({views: r.row("views").add(1)}).run().then(function(response){
    console.log('update sucesfull');
  }).error(function(err){
    console.log(err);
  })
});

//Start Listening for Requests
app.set('port', (80));                						//port selection                                                          //set ports and start listening
app.listen(app.get('port'), function(){						//listen on port
	console.log('Metric started on port '+app.get('port'));
});