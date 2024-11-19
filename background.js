const MENU_ITEM_ID = "translate-selection";

browser.menus.create({
  id: MENU_ITEM_ID,
  title: "Translating..",
  contexts: ["selection"]
});

function updateMenuItem(text) {
  browser.menus.update(MENU_ITEM_ID, {
    title: text
  });
  browser.menus.refresh();
}

browser.menus.onShown.addListener(async (info, tab) => {
  const translatedWord = await fetchTranslationBing(info.selectionText.trim());
  if (translatedWord) {
    updateMenuItem(translatedWord);
  } else {
    updateMenuItem("No Translation found");
  }
});

async function fetchTranslationBing(wordToTranslate) {
  const headers = new Headers();
  headers.append("Content-type", "application/json; charset=UTF-8");
  headers.append("User-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0");
  const body = `["${wordToTranslate}"]`;

  const request = new Request("https://edge.microsoft.com/translate/translatetext?to=de", {
    method: "POST",
    headers: headers,
    body: body
  });
  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json[0]?.translations[0]?.text;
  } catch (error) {
    console.error(error.message);
  }
}