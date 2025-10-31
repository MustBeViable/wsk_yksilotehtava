import { navBar } from "../variables.js";
import { revealPasswordButton } from "../utils.js";
import { signUpDialogBuilder } from "./signUp.js";

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
  signUpButton.addEventListener('click', (e) => {
    e.preventDefault();
    signUpDialogBuilder();
  })
};

export const logInComponent = () => {
  const logInNavBar = `
    <form action="">
      <input type="text" placeholder="username" />
      <input id="password-input-login" type="password" placeholder="password" />
      <button id="show-password-log-in">
        <img id="log-in-image" src="./resources/images/eye_8276553.png" class="password-img" />
      </button>
    </form>
    <button id="sign-up-button">or sign up</button>
  `;
  navBarBuilder(logInNavBar);
  revealPasswordButton(
    document.getElementById("show-password-log-in"),
    document.getElementById("password-input-login"),
    document.getElementById("log-in-image")
  );
  const signUpButton = document.getElementById("sign-up-button");
    signUpButton.addEventListener('click', (e) => {
    e.preventDefault();
    signUpDialogBuilder();
  })
};
