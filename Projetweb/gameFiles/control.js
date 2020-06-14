var context, controller, loop, player;

var playerImg = new Array();
playerImg[0] = new Image();
playerImg[1] = new Image();
playerImg[0].src = "gameFiles/entityImages/Paul.png";
playerImg[1].src = "gameFiles/entityImages/Legs.png";

var attackSpd = 0;

var timer = 20;

var attacking = false;
context = document.querySelector("canvas").getContext('2d');

context.canvas.height = 600;
context.canvas.width = 1600;

player = new Entity("player",null,10000,10000,5,1.5,125,240,0,0,true);

controller = {
	left:false,
	right:false,
	up:false,
	switching:false,
	keyListener:function(event) {
		var key_state = (event.type == "keydown")?true:false;
		switch(event.keyCode) {
			case 81: //left
				controller.left = key_state;
				player.direction = "left";
				if(attacking==false) {
					player.x_direction = 500;
				} else {
					player.x_direction = 750;
				}
				
			break;

			case 90: //up
				controller.up = key_state;
			break;

			case 68: //right
				controller.right = key_state;
				player.direction = "right";
				if(attacking==false) {
					player.x_direction = 0;
				} else {
					player.x_direction = 250;
				}
			break;

			case 32:
				attacking=true;
			break;

			case 69:
				switching=key_state;
				if(switching) {
					switchWeapon();
				}
			break;
		}
	}
};

loop = function() {

	playerUpdate();
	
	//Teleport
	if(player.x<0) {
		player.x = 0;
	} else if (player.x > 1600) {
		player.x = 1600;
	}

	if(player.y_velocity>-2 && player.x_velocity>-2 &&  player.y_velocity<2 && player.x_velocity<2) {
		timer = 0;
		if(player.direction == "right") {
			player.state = 0;
		} else {
			player.state = 750;
		}
	}

	entityUpdate();
	
	showMap();
	showPlayer();
	gameActivity();
	showEntity();
	showGUI();
	
	if(player.hp>0) {
		bgm.play();
		window.requestAnimationFrame(loop);
	} else {
		context.fillStyle="red";
		context.fillRect(0,0,1600,800);
		context.fillStyle = "white";
		context.font = "60px Arial";
		context.textAlign = "center";
		context.fillText("YOU DIED !!",800,100);
		context.font = "30px Arial";
		context.textAlign = "center";
		context.fillText("Reload page to restart",800,200);
	}
};
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);
