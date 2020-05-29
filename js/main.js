'use strict'
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let score = 0;
let foodImg = [];
let randCount = Math.floor(Math.random()*5 + 1);
let dir;
let speedCount = 15;

canvas.width = 400;
canvas.height = 600;

//Сборник картинок <-- Блок снизу
const background = new Image();
background.src = "img/bg.jpg";

const bowl = new Image();
bowl.src = "img/bowl.png";

const scoreImg = new Image();
scoreImg.src = "img/score.png";

for ( let i = 1; i <= 5; i++) {
    foodImg[i] = new Image();
    foodImg[i].src = "img/" + i + ".png";
}
/////////////////////////////////

//Назначим изначальные координаты появления первого фрукта и миски
let food = {
    x: Math.floor(Math.random()*275+15),
    y: -15,
};
let refr = {
   x: 250,
   y : 530,

};
//

//Аудио сборник <-- Блок снизу
let press_button_in_diff = new Audio('audio/knopka.mp3');

let sound_of_horn1 = new Audio('audio/zvyk_gorna1.mp3');
let sound_of_horn2 = new Audio('audio/zvyk_gorna2.mp3');

let easy_music = new Audio('audio/easy_music.mp3');
easy_music.setAttribute('loop', 'loop');

let medium_music = new Audio('audio/medium_music.mp3');
medium_music.setAttribute('loop', 'loop');

let hard_music = new Audio('audio/hard_music.mp3');
hard_music.setAttribute('loop', 'loop');
//////////////////////////////

//Функция, которая будет указывать направление миски при нажатие на стрелки и WASD
document.addEventListener("keydown", direction);
function direction(event) {
	if(event.keyCode === 37 || event.keyCode === 97 || event.keyCode === 65 )
		dir = "left";
	else if(event.keyCode === 39 || event.keyCode === 68 || event.keyCode === 100)
        dir = "right";
        else if (event.keyCode === 40 || event.keyCode === 115 || event.keyCode === 83 )
        dir = "down";
}
//

//Функция, которая выбирает значения скорости игры и окрашивает выбраную сложность тенью
function setSpeed(count) {
    speedCount = 15 - (count-1)*5;
    console.log(speedCount);
    for (let k = 1 ; k <= 3; k++) {
            document.getElementById(`changer${k}`).style.boxShadow = 'none'; 
    }
    document.getElementById(`changer${count}`).style.boxShadow = "#b3923a 1.5px 1.5px 1.5px 1.5px";
}
//

//функция которая делает заданый элемент невидимым
function visibility(nameID) {
    document.getElementById(`${nameID}`).style.visibility = "hidden";
}
//

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

//записываем очки рядом
ctx.fillStyle = "white";
ctx.font = "20px Arial";
ctx.fillText(score, 40, 25);
}
//

//Функция которая запускаеться при нажатие на кпопку 'Press Enter to Start Game'
function start() {

    //Отключаем кнопку
    visibility('start_game');
    document.getElementById('start_game').setAttribute('disabled', 'disabled');

    //запускаем перед началом игры анимированый таймер
    let count = 0;
    for (let i = 3 ; i >= 1 ; i-- ) {
    setTimeout( ()=>{ 
        document.getElementById(`text${i}`).style.animationPlayState='running'; 
            sound_of_horn1.play(); 
    }, count*1000 );
    count++;
   }

//Основная функция, которая отрисовует игру
function draw() {

    if ( speedCount === 15) {
        easy_music.play();
    }
    else if ( speedCount === 10 ) {
        medium_music.play();
    }
    else {
        hard_music.play();
    }

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
    if(dir == "left") refr.x = refr.x - 2 - ( score / speedCount );
    if(dir == "right") refr.x = refr.x + 2 + ( score / speedCount );
    if(dir == "down") refr.x += 0;
    
    food.y = food.y + 2 + Math.floor( (score / speedCount));

    if (randCount === 5 && food.y >= refr.y - 20 && food.y <= refr.y - 15 && food.x + 40 <= refr.x + 90 && food.x >= refr.x ) {
        score += 5;
        food =  {
            x: Math.floor(Math.random()*275+15),
            y: -15,
        }
        randCount = Math.floor(Math.random()*5 + 1);
    }

     else if ( food.y >= refr.y - 20 && food.y <= refr.y - 15  && food.x + 40 <= refr.x + 90 && food.x >= refr.x ) {
        score ++;
        food = {
            x: Math.floor(Math.random()*275+15),
            y: -15,
       };
       randCount = Math.floor(Math.random()*5 + 1);
    }
    else if (food.y > refr.y + 17) {

        if ( speedCount === 15 ) {
            easy_music.pause();
        }
        else if ( speedCount === 10 ) {
            medium_music.pause();
        }
        else {
            hard_music.pause();
        }

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
document.addEventListener("keydown", ( event ) => { 
    if (event.keyCode === 13) { 
        start(); 
    }
});
//Добавляем режим смены сложности и одновременно запускаем проигрыватель музыки
for (let i = 1; i <= 3; i++) {
document.getElementById(`changer${i}`).onclick = ()=> {
    setSpeed(i);
     if ( !press_button_in_diff.paused ) {
         press_button_in_diff.pause();
     }
     press_button_in_diff.play();
}
}
