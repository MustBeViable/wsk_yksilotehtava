import { getLoggedInUser, navBar } from "../variables.js";
import { revealPasswordButton } from "../utils.js";
import { signUpDialogBuilder } from "./signUp.js";
import { logIn } from "./logIn.js";
import { openUserSetting } from "./userInformationEdit.js";

export const navBarBuilder = (elements) => {
  navBar.innerHTML = elements;
};

export const defaultNavBar = () => {
  const defaultElements = `
    <button id="log-in-button">Log in</button>
    <button id="sign-up-button">Sign up</button>
    `;
  navBarBuilder(defaultElements);
  const logInButton = document.getElementById("log-in-button");
  const signUpButton = document.getElementById("sign-up-button");
  logInButton.addEventListener("click", (e) => {
    e.preventDefault();
    logInComponent();
  });
  signUpButton.addEventListener("click", (e) => {
    e.preventDefault();
    signUpDialogBuilder();
  });
};

export const logInComponent = () => {
  const logInNavBar = `
    <form action="">
      <input id="username-input-login" type="text" minlength="3" maxlength="24" placeholder="username" required/>
      <input id="password-input-login" type="password" minlength="3" maxlength="24" placeholder="password" required />
      <button id="show-password-log-in">
        <img id="log-in-image" src="./resources/images/eye_8276553.png" class="password-img" />
      </button>
      <button id="log-in">Log in</button>
    </form>
    <button id="sign-up-button">or sign up</button>
  `;
  navBarBuilder(logInNavBar);
  const inputPassword = document.getElementById("password-input-login");
  const inputUserName = document.getElementById("username-input-login");
  revealPasswordButton(
    document.getElementById("show-password-log-in"),
    inputPassword,
    document.getElementById("log-in-image")
  );
  const signUpButton = document.getElementById("sign-up-button");
  const logInButton = document.getElementById("log-in");
  signUpButton.addEventListener("click", (e) => {
    e.preventDefault();
    signUpDialogBuilder();
  });
  logInButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const logInSuccess = await logIn(inputUserName.value.trim(), inputPassword.value.trim());
    if (logInSuccess) {
      loggedInNavBar();
    }
  })
};

export const loggedInNavBar = () => {
  const loggedInUser = getLoggedInUser();
  console.log(loggedInUser)
  const loggedInHTML = `
  <p>${loggedInUser.username}</p>
  <button id="open-profile-edit">Edit profile</button>
  <img id="profile-picture" src"${loggedInUser.profileImg}/>
  `;
  navBarBuilder(loggedInHTML);
  const editProfile = document.getElementById("open-profile-edit");
  editProfile.addEventListener("click", (e) => {
    e.preventDefault();
    openUserSetting();
  })
};
