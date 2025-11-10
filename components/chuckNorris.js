const ChuckNorris = async (textElement) => {
  try {
    const response = await fetch('https://api.chucknorris.io/jokes/random')
    const JokeJSON = await response.json();
    textElement.textContent = JokeJSON.value;
  }
  catch (error) {
    console.log(error.message)
  }
}

export { ChuckNorris };