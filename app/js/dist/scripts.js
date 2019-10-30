/**
 * Runs the searching function, and will populate the
 * dropdown with the results.
 */

async function searchPopulate() {
    await runSearch(document.querySelector('.searchTerm').value)
    var myAudio = document.querySelector('audio')
    var playButton = document.querySelector('#play')
    var pauseButton = document.querySelector('#pause')
    var playPromise = myAudio.play()
    if (playPromise !== undefined) {
        playPromise.then(_ => {
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
            startEndTimer(4700)
        })
        .catch(error => {
            await populateHandlebars('.url', 'js/templates/failed.hbs', result)
            startEndTimer(2500)
        });
      } else {
          console.log('thou hast failed')
      }
}

/**
 * This will start two listeners: 
 * 1. Waits to see if the music is playing; if so, it stops
 * the play button from flashing.
 * 
 * 2. Is a settimeout function which waits 4.7 seconds to see
 * if the audio track is playing. If not, it will rerun the above
 * searchPopulate function.
 * 
 * The second timer is cleared both at the start of this function,
 * and if the music is found to be playing. 
 */

var playTimer
function startEndTimer(time) {
    clearTimeout(timer)
    var timer
    document.querySelector('audio').onplaying = function () {
        clearTimeout(timer)
        document.querySelector('#play').classList.remove("flashing")
        console.log('Connection successful - enjoy the tunes')
    }
    timer = window.setTimeout(function () {
        if (myAudio.duration > 0 && !myAudio.paused) {
            document.querySelector('#play').classList.remove("flashing")
        } else {
            console.log('Connection unsuccessful - reshuffling')
           searchPopulate()
        }
    }, time)
}

/** 
 * Runs a search of the data returned from the API according to the
 * searchTerm, against the tags and name. 
 * 
 * Only mp3 results are returned, and .m3u and .pls delivery formats
 * are excluded.
 * 
 * This function puts all results into a new array, and randomly selects
 * one to pass to the searchPopulate function.
 * 
 * @param searchTerm {The term searched by the user in the input box}
 */

async function runSearch(searchTerm) {
    let data = await fetch('http://www.radio-browser.info/webservice/json/stations/bytag/' + searchTerm)
    data = await data.json()
    let search = []
    var regex = /^.*\.(pls|m3u)$/
    data.forEach(element => {
        if (element.tags == searchTerm || element.name && element.codec == 'MP3') {
            if (!element.url.match(regex) )
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
