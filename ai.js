const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("prompt");
const sizeSelect = document.getElementById("size"); // Optional if not used
const loader = document.getElementById("loader");
const result = document.getElementById("result");
const telegramBtn = document.getElementById("telegramBtn"); 

// Telegram Button Click
telegramBtn.addEventListener("click", () => {
  window.open("https://t.me/Kami_Broken5", "_blank");
});

// Generate Image
generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();

  if(!prompt){ 
    alert("⚠️ Please enter a prompt"); 
    return; 
  }

  loader.style.display = "block";
  result.innerHTML = "";

  try {
    // 🔥 BotFather API image URL
    const imgURL = `https://botfather.cloud/Apis/ImgGen/client.php?inputText=${encodeURIComponent(prompt)}`;

    const img = new Image();
    img.src = imgURL;
    img.alt = prompt;
    img.style.maxWidth = "100%";
    img.style.borderRadius = "12px";
    img.style.boxShadow = "0 0 15px rgba(0,0,0,0.4)";

    img.onload = () => {
        loader.style.display = "none";
        result.innerHTML = '';
        result.appendChild(img);

        // ✅ Download Button
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
          // Create a temporary link to download the image
          const a = document.createElement("a");
          a.href = imgURL;
          a.download = "kami_ai_image.png"; // File name
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };

        result.appendChild(downloadBtn);
    };

    img.onerror = () => {
      loader.style.display = "none";
      result.innerHTML = `<p style="color:red;">⚠️ Failed to generate image</p>`;
    };

  } catch(err){
    console.error(err);
    loader.style.display = "none";
    result.innerHTML = `<p style="color:red;">⚠️ Error: ${err.message}</p>`;
  }
});
