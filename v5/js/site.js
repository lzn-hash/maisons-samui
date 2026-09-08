(() => {
  'use strict';
  const lang = document.documentElement.lang;
  const tr = (fr,en) => lang === 'en' ? en : fr;
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stored = (key, storage='localStorage') => { try {return window[storage].getItem(key);} catch {return null;} };
  const save = (key,value,storage='localStorage') => {try {window[storage].setItem(key,value);} catch { /* Storage is optional. */ }};
  const languageKey = window.LATITUDE_SITE?.languageStorage || 'latitude-v5-language';
  $$('[data-language]').forEach(a => a.addEventListener('click',() => save(languageKey,a.dataset.language)));
  if (!stored(languageKey) && lang === 'fr' && navigator.language && !navigator.language.toLowerCase().startsWith('fr')) {
    const destination = $('[data-language="en"]');
    if (destination) {save(languageKey,'en');const url = new URL(destination.href);url.search=location.search;url.hash=location.hash;location.replace(url.href);}
  }
  const header = $('#header'), menu=$('.menu-toggle'), nav=$('#navigation');
  const updateHeader = () => header?.classList.toggle('scrolled',scrollY>32);
  updateHeader();addEventListener('scroll',updateHeader,{passive:true});
  const setMenu = open => {
    header.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?tr('Fermer le menu','Close menu'):tr('Ouvrir le menu','Open menu'));
    document.body.classList.toggle('locked',open || !!$('dialog[open]'));
    if (!open) $$('.more-nav[open]').forEach(d => d.open=false);
  };
  menu?.addEventListener('click',() => setMenu(menu.getAttribute('aria-expanded')!=='true'));
  nav?.addEventListener('click',e => {if(e.target.closest('a'))setMenu(false);});
  document.addEventListener('click',e=> {if(!header.contains(e.target)){$$('.more-nav[open]').forEach(d=>d.open=false);if(header.classList.contains('menu-open'))setMenu(false);}});
  addEventListener('resize',() => {if(innerWidth>1170&&header.classList.contains('menu-open'))setMenu(false);},{passive:true});
  document.addEventListener('keydown',e=> {
    if(e.key==='Escape'){
      if(header.classList.contains('menu-open')){setMenu(false);menu.focus();}
      $$('.more-nav[open]').forEach(d=>{d.open=false;$('summary',d).focus();});
    }
    if(e.key==='Tab' && header.classList.contains('menu-open')){
      const focusable=$$('a,button,summary',header).filter(el=>el.getClientRects().length),first=focusable[0],last=focusable.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  const slides=$$('.hero-slide'), dots=$$('[data-slide]'), pause=$('.slideshow-pause');
  let slideIndex=0, timer=null, paused=reduced.matches;
  const showSlide = index => {
    slideIndex=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>slide.classList.toggle('active',i===slideIndex));
    dots.forEach((dot,i)=>{dot.classList.toggle('active',i===slideIndex);dot.setAttribute('aria-pressed',String(i===slideIndex));});
  };
  const schedule = () => {clearInterval(timer);if(slides.length>1&&!paused&&!document.hidden)timer=setInterval(()=>showSlide(slideIndex+1),6500);};
  const pauseLabel=()=>{if(!pause)return;pause.textContent=paused?'▷':'Ⅱ';pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?tr('Lancer le diaporama','Play slideshow'):tr('Mettre en pause','Pause slideshow'));};
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{showSlide(i);schedule();}));
  pause?.addEventListener('click',()=>{paused=!paused;pauseLabel();schedule();});
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',()=>{if(reduced.matches){paused=true;pauseLabel();schedule();}});
  pauseLabel();schedule();
  if('IntersectionObserver' in window && !reduced.matches){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.06});
    $$('.section-heading,.intro-title,.villa-card,.team-names,.people-list article,.journey-list article').forEach(el=>{el.classList.add('reveal');observer.observe(el);});
  }
  const config=$('[data-config-villa]');
  const getConfig=()=> config ? {villa:config.dataset.configVilla,interior:$('input[name="interior"]:checked',config)?.value||'Carte Blanche',garden:$('input[name="garden"]:checked',config)?.value||'Carte Blanche'} : null;
  if(config){
    const configKey='latitude-v5-config:'+config.dataset.configVilla;
    try {const previous=JSON.parse(stored(configKey,'sessionStorage')||'null');if(previous)for(const group of ['interior','garden']){const input=$$(`input[name="${group}"]`,config).find(el=>el.value===previous[group]);if(input)input.checked=true;}}catch { /* Invalid preferences use the included specification. */ }
    const update=()=>{const value=getConfig();for(const group of ['interior','garden'])$(`[data-summary="${group}"]`,config).textContent=value[group];save(configKey,JSON.stringify(value),'sessionStorage');};
    config.addEventListener('change',update);update();
  }
  window.LatitudeConfig={get:getConfig};
  $$('dialog').forEach(dialog=>{
    $$('[data-close]',dialog).forEach(button=>button.addEventListener('click',()=>dialog.close()));
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
    dialog.addEventListener('close',()=>document.body.classList.toggle('locked',!!$('dialog[open]')||header.classList.contains('menu-open')));
  });
  const lightbox=$('#lightbox');let galleryIndex=0;
  const buttons=$$('[data-gallery]'),gallery=buttons.map(b=>({src:b.dataset.gallery,caption:b.dataset.caption})),villaHero=$('.villa-hero>img');
  if(villaHero&&gallery.length)gallery.unshift({src:villaHero.src,caption:villaHero.alt});
  const showPhoto=index=>{
    galleryIndex=(index+gallery.length)%gallery.length;const photo=gallery[galleryIndex];$('#lightbox-image').src=photo.src;$('#lightbox-image').alt=photo.caption;
    $('figcaption',lightbox).textContent=`${galleryIndex+1} / ${gallery.length} — ${photo.caption}`;
  };
  buttons.forEach((b,i)=>b.addEventListener('click',()=>{showPhoto(i+(villaHero?1:0));lightbox.showModal();document.body.classList.add('locked');}));
  $('.lightbox-prev')?.addEventListener('click',()=>showPhoto(galleryIndex-1));$('.lightbox-next')?.addEventListener('click',()=>showPhoto(galleryIndex+1));
  lightbox?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(galleryIndex-1);}if(e.key==='ArrowRight'){e.preventDefault();showPhoto(galleryIndex+1);}});
  let touchStart=0;
  lightbox?.addEventListener('touchstart',e=>{touchStart=e.changedTouches[0].clientX;},{passive:true});
  lightbox?.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchStart;if(Math.abs(dx)>55)showPhoto(galleryIndex+(dx>0?-1:1));},{passive:true});
  const chat=document.createElement('button');chat.type='button';chat.className='chat-launch';
  chat.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3z"/></svg><span>'+tr('Discuter avec nous','Chat with us')+'</span>';
  document.body.append(chat);
  let chatLoading=false;
  const loadScript=src=>new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.head.append(script);});
  chat.addEventListener('click',async()=>{
    if(chatLoading)return;chatLoading=true;chat.disabled=true;
    const status=document.createElement('div');status.className='chat-status';status.setAttribute('role','status');status.textContent=tr('Ouverture du chat…','Opening the chat…');document.body.append(status);
    let watch=null,timeout=null,poll=null;
    const stop=()=>{clearTimeout(timeout);clearInterval(poll);watch?.disconnect();};
    const fallback=()=>{stop();chat.disabled=false;chatLoading=false;status.replaceChildren();status.append(document.createTextNode(tr('Le chat est indisponible pour le moment. ','The chat is unavailable right now. ')));const a=document.createElement('a');a.href='mailto:contact@latitudesamui.com';a.textContent=tr('Écrivez-nous par email.','Email us.');status.append(a);setTimeout(()=>status.remove(),14000);};
    const scan=()=>{
      const root=$('.o-livechat-root');const button=root?.shadowRoot?.querySelector('.o-livechat-LivechatButton')||$('.o-livechat-LivechatButton')||$('.o_livechat_button');
      if(button){stop();status.remove();chat.hidden=true;button.click();return true;}return false;
    };
    if(scan())return;
    try{
      watch=new MutationObserver(scan);watch.observe(document.documentElement,{childList:true,subtree:true});timeout=setTimeout(fallback,18000);
      poll=setInterval(scan,500); // Shadow DOM changes are not visible to the outer observer.
      if(!document.querySelector('script[data-latitude-odoo]')){
        const marker=document.createElement('script');marker.type='application/json';marker.dataset.latitudeOdoo='true';marker.textContent='{}';document.head.append(marker);
        await loadScript('https://latitude-samui.odoo.com/im_livechat/loader/2');await loadScript('https://latitude-samui.odoo.com/im_livechat/assets_embed.js');
      }
      scan();
    }catch{fallback();}
  });
})();
