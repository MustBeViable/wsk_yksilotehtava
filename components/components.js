import { restaurantListUrl, restaurantMenuDialog } from "../variables.js";
import { fetchData } from "../utils.js";
import { failedToLoad } from "./error_component.js";

const restaurantRow = (restaurant) => {
  const { _id, name, company } = restaurant;
  const tr = document.createElement("tr");
  tr.id = _id;
  tr.innerHTML = `
    <td>${name}</td>
    <td>${company}</td>
    `;
  return tr;
};

const restaurantModal = (restaurant, menu) => {
  const { name, address, postalCode, city, phone, company } = restaurant;
  const { courses = [] } = menu ?? {};
  const restaurantHTML = `
    <div>
  <button id="close-modal">Close window</button>
  <table id="restaurant_table">

  <tr>
  <th>Restaurant name:</th>
  <th>${name}</th>
  </tr>

  <tr>
  <th>Address:</th>
  <th>${address}</th>
  </tr>

  <tr>
  <th>Postal code:</th>
  <th>${postalCode}</th>
  </tr>

  <tr>
  <th>City:</th>
  <th>${city}</th>
  </tr>

  <tr>
  <th>Phone number:</th>
  <th>${phone}</th>
  </tr>

  <tr>
  <th>Company:</th>
  <th>${company}</th>
  </tr>

  </table>
  </div>
  `;
  const rowsHtml = courses
    .map(
      ({ name: courseName, price, diets }) => `
    <tr>
      <td>${courseName ? courseName : "no name"}</td>
      <td>${price ?? "no price"}</td>
      <td class="menu_class">${
        Array.isArray(diets)
          ? diets.join(", ")
          : typeof diets === "string"
          ? diets
          : "-"
      }</td>
    </tr>
  `
    )
    .join("");
  const menuHTML = `
    <div class="menu_table">
      <table>
        ${rowsHtml}
      </table>
    </div>
  `;
  return restaurantHTML + menuHTML;
};

const menuElement = async (restaurant, option, lang) => {
  let url = restaurantListUrl + `/${option}/` + restaurant._id + `/${lang}`;
  const menu = await fetchData(url);
  switch (option) {
    case "daily": {
      if (menu?.courses?.length) {
        restaurantMenuDialog.innerHTML = restaurantModal(restaurant, menu);
        restaurantMenuDialog.showModal();
        document
          .getElementById("close-modal")
          ?.addEventListener("click", () => restaurantMenuDialog.close());
      } else {
        failedToLoad(
          "dialog",
          "No menu found, check your connection and try again.",
          "close"
        );
      }
      break;
    }
    case "weekly": {
      if (menu?.days.length) {
        const weeklyMenuHTML = `
        <table id="${restaurant._id}-weekly">
        </table>
        `;
        let menuDateId = restaurant._id;
        const dateTable = document.getElementById(restaurant._id + "-weekly");
        menu.day.forEach((element) => {
          const tr = document.createElement("tr");
          menuDateId += 1;
          const td = document.createElement("td");
          tr.id = menuDateId;
          td.innerHTML = element.date;
          tr.appendChild(td);
          dateTable.appendChild(tr);
        });
      }
      break;
    }
  }
};

export { restaurantRow, restaurantModal, menuElement };
