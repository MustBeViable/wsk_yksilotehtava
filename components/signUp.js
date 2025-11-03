import { signUpDialog, userUrl } from "../variables.js";
import { fetchData, revealPasswordButton } from "../utils.js";
import { logIn } from "./logIn.js";
import { loggedInNavBar } from "./navBar.js";

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
  const p = document.createElement("p");
  p.style.fontWeight = "bold";
  p.style.color = "red";
  document
    .getElementById("submit-sign-up")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      const isAvailable = await checkUsername(inputUserName.value);
      if (isAvailable.available) {
        const userObject = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: inputUserName.value.trim(),
            password: inputPassword.value.trim(),
            email: inputEmail.value,
          }),
        };
        await fetchData(userUrl, userObject);
        await logIn(inputUserName.value.trim(), inputPassword.value.trim());
        loggedInNavBar();
        signUpDialog.close();
      } else if (isAvailable.HTTPcode === 400) {
        p.innerText = "";
        p.innerText = `Username ${inputUserName.value} is not valid. Use something else.`;
        signUpDialog.appendChild(p);
      } else if (!isAvailable.available) {
        console.log(isAvailable.available);
        p.innerText = "";
        p.innerText = `Username ${inputUserName.value} exists already. Use something else.`;
        signUpDialog.appendChild(p);
      }
    });
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
  const url = userUrl + "/available/" + userName;
  try {
    const response = await fetchData(url, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });
    console.log(response);
    return { available: response.available, HTTPcode: response.status };
  } catch (e) {
    console.log(e);
    return { HTTPcode: e.status };
  }
}
