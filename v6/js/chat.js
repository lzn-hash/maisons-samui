/* Style Odoo's real launcher; never manufacture availability or proxy a click.
   Odoo alone decides when the live-chat button exists and what a click does. */
(() => {
  'use strict';
  const origin='https://latitude-samui.odoo.com';
  const selector='.o-livechat-LivechatButton, .o_livechat_button';
  const theme=`
    .o-livechat-LivechatButton,.o_livechat_button{
      width:auto!important;min-width:0!important;height:52px!important;
      padding:0 20px!important;gap:11px!important;border-radius:999px!important;
      align-items:center!important;justify-content:center!important;
      color:#fff!important;background:#16382f!important;border:1px solid #ffffff55!important;
      box-shadow:0 8px 28px #07181026!important;
      transition:transform .22s ease,box-shadow .22s ease!important;
    }
    .o-livechat-LivechatButton[hidden],.o_livechat_button[hidden],
    .o-livechat-LivechatButton.d-none,.o_livechat_button.d-none{display:none!important}
    .o-livechat-LivechatButton::after,.o_livechat_button::after{
      content:'Discuter';font:500 14px/1.2 Manrope,Arial,sans-serif;letter-spacing:0;
    }
    .o-livechat-LivechatButton>i,.o_livechat_button>i{font-size:21px!important}
    .o-livechat-LivechatButton:hover,.o_livechat_button:hover{transform:translateY(-2px);box-shadow:0 12px 30px #07181033!important}
    .o-livechat-LivechatButton:focus-visible,.o_livechat_button:focus-visible{outline:2px solid #c3d49a;outline-offset:4px}
    .o-livechat-LivechatButton-notification{display:none!important}
    @media(min-width:641px){.o-mail-ChatWindow:not(.o-mobile){width:420px!important;height:min(85vh,650px)!important;border-radius:12px!important}}
    @media(max-width:640px){.o-livechat-LivechatButton,.o_livechat_button{height:48px!important;padding:0 17px!important}}
    @media(prefers-reduced-motion:reduce){.o-livechat-LivechatButton,.o_livechat_button{transition:none!important}}
  `;
  const roots=new WeakSet();
  const observeRoot=root=>{
    if(roots.has(root))return;
    roots.add(root);
    const style=document.createElement('style');style.textContent=theme;
    (root===document?document.head:root).append(style);
    const label=()=>root.querySelectorAll(selector).forEach(button=>{
      if(button.getAttribute('aria-label')!=='Discuter avec Latitude Samui')button.setAttribute('aria-label','Discuter avec Latitude Samui');
    });
    label();new MutationObserver(label).observe(root===document?document.body:root,{childList:true,subtree:true});
  };
  observeRoot(document);
  const scan=()=>document.querySelectorAll('.o-livechat-root').forEach(root=>{if(root.shadowRoot)observeRoot(root.shadowRoot);});
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
  // Attaching a shadow root emits no outer DOM mutation; check only unstyled roots.
  setInterval(()=>{if(!document.hidden)scan();},1500);
  const load=src=>new Promise((resolve,reject)=>{
    const existing=document.querySelector('script[src="'+src+'"]');
    if(existing){resolve();return;}
    const script=document.createElement('script');script.src=src;script.async=true;script.onload=resolve;script.onerror=reject;document.head.append(script);
  });
  load(origin+'/im_livechat/loader/2').then(()=>{
    if(window.odoo?.__session_info__?.livechatData?.can_load_livechat===false)return;
    return load(origin+'/im_livechat/assets_embed.js');
  }).then(scan).catch(()=>{
    // No launcher when Odoo is unavailable. Contact/email remain in the page.
  });
})();
