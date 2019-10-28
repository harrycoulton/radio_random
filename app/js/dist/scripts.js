document.querySelector('.findRadio').addEventListener('submit', function(e){
    e.preventDefault();
    runSearch(document.querySelector('.searchTerm').value)
})

async function runSearch(searchTerm){
    let data = await searchAllStations(searchTerm);
    let search = []
    data.forEach(element => {
        if (element.tags == searchTerm || element.name) {
            search.push(element)
        }
    })
    let result = search[Math.floor(Math.random()*data.length)]
    document.querySelector('.url').innerHTML = '<a href="'+result.homepage+'" target="_blank">'+result.homepage+'</a><br><ul><li>'+result.name+'</li><li>'+result.tags+'</li>'
    }

async function searchAllStations(search) {
    let data = await fetch('http://www.radio-browser.info/webservice/json/stations/bytag/'+search)
    data = await data.json()
    return await data
}
