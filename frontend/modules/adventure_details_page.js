import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Get the Adventure Id from the URL
  let params = new URLSearchParams(search)

  // Place holder for functionality to work in the Stubs
  return params.get('adventure');
}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Fetch the details of the adventure by making an API call
  try{
    let advDetail = await fetch(`${config.backendEndpoint}/adventures/detail?adventure=${adventureId}`)
    // Place holder for functionality to work in the Stubs
    return await advDetail.json();
  }
  catch(err) {
    return null;
  }
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the details of the adventure to the HTML DOM
  document.querySelector('#adventure-name').textContent = adventure.name
  document.querySelector('#adventure-subtitle').textContent = adventure.subtitle
  adventure.images.forEach((imageUrl) => {
    let image = document.createElement('img')
    image.setAttribute('class', 'activity-card-image')
    image.setAttribute('src', imageUrl)
    image.setAttribute('alt', adventure.name)
    document.querySelector('#photo-gallery').append(image)
  })
  document.querySelector('#adventure-content').textContent = adventure.content
}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the bootstrap carousel to show the Adventure images
  document.querySelector('#photo-gallery').innerHTML = ''
  let carouselDiv = document.createElement('div')
  carouselDiv.setAttribute('id', 'adventureDetailCarousel')
  carouselDiv.setAttribute('class', 'carousel slide')
  carouselDiv.setAttribute('data-bs-ride', 'carousel')

  let carouselIndicators = document.createElement('div')
  carouselIndicators.setAttribute('class','carousel-indicators')

  for(let i = 0; i < images.length; i++){
    let slideBtn = document.createElement('button')
    slideBtn.setAttribute('type', 'button')
    slideBtn.setAttribute('data-bs-target', '#adventureDetailCarousel')
    slideBtn.setAttribute('data-bs-slide-to', i)
    slideBtn.setAttribute('aria-label', `Slide ${i}`)
    if(i == 0) {
      slideBtn.setAttribute('class', 'active')
      slideBtn.setAttribute('aria-current', 'true')
    }
    carouselIndicators.append(slideBtn)
  }

  let carouselInner = document.createElement('div')
  carouselInner.setAttribute('class', 'carousel-inner')

  images.forEach((image, index) => {
    let carouselItem = document.createElement('div')
    if(index === 0){
      carouselItem.setAttribute('class', 'carousel-item active')
    } else {
      carouselItem.setAttribute('class', 'carousel-item')
    }
    let carouselImg = document.createElement('img')
    carouselImg.setAttribute('src', image)
    carouselImg.setAttribute('alt', 'Carousel Image')
    carouselImg.setAttribute('class', 'activity-card-image')
    carouselItem.append(carouselImg)
    carouselInner.append(carouselItem)
  })

  let caroPrevCtrl = document.createElement('button')
  caroPrevCtrl.setAttribute('type', 'button')
  caroPrevCtrl.setAttribute('class', 'carousel-control-prev')
  caroPrevCtrl.setAttribute('data-bs-target', '#adventureDetailCarousel')
  caroPrevCtrl.setAttribute('data-bs-slide', 'prev')
  caroPrevCtrl.innerHTML = `
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    `
  let caroNextCtrl = document.createElement('button')
  caroNextCtrl.setAttribute('type', 'button')
  caroNextCtrl.setAttribute('class', 'carousel-control-next')
  caroNextCtrl.setAttribute('data-bs-target', '#adventureDetailCarousel')
  caroNextCtrl.setAttribute('data-bs-slide', 'next')
  caroNextCtrl.innerHTML = `
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  `

  carouselDiv.append(carouselIndicators)
  carouselDiv.append(carouselInner)
  carouselDiv.append(caroPrevCtrl)
  carouselDiv.append(caroNextCtrl)

  document.querySelector('#photo-gallery').append(carouselDiv)
}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If the adventure is already reserved, display the sold-out message.
  if(adventure.available){
    document.querySelector('#reservation-panel-sold-out').style.display = 'none'
    document.querySelector('#reservation-panel-available').style.display = 'block'
    document.querySelector('#reservation-person-cost').textContent = adventure.costPerHead
  } else {
    document.querySelector('#reservation-panel-sold-out').style.display = 'block'
    document.querySelector('#reservation-panel-available').style.display = 'none'
  }

}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  // TODO: MODULE_RESERVATIONS
  // 1. Calculate the cost based on number of persons and update the reservation-cost field
  let total = persons * adventure.costPerHead
  document.querySelector('#reservation-cost').textContent = total
}

//Implementation of reservation form submission
function captureFormSubmit(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. Capture the query details and make a POST API call using fetch() to make the reservation
  // 2. If the reservation is successful, show an alert with "Success!" and refresh the page. If the reservation fails, just show an alert with "Failed!".
  document.querySelector('#myForm').addEventListener('submit', function(ev) { debugger
    ev.preventDefault()
    let formData = {
      name: ev.target.elements.name.value,
      date: ev.target.elements.date.value,
      person: ev.target.elements.person.value,
      adventure: adventure.id,
    }
    try{
      const resp = fetch(`${config.backendEndpoint}/reservations/new`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      resp.then((result) => console.log(result.json()))
      alert('Success')
      location.reload();
    } catch(err) {
      alert('Failed!')
    }
  })
}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If user has already reserved this adventure, show the reserved-banner, else don't
  if(adventure.reserved) {
    document.querySelector('#reserved-banner').style.display = 'block'
  } else {
    document.querySelector('#reserved-banner').style.display = 'none' 
  }
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
