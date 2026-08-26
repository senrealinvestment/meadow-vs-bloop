/*WORLD1 soft loader + frost rebind on every W2 enter*/
(async function(){
  var base=(document.currentScript&&document.currentScript.getAttribute("data-base"))||window.MEADOW_JS_BASE||"https://cdn.jsdelivr.net/gh/senrealinvestment/meadow-vs-bloop@main/";
  if(!base.endsWith("/")) base+="/";
  function isFrostLoc(){
    try{ if(window.MEADOW_START_FROST) return true; }catch(e0){}
    try{ if(/[?&](w2|frost)=1/.test(location.search)) return true; }catch(e1){}
    try{ var a=document.getElementById("app"); if(a&&a.classList.contains("world-frost")) return true; }catch(e2){}
    return false;
  }
  var frostUrl=isFrostLoc();
  try{
    var prev=sessionStorage.getItem("mvb-world");
    if(frostUrl && prev==="meadow"){
      sessionStorage.setItem("mvb-world","frost");
      location.replace(location.href);
      return;
    }
    sessionStorage.setItem("mvb-world", frostUrl ? "frost" : "meadow");
  }catch(eSS){}
  try{
    var link=document.createElement("link");
    link.rel="stylesheet";
    link.href=base+"art-hotswap.css";
    document.head.appendChild(link);
  }catch(e){}
  window.MEADOW_ASSET_EMBED=window.MEADOW_ASSET_EMBED||{};
  function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
  async function tryLoad(url){
    var lastErr=null;
    for(var attempt=0; attempt<3; attempt++){
      try{
        var resp=await fetch(url,{cache:"no-cache"});
        var t=await resp.text();
        if(!t || t.indexOf("Couldn't find")===0 || t.indexOf("404")===0 || t.indexOf("<!DOCTYPE")===0 || t.indexOf("<!doctype")===0){
          lastErr="non-js body";
          if(attempt<2) await sleep(200);
          continue;
        }
        (0,eval)(t);
        return true;
      }catch(e){
        lastErr=e;
        if(attempt<2) await sleep(200);
      }
    }
    console.error("meadow: tryLoad failed", url, lastErr);
    return false;
  }
  await tryLoad(base+"asset-boss.js");
  var embeds=['a0.js','a1.js','a2.js','a3.js','a4.js','a5.js','a6.js','a7.js','a8.js','a9.js','a10.js','a11.js','a12.js','a13.js','a14.js','a15.js','a16.js','a17.js','a18.js','a19.js','a20.js','a21.js','a22.js','a23.js','a24.js','a25.js','a26.js','embed-tiles.js','embed-frost-tiles.js','embed-npcs.js'];
  frostUrl=isFrostLoc();
  if(frostUrl){
    embeds=embeds.filter(function(e){ return e!=="embed-tiles.js"; });
  }
  for(var i=0;i<embeds.length;i++) await tryLoad(base+embeds[i]);
  var overrides=['embed-walk.js','embed-cast.js','embed-foes.js'];
  for(var oi=0;oi<overrides.length;oi++) await tryLoad(base+overrides[oi]);
  try{
    var embMap=window.MEADOW_ASSET_EMBED||{};
    var keys=Object.keys(embMap);
    for(var ri=0;ri<keys.length;ri++){
      var rk=keys[ri];
      var rv=embMap[rk];
      if(typeof rv==="string" && rv.indexOf("data:image")!==0){
        var looksB64=/^[A-Za-z0-9+/=\s]+$/.test(rv.slice(0,80)) && rv.length>100;
        if(looksB64){
          embMap[rk]="data:image/png;base64,"+rv.replace(/\s+/g,"");
        }
      }
    }
  }catch(re){ console.error("meadow: repair failed", re); }
  frostUrl=isFrostLoc();
  var need=["sparkelody/walk/sheet.png","npcs/elder-kid-sheet.png","foes/bloop-fluff-sheet.png","worlds/frost/tiles.png"];
  if(!frostUrl) need.push("worlds/meadow/tiles.png");
  var missing=false;
  var frostEmbedMissing=false;
  for(var j=0;j<need.length;j++){
    var emb=window.MEADOW_ASSET_EMBED && (window.MEADOW_ASSET_EMBED[need[j]]||window.MEADOW_ASSET_EMBED["assets/"+need[j]]);
    if(!emb || (emb.indexOf("data:image")!==0 && emb.indexOf("blob:")!==0) || emb.length<64){
      console.error("meadow: missing/short embed", need[j], emb && emb.length);
      missing=true;
      if(need[j]==="worlds/frost/tiles.png") frostEmbedMissing=true;
    }
  }
  if(frostEmbedMissing){
    try{
      var fr=await fetch(base+"assets/worlds/frost/tiles.png",{cache:"force-cache"});
      if(fr.ok){
        var blob=await fr.blob();
        if(blob && blob.size>1000){
          window.MEADOW_ASSET_EMBED["worlds/frost/tiles.png"]=URL.createObjectURL(blob);
          frostEmbedMissing=false;
        }
      }
    }catch(eFt){}
  }
  var q=['app.q0.js','app.q1.js','app.q2.js'];
  var s="";
  for(var qi=0;qi<q.length;qi++){
    await tryLoad(base+q[qi]);
    s+=window["__MVBQ"+qi]||"";
    try{delete window["__MVBQ"+qi]}catch(e){}
  }
  if(!s){ console.error("meadow: no game"); return; }
  s = s.replace(
    'if (typeof emb === "string" && emb.indexOf("data:image") === 0 && emb.length > 64)',
    'if (typeof emb === "string" && (emb.indexOf("data:image") === 0 || emb.indexOf("blob:") === 0) && emb.length > 5)'
  );
  s = s.replace(
    "function enterFrost(opts) {\n    state.world = \"frost\";",
    "function enterFrost(opts) {\n    state.world = \"frost\"; ART.tiles = ART.frostTiles || null;"
  );
  s = s.replace(
    "if (silent) return;\n    if (ART.frostTiles) drawWorld();",
    "if (ART.frostTiles) { ART.locked = !!(ART.walk && ART.npcs && ART.foes && ART.frostTiles); drawWorld(); }\n    else { showArtLoader(true); preloadArt(); }\n    if (silent) return;\n    if (false && ART.frostTiles) drawWorld();"
  );
  s = s.replace(
    "let tilesheet = currentTiles();",
    "if (wantFrost()) { ART.tiles = ART.frostTiles || null; } let tilesheet = currentTiles();"
  );
  frostUrl=isFrostLoc();
  if (frostUrl) {
    s = "var BOOT_FROST=true;" + s;
    s = s.replace(/world:\s*"meadow"/g, 'world: "frost"');
    s = s.replace(
      'loadImage(assetUrl("worlds/meadow/tiles.png")),',
      'loadImage(assetUrl("worlds/frost/tiles.png")),'
    );
    s = s.replace(
      "function wantFrost() {\n    if (BOOT_FROST) return true;",
      "function wantFrost() {\n    return true; if (BOOT_FROST) return true;"
    );
    s = s.replace(
      "function wantFrost() {",
      "function wantFrost() { return true; "
    );
    s = s.replace(
      "ART.frostTiles = frostTiles && (frostTiles.naturalWidth || frostTiles.width) ? frostTiles : null;",
      "ART.frostTiles = frostTiles && (frostTiles.naturalWidth || frostTiles.width) ? frostTiles : null; ART.tiles = ART.frostTiles || null;"
    );
    s = s.replace(
      "ctx.clearRect(0, 0, w, h);",
      "ctx.clearRect(0, 0, w, h); ctx.fillStyle=\"#bbdefb\";ctx.fillRect(0,0,w,h);"
    );
    s = s.replace(
      "function currentTiles() {",
      "function currentTiles() { return ART.frostTiles || null; "
    );
  }
  (0,eval)(s);
  window.addEventListener("pageshow", function(ev){
    if (/[?&](w2|frost)=1/.test(location.search) && ev && ev.persisted) location.reload();
  });
})();
