mapboxgl.accessToken =
    'pk.eyJ1Ijoicm9zZS0xNjgiLCJhIjoiY202aWYxY3lsMDdxdjJpcHJoaHlmZzdiNiJ9.3wUanYJCI6409InuRs9e7A';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    projection: 'albers', //source referenced for map projection type: https://docs.mapbox.com/mapbox-gl-js/guides/projections/
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 4.2, // starting zoom
    minZoom: 4, // minimum zoom level of the map
    center: [-95, 40.5] // starting center
});

//10 values for numcases (number of covid cases) and radii, TODO: need 10 colors right now have 3
//20000 and radii of value 14 are for number of cases >= 20000
const numcases = [0, 500, 1000, 2000, 3000, 4000, 5000, 10000, 15000, 20000],
    colors = ['rgb(208,209,230)', 'rgb(103,169,207)', 'rgb(1,108,89)','rgb(0, 195, 255)', 'rgb(4, 0, 255)', 'rgba(98, 0, 255, 1)', 'rgba(249, 148, 185, 1)', 'rgba(247, 70, 126, 1)', 'rgba(255, 0, 81, 1)', 'rgba(95, 27, 27, 1)', 'rgb(0, 0, 0)'],
    radii = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
//load data to the map as new layers.
//map.on('load', function loadingData() {
map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function
    // when loading a geojson, there are two steps
    // add a source of the data and then add the layer out of the source
    map.addSource('us-covid-2020-counts', {
        type: 'geojson',
        data: 'assets/us-covid-2020-counts.json'
    });



    //ATTEMPT TO ADD SECTION BELOW FOR SHAPEFILE FOR OUTLINE OF COUNTIES
    map.addSource('us-covid-2020-rates', {
        type: 'geojson',
        data: 'assets/us-covid-2020-rates.json'
    });
    //ATTEMPT TO ADD SECTION BELOW FOR SHAPEFILE FOR OUTLINE OF COUNTIES
    map.addLayer({
        'id': 'us_covid_data-layer',
        'type': 'fill',
        'source': 'us-covid-2020-rates',
        'paint': {
            //'fill-color': '#FFEDA0',
            //need line below to show seperation between counties
            'fill-outline-color': '#BBBBBB',
            'fill-opacity': 0.7
        }
    });



    map.addLayer({
            'id': 'covid-points',
            'type': 'circle',
            'source': 'us-covid-2020-counts',
            'paint': {
                // increase the radii of the circle as the zoom level and dbh value increases
                // numcases[0] is value at index 0 of the array numcases, value is 0, numcases[5] is value at index 5
                // in the numcases array from above, is this case is 4000 
                // (this also applies for hte radii values in the code below is referencing the radii array)
                // each circle is lower number to one before the next upper number, so cases is 0-499 cases, 
                // 500 is 500-999 cases, so on and so forth. but 20000 is 20000 and above cases 
                'circle-radius': {
                    'property': 'deaths',
                    'stops': [
                        [numcases[0], radii[0]],
                        [numcases[1], radii[1]],
                        [numcases[2], radii[2]],
                        [numcases[3], radii[3]],
                        [numcases[4], radii[4]],
                        [numcases[5], radii[5]],
                        [numcases[6], radii[6]],
                        [numcases[7], radii[7]],
                        [numcases[8], radii[8]],
                        [numcases[9], radii[9]],
                        [numcases[10], radii[10]]
                    ]
                },
                'circle-color': {
                    'property': 'deaths',
                    'stops': [
                        [numcases[0], colors[0]],
                        [numcases[1], colors[1]],
                        [numcases[2], colors[2]],
                        [numcases[3], colors[3]],
                        [numcases[4], colors[4]],
                        [numcases[5], colors[5]],
                        [numcases[6], colors[6]],
                        [numcases[7], colors[7]],
                        [numcases[8], colors[8]],
                        [numcases[9], colors[9]],
                        [numcases[10], colors[10]]
                    ]
                },
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': 0.6
            }
        }
    );
    // click on tree to view magnitude in a popup
    map.on('click', 'covid-points', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>Number of COVID Deaths in ${event.features[0].properties.county} county in ${event.features[0].properties.state} state:</strong> ${event.features[0].properties.deaths}`)
            .addTo(map);
    });


});



    //TESTING FROM ABOVE: 
    const covidvals = [
        '0-499',
        '500-999',
        '1000-1999',
        '2000-2999',
        '3000-3999',
        '4000-4999',
        '5000-9999',
        '10000-14999',
        '15000-19999',
        '20000-24999',
        '25000+'
    ];

    // covidvals.forEach((layer, i) => {
    //     const color = colors[i];
    //     const item = document.createElement('div');
    //     const key = document.createElement('span');
    //     key.className = 'legend-key';
    //     key.style.backgroundColor = color;
    
    //     const value = document.createElement('span');
    //     value.innerHTML = `${layer}`;
    //     item.appendChild(key);
    //     item.appendChild(value);
    //     legend.appendChild(item);
    // });
    



// create legend
const legend = document.getElementById('legend');
//set up legend numcases and labels
var labels = ['<strong>Number of COVID Deaths in the County in 2020</strong>'],
    vbreak;
//iterate through numcases and create a scaled circle and label for each
for (var i = 0; i < numcases.length; i++) {
    vbreak = covidvals[i];
    // you need to manually adjust the radius of each dot on the legend 
    // in order to make sure the legend can be properly referred to the dot on the map.
    dot_radii = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' +
        dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
        '</span></p>');
}

//ORIGINAL FOR SOURCE SECTION: 
//const source =
//    '<p style="text-align: left; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">NYT COVID Cases & Death Rates</a></p>';

const source =
    '<p><b>Sources:</b></p><p style="text-align: left; font-size:10pt"><a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">NYT COVID Cases & Death Rates</a></p><p style="text-align: left; font-size:10pt"><a href="https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html">US Census Bureau Data for US County Shapefiles</a></p>';
legend.innerHTML = labels.join('') + source;