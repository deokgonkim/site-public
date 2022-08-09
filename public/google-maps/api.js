
async function getLegalDongAtPoint(point) {
    const base_url = `/boundary-legal-dong`
    let url
    const lat = point.lat
    const lng = point.lng
    url = base_url
    url += '?lat=' + lat
    url += '&lng=' + lng
    return fetch(url).then((result) => {
        // console.log(result)
        return result.json()
    })
}

async function search(page) {
    const base_url = `/boundary-legal-dong`
    let url
    const lat = document.form1.lat.value
    const lng = document.form1.lng.value
    const distance = document.form1.distance.value
    const scale = document.form1.scale.value
    const merge = document.form1.merge.value
    if (page) {
        url = base_url + '?page=' + page
        url += '&lat=' + lat
        url += '&lng=' + lng
        url += '&distance=' + distance
        url += '&scale=' + scale
        url += '&merge=' + merge
    } else {
        url = base_url
        url += '?lat=' + lat
        url += '&lng=' + lng
        url += '&distance=' + distance
        url += '&scale=' + scale
        url += '&merge=' + merge
    }
    return fetch(url).then((result) => {
        // console.log(result)
        return result.json()
    })
}

async function showLegalDong(form) {
    const response = await getLegalDong(form.id.value)
    showGeoJson(response.data.polygon)
}


async function showStoreDeliveryBoundary(form) {
    const response = await getStoreDeliveryBoundary(form.id.value)
    for (const store_delivery_boundary of response.data) {
        if (store_delivery_boundary.polygon) {
            showGeoJson(store_delivery_boundary.polygon)
        } else if (store_delivery_boundary.legalDongId) {
            const response = await getLegalDong(String(store_delivery_boundary.legalDongId))
            showGeoJson(response.data.polygon)
        }
    }
}

async function getLegalDong(id) {
    if (id.indexOf(',') != -1) {
        const url = `/boundary-legal-dong/merge?ids=${id}`
        return fetch(url).then((result) => {
            // console.log(result)
            return result.json()
        })
    } else {
        const url = `/boundary-legal-dong/${id}`
        return fetch(url).then((result) => {
            // console.log(result)
            return result.json()
        })
    }
}

async function getStoreDeliveryBoundary(id) {
    const url = `/store/${id}/delivery-boundary`
    return fetch(url).then((result) => {
        return result.json()
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