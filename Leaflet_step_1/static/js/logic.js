var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 15,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    40.2, -101.5
  ],
  zoom: 3.5,
  });

streetmap.addTo(myMap);

// Store our API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  function styleMap(feature) {
    
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  console.log(feature)
    // changing color based on magnitude of the earthquakes
    function getColor(coordinates) {
    switch (true) {
    case coordinates < 10:
      return "#B22222";
    case coordinates >= 10 && coordinates < 30:
      return "#FFA500";
    case coordinates >= 30 && coordinates < 50:
      return "FFFF00";
    case coordinates >= 50 && coordinates < 70:
      return "#00BFFF";
    case coordinates >= 70 && coordinates < 90:
      return "#9400D3";
    default:
      return "#000080";
    }
  }
  console.log(coordinates)
    // get radius from magnitude and amplify
    function getRadius(mag) {
    if (mag === 0) {
      return 1;
    }
    return mag * 5;
  }
    // GeoJSON layer
    L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styleMap,
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
    }).addTo(myMap);
    // create a legend for the map
    var legend = L.control({
      position: "bottomright"
    });
    // add description onto the legend
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var depths = [-10,10,30,50,70,90];
    var colors = ["#B22222", "#FFA500", "#FFFF00", "#00BFFF", "#9400D3", "#000080"];
    console.log(data)
    //Adding colors to the legend
    for (var i = 0; i < depths.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
      console.log(colors[i]);
    }
    return div;
  };

  legend.addTo(myMap);

});