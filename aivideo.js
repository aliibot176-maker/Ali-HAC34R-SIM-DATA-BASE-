const genBtn = document.getElementById('generateBtn');
const promptEl = document.getElementById('prompt');
const qualityEl = document.getElementById('quality');
const loader = document.getElementById('loader');
const result = document.getElementById('result');
const telegramBtn = document.getElementById('telegramBtn');

telegramBtn.addEventListener('click', () => {
  window.open('https://t.me/Kami_Broken5', '_blank');
});

async function showError(msg) {
  result.innerHTML = `<p style="color:#ff8a80">${msg}</p>`;
}

genBtn.addEventListener('click', async () => {
  const prompt = promptEl.value.trim();
  const quality = qualityEl.value;
  if (!prompt) return showError('Please enter a prompt.');

  result.innerHTML = '';
  loader.style.display = 'block';

  const api = `https://yabes-api.pages.dev/api/ai/video/v1?prompt=${encodeURIComponent(prompt)}&quality=${encodeURIComponent(quality)}`;

  try {
    const res = await fetch(api);
    if (!res.ok) throw new Error('Network error');

    const blob = await res.blob();
    let videoURL;

    if (blob.type.includes('json')) {
      const txt = await blob.text();
      const data = JSON.parse(txt);
      if (data.url) videoURL = data.url;
      else throw new Error('No video URL');
    } else {
      videoURL = URL.createObjectURL(blob);
      window.addEventListener('beforeunload', () => URL.revokeObjectURL(videoURL));
    }

    loader.style.display = 'none';
    result.innerHTML = `
      <div class="video-box">
        <div class="inner-loader" id="innerLoader">
          <div class="inner-spinner"></div>
          <p>Loading video...</p>
        </div>
        <video id="aiVideo" controls playsinline src="${videoURL}"></video>
      </div>
    `;

    const vid = document.getElementById('aiVideo');
    const innerLoader = document.getElementById('innerLoader');
    vid.addEventListener('canplay', () => {
      innerLoader.style.display = 'none';
    });

  } catch (e) {
    console.error(e);
    loader.style.display = 'none';
    showError('⚠️ Failed to load video. Try again later.');
  }
});
