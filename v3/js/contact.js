/* ============================================================
   LATITUDE SAMUI — Modal de contact partagé / Intentions v3
   Intentions : contact | brochure | estimate | visit
   Parcours : brochure/estimate 1 étape ; contact/visit 2 étapes
   Contexte : villa, source du CTA, configuration éventuelle
   Connexion future : window.LATITUDE_LEAD_SUBMITTER ou
   window.LATITUDE_ODOO_LEAD_ENDPOINT. Web3Forms reste disponible en secours.
   ============================================================ */
(function () {
  'use strict';

  var WEB3FORMS_KEY = window.LATITUDE_WEB3FORMS_KEY || 'VOTRE_CLE_WEB3FORMS_ICI';
  var ALLOWED_INTENTS = ['contact', 'brochure', 'estimate', 'visit'];
  var currentIntent = null;
  var currentSequence = [];
  var currentStepIndex = 0;
  var currentContext = null;
  var lastContextKey = null;
  var lastFocus = null;
  var submittedSuccessfully = false;

  var PROJECT_LABELS = {
    explore: 'Je découvre l’île',
    search: 'Je cherche activement',
    ready: 'Je suis prêt à acheter',
    other: 'Autre demande'
  };

  var VISIT_LABELS = {
    onsite: 'Visite sur place',
    video: 'Visite vidéo à distance',
    unsure: 'Je ne sais pas encore'
  };

  var INTENT_LABELS = {
    contact: 'Contact',
    brochure: 'Brochure',
    estimate: 'Estimation',
    visit: 'Visite'
  };

  var css = `
    body.modal-open{overflow:hidden;touch-action:none}
    .modal-overlay{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:2rem;background:rgba(9,17,12,.72);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
    .modal-overlay.active{display:flex;animation:contactFade .25s ease}
    .modal{width:100%;max-width:760px;max-height:min(92vh,860px);display:flex;flex-direction:column;position:relative;overflow:hidden;background:var(--white-pur,#fff);color:var(--ink,#1a1e1a);border:1px solid rgba(255,255,255,.5);border-radius:10px;box-shadow:0 30px 100px rgba(0,0,0,.3);animation:contactModalIn .35s cubic-bezier(.22,1,.36,1)}
    .modal-topbar{min-height:68px;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.9rem 1rem .85rem 2.5rem;border-bottom:1px solid rgba(26,30,26,.08);background:var(--white-pur,#fff);flex:0 0 auto}
    .modal-topbar-copy{display:grid;gap:.18rem;min-width:0}
    .modal-context{font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.64rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vert-titre,#2e4600);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .modal-step-label{font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.65rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-soft,#5a5f5a)}
    .modal-close{width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid rgba(26,30,26,.15);border-radius:50%;cursor:pointer;color:var(--ink,#1a1e1a);transition:all .2s;flex:0 0 auto}
    .modal-close:hover{background:var(--jungle,#1a2e22);color:var(--white,#faf7f0);border-color:var(--jungle,#1a2e22)}
    .modal-close svg{width:16px;height:16px}
    .modal-progress{display:flex;height:3px;background:rgba(26,30,26,.05);flex:0 0 auto}
    .modal-progress-bar{flex:1;background:rgba(26,30,26,.06);transition:background .35s}
    .modal-progress-bar.done{background:var(--jungle,#1a2e22)}
    .modal-progress-bar.active{background:var(--accent,#c3d49a)}
    .modal-content{padding:2.2rem 2.5rem 1.65rem;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;flex:1;scrollbar-width:thin}
    .modal-step{display:none}
    .modal-step.active{display:block;animation:contactStepIn .28s ease}
    .modal-step h3{font-family:var(--display,"Cormorant Garamond",serif);font-size:clamp(1.8rem,4vw,2.4rem);line-height:1.05;font-weight:500;margin:0 3rem .65rem 0}
    .modal-step h3 em{font-style:italic;color:var(--vert-titre,#2e4600)}
    .modal-step .lead{font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.9rem;font-weight:300;line-height:1.6;color:var(--ink-soft,#4a4e4a);margin-bottom:1.25rem}
    .stage-question{display:none;margin:1rem 0 .7rem;font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.62rem;letter-spacing:.19em;text-transform:uppercase;color:var(--vert-titre,#2e4600)}
    .stage-question.show{display:block}
    .stage-options{display:grid;gap:.65rem}
    .stage-options input[type="radio"],.pref-options input[type="radio"]{position:absolute;opacity:0;pointer-events:none}
    .stage-option-label{min-height:72px;padding:.9rem 1rem;background:var(--cream,#f4efe6);border:1px solid rgba(26,30,26,.08);border-radius:4px;cursor:pointer;transition:background .2s,border-color .2s,transform .2s;display:flex;align-items:center;gap:.9rem}
    .stage-option-label:hover{border-color:var(--accent,#c3d49a)}
    .stage-options input:focus-visible+.stage-option-label,.pref-options input:focus-visible+.pref-option-label{outline:2px solid var(--vert-titre,#2e4600);outline-offset:2px}
    .stage-options input:checked+.stage-option-label{background:var(--jungle,#1a2e22);color:var(--white,#faf7f0);border-color:var(--jungle,#1a2e22)}
    .stage-option-icon{width:36px;height:36px;border-radius:50%;background:var(--white,#faf7f0);border:1px solid rgba(26,30,26,.1);display:flex;align-items:center;justify-content:center;color:var(--vert-titre,#2e4600);flex-shrink:0}
    .stage-option-icon svg{width:17px;height:17px}
    .stage-options input:checked+.stage-option-label .stage-option-icon{background:var(--accent,#c3d49a);color:var(--ink,#1a1e1a);border-color:var(--accent,#c3d49a)}
    .stage-option-text strong{font-family:var(--display,"Cormorant Garamond",serif);font-size:1.1rem;font-weight:600;display:block;line-height:1.15;margin-bottom:.18rem}
    .stage-option-text span{display:block;font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.76rem;font-weight:300;line-height:1.4;opacity:.72}
    .form-group{display:grid;gap:.72rem;margin-bottom:1rem}
    .form-row{display:flex;gap:.72rem}
    .form-row .form-input{flex:1;min-width:0}
    .form-input,.form-textarea{width:100%;padding:.9rem 1rem;background:var(--cream,#f4efe6);border:1px solid rgba(26,30,26,.1);border-radius:3px;font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:1rem;color:var(--ink,#1a1e1a);transition:background .2s,border-color .2s}
    .form-input:focus,.form-textarea:focus{outline:none;border-color:var(--vert-titre,#2e4600);background:var(--white,#faf7f0)}
    .form-input.invalid,.form-textarea.invalid{border-color:#a4382a}
    .form-input::placeholder,.form-textarea::placeholder{color:var(--ink-soft,#4a4e4a);opacity:.62}
    select.form-input{appearance:none;-webkit-appearance:none;padding-right:2.8rem;background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234a4e4a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .95rem center;background-size:14px}
    .phone-row{display:flex;align-items:stretch}
    .phone-prefix{min-width:66px;display:flex;align-items:center;justify-content:center;padding:0 .75rem;background:var(--cream,#f4efe6);border:1px solid rgba(26,30,26,.1);border-right:0;font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.9rem;color:var(--ink-soft,#4a4e4a)}
    .phone-row .form-input{flex:1;min-width:0}
    .pref-section{margin-top:1.15rem}
    .pref-label{font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:var(--vert-titre,#2e4600);margin-bottom:.7rem}
    .pref-options{display:grid;grid-template-columns:repeat(3,1fr);gap:.55rem}
    .pref-option-label{min-height:78px;padding:.7rem .35rem;background:var(--cream,#f4efe6);border:1px solid rgba(26,30,26,.08);border-radius:4px;cursor:pointer;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4rem;transition:all .2s}
    .pref-options input:checked+.pref-option-label{background:var(--jungle,#1a2e22);color:var(--white,#faf7f0);border-color:var(--jungle,#1a2e22)}
    .pref-option-label svg{width:22px;height:22px;color:var(--vert-titre,#2e4600)}
    .pref-options input:checked+.pref-option-label svg{color:var(--accent,#c3d49a)}
    .pref-option-label span{font-family:var(--display,"Cormorant Garamond",serif);font-size:1rem;font-weight:600}
    .form-textarea{min-height:130px;resize:vertical;line-height:1.55}
    .form-error{display:none;font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.75rem;color:#a4382a;margin:-.35rem 0 .15rem;line-height:1.4}
    .form-error.show{display:block}
    .req-note{font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.66rem;line-height:1.55;color:var(--ink-soft,#4a4e4a);margin-top:.7rem}
    .villa-context-card{display:none;grid-template-columns:minmax(220px,40%) minmax(0,1fr);align-items:center;gap:1rem;margin:0 0 1.15rem;padding:.75rem;border:1px solid rgba(46,70,0,.16);background:rgba(195,212,154,.14);border-radius:4px;overflow:hidden}
    .villa-context-card.show{display:grid}
    .villa-context-media{width:100%;aspect-ratio:16/9;overflow:hidden;background:var(--cream,#f4efe6)}
    .villa-context-image{display:block;width:100%;height:100%;object-fit:cover;object-position:center}
    .villa-context-card.image-unavailable{grid-template-columns:1fr}
    .villa-context-card.image-unavailable .villa-context-media{display:none}
    .villa-context-copy{min-width:0;padding:.2rem .5rem .2rem .15rem}
    .villa-context-kicker{font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.54rem;letter-spacing:.19em;text-transform:uppercase;color:var(--vert-titre,#2e4600);margin-bottom:.35rem}
    .villa-context-name{font-family:var(--display,"Cormorant Garamond",serif);font-size:1.45rem;font-weight:600;line-height:1.05;margin-bottom:.35rem}
    .villa-context-location{font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.7rem;letter-spacing:.06em;color:var(--ink-soft,#4a4e4a)}
    .villa-context-choices{display:none;grid-template-columns:auto minmax(0,1fr);gap:.3rem .8rem;margin-top:.65rem;font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.76rem;line-height:1.4}
    .villa-context-choices.show{display:grid}
    .villa-context-choices span{color:var(--ink-soft,#4a4e4a)}
    .villa-context-choices strong{font-weight:600;color:var(--vert-titre,#2e4600)}
    .message-section{margin-top:1.1rem}
    .message-label{font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:var(--vert-titre,#2e4600);margin-bottom:.65rem}
    .message-label span{letter-spacing:0;text-transform:none;color:var(--ink-soft,#4a4e4a)}
    .reassurance{margin-top:1rem;padding:.85rem 1rem;background:var(--cream,#f4efe6);border-left:3px solid var(--accent,#c3d49a);font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.77rem;font-weight:300;line-height:1.55;color:var(--ink-soft,#4a4e4a)}
    .reassurance strong{font-weight:600;color:var(--ink,#1a1e1a)}
    .modal-step.success{text-align:center;padding:2rem 0}
    .check-icon{width:72px;height:72px;margin:0 auto 1.25rem;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--white,#faf7f0);background:var(--jungle,#1a2e22)}
    .check-icon svg{width:34px;height:34px}
    .modal-step.success p{font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.9rem;line-height:1.65;color:var(--ink-soft,#4a4e4a);margin-top:1rem}
    .modal-step .small{font-size:.76rem!important}
    .modal-actions{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 2.5rem calc(1rem + env(safe-area-inset-bottom));border-top:1px solid rgba(26,30,26,.08);background:var(--cream,#f4efe6);flex:0 0 auto}
    .modal-back{min-height:44px;background:transparent;border:0;color:var(--ink-soft,#4a4e4a);font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.67rem;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;padding:.5rem 0}
    .modal-back[disabled]{opacity:.28;cursor:not-allowed}
    .modal-next{min-height:48px;display:inline-flex;align-items:center;justify-content:center;padding:.9rem 1.6rem;background:var(--jungle,#1a2e22);color:var(--white,#faf7f0);border:0;border-radius:999px;cursor:pointer;font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;font-weight:600;transition:background .2s,opacity .2s,transform .2s}
    .modal-next:hover{background:var(--jungle-deep,#14241b);transform:translateY(-1px)}
    .modal-next[disabled]{opacity:.6;cursor:wait}
    .submit-status{min-height:1.2rem;margin:.6rem 0 0;font-family:var(--sans,"Manrope",system-ui,sans-serif);font-size:.72rem;line-height:1.4;color:#a4382a;text-align:right}
    @keyframes contactFade{from{opacity:0}to{opacity:1}}
    @keyframes contactModalIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
    @keyframes contactStepIn{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:none}}
    @media(max-width:640px){
      .modal-overlay{padding:0;align-items:stretch;background:rgba(13,16,13,.96)}
      .modal{max-width:none;max-height:none;height:100vh;height:100dvh;border:0;border-radius:0;box-shadow:none;animation:contactSheetIn .35s cubic-bezier(.22,1,.36,1)}
      .modal-topbar{min-height:66px;padding:max(.65rem,env(safe-area-inset-top)) 1rem .65rem 1.15rem}
      .modal-context{font-size:.59rem}
      .modal-step-label{font-size:.6rem}
      .modal-content{padding:1.35rem 1.15rem 1.25rem}
      .modal-step h3{font-size:2rem;margin-right:2.4rem}
      .modal-step .lead{font-size:.86rem;margin-bottom:1rem}
      .villa-context-card{grid-template-columns:1fr;gap:0;padding:0}
      .villa-context-media{width:100%;aspect-ratio:16/9}
      .villa-context-copy{padding:.9rem 1rem 1rem}
      .villa-context-name{font-size:1.4rem}
      .stage-option-label{min-height:68px;padding:.8rem .85rem}
      .stage-option-text strong{font-size:1.05rem}
      .stage-option-text span{font-size:.72rem}
      .form-row{flex-direction:column;gap:.72rem}
      .form-input,.form-textarea{font-size:16px}
      .pref-option-label{min-height:74px}
      .modal-actions{padding:.75rem 1.15rem calc(.75rem + env(safe-area-inset-bottom));gap:.75rem}
      .modal-next{flex:1;padding:.88rem .7rem;font-size:.64rem}
      .modal-back{flex:0 0 auto}
      .submit-status{position:absolute;left:1.15rem;right:1.15rem;bottom:calc(4.7rem + env(safe-area-inset-bottom));text-align:center;background:var(--white,#faf7f0);padding:.35rem;pointer-events:none}
      @keyframes contactSheetIn{from{transform:translateY(100%)}to{transform:none}}
    }
    @media(max-width:370px){.pref-option-label span{font-size:.88rem}.modal-step h3{font-size:1.82rem}.modal-next{letter-spacing:.12em}}
    @media(prefers-reduced-motion:reduce){.modal-overlay.active,.modal,.modal-step.active{animation:none}}
  `;

  var html = `
    <div class="modal-overlay" id="contactModal" aria-hidden="true">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalContext">
        <div class="modal-topbar">
          <div class="modal-topbar-copy">
            <div class="modal-context" id="modalContext">Contact · Latitude Samui</div>
            <div class="modal-step-label" id="modalStepLabel">Étape 1 sur 3</div>
          </div>
          <button class="modal-close" id="contactModalClose" type="button" onclick="closeContactModal()" aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-progress" id="modalProgress" aria-hidden="true"></div>

        <div class="modal-content" id="modalContent">
          <div class="modal-step" id="stepStage" data-step>
            <h3 id="contactModalTitle"></h3>
            <p class="lead" id="stageLead"></p>
            <div class="stage-options">
              <input type="radio" name="stage" id="stage1" value="explore">
              <label for="stage1" class="stage-option-label"><span class="stage-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span><span class="stage-option-text"><strong>Je découvre l’île</strong><span>Phase d’exploration, sans calendrier précis.</span></span></label>

              <input type="radio" name="stage" id="stage2" value="search">
              <label for="stage2" class="stage-option-label"><span class="stage-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span><span class="stage-option-text"><strong>Je cherche activement</strong><span>Projet concret dans les 6 à 18 prochains mois.</span></span></label>

              <input type="radio" name="stage" id="stage3" value="ready">
              <label for="stage3" class="stage-option-label"><span class="stage-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg></span><span class="stage-option-text"><strong>Je suis prêt à acheter</strong><span>Budget cadré, recherche dans les 3 prochains mois.</span></span></label>

              <input type="radio" name="stage" id="stage4" value="other">
              <label for="stage4" class="stage-option-label"><span class="stage-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span><span class="stage-option-text"><strong>Autre demande</strong><span id="stageOtherDescription">Question générale, partenariat ou presse.</span></span></label>
            </div>
            <p class="form-error" id="err-stage"></p>
          </div>

          <div class="modal-step" id="stepVisit" data-step>
            <h3 id="visitTitle"></h3>
            <p class="lead">Choisissez simplement le format qui vous convient. Nous préciserons ensemble le créneau et les modalités.</p>
            <div class="stage-options">
              <input type="radio" name="visitType" id="visit1" value="onsite">
              <label for="visit1" class="stage-option-label"><span class="stage-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg></span><span class="stage-option-text"><strong>Visite sur place</strong><span>Découvrir la villa et son environnement à Koh Samui.</span></span></label>

              <input type="radio" name="visitType" id="visit2" value="video">
              <label for="visit2" class="stage-option-label"><span class="stage-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="13" height="14" rx="2"/><path d="M16 10l5-3v10l-5-3z"/></svg></span><span class="stage-option-text"><strong>Visite vidéo à distance</strong><span>Un échange personnalisé avec présentation du projet.</span></span></label>

              <input type="radio" name="visitType" id="visit3" value="unsure">
              <label for="visit3" class="stage-option-label"><span class="stage-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.7 2.7 0 0 1 5.2 1c0 1.8-2.7 2.6-2.7 4"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span><span class="stage-option-text"><strong>Je ne sais pas encore</strong><span>Notre équipe vous aidera à choisir le format adapté.</span></span></label>
            </div>
            <p class="form-error" id="err-visit"></p>
          </div>

          <div class="modal-step" id="stepContact" data-step>
            <h3 id="contactStepTitle">Comment <em>vous joindre</em> ?</h3>
            <p class="lead" id="contactStepLead">Choisissez le canal qui vous convient. Nous nous adaptons.</p>

            <div class="villa-context-card" id="villaContextCard">
              <div class="villa-context-media">
                <img class="villa-context-image" id="villaContextImage" alt="">
              </div>
              <div class="villa-context-copy">
                <div class="villa-context-kicker" id="villaContextKicker"></div>
                <div class="villa-context-name" id="villaContextName"></div>
                <div class="villa-context-location" id="villaContextLocation"></div>
                <div class="villa-context-choices" id="villaContextChoices">
                  <span>Intérieur</span><strong id="villaContextInterior"></strong>
                  <span>Jardin</span><strong id="villaContextGarden"></strong>
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="form-row">
                <input type="text" class="form-input" id="contactFirstName" placeholder="Prénom *" aria-label="Prénom" autocomplete="given-name">
                <input type="text" class="form-input" id="contactLastName" placeholder="Nom *" aria-label="Nom" autocomplete="family-name">
              </div>
              __COUNTRY_SELECT__
              <p class="form-error" id="err-identity"></p>
              <div class="phone-row">
                <span class="phone-prefix" id="phonePrefix">+…</span>
                <input type="tel" class="form-input" id="contactPhone" placeholder="Téléphone" aria-label="Téléphone" autocomplete="tel-national" inputmode="tel">
              </div>
              <input type="email" class="form-input" id="contactEmail" placeholder="Adresse email" aria-label="Adresse email" autocomplete="email" inputmode="email">
              <p class="form-error" id="err-contact"></p>
            </div>

            <div class="pref-section">
              <div class="pref-label">Préférence de contact</div>
              <div class="pref-options">
                <input type="radio" name="pref" id="pref1" value="email" checked>
                <label for="pref1" class="pref-option-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span>Email</span></label>

                <input type="radio" name="pref" id="pref2" value="phone">
                <label for="pref2" class="pref-option-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span>Téléphone</span></label>

                <input type="radio" name="pref" id="pref3" value="whatsapp">
                <label for="pref3" class="pref-option-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg><span>WhatsApp</span></label>
              </div>
              <p class="req-note" id="contactRequirementNote"></p>
            </div>

            <div class="message-section">
              <div class="message-label" id="messageLabel">Votre message <span>— facultatif</span></div>
              <textarea class="form-textarea" id="contactMessage" placeholder="Votre projet, vos questions, vos contraintes…" aria-label="Votre message"></textarea>
            </div>
            <div class="reassurance"><strong>Notre équipe vous recontactera sous un jour ouvré</strong> afin d’échanger sur votre projet.<br>Vos coordonnées sont utilisées uniquement pour répondre à votre demande.</div>
          </div>

          <div class="modal-step success" id="stepSuccess">
            <div class="check-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
            <h3 id="successTitle">Demande <em>envoyée</em></h3>
            <p id="successText"></p>
            <p class="small" id="successSmall"></p>
          </div>
        </div>

        <div class="modal-actions" id="modalActions">
          <button class="modal-back" id="modalBack" type="button" onclick="prevContactStep()" disabled>← Retour</button>
          <button class="modal-next" id="modalNext" type="button" onclick="nextContactStep()">Suivant →</button>
          <p class="submit-status" id="contactSubmitStatus" aria-live="polite"></p>
        </div>
      </div>
    </div>`;

  html = html.replace('__COUNTRY_SELECT__', "<select class=\"form-input\" id=\"contactCountry\" aria-label=\"Pays\" required><option value=\"\" disabled selected>Pays *</option><optgroup label=\"Fréquents\"><option value=\"France\" data-dial=\"+33\">France (+33)</option><option value=\"Thaïlande\" data-dial=\"+66\">Thaïlande (+66)</option><option value=\"Suisse\" data-dial=\"+41\">Suisse (+41)</option><option value=\"Belgique\" data-dial=\"+32\">Belgique (+32)</option><option value=\"Luxembourg\" data-dial=\"+352\">Luxembourg (+352)</option><option value=\"Royaume-Uni\" data-dial=\"+44\">Royaume-Uni (+44)</option><option value=\"Émirats arabes unis\" data-dial=\"+971\">Émirats arabes unis (+971)</option><option value=\"Singapour\" data-dial=\"+65\">Singapour (+65)</option><option value=\"Hong Kong\" data-dial=\"+852\">Hong Kong (+852)</option><option value=\"États-Unis\" data-dial=\"+1\">États-Unis (+1)</option></optgroup><optgroup label=\"Tous les pays\"><option value=\"Afrique du Sud\" data-dial=\"+27\">Afrique du Sud (+27)</option><option value=\"Allemagne\" data-dial=\"+49\">Allemagne (+49)</option><option value=\"Arabie saoudite\" data-dial=\"+966\">Arabie saoudite (+966)</option><option value=\"Australie\" data-dial=\"+61\">Australie (+61)</option><option value=\"Autriche\" data-dial=\"+43\">Autriche (+43)</option><option value=\"Bahreïn\" data-dial=\"+973\">Bahreïn (+973)</option><option value=\"Brésil\" data-dial=\"+55\">Brésil (+55)</option><option value=\"Canada\" data-dial=\"+1\">Canada (+1)</option><option value=\"Chine\" data-dial=\"+86\">Chine (+86)</option><option value=\"Chypre\" data-dial=\"+357\">Chypre (+357)</option><option value=\"Corée du Sud\" data-dial=\"+82\">Corée du Sud (+82)</option><option value=\"Danemark\" data-dial=\"+45\">Danemark (+45)</option><option value=\"Égypte\" data-dial=\"+20\">Égypte (+20)</option><option value=\"Espagne\" data-dial=\"+34\">Espagne (+34)</option><option value=\"Estonie\" data-dial=\"+372\">Estonie (+372)</option><option value=\"Finlande\" data-dial=\"+358\">Finlande (+358)</option><option value=\"Grèce\" data-dial=\"+30\">Grèce (+30)</option><option value=\"Inde\" data-dial=\"+91\">Inde (+91)</option><option value=\"Indonésie\" data-dial=\"+62\">Indonésie (+62)</option><option value=\"Irlande\" data-dial=\"+353\">Irlande (+353)</option><option value=\"Israël\" data-dial=\"+972\">Israël (+972)</option><option value=\"Italie\" data-dial=\"+39\">Italie (+39)</option><option value=\"Japon\" data-dial=\"+81\">Japon (+81)</option><option value=\"Kazakhstan\" data-dial=\"+7\">Kazakhstan (+7)</option><option value=\"Koweït\" data-dial=\"+965\">Koweït (+965)</option><option value=\"Lettonie\" data-dial=\"+371\">Lettonie (+371)</option><option value=\"Liban\" data-dial=\"+961\">Liban (+961)</option><option value=\"Lituanie\" data-dial=\"+370\">Lituanie (+370)</option><option value=\"Malaisie\" data-dial=\"+60\">Malaisie (+60)</option><option value=\"Malte\" data-dial=\"+356\">Malte (+356)</option><option value=\"Maroc\" data-dial=\"+212\">Maroc (+212)</option><option value=\"Maurice\" data-dial=\"+230\">Maurice (+230)</option><option value=\"Mexique\" data-dial=\"+52\">Mexique (+52)</option><option value=\"Monaco\" data-dial=\"+377\">Monaco (+377)</option><option value=\"Norvège\" data-dial=\"+47\">Norvège (+47)</option><option value=\"Nouvelle-Zélande\" data-dial=\"+64\">Nouvelle-Zélande (+64)</option><option value=\"Pays-Bas\" data-dial=\"+31\">Pays-Bas (+31)</option><option value=\"Philippines\" data-dial=\"+63\">Philippines (+63)</option><option value=\"Pologne\" data-dial=\"+48\">Pologne (+48)</option><option value=\"Portugal\" data-dial=\"+351\">Portugal (+351)</option><option value=\"Qatar\" data-dial=\"+974\">Qatar (+974)</option><option value=\"République tchèque\" data-dial=\"+420\">République tchèque (+420)</option><option value=\"Roumanie\" data-dial=\"+40\">Roumanie (+40)</option><option value=\"Russie\" data-dial=\"+7\">Russie (+7)</option><option value=\"Suède\" data-dial=\"+46\">Suède (+46)</option><option value=\"Taïwan\" data-dial=\"+886\">Taïwan (+886)</option><option value=\"Tunisie\" data-dial=\"+216\">Tunisie (+216)</option><option value=\"Turquie\" data-dial=\"+90\">Turquie (+90)</option><option value=\"Ukraine\" data-dial=\"+380\">Ukraine (+380)</option><option value=\"Vietnam\" data-dial=\"+84\">Vietnam (+84)</option></optgroup></select>");

  var style = document.createElement('style');
  style.id = 'latitude-contact-styles';
  style.textContent = css;
  document.head.appendChild(style);
  document.body.insertAdjacentHTML('beforeend', html);

  var modal = document.getElementById('contactModal');
  var content = document.getElementById('modalContent');
  var closeButton = document.getElementById('contactModalClose');
  var nextButton = document.getElementById('modalNext');
  var backButton = document.getElementById('modalBack');
  var actions = document.getElementById('modalActions');
  var status = document.getElementById('contactSubmitStatus');

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' })[char];
    });
  }

  function normalizedVilla(value) {
    var villa = String(value || '').trim();
    if (!villa) return null;
    if (/^(villa|baan)\s/i.test(villa)) return villa;
    return 'Villa ' + villa;
  }

  function getVillaHtml() {
    var villa = normalizedVilla(currentContext && currentContext.villa);
    if (!villa) return '';
    var parts = villa.split(/\s+/);
    var first = parts.shift();
    return escapeHtml(first) + ' <em>' + escapeHtml(parts.join(' ')) + '</em>';
  }

  function mergeObjects(base, override) {
    var result = {};
    Object.keys(base || {}).forEach(function (key) { result[key] = base[key]; });
    Object.keys(override || {}).forEach(function (key) {
      if (override[key] !== undefined && override[key] !== null) result[key] = override[key];
    });
    return result;
  }

  function getVillaProfile(villaValue) {
    var normalized = normalizedVilla(villaValue);
    var key = String(villaValue || '').toLowerCase().replace(/^(villa|baan)\s+/i, '').trim();
    var defaults = {
      sabai: {
        key: 'Sabai',
        name: 'Villa Sabai',
        location: 'Lamai · Koh Samui',
        hero: 'photos/sabai/hero.jpg',
        thumbnail: null
      }
    };

    var profile = defaults[key] || {
      key: villaValue || '',
      name: normalized || 'Villa',
      location: '',
      hero: '',
      thumbnail: null
    };

    var library = window.LATITUDE_VILLA_CONTEXTS || {};
    var libraryProfile = library[key] || library[villaValue] || library[normalized] || null;
    if (libraryProfile) profile = mergeObjects(profile, libraryProfile);

    var pageProfile = window.VILLA_CONTEXT || null;
    if (pageProfile) {
      var pageKey = String(pageProfile.key || pageProfile.name || '').toLowerCase().replace(/^(villa|baan)\s+/i, '').trim();
      if (!key || !pageKey || pageKey === key) profile = mergeObjects(profile, pageProfile);
    }

    return profile;
  }

  function getContextKey(ctx) {
    return [ctx.intent, normalizedVilla(ctx.villa) || 'general', ctx.preferredContact || ''].join('|');
  }

  function getDefaultConfiguration() {
    if (typeof window.getPersoSummary !== 'function') return null;
    var result = window.getPersoSummary();
    if (!result) return null;
    return {
      interior: result.interior || result.interieur || null,
      garden: result.garden || result.jardin || null,
      touched: Boolean(result.touched)
    };
  }

  function normalizeOptions(options) {
    if (typeof options === 'string') options = { intent: options };
    options = options || {};

    var intent = String(options.intent || 'contact').toLowerCase();
    if (ALLOWED_INTENTS.indexOf(intent) === -1) intent = 'contact';

    var villa = options.villa || window.VILLA_NAME || null;
    var configuration = options.configuration || null;
    if (intent === 'estimate' && !configuration) configuration = getDefaultConfiguration();

    var villaProfile = getVillaProfile(villa);
    if (options.hero) villaProfile.hero = options.hero;
    if (options.thumbnail !== undefined) villaProfile.thumbnail = options.thumbnail;
    if (options.location) villaProfile.location = options.location;

    return {
      intent: intent,
      villa: villa,
      villaProfile: villaProfile,
      source: String(options.source || 'non précisée'),
      configuration: configuration,
      preferredContact: ['email', 'phone', 'whatsapp'].indexOf(options.preferredContact) !== -1
        ? options.preferredContact
        : null
    };
  }

  function captureIdentity() {
    return {
      firstName: document.getElementById('contactFirstName').value,
      lastName: document.getElementById('contactLastName').value,
      countryIndex: document.getElementById('contactCountry').selectedIndex,
      phone: document.getElementById('contactPhone').value,
      email: document.getElementById('contactEmail').value,
      pref: (document.querySelector('#contactModal input[name="pref"]:checked') || {}).value || 'email'
    };
  }

  function restoreIdentity(identity) {
    if (!identity) return;
    document.getElementById('contactFirstName').value = identity.firstName || '';
    document.getElementById('contactLastName').value = identity.lastName || '';
    document.getElementById('contactCountry').selectedIndex = identity.countryIndex || 0;
    document.getElementById('contactPhone').value = identity.phone || '';
    document.getElementById('contactEmail').value = identity.email || '';
    var pref = document.querySelector('#contactModal input[name="pref"][value="' + (identity.pref || 'email') + '"]');
    if (pref) pref.checked = true;
    updatePhonePrefix();
  }

  function clearErrors() {
    document.querySelectorAll('#contactModal .form-error').forEach(function (el) {
      el.textContent = '';
      el.classList.remove('show');
    });
    document.querySelectorAll('#contactModal .invalid').forEach(function (el) {
      el.classList.remove('invalid');
    });
    status.textContent = '';
  }

  function showError(id, message) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
  }

  function markInvalid(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('invalid');
  }

  function resetContextFields(preserveIdentity) {
    var identity = preserveIdentity ? captureIdentity() : null;

    document.querySelectorAll('#contactModal input[name="stage"],#contactModal input[name="visitType"]').forEach(function (radio) {
      radio.checked = false;
    });

    document.getElementById('contactMessage').value = '';

    if (!preserveIdentity) {
      ['contactFirstName', 'contactLastName', 'contactPhone', 'contactEmail'].forEach(function (id) {
        document.getElementById(id).value = '';
      });
      document.getElementById('contactCountry').selectedIndex = 0;
      updatePhonePrefix();
    } else {
      restoreIdentity(identity);
    }

    clearErrors();
  }

  function renderProgress() {
    var progress = document.getElementById('modalProgress');
    progress.innerHTML = currentSequence.map(function () {
      return '<div class="modal-progress-bar"></div>';
    }).join('');
  }

  function setModalCopy() {
    var villa = normalizedVilla(currentContext.villa);
    var villaHtml = getVillaHtml();
    var contextText = INTENT_LABELS[currentIntent] + ' · ' + (villa || 'Latitude Samui');

    document.getElementById('modalContext').textContent = contextText;

    var stageTitle = document.getElementById('contactModalTitle');
    var stageLead = document.getElementById('stageLead');
    var contactTitle = document.getElementById('contactStepTitle');
    var contactLead = document.getElementById('contactStepLead');
    var message = document.getElementById('contactMessage');
    var messageLabel = document.getElementById('messageLabel');
    var email = document.getElementById('contactEmail');
    var requirement = document.getElementById('contactRequirementNote');
    var otherDescription = document.getElementById('stageOtherDescription');

    email.placeholder = currentIntent === 'brochure' ? 'Adresse email *' : 'Adresse email';
    requirement.textContent = currentIntent === 'brochure'
      ? 'L’adresse email est obligatoire pour recevoir la brochure. Le téléphone reste facultatif, sauf si vous choisissez un suivi par appel ou WhatsApp.'
      : 'Seule la coordonnée correspondant au canal choisi est obligatoire. Tout champ facultatif renseigné doit être valide.';

    if (currentIntent === 'contact') {
      stageTitle.innerHTML = 'Où en êtes-vous<br>dans votre <em>projet</em> ?';
      stageLead.textContent = villa
        ? 'Votre demande concerne ' + villa + '. Indiquez simplement où vous en êtes afin que notre équipe adapte sa première réponse.'
        : 'Cela nous permet d’adapter notre première réponse à votre situation.';
      otherDescription.textContent = villa
        ? 'Question précise sur la villa, le terrain, les délais ou les modalités d’achat.'
        : 'Question générale, partenariat ou presse.';
      contactTitle.innerHTML = 'Comment <em>vous joindre</em> ?';
      contactLead.textContent = 'Choisissez le canal qui vous convient, puis ajoutez un message si nécessaire.';
      messageLabel.innerHTML = 'Votre message <span>— facultatif</span>';
      message.placeholder = 'Votre projet, vos questions ou vos contraintes…';
    }

    if (currentIntent === 'brochure') {
      contactTitle.innerHTML = 'Recevoir la <em>brochure</em>';
      contactLead.textContent = 'Indiquez vos coordonnées. La brochure sera envoyée à l’adresse email renseignée.';
      messageLabel.innerHTML = 'Une question particulière ? <span>— facultatif</span>';
      message.placeholder = 'Votre question sur ' + (villa || 'cette villa') + '…';
    }

    if (currentIntent === 'estimate') {
      contactTitle.innerHTML = 'Recevoir votre <em>estimation</em>';
      contactLead.textContent = 'Vérifiez la configuration à estimer, puis indiquez vos coordonnées.';
      messageLabel.innerHTML = 'Précisions sur votre projet <span>— facultatif</span>';
      message.placeholder = 'Budget cible, calendrier, usage prévu ou demandes spécifiques…';
    }

    if (currentIntent === 'visit') {
      document.getElementById('visitTitle').innerHTML = 'Comment souhaitez-vous découvrir<br>' + (villaHtml || '<em>la villa</em>') + ' ?';
      contactTitle.innerHTML = 'Organisons votre <em>visite</em>';
      contactLead.textContent = 'Indiquez vos coordonnées afin que notre équipe convienne avec vous du format et du créneau.';
      messageLabel.innerHTML = 'Disponibilités ou précisions <span>— facultatif</span>';
      message.placeholder = 'Période envisagée, disponibilité, fuseau horaire ou questions…';
    }

    renderVillaContextCard();
  }

  function renderVillaContextCard() {
    var card = document.getElementById('villaContextCard');
    var image = document.getElementById('villaContextImage');
    var profile = currentContext.villaProfile || getVillaProfile(currentContext.villa);
    var shouldShow = currentIntent === 'brochure' || currentIntent === 'estimate';

    card.classList.remove('show', 'image-unavailable');
    image.removeAttribute('src');
    image.alt = '';

    if (!shouldShow) return;

    var villa = profile.name || normalizedVilla(currentContext.villa) || 'Cette villa';
    var imageSource = profile.thumbnail || profile.hero || '';
    document.getElementById('villaContextKicker').textContent =
      currentIntent === 'estimate' ? 'Configuration à estimer' : 'Brochure';
    document.getElementById('villaContextName').textContent = villa;
    document.getElementById('villaContextLocation').textContent = profile.location || '';

    var choices = document.getElementById('villaContextChoices');
    choices.classList.remove('show');

    if (currentIntent === 'estimate') {
      var config = currentContext.configuration || getDefaultConfiguration() || {};
      var interior = config.interior || 'Carte Blanche';
      var garden = config.garden || 'Carte Blanche';

      currentContext.configuration = {
        interior: interior,
        garden: garden,
        touched: Boolean(config.touched)
      };

      document.getElementById('villaContextInterior').textContent = interior;
      document.getElementById('villaContextGarden').textContent = garden;
      choices.classList.add('show');
    }

    if (imageSource) {
      image.onload = function () { card.classList.remove('image-unavailable'); };
      image.onerror = function () {
        card.classList.add('image-unavailable');
        image.removeAttribute('src');
      };
      image.alt = 'Vue de ' + villa;
      image.src = imageSource;
    } else {
      card.classList.add('image-unavailable');
    }

    card.classList.add('show');
  }

  function configureIntent() {
    currentIntent = currentContext.intent;

    if (currentIntent === 'brochure' || currentIntent === 'estimate') currentSequence = ['stepContact'];
    else if (currentIntent === 'visit') currentSequence = ['stepVisit', 'stepContact'];
    else currentSequence = ['stepStage', 'stepContact'];

    currentStepIndex = 0;
    renderProgress();
    if (currentContext.preferredContact) {
      var preferred = document.querySelector('#contactModal input[name="pref"][value="' + currentContext.preferredContact + '"]');
      if (preferred) preferred.checked = true;
    }
    setModalCopy();
    actions.style.display = '';
    nextButton.disabled = false;
    updateSteps();
  }

  function updateSteps() {
    document.querySelectorAll('#contactModal .modal-step').forEach(function (step) {
      step.classList.remove('active');
    });

    var activeId = currentSequence[currentStepIndex];
    var active = document.getElementById(activeId);
    if (active) active.classList.add('active');

    backButton.disabled = currentStepIndex === 0;
    backButton.style.visibility = currentStepIndex === 0 ? 'hidden' : 'visible';
    var isLast = currentStepIndex === currentSequence.length - 1;
    nextButton.textContent = isLast ? getSubmitLabel() : 'Suivant →';

    document.getElementById('modalStepLabel').textContent = currentSequence.length === 1
      ? 'Votre demande'
      : 'Étape ' + (currentStepIndex + 1) + ' sur ' + currentSequence.length;

    document.querySelectorAll('#modalProgress .modal-progress-bar').forEach(function (bar, index) {
      bar.classList.toggle('active', index === currentStepIndex);
      bar.classList.toggle('done', index < currentStepIndex);
    });

    content.scrollTop = 0;
  }

  function getSubmitLabel() {
    if (currentIntent === 'brochure') return 'Recevoir la brochure';
    if (currentIntent === 'estimate') return 'Recevoir mon estimation';
    if (currentIntent === 'visit') return 'Demander une visite';
    return 'Envoyer ma demande';
  }

  function getSelected(name) {
    var selected = document.querySelector('#contactModal input[name="' + name + '"]:checked');
    return selected ? selected.value : '';
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validPhone(value) {
    if (!/^[0-9+\s().\-\/]+$/.test(value)) return false;
    var digits = value.replace(/\D/g, '');
    return digits.length >= 6 && digits.length <= 15;
  }

  function validateStage() {
    if (getSelected('stage')) return true;
    showError('err-stage', 'Choisissez une option pour continuer.');
    return false;
  }

  function validateVisit() {
    if (getSelected('visitType')) return true;
    showError('err-visit', 'Choisissez un format de visite pour continuer.');
    return false;
  }

  function validateContact() {
    var ok = true;
    var firstName = document.getElementById('contactFirstName').value.trim();
    var lastName = document.getElementById('contactLastName').value.trim();
    var country = document.getElementById('contactCountry').value;
    var phone = document.getElementById('contactPhone').value.trim();
    var email = document.getElementById('contactEmail').value.trim();
    var pref = getSelected('pref') || 'email';

    if (!firstName) { markInvalid('contactFirstName'); ok = false; }
    if (!lastName) { markInvalid('contactLastName'); ok = false; }
    if (!country) { markInvalid('contactCountry'); ok = false; }
    if (!firstName || !lastName || !country) {
      showError('err-identity', 'Prénom, nom et pays sont indispensables.');
    }

    var emailRequired = currentIntent === 'brochure' || pref === 'email';
    var phoneRequired = pref === 'phone' || pref === 'whatsapp';

    if (emailRequired && !email) {
      markInvalid('contactEmail');
      showError('err-contact', currentIntent === 'brochure'
        ? 'Ajoutez une adresse email valide pour recevoir la brochure.'
        : 'Ajoutez une adresse email valide.');
      ok = false;
    } else if (email && !validEmail(email)) {
      markInvalid('contactEmail');
      showError('err-contact', 'L’adresse email renseignée ne semble pas valide.');
      ok = false;
    }

    if (phoneRequired && !phone) {
      markInvalid('contactPhone');
      showError('err-contact', 'Ajoutez un numéro valide pour être joint par ' + (pref === 'whatsapp' ? 'WhatsApp' : 'téléphone') + '.');
      ok = false;
    } else if (phone && !validPhone(phone)) {
      markInvalid('contactPhone');
      showError('err-contact', 'Le numéro renseigné ne semble pas valide. Utilisez 6 à 15 chiffres, avec espaces, tirets ou parenthèses si nécessaire.');
      ok = false;
    }

    return ok;
  }

  function validateCurrentStep() {
    var stepId = currentSequence[currentStepIndex];
    if (stepId === 'stepStage') return validateStage();
    if (stepId === 'stepVisit') return validateVisit();
    if (stepId === 'stepContact') return validateContact();
    return true;
  }

  function isConfigured() {
    return typeof window.LATITUDE_LEAD_SUBMITTER === 'function'
      || Boolean(window.LATITUDE_ODOO_LEAD_ENDPOINT)
      || Boolean(WEB3FORMS_KEY && WEB3FORMS_KEY.indexOf('VOTRE_CLE') === -1);
  }

  function sendLead(leadPayload, web3Payload) {
    if (typeof window.LATITUDE_LEAD_SUBMITTER === 'function') {
      return Promise.resolve(window.LATITUDE_LEAD_SUBMITTER(leadPayload));
    }

    if (window.LATITUDE_ODOO_LEAD_ENDPOINT) {
      return fetch(window.LATITUDE_ODOO_LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(leadPayload)
      }).then(function (response) {
        if (!response.ok) throw new Error('Odoo lead endpoint returned ' + response.status);
        return response;
      });
    }

    return fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(web3Payload)
    }).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok || data.success === false) throw new Error(data.message || 'Envoi impossible');
        return data;
      });
    });
  }

  function updatePhonePrefix() {
    var select = document.getElementById('contactCountry');
    var option = select.selectedOptions && select.selectedOptions[0];
    document.getElementById('phonePrefix').textContent = option && option.dataset.dial ? option.dataset.dial : '+…';
  }

  function getUtmData() {
    var params = new URLSearchParams(window.location.search || '');
    var data = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (key) {
      if (params.get(key)) data[key] = params.get(key);
    });
    return data;
  }

  function getSubject(firstName, lastName) {
    var villa = normalizedVilla(currentContext.villa);
    var prefix = '[' + INTENT_LABELS[currentIntent] + '] ';
    var target = villa || 'Latitude Samui';
    return prefix + target + ' — ' + firstName + ' ' + lastName;
  }

  function getSuccessCopy() {
    if (currentIntent === 'brochure') {
      return {
        title: 'Demande de brochure <em>reçue</em>',
        text: 'Notre équipe vous adressera la brochure à l’adresse email indiquée.',
        small: 'Pensez à vérifier vos courriers indésirables si nécessaire.'
      };
    }
    if (currentIntent === 'estimate') {
      return {
        title: 'Configuration <em>transmise</em>',
        text: 'Notre équipe reviendra vers vous avec une estimation personnalisée et les précisions utiles.',
        small: 'Délai de réponse habituel : un jour ouvré.'
      };
    }
    if (currentIntent === 'visit') {
      return {
        title: 'Demande de visite <em>reçue</em>',
        text: 'Notre équipe vous contactera afin de convenir du format et du créneau.',
        small: 'Délai de réponse habituel : un jour ouvré.'
      };
    }
    return {
      title: 'Demande <em>envoyée</em>',
      text: 'Notre équipe vous recontactera sous un jour ouvré afin d’échanger sur votre projet.',
      small: ''
    };
  }

  function showSuccess() {
    document.querySelectorAll('#contactModal .modal-step').forEach(function (step) {
      step.classList.remove('active');
    });

    var copy = getSuccessCopy();
    document.getElementById('successTitle').innerHTML = copy.title;
    document.getElementById('successText').textContent = copy.text;
    document.getElementById('successSmall').textContent = copy.small;
    document.getElementById('stepSuccess').classList.add('active');

    actions.style.display = 'none';
    document.getElementById('modalStepLabel').textContent = 'Demande envoyée';
    document.querySelectorAll('#modalProgress .modal-progress-bar').forEach(function (bar) {
      bar.classList.add('done');
      bar.classList.remove('active');
    });

    submittedSuccessfully = true;
    content.scrollTop = 0;
  }

  function submitContact() {
    if (!isConfigured()) {
      status.textContent = 'Le formulaire doit encore être connecté au point d’entrée Odoo/Netlify avant la mise en ligne.';
      return;
    }

    var countrySelect = document.getElementById('contactCountry');
    var option = countrySelect.selectedOptions && countrySelect.selectedOptions[0];
    var dial = option && option.dataset.dial ? option.dataset.dial : '';
    var phone = document.getElementById('contactPhone').value.trim();
    var email = document.getElementById('contactEmail').value.trim();
    var firstName = document.getElementById('contactFirstName').value.trim();
    var lastName = document.getElementById('contactLastName').value.trim();
    var stage = getSelected('stage');
    var visitType = getSelected('visitType');
    var message = document.getElementById('contactMessage').value.trim();
    var villa = normalizedVilla(currentContext.villa);
    var pref = getSelected('pref') || 'email';
    var utm = getUtmData();

    var leadPayload = {
      schema_version: 'latitude_lead_v1',
      intent: currentIntent,
      source: currentContext.source,
      page_path: window.location.pathname || '/',
      page_url: window.location.href,
      villa: villa || null,
      villa_location: currentContext.villaProfile && currentContext.villaProfile.location
        ? currentContext.villaProfile.location
        : null,
      project_stage: stage || null,
      visit_type: visitType || null,
      first_name: firstName,
      last_name: lastName,
      country: countrySelect.value || null,
      phone: phone ? (/^\s*\+/.test(phone) ? phone : ((dial ? dial + ' ' : '') + phone)) : null,
      email: email || null,
      preferred_contact: pref,
      message: message || null,
      configuration: currentIntent === 'estimate' && currentContext.configuration
        ? {
            interior: currentContext.configuration.interior || 'Carte Blanche',
            garden: currentContext.configuration.garden || 'Carte Blanche',
            touched: Boolean(currentContext.configuration.touched)
          }
        : null,
      utm: utm
    };

    var web3Payload = {
      access_key: WEB3FORMS_KEY,
      subject: getSubject(firstName, lastName),
      from_name: firstName + ' ' + lastName,
      'Type de demande': INTENT_LABELS[currentIntent],
      'Source du CTA': currentContext.source,
      'Page d’origine': window.location.pathname || '—',
      'URL d’origine': window.location.href,
      'Villa': villa || '—',
      'Localisation de la villa': currentContext.villaProfile && currentContext.villaProfile.location ? currentContext.villaProfile.location : '—',
      'Étape du projet': stage ? PROJECT_LABELS[stage] : '—',
      'Type de visite': visitType ? VISIT_LABELS[visitType] : '—',
      'Prénom': firstName,
      'Nom': lastName,
      'Pays': countrySelect.value || '—',
      'Téléphone': phone ? (/^\s*\+/.test(phone) ? phone : ((dial ? dial + ' ' : '') + phone)) : '—',
      'Email': email || '—',
      'Contact préféré': pref,
      'Message': message || '—'
    };

    if (leadPayload.configuration) {
      web3Payload['Approche intérieure choisie'] = leadPayload.configuration.interior;
      web3Payload['Approche jardin choisie'] = leadPayload.configuration.garden;
      web3Payload['Configuration modifiée par le visiteur'] = leadPayload.configuration.touched ? 'Oui' : 'Non — configuration incluse par défaut';
    }

    Object.keys(utm).forEach(function (key) {
      web3Payload[key] = utm[key];
    });

    nextButton.disabled = true;
    nextButton.textContent = 'Envoi…';
    status.textContent = '';

    sendLead(leadPayload, web3Payload)
      .then(function () {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'lead_submit_success',
          lead_intent: currentIntent,
          lead_source: currentContext.source,
          villa: villa || ''
        });
        showSuccess();
      })
      .catch(function () {
        status.textContent = 'L’envoi n’a pas abouti. Vérifiez votre connexion ou contactez-nous directement.';
        nextButton.disabled = false;
        nextButton.textContent = 'Réessayer →';
      });
  }

  window.openContactModal = function (options) {
    if (typeof window.snCloseMobile === 'function') window.snCloseMobile();

    lastFocus = document.activeElement;
    var nextContext = normalizeOptions(options);
    var nextKey = getContextKey(nextContext);
    var sameContext = nextKey === lastContextKey && !submittedSuccessfully;

    if (!sameContext) {
      resetContextFields(!submittedSuccessfully);
    } else {
      clearErrors();
    }

    currentContext = nextContext;
    lastContextKey = nextKey;
    submittedSuccessfully = false;
    configureIntent();

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.setTimeout(function () { closeButton.focus(); }, 40);
  };

  window.closeContactModal = function () {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  };

  window.prevContactStep = function () {
    if (currentStepIndex <= 0) return;
    currentStepIndex -= 1;
    clearErrors();
    updateSteps();
  };

  window.nextContactStep = function () {
    clearErrors();
    if (!validateCurrentStep()) return;

    if (currentStepIndex === currentSequence.length - 1) {
      submitContact();
      return;
    }

    currentStepIndex += 1;
    updateSteps();
  };

  document.getElementById('contactCountry').addEventListener('change', updatePhonePrefix);

  document.querySelectorAll('#contactModal input,#contactModal select,#contactModal textarea').forEach(function (input) {
    input.addEventListener('input', function () {
      input.classList.remove('invalid');
      clearErrors();
    });
    input.addEventListener('change', function () {
      input.classList.remove('invalid');
      clearErrors();
    });
  });

  modal.addEventListener('click', function (event) {
    if (event.target === modal) window.closeContactModal();
  });

  document.addEventListener('keydown', function (event) {
    if (!modal.classList.contains('active')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      window.closeContactModal();
      return;
    }

    if (event.key === 'Tab') {
      var focusable = Array.prototype.slice.call(
        modal.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]')
      ).filter(function (element) {
        return element.offsetParent !== null;
      });

      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
