(() => {
  'use strict';
  const dataElement=document.getElementById('baan-data');
  if(!dataElement)return;
  const data=JSON.parse(dataElement.textContent);
  const $=s=>document.querySelector(s);
  const en=document.documentElement.lang==='en',tr=(fr,enText)=>en?enText:fr;
  const option=(group,id)=>data[group].find(item=>item.id===id);
  const choice=group=>option(group,$(`input[name="${group}"]:checked`).value);
  const selection=()=>({villa:data.villa,interior:choice('interior').name,garden:choice('garden').name});
  const updateSelection=()=>{
    $('#baan-selection').textContent=`${tr('Intérieur','Interior')} ${choice('interior').name} · ${tr('Extérieurs','Outdoors')} ${choice('garden').name}`;
  };
  document.querySelectorAll('.baan-option input').forEach(input=>input.addEventListener('change',updateSelection));
  // A label's default focus scrolls to its hidden radio, sometimes above the viewport.
  // Keep native radio activation and keyboard behavior, but focus without moving the page.
  document.querySelectorAll('.baan-option label').forEach(label=>{
    const input=label.querySelector('input');
    const clearPointerFocus=()=>{delete input.dataset.pointerFocus;};
    input.addEventListener('keydown',clearPointerFocus);
    input.addEventListener('blur',clearPointerFocus);
    label.addEventListener('click',event=>{
      if(event.target===input)return;
      event.preventDefault();
      // Programmatic focus can inherit keyboard focus styling on the first click.
      if(event.detail>0)input.dataset.pointerFocus='true';
      else clearPointerFocus();
      input.focus({preventScroll:true});
      input.click();
    });
  });
  const ask=()=>window.openContactModal({intent:'estimate',villa:data.villa,source:'baansawan-configuration',configuration:selection()});
  $('#baan-estimate').addEventListener('click',ask);
  const detail=$('#baan-detail');
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function showDetail(group,id){
    const item=option(group,id);if(!item)return;
    const selected=choice(group).id===id;
    const content=$('#baan-detail-content');
    content.innerHTML=`<p class="baan-detail-category">${group==='interior'?tr('Intérieur','Interior'):tr('Extérieurs','Outdoors')} · ${escape(data.villa)} · ${escape(item.status)}</p><h2 id="baan-detail-title">${escape(item.name)}</h2><p>${escape(item.lead)}</p><dl>${item.specs.map(([key,value])=>`<div><dt>${escape(key)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl><div class="baan-detail-actions"><button class="btn" type="button" id="baan-detail-select">${selected?tr('Recevoir mon estimation','Request my estimate'):tr('Choisir cette gamme','Choose this collection')}</button><button class="text-link" type="button" id="baan-detail-back">${tr('Continuer à comparer','Continue comparing')}</button></div><p class="baan-note">${tr('Prestations indicatives. Les matériaux, références et quantités seront précisés avec l’architecte.','Indicative features. Materials, references and quantities will be specified with the architect.')}</p>`;
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
    mapButton.disabled=true;status.textContent=tr('Chargement de la carte…','Loading the map…');
    const frame=document.createElement('iframe');
    frame.title=tr('Emplacement de ','Location of ')+data.villa;
    frame.src='https://maps.google.com/maps?q='+encodeURIComponent(data.mapQuery||'9.4512,100.0412')+'&z=15&hl='+(en?'en':'fr')+'&output=embed';
    frame.referrerPolicy='no-referrer-when-downgrade';frame.allowFullscreen=true;
    let settled=false;
    const failure=()=>{if(settled)return;settled=true;frame.remove();mapButton.disabled=false;status.textContent=tr('La carte ne se charge pas. Réessayez ou ouvrez Google Maps ci-dessous.','The map could not load. Try again or open Google Maps below.');};
    const timer=setTimeout(failure,15000);
    frame.addEventListener('load',()=>{if(settled)return;settled=true;clearTimeout(timer);cover.hidden=true;frame.focus();});
    frame.addEventListener('error',()=>{clearTimeout(timer);failure();});
    map.prepend(frame);
  });
  updateSelection();
})();
