// sets up the basic structure

//checks for initShiny
var inited = false;

//checks for whether a game has been finished or not (either quit, death, or timeout)
var played = false;

//sets default sound to on
var soundFX = true;
var bgm = true;

//new arrays hurray!
selectedX = new Array();
selectedY = new Array();
pointLit = new Array();
isEnemy = new Array();
speeds = new Array();
dirs = new Array();
stars = new Array();
orientations = new Array();

//default values to set up a game
var modifier = 0;
var maxSpeed = 6;
var minSpeed = 2;
var lives = 3;
var spawnRate = 0;
var gameScore = 0;
var game_playing = true; 
var loopCounter = 1;

//browser size responsiveness?!?!?!
var width = 560;
var height = width*3/4;

//sound FX library
ding = new Audio ('playlist/ding.mp3');
buzz = new Audio ('playlist/buzz.mp3');

//audio library info
songList = ['demo', 'ChineseDanceMachine', 'Endurance', 
	'Eternity', 'Firefrost', 'GenericDreams', 
	'HeavenRd2', 'HyperioxX', 'Infertehno', 'LoveLife', 'PartyCrashers'];


songTitleList = ["Demo","Chinese Dance", "Endurance", "Eternity", 
	"Firefrost", "Generic Dreams", "Heaven Rd. 2",
	"HyperioxX", "Infertehno", "Love Life", 
	"Party Crashers"];

artistList = ["(Heaven Rd. 2) Envy", "F777", "Envy", 
	"Prof. Adm. Bacon", "Envy", "Steven-Polley (SP)", 
	"Envy", "ParagonX9", "Shinrog", "xXBullDozerXx", "Sour Jovis"]

durationList = [27, 76, 151, 368, 258, 233, 
	193, 197, 184, 87, 174];

bpmList = [151, 140, 143, 145, 130, 141, 
	151, 180, 147, 110, 136];


//stinger library 
gameOverStingersLose = ["are you even trying?", "it's ok, you'll get it next time!", "blue is bad. yellow is yay.", 
	"your body was not ready.", "everybody has off days.", "you looked hot anyways."];

gameOverStingersWin = ["you are truly star material.", "looking hot.", "you're a star!", 
	"have you considered professional shining?", "you are the light the world needs.", "you're awesome."];


//default song values
nowPlaying = new Audio("playlist/demo.mp3");
song_length = 27; //seconds
bpm = 151; //beats per minute


