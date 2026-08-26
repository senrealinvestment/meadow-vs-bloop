/*WORLD1 loader — hard-swap frost tileset in memory on every W2*/
(async function(){
  var base=(document.currentScript&&document.currentScript.getAttribute("data-base"))||window.MEADOW_JS_BASE||"https://cdn.jsdelivr.net/gh/senrealinvestment/meadow-vs-bloop@main/";
  if(!base.endsWith("/")) base+="/";
  function isFrostLoc(){
    try{ if(window.MEADOW_START_FROST) return true; }catch(e0){}
    try{ if(/[?&(w2|frost)=1/.test(location.search)) return true; }catch(e1){}
    try{ var a=document.getElementById("app"); if(a&&a.classList.contains("world-frost")) return true; }catch(e2){}
    return false;
  }
  var bootFrost=isFrostLoc();
  try{
    var prev=sessionStorage.getItem("mvb-world");
    if(bootFrost && prev==="meadow"){
      sessionStorage.setItem("mvb-world","frost");
      var u=new URL(location.href);
      u.searchParams.set("_rebind", String(Date.now()));
      location.replace(u.toString());
      return;
    }
    sessionStorage.setItem("mvb-world", bootFrost ? "frost" : "meadow");
  }catch(eSS){}
  if(!bootFrost){
    setInterval(function(){
      if(isFrostLoc()) location.reload();
    }, 250);
  }
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
  var frostUrl=isFrostLoc();
  var embeds=['a0.js','a1.js','a2.js','a3.js','a4.js','a5.js','a6.js','a7.js','a8.js','a9.js','a10.js','a11.js','a12.js','a13.js','a14.js','a15.js','a16.js','a17.js','a18.js','a19.js','a20.js','a21.js','a22.js','a23.js','a24.js','a25.js','a26.js','embed-tiles.js','embed-frost-tiles.js','embed-npcs.js'];
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
  var frostEmbedMissing=false;
  for(var j=0;j<need.length;j++){
    var emb=window.MEADOW_ASSET_EMBED && (window.MEADOW_ASSET_EMBED[need[j]]||window.MEADOW_ASSET_EMBED["assets/"+need[j]]);
    if(!emb || (emb.indexOf("data:image")!==0 && emb.indexOf("blob:")!==0) || emb.length<64){
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
    "let tilesheet = currentTiles();",
    "if (wantFrost()) { ART.tiles = ART.frostTiles || null; } let tilesheet = currentTiles();"
  );
  s = s.replace(
    "preloadArt();\n})();",
    "preloadArt();\n  setInterval(function(){\n    if (!wantFrost()) return;\n    state.world = \"frost\";\n    ART.tiles = ART.frostTiles || null;\n    var _ap=document.getElementById(\"app\"); if(_ap) _ap.classList.add(\"world-frost\");\n    if (!ART.frostTiles) { if (!ART.locked) preloadArt(); return; }\n    if (state.scene === \"overworld\") drawWorld();\n  }, 400);\n})();"
  );
  frostUrl=isFrostLoc();
  if (frostUrl) {
    s = "var BOOT_FROST=true;" + s;
    s = s.replace(/world:\s*\"meadow\"/g, 'world: "frost"');
    s = s.replace(
      'loadImage(assetUrl("worlds/meadow/tiles.png")),',
      'loadImage(assetUrl("worlds/frost/tiles.png")),'
    );
    s = s.replace(
      "function wantFrost() {",
      "function wantFrost() { return true; "
    );
    s = s.replace(
      "ART.frostTiles = frostTiles && (frostTiles.naturalWidth || frostTiles.width) ? frostTiles : (ART.frostTiles || null);",
      "ART.frostTiles = frostTiles && (frostTiles.naturalWidth || frostTiles.width) ? frostTiles : (ART.frostTiles || null); ART.tiles = ART.frostTiles || ART.tiles;"
    );
    s = s.replace(
      "function currentTiles() {",
      "function currentTiles() { return ART.frostTiles || null; "
    );
  }
  (0,eval)(s);
})();
