var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg, zombieGroup
var bullet, bulletImg, bulletGroup
var invisibleGround
var gameOver,gameOverImg,restart,restartImg

var PLAY = 1
var END = 0
var gameState = PLAY

var score = 0


function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")
  zombieImg = loadImage("assets/zombie.png")
  bulletImg = loadImage("assets/bullet.png")


  bgImg = loadImage("assets/bg.jpeg")

  restartImg = loadImage("assets/restart copy.png");
  gameOverImg = loadImage("assets/gameover.png")

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)
   player.collider.isVisible = false

zombieGroup = new Group()
bulletGroup = new Group()

restart = createSprite(displayWidth-1100,600);
  restart.addImage(restartImg);
  restart.visible = false;

  gameOver = createSprite(displayWidth-1100,500);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;
  gameOver.scale = 0.3

score = 0



   invisibleGround = createSprite(displayWidth-1000,displayHeight-220,displayWidth,50);
   invisibleGround.visible = false;

}

function draw() {
  background(0);
  



  if(gameState === PLAY){
    score = score + Math.round(getFrameRate()/60);
    
  //moving the player up and down and making the game mobile compatible using touches
  if(keyDown("UP_ARROW") && player.y >= displayHeight-300) {
    player.velocityY = -20;
  }
  player.velocityY = player.velocityY + 0.8
//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){ 
  player.addImage(shooter_shooting)
  shoot()
  
}
//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}

player.collide(invisibleGround)
zombieSpawn()
zombieCollidePlayer()

if(bulletGroup.collide(zombieGroup)){
  bulletGroup.destroyEach()
  zombieGroup.destroyEach()

}

}

else if(gameState === END){
  player.velocityY = 0
  zombieGroup.setVelocityXEach(0);
  bulletGroup.setVelocityXEach(0);
  zombieGroup.setLifetimeEach(-1);
  bulletGroup.setLifetimeEach(-1);
gameOverFunc()

if(mousePressedOver(restart)) {
  reset();
}
  

}
drawSprites();








stroke("yellow")
  fill("yellow")
  textSize(40)
  text("Score: "+ score, displayWidth-500,100);
  



}

function zombieSpawn(){
  if(frameCount%50===0){
    zombie = createSprite(displayWidth-700, displayHeight-300)
    zombie.velocityX = -20
    zombie.addImage(zombieImg)
    //zombie.y = Math.round(random(500,1000))
    zombieGroup.add(zombie)
    zombie.lifetime = 600
    player.depth = zombie.depth
    zombie.depth = zombie.depth+1
    zombie.scale = 0.15
  }
}

function zombieCollidePlayer(){
  if(zombieGroup.isTouching(player)){
    gameState = END
  }
}

function shoot(){
  bullet = createSprite(player.x, player.y, 50, 50)
bullet.addImage(bulletImg)
bullet.scale = 0.03
bullet.debug = true
   bullet.setCollider("rectangle",0,0,1000,1000)
   bullet.collider.visible = false
   bulletGroup.add(bullet)
  bullet.velocityX = 8
}

function gameOverFunc(){
gameOver.visible = true
restart.visible = true
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  zombieGroup.destroyEach();
  bulletGroup.destroyEach();

  score = 0
}
