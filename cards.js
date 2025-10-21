const cards = [
  { title: "🎵 Jazz Free TV", desc: "Watch free live Jazz channels and entertainment shows.", img: "images/jazz.png", link: "jazztv.html", gradient: "from-purple-500 to-indigo-500" },
  { title: "📱 Zong Free TV", desc: "Stream your favorite channels anytime with Zong TV.", img: "images/zong.png", link: "zong.html", gradient: "from-green-500 to-blue-500" },
  { title: "💻 RDP Trial", desc: "Get free RDP trial on AppOnFly.", img: "images/rdp.png", link: "https://app.apponfly.com/trial", gradient: "from-purple-500 to-indigo-500" },
  { title: "📱 Database 2022", desc: "Access updated SIM and database tools.", img: "images/database.png", link: "database.html", gradient: "from-pink-500 to-red-500" },
  { title: "✅ Ads Check", desc: "Check your ad placements and stats.", img: "images/zong.png", link: "ads.html", gradient: "from-yellow-400 to-orange-500" },
  { title: "🗃️ Free Internet Files", desc: "Download free internet files quickly.", img: "images/file.png", link: "file.html", gradient: "from-teal-400 to-cyan-500" },
  { title: "⚡ Temp Mail ⚡", desc: "Generate temporary email addresses.", img: "images/temp.png", link: "temp.html", gradient: "from-purple-400 to-indigo-600" },
  { title: "📱 SMS Bomber", desc: "Test SMS sending for educational purposes.", img: "images/sms.png", link: "sms.html", gradient: "from-red-500 to-pink-500" },
  { title: "🤖 AI FUTURE", desc: "Generate images, text, and more with AI.", img: "images/ai.png", link: "ai.html", gradient: "from-blue-500 to-purple-500" },
];

// Grab card container and search box
const cardContainer = document.getElementById('cardContainer');
const searchBox = document.getElementById('searchBox');

// Function to render cards (with search filter)
function renderCards(filter=''){
  cardContainer.innerHTML = '';
  cards
    .filter(card => card.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach(card => {
      const div = document.createElement('div');
      div.className = `card bg-gradient-to-r ${card.gradient} rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300`;
      div.innerHTML = `
        <img src="${card.img}" alt="${card.title} Logo" class="w-full h-48 object-cover">
        <div class="p-4 text-center">
          <h3 class="font-bold text-white text-lg mb-1">${card.title}</h3>
          <p class="text-white/80 text-sm">${card.desc}</p>
        </div>
      `;
      div.addEventListener('click', () => window.open(card.link, '_blank'));
      cardContainer.appendChild(div);
    });
}

// Initial render (all cards)
renderCards();

// Search functionality
searchBox.addEventListener('input', (e) => {
  renderCards(e.target.value);
});
