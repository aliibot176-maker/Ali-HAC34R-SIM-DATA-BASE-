const channelList = [
   {name:"PKvSA", logo:"https://canvas.tamashaweb.com/jazzlive/uploads/channels/logo/1760350251518.webp?id=70", url:"https://cdn01fsd-n.tamashaweb.com:8087/jazzauth/PKvSA-TOT-abr/playlist.m3u8"},
  {name:"WOMEN WC 2025", logo:"https://canvas.tamashaweb.com/jazzlive/uploads/channels/logo/1758878239255.webp?id=70", url:"https://cdn01fsd-n.tamashaweb.com:8087/jazzauth/WOMENWC2025-abr/playlist.m3u8"},
  {name:"EPL", logo:"https://canvas.tamashaweb.com/jazzlive/uploads/channels/logo/1755248383950.webp?id=18", url:"https://cdn06khi.tamashaweb.com:8087/jazzauth/EPL-A-abr/live/EPL-banner/chunks.m3u8"},
  {name:"Tamasha News", logo:"https://canvas.tamashaweb.com/jazzlive/uploads/channels/logo/1744124970890.webp?id=66", url:"https://cdn12isb.tamashaweb.com:8087/jazzauth/Tamasha-News-abr/playlist.m3u8"},
  {name:"Eurosport", logo:"https://canvas.tamashaweb.com/jazzlive/uploads/channels/1686912440-logo.webp?id=96", url:"https://cdn22lhr.tamashaweb.com:8087/jazzauth/Eurosport-abr/playlist.m3u8"},
  {name:"Ten Sports HD", logo:"https://canvas.tamashaweb.com/jazzlive/uploads/channels/logo/ten-sports-hd-logo.webp?id=64", url:"https://cdn07isb.tamashaweb.com:8087/YlUHeDQb7a/157-3H/playlist.m3u8"},
  {name:"PTV Sports", logo:"https://canvas.tamashaweb.com/jazzlive/uploads/channels/logo/1750321954030.webp?id=31", url:"https://cdn21lhr.tamashaweb.com:8087/jazzauth/PTVSports-abr/playlist.m3u8"}
];

const grid = document.getElementById("channelGrid");
channelList.forEach(ch=>{
  const img=document.createElement("img"); img.src=ch.logo; img.alt=ch.name; img.className="channel-logo";
  img.onclick=()=>playChannel(img,ch.name,ch.url);
  grid.appendChild(img);
});





