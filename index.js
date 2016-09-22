var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('jobs.json', 'utf8'));
var sh = require("shelljs");
var http = require('http').Server(app);
var io = require('socket.io')(http);
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
		if(data.id==2){//merge dall'evo alla correttiva'
			var deleteRepo = sh.rm('-rf','/NandDCorr/*');
			var clone = sh.exec('git clone https://github.com/rockbreaker94/NandDCorr.git', {async:true});
			clone.stderr.on('data', function(data) {
				socket.emit("ese",data);
			});
			clone.stderr.on('end',function(){
				var cd = sh.exec('cd NandDCorr');
				var addRemote = sh.exec('git remote add NandDEvolutiva https://github.com/rockbreaker94/NandDEvolutiva.git',{async:true});
				addRemote.stderr.on('data',function(data){
					socket.emit('ese',data);
				});
				addRemote.stderr.on('end',function(){
					var fetchEvo = sh.exec('git fetch NandDEvolutiva',{async:true});
					fetchEvo.stderr.on('data',function(data){
						socket.emit('ese',data);
					});
					fetchEvo.stderr.on('end',function(){
						var mergeEvo = sh.exec('git merge NandDEvolutiva/master',{aync:true});
						mergeEvo.stderr.on('data',function(data){
							socket.emit('ese',data);
						});
						mergeEvo.stderr.on('end',function(){
							var removeRemote = sh.exec('git remote remove NandDEvolutiva',{async:true});
							removeRemote.stderr.on('data',function(data){
								socket.emit('ese',data);
							});
							removeRemote.stderr.on('end',function(){
								socket.emit('ese','###FINISH JOB###');
							});
						})
					});
				});
			});					
		}
	});
});