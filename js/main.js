/* Map of GeoJSON data from MegaCities.geojson */

//Global variables for use outside of functions
var year;

var countryName;
 //empty array to hold attributes
var attributes = [];

var polyLayer;

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('mapid', {
        center: [20, 0],
        zoom: 2
    });

    //add OSM base tilelayer
    L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        minZoom:2
    }).addTo(map);

    // Create necessary panes in correct order
    map.createPane("pointsPane");
    map.createPane("polygonsPane");


    //call getData function
        getCountryShapeData(map);
        getData(map);


};


function getCountryShapeData(map){
    //load the data
    $.ajax("data/Countries.geojson", {
        dataType: "json",
        success: function(response){
          var polyAttributes = processPolyData(response);
            createPolygons(response, map, attributes);
        }
    });
};

function processPolyData(data){
  //properties of the first feature in the dataset
  var properties = data.features[0].properties;
  //console.log(properties);
  //push each attribute name into attributes array
  for (var attribute in properties){
      //only take attributes with Rank values
      if (attribute.indexOf("Rank") > -1){
          attributes.push(attribute);
          //console.log(properties[attribute]);
      };
  };


  return attributes;
};

function createPolygons(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    var polyLayer = L.geoJson(data, {
      style: function(feature){
        //console.log(feature);
        var options = {
            fillColor: getColor(feature.properties.Rank),
            color: "#a5a5a5",
            opacity: 1,
            fillOpacity: 0.8
        };
        //console.log(options.fillColor);
        return options;
      },
      pane:"polygonsPane"
    });
   //console.log(polyLayer);
   var overlays = {
    "Countries with<br> Climate Change Policy": polyLayer
};
     L.control.layers(null,overlays).addTo(map);

};


function polyToLayer(feature, latlngs, attributes){
    //create marker options
    var options = {
        fillColor: getColor(feature.properties.Rank),
        color: "#a5a5a5",
        opacity: 1,
        fillOpacity: 0.8
    };

    console.log(feature);


     polyLayer = L.polygon(latlngs, 2.0, options);
    //  var polygon = L.layerGroup(layer);
    //  var overlayMaps = {
    //    "Countries with Emissions Policies": polygon
    //  };
     //
    //  L.control.layers(overlayMaps).addTo(map);

        //bind the popup to the circle marker
        layer.bindPopup(popupContent, {
            offset: new L.Point(0,-options.radius),
            closeButton: false
        });

        //event listeners to open popup on hover
        layer.on({
            mouseover: function(){
                this.openPopup();
            },
            mouseout: function(){
                this.closePopup();
            },

        });

     //return the circle marker to the L.geoJson pointToLayer option
     return polyLayer;
 };
 function getColor(d) {
   console.log(d);
     return d == 1000 ? '#800026' :
            d == 4  ?  '#2C7BB6' :
            d == 3  ? '#ABD9E9' :
            d == 2  ? '#FDAE61' :
            d == 1   ? '#D7191C' :
                       '#a5a5a5';
 };

///////////////////////////////////////////////////////////////////////////////



 function getData(map){
     //load the data
     $.ajax("data/CO2centroids.geojson", {
         dataType: "json",
         success: function(response){
             var attributes = processData(response);

             //call function to create proportional symbols
             createPropSymbols(response, map, attributes);
             createSequenceControls(map, attributes);
         }
     });
 };

 function processData(data){
     //properties of the first feature in the dataset
     var properties = data.features[0].properties;

     //push each attribute name into attributes array
     for (var attribute in properties){
         //only take attributes with population values
         if (attribute.indexOf("CO2") > -1){
             attributes.push(attribute);
         };
     };
     return attributes;
 };

 //Add circle markers for point features to the map
 function createPropSymbols(data, map, attributes){
     //create a Leaflet GeoJSON layer and add it to the map
     L.geoJson(data, {
       pointToLayer: function(feature, latlng){
          return pointToLayer(feature, latlng, attributes);

      }

    }, { pane:"pointsPane"}).addTo(map);
 };

function pointToLayer(feature, latlng, attributes){
    //create marker options
    var options = {
        radius: 8,
        fillColor: "#5e5e5e",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    var attribute = attributes[0];

    //For each feature, determine its value for the selected attribute
     var attValue = Number(feature.properties[attribute]);

     //Give each feature's circle marker a radius based on its attribute value
     options.radius = calcPropRadius(attValue);

     //create circle marker layer
     var layer = L.circleMarker(latlng, options);

     //original popupContent changed to popupContent variable
        var popupContent = "<p><b>Country:</b> " + feature.properties.Country + "</p>";

        //add formatted attribute to popup content string
        var year = attribute.split("_")[1];
        popupContent += "<p><b>CO2 emissions in " + year + " (kt):</b> <br>" + Math.round(feature.properties[attribute]) + "</p>";

        //bind the popup to the circle marker
        layer.bindPopup(popupContent, {
            offset: new L.Point(0,-options.radius),
            closeButton: false
        });
        //event listeners to open popup on hover
        layer.on({
            mouseover: function(){
                this.openPopup();
            },
            mouseout: function(){
                this.closePopup();
            },
        });
     //return the circle marker to the L.geoJson pointToLayer option
     return layer;
 };

function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = .001;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

function createSequenceControls(map, attributes){
    //create range input element (slider)
    $('#slider').append('<input class="range-slider" type="range">');

    $('.range-slider').attr({
        max: 6,
        min: 0,
        value: 0,
        step: 1
    });
   //Step 5: input listener for slider
   $('.range-slider').on('input', function(){
       var index = $(this).val();

       updatePropSymbols(map, attributes[index]);
   });
};

//update function for tooltips only
function updatePropSymbols(map, attribute){

    map.eachLayer(function(layer){
//global variable that holds currently selected feature
//if statement that checks what is in the span tag

        if (layer.feature && layer.feature.properties[attribute]){
            //update the layer style and popup
            var props = layer.feature.properties;
                 //update each feature's radius based on new attribute values
                 var radius = calcPropRadius(props[attribute]);
                 layer.setRadius(radius);
                 var year = attribute.split("_")[1];
                 popupContent = "<p><b>Country:</b> " + props.Country + "</p>";

                 popupContent += "<p><b>CO2 emissions in " + year + " (kt):</b> <br>" + Math.round(props[attribute]) + "</p>";

                 //replace the popup to the circle marker
                 layer.bindPopup(popupContent, {
                     offset: new L.Point(0,-radius),
                     closeButton: false
                 })
                var year =  attribute.split("_")[1];
                 layer.on({
                     mouseover: function(){
                         this.openPopup();
                     },
                     mouseout: function(){
                         this.closePopup();
                     },
                 });
             };
           });
         };



$(document).ready(createMap);
