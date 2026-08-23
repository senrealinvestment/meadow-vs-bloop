/*WORLD1_BANK star_bloom art-hotswap*/
(async function(){
  var SHA="f8cc72828ace6da8a82e5294307e435c108f0db1";
  var base=(document.currentScript&&document.currentScript.getAttribute("data-base"))||window.MEADOW_JS_BASE||("https://cdn.jsdelivr.net/gh/senrealinvestment/meadow-vs-bloop@"+SHA+"/");
  if(!base.endsWith("/")) base+="/";
  var mainBase=window.MEADOW_ASSET_JS_BASE||("https://cdn.jsdelivr.net/gh/senrealinvestment/meadow-vs-bloop@main/");
  if(!mainBase.endsWith("/")) mainBase+="/";
  try{
    var link=document.createElement("link");
    link.rel="stylesheet";
    link.href=mainBase+"art-hotswap.css";
    document.head.appendChild(link);
  }catch(e){}
  window.MEADOW_ASSET_EMBED=window.MEADOW_ASSET_EMBED||{};
  async function tryEval(url){
    try{ var t=await (await fetch(url)).text(); if(t&&t.indexOf("404")!==0&&t.indexOf("Couldn't find")<0) (0,eval)(t); }catch(e){}
  }
  await tryEval(mainBase+"asset-boss.js");
  for(var i=0;i<13;i++) await tryEval(mainBase+"ae"+i+".js");
  for(var i=0;i<7;i++) await tryEval(mainBase+"asset-walk."+i+".js");
  for(var i=0;i<3;i++) await tryEval(mainBase+"asset-foes."+i+".js");
  var names=[]; for(var i=0;i<12;i++) names.push("app.q"+i+".js");
  for(var i=0;i<names.length;i++){ var t=await (await fetch(base+names[i])).text(); (0,eval)(t); }
  var s=""; for(var i=0;i<12;i++){ s+=window["__MVBQ"+i]||""; try{delete window["__MVBQ"+i]}catch(e){} }
  (0,eval)(s);
})();
