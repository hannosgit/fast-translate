browser.runtime.onMessage.addListener(executeListener);

function executeListener(message) {
    replaceSelectedText(message);
    browser.runtime.onMessage.removeListener(executeListener);
}

function replaceSelectedText(replacementText) {
    const activeEl = document.activeElement;
    const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;

    if (
        (activeElTagName == "textarea") || (activeElTagName == "input" &&
            /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
        (typeof activeEl.selectionStart == "number")
    ) {
        const before = activeEl.value.slice(0, activeEl.selectionStart);
        const after = activeEl.value.slice(activeEl.selectionEnd);

        activeEl.value = before + replacementText + after;
    } else {
        document.execCommand('insertText', false, replacementText);
    }

}

