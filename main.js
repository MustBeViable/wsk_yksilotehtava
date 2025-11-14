import {
  filterSubmitButton,
  filterByName,
  restaurantListUrl,
  setRestaurantsCache,
  jokeElement,
  jokeButton,
  addElement,
  getAddShowElement,
  bodyElement,
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
import { randomTvShowAd } from "./components/tvShowAd.js";
import createMostImportantComponent from "./components/mostImportantComponent.js";

const run = async () => {
  defaultNavBar();
  filterSubmitButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    filterRestaurants(filterByName.value);
  });
  filterByName.addEventListener(
    "input",
    debounce((e) => filterRestaurants(filterByName.value), 300)
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
  addElement.innerHTML = await randomTvShowAd();
  document.getElementById("add-container").addEventListener("click", (e) => {
    window.open(getAddShowElement().url || "", "_blank", "noopener");
  });
  const importantDialog = createMostImportantComponent();
  bodyElement.appendChild(importantDialog);
  document.getElementById("tarkee").addEventListener("click", (e) => {
    e.preventDefault();
    importantDialog.showModal();
    const closeButton = document.getElementById("not-to-close");
    closeButton.addEventListener("click", (e) => {
      e.preventDefault();
      importantDialog.close();
    });
  });
};


run();
