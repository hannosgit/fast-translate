// ----- Options ----- 

function handleClick() {
  browser.runtime.openOptionsPage();
}

browser.action.onClicked.addListener(handleClick);

// ----- Business Logic ----- 

const MENU_ITEM_ID = "translate-selection";


browser.contextMenus.create({
  id: MENU_ITEM_ID,
  title: "Translating..",
  contexts: ["selection"]
});

browser.contextMenus.onShown.addListener(async (info, tab) => {
  const selectedText = info.selectionText.trim();
  const l1 = (await browser.storage.local.get('language1')).language1 || 'English';
  const l2 = (await browser.storage.local.get('language2')).language2 || 'German';

  const lang1 = getAbbreviationForLanguage(l1);
  const lang2 = getAbbreviationForLanguage(l2);
  const translatedWord1 = await fetchTranslationBing(selectedText, lang1, lang2);

  let displayedText = translatedWord1;
  if (equalsIgnoringCase(selectedText, translatedWord1)) {
    displayedText = await fetchTranslationBing(selectedText, lang2, lang1);
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

function getAbbreviationForLanguage(language) {
  let abbrevation = 'en';
  switch (language) {
    case 'German':
      abbrevation = 'de';
      break;
    case 'Italian':
      abbrevation = 'it';
      break;
    case 'French':
      abbrevation = 'fr';
      break;
    case 'Spanish':
      abbrevation = 'es';
      break;
    case 'Chinese Simplified':
      abbrevation = 'zh-Hans';
      break;
  }
  return abbrevation;
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