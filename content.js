
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'cph-submit-plus') {
        console.log('[CPH Submit Pro]: Received submission request');
        if(message.payload.sourceCode == '' || message.payload.languageId == -1) return;
        // Select language dropdown and set value
        const languageSelect = document.querySelector('select[name="programTypeId"]');
        if (languageSelect) {
            languageSelect.value = message.payload.languageId;
            languageSelect.dispatchEvent(new Event('change'));
        }

        // Set source code in textarea
        const codeTextarea = document.getElementById('sourceCodeTextarea');
        if (codeTextarea) {
            codeTextarea.value = message.payload.sourceCode;
            codeTextarea.textContent = message.payload.sourceCode;
        } else {
            console.log('[CPH Submit Pro]: CodeTextarea not found!')
        }

        // Click submit button
        setTimeout(() => {
            const submitButton = document.querySelector('input[type="submit"]');
            if (submitButton) {
                submitButton.click();
            }
        }, 500);
    }
});
