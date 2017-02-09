//instantiates map object in an element with a certain id at a specified view
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

//instantiate tile layer object from a URL template
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'rossthorn.158803c3',
    accessToken: 'pk.eyJ1Ijoicm9zc3Rob3JuIiwiYSI6ImNpdW9mNWRobjAxNjUydHBoOTV2aGFhYW4ifQ._gXtryi8ORM28NdR7aXcCg'
}).addTo(mymap);

//instantiates marker object at latlng and then added to the map object
var marker = L.marker([51.5, -0.09]).addTo(mymap);

//instantiates circle object at geographic point with options containing a radius
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

//instantiates polygon object, extending polyline, based on set of geographic points
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);

//instantiates popup object to given objects with text.
marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

//instantiates popup at its own latlng and not attached to an object
// var popup = L.popup()
//     .setLatLng([51.5, -0.09])
//     .setContent("I am a standalone popup.")
//     .openOn(mymap);

//instantiates popup that is populated in the following function
var popup = L.popup();

function onMapClick(e) {
    popup
        //set the properties of the popup based on latlng of click
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

//onMapClick function is called whenever the user clicks on the map.
mymap.on('click', onMapClick);

//geoJson properties are assigned to a variable in proper format
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"

    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

//creates geoJson layer with the predefined properties and added to map
L.geoJSON(geojsonFeature).addTo(mymap);

//polyline properties assigned to variable in proper format
var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

//style attributes are assigned to a variable in proper format
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

//creates geoJson layer taking in data from myLines and myStyle variables
L.geoJSON(myLines, {
    style: myStyle
}).addTo(mymap);

//variable assigned to polygon bounds in geoJson format
var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

//geoJson created with states properties and changes color based on certain attribute
L.geoJSON(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(mymap);

//variable assigned to style properties
// var geojsonMarkerOptions = {
//     radius: 8,
//     fillColor: "#ff7800",
//     color: "#000",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.8
// };
//
//changes existing point feature to a circle marker
// L.geoJSON(geojsonFeature, {
//     pointToLayer: function (feature, [-104.99404, 39.75621]) {
//         return L.circleMarker([-104.99404, 39.75621], geojsonMarkerOptions);
//     }
// }).addTo(mymap);

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

//calls previous function for specified geojsonfeature
L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(mymap);

//variable assigned to feature properties
var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];

//filter used to show certain features based on their "show_on_map" property
L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(mymap);
