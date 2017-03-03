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
  const buildScheduleTable = (schedule) => {
    let table = $('<table>').addClass('bordered');
    let header =$('<thead>');
    let headerRow = $('<tr>');
    let body = $('<tbody>');
    headerRow.append('<th>Date</th>', '<th>Type</th>, <th>Description</th>');
    header.append(headerRow);
    table.append(header);
    for (var i = 0; i < schedule.length; i++) {
      let trow = $('<tr>');
      let event = schedule[i];
      let date = $('<td>').text(`${event.date} at ${event.time}`);
      let type = $('<td>').text(`${event.type}`);
      let desc = $('<td>').text(`${event.description}`);
      trow.append(date,type,desc);
      body.append(trow);
    }
    table.append(body);
    console.log( 'the table: ',table);

    return table;
  };
  const buildVotes = (voteData) => {
    console.log(voteData);
    let voteTable = $('<table>').addClass('bordered');
    let header =$('<thead>');
    let headerRow = $('<tr>');
    let body = $('<tbody>');
    headerRow.append('<th>Date</th>', '<th>Passed</th>, <th>Description</th>');
    header.append(headerRow);
    voteTable.append(header);
    for (var i = 0; i < voteData.length; i++) {
      let trow = $('<tr>').attr('class','white-text');
      let voteEvent = voteData[i];
      let date = $('<td>').text(`${voteEvent.date}`);
      if(voteEvent.passed === 1){
        var passed = $('<td>').text(`passed`);
        trow.addClass('green');
      }
      else{
        var passed = $('<td>').text(`not passed`);
        trow.addClass('red');
      }
      let desc = $('<td>').text(`${voteEvent.desc}`);
      trow.append(date,passed,desc);
      body.append(trow);
      console.log(voteEvent);
    }
    voteTable.append(body);
    return voteTable;
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
    bill.calendar = billData.calendar;
    bill.votes = billData.votes;
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
  const mapBillStatus =(statusNum) =>{
    let status = $('<p>');
    switch (statusNum) {
      case 1:
        status.text('Status: Introduced').addClass('introduced');
        break;
      case 2:
        status.text('Status: Engrossed').addClass('engrossed');
        status.attr('color', 'yellow');
        break;
      case 6:
        status.text('Status: Failed').addClass('failed');
        status.attr('color', 'red');
        break;
      default:
      status.text('Status: Unknown');
      status.attr('color', 'grey');
    }
    return status;
  }
  const populateModal = (modalContent, billData) => {
    // remove previous modal elements
    modalContent.empty();

    // prevents clicking on the modal from calling the function again
    modalContent.click((e) => {
      e.stopPropagation();
    });

    // Creates modal HTML elements
    const modalHeader = $('<h5>');
    const detailRowDiv = $('<div>').addClass('row');
    const firstRowDiv = $('<div>').addClass('row');
    const buttonContainer = $('<div>').attr('class', 'container');
    const exitButton = $('<button>').addClass('btn').text('EXIT');
    const fullTextLink = $('<a>').text('Full Text').attr({
      href: billData.textUrl,
      class: 'btn'
    });
    const billStatus = mapBillStatus(billData.status);

    // Creates details collapsible
    const details = $('<ul>').attr({
      'class': 'collapsible',
      'data-collapsible': 'expandable'
    });

    let descCollapse = $('<li>');
    let schedCollapse = $('<li>');
    let voteCollapse = $('<li>');

    // sponsors

    for (var i = 0; i < billData.sponsors.length; i++) {
      let sponsorElement = $('<a>').attr({
        class: 'col l12 m12 s12',
        href: `https://ballotpedia.org/${billData.sponsors[i].url}`
      });
      sponsorElement.text(`${billData.sponsors[i].role} ${billData.sponsors[i].name} -- ${billData.sponsors[i].party}`);
      firstRowDiv.append(sponsorElement);
    }
    // console.log(billData.desc);
    // calendar

    let sched = buildScheduleTable(billData.calendar);
    let votes = buildVotes(billData.votes);
    let descHeader = $('<div>').addClass('collapsible-header').text('Description');
    let descBody = $('<div>').addClass('collapsible-body').text(billData.desc);

    let schedHeader = $('<div>').addClass('collapsible-header').text('Schedule');
    let schedBody = $('<div>').addClass('collapsible-body');
    schedBody.append(sched);

    let voteHeader = $('<div>').addClass('collapsible-header').text('Votes');
    let voteBody = $('<div>').addClass('collapsible-body');

    voteBody.append(votes);

    descCollapse.append(descHeader, descBody);
    schedCollapse.append(schedHeader, schedBody);
    voteCollapse.append(voteHeader, voteBody);

    details.append(descCollapse, schedCollapse, voteCollapse);
    $(details).collapsible();
    modalHeader.text(billData.title);
    modalContent.append(modalHeader, billStatus, '<hr>');
    detailRowDiv.append(details);

    buttonContainer.append(exitButton, fullTextLink);
    modalContent.append(firstRowDiv, detailRowDiv, buttonContainer);

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

  $('.option').click((e)=>{
    console.log($(e.target).text());
    let tempText = $(e.target).text();
    $('.dropdown-button').text(tempText);
    console.log($(e.target).data());
  })

  $searchButton.click((e) => {
    $("#main").animate({
      "height" : "150"
     }, 500);
     $('#title-text').fadeOut();

    // reset search options
    options = '&op=search&state=CO&query=';
    e.preventDefault();
    initSearchResults();
    $('#flavor-section').hide();
    //console.log("the search results", searchResults);
  });
});
