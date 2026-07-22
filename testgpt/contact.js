/* ============================================================
   LATITUDE SAMUI — Modal de contact partagé / Mobile v1
   Hooks optionnels : window.VILLA_NAME, window.getPersoSummary()
   Configurez la clé via window.LATITUDE_WEB3FORMS_KEY avant ce script.
   ============================================================ */
(function () {
  'use strict';

  var WEB3FORMS_KEY = window.LATITUDE_WEB3FORMS_KEY || 'VOTRE_CLE_WEB3FORMS_ICI';
  var currentStep = 1;
  var totalSteps = 3;
  var lastFocus = null;

  var css = `
    body.modal-open{overflow:hidden;touch-action:none}
    .modal-overlay{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:2rem;background:rgba(13,16,13,.82);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
    .modal-overlay.active{display:flex;animation:contactFade .25s ease}
    .modal{width:100%;max-width:680px;max-height:min(92vh,820px);display:flex;flex-direction:column;position:relative;overflow:hidden;background:var(--white,#faf7f0);color:var(--ink,#1a1e1a);box-shadow:0 30px 100px rgba(0,0,0,.38);animation:contactModalIn .35s cubic-bezier(.22,1,.36,1)}
    .modal-topbar{min-height:58px;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.85rem 1rem .7rem 2.5rem;border-bottom:1px solid rgba(26,30,26,.08);background:var(--white,#faf7f0);flex:0 0 auto}
    .modal-step-label{font-family:Inter,sans-serif;font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:var(--gold-deep,#9c7b45)}
    .modal-close{width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid rgba(26,30,26,.15);border-radius:50%;cursor:pointer;color:var(--ink,#1a1e1a);transition:all .2s}
    .modal-close:hover{background:var(--ink,#1a1e1a);color:var(--white,#faf7f0);border-color:var(--ink,#1a1e1a)}
    .modal-close svg{width:16px;height:16px}
    .modal-progress{display:flex;height:3px;background:rgba(26,30,26,.05);flex:0 0 auto}
    .modal-progress-bar{flex:1;background:rgba(26,30,26,.06);transition:background .35s}
    .modal-progress-bar.done{background:var(--terracotta,#b8623f)}
    .modal-progress-bar.active{background:var(--gold,#c9a058)}
    .modal-content{padding:2rem 2.5rem 1.5rem;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;flex:1;scrollbar-width:thin}
    .modal-step{display:none}
    .modal-step.active{display:block;animation:contactStepIn .28s ease}
    .modal-step h3{font-family:"Cormorant Garamond",serif;font-size:clamp(1.8rem,4vw,2.35rem);line-height:1.05;font-weight:500;margin:0 3rem .65rem 0}
    .modal-step h3 em{font-style:italic;color:var(--terracotta,#b8623f)}
    .modal-step .lead{font-family:Inter,sans-serif;font-size:.9rem;font-weight:300;line-height:1.6;color:var(--ink-soft,#4a4e4a);margin-bottom:1.25rem}
    .stage-options{display:grid;gap:.65rem}
    .stage-options input[type="radio"],.pref-options input[type="radio"]{position:absolute;opacity:0;pointer-events:none}
    .stage-option-label{min-height:72px;padding:.9rem 1rem;background:var(--sand-light,#f2ede2);border:1px solid rgba(26,30,26,.08);cursor:pointer;transition:background .2s,border-color .2s,transform .2s;display:flex;align-items:center;gap:.9rem}
    .stage-option-label:hover{border-color:var(--gold,#c9a058)}
    .stage-options input:focus-visible+.stage-option-label,.pref-options input:focus-visible+.pref-option-label{outline:2px solid var(--terracotta,#b8623f);outline-offset:2px}
    .stage-options input:checked+.stage-option-label{background:var(--ink,#1a1e1a);color:var(--white,#faf7f0);border-color:var(--ink,#1a1e1a)}
    .stage-option-icon{width:36px;height:36px;border-radius:50%;background:var(--white,#faf7f0);border:1px solid rgba(26,30,26,.1);display:flex;align-items:center;justify-content:center;color:var(--gold-deep,#9c7b45);flex-shrink:0}
    .stage-option-icon svg{width:17px;height:17px}
    .stage-options input:checked+.stage-option-label .stage-option-icon{background:var(--gold,#c9a058);color:var(--ink,#1a1e1a);border-color:var(--gold,#c9a058)}
    .stage-option-text strong{font-family:"Cormorant Garamond",serif;font-size:1.1rem;font-weight:600;display:block;line-height:1.15;margin-bottom:.18rem}
    .stage-option-text span{display:block;font-family:Inter,sans-serif;font-size:.76rem;font-weight:300;line-height:1.4;opacity:.72}
    .form-group{display:grid;gap:.72rem;margin-bottom:1rem}
    .form-row{display:flex;gap:.72rem}
    .form-row .form-input{flex:1;min-width:0}
    .form-input,.form-textarea{width:100%;padding:.9rem 1rem;background:var(--sand-light,#f2ede2);border:1px solid rgba(26,30,26,.1);border-radius:0;font-family:Inter,sans-serif;font-size:1rem;color:var(--ink,#1a1e1a);transition:background .2s,border-color .2s}
    .form-input:focus,.form-textarea:focus{outline:none;border-color:var(--terracotta,#b8623f);background:var(--white,#faf7f0)}
    .form-input.invalid{border-color:#a4382a}
    .form-input::placeholder,.form-textarea::placeholder{color:var(--ink-soft,#4a4e4a);opacity:.62}
    select.form-input{appearance:none;-webkit-appearance:none;padding-right:2.8rem;background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234a4e4a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .95rem center;background-size:14px}
    .phone-row{display:flex;align-items:stretch}
    .phone-prefix{min-width:66px;display:flex;align-items:center;justify-content:center;padding:0 .75rem;background:var(--sand-light,#f2ede2);border:1px solid rgba(26,30,26,.1);border-right:0;font-family:Inter,sans-serif;font-size:.9rem;color:var(--ink-soft,#4a4e4a)}
    .phone-row .form-input{flex:1;min-width:0}
    .pref-section{margin-top:1.15rem}
    .pref-label{font-family:Inter,sans-serif;font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:var(--gold-deep,#9c7b45);margin-bottom:.7rem}
    .pref-options{display:grid;grid-template-columns:repeat(3,1fr);gap:.55rem}
    .pref-option-label{min-height:78px;padding:.7rem .35rem;background:var(--sand-light,#f2ede2);border:1px solid rgba(26,30,26,.08);cursor:pointer;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4rem;transition:all .2s}
    .pref-options input:checked+.pref-option-label{background:var(--ink,#1a1e1a);color:var(--white,#faf7f0);border-color:var(--ink,#1a1e1a)}
    .pref-option-label svg{width:22px;height:22px;color:var(--gold-deep,#9c7b45)}
    .pref-options input:checked+.pref-option-label svg{color:var(--gold-bright,#d4a945)}
    .pref-option-label span{font-family:"Cormorant Garamond",serif;font-size:1rem;font-weight:600}
    .form-textarea{min-height:130px;resize:vertical;line-height:1.55}
    .form-error{display:none;font-family:Inter,sans-serif;font-size:.75rem;color:#a4382a;margin:-.35rem 0 .15rem;line-height:1.4}
    .form-error.show{display:block}
    .req-note{font-family:Inter,sans-serif;font-size:.66rem;line-height:1.5;color:var(--ink-soft,#4a4e4a);margin-top:.7rem}
    .modal-perso-recap{display:none;margin:0 0 1.15rem;padding:.85rem 1rem;border:1px solid rgba(201,160,88,.4);background:rgba(201,160,88,.08);font-family:Inter,sans-serif;font-size:.84rem;line-height:1.55;color:var(--ink,#1a1e1a)}
    .modal-perso-recap.show{display:block}
    .modal-perso-recap b{color:var(--terracotta,#b8623f);font-weight:600}
    .reassurance{margin-top:1rem;padding:.85rem 1rem;background:var(--sand-light,#f2ede2);border-left:3px solid var(--gold,#c9a058);font-family:Inter,sans-serif;font-size:.77rem;font-weight:300;line-height:1.55;color:var(--ink-soft,#4a4e4a)}
    .modal-step.success,.modal-step.error-state{text-align:center;padding:2rem 0}
    .check-icon,.error-icon{width:72px;height:72px;margin:0 auto 1.25rem;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--white,#faf7f0)}
    .check-icon{background:var(--success,#1a2e22)}.error-icon{background:#a4382a}
    .check-icon svg,.error-icon svg{width:34px;height:34px}
    .modal-step.success p,.modal-step.error-state p{font-family:Inter,sans-serif;font-size:.9rem;line-height:1.65;color:var(--ink-soft,#4a4e4a);margin-top:1rem}
    .modal-step .small{font-size:.76rem!important}
    .modal-actions{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 2.5rem calc(1rem + env(safe-area-inset-bottom));border-top:1px solid rgba(26,30,26,.08);background:var(--sand-light,#f2ede2);flex:0 0 auto}
    .modal-back{min-height:44px;background:transparent;border:0;color:var(--ink-soft,#4a4e4a);font-family:Inter,sans-serif;font-size:.67rem;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;padding:.5rem 0}
    .modal-back[disabled]{opacity:.28;cursor:not-allowed}
    .modal-next{min-height:48px;display:inline-flex;align-items:center;justify-content:center;padding:.9rem 1.6rem;background:var(--terracotta,#b8623f);color:var(--white,#faf7f0);border:0;cursor:pointer;font-family:Inter,sans-serif;font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;font-weight:600;transition:background .2s,opacity .2s}
    .modal-next:hover{background:var(--ink,#1a1e1a)}
    .modal-next[disabled]{opacity:.6;cursor:wait}
    .submit-status{min-height:1.2rem;margin:.6rem 0 0;font-family:Inter,sans-serif;font-size:.72rem;line-height:1.4;color:#a4382a;text-align:right}
    @keyframes contactFade{from{opacity:0}to{opacity:1}}
    @keyframes contactModalIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
    @keyframes contactStepIn{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:none}}
    @media(max-width:640px){
      .modal-overlay{padding:0;align-items:stretch;background:rgba(13,16,13,.96)}
      .modal{max-width:none;max-height:none;height:100vh;height:100dvh;box-shadow:none;animation:contactSheetIn .35s cubic-bezier(.22,1,.36,1)}
      .modal-topbar{min-height:64px;padding:max(.65rem,env(safe-area-inset-top)) 1rem .65rem 1.15rem}
      .modal-step-label{font-size:.58rem}
      .modal-content{padding:1.35rem 1.15rem 1.25rem}
      .modal-step h3{font-size:2rem;margin-right:2.4rem}
      .modal-step .lead{font-size:.86rem;margin-bottom:1rem}
      .stage-option-label{min-height:68px;padding:.8rem .85rem}
      .stage-option-text strong{font-size:1.05rem}
      .stage-option-text span{font-size:.72rem}
      .form-row{flex-direction:column;gap:.72rem}
      .form-input,.form-textarea{font-size:16px}
      .pref-option-label{min-height:74px}
      .modal-actions{padding:.75rem 1.15rem calc(.75rem + env(safe-area-inset-bottom));gap:.75rem}
      .modal-next{flex:1;padding:.88rem .8rem}
      .modal-back{flex:0 0 auto}
      .submit-status{position:absolute;left:1.15rem;right:1.15rem;bottom:calc(4.7rem + env(safe-area-inset-bottom));text-align:center;background:var(--white,#faf7f0);padding:.35rem;pointer-events:none}
      @keyframes contactSheetIn{from{transform:translateY(100%)}to{transform:none}}
    }
    @media(max-width:370px){.pref-option-label span{font-size:.88rem}.modal-step h3{font-size:1.82rem}}
    @media(prefers-reduced-motion:reduce){.modal-overlay.active,.modal,.modal-step.active{animation:none}}
  `;

  var html = `
    <div class="modal-overlay" id="contactModal" aria-hidden="true">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="contactModalTitle">
        <div class="modal-topbar">
          <div class="modal-step-label" id="modalStepLabel">Étape 1 sur 3</div>
          <button class="modal-close" id="contactModalClose" type="button" onclick="closeContactModal()" aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-progress" id="modalProgress" aria-hidden="true"><div class="modal-progress-bar active"></div><div class="modal-progress-bar"></div><div class="modal-progress-bar"></div></div>
        <div class="modal-content" id="modalContent">
          <div class="modal-step active" id="step1">
            <h3 id="contactModalTitle">Où en êtes-vous<br>dans votre <em>projet</em> ?</h3>
            <p class="lead">Cela nous permet d’adapter notre première réponse à votre situation.</p>
            <div class="stage-options">
              <input type="radio" name="stage" id="stage1" value="explore"><label for="stage1" class="stage-option-label"><span class="stage-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span><span class="stage-option-text"><strong>Je découvre l’île</strong><span>Phase d’exploration, sans calendrier précis.</span></span></label>
              <input type="radio" name="stage" id="stage2" value="search"><label for="stage2" class="stage-option-label"><span class="stage-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span><span class="stage-option-text"><strong>Je cherche activement</strong><span>Projet concret dans les 6 à 18 prochains mois.</span></span></label>
              <input type="radio" name="stage" id="stage3" value="ready"><label for="stage3" class="stage-option-label"><span class="stage-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg></span><span class="stage-option-text"><strong>Je suis prêt à acheter</strong><span>Budget cadré, recherche dans les 3 prochains mois.</span></span></label>
              <input type="radio" name="stage" id="stage4" value="other"><label for="stage4" class="stage-option-label"><span class="stage-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span><span class="stage-option-text"><strong>Autre demande</strong><span>Question spécifique, partenariat ou presse.</span></span></label>
            </div>
            <p class="form-error" id="err-stage"></p>
          </div>
          <div class="modal-step" id="step2">
            <h3>Comment <em>vous joindre</em> ?</h3>
            <p class="lead">Choisissez le canal qui vous convient. Nous nous adaptons.</p>
            <div class="form-group">
              <div class="form-row"><input type="text" class="form-input" id="contactFirstName" placeholder="Prénom *" autocomplete="given-name"><input type="text" class="form-input" id="contactLastName" placeholder="Nom *" autocomplete="family-name"></div>
              <select class="form-input" id="contactCountry" required><option value="" disabled selected>Pays *</option><optgroup label="Fréquents"><option value="France" data-dial="+33">France (+33)</option><option value="Thaïlande" data-dial="+66">Thaïlande (+66)</option><option value="Suisse" data-dial="+41">Suisse (+41)</option><option value="Belgique" data-dial="+32">Belgique (+32)</option><option value="Luxembourg" data-dial="+352">Luxembourg (+352)</option><option value="Royaume-Uni" data-dial="+44">Royaume-Uni (+44)</option><option value="Émirats arabes unis" data-dial="+971">Émirats arabes unis (+971)</option><option value="Singapour" data-dial="+65">Singapour (+65)</option><option value="Hong Kong" data-dial="+852">Hong Kong (+852)</option><option value="États-Unis" data-dial="+1">États-Unis (+1)</option></optgroup><optgroup label="Tous les pays"><option value="Afrique du Sud" data-dial="+27">Afrique du Sud (+27)</option><option value="Allemagne" data-dial="+49">Allemagne (+49)</option><option value="Arabie saoudite" data-dial="+966">Arabie saoudite (+966)</option><option value="Australie" data-dial="+61">Australie (+61)</option><option value="Autriche" data-dial="+43">Autriche (+43)</option><option value="Bahreïn" data-dial="+973">Bahreïn (+973)</option><option value="Brésil" data-dial="+55">Brésil (+55)</option><option value="Canada" data-dial="+1">Canada (+1)</option><option value="Chine" data-dial="+86">Chine (+86)</option><option value="Chypre" data-dial="+357">Chypre (+357)</option><option value="Corée du Sud" data-dial="+82">Corée du Sud (+82)</option><option value="Danemark" data-dial="+45">Danemark (+45)</option><option value="Égypte" data-dial="+20">Égypte (+20)</option><option value="Espagne" data-dial="+34">Espagne (+34)</option><option value="Estonie" data-dial="+372">Estonie (+372)</option><option value="Finlande" data-dial="+358">Finlande (+358)</option><option value="Grèce" data-dial="+30">Grèce (+30)</option><option value="Inde" data-dial="+91">Inde (+91)</option><option value="Indonésie" data-dial="+62">Indonésie (+62)</option><option value="Irlande" data-dial="+353">Irlande (+353)</option><option value="Israël" data-dial="+972">Israël (+972)</option><option value="Italie" data-dial="+39">Italie (+39)</option><option value="Japon" data-dial="+81">Japon (+81)</option><option value="Kazakhstan" data-dial="+7">Kazakhstan (+7)</option><option value="Koweït" data-dial="+965">Koweït (+965)</option><option value="Lettonie" data-dial="+371">Lettonie (+371)</option><option value="Liban" data-dial="+961">Liban (+961)</option><option value="Lituanie" data-dial="+370">Lituanie (+370)</option><option value="Malaisie" data-dial="+60">Malaisie (+60)</option><option value="Malte" data-dial="+356">Malte (+356)</option><option value="Maroc" data-dial="+212">Maroc (+212)</option><option value="Maurice" data-dial="+230">Maurice (+230)</option><option value="Mexique" data-dial="+52">Mexique (+52)</option><option value="Monaco" data-dial="+377">Monaco (+377)</option><option value="Norvège" data-dial="+47">Norvège (+47)</option><option value="Nouvelle-Zélande" data-dial="+64">Nouvelle-Zélande (+64)</option><option value="Pays-Bas" data-dial="+31">Pays-Bas (+31)</option><option value="Philippines" data-dial="+63">Philippines (+63)</option><option value="Pologne" data-dial="+48">Pologne (+48)</option><option value="Portugal" data-dial="+351">Portugal (+351)</option><option value="Qatar" data-dial="+974">Qatar (+974)</option><option value="République tchèque" data-dial="+420">République tchèque (+420)</option><option value="Roumanie" data-dial="+40">Roumanie (+40)</option><option value="Russie" data-dial="+7">Russie (+7)</option><option value="Suède" data-dial="+46">Suède (+46)</option><option value="Taïwan" data-dial="+886">Taïwan (+886)</option><option value="Tunisie" data-dial="+216">Tunisie (+216)</option><option value="Turquie" data-dial="+90">Turquie (+90)</option><option value="Ukraine" data-dial="+380">Ukraine (+380)</option><option value="Vietnam" data-dial="+84">Vietnam (+84)</option></optgroup></select>
              <p class="form-error" id="err-identity"></p>
              <div class="phone-row"><span class="phone-prefix" id="phonePrefix">+…</span><input type="tel" class="form-input" id="contactPhone" placeholder="Téléphone" autocomplete="tel-national" inputmode="tel"></div>
              <input type="email" class="form-input" id="contactEmail" placeholder="Adresse email" autocomplete="email" inputmode="email">
              <p class="form-error" id="err-contact"></p>
            </div>
            <div class="pref-section">
              <div class="pref-label">Préférence de contact</div>
              <div class="pref-options">
                <input type="radio" name="pref" id="pref1" value="email" checked><label for="pref1" class="pref-option-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span>Email</span></label>
                <input type="radio" name="pref" id="pref2" value="phone"><label for="pref2" class="pref-option-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span>Téléphone</span></label>
                <input type="radio" name="pref" id="pref3" value="whatsapp"><label for="pref3" class="pref-option-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg><span>WhatsApp</span></label>
              </div>
              <p class="req-note">* Le téléphone est requis pour WhatsApp ou un appel ; l’email pour une réponse par email.</p>
            </div>
          </div>
          <div class="modal-step" id="step3">
            <h3>Quelques <em>mots</em><br>sur votre projet ?</h3>
            <p class="lead">Budget, calendrier, usage ou questions : ajoutez uniquement ce qui vous semble utile.</p>
            <div class="modal-perso-recap" id="modalPersoRecap"></div>
            <textarea class="form-textarea" id="contactMessage" placeholder="Votre projet, vos questions, vos contraintes…"></textarea>
            <div class="reassurance"><strong>Sébastien</strong> vous répond personnellement sous 24h, en français. Pas de relance commerciale automatique.</div>
          </div>
          <div class="modal-step success" id="stepSuccess"><div class="check-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div><h3>Message <em>envoyé</em></h3><p>Sébastien vous répond personnellement sous 24h.<br>À très bientôt.</p><p class="small">Pensez à vérifier vos spams si nécessaire.</p></div>
        </div>
        <div class="modal-actions" id="modalActions"><button class="modal-back" id="modalBack" type="button" onclick="prevContactStep()" disabled>← Retour</button><button class="modal-next" id="modalNext" type="button" onclick="nextContactStep()">Suivant →</button><p class="submit-status" id="contactSubmitStatus" aria-live="polite"></p></div>
      </div>
    </div>`;

  var style = document.createElement('style');
  style.id = 'latitude-contact-styles';
  style.textContent = css;
  document.head.appendChild(style);
  document.body.insertAdjacentHTML('beforeend', html);

  var modal = document.getElementById('contactModal');
  var content = document.getElementById('modalContent');
  var closeButton = document.getElementById('contactModalClose');
  var nextButton = document.getElementById('modalNext');
  var status = document.getElementById('contactSubmitStatus');

  function showError(id, msg) { var el = document.getElementById(id); if (el) { el.textContent = msg; el.classList.add('show'); } }
  function clearErrors() {
    document.querySelectorAll('#contactModal .form-error').forEach(function (e) { e.classList.remove('show'); });
    document.querySelectorAll('#contactModal .form-input.invalid').forEach(function (e) { e.classList.remove('invalid'); });
    status.textContent = '';
  }
  function markInvalid(id) { var el = document.getElementById(id); if (el) el.classList.add('invalid'); }
  function isConfigured() { return WEB3FORMS_KEY && WEB3FORMS_KEY.indexOf('VOTRE_CLE') === -1; }

  window.openContactModal = function () {
    if (typeof window.snCloseMobile === 'function') window.snCloseMobile();
    lastFocus = document.activeElement;
    resetContactModal();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    var recap = document.getElementById('modalPersoRecap');
    var s = typeof window.getPersoSummary === 'function' ? window.getPersoSummary() : null;
    if (s && recap) {
      var villa = window.VILLA_NAME || 'cette villa';
      recap.innerHTML = 'Vos choix pour la Villa <b>' + villa + '</b> : intérieur <b>' + s.interior + '</b>, jardin <b>' + s.garden + '</b>.';
      recap.classList.add('show');
    } else if (recap) { recap.classList.remove('show'); recap.innerHTML = ''; }
    window.setTimeout(function () { closeButton.focus(); }, 40);
  };

  window.closeContactModal = function () {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  };

  function resetContactModal() {
    currentStep = 1;
    document.querySelectorAll('#contactModal input[type="radio"][name="stage"]').forEach(function (r) { r.checked = false; });
    ['contactFirstName','contactLastName','contactEmail','contactPhone','contactMessage'].forEach(function (id) { var el = document.getElementById(id); if (el) el.value = ''; });
    var c = document.getElementById('contactCountry'); if (c) c.selectedIndex = 0;
    document.getElementById('phonePrefix').textContent = '+…';
    document.getElementById('pref1').checked = true;
    document.getElementById('modalActions').style.display = '';
    nextButton.disabled = false;
    clearErrors();
    updateSteps();
  }

  function updateSteps() {
    document.querySelectorAll('#contactModal .modal-step').forEach(function (s) { s.classList.remove('active'); });
    var active = document.getElementById('step' + currentStep);
    if (active) active.classList.add('active');
    document.getElementById('modalBack').disabled = currentStep === 1;
    nextButton.textContent = currentStep === totalSteps ? 'Envoyer →' : 'Suivant →';
    document.getElementById('modalStepLabel').textContent = 'Étape ' + currentStep + ' sur ' + totalSteps;
    document.querySelectorAll('#modalProgress .modal-progress-bar').forEach(function (b, i) { b.classList.toggle('active', i === currentStep - 1); b.classList.toggle('done', i < currentStep - 1); });
    content.scrollTop = 0;
  }

  window.prevContactStep = function () { if (currentStep > 1) { currentStep--; clearErrors(); updateSteps(); } };

  window.nextContactStep = function () {
    clearErrors();
    if (currentStep === 1 && !document.querySelector('#contactModal input[name="stage"]:checked')) { showError('err-stage','Choisissez une option pour continuer.'); return; }
    if (currentStep === 2) {
      var ok = true;
      var fn = document.getElementById('contactFirstName').value.trim();
      var ln = document.getElementById('contactLastName').value.trim();
      var country = document.getElementById('contactCountry').value;
      var phone = document.getElementById('contactPhone').value.trim();
      var email = document.getElementById('contactEmail').value.trim();
      var pref = document.querySelector('#contactModal input[name="pref"]:checked').value;
      if (!fn) { markInvalid('contactFirstName'); ok = false; }
      if (!ln) { markInvalid('contactLastName'); ok = false; }
      if (!country) { markInvalid('contactCountry'); ok = false; }
      if (!ok) showError('err-identity','Prénom, nom et pays sont indispensables.');
      if ((pref === 'phone' || pref === 'whatsapp') && !phone) { markInvalid('contactPhone'); showError('err-contact','Ajoutez un numéro pour être joint par ' + (pref === 'whatsapp' ? 'WhatsApp' : 'téléphone') + '.'); ok = false; }
      if (pref === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { markInvalid('contactEmail'); showError('err-contact','Ajoutez une adresse email valide.'); ok = false; }
      if (!ok) return;
    }
    if (currentStep === totalSteps) { submitContact(); return; }
    currentStep++; updateSteps();
  };

  function showSuccess() {
    document.querySelectorAll('#contactModal .modal-step').forEach(function (s) { s.classList.remove('active'); });
    document.getElementById('stepSuccess').classList.add('active');
    document.getElementById('modalActions').style.display = 'none';
    document.getElementById('modalStepLabel').textContent = 'Message envoyé';
    document.querySelectorAll('#modalProgress .modal-progress-bar').forEach(function (b) { b.classList.add('done'); b.classList.remove('active'); });
    content.scrollTop = 0;
  }

  function submitContact() {
    if (!isConfigured()) { status.textContent = 'Le formulaire doit encore être connecté à Web3Forms avant la mise en ligne.'; return; }
    var sel = document.getElementById('contactCountry');
    var dial = sel.selectedOptions.length ? (sel.selectedOptions[0].dataset.dial || '') : '';
    var phone = document.getElementById('contactPhone').value.trim();
    var perso = typeof window.getPersoSummary === 'function' ? window.getPersoSummary() : null;
    var villa = window.VILLA_NAME || null;
    var payload = {
      access_key: WEB3FORMS_KEY,
      subject: 'Contact' + (villa ? ' ' + villa : '') + ' — ' + document.getElementById('contactFirstName').value + ' ' + document.getElementById('contactLastName').value,
      from_name: document.getElementById('contactFirstName').value + ' ' + document.getElementById('contactLastName').value,
      'Étape du projet': (document.querySelector('#contactModal input[name="stage"]:checked') || {}).value || '—',
      'Prénom': document.getElementById('contactFirstName').value,
      'Nom': document.getElementById('contactLastName').value,
      'Pays': sel.value || '—',
      'Téléphone': phone ? (dial + ' ' + phone) : '—',
      'Email': document.getElementById('contactEmail').value || '—',
      'Contact préféré': (document.querySelector('#contactModal input[name="pref"]:checked') || {}).value || '—',
      'Message': document.getElementById('contactMessage').value || '—'
    };
    if (villa) payload.Villa = villa;
    if (perso) { payload['Approche intérieure choisie'] = perso.interior; payload['Approche jardin choisie'] = perso.garden; }

    nextButton.disabled = true;
    nextButton.textContent = 'Envoi…';
    status.textContent = '';
    fetch('https://api.web3forms.com/submit', { method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body:JSON.stringify(payload) })
      .then(function (response) { return response.json().then(function (data) { return { ok: response.ok, data: data }; }); })
      .then(function (result) { if (!result.ok || result.data.success === false) throw new Error(result.data.message || 'Envoi impossible'); showSuccess(); })
      .catch(function () { status.textContent = 'L’envoi n’a pas abouti. Vérifiez votre connexion ou contactez-nous directement.'; nextButton.disabled = false; nextButton.textContent = 'Réessayer →'; });
  }

  document.getElementById('contactCountry').addEventListener('change', function () { var d = this.selectedOptions[0] ? this.selectedOptions[0].dataset.dial : ''; document.getElementById('phonePrefix').textContent = d || '+…'; });
  modal.addEventListener('click', function (e) { if (e.target === modal) window.closeContactModal(); });
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') { e.preventDefault(); window.closeContactModal(); return; }
    if (e.key === 'Tab') {
      var focusable = Array.prototype.slice.call(modal.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]')).filter(function (el) { return el.offsetParent !== null; });
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
