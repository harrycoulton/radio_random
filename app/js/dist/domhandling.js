document.querySelector('.findRadio').addEventListener('submit', function(e){
    e.preventDefault();
    runSearch(document.querySelector('.searchTerm').value)
})