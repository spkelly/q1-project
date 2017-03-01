$('document').ready(() => {
  'use strict';

  // ============================= FUNCTIONS =============================== //

  // THIS FUNCTION NEEDS SOME WORK
  // TODO: create searhResults bill object with relevent data
  // TODO: Push that data into the results array
  const initSearchResults = () => {
    const billResults = [];

    if ($nameInput.val()) {
      options+=$nameInput.val();
      $.ajax({
        method: 'GET',
        url: (apiURL + apiKey + options),
        success: function(data) {
          const results = data.searchresult;

          for (let bill in results) {
            if (bill !== 'summary') {
              billResults.push(results[bill]);
            }
          }
          buildSearchCollection(billResults);
        },
        error: function(data) {
          console.log('Error');
        }
      })
    }
  };
  const makeCollectionItem = (billItem) => {
    const item = $('<a class="collection-item model-trigger">');
    const rowDiv = $('<div class="row">');
    const billHeader = $('<h5 class=" col l6 m6 s6 sr-BillName">');
    const subList = $('<ul>');
    const lastAction = $('<li class="sr-lastAction">');
    const billNumber = $('<li class="sr-billNumber">');

    // Modal stuff
    const billModal =$('<div>').addClass('modal');
    billModal.attr('id',`${billItem.bill_id}`);
    const modalContent = $('<div>').addClass('modal-content');

    billModal.append(modalContent);

    lastAction.text(`Last Action:  [${billItem.last_action_date}] - ${billItem.last_action}`);
    billNumber.text(`Bill Number: ${billItem.bill_number}`);
    billHeader.text(billItem.title);

    subList.append(billNumber, lastAction);
    rowDiv.append(billHeader, subList);
    item.append(rowDiv, billModal);
    item.attr('href', `#${billItem.bill_id}`);
    billModal.modal();

    return item;
  };
  const buildSearchCollection = (results) => {
    const resultsContainer = $('#results .container');
    const collection = $('<ul class="collection"></ul>');

    resultsContainer.empty();
    resultsContainer.append(collection);

    for (let i = 0; i < results.length; i++) {
      const collectionItem = makeCollectionItem(results[i]);
      collection.append(collectionItem);
      let billModal = collectionItem.children('div[class=modal]');
      console.log('the bill modal',billModal);
      // add event listener to each bill button
      // make an ajax call to get bill information
      collectionItem.click(function(e) {
        e.preventDefault();
        console.log(`${collectionItem}: Has been clicked`);
        // call a function to get a
        $.ajax({
          method: 'GET',
          url: `https://api.legiscan.com/?key=6a2d12a9259d0c661bf3add8d58cd236&op=getBill&id=${billModal.attr('id')}`,
          success: function(data) {
            let bill = createBill(data.bill);
            console.log(bill);
            populateModal(billModal.children('div[class=modal-content]'), bill);
          },
          error: function(data) {
            console.log('Error');
          }
        });
      });
    }

    // adding models to collection item
  };
  const createBill = (billData) => {
    let bill = {};

    bill.title = billData.title;
    bill.subject = billData.subjects.subject_name;
    bill.status = billData.status;
    bill.desc = billData.description;
    bill.billNum = billData.bill_number;
    bill.billId = billData.bill_id;
    bill.sponsors = [];
    bill.calandar = [];
    bill.votes = [];
    bill.textUrl = billData.texts[0].state_link;
    bill.history = [];

    for(var i = 0; i < billData.sponsors.length; i++){
      let currSponsor = billData.sponsors[i];
      console.log("the current sponsor", currSponsor);
      let person = {};
      person.name = currSponsor.name;
      person.role = currSponsor.role;
      person.party = currSponsor.party;
      person.ftmId = currSponsor.ftm_eid;
      person.url = currSponsor.ballotpedia;

      bill.sponsors.push(person);
    }
    return bill;
  };

  const populateModal = (modalContent, billData) => {

    // remove previous modal elements
    modalContent.empty();
    modalContent.click(function(e){
      e.stopPropagation();
    });

    const modalHeader = $('<h5>');
    const buttonContainer = $('<div>').attr('class', 'container');
    const exitButton = $('<button>').addClass('btn').text('EXIT');
    const fullTextLink = $('<a>').text('Full Text').attr({
      href: billData.textUrl,
      class: 'btn'
    });

    modalHeader.text(billData.title);
    modalContent.append(modalHeader, '<hr>');

    buttonContainer.append(exitButton, fullTextLink);
    modalContent.append(buttonContainer);

    exitButton.click(function(){
      modalContent.parent().modal('close');
    })
  };

  // ========================= PROGRAM STARTS HERE ======================== //

  // HTML ELEMENT declarations
  const $nameInput = $('#name-input');
  const $idInput = $('#id-input');
  const $searchButton = $('button[type="submit"]');

  // api info
  const apiURL = 'https://api.legiscan.com/?';
  const apiKey = 'key=6a2d12a9259d0c661bf3add8d58cd236&op';
  let options = '&op=search&state=CO&query=';

  // console.log($searchButton,$nameInput,$idInput);

  $searchButton.click((e) => {
    e.preventDefault();
    initSearchResults();
    //console.log("the search results", searchResults);
  });
});
