async function runSearch(searchTerm){
    let data = await searchAllStations(searchTerm);
    let search = []
    data.forEach(element => {
        if (element.tags == searchTerm || element.name && element.codec == 'MP3') {
            search.push(element)
        }
    })
    let result = search[Math.floor(Math.random()*search.length)]
    console.log(result)
    await populateHandlebars('.url', 'js/templates/audio.hbs', result)
    document.querySelector('audio').play()
    }

async function searchAllStations(search) {
    let data = await fetch('http://www.radio-browser.info/webservice/json/stations/bytag/'+search)
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
        {method: 'get'}
    )
    return response.text()
}
 async function searchDestroy() {
     await runSearch(document.querySelector('.searchTerm').value)
     document.querySelector('#play').classList.add("flashing")
     document.querySelector('#play').style.color = "rgb(35, 255, 35)"
     document.querySelector('#pause').style.color = "black"
     var myAudio = document.querySelector('audio')
     setTimeout(function(){
        if (myAudio.duration > 0 && !myAudio.paused) {
            document.querySelector('#play').classList.remove("flashing")
        } 
    }, 2000)
     setTimeout(function(){
         if (myAudio.duration > 0 && !myAudio.paused) {
            document.querySelector('#play').classList.remove("flashing")
         } else {
             searchDestroy()
         } 
     }, 4500)
     document.querySelector('#play').addEventListener('click', function(){
        document.querySelector('#play').style.color = "rgb(35, 255, 35)"
        document.querySelector('#pause').style.color = "black"
        document.querySelector('audio').play()
    })
    document.querySelector('#pause').addEventListener('click', function(){
        document.querySelector('#play').style.color = "black"
        document.querySelector('#pause').style.color = "rgb(35, 255, 35)"
        document.querySelector('audio').pause()
    })
 }