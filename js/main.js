'use strict';
import Swiper from 'https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');



let userLogin = localStorage.getItem('userLogin');

function validName (str) {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return regName.test(str);
}


const toggleModal = function() {
  modal.classList.toggle("is-open");
};

const getData = async function(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статуc ошибки ${response.status}!`);
  } 
  return await response.json();
};


const toggleModalAuth = function() {
  modalAuth.classList.toggle('is-open');
  if (modalAuth.classList.contains('is-open')) {
    loginInput.style.border = '';
    disableScroll();
  } else {
    enableScroll();
  }
};

function authorized() {


  function logOut() {
    userLogin = null;
    localStorage.removeItem('userLogin')
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  userName.textContent = userLogin;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);
};

function notAuthorized() {


  function logIn(event) {
    event.preventDefault();
    userLogin = loginInput.value;
    localStorage.setItem('userLogin', userLogin);
    if (validName(userLogin)) {
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.border = '1px solid red';
      loginInput.value = '';
    }

  }


  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
  modalAuth.addEventListener('click', function(event) {
    if (event.target.classList.contains('is-open')) {
      toggleModalAuth();
    } 
  });
};

function checkAuth() {
  if (userLogin) {
    authorized();
  } else {
    notAuthorized();
  }
};

checkAuth();


function createCardRestaraunt( {image, kitchen, name, price, stars, products, time_of_delivery : timeOfDelivery}) {

  const card = `
    <a class="card card-restaurant" data-products="${products}">
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery} мин</span>
        </div>
        <div class="card-info">
          <div class="rating">${stars}</div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
        </div>
      </div>
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);

}


function createCardGood({ description, name, price, image, }) {

  const card = document.createElement('div');
  card.className='card';
  card.insertAdjacentHTML('beforeend', `
						<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">${description}
								</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">${price} ₽</strong>
							</div>
						</div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card)
}

function openGoods(event) {
  const target = event.target;
  if (userLogin) {
    const restaurant = target.closest('.card-restaurant');

    if(restaurant) {


      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      getData(`./db/${restaurant.dataset.products}`).then(function(data){
        data.forEach(createCardGood);
      });

    }
  } else {
    toggleModalAuth();
  }
}

function init() {
  getData('./db/partners.json').then(function(data) {
    data.forEach(createCardRestaraunt)
  });
  
  
  cartButton.addEventListener("click", toggleModal);
  
  close.addEventListener("click", toggleModal);
  
  cardsRestaurants.addEventListener('click', openGoods);
  
  logo.addEventListener('click', function() {
  
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });

  checkAuth();

    new Swiper('.swiper-container', {
    loop: true,
    spaceBetween: 100,
    effect: 'coverflow',
    grabCursor: true,
    scrollbar: {
      el : '.swiper-scrollbar',
      draggable	: true,
    }
  });
}
init();