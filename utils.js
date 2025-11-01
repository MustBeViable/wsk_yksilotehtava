import {
  map,
  body,
  restaurantsTable,
  getRestaurantsCache,
  rowById,
  markerById,
  userIcon,
} from "./variables.js";
import {
  restaurantModal,
  restaurantRow,
  menuElement,
} from "./components/components.js";
import { failedToLoad } from "./components/error_component.js";

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

export async function getUserLocation() {
  try {
    const userCoords = await userLocator();
    map.setView([userCoords.lat, userCoords.long], 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    return [userCoords.lat, userCoords.long];
  } catch (e) {
    console.log(e.message);
  }
}

export async function setMarkers(list, userCoordinates) {
  const div = document.createElement("div");
  body.appendChild(div);
  console.log(userCoordinates);
  L.marker(userCoordinates, { icon: userIcon }).addTo(map);
  for (let i = 0; i < list.length; i++) {
    const long = list[i].location.coordinates[0];
    const lat = list[i].location.coordinates[1];
    const marker = L.marker([lat, long]).addTo(map);
    markerById.set(list[i]._id, marker);
    buildMarkerPopUp(list[i], marker, lat, long);
  }
}

//muokkaa palauttamaan olio mikä tallentuu Map() interfaceen ja saadaan sit buttonit toimii ees taas
export function buildMarkerPopUp(restaurant, marker, lat, long) {
  const buttonIdDaily = restaurant._id + "-daily";
  const buttonIdWeekly = restaurant._id + "-weekly";
  const popUpHTML = `
    <div class="marker-poput">
      <h5>${restaurant.name}</h5>
      <p>${restaurant.address}</p>
      <button id="${buttonIdDaily}">todays menu</button>
      <button id="${buttonIdWeekly}">weeks menu</button>
    </div>
    `;
  marker.bindPopup(popUpHTML, {
    autoPan: false,
    keepInView: false,
    animate: false,
  });
  marker.on("click", () => {
    map.setView([lat, long], 15);
    panMapTo(restaurant);
    marker.openPopup();
    while (document.getElementById(buttonIdDaily) == null) {
      //this forces to wait until button element have been created
    }
    document.getElementById(buttonIdDaily).addEventListener("click", (e) => {
      e.preventDefault();
      menuElement(restaurant, "daily", "fi");
    });
    const tr = rowById.get(restaurant._id);
    if (tr) {
      clearClasses();
      tr.classList.add("highlight");
      tr.scrollIntoView({ behavior: "smooth", block: "center" });
      tr.focus({ preventScroll: true });
    }
  });
  return {}
}

function panMapTo(restaurant) {
  const offsetLong = Math.round(map.getSize().y * 0.2);
  map.panBy([0, -offsetLong], { animate: true });
  const tr = rowById.get(restaurant._id);
}

export const fetchData = async (url) => {
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

export const clearClasses = () => {
  try {
    const nodeList = document.querySelector('tr[class="highlight"]');
    nodeList.classList.remove("highlight");
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
        clearClasses();
        tr.classList.add("highlight");
        const marker = markerById.get(restaurant._id);
        if (marker) {
          marker.openPopup();
          while (document.getElementById(buttonIdDaily) == null) {
            //this forces to wait until button element have been created
          }
          document
            .getElementById(buttonIdDaily)
            .addEventListener("click", (e) => {
              e.preventDefault();
              menuElement(restaurant, "daily", "fi");
            });
        }
        map.setView([
          restaurant.location.coordinates[1],
          restaurant.location.coordinates[0],
        ]);
        panMapTo(restaurant);
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
