// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Set up the OSM layer
L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenStreetMap contributors'
}).addTo(map);

// Configure the data source
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Function to set color based on depth
function getColor(depth) {
    return depth > 90 ? '#800026' :
           depth > 70  ? '#BD0026' :
           depth > 50  ? '#E31A1C' :
           depth > 30  ? '#FC4E2A' :
           depth > 10   ? '#FD8D3C' :
                      '#FFEDA0';
}

// Fetch the data
$.getJSON(earthquakesURL, function(data) {
    L.geoJson(data, {
        // Create a circle marker
        pointToLayer: function(earthquakeData, latlng) {
            return new L.CircleMarker(latlng, {
                radius: earthquakeData.properties.mag * 5, // Set the size of the marker based on magnitude
                fillColor: getColor(earthquakeData.geometry.coordinates[2]), // Set the color based on depth
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },

        // Add popups
        onEachFeature: function (earthquakeData, layer) {
            if (earthquakeData.properties && earthquakeData.properties.place) {
                layer.bindPopup('<h3>' + earthquakeData.properties.title + '</h3><hr><p>' + new Date(earthquakeData.properties.time) + '</p>');
            }
        }
    }).addTo(map);
});

// Add a depth legend to the map
var depthLegend = L.control({position: 'bottomright'});
depthLegend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 10, 30, 50, 70, 90],
    labels = ["<strong>Depth (km)</strong>"],
    from, to;
    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];
        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};
depthLegend.addTo(map);
