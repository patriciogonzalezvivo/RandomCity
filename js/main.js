// Author: @patriciogv 2015

// ============================================= VARIABLES
//
var latlon, place;
var placeCounter = 0;
var createObjectURL = (window.URL && window.URL.createObjectURL) || (window.webkitURL && window.webkitURL.createObjectURL);

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
        window.setInterval("update(getCurrentTime())", 1000);
    });
    layer.addTo(map);

    place="";
    updateLocation("");
}

// ============================================= UPDATE

function update(time) {   // time in seconds since Jan. 01, 1970 UTC

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
