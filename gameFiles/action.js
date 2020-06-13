//On va stocker ici tout ce qui est action du jeu (attaquer, tirer, prendre des dégats, saut, mouvement etc.)

var mapoh = new Image();
mapoh.src = "gameFiles/gameUI/paysage.png";

var tuto = new Image();
tuto.src = "gameFiles/gameUI/Tutorial.png";
var win = 0;
var Level = 0;
var Legstimer = 0;
var attackCooldown = 0;
var weapons = new Array();
var transRect = -11000;
var niveau = 0;
var jumpTimer = 0;
var dragonTimer = 0;
var bgm = new sound("gameFiles/sfx/Yoneuve.mp3");
var hurt = new sound("gameFiles/sfx/douleur.mp3");
var mobHurt = new sound("gameFiles/sfx/oof.mp3");
var cuteHurt = new sound("gameFiles/sfx/cutie.mp3");
var dragonROAR = new sound("gameFiles/sfx/DRAGON.mp3");
var fireball = new Weapon("fireball",10,0.7,20,120,50,'gameFiles/weaponImages/fireball.png',900,0);
var fire = 0;
//Class of an entity
function Entity(name,image,hp,max_hp,damage,weight,width,height,x,y,gravityAffliction,immunity) {
	this.name = name;
	this.image = new Image();
	this.image.src = image;
	this.hp = hp;
	this.max_hp = max_hp;
	this.damage = damage;
	this.weight = weight;
	this.width =  width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.x_velocity = 0;
	this.y_velocity = 0;
	this.jumping = true;
	if(name == "player") {
		this.x_direction=0;
		this.state=0;
		this.gravityAffliction = gravityAffliction;
		this.direction = "right";
	} else {
		this.immunity = 0;
		this.direction = "left";
		this.gravityAffliction = gravityAffliction;
	}
}

var entityList = [];
var enemy = new Entity('protoman','gameFiles/entityImages/enemy.png',250,250,40,5,250,250,1300,180,true);
entityList.push(enemy);

function Weapon(name,damage,speed,attackLength,width,height,image,x,y) {
	this.name = name;
	this.x = x;
	this.y = y;
	this.height = height;
	this.width = width;
	this.image = new Image();
	this.image.src = image;
	this.damage = damage;
	this.speed = speed;
	this.attackLength = attackLength;
}

var knife = new Weapon("knife",10,0.7,20,120,50,'gameFiles/weaponImages/knife.png',0,0);
var sword = new Weapon("sword",50,2,20,440,100,'gameFiles/weaponImages/sword.png',0,0);
weapons.push(knife);
weapons.push(sword);

function attack() {
	attacking = true;
}

function takeDamage(dealer,taker) {
	jump(taker,10);
	if(taker.name != "dragon") {
		if(dealer.direction=="right") {
			taker.x_velocity += 10/taker.weight + 5;
		} else {
			taker.x_velocity -=10/taker.weight + 5;
		}
	}
	
	if(dealer.name!="player") {
		hurt.play();
		if(dealer.direction=="right" && dealer.name!="dragon" ) {
			dealer.x_velocity -= 10 + 5;
		} else if(dealer.name!="dragon"){
			dealer.x_velocity +=10 + 5;
		}
		taker.hp -= dealer.damage;
	} else {
		if(taker.name == "cake") {
			cuteHurt.play();
		} else if(taker.name == "dragon") {
			dragonROAR.play();
		} else {
			mobHurt.play();
		}
		weapons[0].y = 10000;
		taker.hp -= weapons[0].damage;
	}
}

function showPlayer() {
	if(player.direction == "right") {
		context.drawImage(playerImg[0],player.x_direction,0,player.width*2,player.height,player.x, player.y,player.width*2,player.height);
		context.drawImage(playerImg[1],player.state,0,player.width*2,player.height,player.x, player.y+(player.height*0.86),player.width*2,player.height);
	} else {
		context.drawImage(playerImg[0],player.x_direction,0,player.width*2,player.height,player.x-player.width, player.y,player.width*2,player.height);
		context.drawImage(playerImg[1],player.state,0,player.width*2,player.height,player.x-player.width, player.y+(player.height*0.86),player.width*2,player.height);
	}
}

function showMap() {
	//Background setup
	context.drawImage(mapoh,0, 0, 1600, 600);

	if(niveau == 0) {
		context.drawImage(tuto,800,-300,1000,1000);
	}
}

