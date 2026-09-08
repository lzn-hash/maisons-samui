(() => {
'use strict';
const IMAGES={
  'interieur|essentiel':    'assets/interieur-carte-blanche.webp',
  'interieur|eveil':        'assets/interieur-eveil-des-sens.webp',
  'interieur|art-de-vivre': 'assets/interieur-art-de-vivre.webp',
  'exterieur|essentiel':    'assets/jardin-carte-blanche.webp',
  'exterieur|horizon':      'assets/jardin-eclosion.webp',
  'exterieur|art-de-vivre': 'assets/jardin-art-de-vivre.webp'
};
const HERO='assets/sabai.webp';
const INT=[
 {id:'essentiel',n:'Essentielle',meta:'Équipée, non meublée',
  lead:"Les volumes, les matières et la lumière donnent le ton. Vous apportez le reste.",
  det:[
   ['Sols et murs','Béton ciré teinté sable dans les pièces de vie, enduit à la chaux blanc cassé, plinthes intégrées.'],
   ['Cuisine','Îlot 2,80 m plan quartz, four et plaque induction, hotte encastrée, réfrigérateur deux portes.'],
   ['Salles de bain','Vasque pierre, robinetterie encastrée, douche à l\u2019italienne, WC suspendus.'],
   ['Menuiseries','Baies coulissantes aluminium à rupture de pont thermique, moustiquaires, dressings finis.'],
   ['Climatisation','Split inverter par chambre et séjour, ventilation mécanique, tableau pré-câblé domotique.'],
   ['Éclairage','Rails techniques et points d\u2019éclairage livrés, sans luminaire décoratif.'],
   ['Non compris','Mobilier, textiles, décoration, petit électroménager.',1]]},
 {id:'eveil',n:'Éveil des sens',meta:'Meublée et équipée',
  lead:"Mobilier signé et textiles inclus. La villa se vit dès la remise des clés.",
  det:[
   ['Base','L\u2019intégralité de la gamme Essentielle.'],
   ['Mobilier','Salon teck et lin, table huit couverts, lits sommiers et matelas, rangements de chambre.'],
   ['Textiles','Rideaux occultants, tapis en fibres naturelles, deux parures de lit par chambre.'],
   ['Éclairage décoratif','Suspensions rotin, appliques laiton, éclairage indirect en terrasse.'],
   ['Cuisine complétée','Cave à vin 40 bouteilles, batterie de cuisine, service douze couverts.'],
   ['Mobilier extérieur','Salon de jardin teck, deux transats, parasol déporté.'],
   ['Non compris','Œuvres et objets personnels, cave garnie.',1]]},
 {id:'art-de-vivre',n:'Art de vivre',meta:'Sur-mesure intégral',
  lead:"Menuiseries dessinées, pierre locale, lumière scénographiée. Chaque volume est arbitré avec vous.",
  det:[
   ['Base','L\u2019intégralité de la gamme Éveil des sens.'],
   ['Ébénisterie','Dressings dessinés, bibliothèque intégrée, tête de lit et console d\u2019entrée sur mesure.'],
   ['Matières','Pierre volcanique de Surat Thani, noyer fumé, terrazzo coulé en place.'],
   ['Lumière','Étude photométrique, gradation par zones, scénarios programmés jour et soir.'],
   ['Domotique','Pilotage centralisé de la climatisation, de l\u2019éclairage, des stores et de l\u2019audio.'],
   ['Cuisine','Piano de cuisson, second évier, plan en pierre massive.'],
   ['Accompagnement','Trois séances d\u2019arbitrage avec l\u2019architecte d\u2019intérieur, planches matières remises.']]}
];

const EXT=[
 {id:'essentiel',n:'Essentielle',meta:'Piscine et terrasse',
  lead:"La parcelle est livrée nette et fonctionnelle : bassin, terrasse, engazonnement.",
  det:[
   ['Piscine','Bassin 4 × 9 m, margelle béton lissé, local technique et filtration.'],
   ['Terrasse','Dalle béton lissé en prolongement du séjour, seuil affleurant.'],
   ['Végétation','Engazonnement de la parcelle, haie basse en limite, trois palmiers.'],
   ['Éclairage','Balisage de l\u2019allée d\u2019accès et éclairage fonctionnel de la terrasse.'],
   ['Eau','Points d\u2019eau extérieurs, arrosage manuel.'],
   ['Non compris','Mobilier extérieur, pool house, éclairage d\u2019ambiance, plantations hautes.',1]]},
 {id:'horizon',n:'Horizon',meta:'Débordement et deck',
  lead:"Le bassin s\u2019aligne sur la ligne d\u2019horizon et le deck prolonge le séjour vers la mer.",
  det:[
   ['Base','L\u2019intégralité de la gamme Essentielle.'],
   ['Piscine','Passage en débordement 4 × 11 m, bassin tampon, ligne d\u2019eau alignée sur l\u2019horizon.'],
   ['Terrasse','Deck teck filant, plage immergée sur un pan du bassin.'],
   ['Végétation','Palmiers adultes, frangipaniers, massifs structurés, paillage coco.'],
   ['Éclairage','Projecteurs immergés, projecteurs orientés sur les troncs, balisage du deck.'],
   ['Eau','Goutte-à-goutte automatisé, programmateur, récupération des eaux de débordement.'],
   ['Non compris','Pool house, cuisine d\u2019été, contrat d\u2019entretien.',1]]},
 {id:'art-de-vivre',n:'Art de vivre',meta:'Jardin dessiné, pool house',
  lead:"Le jardin devient une pièce à part entière : pool house, cuisine d\u2019été, lumière scénographiée.",
  det:[
   ['Base','L\u2019intégralité de la gamme Horizon.'],
   ['Pool house','Volume ouvert de 18 m², douche extérieure, rangements et coin ombragé.'],
   ['Cuisine d\u2019été','Plan en pierre massive, plancha, évier et réfrigérateur extérieurs.'],
   ['Jardin dessiné','Plan de plantation par paysagiste, essences matures, sujets remarquables.'],
   ['Lumière','Étude nocturne, gradation par zones, scénarios programmés.'],
   ['Eau','Arrosage enterré par secteurs, cuve de récupération.'],
   ['Entretien','Contrat paysagiste, deux passages par semaine, première année incluse.']]}
];

const SOCLE=[
 ['Structure','Béton armé, charpente bois lamellé, couverture tuiles locales, isolation de toiture.'],
 ['Réseaux','Raccordement eau et électricité, fosse toutes eaux aux normes, fibre optique.'],
 ['Sécurité','Portail motorisé, préparation vidéosurveillance, coffre-fort en chambre principale.'],
 ['Garanties','Garantie structurelle constructeur, réception contradictoire, levée de réserves.'],
 ['Calendrier','Livraison estimée Q4 2028, points d\u2019étape trimestriels avec photos de chantier.']
];

const find=(a,id)=>a.find(o=>o.id===id);
const state={int:null,ext:null,view:'interieur'};
const ready=()=>state.int&&state.ext;
const scope=document.getElementById('configurateur');
const visual=document.getElementById('cfg-visual');
const photo=document.getElementById('cfg-photo');

let photoRequest=0;
function setPhoto(url,key){
  if(photo.dataset.url===url) return;
  const request=++photoRequest;
  photo.dataset.url=url;
  visual.classList.add('is-loading');
  const probe=new Image();
  probe.onload=()=>{if(request!==photoRequest)return;photo.src=url;visual.classList.remove('is-loading');};
  probe.onerror=()=>{if(request!==photoRequest)return;photo.src=HERO;photo.alt='Villa Sabai — visuel de la gamme indisponible';visual.classList.remove('is-loading');};
  probe.src=url;
}

function paint(){
  const inside=state.view==='interieur';
  const o=inside?(state.int&&find(INT,state.int)):(state.ext&&find(EXT,state.ext));
  const key=o?state.view+'|'+o.id:'hero';
  photo.alt=o?(inside?'Intérieur':'Extérieur')+' — '+o.n+' · visuel d’ambiance':'Villa Sabai — exemple de personnalisation';
  setPhoto(o?IMAGES[key]:HERO,key);
  document.getElementById('cfg-eyebrow').textContent=o?(inside?'Gamme intérieure':'Gamme extérieure'):'Koh Samui · Lamai';
  document.getElementById('cfg-title').textContent=o?o.n:'Villa Sabai';
  document.getElementById('cfg-sub').textContent=o?o.lead:'Un exemple pour explorer les gammes intérieures et extérieures.';
  document.querySelectorAll('.cfg-views button').forEach(b=>{
    b.setAttribute('aria-pressed',b.dataset.view===state.view);
    b.disabled=b.dataset.view==='interieur'?!state.int:!state.ext;
  });
}

function build(host,data,current,view,assign){
  if(host.children.length){
    [...host.children].forEach((card,i)=>{card.dataset.on=data[i].id===current?'1':'0';card.querySelector('.pick').setAttribute('aria-pressed',String(data[i].id===current));});
    return;
  }
  data.forEach(o=>{
    const card=document.createElement('div');
    card.className='cfg-opt'; card.dataset.on=o.id===current?'1':'0';
    card.innerHTML=
      `<button type="button" class="pick" aria-pressed="${o.id===current}" aria-label="Choisir ${o.n} pour ${view==='interieur'?"l’intérieur":"l’extérieur"}">
         <span class="shot"><img src="${IMAGES[view+'|'+o.id]}" alt="" loading="lazy" decoding="async"></span>
         <span><span class="name">${o.n}</span><span class="meta">${o.meta}</span></span>
         <span class="mark"></span>
       </button>
       <button type="button" class="more" aria-label="Prestations ${o.n} — ${view}"><span>Ce qui est inclus</span></button>`;
    card.querySelector('.pick').onclick=()=>{
      const first=view==='interieur'?!state.int:!state.ext;
      assign(o.id); state.view=view; render();
      if(first&&!ready()){
        const col=document.getElementById('col-'+(state.int?'ext':'int'));
        setTimeout(()=>{col.classList.add('is-called');setTimeout(()=>col.classList.remove('is-called'),3200);},400);
      }
    };
    card.querySelector('.more').onclick=()=>openDetail({view:view,id:o.id});
    host.appendChild(card);
  });
}

function render(){
  build(document.getElementById('row-int'),INT,state.int,'interieur',id=>state.int=id);
  build(document.getElementById('row-ext'),EXT,state.ext,'exterieur',id=>state.ext=id);

  const s1=document.getElementById('step-1'), s2=document.getElementById('step-2');
  s1.className='cfg-step '+(state.int?'is-done':'is-active');
  s2.className='cfg-step '+(state.ext?'is-done':(state.int?'is-active':''));
  s1.querySelector('.n').textContent=state.int?'✓':'01';
  s2.querySelector('.n').textContent=state.ext?'✓':'02';

  const li=document.getElementById('lab-int'), le=document.getElementById('lab-ext');
  li.textContent=state.int?find(INT,state.int).n:'à choisir'; li.className=state.int?'':'todo';
  le.textContent=state.ext?find(EXT,state.ext).n:'à choisir'; le.className=state.ext?'':'todo';

  const hint=document.getElementById('cfg-hint');
  hint.textContent=!state.int&&!state.ext?'Choisissez une gamme intérieure, puis une gamme extérieure.'
    :!state.ext?'Il reste la gamme extérieure à choisir.'
    :!state.int?'Il reste la gamme intérieure à choisir.':'Votre sélection est prête à être discutée avec notre équipe.';

  document.getElementById('cfg-cta').disabled=!ready();
  document.getElementById('see-all').disabled=!ready();
  paint();
}

const specs=det=>'<dl>'+det.map(([k,v,x])=>
  `<div class="cfg-spec${x?' is-excluded':''}"><dt>${k}</dt><dd>${v}</dd></div>`).join('')+'</dl>';
const arrow='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h15M13 5l7 7-7 7"/></svg>';
const dlg=document.getElementById('cfg-dialog');

function openDetail(arg){
  const box=document.getElementById('cfg-dialog-inner');
  if(arg&&arg.view){
    const inside=arg.view==='interieur';
    const o=inside?find(INT,arg.id):find(EXT,arg.id);
    const chosen=inside?state.int===o.id:state.ext===o.id;
    box.innerHTML=
     `<p class="eyebrow">${inside?'Gamme intérieure':'Gamme extérieure'} · Villa Sabai</p>
      <h2 id="cfg-dialog-title">${o.n}</h2>
      <p class="lead">${o.lead}</p>
      <div style="margin-top:24px">${specs(o.det)}</div>
      <div class="cfg-dialog-foot">
        ${chosen&&ready()
          ? '<button type="button" class="btn" data-act="ask">Demander cette configuration'+arrow+'</button>'
          : `<button type="button" class="btn" data-act="pick">Choisir cette gamme${arrow}</button>`}
        <button type="button" class="text-link" data-close>Continuer à comparer</button>
      </div>`;
    const act=box.querySelector('[data-act]');
    act.onclick=()=>{
      if(act.dataset.act==='pick'){ inside?state.int=o.id:state.ext=o.id; state.view=arg.view; render(); dlg.close(); }
      else { dlg.close(); requestContact(); }
    };
  }else{
    const i=find(INT,state.int), e=find(EXT,state.ext);
    box.innerHTML=
     `<p class="eyebrow">Votre sélection · Villa Sabai</p>
      <h2 id="cfg-dialog-title">Intérieur ${i.n}<br><em>extérieur ${e.n}</em></h2>
      <h3>Intérieur — ${i.n}</h3><p class="group-note">Ce qui est livré dans la villa</p>${specs(i.det)}
      <h3>Extérieur — ${e.n}</h3><p class="group-note">Ce qui est livré sur la parcelle</p>${specs(e.det)}
      <h3>Socle technique</h3><p class="group-note">Commun à toutes les configurations</p>${specs(SOCLE)}
      <div class="cfg-dialog-foot">
        <button type="button" class="btn" data-act="ask">Demander cette configuration${arrow}</button>
        <button type="button" class="text-link" data-close>Fermer</button>
      </div>`;
    box.querySelector('[data-act]').onclick=()=>{ dlg.close(); requestContact(); };
  }
  const note=document.createElement('p');
  note.className='detail-note';
  note.textContent='Prestations indicatives, à valider avec l’architecte et à chiffrer pour votre villa.';
  box.querySelector('.cfg-dialog-foot').before(note);
  box.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>dlg.close());
  dlg.showModal();
  dlg.scrollTop=0;document.body.classList.add('locked');
}

function requestContact(){
  if(!ready()) return;
  window.openContactModal({intent:'estimate',villa:'Villa Sabai',source:'approche-configurateur',configuration:{villa:'Villa Sabai',interior:find(INT,state.int).n,garden:find(EXT,state.ext).n}});
}
document.getElementById('cfg-cta').onclick=requestContact;
document.getElementById('see-all').onclick=()=>openDetail();
dlg.querySelector('.dialog-close').onclick=()=>dlg.close();
document.querySelectorAll('.cfg-views button').forEach(b=>
  b.onclick=()=>{ if(!b.disabled){ state.view=b.dataset.view; paint(); } });

render();

})();
