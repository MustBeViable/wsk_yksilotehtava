//Element variables
export const bodyElement = document.querySelector("body");
export const body = document.querySelector("main");

export const userProfileDialog = document.getElementById("user-profile-dialog");
export const navBar = document.querySelector("nav");
export const restaurantsTable = document.getElementById("restaurants-scroll");
export const restaurantMenuDialog = document.getElementById("menu-dialog");
export const signUpDialog = document.getElementById("sign-up-dialog");
export const filterByName = document.getElementById("filter-input");
export let map = L.map("map");
export const jokeElement = document.getElementById("joke");
export const jokeButton = document.getElementById("chuck-norris");
export const addElement = document.getElementById("right");

export const restaurantListUrl =
  "https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants";

export const userUrl =
  "https://media2.edu.metropolia.fi/restaurant/api/v1/users";

export const logInUrl =
  "https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login";

export const avatarUrl = "https://media2.edu.metropolia.fi/restaurant/uploads/";

//caches restauranlist to only one API call per reload.
let restaurantsCache = [];

export function getRestaurantsCache() {
  return restaurantsCache;
}
export function setRestaurantsCache(restauranlist) {
  restaurantsCache = restauranlist;
}
//Maps movement on map and table at the same time and keeps it at sync
export const rowById = new Map();
export const markerById = new Map();

let loggedInUser = {
  token: "",
  username: "",
  email: "",
  favouriteRestaurant: "",
  avatar: null,
};

export function getLoggedInUser() {
  return loggedInUser;
}

export function setLoggedInUser(newLoggedInUser) {
  loggedInUser = newLoggedInUser;
}

//ad
let adShowElement = {};

export function getAdShowElement() {
  return adShowElement;
}

export function setAdShowElement(newShow) {
  adShowElement = newShow;
}

export const userIcon = L.icon({
  iconUrl: "./resources/images/user-pin.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
