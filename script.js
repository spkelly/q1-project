$('document').ready(() => {
  'use strict';

  // ============================= FUNCTIONS =============================== //
  const fakeAjaxCall = () => {
    const billTestData = {
      'status': 'OK',
      'searchresult': {
        '0': {
          'relevance': 100,
          'state': 'CO',
          'bill_number': 'SB135',
          'bill_id': 940087,
          'change_hash': 'a619d62a1dd63b76eb797e689ac08f12',
          'url': 'https://legiscan.com/CO/bill/SB135/2017',
          'text_url': 'https://legiscan.com/CO/text/SB135/2017',
          'research_url': 'https://legiscan.com/CO/research/SB135/2017',
          'last_action_date': '2017-02-24',
          'last_action': 'Senate Third Reading Laid Over Daily - No Amendments',
          'title': 'Remove Medical Release Requirement For Animal Chiropractic'
        },
        '1': {
          'relevance': 99,
          'state': 'CO',
          'bill_number': 'HB1179',
          'bill_id': 949292,
          'change_hash': 'cd9b1983c123546d5297db525cfbdca8',
          'url': 'https://legiscan.com/CO/bill/HB1179/2017',
          'text_url': 'https://legiscan.com/CO/text/HB1179/2017',
          'research_url': 'https://legiscan.com/CO/research/HB1179/2017',
          'last_action_date': '2017-02-23',
          'last_action': 'House Committee on Health, Insurance, & Environment Refer Amended to House Committee of the Whole',
          'title': 'Immunity For Emergency Rescue From Locked Vehicle'
        },
        '2': {
          'relevance': 98,
          'state': 'CO',
          'bill_number': 'SB109',
          'bill_id': 936273,
          'change_hash': '99cf1644783d5c5eec89679535249fc3',
          'url': 'https://legiscan.com/CO/bill/SB109/2017',
          'text_url': 'https://legiscan.com/CO/text/SB109/2017',
          'research_url': 'https://legiscan.com/CO/research/SB109/2017',
          'last_action_date': '2017-02-16',
          'last_action': 'Introduced In House - Assigned to Agriculture, Livestock, & Natural Resources',
          'title': 'Industrial Hemp Animal Feed'
        },
        '3': {
          'relevance': 96,
          'state': 'CO',
          'bill_number': 'SB030',
          'bill_id': 908821,
          'change_hash': 'abcf4abac97027e6b795f05d1f30091b',
          'url': 'https://legiscan.com/CO/bill/SB030/2017',
          'text_url': 'https://legiscan.com/CO/text/SB030/2017',
          'research_url': 'https://legiscan.com/CO/research/SB030/2017',
          'last_action_date': '2017-02-06',
          'last_action': 'Introduced In House - Assigned to Agriculture, Livestock, & Natural Resources',
          'title': 'Exempt Injectable Anabolic Steroids For Cattle'
        },
        '4': {
          'relevance': 93,
          'state': 'CO',
          'bill_number': 'SB146',
          'bill_id': 940119,
          'change_hash': '21b03d0fe71e44efc9dd0df96bce5f2b',
          'url': 'https://legiscan.com/CO/bill/SB146/2017',
          'text_url': 'https://legiscan.com/CO/text/SB146/2017',
          'research_url': 'https://legiscan.com/CO/research/SB146/2017',
          'last_action_date': '2017-02-22',
          'last_action': 'Senate Second Reading Laid Over to 02/27/2017 - No Amendments',
          'title': 'Access To Prescription Drug Monitoring Program'
        },
        '5': {
          'relevance': 87,
          'state': 'CO',
          'bill_number': 'HB1008',
          'bill_id': 908813,
          'change_hash': '1915efd3bcbba47474f213124ffffdf8',
          'url': 'https://legiscan.com/CO/bill/HB1008/2017',
          'text_url': 'https://legiscan.com/CO/text/HB1008/2017',
          'research_url': 'https://legiscan.com/CO/research/HB1008/2017',
          'last_action_date': '2017-01-11',
          'last_action': 'Introduced In House - Assigned to Agriculture, Livestock, & Natural Resources',
          'title': 'Graywater Regulation Exemption For Scientific Research'
        },
        '6': {
          'relevance': 85,
          'state': 'CO',
          'bill_number': 'HB1171',
          'bill_id': 948176,
          'change_hash': '40c9d7d98e6ac1927d92b185d28e1e7a',
          'url': 'https://legiscan.com/CO/bill/HB1171/2017',
          'text_url': 'https://legiscan.com/CO/text/HB1171/2017',
          'research_url': 'https://legiscan.com/CO/research/HB1171/2017',
          'last_action_date': '2017-02-06',
          'last_action': 'Introduced In House - Assigned to State, Veterans, & Military Affairs + Finance + Appropriations',
          'title': 'Authorize New Transportation Revenue Anticipation Notes'
        },
        '7': {
          'relevance': 69,
          'state': 'CO',
          'bill_number': 'SB056',
          'bill_id': 913437,
          'change_hash': '8af67798a1bae39a37a75abbf5e959ee',
          'url': 'https://legiscan.com/CO/bill/SB056/2017',
          'text_url': 'https://legiscan.com/CO/text/SB056/2017',
          'research_url': 'https://legiscan.com/CO/research/SB056/2017',
          'last_action_date': '2017-02-24',
          'last_action': 'House Second Reading Passed with Amendments - Committee',
          'title': 'Reporting Requirements By Colorado Department Of Public Health And Environment To General Assembly'
        },
        'summary': {
          'page': '1 of 1',
          'range': '1 - 8',
          'relevancy': '100% - 69%',
          'count': 8,
          'page_current': 1,
          'page_total': 1,
          'query': '(animal:(pos=1))'
        }
      }
    }

    return billTestData;
  };

  // THIS FUNCTION NEEDS SOME WORK
  // TODO: create searhResults bill object with relevent data
  // TODO: Push that data into the results array
  const initSearchResults = () => {
    const billResults = [];
    const testResults = fakeAjaxCall();

    if ($nameInput.val() || $idInput.val()) {
      const results = testResults.searchresult;

      for (let bill in results) {
        console.log(bill);
        if (bill !== 'summary') {
          billResults.push(results[bill]);
        }
      }
      console.log(billResults);

      // $.ajax({
      //   method: 'GET',
      //   url: (apiURL + apiKey + options),
      //   success: function(data) {
      //     console.log(JSON.stringify(data));
      //   },
      //   error: function(data) {
      //     console.log('Error');
      //   }
      // })
    }

    return billResults;
  };
  const makeCollectionItem = (billItem) => {
    const item = $('<a class="collection-item model-trigger">');
    const rowDiv = $('<div class="row"></div>');
    const billHeader = $('<h5 class=" col l6 m6 s6 sr-BillName"></h5>');
    const subList = $('<ul></ul');
    const lastAction = $('<li class="sr-lastAction"></li>');
    const billNumber = $('<li class="sr-billNumber"></li>');

    const billModal =$('<div>').addClass('modal');

    billModal.attr('id',`${billItem.bill_id}`);
    const modalContent = $('<div>').addClass('modal-content');
    const modalHeader = $('<h4>').text(`${billItem.title}`);
    const modalBody = $('<p>').text(`${billItem.bill_number}`);

    modalContent.append(modalHeader, modalBody);
    billModal.append(modalContent);

    lastAction.text(`Last Action:  [${billItem.last_action_date}] - ${billItem.last_action}`);
    billNumber.text(`Bill Number: ${billItem.bill_number}`);
    billHeader.text(billItem.title);

    subList.append(billNumber);
    subList.append(lastAction);
    rowDiv.append(billHeader);
    rowDiv.append(subList);
    item.append(rowDiv);
    item.append(billModal);
    item.attr('href',`#${billItem.bill_id}`);
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
      collectionItem.click(function(){
        console.log(`${collectionItem}: Has been clicked`);
      });
    }

    // adding models to collection item
  };

  // ========================= PROGRAM STARTS HERE ======================== //

  // HTML ELEMENT declarations
  const $nameInput = $('#name-input');
  const $idInput = $('#id-input');
  const $searchButton = $('button[type="submit"]');

  // api info
  const apiURL = 'https://api.legiscan.com/?';
  const apiKey = 'key=6a2d12a9259d0c661bf3add8d58cd236&op';
  let options = '&op=';

  options += 'search&state=CO&query=Animal';

  // console.log($searchButton,$nameInput,$idInput);

  $searchButton.click((e) => {
    e.preventDefault();
    const searchResults = initSearchResults();

    buildSearchCollection(searchResults);

  });
});
