async function saveOptions(e) {
    e.preventDefault();
    await browser.storage.local.set({
      language1: document.querySelector("#language_1").value,
      language2: document.querySelector("#language_2").value
    });
  }
  
  async function restoreOptions() {
    const res1 = await browser.storage.local.get('language1');
    document.querySelector("#language_1").value = res1.language1 || 'English';

    const res2 = await browser.storage.local.get('language2');
    document.querySelector("#language_2").value = res2.language2 || 'German';
  }

  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);
  