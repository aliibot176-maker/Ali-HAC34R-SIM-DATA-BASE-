const generateBtn = document.getElementById('generateBtn');
const telegramBtn = document.getElementById('telegramBtn');
const promptEl = document.getElementById('prompt');
const sizeEl = document.getElementById('size');
const loader = document.getElementById('loader');
const result = document.getElementById('result');
const message = document.getElementById('message');

// Telegram button
telegramBtn.addEventListener('click', () => {
  window.open('https://t.me/Kami_Broken5', '_blank');
});

// Generate button
generateBtn.addEventListener('click', async () => {
  const prompt = promptEl.value.trim();
  const size = sizeEl.value;
  if (!prompt) {
    message.textContent = '⚠️ Please enter a prompt!';
    return;
  }

  message.textContent = '';
  loader.style.display = 'block';
  result.innerHTML = ''; // clear previous image

  try {
    // 🔁 New API endpoint
    const apiUrl = `https://botfather.cloud/Apis/ImgGen/client.php?inputText=${encodeURIComponent(prompt)}`;

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Network error');

    const data = await response.json();

    // ✅ Expected API response: { "status": true, "imageUrl": "https://..." }
    if (!data.status || !data.imageUrl) {
      throw new Error('No image returned from API');
    }

    const imgSrc = data.imageUrl;

    // Display generated image
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = prompt;
    img.className = 'ai-image';
    result.appendChild(img);

    // Download button
    const download = document.createElement('span');
    download.className = 'download-single';
    download.textContent = '⬇️ Download';
    download.onclick = () => {
      const a = document.createElement('a');
      a.href = imgSrc;
      a.download = 'kami_ai_image.png';
      a.click();
    };
    result.appendChild(download);

  } catch (err) {
    console.error(err);
    message.textContent = '⚠️ Network or API error. Try again!';
  } finally {
    loader.style.display = 'none';
  }
});
