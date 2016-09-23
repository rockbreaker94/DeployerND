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
			var deleteRepoA = sh.rm('-rf','NandDCorr');
			socket.emit('ese','Cancellazione correttiva old');
			var deleteRepoB = sh.rm('-rf','NandDEvolutiva');
			socket.emit('ese','Cancellazione evolutiva old');
			var usermailInit = sh.exec('git config --global user.email "rockbreaker94@gmail.com"');
			var usernameInit = sh.exec('git config --global user.name "rockbreaker94"');
			var cloneA = sh.exec('git clone https://rockbreaker94:tuononno94@github.com/rockbreaker94/NandDCorr.git', {async:true});
			cloneA.stderr.on('data', function(data) {
				socket.emit("ese",data);
			});
			cloneA.stderr.on('end',function(){
				var cloneB = sh.exec('git clone https://rockbreaker94:tuononno94@github.com/rockbreaker94/NandDEvolutiva.git',{async:true});
				cloneB.stderr.on('data',function(data){
					socket.emit('ese',data);
				});
				cloneB.stderr.on('end',function(){
					var mergeEvo = sh.cp('-Rf','NandDEvolutiva/*','NandDCorr/');
					var cdCorr = sh.cd('NandDCorr');
					var removeRemote = sh.exec('git add .',{async:true});
					removeRemote.stderr.on('data',function(data){
						socket.emit('ese',data);
					});
					removeRemote.stderr.on('end',function(){
						var commit = sh.exec('git commit -m "Merge evolutivo su correttivo"',{async:true});
						commit.stderr.on('data',function(data){
							socket.emit('ese',data);
						});
						commit.stderr.on('end',function(){
							var push = sh.exec('git push origin master',{async:true});
							push.stderr.on('data',function(data){
								socket.emit('ese',data);
							});
							push.stderr.on('end',function(){
								socket.emit('ese','###FINISH JOB###');
							});
						});
					});
				});
			});		
		}
	});
});