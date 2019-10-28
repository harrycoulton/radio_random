document.querySelector('.findRadio').addEventListener('submit', function(e){
    e.preventDefault();
    searchDestroy()
})

function searchDestroy() {
    runSearch(document.querySelector('.searchTerm').value)
    setTimeout(function(){
        var myAudio = document.querySelector('audio')
        if (myAudio.duration > 0 && !myAudio.paused) {
        } else {
            searchDestroy()
        } 
    }, 4500)
    }