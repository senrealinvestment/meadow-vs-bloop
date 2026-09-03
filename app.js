/* Same-origin WORLD1-9 loader. No _rebind, no 250ms reload, no 20-chunk eval stall. */
(async function(){
  if(window.__MVB_LOADER) return;
  window.__MVB_LOADER=true;
  var base=(document.currentScript&&document.currentScript.getAttribute("data-base"))||window.MEADOW_JS_BASE||"./";
  if(!base.endsWith("/")) base+="/";

  function hideLoader(){
    try{
      var n=document.getElementById("art-loader");
      if(n){ n.classList.add("hidden"); n.style.display="none"; }
      var c=document.getElementById("world");
      if(c) c.classList.remove("art-wait");
    }catch(e){}
  }
  /* Hard stop: interactive Chrome must never sit on #art-loader forever. */
  setTimeout(hideLoader, 10000);

  try{
    var link=document.createElement("link");
    link.rel="stylesheet";
    link.href=base+"art-hotswap.css";
    document.head.appendChild(link);
  }catch(e){}

  window.MEADOW_ASSET_EMBED=window.MEADOW_ASSET_EMBED||{};
  function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }

  async function tryLoad(url, ms){
    var lastErr=null;
    var budget=typeof ms==="number"?ms:6000;
    for(var attempt=0; attempt<2; attempt++){
      var ctrl=typeof AbortController!=="undefined"?new AbortController():null;
      var to=setTimeout(function(){ try{ if(ctrl) ctrl.abort(); }catch(eA){} }, budget);
      try{
        var resp=await fetch(url, ctrl?{cache:"no-cache",signal:ctrl.signal}:{cache:"no-cache"});
        var t=await resp.text();
        clearTimeout(to);
        if(!t || t.indexOf("Couldn't find")===0 || t.indexOf("404")===0 || t.indexOf("<!DOCTYPE")===0 || t.indexOf("<!doctype")===0){
          lastErr="non-js body";
          if(attempt<1) await sleep(150);
          continue;
        }
        if(window.__MVB_BOOTED && /app\.(q|p)\d/.test(url)) return true;
        if(/__MEADOW_ART_BOOT/.test(t) && /createElement\(["']script["']\)/.test(t)){
          console.error("meadow: blocked reboot IIFE", url);
          return true;
        }
        (0,eval)(t);
        return true;
      }catch(e){
        clearTimeout(to);
        lastErr=e;
        if(attempt<1) await sleep(150);
      }
    }
    console.error("meadow: tryLoad failed", url, lastErr);
    return false;
  }

  /* Essential embeds only. Never asset-boss.js (that file injected a CDN second IIFE on old pins). */
  var embeds=["embed-tiles.js","embed-npcs.js","embed-walk.js","embed-cast.js"];
  await Promise.all(embeds.map(function(f){ return tryLoad(base+f, 10000); }));

  try{
    if(window.MEADOW_ASSET_EMBED){
      /* Never use the old slime-only foe embed. Overworld loads Pixel fluff PNGs from assets/. */
      delete window.MEADOW_ASSET_EMBED["foes/bloop-fluff-sheet.png"];
      delete window.MEADOW_ASSET_EMBED["foes/frost-bloop-fluff-sheet.png"];
      delete window.MEADOW_ASSET_EMBED["foes/ember-bloop-fluff-sheet.png"];
      delete window.MEADOW_ASSET_EMBED["foes/frost-foes.png"];
      delete window.MEADOW_ASSET_EMBED["foes/ember-foes.png"];
      delete window.MEADOW_ASSET_EMBED["bosses/ice_howl.png"];
      delete window.MEADOW_ASSET_EMBED["bosses/star_bloom.png"];
      delete window.MEADOW_ASSET_EMBED["bosses/ember_maw.png"];
      delete window.MEADOW_ASSET_EMBED["assets/foes/bloop-fluff-sheet.png"];
      delete window.MEADOW_ASSET_EMBED["assets/foes/frost-bloop-fluff-sheet.png"];
      delete window.MEADOW_ASSET_EMBED["assets/foes/ember-bloop-fluff-sheet.png"];
      delete window.MEADOW_ASSET_EMBED["assets/foes/frost-foes.png"];
      delete window.MEADOW_ASSET_EMBED["assets/foes/ember-foes.png"];
      delete window.MEADOW_ASSET_EMBED["assets/bosses/ice_howl.png"];
      delete window.MEADOW_ASSET_EMBED["assets/bosses/star_bloom.png"];
      delete window.MEADOW_ASSET_EMBED["assets/bosses/ember_maw.png"];
    }
  }catch(eEmbDel){}

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

  var gameOk=await tryLoad(base+"app.readable.js", 8000);
  /* Dual-path is dead: never fetch or eval q-chunks / a second IIFE. */
  if(window.__MVB_BOOTED) gameOk=true;
  if(!gameOk){
    console.error("meadow: readable failed; q-chain disabled (Pixel-only)");
    hideLoader();
  }
})();
