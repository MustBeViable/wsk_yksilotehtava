const ChuckNorris = async (textElement) => {
  try {
    const response = await fetch('https://api.chucknorris.io/jokes/random')
    const JokeJSON = await response.json();
    textElement.textContent = JokeJSON.value;
  }
  catch (error) {
    textElement.textContent = "Failed to load joke, you can try refreshing or generating a new joke."
  }
}

export { ChuckNorris };