function showEntity() {
	for(entity of entityList) {
		if(entity.hp > 0) {
			if(entity.name != "dragon") {
				context.drawImage(entity.image,entity.x,entity.y,entity.width,entity.height);
				context.globalAlpha = 0.50;
				context.fillStyle="#ff0200";
				context.fillRect(entity.x+50,entity.y,(entity.width/2)*(entity.hp/entity.max_hp),20);
				context.globalAlpha = 1;
			} else {
				animateDragon();
				context.globalAlpha = 0.50;
				context.fillStyle="#ff0200";
				context.fillRect(0,0,(1600)*(entity.hp/entity.max_hp),10);
				context.globalAlpha = 1;
			}
			
			
		}
	}
}

function gameActivity() {
	if(attacking==true) {
		if(player.direction == "right") {
			player.x_direction = 250;
		} else {
			player.x_direction = 750;
		}
		if(attackCooldown<weapons[0].attackLength) {
			if(weapons[0].name == "knife" && weapons[0].y != 10000) {
				weapons[0].x = weapons[0].width*attackCooldown*weapons[0].speed;
				weapons[0].y = weapons[0].height;
				checkDamage();
				//Méthode 1 pour charger l'image gauche et droite
				if(player.direction == "right") {
					if(weapons[0].image.src != "gameFiles/weaponImages/knifeUH.png") {
						weapons[0].image.src = "gameFiles/weaponImages/knifeUH.png";
					}
					context.drawImage(weapons[0].image,player.x+weapons[0].x+75,player.y+weapons[0].y+60,weapons[0].width/2,weapons[0].height/2);
				} else {
					if(weapons[0].image.src != "gameFiles/weaponImages/knife.png") {
						weapons[0].image.src = "gameFiles/weaponImages/knife.png";
					}
					context.drawImage(weapons[0].image,player.x-(weapons[0].x+75),player.y+weapons[0].y+60,weapons[0].width/2,weapons[0].height/2);
				}
			} else if(weapons[0].name == "sword" && weapons[0].x != -1) {
				weapons[0].x = player.x+player.width+player.width/2+weapons[0].width/2;
				weapons[0].y = player.y+player.y/3;
				checkDamage();
				//Méthode 2, plus efficace
				if(player.direction == "right") {
					context.drawImage(weapons[0].image,0,0,440,100,player.x+player.width+player.width/2,player.y+player.y/3,weapons[0].width/2,weapons[0].height/2);
				} else {
					context.drawImage(weapons[0].image,440,0,440,100,player.x-(player.width+player.width+30),player.y+player.y/3,weapons[0].width/2,weapons[0].height/2);
				}
			}
			
			attackCooldown += weapons[0].speed;
		} else {
			weapons[0].x = 0;
			weapons[0].y = 0;
			attacking = false;
			attackCooldown = 0;
			if(player.direction == "right") {
				player.x_direction = 0;
			} else {
				player.x_direction = 500;
			}
		}
	}

	if(fire == 1) {
		dragonFire();
	}

	if(win == 1) {
		window.removeEventListener("keydown", controller.keyListener);
		window.removeEventListener("keyup", controller.keyListener);
		if(player.x<600) {
			moveRight(player);
		} else {
			if(player.jumping == false) {
				jump(player,30);
			}
			context.fillStyle = "black";
			context.globalAlpha = 0.2;
			context.fillRect(100,120,1400,300);
			context.globalAlpha = 1;
			context.fillStyle = "yellow";
			context.font = "60px Courier";
			context.textAlign = "center";
			context.fillText("QUEST SUCCESS !",800,200);
			context.fillText("Thanks for playing !",800,300);
		}
	} else if(entityList == 0) {
		if(transRect*4/5<1000) {
			player.x_velocity = 5;
			moveRight(player);
			window.removeEventListener("keydown", controller.keyListener);
			window.removeEventListener("keyup", controller.keyListener);
			transition();
			if(transRect*4/5==-400) {
				niveau += 1;
				player.x = 0;
				player.x_velocity=0;
				controller.right=false;
				controller.left=false;
				controller.up=false;
				if(niveau == 2) {
					mapoh.src = "gameFiles/gameUI/paysage2.png";
				} else if(niveau == 1) {
					mapoh.src = "gameFiles/gameUI/paysage1.png";
				} else if(niveau == 3) {
					mapoh.src = "gameFiles/gameUI/paysage3.png";
				} else if(niveau == 4) {
					mapoh.src = "gameFiles/gameUI/paysage4.jpg";
				} else if(niveau == 5) {
					mapoh.src = "gameFiles/gameUI/paysage5.png";
				} else {
					mapoh.src = "gameFiles/gameUI/paysage6.jpg";
				}
			}
		} else {
			transRect = -11000;
			window.addEventListener("keydown", controller.keyListener);
			window.addEventListener("keyup", controller.keyListener);
			if(niveau == 1) {
				var enemy = new Entity('protoman','gameFiles/entityImages/enemy.png',400,400,40,5,250,250,1300,180,true);
				entityList.push(enemy);
			} else if(niveau == 2) {
				var enemy = new Entity('protoman','gameFiles/entityImages/enemy2.png',500,500,60,5,450,450,1300,180,true);
				entityList.push(enemy);
			} else if(niveau == 3) {
				var enemy = new Entity('cake','gameFiles/entityImages/cake.png',500,500,100,5,300,300,1000,180,true);
				entityList.push(enemy);
			} else if(niveau == 4) {
				var enemy = new Entity('protoman','gameFiles/entityImages/enemy.png',500,500,40,5,250,250,1300,180,true);
				var enemy2 = new Entity('protoman','gameFiles/entityImages/enemy2.png',700,700,60,5,450,450,1400,180,true);
				var enemy3 = new Entity('cake','gameFiles/entityImages/cake.png',500,500,100,5,300,300,1500,180,true);
				entityList.push(enemy);
				entityList.push(enemy2);
				entityList.push(enemy3);
			} else if(niveau == 5) {
				bgm.stop();
				bgm = new sound("gameFiles/sfx/Devil.mp3");
				bgm.play();
				var enemy = new Entity('dragon','gameFiles/entityImages/DRAGON.png',5000,5000,300,5,491*2,306*2,800,180,true);
				entityList.push(enemy);
			} else {
				bgm.stop();
				bgm = new sound("gameFiles/sfx/Evertale.mp3");
				bgm.play();
				var enemy = new Entity();
				win = 1;
				entityList.push(enemy);
			}
		}
	}
}

