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