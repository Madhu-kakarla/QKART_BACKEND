
import config from "../conf/index.js";

//Implementation to extract city from query params
function getCityFromURL(search) {
  // TODO: MODULE_ADVENTURES
  // 1. Extract the city id from the URL's Query Param and return it
  let queryParam = new URLSearchParams(search)
  return queryParam.get('city')

}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data
  try {
    let parsedCity = city.replace(/\s+/g, '-')
    let adventures = await fetch(`${config.backendEndpoint}/adventures/?city=${parsedCity}`)
    return await adventures.json()
  }
  catch(err) {
    return null
  }
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures, option = '') {
  // TODO: MODULE_ADVENTURES
  // 1. Populate the Adventure Cards and insert those details into the DOM

  let adventureSection = document.getElementById('data')
  if(option === 'replace'){
    adventureSection.innerHTML = ""
  }
  adventures.forEach((adv) => {
    let { id, category, image, name, costPerHead, duration } = adv
    let advParent = document.createElement('div')
    advParent.setAttribute('class', 'col-sm-6 col-md-4 col-lg-3 mb-3')
    
    let advCard = document.createElement('div')
    advCard.setAttribute('class','card')
    
    let link = document.createElement('a')
    link.setAttribute('href', `detail/?adventure=${id}`)
    link.setAttribute('class', 'activity-card')
    link.setAttribute('id', id)

    let activityImage = document.createElement('img')
    activityImage.setAttribute('src', image)
    activityImage.setAttribute('alt', name)

    let banner = document.createElement('p')
    banner.setAttribute('class', 'category-banner')
    banner.textContent = category

    let footer1Ele = document.createElement('div')
    footer1Ele.setAttribute('class', 'd-flex justify-content-between w-100 px-1')
    
    let footerP1Ele = document.createElement('p')
    footerP1Ele.textContent = name

    let footerP2Ele = document.createElement('p')
    footerP2Ele.textContent = `₹${costPerHead}`

    let footer2Ele = document.createElement('div')
    footer2Ele.setAttribute('class', 'd-flex justify-content-between w-100 px-1')
    
    let footer2P1Ele = document.createElement('p')
    footer2P1Ele.textContent = 'Duration'

    let footer2P2Ele = document.createElement('p')
    footer2P2Ele.textContent = `₹${duration}`

    footer1Ele.append(footerP1Ele)
    footer1Ele.append(footerP2Ele)

    footer2Ele.append(footer2P1Ele)
    footer2Ele.append(footer2P2Ele)

    link.append(activityImage)
    link.append(banner)
    link.append(footer1Ele)
    link.append(footer2Ele)

    advCard.append(link)
    advParent.append(advCard)
    adventureSection.append(advParent)
  })

}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list
  return list.filter(ele => (ele.duration >= low && ele.duration <= high))
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list
  return list.filter(ele => categoryList.includes(ele.category))
}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  // TODO: MODULE_FILTERS
  // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures
  // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods
  let filteredList = list;

  if(filters.category.length !== 0 && filters.duration !== '') {
    let dur = filters.duration.split('-')
    filteredList = list.filter(ele => filters.category.includes(ele.category) && (ele.duration >= dur[0] && ele.duration <= dur[1]))
  } else if(filters.category.length !== 0) {
    filteredList = filterByCategory(list, filters.category)
  } else if(filters.duration !== '') {
    let duration = filters.duration.split('-')
    filteredList = filterByDuration(list, duration[0], duration[1])
  }

  // Place holder for functionality to work in the Stubs
  return filteredList;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Store the filters as a String to localStorage
  localStorage.setItem('filters', JSON.stringify(filters))
  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  // TODO: MODULE_FILTERS
  // 1. Get the filters from localStorage and return String read as an object


  // Place holder for functionality to work in the Stubs
  return JSON.parse(localStorage.getItem('filters'));
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // TODO: MODULE_FILTERS
  // 1. Use the filters given as input, update the Duration Filter value and Generate Category Pills
  filters.category.forEach((category) => {
    let divEle = document.createElement('div')
    divEle.setAttribute('class','parent-filter')
    let pEle = document.createElement('p')
    pEle.setAttribute('class', 'category-filter')
    pEle.textContent = category

    let removeButton = document.createElement('button')
    removeButton.setAttribute('class', 'btn btn-danger remove-button float-end')
    removeButton.setAttribute('id', category)
    removeButton.textContent = 'X'

    divEle.append(pEle)
    divEle.append(removeButton)

    document.getElementById('category-list').append(divEle)
  })
}

async function addNewAdventure(data = {}) {
  try {
    const response = await fetch(`${config.backendEndpoint}/adventures/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#add-adventure').addEventListener('click', function(event) {
    let params = new URLSearchParams(window.location.search)
    let parsedCity = params.get('city').replace(/\s+/g, '-')
    addNewAdventure({ city: parsedCity || 'goa'})
  })
})

export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};
