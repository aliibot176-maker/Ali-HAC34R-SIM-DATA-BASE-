const chatContainer = document.getElementById("chatContainer");
const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("prompt");
const scrollBtn = document.getElementById("scrollBtn");
const header = document.querySelector("header");
const footer = document.querySelector("footer");
const body = document.body;

// ---------- Dark/Light Mode ----------
function applyMode() {
  const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(dark){
    body.style.background = "radial-gradient(circle at top,#0a0a18,#060610,#030307)";
    body.style.color = "#fff";
    header.style.background = "linear-gradient(90deg,#00eaff,#ff007f,#ffea00)";
    header.style.webkitBackgroundClip = "text";
    header.style.webkitTextFillColor = "transparent";
    footer.style.background = "rgba(255,255,255,0.04)";
    input.style.background = "rgba(255,255,255,0.1)";
  } else {
    body.style.background = "#f0f0f0";
    body.style.color = "#111";
    header.style.background = "none";
    header.style.webkitBackgroundClip = "none";
    header.style.webkitTextFillColor = "#111";
    footer.style.background = "#e0e0e0";
    input.style.background = "#fff";
    input.style.color = "#111";
  }
}
applyMode();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applyMode);

// ---------- SAVE + LOAD CHAT ----------
function saveChat() {
  const messages = [...chatContainer.querySelectorAll(".message")].map(m => ({
    type: m.classList.contains("user")?"user":"bot",
    html: m.innerHTML
  }));
  localStorage.setItem("kami_flex_chat", JSON.stringify(messages));
}

function loadChat() {
  const saved = localStorage.getItem("kami_flex_chat");
  if(saved){
    JSON.parse(saved).forEach(msg=>{
      const div = document.createElement("div");
      div.className = "message "+msg.type;
      div.innerHTML = msg.html;
      chatContainer.appendChild(div);
    });
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}
loadChat();

// ---------- ADD MESSAGE + TYPING ----------
function addMessage(content,type){
  const div = document.createElement("div");
  div.className = "message "+type;
  div.innerHTML = content;
  chatContainer.appendChild(div);
  chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});
  saveChat();
  return div;
}

function showTyping(){
  return addMessage('<div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>',"bot");
}

// ---------- COPY BUTTON ----------
function wrapCodeWithCopy(content){
  if(/```|<code>|[{;]/.test(content)){
    const wrapper = document.createElement("div");
    wrapper.style.position="relative";
    wrapper.innerHTML = `<pre style="background:rgba(0,0,0,0.1);padding:10px;border-radius:8px;overflow:auto;">${content}</pre>`;
    const btn = document.createElement("button");
    btn.textContent = "Copy";
    btn.style.position = "absolute";
    btn.style.top = "6px";
    btn.style.right = "6px";
    btn.style.padding = "4px 8px";
    btn.style.cursor = "pointer";
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.background = "linear-gradient(90deg,#ff007f,#00eaff)";
    btn.style.color = "#fff";
    btn.addEventListener("click",()=>navigator.clipboard.writeText(content));
    wrapper.appendChild(btn);
    return wrapper.outerHTML;
  }
  return content;
}

// ---------- FETCH RESPONSE ----------
async function fetchAIResponse(prompt,targetDiv){
  try{
    const res = await fetch(`https://yabes-api.pages.dev/api/ai/chat/ninja-ai?prompt=${encodeURIComponent(prompt)}`);
    const data = await res.json();
    let reply = data.content || data.result || data.response || "";
    if(typeof reply!=="string") reply = JSON.stringify(reply);

    const lower = prompt.toLowerCase();
    const imageURL = data.image_url || data.image || null;

    if(imageURL || lower.includes("generate") || lower.includes("image")){
      targetDiv.innerHTML=`<p>${reply}</p><div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
      setTimeout(()=>{
        const imgSrc = imageURL || `https://botfather.cloud/Apis/ImgGen/client.php?inputText=${encodeURIComponent(prompt)}`;
        targetDiv.innerHTML=`<p>${reply}</p><img src="${imgSrc}" alt="Generated Image" onerror="this.remove();">`;
        saveChat();
      },1500);
    } else {
      targetDiv.innerHTML = wrapCodeWithCopy(reply);
    }
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});
    saveChat();
  }catch(err){
    targetDiv.innerHTML = "❌ Error connecting to AI server.";
  }
}

// ---------- SEND ----------
function sendMessage(){
  const prompt = input.value.trim();
  if(!prompt) return;
  input.value="";
  addMessage(prompt,"user");
  const typingDiv = showTyping();
  fetchAIResponse(prompt,typingDiv);
}

// ---------- SCROLL BUTTON ----------
chatContainer.addEventListener("scroll",()=>{
  const nearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight > 200;
  scrollBtn.style.display = nearBottom ? "block" : "none";
});
scrollBtn.addEventListener("click",()=>{chatContainer.scrollTop = chatContainer.scrollHeight;});

// ---------- EVENTS ----------
sendBtn.addEventListener("click",sendMessage);
input.addEventListener("keydown", e=>{if(e.key==="Enter") sendMessage();});
