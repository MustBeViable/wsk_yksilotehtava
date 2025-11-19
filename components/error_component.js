const errorMessageComponent = (element, message, buttonText) => {
  const errorElement = document.createElement(element);
  const div = document.getElementById("error");
  document.querySelector("body").appendChild(div);
  div.innerHTML = "";
  div.setAttribute("role", "alert");
  div.setAttribute("aria-live", "polite");
  div.appendChild(errorElement);
  switch (element) {
    case "dialog": {
      errorElement.innerHTML = `
      <p><b>${message}</p></b>
      <button id="close_me">${buttonText}</button>
      `;
      document.getElementById("close_me")?.addEventListener("click", (e) => {
        e.preventDefault();
        errorElement.close();
        div.innerHTML = "";
      });
      errorElement.showModal();
      break;
    }
    case "div": {
      errorElement.innerHTML = `
      <p><b>${message}</p></b>
      `;
    }
    case "p": {
      errorElement.innerHTML = `
      <p><b>${message}</p></b>
      `;
    }
  }
};

export { errorMessageComponent };
