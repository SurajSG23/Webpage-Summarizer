function getArticleText() {

  const article = document.querySelector("article");
  if (article) {
    console.log(article);
    return article.innerText;
  }

  const article2 = Array.from(document.querySelectorAll("p"))
    .map((p) => p.innerText)
    .join("\n");

  const article3 = Array.from(document.querySelectorAll("span"))
    .map((p) => p.innerText)
    .join("\n");

  
  const text = article2 + article3;
  return text;
}

chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
  if (req.type == "GET_ARTICLE_TEXT") {
    const text = getArticleText();
    sendResponse(text);
  }
});
