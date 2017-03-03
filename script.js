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
      console.log("the ajax URL: ",apiURL + apiKey + options);
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
      });
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
    const billModal = $('<div>').addClass('modal');
    const modalContent = $('<div>').addClass('modal-content');

    billModal.attr('id', `${billItem.bill_id}`);
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
  const makebillDetails = (billData) => {
    let row = $('<div>').addClass('row');
    let sponsorCol = $('<div>').addClass('col l6 m6 s12');
    let billCol = $('<div>').addClass('col l6 m6 s12');

    let billNumber = $('<p>').text('Bill Number: '+ billData.billNum)
    let committee =$('<p>');
    if(billData.committee.name){
      committee.text(`Commitee: ${billData.committee.name}`);
    }
    else {
      committee.text(`Commitee: None `);
    }

    let sponsorTitle = $('<h5>').text("Bill sponsors")
    sponsorCol.append(sponsorTitle);
    for (let i = 0; i < billData.sponsors.length; i++) {
      const sponsorElement = $('<a>').attr({
        class: 'col l12 m12 s12',
        href: `https://ballotpedia.org/${billData.sponsors[i].url}`,
        target: '_blank'
      });

      sponsorElement.text(`${billData.sponsors[i].role}. ${billData.sponsors[i].name} -- ${billData.sponsors[i].party}`);
      sponsorCol.append(sponsorElement);
    }

    billCol.append('<h5>Details</h5>',billNumber,committee);
    row.append(sponsorCol,billCol)
    return row;
  }
  const buildSearchCollection = (results) => {
    const resultsContainer = $('#results .container');
    const collection = $('<ul class="collection z-depth-3"></ul>');

    resultsContainer.empty();
    resultsContainer.append(collection);

    for (let i = 0; i < results.length; i++) {
      const collectionItem = makeCollectionItem(results[i]);
      const billModal = collectionItem.children('div[class=modal]');

      collection.append(collectionItem);

      // add event listener to each bill button
      // make an ajax call to get bill information
      collectionItem.click((e) => {
        e.preventDefault();

        // call a function to get bill details
        $.ajax({
          method: 'GET',
          url: `https://api.legiscan.com/?key=6a2d12a9259d0c661bf3add8d58cd236&op=getBill&id=${billModal.attr('id')}`,
          success: function(data) {
            let bill = createBill(data.bill);

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

      trow.append(date, type, desc);
      body.append(trow);
    }
    table.append(body);

    return table;
  };
  const buildVotes = (voteData) => {
    let voteTable = $('<table>').addClass('bordered');
    let header =$('<thead>');
    let headerRow = $('<tr>');
    let body = $('<tbody>');

    headerRow.append('<th>Date</th>', '<th>Passed</th>, <th>Description</th>');
    header.append(headerRow);
    voteTable.append(header);
    for (let i = 0; i < voteData.length; i++) {
      let trow = $('<tr>').attr('class','white-text');
      let voteEvent = voteData[i];
      let date = $('<td>').text(`${voteEvent.date}`);
      let desc = $('<td>').text(`${voteEvent.desc}`);
      var passed;

      if (voteEvent.passed === 1) {
        passed = $('<td>').text('passed');

        trow.addClass('green lighten-1');
      }
      else {
        passed = $('<td>').text('not passed');

        trow.addClass('red lighten-1');
      }
      trow.append(date, passed, desc);
      body.append(trow);
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
    bill.committee = billData.committee;
    bill.calendar = billData.calendar;
    bill.votes = billData.votes;
    bill.textUrl = billData.texts[0].state_link;
    bill.history = [];

    for (let i = 0; i < billData.sponsors.length; i++) {
      let currSponsor = billData.sponsors[i];
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
  const createHistory = () =>{
    const table = $('<table>');
    return table;
  }
  const mapBillStatus = (statusNum) => {
    const status = $('<p>');

    switch (statusNum) {
      case 1:
        status.text('Status: Introduced').addClass('introduced');
        break;
      case 2:
        status.text('Status: Engrossed').addClass('engrossed');
        break;
      case 3:
        status.text('Status: Enrolled').addClass('signed');
        break;
      case 4:
        status.text('Status: Signed').addClass('signed');
        break;
      case 5:
        status.text('Status: Vetoed').addClass('failed');
        status.attr('color', 'red');
        break;
      case 6:
        status.text('Status: Failed').addClass('failed');
        break;
      default:
        status.text('Status: Unknown');
        status.attr('color', 'grey');
    }

    return status;
  };
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
    const firstRowDiv = makebillDetails(billData);
    const buttonContainer = $('<div>').attr('class', 'button-container');
    const exitButton = $('<button>').addClass('btn').text('EXIT');
    const fullTextLink = $('<a>').text('Full Text').attr({
      href: billData.textUrl,
      target: "_blank",
      class: 'btn white-text'
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

    // calendar

    const descHeader = $('<div>').addClass('collapsible-header').text('Description');
    const descBody = $('<div>').addClass('collapsible-body').text(billData.desc);
    const schedule = buildScheduleTable(billData.calendar);
    const votes = buildVotes(billData.votes);
    const schedHeader = $('<div>').addClass('collapsible-header').text('Schedule');
    const schedBody = $('<div>').addClass('collapsible-body');
    const voteHeader = $('<div>').addClass('collapsible-header').text('Votes');
    const voteBody = $('<div>').addClass('collapsible-body');

    schedBody.append(schedule);
    voteBody.append(votes);

    descCollapse.append(descHeader, descBody);
    schedCollapse.append(schedHeader, schedBody);
    voteCollapse.append(voteHeader, voteBody);

    details.append(descCollapse, schedCollapse, voteCollapse);

    modalHeader.text(billData.title);
    modalContent.append(modalHeader, billStatus, '<hr>');
    detailRowDiv.append(details);

    buttonContainer.append(exitButton, fullTextLink);
    modalContent.append(firstRowDiv, detailRowDiv, buttonContainer);

    exitButton.click(() => {
      modalContent.parent().modal('close');
    });
    $(details).collapsible();
  };

  // ========================= PROGRAM STARTS HERE ======================== //

  // HTML ELEMENT declarations
  const $nameInput = $('#name-input');
  const $searchButton = $('button[type="submit"]');

  // api info
  const apiURL = 'https://api.legiscan.com/?';
  const apiKey = 'key=6a2d12a9259d0c661bf3add8d58cd236&op';
  let options = '&op=search&state=CO&query=';

  // console.log($searchButton,$nameInput,$idInput);

  $('.option').click((e) => {
    const tempText = $(e.target).text();

    $('.dropdown-button').text(tempText);
  });

  $searchButton.click((e) => {
    e.preventDefault();
    $('#main').animate({
      height: '150'
    }, 500);
    $('#title-text').fadeOut();

    // reset search options
    options = '&op=search&state=CO&query=';
    initSearchResults();
    $('#flavor-section').hide();

    // console.log("the search results", searchResults);
  });
});
