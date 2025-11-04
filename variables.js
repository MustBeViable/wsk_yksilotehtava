export const bodyElement = document.querySelector("body");
export const body = document.querySelector("main");

export const userProfileDialog = document.getElementById("user-profile-dialog");
export const navBar = document.querySelector("nav");
export const restaurantsTable = document.getElementById("restaurants-scroll");
export const restaurantMenuDialog = document.getElementById("menu-dialog");
export const signUpDialog = document.getElementById("sign-up-dialog");
export const filterCompany = document.getElementById("filter-input");
export const filterSubmitButton = document.getElementById("filter-button");
export let map = L.map("map");

export const restaurantListUrl =
  "https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants";

export const userUrl =
  "https://media2.edu.metropolia.fi/restaurant/api/v1/users";

export const logInUrl =
  "https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login";

//caches restauranlist to only one API call per reload.
let restaurantsCache = [];

export function getRestaurantsCache() {
  return restaurantsCache;
}
export function setRestaurantsCache(restauranlist) {
  restaurantsCache = restauranlist;
}

export const rowById = new Map();
export const markerById = new Map();

let loggedInUser = {
  token: "",
  username: "",
  email: "",
  favouriteRestaurant: "",
  avatar: ""
};

export function getLoggedInUser() {
  return loggedInUser;
}

export function setLoggedInUser(newLoggedInUser) {
  loggedInUser = newLoggedInUser;
}

export const userIcon = L.icon({
  iconUrl: "./resources/images/user-pin.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
