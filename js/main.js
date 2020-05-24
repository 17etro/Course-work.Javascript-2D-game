'use strict'
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

const background = new Image();
background.src = "img/bg.jpg";

const bowl = new Image();
bowl.src = "img/bowl.png"

let score = 0,
foodImg = [],
randCount = Math.floor(Math.random()*5 + 1),
dir;

for ( let i = 1; i <= 5; i++) {
    foodImg[i] = new Image();
    foodImg[i].src = "img/" + i + ".png";
}

 let food = {
     x: Math.floor(Math.random()*275+15),
     y: -15,
}
let refr = {
    x: 250,
    y : 540,

}


document.addEventListener("keydown", direction);
function direction(event) {
	if(event.keyCode === 37 || event.keyCode === 97 || event.keyCode === 65 )
		dir = "left";
	else if(event.keyCode === 39 || event.keyCode === 68 || event.keyCode === 100)
        dir = "right";
        else if (event.keyCode === 40 || event.keyCode === 115 || event.keyCode === 83 )
        dir = "down";
}


//функция которая делает заданый элемент невидимым
function visibility(nameID) {
    document.getElementById(`${nameID}`).style.visibility = "hidden";
}
//////////////////////////////////////////////////
function start() {

    //Отключаем кнопку
    visibility('start_game');
    document.getElementById('start_game').setAttribute('disabled', 'disabled');
    //запускаем перед началом игры анимированый таймер
    let count = 0;
    for (let i = 3 ; i >= 1 ; i-- ) {
    setTimeout( ()=>{ document.getElementById(`text${i}`).style.animationPlayState='running'; }, count*1000 );
    count++;
   }

///////////////////////////////////////////////////

//Основная функция, которая отрисовует игру
function draw() {
    //На каждом шаге очищаем игровое поле
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //Прорисовуем фоновю картинку и миску
    ctx.drawImage(background, 0, 0);
    //Условие, когда миска выходит за рамки игрового поля
    if ( refr.x === 420 ) {
        refr.x = -20;
    }
    else  if (refr.x === -20) {
        refr.x = 420;
    }
    /////////////////////////////////////////////////////
    ctx.drawImage(bowl, refr.x, refr.y, 70, 70);

// При каждой итерации, делаем поворот и смещение канваса так, что бы фрукт крутился.
//Биндим команды 
//!!!!!!
    let dx = food.x + 20,
    dy = food.y + 20;
    ctx.save();
    ctx.translate(dx, dy);

    var time = new Date();
    ctx.rotate(Math.sin(time / 500) / 2);

    ctx.translate(-dx, -dy);
//!!!!!!

    if (randCount < 5) {
    ctx.drawImage(foodImg[randCount], food.x, food.y, 40, 40);
    }
    else {
        ctx.drawImage(foodImg[randCount], food.x, food.y, 40, 40);
    }
//В конце возвращаем центральные оси канваса на место
//!!!!!!!
    ctx.restore();
//!!!!!!

    ctx.fillStyle = "white";
	ctx.font = "20px Arial";
    ctx.fillText(score, 20, 20);
    

    if(dir == "left") refr.x -= 2;
    if(dir == "right") refr.x += 2;
    if(dir == "down") refr.x += 0;
    
    food.y +=2;

    if (randCount === 5 && food.y +15 == refr.y && food.x <= refr.x+40 && food.x >= refr.x) {
        score += 5;
        food =  {
            x: Math.floor(Math.random()*275+15),
            y: -15,
        }
        randCount = Math.floor(Math.random()*5 + 1);
    }

     else if (food.y == refr.y && food.x <= refr.x+40 && food.x >= refr.x) {
        score ++;
        food = {
            x: Math.floor(Math.random()*275+15),
            y: -15,
       };
       randCount = Math.floor(Math.random()*5 + 1);
    }
    else if (food.y > refr.y + 20) {
        alert(`Game Over! You scored ${score} point`);
        clearInterval(game);
        location.reload();
    }
}
////////////////////////////////////////////////////
let game;
setTimeout(()=>{
    game = setInterval(draw ,1000/60);
}, 3000);

}
//Добавляем нажатие конпки мышкой или через клавишу Enter
document.getElementById('start_game').onclick = function() {
    start();
}
document.addEventListener("keydown", (event)=>{ 
    if (event.keyCode === 13) { 
        start();}
});

