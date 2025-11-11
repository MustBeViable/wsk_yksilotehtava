import { setAddShowElement } from "../variables.js";

async function randomTvShowAd() {
  const tvApiUrl = "https://api.tvmaze.com/shows/";
  let showFound = false;
  try {
    while (!showFound) {
      const id = Math.floor(Math.random() * 85000);
      const response = await fetch(tvApiUrl+id);
      if (response.ok) {
        showFound = true;
        const showObject = await response.json();
        setAddShowElement(showObject);
        const addHTML = `
        <div id="add-container">
        <h2>ADVERTISEMENT!</h2>
        <h3>${showObject?.name ?? "unknown title"}</h3>
        <figure>
        <img src="${
            showObject?.image.medium ||
            "https://placehold.co/210x295?text=No+Image"
            }" alt="shows image medium">
        <figcaption>${showObject?.summary || "failed to load content"}</figcaption>
        </figure>
        <h2>WATCH NOW!</h2>
        </div>
  `;
        return addHTML;
      }
    }
  } catch (error) {
    console.log(error);
  }
  console.log(showObject);
}

export { randomTvShowAd };
