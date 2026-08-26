/*WORLD1 soft loader a0-a26 + embed-tiles + embed-npcs + embed-walk/cast/foes + repair*/
(async function(){
  var base=(document.currentScript&&document.currentScript.getAttribute("data-base"))||window.MEADOW_JS_BASE||"https://cdn.jsdelivr.net/gh/senrealinvestment/meadow-vs-bloop@main/";
  if(!base.endsWith("/")) base+="/";
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
  var embeds=['a0.js','a1.js','a2.js','a3.js','a4.js','a5.js','a6.js','a7.js','a8.js','a9.js','a10.js','a11.js','a12.js','a13.js','a14.js','a15.js','a16.js','a17.js','a18.js','a19.js','a20.js','a21.js','a22.js','a23.js','a24.js','a25.js','a26.js','embed-tiles.js','embed-npcs.js'];
  for(var i=0;i<embeds.length;i++) await tryLoad(base+embeds[i]);
  // Single-file overrides AFTER chunked a0-a26 so they win
  var overrides=['embed-walk.js','embed-cast.js','embed-foes.js'];
  for(var oi=0;oi<overrides.length;oi++) await tryLoad(base+overrides[oi]);
  // Belt-and-suspenders: repair raw base64 missing data:image prefix
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
  var need=["sparkelody/walk/sheet.png","worlds/meadow/tiles.png","npcs/elder-kid-sheet.png"];
  for(var j=0;j<need.length;j++){
    var emb=window.MEADOW_ASSET_EMBED && window.MEADOW_ASSET_EMBED[need[j]];
    if(!emb || emb.indexOf("data:image")!==0 || emb.length<1000){
      console.error("meadow: missing/short embed", need[j], emb && emb.length);
    }
  }
  var q=['app.q0.js','app.q1.js','app.q2.js'];
  var s="";
  for(var i=0;i<q.length;i++){
    await tryLoad(base+q[i]);
    s+=window["__MVBQ"+i]||"";
    try{delete window["__MVBQ"+i]}catch(e){}
  }
  if(!s){ console.error("meadow: no game"); return; }
  (0,eval)(s);
})();
