const chatContainer = document.getElementById("chatContainer");
const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("prompt");
const scrollBtn = document.getElementById("scrollBtn");
const body = document.body;
const clearBtn = document.getElementById("clearBtn");

// Dark/Light Mode
function applyMode() {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(dark){
    body.style.background="radial-gradient(circle at top,#0a0a18,#060610,#030307)";
    body.style.color="#fff";
    input.style.background="rgba(255,255,255,0.1)";
    input.style.color="#fff";
  } else {
    body.style.background="#f0f0f0";
    body.style.color="#111";
    input.style.background="#fff";
    input.style.color="#111";
  }
}
applyMode();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyMode);

// Save/Load Chat
function saveChat(){
  const messages = [...chatContainer.querySelectorAll(".message")].map(m=>({type:m.classList.contains("user")?"user":"bot", html:m.innerHTML}));
  localStorage.setItem("kami_flex_chat", JSON.stringify(messages));
}
function loadChat(){
  const saved = localStorage.getItem("kami_flex_chat");
  if(saved){
    JSON.parse(saved).forEach(msg=>{
      const div=document.createElement("div");
      div.className="message "+msg.type;
      div.innerHTML=msg.html;
      chatContainer.appendChild(div);
    });
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}
loadChat();

// Add Message
function addMessage(content,type){
  const div=document.createElement("div");
  div.className="message "+type;
  div.innerHTML=content;
  chatContainer.appendChild(div);
  chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});
  saveChat();
  return div;
}
function showTyping(){
  return addMessage('<div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>',"bot");
}

// Fetch AI Response (Text + Image)
async function fetchAIResponse(prompt,targetDiv){
  try{
    const res = await fetch(`https://yabes-api.pages.dev/api/ai/chat/ninja-ai?prompt=${encodeURIComponent(prompt)}`);
    const data = await res.json();
    let reply = data.content || data.result || data.response || "";
    if(typeof reply!=="string") reply = JSON.stringify(reply);

    const lower = prompt.toLowerCase();
    const imageURL = data.image_url || data.image || `https://yabes-api.pages.dev/api/ai/chat/ninja-ai?prompt=${encodeURIComponent(prompt)}`;

    if(imageURL || lower.includes("generate") || lower.includes("image")){
      targetDiv.innerHTML=`<p>${reply}</p><div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
      setTimeout(()=>{
        targetDiv.innerHTML=`<p>${reply}</p><img src="${imageURL}" alt="Generated Image" onerror="this.remove();">`;
        saveChat();
      },1500);
    } else {
      targetDiv.innerHTML = reply;
    }
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});
    saveChat();
  } catch(err){
    targetDiv.innerHTML = "❌ Error connecting to AI server.";
  }
}

// Custom Confirm
function customConfirm(message,callback){
  const overlay=document.createElement("div");
  overlay.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;";
  const dialog=document.createElement("div");
  dialog.style.cssText="background:linear-gradient(90deg,#ff007f,#00eaff);padding:20px;border-radius:12px;text-align:center;color:#fff;max-width:300px;";
  const msg=document.createElement("p"); msg.textContent=message; msg.style.marginBottom="20px"; dialog.appendChild(msg);
  const btnContainer=document.createElement("div"); btnContainer.style.display="flex"; btnContainer.style.justifyContent="space-between";

  const okBtn=document.createElement("button"); okBtn.textContent="OK ✅";
  okBtn.style.cssText="flex:1;margin-right:10px;padding:6px;border:none;border-radius:6px;cursor:pointer;background:#00eaff;color:#111;font-weight:bold;";
  okBtn.addEventListener("click",()=>{document.body.removeChild(overlay); callback(true);});

  const cancelBtn=document.createElement("button"); cancelBtn.textContent="Cancel ❌";
  cancelBtn.style.cssText="flex:1;padding:6px;border:none;border-radius:6px;cursor:pointer;background:#ff007f;color:#fff;font-weight:bold;";
  cancelBtn.addEventListener("click",()=>{document.body.removeChild(overlay); callback(false);});

  btnContainer.appendChild(okBtn); btnContainer.appendChild(cancelBtn);
  dialog.appendChild(btnContainer); overlay.appendChild(dialog); document.body.appendChild(overlay);
}

// Clear Chat
clearBtn.addEventListener("click", ()=>{
  customConfirm("Are you sure you want to clear chat?", (confirmed)=>{
    if(confirmed){
      chatContainer.innerHTML="";
      localStorage.removeItem("kami_flex_chat");
    }
  });
});

// Scroll Button
chatContainer.addEventListener("scroll", ()=>{ scrollBtn.style.display=(chatContainer.scrollHeight-chatContainer.scrollTop-chatContainer.clientHeight>200)?"block":"none"; });
scrollBtn.addEventListener("click", ()=>{ chatContainer.scrollTop=chatContainer.scrollHeight; });

// Send Message
function sendMessage(){
  const prompt=input.value.trim();
  if(!prompt) return;
  input.value="";
  addMessage(prompt,"user");
  const typingDiv = showTyping();
  fetchAIResponse(prompt,typingDiv);
}
sendBtn.addEventListener("click",sendMessage);
input.addEventListener("keydown", e=>{ if(e.key==="Enter") sendMessage(); });
