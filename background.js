const menuItemId = "log-selection";

browser.menus.create({
  id: menuItemId,
  title: "Translate",
  contexts: ["selection"]
});

async function fetchTranslationBing(wordToTranslate) {
  const myHeaders = new Headers();
  myHeaders.append("Content-type", "application/x-www-form-urlencoded");
  myHeaders.append("Host", "www.bing.com");
  const body = "&from=en&to=de&text=" + wordToTranslate + "&token=yMb5YBIjP1879zwySltTzgyDwemmi97h&key=1731866254300";

  const request = new Request("https://www.bing.com/tlookupv3?isVertical=1&=&IG=6DEF3147DE7840E9A2A4271D5C6F0E18&IID=translator.5023.2", {
    method: "POST",
    headers: myHeaders,
    body: body
  });
  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json[0]?.translations[0]?.displayTarget;
  } catch (error) {
    console.error(error.message);
  }
}

function updateMenuItem(text) {
  browser.menus.update(menuItemId, {
    title: text
  });
  browser.menus.refresh();
}

browser.menus.onShown.addListener(async (info, tab) => {
  const translatedWord = await fetchTranslationBing(info.selectionText);
  if (translatedWord) {
    updateMenuItem(translatedWord); // updateMenuItem(`Translate "%s"`);
  } else {
    updateMenuItem("No Translation found");
  }
});