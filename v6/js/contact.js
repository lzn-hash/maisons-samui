(function(root){
  'use strict';
  const INTENTS=['contact','brochure','estimate','visit'];
  const INTERIORS=['Essentielle','Éveil des sens','Art de vivre','Carte Blanche','Éveil des Sens','Art de Vivre'];
  const GARDENS=['Essentielle','Horizon','Art de vivre','Carte Blanche','Éclosion','Art de Vivre'];
  function buildLead(data,context,configuration,language){
    const clean=(value,max=2500)=>String(value||'').replace(/\u0000/g,'').trim().slice(0,max);
    const intent=INTENTS.includes(context.intent)?context.intent:'contact';
    const lead={intent,language:language==='en'?'en':'fr',name:clean(data.name,120),email:clean(data.email,200),phone:clean(data.phone,40),message:clean(data.message),stage:clean(data.stage,80),visit:intent==='visit'?clean(data.visit,80):'',villa:clean(context.villa,100),source:clean(context.source,100)};
    if(configuration&&(!lead.villa||lead.villa===configuration.villa)){
      lead.villa=clean(configuration.villa,100);lead.configuration={interior:INTERIORS.includes(configuration.interior)?configuration.interior:'Carte Blanche',garden:GARDENS.includes(configuration.garden)?configuration.garden:'Carte Blanche'};
    }
    return lead;
  }
  function emailDraft(lead){
    const en=lead.language==='en';
    const labels=en?{contact:'Contact',brochure:'Brochure request',estimate:'Estimate request',visit:'Visit request'}:{contact:'Contact',brochure:'Demande de brochure',estimate:'Demande d’estimation',visit:'Demande de visite'};
    const subject=`${labels[lead.intent]} — ${lead.villa||'Latitude Samui'}`.replace(/[\r\n]/g,' ');
    const lines=[en?'Hello Latitude Samui,':'Bonjour Latitude Samui,','',`${en?'Request':'Demande'} : ${labels[lead.intent]}`];
    if(lead.villa)lines.push(`Villa / ${en?'Project':'Projet'} : ${lead.villa}`);
    if(lead.configuration)lines.push(`${en?'Interior':'Intérieur'} : ${lead.configuration.interior}`,`${en?'Garden':'Jardin'} : ${lead.configuration.garden}`);
    if(lead.stage)lines.push(`${en?'Project stage':'Avancement'} : ${lead.stage}`);
    if(lead.visit)lines.push(`${en?'Visit':'Visite'} : ${lead.visit}`);
    if(lead.message)lines.push('',lead.message);
    lines.push('',`${en?'Name':'Nom'} : ${lead.name}`,`Email : ${lead.email}`);
    if(lead.phone)lines.push(`${en?'Phone':'Téléphone'} / WhatsApp : ${lead.phone}`);
    lines.push('',en?'Thank you.':'Merci.');
    const body=lines.join('\n');return {subject,body,url:'mailto:contact@latitudesamui.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body)};
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={buildLead,emailDraft};
  if(!root.document)return;
  const doc=root.document,lang=doc.documentElement.lang,tr=(fr,en)=>lang==='en'?en:fr,$=s=>doc.querySelector(s);
  const dialog=$('#contact-dialog'),form=$('#contact-form');if(!dialog||!form)return;
  let context={},configuration=null,multiStep=true,lastTrigger=null,draft=null;
  const configured=()=>typeof root.LATITUDE_LEAD_SUBMITTER==='function'||!!root.LATITUDE_ODOO_LEAD_ENDPOINT||!!(root.LATITUDE_WEB3FORMS_KEY&&!root.LATITUDE_WEB3FORMS_KEY.includes('VOTRE_CLE'));
  const errors=message=>{const el=$('#form-error');el.textContent=message;el.hidden=!message;};
  const step=number=>{
    doc.querySelectorAll('[data-step]').forEach(el=>el.hidden=el.dataset.step!==String(number));$('[data-back]').hidden=!multiStep;
    if(dialog.open)setTimeout(()=>$(`[data-step="${number}"] input:not([type=hidden])`)?.focus({preventScroll:true}),0);
  };
  function open(options={},trigger){
    form.reset();errors('');draft=null;context={intent:INTENTS.includes(options.intent)?options.intent:'contact',villa:options.villa||'',source:options.source||doc.body.dataset.page};
    configuration=options.configuration||root.LatitudeConfig?.get()||null;if(configuration&&context.villa&&configuration.villa!==context.villa)configuration=null;
    lastTrigger=trigger||doc.activeElement;multiStep=['contact','visit'].includes(context.intent);
    form.elements.intent.value=context.intent;form.elements.villa.value=context.villa;form.elements.source.value=context.source;
    form.hidden=false;$('#contact-result').hidden=true;$('#email-send').hidden=false;$('#copy-request').hidden=false;$('#request-preview').parentElement.hidden=false;
    $('#visit-options').hidden=context.intent!=='visit';
    const titles={contact:tr('Parlons de<br><em>votre projet.</em>','Let’s talk about<br><em>your project.</em>'),brochure:tr('Votre prochaine<br><em>lecture.</em>','Your next<br><em>read.</em>'),estimate:tr('Donnons forme<br><em>à vos envies.</em>','Let’s shape<br><em>your ideas.</em>'),visit:tr('Venez vous<br><em>projeter.</em>','Picture<br><em>yourself here.</em>')};
    $('#contact-title').innerHTML=titles[context.intent];$('#contact-context').textContent=context.villa||'Latitude Samui';
    const descriptions={contact:tr('Quelques mots pour préparer notre premier échange.','A few details to prepare our first conversation.'),brochure:tr('Demandez les plans et les informations détaillées de la villa qui vous intéresse.','Request plans and detailed information about the villa you are interested in.'),estimate:tr('Votre sélection sera reprise dans votre demande. Les options seront chiffrées sur devis.','Your selections will be included in your enquiry. Options will be quoted individually.'),visit:tr('Sur place ou à distance, prenons le temps de découvrir votre projet.','In person or remotely, let’s take the time to explore your project.')};
    $('#contact-description').textContent=descriptions[context.intent];
    const selected=$('#form-configuration');selected.hidden=!configuration;if(configuration)selected.textContent=`${tr('Intérieur','Interior')} : ${configuration.interior}\n${tr('Jardin','Garden')} : ${configuration.garden}`;
    const submit=$('#contact-submit');submit.disabled=false;submit.firstChild.textContent=configured()?tr('Envoyer ma demande','Send my enquiry'):tr('Préparer mon email','Prepare my email');
    $('.copy-status').textContent='';step(multiStep?1:2);dialog.showModal();doc.body.classList.add('locked');
    $(`[data-step="${multiStep?1:2}"] input:not([type=hidden])`)?.focus({preventScroll:true});
  }
  root.openContactModal=options=>open(options);
  doc.addEventListener('click',e=>{const button=e.target.closest('[data-contact]');if(!button)return;e.preventDefault();open({intent:button.dataset.contact,villa:button.dataset.villa,source:button.dataset.source},button);});
  $('[data-next]').addEventListener('click',()=>step(2));$('[data-back]').addEventListener('click',()=>step(1));
  dialog.addEventListener('close',()=>lastTrigger?.focus({preventScroll:true}));
  async function send(lead){
    if(typeof root.LATITUDE_LEAD_SUBMITTER==='function'){const result=await root.LATITUDE_LEAD_SUBMITTER(lead);if(result===false||result?.success===false)throw new Error('Rejected');return result;}
    const endpoint=root.LATITUDE_ODOO_LEAD_ENDPOINT;
    if(endpoint){const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(lead),signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('Submission failed');if((response.headers.get('content-type')||'').includes('application/json')){const body=await response.json();if(body.success===false||body.error)throw new Error('Rejected');}return;}
    const response=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({access_key:root.LATITUDE_WEB3FORMS_KEY,subject:emailDraft(lead).subject,...lead}),signal:AbortSignal.timeout(15000)});
    const result=await response.json();if(!response.ok||result.success!==true)throw new Error('Rejected');
  }
  const displayDraft=lead=>{
    draft=emailDraft(lead);$('#email-send').href=draft.url;$('#request-preview').textContent=draft.body;
    $('#contact-result h3').textContent=tr('Votre demande est prête.','Your enquiry is ready.');
    $('#contact-result-text').textContent=tr('Ouvrez votre messagerie pour l’envoyer à contact@latitudesamui.com, ou copiez le texte ci-dessous. Rien n’a encore été envoyé.','Open your email app to send it to contact@latitudesamui.com, or copy the text below. Nothing has been sent yet.');
    form.hidden=true;$('#contact-result').hidden=false;$('#email-send').focus();
  };
  form.addEventListener('submit',async e=>{
    e.preventDefault();errors('');if(!$('[data-step="1"]').hidden){step(2);return;}if(!form.reportValidity())return;
    const data=Object.fromEntries(new FormData(form));if(!data.name.trim()){errors(tr('Merci de renseigner votre nom.','Please enter your name.'));form.elements.name.focus();return;}
    if(!multiStep)data.stage='';const lead=buildLead(data,context,configuration,lang);if(!configured()){displayDraft(lead);return;}
    const submit=$('#contact-submit');submit.disabled=true;
    try{await send(lead);form.hidden=true;$('#contact-result').hidden=false;$('#contact-result h3').textContent=tr('Votre demande a été envoyée.','Your enquiry has been sent.');$('#contact-result-text').textContent=tr('Merci. L’équipe Latitude Samui reviendra vers vous pour poursuivre l’échange.','Thank you. The Latitude Samui team will get back to you.');$('#email-send').hidden=true;$('#copy-request').hidden=true;$('#request-preview').parentElement.hidden=true;}
    catch{errors(tr('L’envoi direct n’a pas pu être confirmé. Vous pouvez réessayer ou nous écrire à contact@latitudesamui.com.','We could not confirm the submission. Please try again or email contact@latitudesamui.com.'));}finally{submit.disabled=false;}
  });
  $('#copy-request').addEventListener('click',async()=>{if(!draft)return;try{await navigator.clipboard.writeText(draft.subject+'\n\n'+draft.body);$('.copy-status').textContent=tr('Demande copiée.','Enquiry copied.');}catch{$('#request-preview').parentElement.open=true;$('.copy-status').textContent=tr('Sélectionnez et copiez le texte ci-dessous.','Select and copy the text below.');}});
})(typeof window==='undefined'?globalThis:window);
