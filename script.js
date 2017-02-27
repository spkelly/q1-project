$('document').ready(() => {
  'use strict';

  const initSearchResults = (billResults) => {
    console.log(billResults);
  }

  const $nameInput = $('#name-input');
  const $idInput = $('#id-input');
  const $searchButton = $('button[type="submit"]');

  console.log($searchButton,$nameInput,$idInput);

  $searchButton.click((e) => {
    e.preventDefault();
    if ($nameInput.val() || $idInput.val()) {
      $.ajax({
        method: 'GET',
        url:`https://api.legiscan.com/?key=6a2d12a9259d0c661bf3add8d58cd236&op=getBill&id=976525`,
        success: function(data){
          initSearchResults(data);
          console.log(data);
        },
        error: function(data){
          console.log('Error');
        }
      })
    }
  })

  // const baseURL = `https://api.legiscan.com/?key=${apiKey}`;
  // const testHeader = $('<h1></h1>');
  // const body = $('body');
  //
  // testHeader.text(baseURL);
  // body.append(testHeader);
});
