fetchUsers() // Entry point for entire application
  .then(result => result.ok ? result.json() : console.error(result.status)) // Parse JSON if no error
  .then(data => {
    insertIntoGallery(data.results); // Insert user data
    addSearch(data.results); // Dynamic search
  });

/**
 * Create cards to be inserted into the DOM from user data
 * 
 * @function insertIntoGallery
 * @param {array} data Objects of random users
 */

function insertIntoGallery(data) {
  const userCards = data.map((value, index) => `
    <div class="card" data-index="${index}">
      <div class="card-img-container">
        <img class="card-img" src="${value.picture.medium}" alt="profile picture">
      </div>
      <div class="card-info-container">
        <h3 id="name" class="card-name cap">${value.name.first + ' ' + value.name.last}</h3>
        <p class="card-text">${value.email}</p>
        <p class="card-text cap">${value.location.city}, ${value.location.state}</p>
      </div>
    </div>
  `).join('');

  document.getElementById('gallery').innerHTML = userCards;

  document.querySelectorAll('.card').forEach(element => {
    element.addEventListener('click', () => openCard(data, element.dataset.index));
  });
}

/**
 * Fetch API to get random users
 * 
 * @async
 * @function fetchUsers
 * @returns {Promise} 12 random users in JSON
 */

async function fetchUsers() {
  try {
    return await fetch('https://randomuser.me/api/?results=12', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * When a card is clicked, we open the modal with the users data
 * 
 * @function openCard
 * @param {array} userData Objects of user data
 * @param {number} index Current index of the user open in the modal
 */

function openCard(userData, index) {
  index = (index < 0) ? userData.length - 1 : index; // Prevent errors when reaching beginning of user data
  index = (index > (userData.length - 1)) ? 0 : index; // Prevent errors when reaching end of user data

  if (document.contains(document.querySelector(".modal-container"))) {
    document.querySelector(".modal-container").remove();
  }

  const modalContent = `
    <div class="modal-container">
      <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
          <img class="modal-img" src="${userData[index].picture.large}" alt="profile picture">
          <h3 id="name" class="modal-name cap">${userData[index].name.first + ' ' + userData[index].name.last}</h3>
          <p class="modal-text">${userData[index].email}</p>
          <p class="modal-text cap">${userData[index].location.city}</p>
          <hr>
          <p class="modal-text">${formatNumber(userData[index].cell)}</p>
          <p class="modal-text">${userData[index].location.street.number} ${userData[index].location.street.name}, ${userData[index].location.city}, ${userData[index].location.state}, ${userData[index].location.city}, ${userData[index].location.postcode}</p>
          <p class="modal-text">Birthday: ${new Date(userData[index].dob.date).toLocaleDateString('en-US')}</p>
        </div>
      </div>
      <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalContent);
  const modalContainer = document.querySelector('.modal-container');

  document.getElementById('modal-close-btn').addEventListener('click', () => modalContainer.remove());
  document.getElementById('modal-prev').addEventListener('click', () => openCard(userData, +index - 1));
  document.getElementById('modal-next').addEventListener('click', () => openCard(userData, +index + 1));
}

/**
 * Formats a telephone number according to specifications
 * 
 * @function formatNumber
 * @param {string} number A telephone number
 * @returns {string} Formatted number
 */

function formatNumber(number) {
  return number
    .replace(/[^0-9]/g, '')
    .split('')
    .map((num, index) => {
      switch (index) {
        case 0:
          return '(' + num;
        case 2:
          return num + ') ';
        case 6:
          return '-' + num;
        default:
          return num;
      }
    })
    .join('');
}

/**
 * Simplified search of names of user data
 * 
 * @function search
 * @param {string} value Value searched by user
 * @param {array} data User data to filter through in search of provided value
 */

function search(value, data) {
  const results = data.filter(user => user.name.first.concat(user.name.last).toLowerCase().includes(value.toLowerCase()));
  insertIntoGallery(results);
}

/**
 * Dynamically adds search function to the DOM
 * 
 * @function addSearch
 * @param {array} data User data to filter through in search
 */

function addSearch(data) {
  document.querySelector('.search-container').innerHTML = `
    <form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
  `;

  document.getElementById('search-input').addEventListener('keyup', e => search(e.target.value, data));
  document.getElementById('search-submit').addEventListener('click', e => search(e.target.previousElementSibling.value, data));
}