import {
  filterSubmitButton,
  filterCompany,
  restaurantListUrl,
  setRestaurantsCache,
  jokeElement,
  jokeButton,
} from "./variables.js";
import {
  debounce,
  filterRestaurants,
  fetchData,
  addElements,
  sortList,
} from "./utils.js";
import { defaultNavBar } from "./components/navBar.js";
import { failedToLoad } from "./components/error_component.js";
import { setMarkers, getUserLocation } from "./components/mapControl.js";
import { ChuckNorris } from "./components/chuckNorris.js";

const run = async () => {
  defaultNavBar();
  filterSubmitButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    filterRestaurants(filterCompany.value);
  });
  filterCompany.addEventListener(
    "input",
    debounce((e) => filterRestaurants(filterCompany.value), 300)
  );
  try {
    const data = await fetchData(restaurantListUrl);
    const list = Array.isArray(data) ? data : [];
    setRestaurantsCache(list);
    addElements(sortList(list));
    const userCoordinates = await getUserLocation();
    setMarkers(list, userCoordinates);
  } catch (err) {
    console.error(err);
    failedToLoad(
      "div",
      "No connection. Check your connection and try again.",
      "refresh page"
    );
  }
  ChuckNorris(jokeElement);
  jokeButton.addEventListener("click", (e) => {
    e.preventDefault();
    ChuckNorris(jokeElement);
  });
};

run();
