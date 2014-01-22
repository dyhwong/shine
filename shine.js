//stuff from Victor and Norman
// sets up the basic structure 
var selectedX = new Array();
var selectedY = new Array();
var pointLit = new Array();



var score = 0;

initShiny = function(){
	var width = 640;
	var height = 480;
	var video = document.createElement("video");
	// video.setAttribute("height",height);
	// video.setAttribute("width",width);
	var canvas = document.getElementById("video_canvas");
	canvas.width= width;
	canvas.height=height;
	var context = canvas.getContext("2d");
	context.translate(width,0);
	context.scale(-1,1);

	var shiny = document.getElementById("shiny");
	var shiny_context = shiny.getContext("2d");


//calls helper functions and stuff
	var counter = 1;
	var me = this;
	var videoLoop = function(){
		context.drawImage(video, 0,0, width, height);
		lightPoint(canvas.getContext('2d'));
		testPoint(canvas.getContext('2d'));
		counter = counter+1;
		if (counter % 33 === 1){
			generatePoint();
		}
		if (counter === 6000){
			console.log("Game over")
			console.log(score)
		}
		setTimeout(videoLoop,30);
	};
// call helper functions
	/*var songPlaying = true;
	console.log("repeaterTimeOut code reached")
	var repeaterTimeOut = function(){
		console.log("repeaterTimeOut starting")
		setTimeout(function(){songPlaying = false; clearInterval(myVar); console.log(score)}, 200000);
		var myVar = setInterval(repeater, 1000);
		var repeater = function(){
			generatePoint();
			lightPoint();
			testPoint();
		console.log("repeaterTimeOut ending")
		}
	};
	console.log("repeaterTimeOut code ending")*/

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
	x_new = Math.floor(Math.random() * 56 + 5) * 10;
	y_new = Math.floor(Math.random() * 40 + 5) * 10;
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
		pointLit.push(false);
	}
	
}

// make the generated points glow
// remove the dots that were hit
// white dot url http://s9.postimg.org/tqte0y5an/white_dot.png
// yellow dot url http://s28.postimg.org/5576hs75p/yellow_dot.png
// light blue dot <img src ="http://oi40.tinypic.com/2lcu4qo.jpg">
// light yellow dot <img src ="http://oi44.tinypic.com/35ism0p.jpg"> 

function lightPoint(context){
	//activate the dots created to be yellow
	//set the ones just hit to be light blue
	for (var i = 0; i < pointLit.length; i++){
		light_yellow_dot = new Image();
		light_yellow_dot.src = "lightyellow_dot.png";
		light_yellow_dot.height = 10;
		light_yellow_dot.width = 10;
		if (pointLit[i] === true){
			context.drawImage(light_yellow_dot, selectedX[i], selectedY[i]);
		}
		else{
			if (pointLit[i] === false){
				context.drawImage(light_yellow_dot, selectedX[i], selectedY[i]);
				pointLit[i] = true;
			}
			else{
				if (pointLit[i] === 0){
					light_blue_dot = new Image();
					light_blue_dot.src = "lightblue_dot.png";
					context.drawImage(light_blue_dot, selectedX[i], selectedY[i]);
					selectedX.splice(i, 1);
					selectedY.splice(i, 1);
					pointLit.splice(i, 1);
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
	percent_y = y / 742.917
	return percent_y;
}


function testPoint(canvas){
//this function uses the testLuminance function to determine whether or not points have been hit
// if the luminance at the point is greater than a certain amount, click a button
	for (var i = 0; i < pointLit.length; i++){
		y_point = testLuminance(canvas.getImageData(640 - selectedX[i]-20, selectedY[i]+20, 20, 20));
		if (y_point >= 0.90){
			pointLit[i] = 0;
			score += 100;
		}
	}
}