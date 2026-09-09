(() => {
  'use strict';
  const header=document.querySelector('#header');
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('#navigation');
  const mobile=matchMedia('(max-width:1170px)');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const scrim=document.createElement('div');
  scrim.className='menu-scrim';scrim.setAttribute('aria-hidden','true');
  document.body.append(scrim);
  [...nav.children].forEach((el,i)=>el.style.setProperty('--nav-order',i));
  let open=false;
  const syncInert=()=>{nav.inert=mobile.matches&&!open;};
  const setMenu=value=>{
    open=value&&mobile.matches;
    header.classList.toggle('menu-open',open);
    scrim.classList.toggle('active',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
    document.body.classList.toggle('locked',open||!!document.querySelector('dialog[open]'));
    if(!open)nav.querySelectorAll('details[open]').forEach(el=>el.open=false);
    syncInert();
  };
  syncInert();
  toggle.addEventListener('click',()=>setMenu(!open));
  scrim.addEventListener('click',()=>{setMenu(false);toggle.focus();});
  nav.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false);});
  mobile.addEventListener('change',()=>setMenu(false));
  document.addEventListener('click',event=>{
    if(!header.contains(event.target))nav.querySelectorAll('details[open]').forEach(el=>el.open=false);
  });
  const onScroll=()=>header.classList.toggle('scrolled',scrollY>24);
  onScroll();addEventListener('scroll',onScroll,{passive:true});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      if(open){setMenu(false);toggle.focus();}
      else nav.querySelectorAll('details[open]').forEach(el=>{el.open=false;el.querySelector('summary').focus();});
    }
    if(event.key==='Tab'&&open){
      const controls=[...header.querySelectorAll('a,button,summary')].filter(el=>el.getClientRects().length&&!el.closest('[inert]'));
      const first=controls[0],last=controls.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  if('IntersectionObserver' in window&&!reduced.matches){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
    }),{threshold:.06});
    document.querySelectorAll('.intro-title,.section-heading,.collection-card,.team-names').forEach(el=>{el.classList.add('reveal');observer.observe(el);});
  }
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
    dialog.addEventListener('click',event=>{
      if(event.target!==dialog)return;
      const r=dialog.getBoundingClientRect();
      if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
    });
    dialog.addEventListener('close',()=>document.body.classList.toggle('locked',open||!!document.querySelector('dialog[open]')));
  });
})();
