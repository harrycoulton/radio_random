document.querySelector('.findRadio').addEventListener('submit', function(e){
    e.preventDefault();
    runSearch(document.querySelector('.searchTerm').value)
    setTimeout(function(){
        var myAudio = document.querySelector('audio')
        if (myAudio.duration > 0 && !myAudio.paused) {
            
        } else {
            runSearch(document.querySelector('.searchTerm').value)
        } 
    }, 4500)
})