import { map, body, rowById, markerById, userIcon } from "../variables.js";

import { userLocator, clearClasses } from "../utils.js";

import { menuElement } from "./menuComponent.js";
import { sendDataToApi } from "./userInformationEdit.js";
import { errorMessageComponent } from "./error_component.js";

function panMapTo(restaurant) {
  const offsetLong = Math.round(map.getSize().y * 0.2);
  map.panBy([0, -offsetLong], { animate: true });
  const tr = rowById.get(restaurant._id);
}

function buildMarkerPopUp(restaurant, marker, lat, long) {
  const buttonIdDaily = restaurant._id + "-daily";
  const buttonIdWeekly = restaurant._id + "-weekly";
  const favourite = restaurant._id + "-favourite";

  const popUpHTML = `
    <div class="marker-poput">
      <h5>${restaurant.name}</h5>
      <p>${restaurant.address}</p>
      <button id="${buttonIdDaily}">todays menu</button>
      <button id="${buttonIdWeekly}">weeks menu</button>
      <button id="${favourite}">favourite</button>
    </div>
    `;

  marker.bindPopup(popUpHTML, {
    autoPan: false,
    keepInView: false,
    animate: false,
  });

  marker.on("popupopen", (e) => {
    const popupEl = e.popup.getElement();
    if (!popupEl) return;

    const dailyBtn = document.getElementById(buttonIdDaily);
    const weeklyBtn = document.getElementById(buttonIdWeekly);
    const favouriteBtn = document.getElementById(favourite);

    if (!dailyBtn || !weeklyBtn || !favouriteBtn) {
      return;
    }

    dailyBtn.onclick = (e) => {
      e.preventDefault();
      menuElement(restaurant, "daily", "fi");
    };

    weeklyBtn.onclick = (e) => {
      e.preventDefault();
      menuElement(restaurant, "weekly", "fi");
    };

    favouriteBtn.onclick = async (e) => {
      e.preventDefault();
      const logged = await sendDataToApi(null, null, null, restaurant._id);
      if (!logged) {
        errorMessageComponent(
          "dialog",
          "You must be logged in to set up a favorite restaurant",
          "Close"
        );
      }
    };
  });
  marker.on("click", () => {
    map.setView([lat, long], 15);
    panMapTo(restaurant);
    marker.openPopup();
    const tr = rowById.get(restaurant._id);
    if (tr) {
      tr.scrollIntoView({ behavior: "smooth", block: "center" });
      tr.focus({ preventScroll: true });
      clearClasses("highlight");
      tr.classList.add("highlight");
    }
  });
}

async function setMarkers(list, userCoordinates) {
  const div = document.createElement("div");
  body.appendChild(div);
  const markerObject = {};
  L.marker(userCoordinates, { icon: userIcon }).addTo(map);
  for (let i = 0; i < list.length; i++) {
    const long = list[i].location.coordinates[0];
    const lat = list[i].location.coordinates[1];
    const marker = L.marker([lat, long]).addTo(map);
    buildMarkerPopUp(list[i], marker, lat, long);
    markerObject[list[i]._id] = {
      restaurantInfo: list[i],
      mapMarker: marker,
      restaurantLat: lat,
      restaurantLong: long,
    };
    markerById.set(list[i]._id, markerObject[list[i]._id]);
  }
}

async function getUserLocation() {
  const defaultCoords = { lat: 60.1699, long: 24.9384 };
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
    errorMessageComponent("dialog", "Using default coordinates.", "Close");
    map.setView([defaultCoords.lat, defaultCoords.long], 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    return [defaultCoords.lat, defaultCoords.long];
  }
}

export { panMapTo, buildMarkerPopUp, setMarkers, getUserLocation };
