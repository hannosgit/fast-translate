const MENU_ITEM_ID = "translate-selection";
const LANGUAGE_ONE = "it";
const LANGUAGE_TWO = "de";

browser.contextMenus.create({
  id: MENU_ITEM_ID,
  title: "Translating..",
  contexts: ["selection"]
});

browser.contextMenus.onShown.addListener(async (info, tab) => {
  const selectedText = info.selectionText.trim();
  const translatedWord1 = await fetchTranslationBing(selectedText, LANGUAGE_ONE, LANGUAGE_TWO);

  let displayedText = translatedWord1;
  if(equalsIgnoringCase(selectedText, translatedWord1)){
    displayedText = await fetchTranslationBing(selectedText, LANGUAGE_TWO, LANGUAGE_ONE);
  }

  updateMenuItem(displayedText);
});

function updateMenuItem(text) {
  browser.contextMenus.update(MENU_ITEM_ID, {
    title: text
  });
  browser.contextMenus.refresh();
}

function equalsIgnoringCase(text, other) {
  return text.localeCompare(other, undefined, { sensitivity: 'base' }) === 0;
}

async function fetchTranslationBing(wordToTranslate, languageFrom, languageTo) {
  const headers = new Headers();
  headers.append("Content-type", "application/json; charset=UTF-8");
  headers.append("User-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0");
  const body = `["${wordToTranslate}"]`;

  const request = new Request(`https://edge.microsoft.com/translate/translatetext?from=${languageFrom}&to=${languageTo}`, {
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