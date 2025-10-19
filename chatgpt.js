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
    input.style.color = "#fff";
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

// ---------- FETCH RESPONSE (Text + Image via API) ----------
async function fetchAIResponse(prompt,targetDiv){
  try{
    const apiURL = `https://yabes-api.pages.dev/api/ai/chat/ninja-ai?prompt=${encodeURIComponent(prompt)}`;
    const res = await fetch(apiURL);
    const data = await res.json();

    let reply = data.content || data.result || data.response || "";
    if(typeof reply !== "string") reply = JSON.stringify(reply);

    const lower = prompt.toLowerCase();
    const imageURL = data.image_url || data.image || `https://yabes-api.pages.dev/api/ai/chat/ninja-ai?prompt=${encodeURIComponent(prompt)}`;

    if(imageURL || lower.includes("generate") || lower.includes("image")){
      targetDiv.innerHTML=`<p>${reply}</p><div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
      setTimeout(()=>{
        targetDiv.innerHTML = `<p>${reply}</p><img src="${imageURL}" alt="Generated Image" onerror="this.remove();">`;
        saveChat();
      },1500);
    } else {
      targetDiv.innerHTML = wrapCodeWithCopy(reply);
    }

    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});
    saveChat();
  } catch(err){
    targetDiv.innerHTML = "❌ Error connecting to AI server.";
    console.error(err);
  }
}

// ---------- CUSTOM CONFIRM DIALOG ----------
function customConfirm(message, callback) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.5)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = 9999;

  const dialog = document.createElement("div");
  dialog.style.background = "linear-gradient(90deg,#ff007f,#00eaff)";
  dialog.style.padding = "20px";
  dialog.style.borderRadius = "12px";
  dialog.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
  dialog.style.maxWidth = "300px";
  dialog.style.textAlign = "center";
  dialog.style.color = "#fff";
  dialog.style.fontFamily = "Arial, sans-serif";

  const msg = document.createElement("p");
  msg.textContent = message;
  msg.style.marginBottom = "20px";
  dialog.appendChild(msg);

  const btnContainer = document.createElement("div");
  btnContainer.style.display = "flex";
  btnContainer.style.justifyContent = "space-between";

  const okBtn = document.createElement("button");
  okBtn.textContent = "Ok ✅";
  okBtn.style.flex = "1";
  okBtn.style.marginRight = "10px";
  okBtn.style.padding = "6px";
  okBtn.style.border = "none";
  okBtn.style.borderRadius = "6px";
  okBtn.style.cursor = "pointer";
  okBtn.style.background = "#00eaff";
  okBtn.style.color = "#111";
  okBtn.style.fontWeight = "bold";
  okBtn.addEventListener("click", ()=>{
    document.body.removeChild(overlay);
    callback(true);
  });

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel ❌";
  cancelBtn.style.flex = "1";
  cancelBtn.style.padding = "6px";
  cancelBtn.style.border = "none";
  cancelBtn.style.borderRadius = "6px";
  cancelBtn.style.cursor = "pointer";
  cancelBtn.style.background = "#ff007f";
  cancelBtn.style.color = "#fff";
  cancelBtn.style.fontWeight = "bold";
  cancelBtn.addEventListener("click", ()=>{
    document.body.removeChild(overlay);
    callback(false);
  });

  btnContainer.appendChild(okBtn);
  btnContainer.appendChild(cancelBtn);
  dialog.appendChild(btnContainer);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
}

// ---------- CLEAR CHAT BUTTON (Above Send Button, Small) ----------
const clearBtn = document.createElement("button");
clearBtn.id = "clearBtn";
clearBtn.textContent = "Clear Chat";
clearBtn.style.cssText = `
  display: block;
  margin: 4px 0;
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  background: linear-gradient(90deg,#ff007f,#00eaff);
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: 0.3s;
`;
clearBtn.addEventListener("mouseenter", ()=>clearBtn.style.opacity="0.8");
clearBtn.addEventListener("mouseleave", ()=>clearBtn.style.opacity="1");

sendBtn.parentNode.insertBefore(clearBtn, sendBtn);

clearBtn.addEventListener("click", () => {
    customConfirm("Are you sure you want to clear chat?", (confirmed)=>{
        if(confirmed){
            chatContainer.innerHTML = "";
            localStorage.removeItem("kami_flex_chat");
        }
    });
});

// ---------- SCROLL BUTTON ----------
chatContainer.addEventListener("scroll",()=>{
  const nearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight > 200;
  scrollBtn.style.display = nearBottom ? "block" : "none";
});
scrollBtn.addEventListener("click",()=>{chatContainer.scrollTop = chatContainer.scrollHeight;});

// ---------- SEND ----------
function sendMessage(){
  const prompt = input.value.trim();
  if(!prompt) return;
  input.value="";
  addMessage(prompt,"user");
  const typingDiv = showTyping();
  fetchAIResponse(prompt,typingDiv);
}

// ---------- EVENTS ----------
sendBtn.addEventListener("click",sendMessage);
input.addEventListener("keydown", e=>{if(e.key==="Enter") sendMessage();});
