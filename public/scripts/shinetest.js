
// sets up the basic structure

selectedX = new Array();
selectedY = new Array();
pointLit = new Array();
isEnemy = new Array();
speeds = new Array();
dirs = new Array();
var maxSpeed = 8;
var minSpeed = 2;
var lives = 3;
var spawnRate = 0.1;
var width = 4/3*(window.innerHeight-50);
var height = window.innerHeight-50;

var gameScore = 0;

game_playing = true; 
loopCounter = 1;

audio_Demo = new Audio("playlist/letitgo.mp3");
ding = new Audio ('playlist/ding.mp3');
buzz = new Audio ('playlist/buzz.mp3');
song_length = 100; //seconds
bpm = 170; //beats per minute


//stuff from Victor and Norman
initShiny = function(){
	//document.getElementById("scoreUpdates").style.display = "block";
	var video = document.createElement("video");
	// video.setAttribute("height",height);
	// video.setAttribute("width",width);
	var canvas = document.getElementById("video_canvas");
	canvas.width= width;
	canvas.height=height;
	var context = canvas.getContext("2d");
	context.translate(width,0);
	context.scale(-1,1);
	//context.fillStyle = "#004384";

	var shiny = document.getElementById("shiny");
	var shiny_context = shiny.getContext("2d");


//calls helper functions and stuff	
	var me = this;
	var videoLoop = function(){
		console.log("videolooping")
		context.drawImage(video, 0, 0, width, height);
		//argh the text is backwards!
		//context.fillText(score, 10, 20);
		if (game_playing){
		    $('.demoPanel').fadeOut(300);
			$("#video_canvas").fadeIn(500);
			console.log("game playing")
			lightPoint(canvas.getContext('2d'));
			testPoint(canvas.getContext('2d'));
			if (loopCounter === 1){
				start_date = new Date();
				audio_Demo.load();
				audio_Demo.play();
			}

			if (loopCounter % Math.floor(1980/bpm) === 1){
				generatePoint();
			}
			current_date = new Date();
			if (current_date - start_date >= song_length * 1000 || lives==0){
				game_playing = false;
				audio_Demo.pause();
				//$.post('/gamepage', {
				//	score: gameScore}, function(){
				//		console.log("score added")});
				//document.getElementById("play_again").style.display = "inline";
				//document.getElementById("instructions").style.display = "inline";
				hideDemo();
				$('html').animate({
				scrollTop: $('.panelScreen').offset().top}, 800);
			
				return
			}
			loopCounter += 1;
		}
		setTimeout(videoLoop,30);
	};

//gets webcam feed
	getUserMedia({
		video: true,
		audio: false
	}, function(stream){
		video.src = window.URL.createObjectURL(stream);
		video.play();
		videoLoop();
		//repeaterTimeOut();
	}, function(error){	
		console.log("getUserMedia failed" + error);
	});
};

//these are helper functions
// Generate a new location at which to place a point

function generatePoint(){
	// Generate a point 
	x_new = Math.floor(Math.random() * (width/10-6) + 1) * 10; /*(10<x<500)*/
	y_new = Math.floor(Math.random() * (height/10-6) + 1) * 10; /*(10<x<350)*/
	v_new = Math.random()*(maxSpeed-minSpeed)+minSpeed;
	dir_new = Math.random()*6.28;
	var enemy = Math.random() < spawnRate;
	//Check if the point is already in the set of points
	same_point = false;
	for (var i = 0; i < selectedX.length; i++){
		if (selectedX[i] === x_new && selectedY[i] === y_new) {
			same_point = true
		}
	}
	//it is, run the function again
	if (same_point){
		generatePoint();
	}
	//if it's not, store it in the list of points
	//indicate that it has not been lit up
	else{
		selectedX.push(x_new);
		selectedY.push(y_new);
		speeds.push(v_new);
		dirs.push(dir_new);
		pointLit.push(false);
		isEnemy.push(enemy);
	}
	
}

