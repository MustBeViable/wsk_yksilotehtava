import { signUpDialog } from "../variables.js";
import { revealPasswordButton } from "../utils.js";

export const signUpDialogBuilder = () => {
  const signUpDialogHTML = `
<div>
 <button id="close-sign-up">X</button>
  <form class="sign-up-form">
    <div>
    <label for="">Enter username: </label>
    <input type="text" placeholder="username" required />
    </div>

    <div>
    <label for="">Enter password: </label>
    <input id="password-input-signup" type="password" placeholder="password" required/>
    <button id="show-password-sign-up"><img id="sign-up-image" 
    src="./resources/images/eye_8276553.png" alt="show password" class="password-img"></button>
    </div>

    <div>
    <label for="">Enter email: </label>
    <input type="email" placeholder="email"/>
    <button id="submit-sign-up">Sign up</button>
    </div>
  </form>
</div>
`;
  signUpDialog.innerHTML = signUpDialogHTML;
  signUpDialog.class = "sign-up-form";
  document.getElementById("close-sign-up").addEventListener('click', (e) => {
    e.preventDefault();
    signUpDialog.close();
  })
    revealPasswordButton(
      document.getElementById("show-password-sign-up"),
      document.getElementById("password-input-signup"),
      document.getElementById("sign-up-image")
    );
    signUpDialog.showModal();
};
