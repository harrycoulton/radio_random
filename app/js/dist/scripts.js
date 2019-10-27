document.querySelector('.findRadio').addEventListener('submit', function(e){
    e.preventDefault();
    runSearch(document.querySelector('.searchTerm').value)
})

async function runSearch(searchTerm){
    let data = await searchAllStations(searchTerm);
    let search = []
    data.forEach(element => {
        if (element.tags == searchTerm) {
            search.push(element)
        }
        console.log(search[Math.floor(Math.random()*search.length)])
        // [Math.floor(Math.random()*data.length)]
        // 
    });
    }

async function searchAllStations(search) {
    let data = await fetch('http://www.radio-browser.info/webservice/json/stations/bytag/'+search)
    data = await data.json()
    return await data
}
