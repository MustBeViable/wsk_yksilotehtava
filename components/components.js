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

export { restaurantRow, restaurantModal };
