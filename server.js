'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');

var cors = require('cors');
var urlApp=require('./urlShortener')
var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl/new/',(req,res)=>{
  urlApp.newURL(req.body.url,(err,data)=>{
    if(err)
      {
        console.log(err)
        res.json(err)
      }
    console.log(data)
    res.json(data)
  })
})  

app.get('/api/shorturl/:id',(req,res)=>{
  //res.json(req.params)
  urlApp.getURL(req.params.id,(err,data)=>{
    if (err)
      {
        res.json(err)
      }
    else
      {
        console.log("Redirigiendo a " + data.address)
        res.redirect("https://"+data.address)
      }
  })
})

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});