function checkDamage() {
	for(entity of entityList) {
		if(entity.immunity > 10) {
			if(weapons[0].name == "knife") {
				if(player.direction == "right") {
					if(weapons[0].x+150+player.x+weapons[0].width > entity.x && weapons[0].x+player.x+weapons[0].width < entity.x + entity.width) {
						if(weapons[0].y+60+player.y+weapons[0].height > entity.y && weapons[0].y+60+player.y+weapons[0].height < entity.y + entity.height) {
							takeDamage(player,entity);
							entity.immunity = 0;
						}
					}
				} else {
					if(player.x-(weapons[0].x+150) < entity.x + entity.width && player.x-(weapons[0].x+150) > entity.x) {
						if(player.y+weapons[0].y+60 < entity.y+entity.height && player.y+weapons[0].y+60 > entity.y) {
							takeDamage(player,entity);
							entity.immunity = 0;
						}
					}
				}
			} else {
				if(player.direction == "right") {
					if(weapons[0].x > entity.x && weapons[0].x < entity.x + entity.width) {
						if(weapons[0].y > entity.y && weapons[0].y < entity.y + entity.height) {
							takeDamage(player,entity);
							entity.immunity = 0;
						}
					}
				} else {
					if(player.x-(player.width+player.width+30) < entity.x + entity.width && player.x-(player.width+player.width+30) > entity.x) {
						if(weapons[0].y < entity.y+entity.height && weapons[0].y > entity.y) {
							takeDamage(player,entity);
							entity.immunity = 0;
						}
					}
				}
			}
		} else {
			entity.immunity+=1;
		}
	}
		
}

function legsAnimation() {
	if(Legstimer<5) {
		Legstimer += 1;
		if(player.direction == "right") {
			player.state = 250;
		} else {
			player.state = 1000;
		}
	} else if(Legstimer<10) {
		Legstimer+=1;
		if(player.direction == "right") {
			player.state = 500;
		} else {
			player.state = 1250;
		}
	} else {
		Legstimer = 0;
	}
}

//Basic move
	//Jump
function jump(entity,height) {
	entity.y_velocity -= height;
	entity.jumping = true; //jump only once !
}

	//Right movement
function moveRight(entity) {
	entity.x_velocity += 0.5;
}

	//Left movement
function moveLeft(entity) {
	entity.x_velocity -= 0.5;
}

//Physics
	//Gravity - Fall
