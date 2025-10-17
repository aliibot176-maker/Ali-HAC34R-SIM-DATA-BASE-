const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("prompt");
const sizeSelect = document.getElementById("size");
const loader = document.getElementById("loader");
const result = document.getElementById("result");
const telegramBtn = document.getElementById("telegramBtn"); // 👈 added this line

// 🎯 Telegram Button Click
telegramBtn.addEventListener("click", () => {
  window.open("https://t.me/Kami_Broken5", "_blank");
});

// 🎨 Generate Image
generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  const size = sizeSelect.value;

  if(!prompt){ 
    alert("⚠️ Please enter a prompt"); 
    return; 
  }

  loader.style.display = "block";
  result.innerHTML = "";

  try {
    // 🔥 Fetch image as blob
    const response = await fetch(`https://api.princetechn.com/api/ai/sd?apikey=prince&prompt=${encodeURIComponent(prompt)}&size=${size}`);
    if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const blob = await response.blob();
    const imgURL = URL.createObjectURL(blob);
    result.innerHTML = `<img src="${imgURL}" alt="AI Image" style="max-width:100%;border-radius:12px;box-shadow:0 0 15px rgba(0,0,0,0.4);">`;

    // 🖱️ Download Button
    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "⬇️ Download Image";
    downloadBtn.style.cssText = `
      display:block;
      margin:12px auto;
      padding:10px 16px;
      border:none;
      border-radius:8px;
      background:linear-gradient(90deg,#00eaff,#ff007f);
      color:#000;
      font-weight:600;
      cursor:pointer;
    `;
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = imgURL;
      a.download = "kami_ai_image.png";
      a.click();
    };
    result.appendChild(downloadBtn);

  } catch(err){
    console.error(err);
    result.innerHTML = `<p style="color:red;">⚠️ Error: ${err.message}</p>`;
  } finally {
    loader.style.display = "none";
  }
});
