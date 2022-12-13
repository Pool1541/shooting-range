// Variables globales

const pantalla = document.querySelector('canvas');
const pincel = pantalla.getContext('2d');
const containerPuntos = document.getElementById('puntos');
const btnComenzar = document.getElementById('comenzar');
const time = document.getElementById('time');
const timeDiv = document.getElementById('time-div');
const spawnDelay = document.getElementById('spawn-delay');
const spawnDelayDiv = document.getElementById('spawnDelay-div');
const recordModal = document.getElementById('record-modal');
const btnClose = document.getElementById('btn-close');
const recordTable = document.querySelector('#record-table tbody');

let duration = parseInt(time.value) * 1000;
let delay = parseInt(spawnDelay.value) * 100;
let x = 20;
let xf = 580;
let score = 0;
let shots = 0;
let hits = 0;
let misses = 0;
let coordX = 0;
let coordY = 0;
let shoot = false;
let scoreHistory = [];

// Almacenamiento local

function getLocalData() {
  const localData = localStorage.getItem('SCORES');
  if(localData) {
    scoreHistory = JSON.parse(localData);
  }
}

getLocalData();

// Historial de estadísticas.

function setModalPosition() {
  recordModal.style.left = pantalla.offsetLeft + 'px';
  recordModal.style.top = pantalla.offsetTop + 'px';
}

window.addEventListener('load', setModalPosition); // Establecemos la posición del modal por primera vez cuando se haya cargado la página.
window.addEventListener('resize', setModalPosition); // cambia la posición del modal cada vez que la ventana cambie de tamaño.

function closeRecord() {
  recordModal.style.display = 'none';
  score = 0;
  shots = 0;
  hits = 0;
  misses = 0;
}

function openRecord() {
  const scoreR = document.getElementById('score');
  const hitsR = document.getElementById('hits');
  const shotsR = document.getElementById('shots');
  const missesR = document.getElementById('misses');

  createRecord();

  scoreR.innerText = score;
  hitsR.innerText = hits;
  shotsR.innerText = shots;
  missesR.innerText = misses;

  recordTable.innerHTML = '';
  scoreHistory.sort((a,b) => a.score - b.score).reverse();
  localStorage.setItem('SCORES', JSON.stringify(scoreHistory));
  scoreHistory.forEach((r) => setScore(r));
  recordModal.style.display = 'block';
}

btnClose.onclick = closeRecord;

function setScore(record) {
  const row = document.createElement('tr');
  row.innerHTML = `<th>${record.score}</th>
  <th>${record.hits}</th>
  <th>${record.misses}</th>
  `;

  recordTable.appendChild(row);
}

function createRecord() {
  const temp = {};
  temp.score = score;
  temp.shots = shots;
  temp.hits = hits;
  temp.misses = misses;

  scoreHistory.push(temp);
}

// Configuración inicial 

time.value = 30;
timeDiv.innerText = time.value;

spawnDelay.value = 7;
spawnDelayDiv.innerText = spawnDelay.value / 10;


// Funciones de configuración

function handleTime(e) {
  timeDiv.innerText = time.value;
  duration = parseInt(time.value) * 1000;
}

function handleSpawnDelay(e) {
  spawnDelayDiv.innerText = spawnDelay.value / 10;
  delay = parseInt(spawnDelay.value) * 100;
}

time.oninput = handleTime;
spawnDelay.oninput = handleSpawnDelay;

// Funciones principales

pincel.fillStyle = 'lightgrey';
pincel.fillRect(0,0,600,400);

function disenharCircunferencia(x,y,radio, color) {
  pincel.fillStyle = color;
  pincel.beginPath();
  pincel.arc(x,y,radio,0,2*Math.PI);
  pincel.fill();
}

function center() {
  const x = pantalla.width / 2;
  const y = pantalla.height / 2;
  limpiarPantalla();
  disenharCircunferencia(x,y,30,'red');
  disenharCircunferencia(x,y,20,'white');
  disenharCircunferencia(x,y,10,'red');
}

function firstClick(e) {
  const screenX = pantalla.width / 2;
  const screenY = pantalla.height / 2;
  const mouseX = e.clientX - pantalla.offsetLeft;
  const mouseY = e.clientY - pantalla.offsetTop;
  if((mouseX < screenX + 10) &&
      (mouseX > screenX - 10) &&
      (mouseY < screenY + 10) &&
      (mouseY > screenY - 10)) {
      limpiarPantalla();
      pantalla.onclick = '';
      start();
    }
}

function limpiarPantalla() {
  pincel.clearRect(0,0,600,400);
  pincel.fillStyle = 'lightgrey';
  pincel.fillRect(0,0,600,400);
}

function crearLiana() {
  shoot = false;
  limpiarPantalla();
  let x = Math.round(Math.random()*540) + 30;
  let y = Math.round(Math.random()*340) + 30;
  coordX = x;
  coordY = y;
  disenharCircunferencia(x,y,30,'red');
  disenharCircunferencia(x,y,20,'white');
  disenharCircunferencia(x,y,10,'red');
}

function getCoordinates(e) {
  const mouseX = e.clientX - pantalla.offsetLeft;
  const mouseY = e.clientY - pantalla.offsetTop;
  console.log(mouseX, coordX);
  if(shoot == false){
    if((mouseX < coordX + 10) &&
      (mouseX > coordX - 10) &&
      (mouseY < coordY + 10) &&
      (mouseY > coordY - 10)) {
      shoot = true;
      limpiarPantalla();
      createElement();
      score = score + 100;
      hits++;
      containerPuntos.innerText = score;
    } else {
      score = score - 50;
      containerPuntos.innerText = score;
      misses++;
    }
    shots++
  }
}

function createElement(){
  const h3 = document.createElement('h3');
  h3.textContent = '+100';
  document.querySelector('body').appendChild(h3);
  const texto = document.querySelector('h3');
  texto.style.left = (coordX + pantalla.offsetLeft + 35) + "px";
  texto.style.top = (coordY + pantalla.offsetTop - 20) + "px";
  h3.addEventListener('animationend', ()=> {
    h3.remove();
  });
}

function start() {
  hits = 0;
  containerPuntos.innerText = score;
  const interval = setInterval(crearLiana, delay);
  pantalla.onclick = getCoordinates;

  const timeOut = setTimeout(() => {
    clearInterval(interval);
    pantalla.onclick = firstClick;
    center();
    openRecord();
  }, duration + 1000);
}

pantalla.onclick = getCoordinates;

pantalla.onclick = firstClick;
center();