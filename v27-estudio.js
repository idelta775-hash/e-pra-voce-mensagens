/* V27 interactive catalog, no cookies or tracking */
document.addEventListener('DOMContentLoaded',()=>{
 const c=document.getElementById('epv27-cat'),q=document.getElementById('epv27-search');
 const cards=[...document.querySelectorAll('#epv27-grid .epv27-card')],count=document.getElementById('epv27-count');
 if(c && q && cards.length){function filter(){
  let term=q.value.trim().toLocaleLowerCase('pt-BR');
  let num=0;for(const el of cards){
   let yes=(!c.value||el.dataset.category===c.value)&&(!term||el.dataset.search.includes(term));
   el.hidden=!yes;if(yes)num++;
  }count.textContent=num+' artes encontradas';
 }c.addEventListener('change',filter);q.addEventListener('input',filter)}
 const lib=document.getElementById('epv27-library');
 if(lib){let all=JSON.parse(document.getElementById('epv27-data').textContent);
  let cat=document.getElementById('epv27-lib-cat'),search=document.getElementById('epv27-lib-search'),page=0;
  let per=16,total=0;
  const copy=(text)=>{if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text);
   const el=document.createElement('textarea');el.value=text;document.body.appendChild(el);el.select();
   document.execCommand('copy');el.remove();return Promise.resolve()};
  function paint(){
   let q=search.value.trim().toLocaleLowerCase('pt-BR');
   let filtered=all.filter(x=>(!cat.value||x.topic===cat.value)&&(!q||x.message.toLocaleLowerCase('pt-BR').includes(q)));
   total=filtered.length;page=Math.min(page,Math.max(0,Math.ceil(total/per)-1));
   lib.replaceChildren();
   for(const x of filtered.slice(page*per,page*per+per)){
    let card=document.createElement('article');card.className='epv27-message';card.id=x.id;
    let label=document.createElement('div');label.className='topic';label.textContent=x.category;
    let msg=document.createElement('p');msg.textContent=x.message;
    let b=document.createElement('button');b.type='button';b.textContent='Copiar mensagem';
    b.addEventListener('click',()=>copy(x.message).then(()=>{b.textContent='Copiada';b.focus()}));
    card.append(label,msg,b);lib.append(card);
   }
   document.getElementById('epv27-lib-count').textContent=total+' mensagens nesta seleção';
   document.getElementById('epv27-page-count').textContent='Página '+(page+1)+' de '+Math.max(1,Math.ceil(total/per));
   document.getElementById('epv27-prev').disabled=page<=0;
   document.getElementById('epv27-next').disabled=(page+1)*per>=total;
  }
  cat.addEventListener('change',()=>{page=0;paint()});
  search.addEventListener('input',()=>{page=0;paint()});
  document.getElementById('epv27-prev').addEventListener('click',()=>{page--;paint()});
  document.getElementById('epv27-next').addEventListener('click',()=>{page++;paint()});
  paint();
 }
});
