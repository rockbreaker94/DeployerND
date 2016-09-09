var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var sh = require("shelljs");
var http = require('http').Server(app);
app.use(express.static(__dirname+"/admin"));
app.use( bodyParser.json() );  
app.get("/",function(req,res){
	res.sendFile("index.html",{"root":__dirname+"/admin"});
});
app.get("/job/",function(req,res){
	res.sendFile("jobs.json",{"root":__dirname+"/"});
});
app.get("/job/:id",function(req,res){
	res.sendFile("job.html",{"root":__dirname+"/job"});
});
app.get("/job/:id/execute",function(req,res){
	startJob(id);
});
app.post("/login",function(req,res){
	var us = req.body.username;
});
http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:5000');
});