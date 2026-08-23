/*WORLD1 art-hotswap soft loader a0-a49*/
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
  async function tryLoad(url){
    try{
      var t=await (await fetch(url,{cache:"no-cache"})).text();
      if(!t||t.indexOf("Couldn't find")===0||t.indexOf("404")===0) return false;
      (0,eval)(t); return true;
    }catch(e){ return false; }
  }
  await tryLoad(base+"asset-boss.js");
  var embeds=['a0.js', 'a1.js', 'a2.js', 'a3.js', 'a4.js', 'a5.js', 'a6.js', 'a7.js', 'a8.js', 'a9.js', 'a10.js', 'a11.js', 'a12.js', 'a13.js', 'a14.js', 'a15.js', 'a16.js', 'a17.js', 'a18.js', 'a19.js', 'a20.js', 'a21.js', 'a22.js', 'a23.js', 'a24.js', 'a25.js', 'a26.js', 'a27.js', 'a28.js', 'a29.js', 'a30.js', 'a31.js', 'a32.js', 'a33.js', 'a34.js', 'a35.js', 'a36.js', 'a37.js', 'a38.js', 'a39.js', 'a40.js', 'a41.js', 'a42.js', 'a43.js', 'a44.js', 'a45.js', 'a46.js', 'a47.js', 'a48.js', 'a49.js'];
  for(var i=0;i<embeds.length;i++) await tryLoad(base+embeds[i]);
  var walkEmb = window.MEADOW_ASSET_EMBED && window.MEADOW_ASSET_EMBED["sparkelody/walk/sheet.png"];
  if (!walkEmb || walkEmb.indexOf("data:image") !== 0) {
    console.error("meadow: walk sheet embed missing/empty after a0-a39", walkEmb && walkEmb.length);
  }
    var q=['app.q0.js', 'app.q1.js', 'app.q2.js', 'app.q3.js', 'app.q4.js', 'app.q5.js', 'app.q6.js', 'app.q7.js', 'app.q8.js', 'app.q9.js', 'app.q10.js', 'app.q11.js', 'app.q12.js'];
  var s="";
  for(var i=0;i<q.length;i++){
    await tryLoad(base+q[i]);
    s+=window["__MVBQ"+i]||"";
    try{delete window["__MVBQ"+i]}catch(e){}
  }
  if(!s){ console.error("meadow: no game"); return; }
  (0,eval)(s);
})();
