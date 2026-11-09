(function(){
"use strict";
var input=document.getElementById("search");
if(input){
 var cards=Array.prototype.slice.call(document.querySelectorAll("#cards .story"));
 var counter=document.getElementById("count");
 var empty=document.getElementById("empty");
 function normalize(value){return (value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();}
 input.addEventListener("input",function(){
  var q=normalize(input.value),shown=0;
  cards.forEach(function(card){
   var visible=normalize(card.getAttribute("data-text")).indexOf(q)>=0;
   card.hidden=!visible;
   if(visible)shown++;
  });
  counter.textContent=shown+" mensagem"+(shown===1?"":"s")+" encontrada"+(shown===1?"":"s");
  empty.hidden=shown!==0;
 });
}
document.querySelectorAll("button[data-copy]").forEach(function(button){
 button.addEventListener("click",function(){
  var message=button.getAttribute("data-copy");
  if(!message)return;
  if(navigator.clipboard&&navigator.clipboard.writeText){
   navigator.clipboard.writeText(message).then(function(){button.textContent="Mensagem copiada ✓";})
    .catch(function(){window.prompt("Copie esta mensagem:",message);});
  }else{window.prompt("Copie esta mensagem:",message);}
 });
});
})();


/* V20 EDITORIAL FOOTER */
(function(){
  const footer=document.querySelector(".footer .container");
  if(!footer)return;
  const prefix=location.pathname.includes("/posts/")||location.pathname.includes("/temas/")?"../":"";
  for(const pair of [["Sobre","sobre.html"],["Privacidade","privacidade.html"],
   ["Transparência","transparencia.html"],["Parcerias","parcerias.html"],["RSS","feed.xml"]]){
   if(footer.querySelector('a[href="'+prefix+pair[1]+'"]'))continue;
   const link=document.createElement("a");link.textContent=pair[0];
   link.href=prefix+pair[1];footer.appendChild(link);
  }
})();

/* V21 VOLUNTARY NATIVE SHARE */
(function(){
 "use strict";
 for(const link of document.querySelectorAll('a[data-epv-native="true"]')){
  link.addEventListener("click",function(event){
   if(typeof navigator.share!=="function")return; // fallback to WhatsApp
   event.preventDefault();
   const payload={
    title:link.getAttribute("data-share-title")||"É Pra Você",
    text:link.getAttribute("data-share-text")||"",
    url:link.getAttribute("data-share-url")||location.href.split("?")[0]
   };
   navigator.share(payload).catch(function(error){
    if(error && error.name!=="AbortError")window.open(link.href,"_blank","noopener");
   });
  });
 }
})();
