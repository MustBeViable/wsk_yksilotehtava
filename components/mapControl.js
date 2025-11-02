import { map, body, rowById, markerById, userIcon } from "../variables.js";

import { userLocator, clearClasses } from "../utils.js";

import { menuElement } from "./components.js";

export function panMapTo(restaurant) {
  const offsetLong = Math.round(map.getSize().y * 0.2);
  map.panBy([0, -offsetLong], { animate: true });
  const tr = rowById.get(restaurant._id);
}

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
  marker.on("popupopen", (e) => {
    while (document.getElementById(buttonIdDaily) == null) {
      //this forces to wait until button element have been created
    }
    document.getElementById(buttonIdDaily).addEventListener("click", (e) => {
      e.preventDefault();
      menuElement(restaurant, "daily", "fi");
    });
  });
  marker.on("click", () => {
    map.setView([lat, long], 15);
    panMapTo(restaurant);
    marker.openPopup();
    const tr = rowById.get(restaurant._id);
    if (tr) {
      clearClasses();
      tr.classList.add("highlight");
      tr.scrollIntoView({ behavior: "smooth", block: "center" });
      tr.focus({ preventScroll: true });
    }
  });
}

export async function setMarkers(list, userCoordinates) {
  const div = document.createElement("div");
  body.appendChild(div);
  console.log(userCoordinates);
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
