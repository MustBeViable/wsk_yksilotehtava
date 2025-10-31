import { map, body, table, dialog, restaurantMenuUrl, getRestaurantsCache } from "./variables.js";
import { restaurantModal, restaurantRow } from './components/components.js'
import { failedToLoad } from "./components/error_component.js";
export function userLocator() {
  return new Promise((resolve, reject) =>{
        if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation ei tuettu"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
    pos => {resolve({
      long: pos.coords.longitude,
      lat: pos.coords.latitude})
    },
    err => {console.log("ei toimi tää", err.message)},
        {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  )});
}
export async function getUserLocation() {
  try {
  const userCoords = await userLocator();
  map.setView([userCoords.lat, userCoords.long], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);}
catch (e) {
  console.log(e.message);
}
}

export function setMarkers(list) {
  const div = document.createElement('div');
  body.appendChild(div);
  for (let i = 0; i<list.length; i++) {
    const long = list[i].location.coordinates[0];
    const lat = list[i].location.coordinates[1];
    const marker = L.marker([lat, long]).addTo(map);
    marker.on('click', () => {
      div.innerHTML = `
      <h3>${list[i].name}</h3>
      <p>${list[i].address}</p>
      `
      map.setView([lat, long], 15);
    })
  }
}

export const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    } 
    else {
      const message = `HTTP: ${response.status}, ${response.statusText}`;
      failedToLoad("div", message, "refresh page");
    }
  } catch (e) {
    console.log(e);
    failedToLoad("div", "No connection. Check your connection and try again.", "refresh page");
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
  element.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Company name</th>
    </tr>
    `;
};

export function debounce(fn, delay = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

export const addElements = (array) => {
  if (array?.length >= 1) {
    array.forEach((restaurant) => {
      const tr = restaurantRow(restaurant);
      table.appendChild(tr);
      tr.addEventListener("click", async () => {
        clearClasses();
        tr.classList.add("highlight");
        let url = restaurantMenuUrl + restaurant._id + "/fi";
        const menu = await fetchData(url);
        if (menu?.courses?.length) {
          dialog.innerHTML = restaurantModal(restaurant, menu);
          dialog.showModal();
          document
            .getElementById("close-modal")
            ?.addEventListener("click", () =>
              document.querySelector("dialog").close()
            );
        } else {
          failedToLoad(
            "dialog",
            "No menu found, check your connection and try again.",
            "close"
          );
        }
      });
    });
  }
};

export const filterRestaurants = (keyword) => {
  clearRestaurantList(table);
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
}

export const revealPasswordButton = (buttonElement, inputElement, image) => {
  buttonElement.addEventListener('click', (e) => {e.preventDefault();})
  buttonElement.addEventListener("mousedown", (e) => {
    e.preventDefault();
    showHidePassword(
      inputElement,
      "show",
      image
    );
  });
    buttonElement.addEventListener("mouseup", (e) => {
    e.preventDefault();
    showHidePassword(
      inputElement,
      "hide",
      image
    );
  });
    buttonElement.addEventListener("touchstart", (e) => {
    e.preventDefault();
    showHidePassword(
      inputElement,
      "show",
      image
    );
  });
    buttonElement.addEventListener("touchend", (e) => {
    e.preventDefault();
    showHidePassword(
      inputElement,
      "hide",
      image
    );
  });
};