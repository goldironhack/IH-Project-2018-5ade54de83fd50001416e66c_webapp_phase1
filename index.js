const GOOGLE_KEY = "AIzaSyDw-mlKd5KwCG8cflcvVpDhooXk8rRK-_c";
const INFO_URL = " https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=";
const INFO_EX = "*&outSR=4326&f=geojson";
var map;
var nyu = {lat:40.7291, lng:-73.9965}
var lt = 40.7291;
var ln = -73.9965;
var directionsRenderer;
var data ;
var dataRow;
var polygon;
var m;
var datos = [];
datos.push(32,625,5,-1,1,-1,0,//1
          655,1316,5,-1,1,-1,1,
          1346,2391,5,-1,1,-1,1,
          2423,2716,1,-1,1,-1,1,
          2746,4313,5,-1,1,-1,0,
          4343,4982,5,-1,1,-1,0,
          4922,5293,5,-1,1,-1,0,
          5323,5686,5,-1,1,-1,0,
          5716,5897,5,-1,1,-1,0,
          5927,7108,5,-1,1,-1,0,//10
          7138,7557,5,-1,1,-1,0,
          7588,20109,6,-1,1,-1,0,
          20139,22482,5,-1,1,-1,0,
          22512,23003,5,-1,1,-1,0,
          23034,33073,6,-1,1,-1,0,
          33103,33758,5,-1,1,-1,0,
          33788,34215,5,-1,1,-1,0,
          34245,35054,5,-1,1,-1,0,
          35085,36190,6,-1,1,-1,0,
          36220,37997,5,-1,1,-1,0,//20
          38028,49369,6,-1,1,-1,0,
          49399,49938,5,-1,1,-1,0,
          49968,50275,5,-1,1,-1,0,
          50305,50856,5,-1,1,-1,0,
          50886,51275,5,-1,1,-1,0,
          51305,51728,5,-1,1,-1,0,
          51759,67362,6,-1,1,-1,0,
          67392,68379,5,-1,1,-1,0,
          68410,71621,6,-1,1,-1,0,
          71651,72048,5,-1,1,-1,0,//30
          72078,72467,5,-1,1,-1,0,
          72497,73056,5,-1,1,-1,0,
          73086,75079,5,-1,1,-1,0,
          75110,80235,6,-1,1,-1,0,
          80265,81258,5,-1,1,-1,0,
          81288,83329,5,-1,1,-1,0,
          83359,83856,5,-1,1,-1,0,
          83886,84813,5,-1,1,-1,0,
          84443,88996,5,-1,1,-1,0,
          89026,89767,5,-1,1,-1,0,//40
          89797,90342,5,-1,1,-1,0,
          90372,90648,5,-1,1,-1,0,
          90677,91700,5,-1,1,-1,0,
          91730,92129,5,-1,1,-1,0,
          92159,93015,5,-1,1,-1,0,
          93044,95995,5,-1,1,-1,0,
          96025,96302,5,-1,1,-1,0,
          96333,97464,6,-1,1,-1,0,
          97494,100023,5,-1,1,-1,0,
          100053,100426,5,-1,1,-1,0,//50
          100457,102070,6,-1,1,-1,0,
          102100,102861,5,-1,1,-1,0,
          102892,114983,6,-1,1,-1,0,
          115014,117607,6,-1,1,-1,0,
          117637,117986,5,-1,1,-1,0
);
//inicializacion del Mapa y ubicacion de la NYU
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: nyu
  });
  var marker = new google.maps.Marker({
  position: nyu,
  map: map,
  title: 'NYU'
  });
}
//obtiene el dataset y  hace el tratamiento de los datos
function getdatafromURL(URL){
  data = $.get(URL , function(){
  dataRow = data.responseText;
  dataRow = dataRow.split(/[,()coordinates]+/);
  dataRow = dataRow.slice(3,dataRow.length-1);
  console.log(dataRow);
//genera los diferentes poligonos
for (var i = 1; i <= 55; i++) {
  setearDatos(i);
}
})
  .done(function(){
  })
  .fail(function(error){
    console.log(error);
  })
}
//fuciona dos partes del link del dataset
function updateAllData(){
  var URL = INFO_URL + INFO_EX;
  getdatafromURL(URL);
}
//setea los datos que le llegan del dataset y dibuja el poligono
function setearDatos(n){
  n = (n-1)*7;
  var i = datos[n];
  polygon = [];
  for (var j = i ; j < datos[n+1]; j= j+2) {
    var row = latlong(dataRow[i],dataRow[i+1] , i , n);
    if (isNaN(row[0])){
      row[0] = parseFloat(dataRow[i-2].slice(datos[n+4]));
    }
    if (isNaN(row[1])){
      row[1] = parseFloat(dataRow[i-1].slice(0,datos[n+5]));
    }
    polygon.push({lat:row[1],lng:row[0]});
    i = i+2;
  }
  drawPolygon(polygon ,getRandomColor());
}
//dibuja poligonos
function drawPolygon(polygon, color){
  var barrios = new google.maps.Polygon({
   paths: polygon,
   strokeColor: color,
   strokeOpacity: 0.8,
   strokeWeight: 2,
   fillColor: color,
   fillOpacity: 0.35
 });
 barrios.setMap(map);
}
//genera un json con lat long
function latlong(lan , long , i ,n){
  var jsonPoligon = [];
  if (i == datos[n]){
    var La = lan.slice(datos[n+2]);
    var Lo = long.slice(0,datos[n+3]);
    //console.log(La);
    //console.log(Lo);
    jsonPoligon.push(parseFloat(La),parseFloat(Lo));
    return jsonPoligon;
  }else{
    La = lan.slice(datos[n+4]);
    Lo = long.slice(0,datos[n+5]);
    //console.log(La);
    //console.log(Lo);
    jsonPoligon.push(parseFloat(La),parseFloat(Lo));
    return jsonPoligon;
  }
}
//accionado por el checkbox2 para accionar el updateAllData
function myFunction1() {
  checkBox = document.getElementById("micheckbox2");
  if (checkBox.checked === true){
    updateAllData();
  }
}
//genera un color aleatorea 
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
