const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("prompt");
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
  if (!prompt) { 
    alert("⚠️ Please enter a prompt"); 
    return; 
  }

  loader.style.display = "block";
  result.innerHTML = "";

  try {
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
      result.appendChild(img); // Only image, no download button
    };

    img.onerror = () => {
      loader.style.display = "none";
      result.innerHTML = `<p style="color:red;">⚠️ Failed to generate image</p>`;
    };

  } catch(err) {
    console.error(err);
    loader.style.display = "none";
    result.innerHTML = `<p style="color:red;">⚠️ Error: ${err.message}</p>`;
  }
});
