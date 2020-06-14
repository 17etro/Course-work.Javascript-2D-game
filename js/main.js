'use strict';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let score = 0;
const foodImg = [];
let dir;
let speedCount = 15;
let pause = false;
let game;

let time, dx, dy;

const foodHeight = 40;
const foodWidth = 40;
const bowlHeight = 80;
const bowlWidth = 90;

const diffCount = 3;
const imageCount = 5;

const minSpeedCount = 15;
const mediumSpeedCount = 10;
const maxSpeedCount = 5;

canvas.width = 400;
canvas.height = 600;

//Назначим изначальные координаты появления первого фрукта и миски
let food = {
  x: Math.floor(Math.random() * (canvas.width - foodWidth)),
  y: -15,
};
const refr = {
  x: canvas.width / 2 - bowlWidth / 2,
  y: canvas.height - (bowlHeight - 10),
};
//

//Сборник картинок <-- Блок снизу
const background = new Image();
background.src = 'img/bg.jpg';

const bowl = new Image();
bowl.src = 'img/bowl.png';

const scoreImg = new Image();
scoreImg.src = 'img/score.png';

for (let i = 1; i <= imageCount; i++) {
  const image = new Image();
  image.src = `img/${i}.png`;
  foodImg.push(image);
}
let randCount = Math.floor(Math.random() * (foodImg.length - 1));
/////////////////////////////////

//Аудио сборник <-- Блок снизу
const press_button_in_diff = new Audio('audio/knopka.mp3');

const sound_of_horn1 = new Audio('audio/zvyk_gorna1.mp3');

const easy_music = new Audio('audio/easy_music.mp3');
easy_music.setAttribute('loop', 'loop');

const medium_music = new Audio('audio/medium_music.mp3');
medium_music.setAttribute('loop', 'loop');

const hard_music = new Audio('audio/hard_music.mp3');
hard_music.setAttribute('loop', 'loop');

const catch_fruit = new Audio('audio/catch_fruit.mp3');
const catch_bonus = new Audio('audio/catch_bonus.mp3');

const game_over = new Audio('audio/game_over.mp3');

//Обьект где храняться все звуки игры
const sounds_obj = {
  1: press_button_in_diff,
  2: sound_of_horn1,
  3: easy_music,
  4: medium_music,
  5: hard_music,
  6: catch_fruit,
  7: catch_bonus,
  8: game_over,
};
//////////////////////////////

/* Функция, которая будет указывать
направление миски при нажатие на стрелки и WASD */
document.addEventListener('keydown', direction);
function direction(event) {
  const key = event.keyCode;
  if ([37, 65, 97].includes(key))  dir = 'left';
  else if ([39, 68, 100].includes(key)) dir = 'right';
  else if ([40, 83, 115].includes(key)) dir = 'down';
}
//

/* Функция, которая выбирает значения скорости игры
и окрашивает выбраную сложность тенью */
function setSpeed(count) {
  speedCount = minSpeedCount - (count - 1) * maxSpeedCount;
  for (let k = 1; k <= diffCount; k++) {
    document.getElementById(`changer${k}`).style.boxShadow = 'none';
  }
  const changer = document.getElementById(`changer${count}`);
  changer.style.boxShadow = '#b3923a 1.5px 1.5px 1.5px 1.5px';
}
//

//функция которая делает заданый элемент невидимым
function visibility(nameID) {
  document.getElementById(`${nameID}`).style.visibility = 'hidden';
}
//

//
function rotateFruit(dx, dy, time ) {
  ctx.save();
      ctx.translate(dx, dy);
      ctx.rotate(Math.sin(time / 500) / 2);
      ctx.translate(-dx, -dy);
      ctx.drawImage(foodImg[randCount], food.x, food.y, foodWidth, foodHeight);
      ctx.restore();
}

//Функция события нажатия Enter
document.addEventListener('keydown', pressButtonEnter);
function pressButtonEnter(event) {
  if (event.keyCode === 13) {
    start();
  }
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
  ctx.lineTo(0, 0);
  ctx.strokeStyle = '#142743';
  ctx.stroke();
  ctx.fillStyle = '#142743';
  ctx.fill();
  ctx.closePath();
  //рисуем арбуз
  ctx.drawImage(scoreImg, 5, 5, 25, 25);
  //записываем очки рядом
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(score, 40, 25);
}
//

