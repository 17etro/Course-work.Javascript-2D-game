'use strict'
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

const background = new Image();
background.src = "img/bg.jpg";
const bowl = new Image();
bowl.src = "img/bowl.png";
const scoreImg = new Image();
scoreImg.src = "img/score.png";

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
    y : 530,

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

//функция которая отрисовует игровые очки 
function drawScore(score) {
//рисуем прямоугольник
ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 35);
    ctx.lineTo(canvas.width, 35);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(0,0);
    ctx.strokeStyle = '#142743';
    ctx.stroke();
    ctx.fillStyle = '#142743';
    ctx.fill();
ctx.closePath();
//рисуем арбуз
ctx.drawImage( scoreImg, 5, 5, 25, 25 );
//записуем очки рядом
ctx.fillStyle = "white";
ctx.font = "20px Arial";
ctx.fillText(score, 40, 25);
}
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
    //Прорисовуем фоновую картинку
    ctx.drawImage(background, 0, 0);
    //Рисуем меню игровых очков 
    drawScore(score);
    //Условие, когда миска выходит за рамки игрового поля
    if ( refr.x === 440 ) {
        refr.x = -20;
    }
    else  if (refr.x === -40) {
        refr.x = 420;
    }
    /////////////////////////////////////////////////////

// При каждой итерации, делаем поворот и смещение канваса так, что бы фрукт крутился.
//Биндим команды 
//!!!!!!
    let dx = food.x + 20, 
    dy = food.y + 20,
    time = new Date();

    ctx.save();
    ctx.translate(dx, dy);
    ctx.rotate(Math.sin(time / 500) / 2);
    ctx.translate(-dx, -dy);
//!!!!!!

    ctx.drawImage(foodImg[randCount], food.x, food.y, 40, 40);

//В конце возвращаем центральные оси канваса на место
//!!!!!!!
    ctx.restore();
//!!!!!!
    if(dir == "left") refr.x -= 2;
    if(dir == "right") refr.x += 2;
    if(dir == "down") refr.x += 0;
    
    food.y += 2;
    if (randCount === 5 && food.y + 15 === refr.y && food.x + 40 <= refr.x + 90 && food.x >= refr.x ) {
        score += 5;
        food =  {
            x: Math.floor(Math.random()*275+15),
            y: -15,
        }
        randCount = Math.floor(Math.random()*5 + 1);
    }

     else if (food.y + 15 === refr.y && food.x + 40 <= refr.x + 90 && food.x >= refr.x ) {
        score ++;
        food = {
            x: Math.floor(Math.random()*275+15),
            y: -15,
       };
       randCount = Math.floor(Math.random()*5 + 1);
    }
    else if (food.y > refr.y + 17) {
        alert(`Game Over! You scored ${score} point`);
        clearInterval(game);
        location.reload();
    }
    ctx.drawImage(bowl, refr.x, refr.y, 90, 80);
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

