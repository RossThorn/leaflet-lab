/* Map of GeoJSON data from MegaCities.geojson */

//Global variables for use outside of functions
var year;

var countryName;
 //empty array to hold attributes
var attributes = [];

var polyLayer;

//////////////////////////////////////////////////////////////////////////////

//function to instantiate the Leaflet map
function createMap(){
    var southWest = L.latLng(-90, -180),
    northEast = L.latLng(90, 180),
    bounds = L.latLngBounds(southWest, northEast);

    //create the map
    var map = L.map('mapid', {
        center: [20, 0],
        zoom: 2,
        maxBounds: bounds,
        maxBoundsViscosity:.7
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

////////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////

function createPolygons(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    var polyLayer = L.geoJson(data, {
      style: function(feature){
        //console.log(feature);
        var options = {
            fillColor: getColor(feature.properties.Rank),
            weight: .5,
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

///////////////////////////////////////////////////////////////////////////////

 function getColor(d) {
   //console.log(d);
     return d == 4  ?  '#238443' :
            d == 3  ? '#78c679' :
            d == 2  ? '#c2e699' :
            d == 1   ? '#ffffcc' :
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
             createSymbolLegend(map,attributes);
             createLegend (map, attributes);
         }
     });
 };

////////////////////////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////////////////////
function pointToLayer(feature, latlng, attributes){
    //create marker options
    var options = {
        radius: 8,
        fillColor: "#5e5e5e",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
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

 //////////////////////////////////////////////////////////////////////////////

function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = .001;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

///////////////////////////////////////////////////////////////////////////////
// //Create new sequence controls
function createSequenceControls(map, attributes){
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        onAdd: function (map) {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');
            // create div element with the class 'overlay' and append it to the body

            //$(container).append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
            //create range input element (slider)
            $(container).append('<input class="range-slider" type="range" max="6" min="0" step="1" value="0">');
          //  $(container).append('<button class="skip" id="forward" title="Forward">Skip</button>');
          // var initialYear = attributes[0]
          // var year = initialYear.split("_")[1];
          // $(container).append('<p>'+year+'</p>');
           //kill any mouse event listeners on the map
           L.DomEvent.disableClickPropagation(container);
            $(container).on('mousedown click', function(e){

                $('.range-slider').on('input', function(){
                    var index = $(this).val();

                    updatePropSymbols(map, attributes[index]);
            });
            });
            return container;
        }
    });
    map.addControl(new SequenceControl());
  };

///////////////////////////////////////////////////////////////////////////////

  function createLegend(map, attributes){
      var LegendControl = L.Control.extend({
          options: {
              position: 'bottomright'
          },
          onAdd: function (map) {
              // create the control container with a particular class name
              var container = L.DomUtil.create('div', 'legend');
              //PUT YOUR SCRIPT TO CREATE THE TEMPORAL LEGEND HERE
              var initialYear = attributes[0]
              $(container).append("<div id='title' style='font-size:12px'><p><b>CO2 emissions in</b></p></div>")
              $(container).append("<div id='legendYear' class='leaflet-legend-control'><p><b>2007</b></p></div>");
              // var yearLegend = L.DomUtil.get('legendYear');
              // console.log(yearLegend);
              // var year = initialYear.split("_")[1];
              // $(yearLegend).html('<p><b>'+year+'</b></p>');



              return container;
          }
      });
      //start making legand symbols HERE


      map.addControl(new LegendControl());
  };

//////////////////////////////////////////////////////////////////////////////
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
                 var container = L.DomUtil.get('legendYear');
                   $(container).html('<p><b>'+year+'</b></p>');

                   updateLegend(map,attribute);
                 //replace the popup to the circle marker
                 layer.bindPopup(popupContent, {
                     offset: new L.Point(0,-radius),
                     closeButton: false
                 })

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

////////////////////////////////////////////////////////////////////////////////

 function createSymbolLegend(map, attributes){


     var LegendControl = L.Control.extend({
         options: {
             position: 'bottomright'
         },

         onAdd: function (map) {
       // create the control container with a particular class name
       var container = L.DomUtil.create('div', 'legendCircle');

       //Step 1: start attribute legend svg string
       var svg = '<svg id="attribute-legend" width="300px" height="140px">';

       //array of circle names to base loop on
       var circles = ["max", "mean", "min"];

       //Step 2: loop to add each circle and text to svg string
       for (var i=0; i<circles.length; i++){
           //circle string
           svg += '<circle class="legend-circle" id="' + circles[i] +
           '" fill="#a5a5a5" fill-opacity="0.8" stroke="#000000" cx="70"/>';
       };

       //close svg string
       svg += "</svg>";

       //add attribute legend svg to container
       $(container).append(svg);


             return container;
         }
     });

     map.addControl(new LegendControl());

     updateLegend(map, attributes[0]);
 };

 //////////////////////////////////////////////////////////////////////////////

 function getCircleValues(map, attribute){
     //start with min at highest possible and max at lowest possible number
     var min = Infinity,
         max = -Infinity;

     map.eachLayer(function(layer){
         //get the attribute value
         if (layer.feature){
             var attributeValue = Number(layer.feature.properties[attribute]);

             //test for min
             if (attributeValue < min){
                 min = attributeValue;
             };

             //test for max
             if (attributeValue > max){
                 max = attributeValue;
             };
         };
     });

     //set mean
     var mean = (max + min) / 2;

     //return values as an object
     return {
         max: max,
         mean: mean,
         min: min
     };
 };

 //////////////////////////////////////////////////////////////////////////////

 //Example 3.7 line 1...Update the legend with new attribute
 function updateLegend(map, attribute){

     //get the max, mean, and min values as an object
     var circleValues = getCircleValues(map, attribute);
     for (var key in circleValues){
       //get the radius
       var radius = calcPropRadius(circleValues[key]);

       //Step 3: assign the cy and r attributes
       $('#'+key).attr({
           cy: 139 - radius,
           r: radius
       });
   };
 };

$(document).ready(createMap);
