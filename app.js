/*WORLD1_BANK star_bloom art-hotswap*/
(async function(){
  var SHA="f8cc72828ace6da8a82e5294307e435c108f0db1";
  var base=(document.currentScript&&document.currentScript.getAttribute("data-base"))||window.MEADOW_JS_BASE||("https://cdn.jsdelivr.net/gh/senrealinvestment/meadow-vs-bloop@"+SHA+"/");
  if(!base.endsWith("/")) base+="/";
  var names=[]; for(var i=0;i<12;i++) names.push("app.q"+i+".js");
  for(var i=0;i<names.length;i++){ var t=await (await fetch(base+names[i])).text(); (0,eval)(t); }
  var s=""; for(var i=0;i<12;i++){ s+=window["__MVBQ"+i]||""; try{delete window["__MVBQ"+i]}catch(e){} }
  (0,eval)(s);
})();
