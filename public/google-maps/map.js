const data = {
    polygon: null,
    geojson: null,
    polygons: [],
    circles: []
}

let info;

/**
 * crete google map on `domId`
 * @param {*} domId 
 * @param {*} coord 
 * @param {*} zoomLevel 
 */
const initGoogleMap = (domId, coord, zoomLevel) => {
    //create the map
    let zoom = zoomLevel || 7

    const center = coord || {
        lat: 37.565157,
        lng: 126.838926
    }

    window.map = new google.maps.Map(document.getElementById(domId), {
        zoom: zoom,
        center: center
    })
    // window.map.data.setStyle({
    //     fillColor: '#00FF00',
    //     editable: true
    // })

    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function(position) {
    //         var latitude = position.coords.latitude;
    //         var longitude = position.coords.longitude;
    //         center.lat = latitude
    //         center.lng = longitude

    //         setTimeout(() => {
    //             zoom = 12
    //             window.map.setCenter(center)
    //             window.map.setZoom(zoom)
    //         }, 1000)
    //     })
    // }

    // let infoWindow = new google.maps.InfoWindow({
    //     content: "Click the map to get Lat/Lng!",
    //     position: center,
    // })
    info = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: center,
    })

    info.open(map)

    window.markers = []

    // Configure the click listener.
    window.map.addListener("click", async (mapsMouseEvent) => {
        const drawmode = document.querySelector('[name=drawmode]:checked').value
        const latlng = mapsMouseEvent.latLng.toJSON()
        if (drawmode == 'dong') {
            console.log('Get Dong')
            info.close()
            // Create a new InfoWindow.
            info = new google.maps.InfoWindow({
                position: mapsMouseEvent.latLng,
            })
            document.form1.lat.value = latlng.lat
            document.form1.lng.value = latlng.lng
            info.setContent(
                `LAT LNG: ${latlng.lat} ${latlng.lng}`
            )
            info.open(window.map)
            console.log(latlng)
            return

            const cityCircle = new google.maps.Circle({
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
                map: window.map,
                center: latlng,
                radius: Number(document.form1.distance.value)
            });
            data.circles.push(cityCircle)

            const response = await getLegalDongAtPoint(latlng)
            const polygons = []
            response.data.forEach((element) => {
                polygons.push(element.polygon)
            })
            showGeoJson(polygons)
        } else if (drawmode == 'polygon') {
            if (data.polygon) {
                return
            }

            data.polygon = new google.maps.Polygon({
                paths: [latlng, latlng],
                strokeColor: '#00FF00',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#00FF00',
                fillOpacity: 0.35,
                draggable: true,
                editable: true
            });
            data.polygon.setMap(window.map)
            data.polygons.push(polygon)
        }
    })

    window.sample_data = { "id": "807", "type": "Feature", "properties": { "EMD_CD": "27260104", "EMD_ENG_NM": "Suseong-dong 2(i)-ga", "EMD_KOR_NM": "\uc218\uc131\ub3d92\uac00" }, "geometry": { "type": "Polygon", "coordinates": [[[128.6132732784135, 35.85113899945861], [128.61410788409898, 35.859773498500566], [128.61763129693347, 35.85959554439207], [128.61676622240017, 35.850922109231455], [128.6132732784135, 35.85113899945861]]] } };
}

function toggleEditable() {
    window.map.data.setStyle({
        fillColor: '#00FF00',
        editable: !window.map.data.getStyle().editable
    })
}

function clearMap(dataonly) {
    window.map.data.forEach((feature) => {
        window.map.data.remove(feature)
    })
    window.markers.map((marker) => marker.setMap(null));
    if (dataonly) {
        return
    }
    while (data.polygons.length > 0) {
        let polygon = data.polygons.pop()
        polygon.setMap(null)
    }
    while (data.circles.length > 0) {
        const circle = data.circles.pop()
        circle.setMap(null)
    }
}

function showGeoJson(data) {
    
    if (data.type == 'FeatureCollection') {
        let i = 1
        for (const feature of data.features) {
            const geometryType = feature.geometry.type
            if (geometryType == 'Point') {
                // const info = new google.maps.InfoWindow()
                const marker = new google.maps.Marker({
                    position: {
                        lat: feature.geometry.coordinates[1],
                        lng: feature.geometry.coordinates[0]
                    },
                    label: `${i}`,
                    properties: feature.properties,
                    map: window.map
                })
                window.markers.push(marker)
                google.maps.event.addListener(marker, 'click', function() {
                    // info.setContent(this.getPosition().toUrlValue(6));
                    info.setContent(JSON.stringify(this.properties, null, 4))
                    info.open(map, this)
                });
                i ++
            } else {
                window.map.data.addGeoJson(feature)
            }

        }
    } else {
        window.map.data.addGeoJson(data)
    }
}

function switchLatLng(coordinates) {
    if (typeof coordinates[0] == 'number') {
        return [coordinates[1], coordinates[0]]
    } else {
        let l = []
        for (i of coordinates) {
            l.push(switchLatLng(i))
        }
        return l
    }
}

async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

async function showLegalDongAround(form) {
    const response = await search()
    if (response.data.length == 1) {
        clearMap(true)
        showGeoJson(response.data[0].polygon)
    } else {
        const polygons = []
        response.data.forEach((element) => {
            polygons.push(element.polygon)
        })
        clearMap(true)
        showGeoJson(polygons)
    }
}

// async function fetchall() {
//     let has_next = true
//     let page = 0
//     let count = 0
//     let counter = 0
//     let page_size = 20
//     while (has_next) {
//         response = await search(page + 1)
//         count = response.count
//         has_next = response.has_next
//         page = response.page

//         response.data.forEach(element => {
//             counter += 1
//             window.map.data.addGeoJson(element.polygon)
//         })
//     }
// }

async function savePolygon() {
    data.coords = []
    await window.map.data.forEach(async (feature) => {
        await new Promise((resolve) => {
            feature.toGeoJson((result) => {
                data.geojson = result
                resolve()
            })
        })
    })
    if (data.geojson) {
        console.log('Found GeoJson')
    } else {
        const paths = data.polygon.getPaths()
        for (let i = 0; i < paths.getLength(); i++) {
            const io = paths.getAt(i)
            for (let j = 0; j < io.getLength(); j++) {
                data.coords.push({
                    lat: io.getAt(j).lat(),
                    lng: io.getAt(j).lng()
                })
            }
        }
        console.log(JSON.stringify(data.coords, null, 4))
        console.log('Saved polygon')
    }
}

function addPolygonToMap() {
    if (data.geojson) {
        showGeoJson(data.geojson)
    } else {
        const coords2 = []
        const p = []
        for (let coord of data.coords) {
            p.push([
                coord.lng,
                coord.lat
            ])
        }
        p.push([
            data.coords[0].lng,
            data.coords[0].lat
        ])
        coords2.push(p)

        showGeoJson({
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: coords2
            }
        })
    }
}