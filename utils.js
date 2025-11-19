import {
  map,
  restaurantsTable,
  getRestaurantsCache,
  rowById,
  markerById,
} from "./variables.js";
import { restaurantRow } from "./components/menuComponent.js";
import { errorMessageComponent } from "./components/error_component.js";
import { panMapTo } from "./components/mapControl.js";

function userLocator() {
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
        //Need to reject so it goes catch block
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}

const fetchData = async (url, options) => {
  if (options == null) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      } else {
        const message = `HTTP: ${response.status}, ${response.statusText}`;
        errorMessageComponent("dialog", message, "Close");
        return await response.json();
      }
    } catch (e) {
      errorMessageComponent(
        "dialog",
        "No connection. Check your connection and try again.",
        "Close"
      );
    }
  } else {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response.json();
      } else {
        const message = `HTTP: ${response.status}, ${response.statusText}`;
        errorMessageComponent("dialog", message, "close");
      }
    } catch (e) {
      errorMessageComponent(
        "dialog",
        "No connection. Check your connection and try again.",
        "Close"
      );
    }
  }
};

const sortList = (array) => {
  return [...array].sort((a, b) =>
    a.name.localeCompare(b.name, "fi", { sensitivity: "base" })
  );
};

function clearClasses(className) {
  try {
    document.querySelectorAll(`.${className}`).forEach((el) => {
      el.classList.remove(className);
    });
  } catch (e) {}
}

const clearRestaurantList = (element) => {
  element.innerHTML = "";
};

const addElements = (array) => {
  rowById.clear();
  if (array?.length >= 1) {
    array.forEach((restaurant) => {
      const tr = restaurantRow(restaurant);
      restaurantsTable.appendChild(tr);
      rowById.set(restaurant._id, tr);
      tr.addEventListener("click", async () => {
        const markerObject = await markerById.get(restaurant._id);

        map.setView([
          restaurant.location.coordinates[1],
          restaurant.location.coordinates[0],
        ]);
        panMapTo(restaurant);
        clearClasses("highlight");
        tr.classList.add("highlight");
        markerObject.mapMarker.openPopup();
      });
    });
  }
};

const filterRestaurants = (keyword) => {
  clearRestaurantList(restaurantsTable);
  const restaurantsCache = getRestaurantsCache();
  const restaurantsListFiltered = restaurantsCache.filter((restaurant) =>
    (restaurant.name || "").toLowerCase().includes(keyword.toLowerCase())
  );
  if (restaurantsListFiltered.length <= 0) {
    return;
  } else {
    addElements(sortList(restaurantsListFiltered));
  }
};

const showHidePassword = (button, visibility, image) => {
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

const revealPasswordButton = (buttonElement, inputElement, image) => {
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

export {
  userLocator,
  fetchData,
  sortList,
  clearClasses,
  clearRestaurantList,
  addElements,
  filterRestaurants,
  showHidePassword,
  revealPasswordButton,
};
