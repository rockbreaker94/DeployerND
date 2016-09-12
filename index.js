var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var io = require('socket.io')(http);
var obj = JSON.parse(fs.readFileSync('jobs.json', 'utf8'));
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
app.get("/job/:id/home",function(req,res){
	res.send(obj[(req.params.id)-1]);
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
io.on('connection',function(socket){
	socket.on('exe',function(data){
		console.log(data);
		if(req.id==2){
			var child = sh.exec('git clone https://github.com/rockbreaker94/NandDEvolutiva.git', {async:true});
			child.stderr.on('data', function(data) {
				socket.emit("ese",data);
			});
		}
	});
});