function gravity(entity,weight) {
	entity.y_velocity += weight;
	entity.x += entity.x_velocity;
	entity.y += entity.y_velocity;
}
	//Friction
function friction(entity) {
	entity.x_velocity *= 0.9;
	entity.y_velocity *= 0.9;
}
	//Collision
function collision(entity) {
	var threshold = 500;
	if(entity.name != "player") {
		threshold = 500+50;
	}

	if(entity.y+entity.height > threshold){
		entity.jumping = false;
		entity.y = threshold-entity.height;
		entity.y_velocity = 0; //Full stop on collision
	}

}

//Play bgm
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

function playerUpdate() {
	if(controller.up && player.jumping == false) {
		jump(player,50);
	}

	if(controller.left) {
		moveLeft(player);
	}

	if(controller.right) {
		moveRight(player);
	}
	legsAnimation();
	gravity(player,player.weight);
	friction(player);
	collision(player);
}

function entityUpdate() {
	for(entity of entityList) {
		if(entity.hp>0) {
			if(entity.name != "cake" && entity.name !="dragon") {
				if(player.x < entity.x) {
					entity.direction = "left";
					moveLeft(entity);
				} else if (player.x > entity.x) {
					entity.direction = "right";
					moveRight(entity);
				}
			} else if(entity.name == "cake") {
				if(player.x < entity.x) {
					entity.direction = "left";
					if(jumpTimer%25 == 0) {
						jumpTimer = 0;
						if(entity.jumping == false) {
							entity.x_velocity+=1;
							jump(entity,70);
						}
						jumpTimer+=1;
					} else {
						if(entity.jumping == true) {
							entity.x_velocity-=0.5;
							if(entity.image.src != "gameFiles/entityImages/damagedCake.png") {
								entity.image.src = "gameFiles/entityImages/damagedCake.png";
							}
						} else {
							if(entity.image.src != "gameFiles/entityImages/Cake.png") {
								entity.image.src = "gameFiles/entityImages/Cake.png";
							}
						}
						jumpTimer+=1;
					}
				} else if (player.x > entity.x) {
					entity.direction = "right";
					if(jumpTimer%25 == 0) {
						jumpTimer = 0;
						if(entity.image.src != "gameFiles/entityImages/damagedCake.png") {
							entity.image.src = "gameFiles/entityImages/damagedCake.png";
						}
						if(entity.jumping == false) {
							entity.x_velocity-=1;
							jump(entity,70);
						}
						jumpTimer-=1;
					} else {
						if(entity.jumping == true) {
							entity.x_velocity+=0.5;
						}
						if(entity.image.src != "gameFiles/entityImages/Cake.png") {
							entity.image.src = "gameFiles/entityImages/Cake.png";
						}
						jumpTimer-=1;
					}
				}
			} else {

			}
			gravity(entity,entity.weight);
			friction(entity);
			collision(entity);
			if((entity.x>player.x && entity.x < player.x+player.width) || (entity.x+entity.width > player.x && entity.x+entity.width < player.x+player.width)) {
				takeDamage(entity,player);
			}
		}else {
			entity.x = 0;
			entity.y = 0;
			entity.hp = 0;
			entityList.splice(entityList.indexOf(entity),1);
			delete entity;
		} 
	}
}


function transition() {
	transRect += 50;
	context.fillStyle="black";
	context.fillRect(transRect,(context.canvas.height/10)-context.canvas.height/10,10000,context.canvas.height/10);
	context.fillRect(transRect+50,context.canvas.height/10,10000,context.canvas.height/10);
	context.fillRect(transRect+100,context.canvas.height*2/10,10000,context.canvas.height/10);
	context.fillRect(transRect+150,context.canvas.height*3/10,10000,context.canvas.height/10);
	context.fillRect(transRect+200,context.canvas.height*4/10,10000,context.canvas.height/10);
	context.fillRect(transRect+250,context.canvas.height*5/10,10000,context.canvas.height/10);
	context.fillRect(transRect+300,context.canvas.height*6/10,10000,context.canvas.height/10);
	context.fillRect(transRect+350,context.canvas.height*7/10,10000,context.canvas.height/10);
	context.fillRect(transRect+400,context.canvas.height*8/10,10000,context.canvas.height/10);
	context.fillRect(transRect+450,context.canvas.height*9/10,10000,context.canvas.height/10);
}

