document.querySelectorAll('button[data-message]').forEach(btn=>{
  btn.addEventListener('click',async()=>{
    const original=btn.innerHTML;
    const text=btn.getAttribute('data-message');
    const url=window.location.href.split('#')[0];
    try{
      if(navigator.share){await navigator.share({title:'É Pra Você',text,url});}
      else if(navigator.clipboard && window.isSecureContext){
        await navigator.clipboard.writeText(text+'\n\nÉ Pra Você: '+url);
        btn.textContent='Mensagem copiada!';
        setTimeout(()=>{btn.innerHTML=original},2200);
      } else {
        btn.textContent='Selecione a mensagem acima para compartilhar';
      }
    }catch(err){
      if(err.name!=='AbortError') btn.textContent='Compartilhe a mensagem acima';
    }
  });
});
/* Encontro leve: sem contas, trackers, storage, rede externa ou rolagem infinita. */
(() => {
  "use strict";
  const form = document.getElementById("momento-form");
  if (!form || !Array.isArray(window.EPV_MESSAGES)) return;
  const feelingEl = document.getElementById("moment-feeling");
  const timeEl = document.getElementById("moment-time");
  const result = document.getElementById("moment-result");
  const output = document.getElementById("moment-text");
  const theme = document.getElementById("result-theme");
  const alternate = document.getElementById("moment-alternate");
  const share = document.getElementById("moment-share");
  const labels = {
    paz:"Paz",saudade:"Lembranças",esperanca:"Esperança",
    gratidao:"Gratidão",coragem:"Coragem",carinho:"Carinho"
  };
  let current = null;
  let variant = 0;
  let shown = 0;
  const showMessage = (focus = true) => {
    if (!current) return;
    output.textContent = current.variants[variant];
    theme.textContent = labels[current.feeling] || "Com carinho";
    result.hidden = false;
    alternate.disabled = shown >= current.variants.length;
    alternate.textContent = alternate.disabled ? "Até a próxima mensagem" : "Ler outra versão";
    if (focus) result.focus({preventScroll: true});
  };
  form.addEventListener("submit", event => {
    event.preventDefault();
    const found = window.EPV_MESSAGES.find(item =>
      item.feeling === feelingEl.value && item.moment === timeEl.value);
    if (!found) return;
    current = found;
    const today = new Date();
    variant = (today.getFullYear() + today.getMonth() + today.getDate()) % current.variants.length;
    shown = 1;
    showMessage();
    result.scrollIntoView({behavior:"smooth",block:"nearest"});
  });
  alternate.addEventListener("click", () => {
    if (!current || shown >= current.variants.length) return;
    variant = (variant + 1) % current.variants.length;
    shown++;
    showMessage(false);
  });
  share.addEventListener("click", async () => {
    if (!current) return;
    const message = output.textContent + "\n\nÉ Pra Você: " + location.href.split("#")[0];
    const prior = share.textContent;
    try {
      if (navigator.share) {
        await navigator.share({title:"É Pra Você",text:message});
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(message);
        share.textContent = "Mensagem copiada!";
        setTimeout(() => {share.textContent = prior;}, 2100);
      } else {
        share.textContent = "Selecione o texto para compartilhar";
      }
    } catch (error) {
      if (error.name !== "AbortError") share.textContent = "Selecione o texto para compartilhar";
    }
  });
})();
