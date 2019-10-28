async function runSearch(searchTerm){
    let data = await searchAllStations(searchTerm);
    let search = []
    data.forEach(element => {
        if (element.tags == searchTerm || element.name && element.codec == 'MP3') {
            search.push(element)
        }
    })
    let result = search[Math.floor(Math.random()*data.length)]
    console.log(result)
    await populateHandlebars('.url', 'js/templates/audio.hbs', result)
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
