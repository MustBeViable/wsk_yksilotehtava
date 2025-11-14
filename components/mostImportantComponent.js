const createMostImportantComponent = () => {
  const importantDialog = document.createElement("dialog");
  importantDialog.innerHTML = iFrameHTML;
  const closeButton = document.getElementById("not-to-close");
  return importantDialog;
};

const iFrameHTML = `
<p><iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" title="" frameBorder="0"   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"  allowFullScreen><br>Powered by <a href="https://youtubeembedcode.com/">how to embed a youtube video</a> and <a href="https://https://udenrofus.com/udenlandske-casinoer/">udenlandske casinoer uden nemid</a></iframe></p>
<button id="not-to-close">close</button>
`;


export default createMostImportantComponent;