//stuff from Victor and Norman: sets up canvas and loop
initShiny = function(){
	console.log("initing")
	inited = true;
	document.getElementById("video_canvas").style.display = "block";
	document.getElementById("start_button").style.display = "none";
	document.getElementById("updateStatus").style.display = "block";
	document.getElementById("disclaimer").style.display = "block";
	document.getElementById("quitButton").style.display = "block";
	var width = 560;
	var height = 420;
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
		context.drawImage(video, 0, 0, width, height);
		if (game_playing){
			lightPoint(canvas.getContext('2d'));
			testPoint(canvas.getContext('2d'));
			updateScoreGame(gameScore,lives);
			if (loopCounter === 1){
				start_date = new Date();
				nowPlaying.load();
				nowPlaying.play();
				$('#gameNavContainer').fadeIn(1000,function(){
				});	
				if(!bgm){
					nowPlaying.muted = true;
				}
			}

			if (loopCounter > 1 && loopCounter % Math.floor(1980/bpm) === 1){
				generatePoint();
			}

			if (loopCounter === 67 && played){
				document.getElementById("stage3").style.display = "none";
			}

			current_date = new Date();
			//end game function
			if (current_date - start_date + modifier >= song_length * 1000 || lives==0){
				stingerIndex = Math.floor(Math.random() * 6); 
				if (lives == 0){
					document.getElementById("shinyness2").style.display = "none";
					document.getElementById("gameOverReasonTLDR").innerHTML = "game over";
					document.getElementById("gameOverReason").innerHTML = "you ran out of shinyness.";
					document.getElementById("gameOverStinger").innerHTML = gameOverStingersLose[stingerIndex];
				}
				else{
					document.getElementById("gameOverReasonTLDR").innerHTML = "congratulations!";
					document.getElementById("gameOverReason").innerHTML = "you passed the song.";
					document.getElementById("gameOverStinger").innerHTML = gameOverStingersWin[stingerIndex];
				}
				game_playing = false;
				played = true;
				nowPlaying.pause();
				console.log('game ended');
				var data = {};
				data.score = gameScore;
				data.timeStamp = new Date().toLocaleString();
				data.timePlayed = (current_date - start_date + modifier);
				document.getElementById("quitButton").style.display = "none";
				document.getElementById("finalScoreValue").innerHTML = gameScore;
				$('#gameNavContainer').fadeOut(1000,function(){
				});	
				$('#stage3').fadeIn(1000,function(){
				});	
				$('body').animate({
					scrollTop: $("#stage3").offset().top-25}, 1500);

				$.ajax({
					url: '/gamepage',
					type: 'POST',
					data: data,
				});
				console.log(data);
				document.getElementById("play_again").style.display = "block";
				document.getElementById("instructions").style.display = "block";
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

//game code

// Generate a new location at which to place a point
function generatePoint(){
	// Generate a point 
	x_new = Math.floor(Math.random() * (width/10-6) + 1) * 10; /*(10<x<500)*/
	y_new = Math.floor(Math.random() * (height/10-6) + 1) * 10; /*(10<x<350)*/
	v_new = Math.random()*(maxSpeed-minSpeed)+minSpeed;
	dir_new = Math.random()*6.28;
	var enemy = Math.random() < spawnRate;
	if (!enemy){
	 var orientation = Math.floor(Math.random()*4);
	}
	else{
	 var orientation = 10;
	}
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
		orientations.push(orientation);
	}

}

// make the generated points glow
// remove the dots that were hit

for (var i=0; i<4; i++){
stars[i] = new Image();
stars[i].src = 'images/starTarget'+i+'.png';
stars[i].height = 10;
stars[i].width = 10;
}

orb = new Image();
orb.src = 'images/orb.png';
orb.height = 10;
orb.width = 10;

white_dot = new Image();
white_dot.src = "images/whitedot.png";

function lightPoint(context){
	//activate the dots created to be yellow
	//set the ones just hit to be light blue
	for (var i = 0; i < pointLit.length; i++){
		selectedX[i] += speeds[i]*Math.cos(dirs[i]);
		selectedY[i] += speeds[i]*Math.sin(dirs[i]);
		if (pointLit[i] === true){
			if (isEnemy[i]){
				context.drawImage(orb, selectedX[i], selectedY[i]);
			}
			else{
				context.drawImage(stars[orientations[i]], selectedX[i], selectedY[i]);
			}
		}
		else{
			if (pointLit[i] === false){
				if (isEnemy[i]){
					context.drawImage(orb, selectedX[i], selectedY[i]);
				}
				else{
					context.drawImage(stars[orientations[i]], selectedX[i], selectedY[i]);
				}
				pointLit[i] = true;
			}
		}	
	}
}

//calculates its luminance
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
	percent_y = y / 742;
	return percent_y;
}


function testPoint(context){
//this function uses the testLuminance function to determine whether or not points have been hit
// if the luminance at the point is greater than a certain amount, click a button
	for (var i = 0; i < pointLit.length; i++){
		y_point = testLuminance(context.getImageData(width - selectedX[i]-20, selectedY[i]+40, 20, 20));
		if (y_point >= 0.90 && !isEnemy[i]){
			pointLit[i] = 0;
			maxSpeed +=0.25;
			minSpeed +=0.25;
			if (spawnRate<0.1){
				spawnRate +=0.02;
			}
		}
		
		else if (y_point >= 0.92 && isEnemy[i]){
			pointLit[i] = 0;
		}
		if (pointLit[i] === 0){
			if (isEnemy[i]){
				context.drawImage(white_dot, selectedX[i]+10, selectedY[i]+10);
				if (soundFX){
					buzz.play();
				}
				lives-=1;
			}
			else{
				context.drawImage(white_dot, selectedX[i]+50, selectedY[i]+40);
				if (soundFX){
					ding.play();
				}
				gameScore += 100;
			}
			selectedX.splice(i, 1);
			selectedY.splice(i, 1);
			pointLit.splice(i, 1);
			speeds.splice(i,1);
			dirs.splice(i,1);
			isEnemy.splice(i,1);
			orientations.splice(i,1);
		}
	}
}

//updates the score for the user to see
function updateScoreGame(gameScore,lives){
	document.getElementById("scoreUpdates").innerHTML = "score: " + gameScore;
	if (lives <= 2){
		document.getElementById("shinyness0").style.display = "none";
		if (lives <= 1){
			document.getElementById("shinyness1").style.display = "none";
			if (lives = 0){
				document.getElementById("shinyness2").style.display = "none";
			}
		}
	}

}


//starting and stopping games

//new game from preloaded list
function newGame(song){
	console.log("new game")
	nowPlaying.pause();

	selectedX = new Array();
	selectedY = new Array();
	pointLit = new Array();
	isEnemy = new Array();
	speeds = new Array();
	dirs = new Array();
	orientations = new Array();

	current_selection = song;
	selectedSong = new Audio("playlist/" + song + ".mp3");
	nowPlaying = selectedSong;
	nowPlaying.load();
	var i = songList.indexOf(song);
	song_length = durationList[i];
	bpm = bpmList[i];

	lives = 3;
	maxSpeed = 6; minSpeed = 2; spawnRate = 0.10;
	gameScore = 0;
	loopCounter = 1;
	game_playing = true; 
	modifier = 0;

	if (!inited){
		initShiny();
	}
	$('body').animate({
			scrollTop: $("#playShine").offset().top-30}, 1500);

	document.getElementById("songTitle").innerHTML = songTitleList[i];
	document.getElementById("artistName").innerHTML = artistList[i];
	document.getElementById("start_button").style.display = "none";
	document.getElementById("play_again").style.display = "none";
	document.getElementById("quitButton").style.display = "block";
	document.getElementById("shinyness0").style.display = "inherit";
	document.getElementById("shinyness2").style.display = "inherit";
	document.getElementById("shinyness1").style.display = "inherit";
	document.getElementById("resumeGame").style.display = "none";
	document.getElementById("pauseGame").style.display = "inherit";
}

//new game from user input
function newCustomGame(){
	song_length = 0;
	bpm = 0;
	custom_minutes = Number(document.getElementById("songLengthInputMinutes").value);
	custom_seconds = Number(document.getElementById("songLengthInputSeconds").value);
	custom_BPM = Number(document.getElementById("songBPMInput").value);

	//change for custom
	if (typeof custom_minutes === "number"){
		song_length += custom_minutes * 60;
	}
	if (typeof custom_seconds === "number"){
		song_length += custom_seconds;
	}
	if (typeof custom_BPM === "number"){
		bpm = custom_BPM;
	}

	//default values
	if (song_length == 0){
		song_length = 180;
	}
	if (bpm == 0){
		bpm = 120;	
	}

	nowPlaying.pause();

	selectedX = new Array();
	selectedY = new Array();
	pointLit = new Array();
	isEnemy = new Array();
	speeds = new Array();
	dirs = new Array();
	orientations = new Array();

	lives = 3;
	maxSpeed = 6; minSpeed = 2; spawnRate = 0.10;
	gameScore = 0;
	loopCounter = 2;
	start_date = new Date();
	game_playing = true; 

	if (!inited){
		initShiny();
	}
	$('#gameNavContainer').fadeIn(1000,function(){
				});	
	$('body').animate({
			scrollTop: $("#playShine").offset().top-30}, 1500);

	document.getElementById("songTitle").innerHTML = "custom song";
	document.getElementById("artistName").innerHTML = "";
	document.getElementById("quitButton").style.display = "block";
	document.getElementById("shinyness0").style.display = "inherit";
	document.getElementById("shinyness2").style.display = "inherit";
	document.getElementById("shinyness1").style.display = "inherit";
	document.getElementById("resumeGame").style.display = "none";
	document.getElementById("pauseGame").style.display = "inherit";
}

//stops game midway
function quitGame(){
	game_playing = false;
	played = true;
	nowPlaying.pause();
	document.getElementById("quitButton").style.display = "none";
	document.getElementById("start_button").style.display = "block";
	document.getElementById("finalScoreValue").innerHTML = gameScore;
	document.getElementById("gameOverReasonTLDR").innerHTML = "you quit.";
	document.getElementById("gameOverReason").innerHTML = "";
	document.getElementById("gameOverStinger").innerHTML = "";
	$('#stage3').fadeIn(800,function(){
	});	
	$('body').animate({
		scrollTop: $("#gameOverText").offset().top-25}, 1000);
	$('#gameNavContainer').fadeOut(1000,function(){
	});		
}

// pause and resume functions
function pauseGame(){
	current_date = new Date();
	modifier += current_date - start_date;
	console.log("pausing")
	game_playing = false;
	nowPlaying.pause();
	document.getElementById("pauseGame").style.display = "none";
	document.getElementById("resumeGame").style.display = "inherit";
}

function resumeGame(){
	start_date = new Date();
	game_playing = true;
	nowPlaying.play();
	$('body').animate({
		scrollTop: $("#playShine").offset().top-30}, 1500);
	document.getElementById("resumeGame").style.display = "none";
	document.getElementById("pauseGame").style.display = "inherit";
}

//mute and unmute for soundFX and bgm

function muteSoundFX(){
	soundFX = false;
	document.getElementById("soundFXToggleOff").style.display = "none";
	document.getElementById("soundFXToggleOn").style.display = "inherit";
}

function playSoundFX(){
	soundFX = true;
	document.getElementById("soundFXToggleOff").style.display = "inherit";
	document.getElementById("soundFXToggleOn").style.display = "none";
}

function muteBGM(){
	bgm = false;
	nowPlaying.muted = true;
	document.getElementById("bgmToggleOn").style.display = "inherit";
	document.getElementById("bgmToggleOff").style.display = "none";
}
function playBGM(){
	bgm = true;
	nowPlaying.muted = false;
	document.getElementById("bgmToggleOff").style.display = "inherit";
	document.getElementById("bgmToggleOn").style.display = "none";
}
//functions for html

function showSongList(){
	document.getElementById("showSongs").style.display = "none";
	document.getElementById("hideSongs").style.display = "block";
	document.getElementById("songListDisplay").style.display = "block";
}

function hideSongList(){
	document.getElementById("showSongs").style.display = "block";
	document.getElementById("hideSongs").style.display = "none";
	document.getElementById("songListDisplay").style.display = "none";
}

function showCustom(){
	document.getElementById("songNames").style.display = "none";
	document.getElementById("customizeTexts").style.display = "block";
	document.getElementById("customHeader").style.background = "#004384";
	document.getElementById("customHeader").style.color = "white";
	document.getElementById("setHeader").style.color = "#004384";
	document.getElementById("setHeader").style.background = "white";

}

function showSet(){
	document.getElementById("songNames").style.display = "inherit";
	document.getElementById("customizeTexts").style.display = "none";
	document.getElementById("setHeader").style.background = "#004384";
	document.getElementById("setHeader").style.color = "white";
	document.getElementById("customHeader").style.background = "white";
	document.getElementById("customHeader").style.color = "#004384";
}

function showBPMHelp(){
	document.getElementById("BPMHelp").style.display = "block";
	document.getElementById("needHelpBPM").style.display = "none";
	document.getElementById("hideHelpBPM").style.display = "inherit";
}

function hideBPMHelp(){
	document.getElementById("BPMHelp").style.display = "none";
	document.getElementById("hideHelpBPM").style.display = "none";
	document.getElementById("needHelpBPM").style.display = "inherit";
}

showGame = function(song){
	if (!inited){
		$('#video_canvas').hide();
		$('#playShine').fadeIn(800,function(){
		});	
	}
	newGame(song);

}


showCustomGame = function(){
	if (!inited){
		$('#video_canvas').hide();
		$('#playShine').fadeIn(800,function(){
		});	
	}
	newCustomGame();

}

$("document").ready(function(){
	$('#sInstructions').click(function(){
		$('body').animate({
			scrollTop: '0px'}, 2000);
		pauseGame();
	});
});

window_height = window.innerHeight;
songIDs = ["#song0", "#song1", "#song2", 
	"#song3", "#song4", "#song5", 
	"#song6", "#song7", "#song8", 
	"#song9", "#song10"]

$(document).ready(function(){
 $(window).scroll(function(){
  var y = $(window).scrollTop();
  if (inited){
  		if( y < window_height - 200 || y > 2*window_height-200){
  			$("#songNames").css({'color':'#004384'});
			$("#customizeTexts").css({'color':'#004384'});
			$(".artist").css({'color': 'rgba(0,62,95,0.5)'});
			$(".inputTitle").css({'color':'#004384'});
			$("#needHelpBPM").css({'color': '#003E5F'});
		}
		else{
			$("#songNames").css({'color':'#bbb'});
			$("#customizeTexts").css({'color':'#bbb'});
		 	$(".artist").css({'color': 'rgba(255,255,255, 0.3'});
		 	$(".inputTitle").css({'color':'white'});
		 	$("#needHelpBPM").css({'color':'#bbb'});
    	}	
/*		if (y > window_height -100){
  			$(".fancybutton").css({'background-color':'white', 'color': '#004384'});
		}
		else{
			$(".fancybutton").css({'background-color': '#004384', 'color': 'white'});
		}*/
  }
 });
})
$(document).ready(function(){
 $(window).scroll(function(){
  var y = $(window).scrollTop();
  if( y > 0 ){
      $("#top-shadow").css({'display':'block', 'opacity':y/100});
	  $("nav").css({'-webkit-box-shadow': '0 0 0 rgba(0, 0, 0, 0.4)'});
	  $("nav").css({'box-shadow': '0 0 0 rgba(0, 0, 0, 0.4)'});
  } else {
      $("#top-shadow").css({'display':'block', 'opacity':y/100});
  }
 });
})
