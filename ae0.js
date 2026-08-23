window.MEADOW_ASSET_EMBED=window.MEADOW_ASSET_EMBED||{};window.MEADOW_ASSET_EMBED["sparkelody/cast/sheet.png"]="";
/*cast-init + reboot past sticky corrupt f8cc728 q chunks*/
(function(){
  if(window.__MEADOW_ART_BOOT) return;
  window.__MEADOW_ART_BOOT=1;
  var _fetch=window.fetch;
  window.fetch=function(url, opts){
    var u=String(url);
    if(/app\.q\d+\.js/.test(u) && u.indexOf("f8cc728")>=0){
      var m=u.match(/app\.q(\d+)\.js/);
      var i=m?m[1]:"0";
      return Promise.resolve(new Response("window.__MVBQ"+i+"=\"\";",{status:200, headers:{"Content-Type":"text/javascript"}}));
    }
    return _fetch.apply(this, arguments);
  };
  var s=document.createElement("script");
  s.src="https://cdn.jsdelivr.net/gh/senrealinvestment/meadow-vs-bloop@abb35df26d78a624188fa9f6d409b771d497a854/app.js";
  s.setAttribute("data-base","https://cdn.jsdelivr.net/gh/senrealinvestment/meadow-vs-bloop@e67a272ca1f58bb93b6ae86dcef670fbd0b619fb/");
  document.head.appendChild(s);
})();
