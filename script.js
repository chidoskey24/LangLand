/**
 * LangLand - English ↔ Turkish translation
 * Uses the free LibreTranslate REST API.
 * API Docs: https://libretranslate.com/docs/
 *
 * NOTE:
 *  - The public instance is suitable for small projects / demos.
 *  - For production use you should self-host or obtain an API key.
 */

const translateBtn = document.getElementById('translateBtn');
const swapBtn = document.getElementById('swapBtn');
const sourceText = document.getElementById('sourceText');
const resultText = document.getElementById('resultText');
const sourceLangSelect = document.getElementById('sourceLang');
const targetLangSelect = document.getElementById('targetLang');
const serviceLink = document.getElementById('serviceLink');
const copyBtn = document.getElementById('copyBtn');

/**
 * Copy translation to clipboard and give quick feedback.
 */
copyBtn.addEventListener('click', () => {
  const text = resultText.value;
  if (!text) return;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      const original = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = original;
      }, 1500);
    })
    .catch(() => {
      alert('Could not copy to clipboard.');
    });
});

// Primary and fallback public LibreTranslate instances
const API_ENDPOINTS = [
  'https://translate.argosopentech.com/translate', // maintained by LibreTranslate maintainers
  'https://libretranslate.de/translate',           // community instance
  'https://libretranslate.com/translate'           // another public instance
];

let currentEndpointIndex = 0;

/**
 * Try to translate text using the currently selected endpoint.
 * If it fails (non-200 response or network error), automatically
 * fall back to the next endpoint in the list.
 * @param {string} text
 */
async function translate(text) {
  while (currentEndpointIndex < API_ENDPOINTS.length) {
    const url = API_ENDPOINTS[currentEndpointIndex];

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          q: text,
          source: sourceLangSelect.value,
          target: targetLangSelect.value,
          format: 'text'
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (!data.translatedText) throw new Error('Empty response');

      return data.translatedText;
    } catch (err) {
      console.warn(`Endpoint failed (${url}):`, err.message);
      currentEndpointIndex += 1; // try next endpoint
    }
  }

  throw new Error('All translation endpoints failed');
}

/**
 * Fallback to MyMemory API (public, no key required).
 * Docs: https://mymemory.translated.net/doc/spec.php
 * Note: daily limit ~1000 words for free tier.
 * @param {string} text
 */
async function translateViaMyMemory(text) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${sourceLangSelect.value}|${targetLangSelect.value}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);

  const data = await res.json();
  if (data?.responseData?.translatedText) return data.responseData.translatedText;

  throw new Error('MyMemory no translatedText');
}

/**
 * Swap the selected source and target languages.
 */
swapBtn.addEventListener('click', () => {
  const temp = sourceLangSelect.value;
  sourceLangSelect.value = targetLangSelect.value;
  targetLangSelect.value = temp;
});

/**
 * Perform translation when user clicks the button.
 */
translateBtn.addEventListener('click', async () => {
  const text = sourceText.value.trim();

  if (!text) {
    alert('Please enter text to translate.');
    return;
  }

  // Disable button to prevent duplicate requests
  translateBtn.disabled = true;
  translateBtn.textContent = 'Translating...';

  try {
    let translated;
    try {
      translated = await translate(text);
      // Update footer
      serviceLink.innerHTML = '<a href="https://libretranslate.com/" target="_blank" rel="noopener noreferrer">LibreTranslate</a>';
    } catch (e) {
      console.warn('LibreTranslate failed, trying MyMemory...', e);
      translated = await translateViaMyMemory(text);
      serviceLink.innerHTML = '<a href="https://mymemory.translated.net/" target="_blank" rel="noopener noreferrer">MyMemory</a>';
    }

    resultText.value = translated;
  } catch (err) {
    console.error(err);
    alert('Translation failed on all free endpoints. Please try again later.');
  } finally {
    translateBtn.disabled = false;
    translateBtn.textContent = 'Translate';
  }
}); 