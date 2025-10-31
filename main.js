import {
  restaurants,
  filterSubmitButton,
  filterCompany,
  restaurantListUrl,
  setRestaurantsCache,
} from "./variables.js";
import {
  getUserLocation,
  setMarkers,
  debounce,
  filterRestaurants,
  fetchData,
  addElements,
  sortList,
  revealPasswordButton
} from "./utils.js";
import { defaultNavBar } from "./components/navBar.js";
import { failedToLoad } from "./components/error_component.js";

getUserLocation();
setMarkers(restaurants);

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
  } catch (err) {
    console.error(err);
    failedToLoad(
      "div",
      "No connection. Check your connection and try again.",
      "refresh page"
    );
  }
};

run();
