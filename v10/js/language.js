(() => {
 const current=document.documentElement.lang==='en'?'en':'fr';
 const link=document.querySelector('a.language');
 if(link)link.addEventListener('click',()=>{try{localStorage.setItem('latitude-language',current==='en'?'fr':'en');}catch{}});
 // Explicit page links always keep their chosen language. Auto-detect only homepage entry.
 if(document.body.dataset.page!=='index'||document.referrer.startsWith(location.origin+'/'))return;
 try {
  const preference=localStorage.getItem('latitude-language');
  const wanted=preference||(navigator.language.toLowerCase().startsWith('fr')?'fr':'en');
  if(wanted!==current&&link)location.replace(link.href);
 } catch {}
})();
