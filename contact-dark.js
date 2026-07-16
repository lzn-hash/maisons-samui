/* ============================================================
   LATITUDE SAMUI — Modal de contact partagé
   Une seule source de vérité pour toutes les pages.
   Usage : <script src="contact.js"></script> en fin de body.
   Hooks optionnels définis par la page :
     window.VILLA_NAME       — nom de la villa (ex: 'Sabai')
     window.getPersoSummary  — () => ({interior, garden})
   ============================================================ */
(function () {
  // ⚠️ REMPLACER par votre clé Web3Forms (https://web3forms.com)
  var WEB3FORMS_KEY = 'VOTRE_CLE_WEB3FORMS_ICI';

  var css = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n@keyframes modalIn {\n    from { opacity: 0; transform: translateY(20px); }\n    to { opacity: 1; transform: translateY(0); }\n  }\nbody.modal-open{overflow: hidden;}\n.modal-overlay{position: fixed; inset: 0;\n    background: rgba(26, 30, 26, 0.85);\n    backdrop-filter: blur(8px);\n    -webkit-backdrop-filter: blur(8px);\n    z-index: 9999;\n    display: none;\n    align-items: center;\n    justify-content: center;\n    padding: 2rem;\n    animation: fadeIn 0.3s ease;}\n.modal-overlay.active{display: flex;}\n.modal{background: #12160f;\n    width: 100%;\n    max-width: 640px;\n    max-height: 92vh;\n    overflow: hidden;\n    display: flex;\n    flex-direction: column;\n    position: relative;\n    animation: modalIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);}\n.modal-close{position: absolute; top: 1rem; right: 1rem;\n    width: 36px; height: 36px;\n    background: transparent;\n    border: 1px solid rgba(255,255,255,0.2);\n    border-radius: 50%;\n    cursor: pointer;\n    color: #faf7f0;\n    display: flex; align-items: center; justify-content: center;\n    transition: all 0.2s;\n    z-index: 10;}\n.modal-close:hover{background: #faf7f0; color: #12160f; border-color: #faf7f0;}\n.modal-close svg{width: 16px; height: 16px;}\n.modal-progress{display: flex;\n    height: 3px;\n    background: rgba(255,255,255,0.06);\n    flex-shrink: 0;}\n.modal-progress-bar{flex: 1;\n    background: rgba(255,255,255,0.06);\n    transition: background 0.5s;}\n.modal-progress-bar.done{background: var(--terracotta);}\n.modal-progress-bar.active{background: var(--gold);}\n.modal-content{padding: 2rem 2.5rem 1.5rem;\n    overflow-y: auto;\n    flex: 1;}\n.modal-step{display: none;}\n.modal-step.active{display: block; animation: modalIn 0.4s ease;}\n.modal-step-num{font-family: \'Cormorant Garamond\', serif;\n    font-size: 0.7rem;\n    letter-spacing: 0.4em;\n    color: var(--gold);\n    margin-bottom: 1rem;}\n.modal-step h3{font-family: \'Cormorant Garamond\', serif;\n    font-size: 1.7rem;\n    line-height: 1.05;\n    font-weight: 400;\n    margin-bottom: 0.5rem;\n    color: #faf7f0;}\n.modal-step h3 em{font-family: \'Cormorant Garamond\', serif;\n    font-style: italic;\n    color: var(--terracotta);}\n.modal-step .lead{font-family: Inter, sans-serif;\n    font-style: normal;\n    font-weight: 300;\n    color: var(--ink-soft);\n    margin-bottom: 1.2rem;\n    font-size: 0.92rem;\n    line-height: 1.6;}\n.stage-options{display: grid;\n    gap: 0.5rem;\n    margin-bottom: 0.5rem;}\n.stage-options input[type="radio"]{display: none;}\n.stage-option-label{padding: 0.85rem 1.2rem;\n    background: #1c211b;\n    border: 1px solid rgba(255,255,255,0.09);\n    color: #faf7f0;\n    cursor: pointer;\n    transition: all 0.2s;\n    display: flex;\n    align-items: center;\n    gap: 0.9rem;}\n.stage-option-label:hover{background: #232a22;\n    border-color: var(--gold);}\n.stage-options input[type="radio"]:checked + .stage-option-label{background: #faf7f0;\n    color: #12160f;\n    border-color: #faf7f0;}\n.stage-option-icon{width: 32px; height: 32px;\n    border-radius: 50%;\n    background: #12160f;\n    border: 1px solid rgba(255,255,255,0.15);\n    display: flex; align-items: center; justify-content: center;\n    color: var(--gold);\n    flex-shrink: 0;\n    transition: all 0.2s;}\n.stage-option-icon svg{width: 16px; height: 16px;}\n.stage-options input[type="radio"]:checked + .stage-option-label .stage-option-icon{background: var(--gold); color: #12160f; border-color: var(--gold);}\n.stage-option-text strong{font-family: \'Cormorant Garamond\', serif;\n    font-size: 1.05rem;\n    font-weight: 500;\n    display: block;\n    line-height: 1.2;\n    margin-bottom: 0.15rem;}\n.stage-option-text span{font-size: 0.78rem;\n    color: #a8aaa4;\n    opacity: 1;\n    line-height: 1.35;}\n.form-group{display: grid;\n    gap: 0.7rem;\n    margin-bottom: 1rem;}\n.form-input{width: 100%;\n    padding: 0.85rem 1rem;\n    background: #1c211b;\n    border: 1px solid rgba(255,255,255,0.09);\n    font-family: inherit;\n    font-size: 1rem;\n    color: #faf7f0;\n    transition: all 0.3s;}\n.form-input:focus{outline: none;\n    border-color: var(--terracotta);\n    background: #232a22;}\n.form-input::placeholder{color: #a8aaa4; opacity: 0.7;}\n.pref-section{margin-top: 1.1rem;}\n.pref-label{font-size: 0.68rem;\n    letter-spacing: 0.3em;\n    text-transform: uppercase;\n    color: var(--gold);\n    margin-bottom: 0.7rem;}\n.pref-options{display: grid;\n    grid-template-columns: 1fr 1fr 1fr;\n    gap: 0.6rem;}\n.pref-options input[type="radio"]{display: none;}\n.pref-option-label{padding: 0.75rem 0.5rem;\n    background: #1c211b;\n    border: 1px solid rgba(255,255,255,0.09);\n    color: #faf7f0;\n    cursor: pointer;\n    text-align: center;\n    transition: all 0.2s;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    gap: 0.4rem;}\n.pref-option-label:hover{background: #232a22; border-color: var(--gold);}\n.pref-options input[type="radio"]:checked + .pref-option-label{background: #faf7f0;\n    color: #12160f;\n    border-color: #faf7f0;}\n.pref-option-label svg{width: 24px; height: 24px;\n    color: var(--gold);\n    transition: color 0.2s;}\n.pref-options input[type="radio"]:checked + .pref-option-label svg{color: var(--gold-bright);}\n.pref-option-label span{font-family: \'Cormorant Garamond\', serif;\n    font-size: 1rem;\n    font-weight: 500;}\n.form-textarea{width: 100%;\n    padding: 0.85rem 1rem;\n    background: #1c211b;\n    border: 1px solid rgba(255,255,255,0.09);\n    font-family: inherit;\n    font-size: 1rem;\n    color: #faf7f0;\n    min-height: 110px;\n    resize: vertical;\n    transition: all 0.3s;}\n.form-textarea:focus{outline: none;\n    border-color: var(--terracotta);\n    background: #232a22;}\n.form-textarea::placeholder{color: #a8aaa4; opacity: 0.7;}\n.reassurance{margin-top: 1rem;\n    padding: 0.8rem 1.1rem;\n    background: #1c211b;\n    border-left: 3px solid var(--gold);\n    font-size: 0.8rem;\n    color: var(--ink-soft);\n    font-family: Inter, sans-serif;\n    font-style: normal;\n    font-weight: 300;\n    line-height: 1.6;}\n.modal-step.success{text-align: center;\n    padding: 1.5rem 0;}\n.modal-step.success .check-icon{width: 80px; height: 80px;\n    margin: 0 auto 1.5rem;\n    background: var(--success);\n    border-radius: 50%;\n    display: flex; align-items: center; justify-content: center;\n    color: var(--white);}\n.modal-step.success .check-icon svg{width: 38px; height: 38px;}\n.modal-step.success p{margin-top: 1rem;\n    font-style: normal;\n    font-weight: 300;\n    font-family: Inter, sans-serif;\n    line-height: 1.6;\n    color: #a8aaa4;}\n.modal-step.success .small{margin-top: 2rem;\n    font-size: 0.8rem;\n    color: #a8aaa4;}\n.modal-actions{display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 1rem 2.5rem 1.1rem;\n    border-top: 1px solid rgba(255,255,255,0.09);\n    background: #1c211b;\n    flex-shrink: 0;}\n.modal-back{background: transparent;\n    border: none;\n    color: var(--ink-soft);\n    font-size: 0.7rem;\n    letter-spacing: 0.25em;\n    text-transform: uppercase;\n    cursor: pointer;\n    font-family: inherit;\n    padding: 0.5rem 0.5rem 0.5rem 0;}\n.modal-back:hover{color: #faf7f0;}\n.modal-back[disabled]{opacity: 0.3; cursor: not-allowed;}\n.modal-next{padding: 1rem 2rem;\n    background: var(--terracotta);\n    color: var(--white);\n    border: none;\n    cursor: pointer;\n    font-family: inherit;\n    font-size: 0.7rem;\n    letter-spacing: 0.3em;\n    text-transform: uppercase;\n    transition: background 0.3s;}\n.modal-next:hover{background: var(--ink);}\n.modal-perso-recap{margin: 0 0 1.4rem; padding: 0.9rem 1.1rem; border: 1px solid rgba(201,160,88,0.4);\n    background: rgba(201,160,88,0.08); font-family: Inter, sans-serif;\n    font-style: normal; font-weight: 300; font-size: 0.9rem; color: #faf7f0; line-height: 1.6; display: none;}\n.modal-perso-recap.show{display: block;}\n.modal-perso-recap b{color: var(--terracotta); font-style: normal; font-weight: 500;}\n.form-row{display:flex;gap:0.8rem;}\n.form-row .form-input{flex:1;min-width:0;}\nselect.form-input{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a8aaa4\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 0.9rem center;background-size:14px;cursor:pointer;}\n.phone-row{display:flex;gap:0;align-items:stretch;}\n.phone-prefix{display:flex;align-items:center;padding:0 0.9rem;background:#1c211b;border:1px solid rgba(255,255,255,0.12);border-right:none;font-family:Inter,sans-serif;font-size:0.9rem;color:#a8aaa4;white-space:nowrap;min-width:64px;justify-content:center;}\n.phone-row .form-input{flex:1;min-width:0;}\n.form-error{display:none;font-family:Inter,sans-serif;font-size:0.75rem;color:#a4382a;margin:-0.4rem 0 0.6rem;letter-spacing:0.02em;}\n.form-error.show{display:block;}\n.form-input.invalid{border-color:#a4382a;}\n.req-note{font-family:Inter,sans-serif;font-size:0.68rem;color:var(--ink-soft);letter-spacing:0.03em;margin-top:0.6rem;}\n@media (max-width:540px){.form-row{flex-direction:column;gap:0;}}\n';

  var html = '<div class="modal-overlay" id="contactModal">\n  <div class="modal">\n    <button class="modal-close" onclick="closeContactModal()" aria-label="Fermer">\n      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>\n    </button>\n    <div class="modal-progress" id="modalProgress">\n      <div class="modal-progress-bar active"></div><div class="modal-progress-bar"></div><div class="modal-progress-bar"></div>\n    </div>\n    <div class="modal-content">\n      <div class="modal-step active" id="step1">\n        <h3>Où en êtes-vous<br>dans votre <em>projet</em> ?</h3>\n        <p class="lead">Pas de mauvaise réponse. Cela nous aide juste à adapter notre première réponse.</p>\n        <div class="stage-options">\n          <input type="radio" name="stage" id="stage1" value="explore" />\n          <label for="stage1" class="stage-option-label">\n            <div class="stage-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>\n            <div class="stage-option-text"><strong>Je découvre l\'île</strong><span>Phase d\'exploration, pas encore de calendrier précis.</span></div>\n          </label>\n          <input type="radio" name="stage" id="stage2" value="search" />\n          <label for="stage2" class="stage-option-label">\n            <div class="stage-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>\n            <div class="stage-option-text"><strong>Je cherche activement</strong><span>Projet concret dans les 6 à 18 prochains mois.</span></div>\n          </label>\n          <input type="radio" name="stage" id="stage3" value="ready" />\n          <label for="stage3" class="stage-option-label">\n            <div class="stage-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg></div>\n            <div class="stage-option-text"><strong>Je suis prêt à acheter</strong><span>Budget cadré, recherche dans les 3 prochains mois.</span></div>\n          </label>\n          <input type="radio" name="stage" id="stage4" value="other" />\n          <label for="stage4" class="stage-option-label">\n            <div class="stage-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>\n            <div class="stage-option-text"><strong>Autre demande</strong><span>Question spécifique, partenariat, presse, etc.</span></div>\n          </label>\n        </div>\n        <p class="form-error" id="err-stage"></p>\n      </div>\n      <div class="modal-step" id="step2">\n        <h3>Comment <em>vous joindre</em> ?</h3>\n        <p class="lead">Vous choisissez le canal qui vous convient. Nous nous adaptons.</p>\n        <div class="form-group">\n          <div class="form-row">\n            <input type="text" class="form-input" id="contactFirstName" placeholder="Prénom *" autocomplete="given-name" required />\n            <input type="text" class="form-input" id="contactLastName" placeholder="Nom *" autocomplete="family-name" required />\n          </div>\n          <select class="form-input" id="contactCountry" required><option value="" disabled selected>Pays *</option><optgroup label="Fréquents"><option value="France" data-dial="+33">France (+33)</option><option value="Thaïlande" data-dial="+66">Thaïlande (+66)</option><option value="Suisse" data-dial="+41">Suisse (+41)</option><option value="Belgique" data-dial="+32">Belgique (+32)</option><option value="Luxembourg" data-dial="+352">Luxembourg (+352)</option><option value="Royaume-Uni" data-dial="+44">Royaume-Uni (+44)</option><option value="Émirats arabes unis" data-dial="+971">Émirats arabes unis (+971)</option><option value="Singapour" data-dial="+65">Singapour (+65)</option><option value="Hong Kong" data-dial="+852">Hong Kong (+852)</option><option value="États-Unis" data-dial="+1">États-Unis (+1)</option></optgroup><optgroup label="Tous les pays"><option value="Afrique du Sud" data-dial="+27">Afrique du Sud (+27)</option><option value="Allemagne" data-dial="+49">Allemagne (+49)</option><option value="Arabie saoudite" data-dial="+966">Arabie saoudite (+966)</option><option value="Australie" data-dial="+61">Australie (+61)</option><option value="Autriche" data-dial="+43">Autriche (+43)</option><option value="Bahreïn" data-dial="+973">Bahreïn (+973)</option><option value="Brésil" data-dial="+55">Brésil (+55)</option><option value="Canada" data-dial="+1">Canada (+1)</option><option value="Chine" data-dial="+86">Chine (+86)</option><option value="Chypre" data-dial="+357">Chypre (+357)</option><option value="Corée du Sud" data-dial="+82">Corée du Sud (+82)</option><option value="Danemark" data-dial="+45">Danemark (+45)</option><option value="Égypte" data-dial="+20">Égypte (+20)</option><option value="Espagne" data-dial="+34">Espagne (+34)</option><option value="Estonie" data-dial="+372">Estonie (+372)</option><option value="Finlande" data-dial="+358">Finlande (+358)</option><option value="Grèce" data-dial="+30">Grèce (+30)</option><option value="Inde" data-dial="+91">Inde (+91)</option><option value="Indonésie" data-dial="+62">Indonésie (+62)</option><option value="Irlande" data-dial="+353">Irlande (+353)</option><option value="Israël" data-dial="+972">Israël (+972)</option><option value="Italie" data-dial="+39">Italie (+39)</option><option value="Japon" data-dial="+81">Japon (+81)</option><option value="Kazakhstan" data-dial="+7">Kazakhstan (+7)</option><option value="Koweït" data-dial="+965">Koweït (+965)</option><option value="Lettonie" data-dial="+371">Lettonie (+371)</option><option value="Liban" data-dial="+961">Liban (+961)</option><option value="Lituanie" data-dial="+370">Lituanie (+370)</option><option value="Malaisie" data-dial="+60">Malaisie (+60)</option><option value="Malte" data-dial="+356">Malte (+356)</option><option value="Maroc" data-dial="+212">Maroc (+212)</option><option value="Maurice" data-dial="+230">Maurice (+230)</option><option value="Mexique" data-dial="+52">Mexique (+52)</option><option value="Monaco" data-dial="+377">Monaco (+377)</option><option value="Norvège" data-dial="+47">Norvège (+47)</option><option value="Nouvelle-Zélande" data-dial="+64">Nouvelle-Zélande (+64)</option><option value="Pays-Bas" data-dial="+31">Pays-Bas (+31)</option><option value="Philippines" data-dial="+63">Philippines (+63)</option><option value="Pologne" data-dial="+48">Pologne (+48)</option><option value="Portugal" data-dial="+351">Portugal (+351)</option><option value="Qatar" data-dial="+974">Qatar (+974)</option><option value="République tchèque" data-dial="+420">République tchèque (+420)</option><option value="Roumanie" data-dial="+40">Roumanie (+40)</option><option value="Russie" data-dial="+7">Russie (+7)</option><option value="Suède" data-dial="+46">Suède (+46)</option><option value="Taïwan" data-dial="+886">Taïwan (+886)</option><option value="Tunisie" data-dial="+216">Tunisie (+216)</option><option value="Turquie" data-dial="+90">Turquie (+90)</option><option value="Ukraine" data-dial="+380">Ukraine (+380)</option><option value="Vietnam" data-dial="+84">Vietnam (+84)</option></optgroup></select>\n          <p class="form-error" id="err-identity"></p>\n          <div class="phone-row">\n            <span class="phone-prefix" id="phonePrefix">+…</span>\n            <input type="tel" class="form-input" id="contactPhone" placeholder="Téléphone" autocomplete="tel-national" />\n          </div>\n          <input type="email" class="form-input" id="contactEmail" placeholder="Adresse email" autocomplete="email" />\n          <p class="form-error" id="err-contact"></p>\n        </div>\n        <div class="pref-section">\n          <div class="pref-label">— Préférence de contact —</div>\n          <div class="pref-options">\n            <input type="radio" name="pref" id="pref1" value="email" checked />\n            <label for="pref1" class="pref-option-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span>Email</span></label>\n            <input type="radio" name="pref" id="pref2" value="phone" />\n            <label for="pref2" class="pref-option-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span>Téléphone</span></label>\n            <input type="radio" name="pref" id="pref3" value="whatsapp" />\n            <label for="pref3" class="pref-option-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg><span>WhatsApp</span></label>\n          </div>\n          <p class="req-note">* champs indispensables. Le téléphone est requis pour un contact WhatsApp ou téléphonique, l\'email pour un contact par email.</p>\n        </div>\n      </div>\n      <div class="modal-step" id="step3">\n        <h3>Quelques <em>mots</em><br>sur votre projet ?</h3>\n        <p class="lead">Tout ce que vous voulez nous dire. Côté préféré, nombre de chambres, budget, calendrier... ou rien si vous préférez en parler de vive voix.</p>\n        <div class="modal-perso-recap" id="modalPersoRecap"></div>\n        <textarea class="form-textarea" id="contactMessage" placeholder="L\'image que vous avez en tête, vos questions, vos contraintes..."></textarea>\n        <div class="reassurance"><strong>Sébastien</strong> vous répond personnellement sous 24h, en français. Pas de relance commerciale automatique. Vos informations restent strictement confidentielles.</div>\n      </div>\n      <div class="modal-step success" id="stepSuccess">\n        <div class="check-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>\n        <h3>Message <em>envoyé</em></h3>\n        <p>Sébastien vous répond personnellement sous 24h.<br>À très bientôt.</p>\n        <p class="small">Pensez à vérifier vos spams si vous ne recevez rien dans la journée.</p>\n      </div>\n    </div>\n    <div class="modal-actions" id="modalActions">\n      <button class="modal-back" id="modalBack" onclick="prevContactStep()" disabled>← Retour</button>\n      <button class="modal-next" id="modalNext" onclick="nextContactStep()">Suivant →</button>\n    </div>\n  </div>\n</div>';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  document.body.insertAdjacentHTML('beforeend', html);

  var currentStep = 1, totalSteps = 3;

  function showError(id, msg) {
    var el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.add('show'); }
  }
  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(function (e) { e.classList.remove('show'); });
    document.querySelectorAll('.form-input.invalid').forEach(function (e) { e.classList.remove('invalid'); });
  }
  function markInvalid(id) { var el = document.getElementById(id); if (el) el.classList.add('invalid'); }

  window.openContactModal = function () {
    document.getElementById('contactModal').classList.add('active');
    document.body.classList.add('modal-open');
    resetContactModal();
    // Récap personnalisation (pages villa uniquement)
    var recap = document.getElementById('modalPersoRecap');
    var s = (typeof window.getPersoSummary === 'function') ? window.getPersoSummary() : null;
    if (s && recap) {
      var villa = window.VILLA_NAME || 'cette villa';
      recap.innerHTML = 'Vos choix pour la Villa <b>' + villa + '</b> : intérieur <b>' + s.interior + '</b>, jardin <b>' + s.garden + '</b>. Nous les reprenons ensemble.';
      recap.classList.add('show');
    } else if (recap) {
      recap.classList.remove('show'); recap.innerHTML = '';
    }
  };

  window.closeContactModal = function () {
    document.getElementById('contactModal').classList.remove('active');
    document.body.classList.remove('modal-open');
  };

  function resetContactModal() {
    currentStep = 1;
    updateSteps();
    document.querySelectorAll('#contactModal input[type="radio"][name="stage"]').forEach(function (r) { r.checked = false; });
    ['contactFirstName','contactLastName','contactEmail','contactPhone','contactMessage'].forEach(function (id) {
      var el = document.getElementById(id); if (el) el.value = '';
    });
    var c = document.getElementById('contactCountry'); if (c) { c.selectedIndex = 0; }
    document.getElementById('phonePrefix').textContent = '+…';
    var p1 = document.getElementById('pref1'); if (p1) p1.checked = true;
    clearErrors();
    document.getElementById('modalActions').style.display = '';
    document.querySelectorAll('#modalProgress .modal-progress-bar').forEach(function (b, i) {
      b.classList.toggle('active', i === 0); b.classList.remove('done');
    });
  }

  function updateSteps() {
    document.querySelectorAll('.modal-step').forEach(function (s) { s.classList.remove('active'); });
    document.getElementById('step' + currentStep).classList.add('active');
    document.getElementById('modalBack').disabled = (currentStep === 1);
    document.getElementById('modalNext').textContent = currentStep === totalSteps ? 'Envoyer →' : 'Suivant →';
    document.querySelectorAll('#modalProgress .modal-progress-bar').forEach(function (b, i) {
      b.classList.toggle('active', i === currentStep - 1);
      b.classList.toggle('done', i < currentStep - 1);
    });
  }

  window.prevContactStep = function () {
    if (currentStep > 1) { currentStep--; updateSteps(); }
  };

  window.nextContactStep = function () {
    clearErrors();
    if (currentStep === 1) {
      if (!document.querySelector('input[name="stage"]:checked')) {
        showError('err-stage', 'Choisissez une option pour continuer.');
        return;
      }
    }
    if (currentStep === 2) {
      var ok = true;
      var fn = document.getElementById('contactFirstName').value.trim();
      var ln = document.getElementById('contactLastName').value.trim();
      var country = document.getElementById('contactCountry').value;
      var phone = document.getElementById('contactPhone').value.trim();
      var email = document.getElementById('contactEmail').value.trim();
      var pref = document.querySelector('input[name="pref"]:checked').value;
      if (!fn) { markInvalid('contactFirstName'); ok = false; }
      if (!ln) { markInvalid('contactLastName'); ok = false; }
      if (!country) { markInvalid('contactCountry'); ok = false; }
      if (!ok) showError('err-identity', 'Prénom, nom et pays sont indispensables.');
      if ((pref === 'phone' || pref === 'whatsapp') && !phone) {
        markInvalid('contactPhone');
        showError('err-contact', 'Un numéro de téléphone est indispensable pour être joint par ' + (pref === 'whatsapp' ? 'WhatsApp' : 'téléphone') + '.');
        ok = false;
      }
      if (pref === 'email') {
        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailOk) {
          markInvalid('contactEmail');
          showError('err-contact', 'Une adresse email valide est indispensable pour être joint par email.');
          ok = false;
        }
      }
      if (!ok) return;
    }
    if (currentStep === totalSteps) { submitContact(); return; }
    currentStep++; updateSteps();
  };

  function submitContact() {
    var sel = document.getElementById('contactCountry');
    var dial = sel.selectedOptions.length ? (sel.selectedOptions[0].dataset.dial || '') : '';
    var phone = document.getElementById('contactPhone').value.trim();
    var perso = (typeof window.getPersoSummary === 'function') ? window.getPersoSummary() : null;
    var villa = window.VILLA_NAME || null;

    var payload = {
      access_key: WEB3FORMS_KEY,
      subject: 'Contact' + (villa ? ' ' + villa : '') + ' — ' + document.getElementById('contactFirstName').value + ' ' + document.getElementById('contactLastName').value,
      from_name: document.getElementById('contactFirstName').value + ' ' + document.getElementById('contactLastName').value,
      'Étape du projet': (document.querySelector('input[name="stage"]:checked') || {}).value || '—',
      'Prénom': document.getElementById('contactFirstName').value,
      'Nom': document.getElementById('contactLastName').value,
      'Pays': sel.value || '—',
      'Téléphone': phone ? (dial + ' ' + phone) : '—',
      'Email': document.getElementById('contactEmail').value || '—',
      'Contact préféré': (document.querySelector('input[name="pref"]:checked') || {}).value || '—',
      'Message': document.getElementById('contactMessage').value || '—'
    };
    if (villa) payload['Villa'] = villa;
    if (perso) {
      payload['Approche intérieure choisie'] = perso.interior;
      payload['Approche jardin choisie'] = perso.garden;
    }

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(function () {});

    document.querySelectorAll('.modal-step').forEach(function (s) { s.classList.remove('active'); });
    document.getElementById('stepSuccess').classList.add('active');
    document.getElementById('modalActions').style.display = 'none';
    document.querySelectorAll('#modalProgress .modal-progress-bar').forEach(function (b) {
      b.classList.add('done'); b.classList.remove('active');
    });
  }

  // indicatif auto selon pays
  document.getElementById('contactCountry').addEventListener('change', function () {
    var d = this.selectedOptions[0] ? this.selectedOptions[0].dataset.dial : '';
    document.getElementById('phonePrefix').textContent = d || '+…';
  });

  // fermeture
  document.getElementById('contactModal').addEventListener('click', function (e) {
    if (e.target.id === 'contactModal') window.closeContactModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeContactModal();
  });
})();