function showGUI() {
	if(win==0) {
		context.fillStyle = "#ff0000";
	 	context.font = "30px Courier";
		context.textAlign = "center";
		context.fillText(["HP: "+player.hp],100,30);
		context.fillStyle = "white";
		context.fillText("Weapon:",300,30);
		context.fillStyle = "black";
		context.fillRect(370,10,250,100);
		context.clearRect(375,15,240,90);
		context.fillStyle = "blue";
		context.fillText(["Level: "+niveau],1500,30);
		if(weapons[0].name == "knife") {
			context.drawImage(knife.image,450,30,weapons[0].width,weapons[0].height);
		} else {
			context.drawImage(weapons[0].image,0,0,440,100,385,45,weapons[0].width/2,weapons[0].height/2);
		}
	}
	
}

function switchWeapon() {
	[weapons[0],weapons[1]] = [weapons[1],weapons[0]];
}

function animateDragon() {
	if(dragonTimer%1000 < 50) {
		context.drawImage(entityList[0].image,0,0,491,306,entityList[0].x,entityList[0].y,entityList[0].width,entityList[0].height);
		dragonTimer+=8;
	} else if( dragonTimer%1000 < 100) {
		context.drawImage(entityList[0].image,0,306,491,306,entityList[0].x,entityList[0].y,entityList[0].width,entityList[0].height);
		dragonTimer+=8;
	} else if( dragonTimer%1000 < 150) {
		context.drawImage(entityList[0].image,0,306*2,491,306,entityList[0].x,entityList[0].y,entityList[0].width,entityList[0].height);
		dragonTimer+= 8;
	} else if( dragonTimer%1000 < 200) {
		context.drawImage(entityList[0].image,0,306*3,491,306,entityList[0].x,entityList[0].y,entityList[0].width,entityList[0].height);
		dragonTimer+=8;
	} else if( dragonTimer%1000 < 250) {
		context.drawImage(entityList[0].image,0,306*4,491,306,entityList[0].x,entityList[0].y,entityList[0].width,entityList[0].height);
		dragonTimer+= 8;
	} else if( dragonTimer%1000 < 300) {
		context.drawImage(entityList[0].image,0,306*5,491,306,entityList[0].x,entityList[0].y,entityList[0].width,entityList[0].height);
		dragonTimer+= 8;
	} else if( dragonTimer%1000 < 350) {
		context.drawImage(entityList[0].image,0,306*6,491,306,entityList[0].x,entityList[0].y,entityList[0].width,entityList[0].height);
		dragonTimer+= 8;
	} else if( dragonTimer%1000 < 400) {
		context.drawImage(entityList[0].image,0,306*7,491,306,entityList[0].x,entityList[0].y,entityList[0].width,entityList[0].height);
		dragonTimer+= 8;
	} else if( dragonTimer%1000 < 450) {
		context.drawImage(entityList[0].image,0,306*8,491,306,entityList[0].x,entityList[0].y,entityList[0].width,entityList[0].height);
		dragonTimer+= 8;
	} else if( dragonTimer%1000 < 500) {
		context.drawImage(entityList[0].image,0,306*9,491,306,entityList[0].x,entityList[0].y,entityList[0].width,entityList[0].height);
		dragonTimer+= 8;
	} else if( dragonTimer%1000 < 550) {
		context.drawImage(entityList[0].image,0,306*10,491,306,entityList[0].x,entityList[0].y,entityList[0].width,entityList[0].height);
		dragonTimer+= 8;
	} else if( dragonTimer%1000 < 600) {
		context.drawImage(entityList[0].image,0,306*11,491,306,entityList[0].x,entityList[0].y,entityList[0].width,entityList[0].height);
		dragonTimer+=8;
	} else if( dragonTimer%1000 < 999) {
		context.drawImage(entityList[0].image,0,306*12,491,306,entityList[0].x,entityList[0].y,entityList[0].width,entityList[0].height);
		fire = 1;
		dragonTimer+=8;
	}
}

function dragonFire() {
	if(entityList.length != 0) {
		if(fireball.x > -300) {
			fireball.x-=20;
			context.drawImage(fireball.image,fireball.x,entityList[0].height/2+60,300,200);
			if(fireball.x<player.x+player.width && fireball.x>player.x) {
				if(entityList[0].height/2+60 < player.y+player.height && entityList[0].height/2+60>player.y) {
					takeDamage(entityList[0],player);
				}
			}
		} else {
			fire = 0;
			fireball.x = entityList[0].x;
			
		}
	}
}