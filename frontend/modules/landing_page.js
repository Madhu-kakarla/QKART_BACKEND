import config from "../conf/index.js";

async function init() {
  //Fetches list of all cities along with their images and description
  let cities = await fetchCities();

  //Updates the DOM with the cities
  if (cities) {
    cities.forEach((key) => {
      addCityToDOM(key.id, key.city, key.description, key.image);
    });
  }
}

//Implementation of fetch call
async function fetchCities() {
  // TODO: MODULE_CITIES
  // 1. Fetch cities using the Backend API and return the data
  try{
    let cities = await fetch(`${config.backendEndpoint}/cities`)
    return await cities.json()
  }
  catch(err) {
    return null
  }

}

//Implementation of DOM manipulation to add cities
function addCityToDOM(id, city, description, image) {
  // TODO: MODULE_CITIES
  // 1. Populate the City details and insert those details into the DOM
  city = city.toLowerCase()
  let divEle = document.createElement('div')
  divEle.setAttribute('class', 'col-sm-6 col-md-4 col-lg-3 mb-3')
  // let cardDiv = document.createElement('div')
  // cardDiv.setAttribute('class', 'card tile')

  let link = document.createElement('a')
  link.setAttribute('href', `pages/adventures/?city=${city}`)
  link.setAttribute('id', city)
  link.setAttribute('class', 'tile')

  let imgEle = document.createElement('img')
  imgEle.setAttribute('src', image)
  imgEle.setAttribute('alt', city)

  let h5Ele = document.createElement('h5')
  h5Ele.setAttribute('class', 'tile-text')
  h5Ele.textContent = city

  let pEle = document.createElement('p')
  pEle.setAttribute('class', 'tile-text')
  pEle.textContent = description

  link.append(imgEle)
  link.append(h5Ele)
  link.append(pEle)

  divEle.append(link)
  document.getElementById('data').append(divEle)

}

export { init, fetchCities, addCityToDOM };
