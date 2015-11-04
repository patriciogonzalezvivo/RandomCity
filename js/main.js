// Author: @patriciogv 2015

// ============================================= VARIABLES
//
var latlon, place;
var placeCounter = 0;
var createObjectURL = (window.URL && window.URL.createObjectURL) || (window.webkitURL && window.webkitURL.createObjectURL);
var offset_target = [0, 0, 16];
var offset = [0,0];
var bMousePressed = false;
var waitFor = 180;
var timer = 0;
var timer2 = 0;
var bRandomCity = true;
var jumpEvery = 1000;

var cities = [ [40.70531887544228, -74.00976419448853], // New York
               [-34.60853891153415,-58.37203572841672], // Buenos Aires
               [35.69, 139.692],                        // Tokyo
               [48.85345578180323, 2.3494093081153227], // Paris
               [52.52102983799353, 13.410161005151533], // Berlin
               [41.89031260191685, 12.489897096332864], // Rome
               [31.239100568083142, 121.49866546209958],// Shanghai
               [41.88974809227126, -87.621372374896],   // Chicago
               [40.74862572012136, -73.98550831271747]  // Empire State
               ];

// ============================================= INIT 
map = (function () {
    'use strict';

    // Leaflet Map
    var map = L.map('map',{
                            scrollWheelZoom: 'center', 
                            zoomControl: false 
                        });
    // Tangram Layer
    var layer = Tangram.leafletLayer({
        scene: 'scene.yaml',
        attribution: '<a href="https://twitter.com/patriciogv" target="_blank">@patriciogv</a> | <a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
    });

    window.layer = layer;
    var scene = layer.scene;
    window.scene = scene;

    map.setView([40.70531887544228, -74.00976419448853], 16);

    var hash = new L.Hash(map);

    /***** Render loop *****/
    window.addEventListener('load', function () {
        init();
    });

    return map;
}());

function init() {

    // Scene initialized
    layer.on('init', function() {    
        window.setInterval("update(getCurrentTime())", 100);
    });
    layer.addTo(map);

    place="";
    updateLocation("");

    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", onMotionUpdate, false);
    }

    document.addEventListener('mousemove', onMouseUpdate, false);
    document.body.ondrag
    map.on('mousedown', function () {
        bMousePressed = true;
        offset_target[0] = .5;
        offset_target[1] = 0;
    });

    map.on('mouseup', function () {
        bMousePressed = false;
    });

    // map.on('zoomstart', function () {
        // timer = waitFor;
    // });

    // map.on('zoomend', function () {
        // timer = waitFor;
    // });

    // map.on('viewreset', function() {
    //     console.log(map.getCenter());
    // });
}

// ============================================= UPDATE

function update(time) {   // time in seconds since Jan. 01, 1970 UTC
    var speed = .025;
    // console.log("Timer",timer);
    // console.log("Timer2",timer2);

    if (bMousePressed) {
        speed = .1;
    }

    if (timer === 0) {
        var d = new Date();
        var t = d.getTime()/1000;
        offset_target[0] = .5+Math.abs(Math.sin(t*0.025));
        offset_target[1] = Math.abs(Math.cos(t*0.025));
        offset_target[2] = 18+Math.sin(Math.PI*.25+t*0.02)*2.5;
        timer2++;  
    } else if (!bMousePressed) {
        offset_target[2] = map.getZoom();
        timer--;
    }

    if (bRandomCity && timer2%jumpEvery === 0) {
        map.setView(cities[Math.floor(Math.random()*cities.length)]);
    } 

    var target = [(1-offset_target[1])*Math.PI/2., offset_target[0]*Math.PI];

    if (target[0] !== offset[0] || target[1] !== offset[1]) {
        offset[0] += (target[0] - offset[0])*speed;
        offset[1] += (target[1] - offset[1])*speed;
        scene.styles.lin.shaders.uniforms.u_offset = offset;
        scene.styles.roads.shaders.uniforms.u_offset = offset;
        scene.styles.simpleGrid.shaders.uniforms.u_offset = offset;
        scene.styles.numericGrid.shaders.uniforms.u_offset = offset;
        scene.styles.buildings.shaders.uniforms.u_offset = offset;
    }

    map.setZoom( map.getZoom()+(offset_target[2]-map.getZoom())*speed*0.5 );
}

function updateLocation(text) {
    if (placeCounter > text.length || place === "") {
        placeCounter = 0;
        text = "";
        latlon = map.getCenter();
        updateGeocode(latlon.lat, latlon.lng);
        setTimeout(function(){
            updateLocation("");
        }, 3000);
    } else {
        setTimeout( function(){
            document.getElementById('loc').innerHTML = text + "<span>|</span>"; 
            updateLocation(text+place.charAt(placeCounter++));
        }, 100);
    }
}

function updateGeocode (lat, lng) {

    // This is my API Key for this project. 
    // They are free! get one at https://mapzen.com/developers/sign_in
    var PELIAS_KEY = 'search--cv2Foc';

    var endpoint = '//search.mapzen.com/v1/reverse?point.lat=' + lat + '&point.lon=' + lng + '&size=1&layers=coarse&api_key=' + PELIAS_KEY;

    getHttp(endpoint, function(err, res){
        if (err) {
            console.error(err);
        }

        // TODO: Much more clever viewport/zoom based determination of current location
        var response = JSON.parse(res);
        if (!response.features || response.features.length === 0) {
            // Sometimes reverse geocoding returns no results
            place = 'Unknown location';
        }
        else {
            place = response.features[0].properties.label;
        }
    });
}

// ============================================= SET/GET

function getCurrentTime() {   // time in seconds since Jan. 01, 1970 UTC
  return Math.round(new Date().getTime()/1000);
}

function getHttp (url, callback) {
    var request = new XMLHttpRequest();
    var method = 'GET';

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var response = request.responseText;

            // TODO: Actual error handling
            var error = null;
            callback(error, response);
        }
    };
    request.open(method, url, true);
    request.send();
}

// ============================================= EVENT
function onMouseUpdate (e) {
    if (!bMousePressed) {
        offset_target[0] = e.pageX/screen.width;
        offset_target[1] = e.pageY/screen.height;
    }
    timer = waitFor;
}

function onMotionUpdate (e) {
    var accX = Math.round(event.accelerationIncludingGravity.x*10)/10;  
    var accY = Math.round(event.accelerationIncludingGravity.y*10)/10;  
    var motion = [ -accX,-accY ];

    if (scene.styles && motion[0] && motion[1] ) {
        offset_target[1] = motion[0]/10 + motion[1]/10;
    }
}

// MPZN.bug({
//     name: 'RandomCity',
//     tweet: 'RandomCity by @patriciogv and powered by @mapzen!',
//     repo: 'https://github.com/patriciogonzalezvivo/RandomCity/'
// });
