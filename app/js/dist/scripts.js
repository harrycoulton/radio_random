async function searchDestroy() {
    await runSearch(document.querySelector('.searchTerm').value)
    var myAudio = document.querySelector('audio')
    var playButton = document.querySelector('#play')
    var pauseButton = document.querySelector('#pause')
    myAudio.play()
    playButton.classList.add("flashing")
    playButton.style.color = "rgb(35, 255, 35)"
    pauseButton.style.color = "black"
    playButton.addEventListener('click', function () {
        playButton.style.color = "rgb(35, 255, 35)"
        pauseButton.style.color = "black"
    })
    document.querySelector('#pause').addEventListener('click', function () {
        playButton.style.color = "black"
        pauseButton.style.color = "rgb(35, 255, 35)"
        myAudio.pause()
    })
    startEndTimer()
}

var playTimer
function startEndTimer() {
    clearTimeout(timer)
    var timer
    document.querySelector('audio').onplaying = function () {
        document.querySelector('#play').classList.remove("flashing")
        console.log('Connection successful - enjoy the tunes')
    }
    timer = window.setTimeout(function () {
        if (myAudio.duration > 0 && !myAudio.paused) {
            document.querySelector('#play').classList.remove("flashing")
        } else {
            console.log('Connection unsuccessful - reshuffling')
           searchDestroy()
        }
    }, 4700)
}

async function runSearch(searchTerm) {
    let data = await searchAllStations(searchTerm);
    let search = []
    var regex = /^.*\.(pls|m3u)$/
    data.forEach(element => {
        if (element.tags == searchTerm || element.name && element.codec == 'MP3') {
            if (!element.url.match(regex))
            search.push(element)
        }
    })
    let result = search[Math.floor(Math.random() * search.length)]
    if (result != null) {
    console.log('Attempting to play station')
    await populateHandlebars('.url', 'js/templates/audio.hbs', result)
    return await result }
    else {
        let empty = {}
        await populateHandlebars('.url', 'js/templates/empty.hbs', result)
    }
}

async function searchAllStations(search) {
    let data = await fetch('http://www.radio-browser.info/webservice/json/stations/bytag/' + search)
    data = await data.json()
    return await data
}

/**
 * Populate handlebars template
 *
 * @param targetElement the html element to insert handlebars template into
 * @param handlebarsPath the path to where the handlebars template is located
 * @param APIpath the API path
 * @returns {Promise<void>}
 */

async function populateHandlebars(targetElement, handlebarsPath, dataToInsert) {
    let HBTemplate = await getTemplateAjax(handlebarsPath)
    let template = Handlebars.compile(HBTemplate)
    document.querySelector(targetElement).innerHTML = template(dataToInsert)
}

/**
 * asynchronously fetches handlebars templates
 *
 * @param path of the template in use
 *
 * @returns the template as text inside a promise
 */
async function getTemplateAjax(path) {
    let response = await fetch(
        path,
        { method: 'get' }
    )
    return response.text()
}



// Breaks on the load of a radio station after a timeout has happened.
