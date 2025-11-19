import {
  filterByName,
  restaurantListUrl,
  setRestaurantsCache,
  jokeElement,
  jokeButton,
  addElement,
  getAdShowElement,
} from "./variables.js";
import {
  filterRestaurants,
  fetchData,
  addElements,
  sortList,
} from "./utils.js";
import { defaultNavBar } from "./components/navBar.js";
import { errorMessageComponent } from "./components/error_component.js";
import { setMarkers, getUserLocation } from "./components/mapControl.js";
import { ChuckNorris } from "./components/chuckNorris.js";
import { randomTvShowAd } from "./components/tvShowAd.js";

//main function to load all content when user enters the page
const run = async () => {
  defaultNavBar();
  filterByName.addEventListener("input", () => {
    filterRestaurants(filterByName.value);
  });
  try {
    const data = await fetchData(restaurantListUrl);
    const list = Array.isArray(data) ? data : [];
    setRestaurantsCache(list);
    addElements(sortList(list));
    const userCoordinates = await getUserLocation();
    setMarkers(list, userCoordinates);
  } catch (err) {
    console.error(err);
    errorMessageComponent(
      "dialog",
      "No connection. Check your connection and try again.",
      "Close"
    );
  }
  ChuckNorris(jokeElement);
  jokeButton.addEventListener("click", (e) => {
    e.preventDefault();
    ChuckNorris(jokeElement);
  });
  addElement.innerHTML = await randomTvShowAd();
  document.getElementById("add-container").addEventListener("click", (e) => {
    window.open(getAdShowElement().url || "", "_blank", "noopener");
  });
};

run();
