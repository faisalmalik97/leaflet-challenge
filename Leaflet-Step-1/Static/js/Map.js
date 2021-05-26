// Step 1
var apiKey = "pk.eyJ1IjoiZmFpc2FsbWFsaWs5NyIsImEiOiJja3AzaXRtODcxdDFjMnZxdzJ5cTJqMTAwIn0.AvHWm4wl_0RXcOVMwhWzVw";
var rawmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: apiKey
});


var map = L.map("map_id", {
  center: [
    10, 90
  ],
  zoom: 4
});

// add layer map.

rawmap.addTo(map);

// earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {


  // for magnitude of the earthquake

  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  // color for magnitude of the earthquake.
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }

    // Style addition
    function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }

  // add GeoJSON layer to map 
  L.geoJson(data, {
   
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },

    // style for circleMarker 
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(map);

  // legend position control 
  var legend = L.control({
    position: "topright"
  });

  // details for legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var scales = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    // Looping for each interval
    for (var i = 0; i < scales.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        scales[i] + (scales[i + 1] ? "&ndash;" + scales[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Final map.
  legend.addTo(map);
});
