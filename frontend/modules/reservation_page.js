import config from "../conf/index.js";

//Implementation of fetch call to fetch all reservations
async function fetchReservations() {
  // TODO: MODULE_RESERVATIONS
  try{
    // 1. Fetch Reservations by invoking the REST API and return them
    const reservations = await fetch(`${config.backendEndpoint}/reservations/`)
    return await reservations.json();
  }
  catch(err) {
    return null;
  }
}

//Function to add reservations to the table. Also; in case of no reservations, display the no-reservation-banner, else hide it.
function addReservationToTable(reservations) {
  // TODO: MODULE_RESERVATIONS
  // 1. Add the Reservations to the HTML DOM so that they show up in the table
  let tableBody = document.querySelector('#reservation-table')
  //Conditionally render the no-reservation-banner and reservation-table-parent
  if(reservations.length !== 0){
    document.querySelector('#no-reservation-banner').style.display = 'none'
    document.querySelector('#reservation-table-parent').style.display = 'block'
  } else {
    document.querySelector('#no-reservation-banner').style.display = 'block'
    document.querySelector('#reservation-table-parent').style.display = 'none'
  }
  /*
    Iterating over reservations, adding it to table (into div with class "reservation-table") and link it correctly to respective adventure
    The last column of the table should have a "Visit Adventure" button with id=<reservation-id>, class=reservation-visit-button and should link to respective adventure page

    Note:
    1. The date of adventure booking should appear in the format D/MM/YYYY (en-IN format) Example:  4/11/2020 denotes 4th November, 2020
    2. The booking time should appear in a format like 4 November 2020, 9:32:31 pm
  */
  reservations.forEach(reservation => {
    const date = new Date(reservation.date)
    const datetime = new Date(reservation.time)
    let dateOpts = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    let trow = document.createElement('tr')
    trow.innerHTML = `
      <td>${reservation.id}</td>
      <td>${reservation.name}</td>
      <td>${reservation.adventureName}</td>
      <td>${reservation.person}</td>
      <td>${date.toLocaleDateString("en-IN")}</td>
      <td>${reservation.price}</td>
      <td>${datetime.toLocaleString("en-IN", dateOpts)}, ${datetime.toLocaleTimeString("en-IN")}</td>
      <td><button type="button" id="${reservation.id}" class="reservation-visit-button"><a href="./../detail/?adventure=${reservation.adventure}">Visit Adventure</a></button></td>
    `
    tableBody.append(trow)
  });

}

export { fetchReservations, addReservationToTable };
