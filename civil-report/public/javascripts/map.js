var apiKey = 'AIzaSyCA7uRtmPo9Dij18BiD-KUCejMR4HBQJPk';
var map;
var drawingManager;
var lat, long;

var setLat = (latitude) => {
    lat = latitude;
};

var setLong = (longitude) => {
    long = longitude;
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 43.761539, lng: -79.411079 },
        zoom: 15
    });
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false
    });
    /*drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYLINE,
        drawingControl: false,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYLINE
            ]
        },
        polylineOptions: {
            strokeColor: '#000000'
        }
    });*/
    drawingManager.setMap(map);
    // Snap-to-road when the polyline is completed.
    drawingManager.addListener('polylinecomplete', function(poly) {
        var path = poly.getPath();
        polylines.push(poly);
        placeIdArray = [];
        runSnapToRoad(path);
    });

    // Clear button. Click to remove all polylines.
    $('#clear').click(function(ev) {
        for (var i = 0; i < polylines.length; ++i) {
            polylines[i].setMap(null);
        }
        polylines = [];
        ev.preventDefault();
        return false;
    });

    google.maps.event.addListener(map, "rightclick", function(event) {
         var lat = event.latLng.lat();
         var lng = event.latLng.lng();
         // populate yor box/field with lat, lng
        //  alert("Lat=" + lat + "; Lng=" + lng);
        setLat(lat);
        setLong(lng);
        console.log("Latitude: "+ getLat());
        console.log("Longitude: "+ getLong());
        addMarker(event.latLng, map);
        getCloseRoad(event.latLng);
        //showMapMenu(event.latLng);
    });
    /*google.maps.event.addListener(map, "mouseout", function(event) {
        removeMapMenu();
    });*/
}

var getLat = () => {
    console.log("dis" + lat);
    return lat;
};

var getLong = () => {
    console.log("dis2" + long);
    return long;
};

/*
   Adds the marker to the map
   (needs work such as taking all the stored points in the database and placing them on the map)
   */

function addMarker(location, map) {
    var  unverifiedMark = {
        path: 'M 2,2 2,2 2,2 2,2 2,2 z',
        fillColor: 'green',
        fillOpacity: 0.8,
        scale: 1.5,
        strokeColor: 'green',
        strokeWeight: 14,
    };
       
    var  verifiedMark = {
        path: 'M 2,2 2,2 2,2 2,2 2,2 z',
        fillColor: 'red',
        fillOpacity: 0.8,
        scale: 1.5,
        strokeColor: 'red',
        strokeWeight: 14,
    };
       
    var  falseMark = {
        path: 'M 2,2 2,2 2,2 2,2 2,2 z',
        fillColor: 'gray',
        fillOpacity: 0.8,
        scale: 1.5,
        strokeColor: 'gray',
        strokeWeight: 14,
    };
       
    var  dispatchedMark = {
        path: 'M 2,2 2,2 2,2 2,2 2,2 z',
        fillColor: 'blue',
        fillOpacity: 0.8,
        scale: 1.5,
        strokeColor: 'blue',
        strokeWeight: 14,
    };

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        draggable: true,
        icon: unverifiedMark,
    });
}

function getCloseRoad(caurrentLatLng) {
    pathCoord = [caurrentLatLng, caurrentLatLng];
    var pathRoad = new google.maps.Polyline({
        path: pathCoord,
        strokeOpacity: 0,
        strokeWeight: 1
    });
    pathRoad.setMap(map);
    runSnapToRoad(pathRoad.getPath());

    //https://roads.googleapis.com/v1/nearestRoads?parameters&key=AIzaSyCA7uRtmPo9Dij18BiD-KUCejMR4HBQJPk
}

function getCanvasXY(caurrentLatLng) {
    var scale = Math.pow(2, map.getZoom());
    var nw = new google.maps.LatLng(
        map.getBounds().getNorthEast().lat(),
        map.getBounds().getSouthWest().lng()
    );
    var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
    var worldCoordinate = map.getProjection().fromLatLngToPoint(caurrentLatLng);
    var caurrentLatLngOffset = new google.maps.Point(
        Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
        Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
    );
    return caurrentLatLngOffset;
}

function setMenuXY(caurrentLatLng) {
    var mapWidth = $('#map_canvas').width();
    var mapHeight = $('#map_canvas').height();
    var menuWidth = $('.contextmenu').width();
    var menuHeight = $('.contextmenu').height();
    var clickedPosition = getCanvasXY(caurrentLatLng);
    var x = clickedPosition.x;
    var y = clickedPosition.y;

    if ((mapWidth - x) < menuWidth)
        x = x - menuWidth;
    if ((mapHeight - y) < menuHeight)
        y = y - menuHeight;

    $('.contextmenu').css('left', x);
    $('.contextmenu').css('top', y);
};

function showMapMenu(caurrentLatLng, dist) {
    var projection;
    var contextmenuDir;
    if( dist <= 25 ){
        projection = map.getProjection();
        $('.contextmenu').remove();
        contextmenuDir = document.createElement("div");
        $(contextmenuDir).attr("tabindex", -1);
        contextmenuDir.className = 'contextmenu';
        contextmenuDir.innerHTML = "<a id='reportProblem' data-toggle='modal' data-target='#problemModal'><div class=context>Report a Problem<\/div><\/a><a id='menu2'><div class=context>menu item 2<\/div><\/a>";
        $(map.getDiv()).append(contextmenuDir);

        setMenuXY(caurrentLatLng);

        contextmenuDir.style.visibility = "visible";
        $(contextmenuDir).focus();

        //console.log(document.activeElement);

        $(contextmenuDir).focusout(function() {
            $('.contextmenu').remove();
        });
    }

}

/*function removeMapMenu(){
    $('.contextmenu').remove();
}
  //
  drawingManager.setMap(map);


}
*/
// Snap a user-created polyline to roads and draw the snapped path
function runSnapToRoad(path) {
    var pathValues = [];
    var currPts = path.getAt(0);
    for (var i = 0; i < path.getLength(); i++) {
        pathValues.push(path.getAt(i).toUrlValue());
    }
    console.log(pathValues);

    $.get('https://roads.googleapis.com/v1/snapToRoads', {
        interpolate: true,
        key: apiKey,
        path: pathValues.join('|')
    }, function(data) {
        processSnapToRoadResponse(data, currPts);

        //drawSnappedPolyline();
    });
}

// Store snapped polyline returned by the snap-to-road service.
function processSnapToRoadResponse(data, currPts) {
    snappedCoordinates = [];
    placeIdArray = [];
    var dist = 0;
    for (var i = 0; i < data.snappedPoints.length; i++) {
        var latlng = new google.maps.LatLng(
            data.snappedPoints[i].location.latitude,
            data.snappedPoints[i].location.longitude);
        snappedCoordinates.push(latlng);
        placeIdArray.push(data.snappedPoints[i].placeId);
    }
    dist = google.maps.geometry.spherical.computeDistanceBetween(latlng, currPts);
    console.log(google.maps.geometry.spherical.computeDistanceBetween(latlng, currPts));
    showMapMenu(currPts, dist);
}

// Draws the snapped polyline (after processing snap-to-road response).
/*function drawSnappedPolyline() {
    var snappedPolyline = new google.maps.Polyline({
        path: snappedCoordinates,
        strokeColor: 'black',
        strokeWeight: 3,
        opacity: 1
    });

    snappedPolyline.setMap(map);
    //polylines.push(snappedPolyline);
}
*/

module.exports = {
  getLat,
  getLong
};