//Функция которая запускаеться при нажатие на кпопку 'Press Enter to Start Game'
function start() {
//Убираем событие старта игры
  document.removeEventListener('keydown', pressButtonEnter);
  //Отключаем кнопку
  visibility('start_game');
  document.getElementById('start_game').setAttribute('disabled', 'disabled');

  //Добавляем рестарт
  document.getElementById('difficult').style.height = '250px';
  document.getElementById('restart').style.visibility = 'visible';

  //Отключаем смену сложности
  document.getElementById('changer1').setAttribute('disabled', 'disabled');
  document.getElementById('changer2').setAttribute('disabled', 'disabled');
  document.getElementById('changer3').setAttribute('disabled', 'disabled');

  //запускаем перед началом игры анимированый таймер
  let count = 0;
  for (let i = 3; i >= 1; i--) {
    setTimeout(() => {
      document.getElementById(`text${i}`).style.animationPlayState = 'running';
      sound_of_horn1.play();
    }, count * 1000);
    count++;
  }

  //Основная функция, которая отрисовует игру!!!!
  function draw() {
    //Включаем игру когда не стоит пауза
    if (pause === false) {
    //Проверяем какую музыку запустить
      if (speedCount === minSpeedCount) {
        easy_music.play();
      } else if (speedCount === mediumSpeedCount) {
        medium_music.play();
      } else {
        hard_music.play();
      }
      //На каждом шаге очищаем игровое поле
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //Прорисовуем фоновую картинку
      ctx.drawImage(background, 0, 0);
      //Рисуем меню игровых очков
      drawScore(score);

      /* При каждой итерации, делаем поворот и смещение канваса так,
       что бы фрукт крутился. */
       
      time = new Date();
      dx = food.x + foodWidth / 2;
      dy = food.y + foodHeight / 2;
      rotateFruit(dx, dy, time);

      //Рисуем миску, что-бы она перекрывала фрукт
      ctx.drawImage(bowl, refr.x, refr.y, bowlWidth, bowlHeight);

      //Проверяем куда двигать миску
      if (dir === 'left' && refr.x >= 0) {
        refr.x = refr.x - 2 - (score / speedCount);
      } else if (dir === 'right' && refr.x <= canvas.width - bowlWidth) {
        refr.x = refr.x + 2 + (score / speedCount);
      } else if (dir === 'down') {
        refr.x += 0;
      }
      //Бросаем еду
      food.y = food.y + 2 + Math.floor((score / speedCount));

      //Условия когда ловим обычный фрукт, бонус, и условие проигрыша
      if (food.y >= refr.y - foodHeight / 2 &&
        food.y <= refr.y - 15 &&
        food.x + foodWidth / 2 <= refr.x + bowlWidth &&
        food.x + foodWidth / 2 >= refr.x) {
        if (randCount === foodImg.length - 1) {
          catch_bonus.play();
          score += 5;
        } else {
          catch_fruit.play();
          score++;
        }
        food = {
          x: Math.floor(Math.random() * (canvas.width - foodWidth)),
          y: -15,
        };
        randCount = Math.floor(Math.random() * foodImg.length);
      }  else if (food.y > refr.y + 17) {
        if (speedCount === minSpeedCount) {
          easy_music.pause();
        } else if (speedCount === mediumSpeedCount) {
          medium_music.pause();
        } else {
          hard_music.pause();
        }
        document.getElementById('endgame')
          .innerHTML += `Game Over, you scored ${score} points!`;
        document.getElementById('endgame')
          .style.visibility = 'visible';
        game_over.play();
        clearInterval(game);
      }
    }
  }
  ///////////////////////////////////////////////////
  setTimeout(() => {
    game = setInterval(draw, 1000 / 60);
  }, 3000);
}

//Добавляем нажатие конпки мышкой или через клавишу Enter
document.getElementById('start_game').onclick = function() {
  start();
};

//Добавляем режим смены сложности и одновременно запускаем проигрыватель музыки
for (let i = 1; i <= 3; i++) {
  document.getElementById(`changer${i}`).onclick = () => {
    setSpeed(i);
    if (!press_button_in_diff.paused) {
      press_button_in_diff.pause();
    }
    press_button_in_diff.play();
  };
}

//Включаем и выключаем звук в игре
let flag = 0;
document.getElementById('change_sound').onclick = function() {
  if (flag === 1) {
    document.getElementById('sound').src = 'img/sound_on.png';
    for (const key in sounds_obj) {
      sounds_obj[`${key}`].volume = 1;
    }
    flag = 0;
  } else  {
    document.getElementById('sound').src = 'img/sound_off.png';
    for (const key in sounds_obj) {
      sounds_obj[`${key}`].volume = 0;
    }
    flag = 1;
  }
};

//Добавляем смену паузы на игру и наоборот
document.getElementById('pause').onclick = function() {
  if (pause === false) {
    pause = true;
    document.getElementById('paused').style.visibility = 'visible';
    document.getElementById('play').src = 'img/play.png';
    for (const key in sounds_obj) {
      sounds_obj[`${key}`].volume = 0;
    }
  } else {
    pause = false;
    document.getElementById('paused').style.visibility = 'hidden';
    document.getElementById('play').src = 'img/pause.png';
    for (const key in sounds_obj) {
      sounds_obj[`${key}`].volume = 1;
    }
  }
};

//Добавляем кнопку которая прекращает паузу
document.getElementById('paused').onclick = function() {
  pause = false;
  document.getElementById('paused').style.visibility = 'hidden';
  for (const key in sounds_obj) {
    sounds_obj[`${key}`].volume = 1;
  }
  document.getElementById('play').src = 'img/pause.png';
};

//Рестарт
document.getElementById('restart').onclick = function() {
  location.reload();
};

//Выпадающий блок при нажатие на кнопку правила игры
const coll = document.getElementById('rules_button');
coll.addEventListener('click', () => {
  const content = document.getElementById('rules');
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = content.scrollHeight + 'px';
  }
});
