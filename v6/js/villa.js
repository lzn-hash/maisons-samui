(() => {
  'use strict';
  const dataElement=document.getElementById('baan-data');
  if(!dataElement)return;
  const data=JSON.parse(dataElement.textContent);
  const $=s=>document.querySelector(s);
  const option=(group,id)=>data[group].find(item=>item.id===id);
  const choice=group=>option(group,$(`input[name="${group}"]:checked`).value);
  const selection=()=>({villa:data.villa,interior:choice('interior').name,garden:choice('garden').name});
  const updateSelection=()=>{
    $('#baan-selection').textContent=`Intérieur ${choice('interior').name} · Extérieurs ${choice('garden').name}`;
  };
  document.querySelectorAll('.baan-option input').forEach(input=>input.addEventListener('change',updateSelection));
  const ask=()=>window.openContactModal({intent:'estimate',villa:data.villa,source:'baansawan-configuration',configuration:selection()});
  $('#baan-estimate').addEventListener('click',ask);
  const detail=$('#baan-detail');
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function showDetail(group,id){
    const item=option(group,id);if(!item)return;
    const selected=choice(group).id===id;
    const content=$('#baan-detail-content');
    content.innerHTML=`<p class="baan-detail-category">${group==='interior'?'Intérieur':'Extérieurs'} · ${escape(data.villa)} · ${escape(item.status)}</p><h2 id="baan-detail-title">${escape(item.name)}</h2><p>${escape(item.lead)}</p><dl>${item.specs.map(([key,value])=>`<div><dt>${escape(key)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl><div class="baan-detail-actions"><button class="btn" type="button" id="baan-detail-select">${selected?'Recevoir mon estimation':'Choisir cette gamme'}</button><button class="text-link" type="button" id="baan-detail-back">Continuer à comparer</button></div><p class="baan-note">Prestations indicatives. Matériaux, références et quantités seront précisés avec l’architecte dans la proposition de Baan Sawan.</p>`;
    $('#baan-detail-select').addEventListener('click',()=>{
      if(selected){detail.close();ask();return;}
      const radio=$(`input[name="${group}"][value="${id}"]`);
      radio.checked=true;updateSelection();detail.close();
    });
    $('#baan-detail-back').addEventListener('click',()=>detail.close());
    detail.showModal();detail.scrollTop=0;document.body.classList.add('locked');
  }
  document.querySelectorAll('[data-detail-group]').forEach(button=>button.addEventListener('click',()=>showDetail(button.dataset.detailGroup,button.dataset.detailId)));

  const gallery=$('#baan-lightbox');let current=0;
  const paint=()=>{
    const photo=data.photos[current];const img=$('#baan-lightbox-image');
    img.src=photo.src;img.alt=photo.caption;
    $('#baan-lightbox-caption').textContent=photo.caption;
    $('#baan-photo-count').textContent=`${current+1} / ${data.photos.length}`;
  };
  const move=direction=>{current=(current+direction+data.photos.length)%data.photos.length;paint();};
  document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{
    current=Number(button.dataset.photo);paint();gallery.showModal();document.body.classList.add('locked');
  }));
  $('#baan-prev').addEventListener('click',()=>move(-1));
  $('#baan-next').addEventListener('click',()=>move(1));
  gallery.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}
    if(event.key==='ArrowRight'){event.preventDefault();move(1);}
  });
  let touchStart=null;
  gallery.addEventListener('touchstart',event=>{if(event.touches.length===1)touchStart={x:event.touches[0].clientX,y:event.touches[0].clientY};},{passive:true});
  gallery.addEventListener('touchend',event=>{
    if(!touchStart||!event.changedTouches.length)return;
    const end=event.changedTouches[0],dx=end.clientX-touchStart.x,dy=end.clientY-touchStart.y;
    if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)move(dx<0?1:-1);
    touchStart=null;
  },{passive:true});
  const mapButton=$('#baan-map-open'),map=$('#baan-map'),cover=$('#baan-map-cover'),status=$('#baan-map-status');
  mapButton.addEventListener('click',()=>{
    if(mapButton.disabled)return;
    mapButton.disabled=true;status.textContent='Chargement de la carte…';
    const frame=document.createElement('iframe');
    frame.title='Emplacement provisoire de Baan Sawan — Lamai';
    frame.src='https://maps.google.com/maps?q=9.4512,100.0412&z=15&hl=fr&output=embed';
    frame.referrerPolicy='no-referrer-when-downgrade';frame.allowFullscreen=true;
    let settled=false;
    const failure=()=>{if(settled)return;settled=true;frame.remove();mapButton.disabled=false;status.textContent='La carte ne se charge pas. Réessayez ou ouvrez Google Maps ci-dessous.';};
    const timer=setTimeout(failure,15000);
    frame.addEventListener('load',()=>{if(settled)return;settled=true;clearTimeout(timer);cover.hidden=true;frame.focus();});
    frame.addEventListener('error',()=>{clearTimeout(timer);failure();});
    map.prepend(frame);
  });
  updateSelection();
})();
