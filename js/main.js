/* Map of GeoJSON data from MegaCities.geojson */

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('mapid', {
        center: [20, 0],
        zoom: 2
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        minZoom:2
    }).addTo(map);

    //call getData function
    getData(map);
};


<<<<<<< HEAD
// function onEachFeature(feature, layer) {
//     //no property named popupContent; instead, create html string with all properties
//     var popupContent = "";
//     if (feature.properties) {
//         //loop to add feature property names and values to html string
//         for (var property in feature.properties){
//             popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
//         }
//         layer.bindPopup(popupContent);
//     };
// };

// //function to retrieve the data and place it on the map
// function getData(map){
//     //load the data
//   $.ajax("data/CO2centroids.geojson", {
//           dataType: "json",
//           success: function(response){
//               //create marker options
//               var geojsonMarkerOptions = {
//                   radius: 8,
//                   fillColor: "#ff7800",
//                   color: "#000",
//                   weight: 1,
//                   opacity: 1,
//                   fillOpacity: 0.8
//               };
//
//               // //create a Leaflet GeoJSON layer and add it to the map
//               // L.geoJson(response, {
//               //     pointToLayer: function (feature, latlng){
//               //         return L.circleMarker(latlng, geojsonMarkerOptions);
//               //     }
//               // }).addTo(map);
//
//               var markers = L.geoJson()
//
//               for (var i = 0; i < response.features.length; i++) {
//                   var a = response.features[i];
//                   //add properties html string to each marker
//                   var properties = "";
//                   for (var property in a.properties){
//                       properties += "<p>" + property + ": " + a.properties[property] + "</p>";
//                       console.log(property,a.properties[property]);
//                   };
//                   var marker = L.circleMarker(new L.LatLng(a.geometry.coordinates[1], a.geometry.coordinates[0]), geojsonMarkerOptions, { properties: properties });
//                   //add a popup for each marker
//                   marker.bindPopup(properties);
//                   //add marker to MarkerClusterGroup
//                   markers.addLayer(marker);
//               }
//
//               //add geoJSON layer to map
//               map.addLayer(markers);
//           }
//       });
//
// };


function pointToLayer(feature, latlng){
    //create marker options
    var options = {
        radius: 8,
=======
function getData(map){
    //load the data
    $.ajax("data/CO2centroids.geojson", {
        dataType: "json",
        success: function(response){
            //call function to create proportional symbols
            createPropSymbols(response, map);
        }
    });
};
//function to convert markers to circle markers
function pointToLayer(feature, latlng){
    //Determine which attribute to visualize with proportional symbols
    var attribute = "CO2_2007";

    //create marker options
    var options = {
>>>>>>> origin/master
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
<<<<<<< HEAD
    var attribute = "CO2_2007";
    //For each feature, determine its value for the selected attribute
     var attValue = Number(feature.properties[attribute]);

     //Give each feature's circle marker a radius based on its attribute value
     options.radius = calcPropRadius(attValue);

     //create circle marker layer
     var layer = L.circleMarker(latlng, options);

     //original popupContent changed to panelContent...Example 2.2 line 1
        var panelContent = "<p><b>Country:</b> " + feature.properties.Country + "</p>";

        //add formatted attribute to panel content string
        var year = attribute.split("_")[1];
        panelContent += "<p><b>CO2 emissions in " + year + " (kt):</b> " + feature.properties[attribute] + "</p>";

        //popup content is now just the city name
        var popupContent = feature.properties.Country;

        //bind the popup to the circle marker
        layer.bindPopup(popupContent, {
            offset: new L.Point(0,-options.radius),
            closeButton: false
        });

        //event listeners to open popup on hover and fill panel on click
        layer.on({
            mouseover: function(){
                this.openPopup();
            },
            mouseout: function(){
                this.closePopup();
            },
            click: function(){
                $("#panel").html(panelContent);
            }
        });


    //  //build popup content string
    //  var popupContent = "<p><b>Country:</b> " + feature.properties.Country + "</p><p><b>" + "CO2 Emissions (kt):</b> " + feature.properties[attribute] + "</p>";
     //
    //  //bind the popup to the circle marker
    //  layer.bindPopup(popupContent);
     //
    //  ///event listeners to open popup on hover and fill panel on click...Example 2.5 line 4
    //  layer.on({
    //      mouseover: function(){
    //          this.openPopup();
    //      },
    //      mouseout: function(){
    //          this.closePopup();
    //      },
    //      click: function(){
    //          $("#panel").html(popupContent);
    //      }
    //  });

     //return the circle marker to the L.geoJson pointToLayer option
     return layer;
 };

 //Add circle markers for point features to the map
 function createPropSymbols(data, map){
     //create a Leaflet GeoJSON layer and add it to the map
     L.geoJson(data, {
         pointToLayer: pointToLayer
     }).addTo(map);
 };

//Step 2: Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/CO2centroids.geojson", {
        dataType: "json",
        success: function(response){
            //call function to create proportional symbols
            createPropSymbols(response, map);
            createSequenceControls(map);
        }
    });
=======

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string starting with country
  var popupContent = "<p><b>Country:</b> " + feature.properties.Country + "</p>";

  //add formatted attribute to popup content string
  var year = attribute.split("_")[1];
  var emissions = (feature.properties[attribute])
  popupContent += "<p><b>CO2 Emissions in " + year + " (kt):</b> " + emissions.toFixed(2) + " </p>";

    //bind the popup to the circle marker
    layer.bindPopup(popupContent);

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
>>>>>>> origin/master
};

function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
<<<<<<< HEAD
    var scaleFactor = .001;
=======
    var scaleFactor = .0001;
>>>>>>> origin/master
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};
<<<<<<< HEAD

// function createSequenceControls(map){
//     //create range input element (slider)
//     $('#panel').append('<input class="range-slider" type="range">');
//
//     $('.range-slider').attr({
//         max: 6,
//         min: 0,
//         value: 0,
//         step: 1
//     });
//     // $('#panel').append('<button class="skip" id="reverse">Reverse</button>');
//     // $('#panel').append('<button class="skip" id="forward">Skip</button>');
//     // $('#reverse').html('<img src="img/reverse.png">');
//     // $('#forward').html('<img src="img/forward.png">');
// };
=======
//Add circle markers for point features to the map
function createPropSymbols(data, map){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: pointToLayer
    }).addTo(map);
};



>>>>>>> origin/master





$(document).ready(createMap);
