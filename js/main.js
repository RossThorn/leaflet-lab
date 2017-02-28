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

var year;
var panelCountry;
var countryName;
 var attributes = [];

////Function used with panel. abandoned for this portion
// function pointToLayer(feature, latlng, attributes){
//     //create marker options
//     var options = {
//         radius: 8,
//         fillColor: "#ff7800",
//         color: "#000",
//         weight: 1,
//         opacity: 1,
//         fillOpacity: 0.8
//     };
//     var attribute = attributes[0];
//
//     //For each feature, determine its value for the selected attribute
//      var attValue = Number(feature.properties[attribute]);
//
//      //Give each feature's circle marker a radius based on its attribute value
//      options.radius = calcPropRadius(attValue);
//
//      //create circle marker layer
//      var layer = L.circleMarker(latlng, options);
//
//      //original popupContent changed to panelContent...Example 2.2 line 1
//         var panelContent = "<p><b>Country:</b> " + feature.properties.Country + "</p>";
//
//         //add formatted attribute to panel content string
//         var year = attribute.split("_")[1];
//         panelContent += "<p><b>CO2 emissions in " + year + " (kt):</b> <br>" + Math.round(feature.properties[attribute]) + "</p>";
//
//         //popup content is now just the city name
//         var popupContent = feature.properties.Country;
//
//         //bind the popup to the circle marker
//         layer.bindPopup(popupContent, {
//             offset: new L.Point(0,-options.radius),
//             closeButton: false
//         });
//
//         //event listeners to open popup on hover and fill panel on click
//         layer.on({
//             mouseover: function(){
//                 this.openPopup();
//             },
//             mouseout: function(){
//                 this.closePopup();
//             },
//             click: function(){
//                 countryName = popupContent
//                 $("#info").html(panelContent);
//
//
//             }
//         });
//
//      //return the circle marker to the L.geoJson pointToLayer option
//      return layer;
//  };

function pointToLayer(feature, latlng, attributes){
    //create marker options
    var options = {
        radius: 8,
        fillColor: "#ff7800",
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

        //event listeners to open popup on hover and fill panel on click
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


 //Add circle markers for point features to the map
 function createPropSymbols(data, map, attributes){
     //create a Leaflet GeoJSON layer and add it to the map
     L.geoJson(data, {
       pointToLayer: function(feature, latlng){
          return pointToLayer(feature, latlng, attributes);

      }

     }).addTo(map);
 };

//Step 2: Import GeoJSON data
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

  // buttons removed
  //   $('#slider').append('<button class="skip" id="reverse">Reverse</button>');
  //   $('#slider').append('<button class="skip" id="forward">Skip</button>');
  //   $('#reverse').html('<img src="img/reverse.png">');
  //   $('#forward').html('<img src="img/forward.png">');
   //
  //   $('.skip').click(function(){
  //      var index = $('.range-slider').val();
   //
  //      if ($(this).attr('id') == 'forward'){
  //           index++;
  //           //Step 7: if past the last attribute, wrap around to first attribute
  //           index = index > 6 ? 0 : index;
  //       } else if ($(this).attr('id') == 'reverse'){
  //           index--;
  //           //Step 7: if past the first attribute, wrap around to last attribute
  //           index = index < 0 ? 6 : index;
  //       };
   //
  //       //Step 8: update slider
  //       $('.range-slider').val(index);
   //
  //       updatePropSymbols(map, attributes[index]);
   //
  //  });

   //Step 5: input listener for slider
   $('.range-slider').on('input', function(){
       var index = $(this).val();

       updatePropSymbols(map, attributes[index]);


   });
};


//function for use with panel
// function updatePropSymbols(map, attribute){
//
//     map.eachLayer(function(layer){
// //global variable that holds currently selected feature
// //if statement that checks what is in the span tag
//       if (typeof countryName == "undefined") {
//
//       } else{
//         var year = attribute.split("_")[1];
//         console.log(attribute);
//         panelContent = "<p><b>Country:</b> " + countryName + "</p>";
//         panelContent += "<p><b>CO2 emissions in " + year + " (kt):</b> <br>" + layer.feature.properties[attribute] + "</p>";
//         $("#info").html(panelContent);
//       }
//         if (layer.feature && layer.feature.properties[attribute]){
//             //update the layer style and popup
//             var props = layer.feature.properties;
//
//
//                  //update each feature's radius based on new attribute values
//                  var radius = calcPropRadius(props[attribute]);
//
//                  layer.setRadius(radius);
//
//
//
//
//                  //popup content is now just the city name
//                  var popupContent = props.Country;
//
//
//
//                  //replace the popup to the circle marker
//                  layer.bindPopup(popupContent, {
//                      offset: new L.Point(0,-radius),
//                      closeButton: false
//                  })
//
//
//                 var year =  attribute.split("_")[1];
//
//                  layer.on({
//                      mouseover: function(){
//                          this.openPopup();
//                      },
//                      mouseout: function(){
//                          this.closePopup();
//                      },
//                      click: function(){
//
//                         panelContent = "<p><b>Country:</b> " + popupContent + "</p>";
//                         panelContent += "<p><b>CO2 emissions in " + year + " (kt):</b> <br>" + Math.round(props[attribute]) + "</p>";
//                         $("#info").html(panelContent);
//                         countryName =popupContent
//                          }
//                  });
//              };
//            });
//          };

//update function for tooltips only
function updatePropSymbols(map, attribute){

    map.eachLayer(function(layer){
//global variable that holds currently selected feature
//if statement that checks what is in the span tag

        if (layer.feature && layer.feature.properties[attribute]){
            //update the layer style and popup
            var props = layer.feature.properties;


                console.log(props[attribute])

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

 //empty array to hold attributes

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


$(document).ready(createMap);
