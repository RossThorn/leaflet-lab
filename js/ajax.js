function initialize(){
  jsAjax();
  //jQueryAjax();

};

//demo of AJAX using plain JS
function jsAjax(){
  //instantiate an ajax request object
  var ajaxRequest = new XMLHttpRequest();

  //create an event handler for the request
  ajaxRequest.onreadystatechange = function(){
    //console.log(ajaxRequest.readyState);
    if (ajaxRequest.readyState == 4){
      //call a callback function and pass data to it
      jsCallback(ajaxRequest.response);
    }
  };
  //a console.log(ajaxRequest.response) yields nothing because it would
  // execute before the response comes in. Need readystate to be 4 so data has
  // been returned
  console.log(ajaxRequest.response);


//open ajax request
//'get' request to get data from server, the place where you wanna get the data from
// and true to be asynchronous
ajaxRequest.open('GET', 'data/MegaCitiesGeoJSON.geojson', true);

//set data type
ajaxRequest.responseType = 'json';

//send the call
ajaxRequest.send()
};

function jsCallback(data){
  console.log(data)
  var htmlString = "<h3>Javascript AJAX response text:</h3>";
  //can't just concatenate JS object onto a string, so the following statement
  // just yields [object Object]
  //   htmlString += data;

  //following line turns JSON object into a string
  htmlString += JSON.stringify(data);
  //creating a paragraph element
  var p = document.createElement("p");
  //assigning htmlString to the paragraph
  p.innerHTML = htmlString
  //append paragraph to mydiv
  document.getElementById("mydiv").appendChild(p);
};


//ajax using jquery
function jQueryAjax(){
  //two arguments: location of data, object with settings
  $.ajax("data/MegaCitiesGeoJSON.geojson",{
    dataType: "json",
    //referencing function by name. Success means it will execute what data is
    // available and automatically sends data to it.
    success: jQueryCallback
  });
  //can also use $.getJSON. Does the same as the three lines above
  //$.getJSON("data/MegaCitiesGeoJSON.geojson", jQueryCallback);


};

//callback function for jQuery
function jQueryCallback(data){
  console.log(data);
  var htmlString = "<h3>jQuery AJAX response text:</h3>";
  htmlString += JSON.stringify(data);
  $("#mydiv").append("<p>"+htmlString+"</p>");
};





window.onload = initialize;
