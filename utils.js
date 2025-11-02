import {
  map,
  restaurantsTable,
  getRestaurantsCache,
  rowById,
  markerById,
} from "./variables.js";
import { restaurantRow } from "./components/components.js";
import { failedToLoad } from "./components/error_component.js";
import { buildMarkerPopUp, panMapTo } from "./components/mapControl.js";

export function userLocator() {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation ei tuettu"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          long: pos.coords.longitude,
          lat: pos.coords.latitude,
        });
      },
      (err) => {
        console.log("ei toimi tää", err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}

export const fetchData = async (url, options) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else {
      const message = `HTTP: ${response.status}, ${response.statusText}`;
      failedToLoad("div", message, "refresh page");
    }
  } catch (e) {
    console.log(e);
    failedToLoad(
      "div",
      "No connection. Check your connection and try again.",
      "refresh page"
    );
  }
};

export const sortList = (array) => {
  return [...array].sort((a, b) =>
    a.name.localeCompare(b.name, "fi", { sensitivity: "base" })
  );
};

export function clearClasses(className) {
  try {
    const nodeList = document.querySelector(`tr[class="${className}"]`);
    nodeList.classList.remove(className);
  } catch (e) {}
};

export const clearRestaurantList = (element) => {
  element.innerHTML = "";
};

export function debounce(fn, delay = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

export const addElements = (array) => {
  rowById.clear();
  if (array?.length >= 1) {
    array.forEach((restaurant) => {
      const tr = restaurantRow(restaurant);
      restaurantsTable.appendChild(tr);
      rowById.set(restaurant._id, tr);
      tr.addEventListener("click", async () => {
        clearClasses("higlight");
        tr.classList.add("highlight");
        const markerObject = await markerById.get(restaurant._id);
        buildMarkerPopUp(
          markerObject.restaurantInfo,
          markerObject.mapMarker,
          markerObject.restaurantLat,
          markerObject.restaurantLong
        );
        map.setView([
          restaurant.location.coordinates[1],
          restaurant.location.coordinates[0],
        ]);
        panMapTo(restaurant);
        markerObject.mapMarker.openPopup();
      });
    });
  }
};

export const filterRestaurants = (keyword) => {
  clearRestaurantList(restaurantsTable);
  const restaurantsCache = getRestaurantsCache();
  const restaurantsListFiltered = restaurantsCache.filter((restaurant) =>
    (restaurant.company || "").toLowerCase().includes(keyword.toLowerCase())
  );
  if (restaurantsListFiltered.length <= 0) {
    failedToLoad("p", "<b>No restaurants</b>", "close");
  } else {
    addElements(sortList(restaurantsListFiltered));
  }
};

export const showHidePassword = (button, visibility, image) => {
  switch (visibility) {
    case "show":
      button.type = "text";
      image.src = "./resources/images/hide_15567150.png";
      break;
    case "hide":
      button.type = "password";
      image.src = "./resources/images/eye_8276553.png";
      break;
  }
};

export const revealPasswordButton = (buttonElement, inputElement, image) => {
  buttonElement.addEventListener("click", (e) => {
    e.preventDefault();
  });
  buttonElement.addEventListener("mousedown", (e) => {
    e.preventDefault();
    showHidePassword(inputElement, "show", image);
  });
  buttonElement.addEventListener("mouseup", (e) => {
    e.preventDefault();
    showHidePassword(inputElement, "hide", image);
  });
  buttonElement.addEventListener("touchstart", (e) => {
    e.preventDefault();
    showHidePassword(inputElement, "show", image);
  });
  buttonElement.addEventListener("touchend", (e) => {
    e.preventDefault();
    showHidePassword(inputElement, "hide", image);
  });
};
