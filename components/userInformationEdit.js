import { fetchData, clearClasses } from "../utils.js";
import {
  getLoggedInUser,
  getRestaurantsCache,
  userProfileDialog,
  userUrl,
  markerById, 
  rowById,
  map
} from "../variables.js";
import { userInfoByToken } from "./logIn.js";
import { loggedInNavBar } from "./navBar.js";
import { panMapTo } from "./mapControl.js";

export function createUserDialog() {
  const restaurantList = getRestaurantsCache();
  const userInfo = getLoggedInUser();
  console.log(userInfo);
  console.log(restaurantList);
  const favoriteRestaurantObject = restaurantList.find((restaurant) => {
    return restaurant._id === userInfo.favouriteRestaurant;
  });
  console.log(favoriteRestaurantObject);
  const userDialogHTML = `
  <div id="user-profile">
    <button id="close-user-setting">X</button>
    <p>${userInfo.username}</p>
    <img class="profile-picture" src="${userInfo.avatar}" alt="profile picture" />
    <p id="favourite-restaurant">${favoriteRestaurantObject?.name}</p>
    <button id="change-user-information">Change profile</button>
  </div>
  `;
  return userDialogHTML;
}

export async function openUserSetting() {
  await userInfoByToken(getLoggedInUser().token);
  const dialog = userProfileDialog;
  dialog.innerHTML = createUserDialog();
  const changeUserInfo = document.getElementById("change-user-information");
  const closeDialog = document.getElementById("close-user-setting");
  closeDialog.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.close();
  });
  changeUserInfo.addEventListener("click", (e) => {
    e.preventDefault();
    changeUserInfoDialog();
    dialog.close();
  });
  document
    .getElementById("favourite-restaurant")
    .addEventListener("click", () => {
      const { favouriteRestaurant } = getLoggedInUser();
      if (!favouriteRestaurant) return;

      const markerObj = markerById.get(favouriteRestaurant);
      if (!markerObj) return;

      const { restaurantInfo, mapMarker, restaurantLat, restaurantLong } =
        markerObj;

      map.setView([restaurantLat, restaurantLong], 15);
      panMapTo(restaurantInfo);
      mapMarker.openPopup();

      clearClasses("highlight");
      const tr = rowById.get(favouriteRestaurant);
      tr?.classList.add("highlight");
      tr?.scrollIntoView({ behavior: "smooth", block: "center" });
      dialog.close();
    });
  dialog.showModal();
}

export async function changeUserInfoDialog() {
  const profileSettingsDialog = `
<form novalidate>
  <h3>Change your information</h3>

  <label for="username">Username</label>
  <input
    id="user-name"
    name="username"
    type="text"
    placeholder="new username"
    minlength="3"
    maxlength="24"
  />

  <label for="email">E-mail</label>
  <input
    id="email"
    name="email"
    type="email"
    placeholder="new email"
    inputmode="email"
    autocomplete="email"
  />

  <label for="password">password</label>
  <input
    id="password"
    name="password"
    type="password"
    placeholder="new password"
    minlength="3"
    maxlength="24"
  />

    <label for="file">Set avatar: </label>
  <input id="avatar" name="file" type="file" placeholder="select file" />
  <p id="response"></p>

  <div>
    <button id="save-new-info">Save</button>
    <button id="close-dialog-user-settings">Cancel</button>
  </div>
</form>
    `;
  const userSettingsDialog = document.getElementById("user-settings-dialog");
  userSettingsDialog.innerHTML = "";
  const div = document.createElement("div");
  div.innerHTML = profileSettingsDialog;
  userSettingsDialog.appendChild(div);

  const saveNewInfoButton = document.getElementById("save-new-info");
  const cancelNewInfo = document.getElementById("close-dialog-user-settings");
  const responseMessage = document.getElementById("response");
  const avatarInput = document.getElementById("avatar");

  const newUserNameInput = document.getElementById("user-name");
  const newEmailInput = document.getElementById("email");
  const newPasswordInput = document.getElementById("password");
  saveNewInfoButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const file = avatarInput.files?.[0];
    if (file) {
      const res = await uploadAvatar(file);
      await userInfoByToken(getLoggedInUser().token);
    }
    if (
      newUserNameInput.value ||
      newPasswordInput.value ||
      newEmailInput.value
    ) {
      const responseData = await sendDataToApi(
        newUserNameInput.value.trim(),
        newPasswordInput.value.trim(),
        newEmailInput.value.trim()
      );
      if (responseData.data) {
        responseMessage.textContent = "";
        responseMessage.textContent = "Saved successfully";
      } else {
        responseMessage.textContent = "";
        responseMessage.textContent =
          "Something went wrong, check your connections";
      }
    }
  });
  cancelNewInfo.addEventListener("click", (e) => {
    e.preventDefault();
    userProfileDialog.innerHTML = "";
    userSettingsDialog.close();
    loggedInNavBar();
  });
  userSettingsDialog.showModal();
}

export async function sendDataToApi(
  newUsername,
  newPassword,
  newEmail,
  favouriteRestaurant
) {
  const loggedInUser = getLoggedInUser();
  if (!loggedInUser.token) {
    return;
  }
  let optionsJson = {};
  if (newPassword) {
    optionsJson = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${loggedInUser.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: newUsername ? newUsername : loggedInUser.username,
        password: newPassword,
        email: newEmail ? newEmail : loggedInUser.email,
        favouriteRestaurant: favouriteRestaurant
          ? favouriteRestaurant
          : loggedInUser.favouriteRestaurant,
      }),
    };
  } else {
    optionsJson = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${loggedInUser.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: newUsername ? newUsername : loggedInUser.username,
        email: newEmail ? newEmail : loggedInUser.email,
        favouriteRestaurant: favouriteRestaurant
          ? favouriteRestaurant
          : loggedInUser.favouriteRestaurant,
      }),
    };
  }
  const data = await fetchData(userUrl, optionsJson);
  userInfoByToken(loggedInUser.token);
  return data;
}

export async function uploadAvatar(file) {
  if (!file) return null;

  const { token } = getLoggedInUser();
  const form = new FormData();
  form.append("avatar", file);

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  };

  return await fetchData(`${userUrl}/avatar`, options);
}
