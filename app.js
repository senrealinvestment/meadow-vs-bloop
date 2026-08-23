/*WORLD1 art-hotswap loader — Pixel tiny PNGs via MEADOW_ASSET_EMBED*/
(async function(){
  var base=(document.currentScript&&document.currentScript.getAttribute("data-base"))||window.MEADOW_JS_BASE||"https://cdn.jsdelivr.net/gh/senrealinvestment/meadow-vs-bloop@main/";
  if(!base.endsWith("/")) base+="/";
  window.MEADOW_ASSET_EMBED=window.MEADOW_ASSET_EMBED||{};
  async function load(url){
    var t=await (await fetch(url+"?t="+Date.now().toString(36))).text();
    if(!t||t.indexOf("Couldn't find")===0||t.indexOf("404:")===0) throw new Error("missing "+url);
    (0,eval)(t);
  }
  var embeds=['e0.js', 'e1.js', 'e2.js', 'e3.js', 'e4.js', 'e5.js', 'e6.js', 'e7.js', 'e8.js', 'e9.js', 'e10.js', 'e11.js', 'e12.js', 'e13.js', 'e14.js', 'e15.js', 'e16.js', 'e17.js', 'e18.js', 'e19.js', 'e20.js', 'e21.js', 'e22.js', 'e23.js', 'e24.js', 'e25.js', 'e26.js', 'e27.js', 'e28.js', 'e29.js', 'e30.js', 'e31.js', 'e32.js', 'e33.js', 'e34.js', 'e35.js', 'e36.js', 'e37.js', 'e38.js', 'e39.js', 'e40.js', 'e41.js', 'e42.js', 'e43.js', 'e44.js', 'e45.js', 'e46.js', 'e47.js', 'e48.js', 'e49.js', 'e50.js', 'e51.js', 'e52.js', 'e53.js', 'e54.js', 'e55.js', 'e56.js', 'e57.js', 'e58.js', 'e59.js', 'e60.js', 'e61.js', 'e62.js', 'e63.js', 'e64.js', 'e65.js', 'e66.js', 'e67.js', 'e68.js', 'e69.js', 'e70.js', 'e71.js', 'e72.js', 'e73.js', 'e74.js', 'e75.js', 'e76.js', 'e77.js', 'e78.js', 'e79.js', 'e80.js', 'e81.js', 'e82.js', 'e83.js', 'e84.js', 'e85.js', 'e86.js', 'e87.js', 'e88.js', 'e89.js', 'e90.js', 'e91.js', 'e92.js'];
  for(var i=0;i<embeds.length;i++) await load(base+embeds[i]);
  var q=['app.q0.js', 'app.q1.js', 'app.q2.js', 'app.q3.js', 'app.q4.js', 'app.q5.js', 'app.q6.js', 'app.q7.js', 'app.q8.js', 'app.q9.js', 'app.q10.js', 'app.q11.js', 'app.q12.js'];
  for(var i=0;i<q.length;i++) await load(base+q[i]);
  var s=""; for(var i=0;i<q.length;i++){ s+=window["__MVBQ"+i]||""; try{delete window["__MVBQ"+i]}catch(e){} }
  (0,eval)(s);
})();