// make the generated points glow
// remove the dots that were hit
// white dot url http://s9.postimg.org/tqte0y5an/white_dot.png
// yellow dot url http://s28.postimg.org/5576hs75p/yellow_dot.png
// light blue dot <img src ="http://oi40.tinypic.com/2lcu4qo.jpg">
// light yellow dot <img src ="http://oi44.tinypic.com/35ism0p.jpg"> 


glowing_blue_star = new Image();
glowing_blue_star.src = "images/snowflake.png";
glowing_blue_star.height = 10;
glowing_blue_star.width = 10;

orb = new Image();
orb.src = 'images/red_orb.png';
orb.height = 10;
orb.width = 10;

light_blue_dot = new Image();
light_blue_dot.src = "images/lightblue_dot.png";

function lightPoint(context){
	//activate the dots created to be yellow
	//set the ones just hit to be light blue
	for (var i = 0; i < pointLit.length; i++){
		/*glowing_blue_star = new Image();
		glowing_blue_star.src = "images/lightyellow_dot.png";
		glowing_blue_star.height = 10;
		glowing_blue_star.width = 10;*/
		selectedX[i] += speeds[i]*Math.cos(dirs[i]);
		selectedY[i] += speeds[i]*Math.sin(dirs[i]);
		if (pointLit[i] === true){
			if (isEnemy[i]){
				context.drawImage(orb, selectedX[i], selectedY[i]);
			}
			else{
				context.drawImage(glowing_blue_star, selectedX[i], selectedY[i]);
			}
		}
		else{
			if (pointLit[i] === false){
				if (isEnemy[i]){
					context.drawImage(orb, selectedX[i], selectedY[i]);
				}
				else{
					context.drawImage(glowing_blue_star, selectedX[i], selectedY[i]);
				}
				pointLit[i] = true;
			}
			else{
				if (pointLit[i] === 0){
					if (isEnemy[i]){
						context.drawImage(light_blue_dot, selectedX[i], selectedY[i]);
						buzz.play();
						lives-=1;
					}
					else{
						context.drawImage(light_blue_dot, selectedX[i], selectedY[i]);
						ding.play();
						gameScore += 100;
					}
					selectedX.splice(i, 1);
					selectedY.splice(i, 1);
					pointLit.splice(i, 1);
					speeds.splice(i,1);
					dirs.splice(i,1);
					isEnemy.splice(i,1);
				}
			}
		}	
	}
}

//this function takes a point on the screen and calculates its luminance
function testLuminance(img_data){
	// need to change ind to be specific to the point, right now it is for the point (0,0)
	var r = 0;
	var b = 0;
	var g = 0;
	var count = 0;
	for (var i =0; i < img_data.data.length; i+=4){
		r = r + img_data.data[i];
		g = g + img_data.data[i+1];
		b = b + img_data.data[i+2];
		count += 1
	}
	// y is luminance 

	total_y = 2.126*r + 0.7152*g + 0.0722*b;
	y = total_y / count
	percent_y = y / 700
	return percent_y;
}


function testPoint(canvas){
//this function uses the testLuminance function to determine whether or not points have been hit
// if the luminance at the point is greater than a certain amount, click a button
	for (var i = 0; i < pointLit.length; i++){
		y_point = testLuminance(canvas.getImageData(width - selectedX[i]-20, selectedY[i]+20, 20, 20));
		if (y_point >= 0.91 && !isEnemy[i]){
			pointLit[i] = 0
			maxSpeed +=0.25;
			minSpeed +=0.25;
			if (spawnRate<0.5){
				spawnRate +=0.02;
			}
		}
		
		else if (y_point >= 0.80 && isEnemy[i]){
			pointLit[i] = 0;
		}
	}
}

/*function newGame(){
	selectedX.length = 0;
	selectedY.length = 0;
	pointLit.length = 0

	gameScore = 0;

	loopCounter = 1;

	game_playing = true; 

	document.getElementById("play_again").style.display = "none";
	document.getElementById("instructions").style.display = "none";
}*/

function hideDemo(){
$('.demoShine').fadeOut('slow');
}