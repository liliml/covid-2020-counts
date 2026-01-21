mapboxgl.accessToken = 'pk.eyJ1Ijoicm9zZS0xNjgiLCJhIjoiY202aWYxY3lsMDdxdjJpcHJoaHlmZzdiNiJ9.3wUanYJCI6409InuRs9e7A';

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        zoom: 6, // starting zoom
        center: [-122, 47.5] // starting center
    }
);

async function geojsonFetch() { 
    let response = await fetch('assets/us-covid-2020-rates.json');
    let us_covid_data = await response.json();

    map.on('load', function loadingData() {
        // add layer
        // add legend
        map.addSource('us-covid-2020-rates', {
            type: 'geojson',
            data: us_covid_data
        });
        console.log("got here");
        
        map.addLayer({
            'id': 'us_covid_data-layer',
            'type': 'fill',
            'source': 'us-covid-2020-rates',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'rates'],
                    '#FFEDA0',   // stop_output_0
                    10,          // stop_input_0 use color above if fullvax 3000 <
                    '#FED976',   // stop_output_1 
                    20,          // stop_input_1 use color above if 3000 <= fullyvax < 3500
                    '#FEB24C',   // stop_output_2
                    30,          // stop_input_2 use color above if 3500 <= fullyvax < 4000
                    '#FD8D3C',   // stop_output_3
                    40,         // stop_input_3 use color above if 4000 <= fullyvax < 4500
                    '#FC4E2A',   // stop_output_4
                    50,         // stop_input_4 use color above if 4500 <= fullyvax < 5000
                    '#E31A1C',   // stop_output_5
                    60,         // stop_input_5 use color above if 5000 <= fullyvax < 5500
                    '#BD0026',   // stop_output_6
                    70,        // stop_input_6 use color above if 5500 <= fullyvax < 6000
                    "#800026",    // stop_output_7
                    80,        // stop_input_7 use color above if 6000 <= fullyvax < 6500
                    "#5000d2",    // stop_output_8 
                    90,        // stop_input_8 use color above if 6500 <= fullyvax < 7000
                    "#2a006f",    // stop_output_9 
                                  // use color above if 7000 <= fullyvax 
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7
            }
        });
    });

    
    const layers = [
        'less then 3000',
        '3000-3499',
        '3500-3999',
        '4000-4499',
        '4500-4999',
        '5000-5499',
        '5500-5999',
        '6000-6499',
        '6500-6999',
        '7000 or more'
    ];
    const colors = [
        '#FFEDA0', 
        '#FED976', 
        '#FEB24C',
        '#FD8D3C', 
        '#FC4E2A',  
        '#E31A1C',  
        '#BD0026', 
        "#800026",  
        "#5000d2",  
        "#2a006f"  
    ];
    
    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>Percentage of people per county who had covid in 2020<br>(people per 10k within the county)</b><br><br>";
    
    layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;
    
        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });
    
    map.on('mousemove', ({point}) => {
        const county = map.queryRenderedFeatures(point, {
            layers: ['us_covid_data-layer']
        });
        document.getElementById('text-description').innerHTML = county.length ?
            `<h3>${county[0].properties.county}</h3><p><strong><em>${county[0].properties.rates}</strong> percentage of people who had covid in 2020 per 10k people within the county (based on 2018 population census)</em></p>` :
            `<p>Hover over a state county!</p>`;
    });
}

geojsonFetch();