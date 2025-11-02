import { signUpDialog, userUrl } from "../variables.js";
import { fetchData, revealPasswordButton } from "../utils.js";

export const signUpDialogBuilder = () => {
  const signUpHTML = `
<div>
 <button id="close-sign-up">X</button>
  <form class="sign-up-form">
    <div>
    <label for="">Enter username: </label>
    <input id="username-input-signup" type="text" placeholder="username" required />
    </div>

    <div>
    <label for="">Enter password: </label>
    <input id="password-input-signup" type="password" placeholder="password" required/>
    <button id="show-password-sign-up"><img id="sign-up-image" 
    src="./resources/images/eye_8276553.png" alt="show password" class="password-img"></button>
    </div>

    <div>
    <label for="">Enter email: </label>
    <input type="email" placeholder="email" id="email-input-signup"/>
    <button id="submit-sign-up">Sign up</button>
    </div>
  </form>
</div>
`;
  signUpDialog.innerHTML = signUpHTML;
  signUpDialog.class = "sign-up-form";
  const inputUserName = document.getElementById("username-input-signup");
  const inputPassword = document.getElementById("password-input-signup");
  const inputEmail = document.getElementById("email-input-signup");
  document.getElementById("submit-sign-up").addEventListener("click", (e) => {
    e.preventDefault();
  })
  document.getElementById("close-sign-up").addEventListener("click", (e) => {
    e.preventDefault();
    signUpDialog.close();
  });
  revealPasswordButton(
    document.getElementById("show-password-sign-up"),
    inputPassword,
    document.getElementById("sign-up-image")
  );

  signUpDialog.showModal();
};


async function checkUsername(userName) {
  const url = userUrl + '/available/' + userName;
  try {
    return await fetchData(url);
  } catch (e) {
    console.log(e);
  }
}