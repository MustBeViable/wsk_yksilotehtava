import { getLoggedInUser, body } from "../variables";

export function createUserDialog() {
  const userInfo = getLoggedInUser();
  const userProfileDialog = document.createElement("dialog");
  const userDialogHTML = `
  <div id="user-profile">
    <button id="close-user-setting">X</button>
    <p>${userInfo.username}</p>
    <img src="${userInfo.email}" alt="profile picture" />
    <p id="favourite-restaurant"></p>
    <button id="change-user-information"></button>
  </div>
  `;
  userProfileDialog.textContent(userDialogHTML);
  return userProfileDialog;
}

export function openUserSetting() {
  const dialog = createUserDialog();
  body.appendChild(dialog);
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
    required
  />

  <label for="email">E-mail</label>
  <input
    id="email"
    name="email"
    type="email"
    placeholder="new email"
    inputmode="email"
    autocomplete="email"
    required
  />

    <label for="file">Set avatar: </label>
  <input id="avatar" name="file" type="file" placeholder="select file" />

  <div>
    <button type="submit">Tallenna</button>
    <button id="close-dialog-user-settings">Peruuta</button>
  </div>
</form>
    `;
    const userSettingsDialog = document.createElement("dialog");
    dialog.textContent = profileSettingsDialog;
    body.appendChild(userSettingsDialog);
    dialog.showModal();
}
