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
