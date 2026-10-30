(function(){
"use strict";
const ALL=window.DATA, CH=window.CHAPITRES, VO=window.VOLETS, D={};
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const store={get(k,d){try{const v=localStorage.getItem("apc-"+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem("apc-"+k,JSON.stringify(v))}catch(e){}}};
const chName=id=>(CH.find(c=>c.id===id)||{}).titre||id;
const shuffle=a=>{a=a.slice();for(let k=a.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[a[k],a[j]]=[a[j],a[k]]}return a};
const L="ABCDE";
const SV=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICO={
 entretien:SV('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>'),
 bord:SV('<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>'),
 cours:SV('<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5V4.5"/><path d="M8 7h8M8 11h6"/>'),
 examen:SV('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2"/><path d="M9 2h6"/>'),
 qcm:SV('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/>'),
 fiches:SV('<rect x="6" y="3" width="15" height="13" rx="2"/><path d="M3 7v11a3 3 0 0 0 3 3h11"/>'),
 juris:SV('<path d="M12 3v18"/><path d="M5 21h14"/><path d="M4 7h16"/><path d="m4 7-2 6a3 3 0 0 0 4 0z"/><path d="m20 7-2 6a3 3 0 0 0 4 0z"/>'),
 delais:SV('<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/><path d="M8 14h3M8 17h6"/>'),
 calcul:SV('<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8"/><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h4"/>'),
 qualif:SV('<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>'),
 sujets:SV('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>'),
 cas:SV('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 13h20"/>'),
 doctrine:SV('<path d="M7 7h4v4c0 3-2 5-4 6"/><path d="M15 7h4v4c0 3-2 5-4 6"/>'),
 dissert:SV('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
 recherche:SV('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
 favoris:SV('<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/>'),
 arrets:SV('<path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5a2.5 2.5 0 0 0 0 5H20"/><circle cx="12" cy="10" r="3.5"/><path d="M12 8.5V10l1 1"/>'),
 imprimer:SV('<path d="M6 9V2h12v7"/><rect x="2" y="9" width="20" height="9" rx="2"/><path d="M6 14h12v8H6z"/>')
};
const VCOL={lib:"var(--v-lib)",pc:"var(--v-pc)",mard:"var(--v-mard)",arb:"var(--v-arb)",pce:"var(--v-pce)",cph:"var(--v-cph)",cgr:"var(--v-cgr)",cav:"var(--v-cav)",adm:"var(--v-adm)",pen:"var(--v-pen)",dsg:"var(--v-dsg)",pac:"var(--v-pac)"};
const vcOf=c=>VCOL[(CH.find(x=>x.id===c)||{}).v]||"var(--accent)";
const tagCh=c=>`<span class="tag" style="--vc:${vcOf(c)}">${esc(chName(c))}</span>`;
const favs=()=>store.get("fav",{});
const isFav=k=>!!favs()[k];
const starBtn=(k,label)=>`<button class="star ${isFav(k)?"on":""}" data-fav="${esc(k)}" aria-pressed="${isFav(k)}" aria-label="${isFav(k)?"Retirer des favoris":"Ajouter aux favoris"} : ${esc(label||"")}" title="Favori">${SV('<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/>')}</button>`;
document.addEventListener("click",e=>{const b=e.target.closest("[data-fav]");if(!b)return;e.preventDefault();const k=b.dataset.fav,f=favs();if(f[k])delete f[k];else f[k]=Date.now();store.set("fav",f);const on=!!f[k];b.classList.toggle("on",on);b.setAttribute("aria-pressed",on);b.setAttribute("aria-label",(on?"Retirer des favoris":"Ajouter aux favoris"));if(location.hash.startsWith("#favoris")&&!on)setTimeout(()=>route(),150)});
const norm=s=>String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
/* Concours : chapitres relevant du programme de procédure civile de chaque épreuve.
   CRFPA : arrêté du 17 octobre 2016 modifié (procédure civile, modes amiables, arbitrage, procédures civiles d'exécution).
   ENM : arrêté du 31 décembre 2008 modifié, épreuve de droit civil et procédure civile (rubriques A à J).
   Greffier : arrêté du 29 avril 2016 modifié, épreuve écrite n° 2, partie procédure civile. */
const PRUD=["p1","p2","p3","p4","p5","p6","p7","p8","p9","p10","p11"];
const PEN=["n1","n2","n3","n4","n5","n6","n7","n8","n9","n10","n11","n12","n13","n14","n15","n16"];
const ADM=["d1","d2","d3","d4","d5","d6","d7","d8","d9","d10"];
const PCH=["pd","act","comp","juge","intro","del","def","inst","pre","jug","urg","vro","vre"];
const CONC={
 crfpa:{t:"CRFPA",ch:CH.filter(c=>!["cph","cgr","dsg"].includes(c.v)).map(c=>c.id),ref:"Arrêté du 17 octobre 2016 modifié",ep:"Épreuve écrite d'admissibilité de procédure (2 heures, coefficient 2), sous la forme d'une ou plusieurs consultations. La procédure civile est l'épreuve de procédure des candidats ayant choisi la spécialité droit civil, droit des affaires ou droit social ; en droit international et européen et en droit fiscal, le candidat choisit entre procédure civile et procédure administrative. Programme : procédure civile, modes amiables de résolution des différends, arbitrage, procédures civiles d'exécution. Le contenu de procédure civile est concerné, à l'exception du volet de procédure prud'homale, qui ne figure pas au programme de l'épreuve, et de la culture juridique propre au concours de greffier. Le volet de procédure pénale prépare l'épreuve de procédure pénale, réservée aux candidats ayant choisi le droit pénal comme matière de spécialité (programme : procédure pénale et droit de l'exécution des peines). Le volet de procédure administrative contentieuse prépare l'épreuve de procédure administrative ; le volet de droit administratif et l'étude des arrêts préparent les candidats ayant choisi la spécialité droit public."},
 enm:{t:"ENM",ch:PCH.filter(c=>c!=="frais").concat(["m1","m2","m3","m5","cass"],PEN,ADM),ref:"Arrêté du 31 décembre 2008 modifié",ep:"Épreuve écrite d'admissibilité de droit civil et procédure civile : composition ou cas pratique au choix du jury (premier concours), cas pratique (deuxième concours), cas pratique ou questions à réponse courte au choix du candidat (troisième concours). Le programme vise l'action en justice, les actes de procédure, les délais, les principes directeurs et l'influence du droit européen, la preuve, les procédures contentieuse et gracieuse, les effets du jugement, les voies de recours et les modes amiables (médiation et conciliation). L'arbitrage, les procédures civiles d'exécution, les procédures participatives et les frais du procès en sont exclus. Le volet de procédure pénale prépare l'épreuve de droit pénal et procédure pénale (principes généraux et influence du droit européen, action publique, action civile, acteurs, phase préparatoire, jugement et voies de recours). Le volet de droit administratif et l'étude des arrêts servent en outre l'épreuve de droit public et l'option orale de droit administratif du premier concours."},
 go:{t:"Grand oral CRFPA",ch:["l1","l2","l3","l4","l5","l6","l7","l8","k5","k6","k7","k8","d5","d10","n1","n6","n9","n10"],ref:"Arrêté du 17 octobre 2016 modifié, art. 7",ep:"Épreuve d'admission : exposé de quinze minutes, après une préparation d'une heure, sur un sujet relatif à la protection des libertés et des droits fondamentaux, suivi d'un entretien de trente minutes avec le jury ; séance publique ; coefficient 4. Le programme couvre la culture juridique générale, l'origine et les sources, le régime juridique et les principales libertés. Le filtre affiche le volet Grand oral, la culture juridique utile à l'entretien, la police administrative et les référés, les principes directeurs de la procédure pénale, la garde à vue, la détention provisoire et la preuve, ainsi que les arrêts administratifs et pénaux intéressant les libertés."},
 greffier:{t:"Greffier",ch:PCH.concat(["m2","e1","cass"],PRUD,["k1","k2","k3","k4","k9","k10","k11","d2","d3"],PEN),ref:"Arrêté du 29 avril 2016 modifié",ep:"Épreuve écrite d'admissibilité n° 2 (3 heures, coefficient 4) : organisation judiciaire et administrative, puis deux questions de procédure, au choix du candidat : procédure civile et prud'homale, procédure pénale, ou une question de chaque. L'application couvre la procédure civile, y compris la conciliation et l'exécution des jugements, ainsi que la procédure prud'homale et l'organisation du conseil de prud'hommes ; l'organisation administrative et les juridictions administratives sont traitées dans le volet de droit administratif ; le volet de procédure pénale couvre l'action publique et l'action civile, le ministère public, les enquêtes, les alternatives aux poursuites, l'instruction, la CRPC, le JLD, le contrôle judiciaire, la détention provisoire, les mandats, les juridictions de jugement dont la cour d'assises, les mineurs, les voies de recours, l'exécution des peines et la victime ; les auxiliaires de justice font l'objet d'un chapitre du volet de culture juridique. Un volet de culture juridique prépare l'entretien de l'épreuve orale d'admission."},
 dsg:{t:"Directeur de greffe",ch:PCH.concat(["m2","e1","cass"],PRUD,PEN,["k1","k2","k3","k9","k11","g1","g2","g3","g4","g5","g6","g7","g8","g9"]),ref:"Arrêté du 29 avril 2016 modifié ; notice du concours, session 2027",ep:"Concours de directeur des services de greffe judiciaires. Écrits : épreuve n° 1, composition sur le monde contemporain ou note de synthèse (externe), note sur dossier administratif (interne), 4 heures, coefficient 4 ; épreuve n° 2, questions à réponse courte de 4 heures, coefficient 4, portant sur la procédure civile et prud'homale, la procédure pénale, l'organisation judiciaire et la gestion des ressources humaines (externe), ou sur la gestion des ressources humaines et, au choix, la procédure civile et prud'homale ou la procédure pénale (interne). Oraux : entretien de 30 minutes, coefficient 5 ; interrogation de 15 minutes sur les finances publiques ou le droit de la fonction publique, coefficient 3. Le filtre affiche les procédures, l'organisation judiciaire et le volet propre au directeur."}
};
const conc=()=>{const k=store.get("conc","");return CONC[k]?k:""};
const inConc=c=>{const k=conc();return !k||!CONC[k].ch||CONC[k].ch.includes(c)};
const delaiCh=x=>{if(x.c)return x.c;const t=x.t;if(/CPCE/.test(t))return /L\. 111-4/.test(t)?"e1":/R\. 511/.test(t)?"e3":/R\. 211/.test(t)?"e4":"e5";if(/1343-5/.test(t))return "e1";if(/1534/.test(t))return "m2";if(/2238/.test(t))return "m1";if(/1463/.test(t))return "a2";if(/1494|1519/.test(t))return "a3";if(/C\. trav/.test(t))return /R\. 1461|R\. 1455-11/.test(t)?"p8":/4624/.test(t)?"p7":/L\. 1245-2|L\. 1451-1|L\. 1454-1-1|R\. 1454-12/.test(t)?"p5":/1454/.test(t)?"p6":"p3";return "del"};
function applyConc(){D.qcm=ALL.qcm.filter(q=>inConc(q.c));D.fiches=ALL.fiches.filter(x=>inConc(x.c));D.juris=ALL.juris.filter(x=>inConc(x.c));D.cas=ALL.cas;D.delais=ALL.delais;D.qualif=ALL.qualif;D.qualifPen=ALL.qualifPen||[];D.qualifCat=ALL.qualifCat||[]}
applyConc();
const concNote=()=>{const k=conc();return k?`<p class="small muted" style="margin-top:-4px">Filtre actif : programme ${esc(CONC[k].t)} · <a href="#" style="color:var(--accent)">modifier depuis l'accueil</a></p>`:""};
/* Répétition espacée des QCM : boîte 1 à 5, intervalle en jours avant nouvelle présentation */
const QINT=[1,1,3,7,15];
const qBox=r=>r?(r.b||(r.ok?2:1)):0;
const qDue=r=>!!r&&(Date.now()-r.t)>=QINT[qBox(r)-1]*864e5;
function recordQ(q,ok){const r=store.get("qcm",{}),pr=r[q.id]||{},b=ok?Math.min(5,(pr.t?qBox(pr):0)+1):1;r[q.id]={ok,t:Date.now(),n:(pr.n||0)+1,k:(pr.k||0)+(ok?1:0),b};store.set("qcm",r);logAct()}
const dayKey=d=>{d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const logAct=()=>{const a=store.get("act",{}),k=dayKey();a[k]=(a[k]||0)+1;store.set("act",a)};
const MODULES=[
 {id:"recherche",g:"o",t:"Recherche",d:"Dans les cours, fiches, QCM, arrêts et sujets",n:()=>"Outil"},
 {id:"favoris",g:"o",t:"Favoris",d:"Questions, fiches, arrêts et chapitres mis de côté",n:()=>Object.keys(favs()).length+" favori"+(Object.keys(favs()).length>1?"s":"")},
 {id:"bord",g:"o",t:"Tableau de bord",d:"Progression par volet et par chapitre, points faibles",n:()=>"Suivi"},
 {id:"cours",g:"a",t:"Fiches de cours",d:"Synthèses par chapitre, textes et jurisprudence",n:()=>CH.length+" chapitres"},
 {id:"examen",g:"e",t:"Examen blanc",d:"Série chronométrée notée sur 20, correction à la fin",n:()=>"Épreuve"},
 {id:"qcm",g:"e",t:"QCM",d:"Cinq propositions, une ou plusieurs exactes",n:()=>D.qcm.length+" questions"},
 {id:"fiches",g:"a",t:"Fiches mémoire",d:"Répétition espacée en cinq boîtes",n:()=>D.fiches.length+" fiches"},
 {id:"arrets",g:"a",t:"Étude des arrêts",d:"Grands arrêts administratifs et pénaux : date, juridiction, portée",n:()=>arrList().length+" arrêts"},
 {id:"juris",g:"a",t:"Jurisprudence",d:"Grands arrêts : solution et portée",n:()=>D.juris.length+" arrêts"},
 {id:"delais",g:"e",t:"Tableau des délais",d:"Durées à compléter, départ et sanction",n:()=>D.delais.length+" délais"},
 {id:"calcul",g:"o",t:"Calculateur de délais",d:"Articles 640 à 643, jours fériés inclus",n:()=>"Outil"},
 {id:"qualif",g:"e",t:"Qualifications",d:"Exception, fin de non recevoir, défense au fond ; nullités pénales",n:()=>(D.qualif.length+D.qualifPen.length)+" situations"},
 {id:"entretien",g:"e",t:"Entretien oral",d:"Greffier et directeur des services de greffe : oral chronométré et questions du jury",n:()=>ALL.entretien.questions.length+" questions"},
 {id:"sujets",g:"e",t:"Sujets d'examen",d:"Sujets au format de chaque concours, corrigés détaillés et grille de notation",n:()=>(window.SUJETS||[]).filter(s=>!conc()||s.conc===conc()).length+" sujets"},
 {id:"cas",g:"e",t:"Cas pratiques",d:"Énoncés type examen et corrigés rédigés",n:()=>D.cas.length+" cas"},
 {id:"doctrine",g:"a",t:"Débats doctrinaux",d:"Thèses récentes, controverses et critiques",n:()=>window.DOCTRINE.length+" débats"},
 {id:"dissert",g:"a",t:"Dissertations",d:"Sujets, problématiques et plans détaillés",n:()=>window.DISSERT.length+" sujets"}
];
const app=$("#app"), ttl=$("#ttl"), back=$("#back");

function chapterSelect(id,val,withAll=true){
  const vos=VO.filter(v=>CH.some(c=>c.v===v.id&&inConc(c.id)));
  return `<select id="${id}" aria-label="Chapitre">${withAll?'<option value="">Tous les volets</option>':""}${vos.map(v=>`<optgroup label="${esc(v.titre)}"><option value="v:${v.id}" ${val==="v:"+v.id?"selected":""}>Tout le volet ${esc(v.titre.toLowerCase())}</option>${CH.filter(c=>c.v===v.id&&inConc(c.id)).map(c=>`<option value="${c.id}" ${c.id===val?"selected":""}>${esc(c.titre)}</option>`).join("")}</optgroup>`).join("")}</select>`;
}
const inSel=(c,val)=>!val||(val.startsWith("v:")?(CH.find(x=>x.id===c)||{}).v===val.slice(2):c===val);

/* ---------- Accueil ---------- */
function vHome(){
  app.style.removeProperty("--vc");
  const qs=store.get("qcm",{}); const done=Object.keys(qs).filter(id=>D.qcm.some(q=>q.id===id)), ok=done.filter(id=>qs[id].ok).length;
  const fb=store.get("fbox",{}); const known=D.fiches.filter(f=>(fb[f.id]||1)>=4).length;
  const due=D.qcm.filter(q=>qDue(qs[q.id])).length;
  const GR=[["a","Apprendre"],["e","S'entraîner"],["o","Suivre et chercher"]];
  const VID={pc:"cours",mard:"cours",arb:"cours",pce:"cours"};
  app.innerHTML=`<section class="cover"><div class="eyebrow">${conc()==="go"?"CRFPA · Grand oral · Libertés et droits fondamentaux":"CRFPA · ENM · Greffier · Directeur des services de greffe"}</div><h1>Procedurae</h1>
  <p class="lead">Un projet pédagogique gratuit, conçu pour accompagner les étudiants dans la révision des matières de procédure exigées aux examens et concours juridiques : CRFPA, École nationale de la magistrature, greffier et directeur des services de greffe judiciaires. Synthèses de cours, exercices d'entraînement corrigés et outils pratiques, accessibles sans inscription ; votre progression reste enregistrée sur cet appareil.</p>
  <div class="maj">Textes à jour au 28 octobre 2026</div>
  <div class="row" style="margin-top:16px">${[["","Tous"]].concat(Object.keys(CONC).map(k=>[k,CONC[k].t])).map(([k,n])=>`<button class="chip ${conc()===k?"on":""}" data-conc="${k}">${esc(n)}</button>`).join("")}</div>
  ${conc()?`<p class="concinfo">${esc(CONC[conc()].ep)} <span style="opacity:.8">${esc(CONC[conc()].ref)}.</span></p>`:`<p class="concinfo">Choisissez votre concours pour n'afficher que son programme.</p>`}
  <div class="stats"><div><b>${done.length}/${D.qcm.length}</b><span>QCM traités</span></div><div><b>${done.length?Math.round(ok/done.length*100):0} %</b><span>QCM réussis</span></div><div><b>${known}/${D.fiches.length}</b><span>Fiches maîtrisées</span></div></div>
  </section>
  <div class="panel" id="iosInst" hidden style="margin-top:16px;margin-bottom:4px"><b>Installer l'application sur iPhone ou iPad</b><ol class="small" style="margin:8px 0 10px;padding-left:20px"><li>Ouvrez ce site dans Safari.</li><li>Touchez le bouton Partager (le carré avec une flèche vers le haut), en bas ou en haut de l'écran.</li><li>Choisissez « Sur l'écran d'accueil », puis « Ajouter ».</li></ol><p class="small muted" style="margin:0 0 10px">L'application s'ouvre alors en plein écran et fonctionne hors connexion. Tant qu'elle n'est pas installée, Safari peut effacer votre progression après sept jours sans visite : pensez à l'exporter depuis le <a href="#bord" style="color:var(--accent)">tableau de bord</a>.</p><button class="btn" id="iosLater">Masquer ce message</button></div>
  <div class="volets">${VO.filter(v=>CH.some(c=>c.v===v.id&&inConc(c.id))).map(v=>`<a class="vchip" style="--vc:${VCOL[v.id]}" href="#cours/v:${v.id}"><i></i>${esc(v.titre)}</a>`).join("")}</div>
  <div class="row" style="margin-top:14px">${due?`<a class="btn primary" href="#qcm">${due} QCM à réviser aujourd'hui</a>`:`<a class="btn primary" href="#qcm">Lancer une série de QCM</a>`}<a class="btn" href="#bord">${ICO.bord.replace('<svg','<svg width="18" height="18"')} Tableau de bord</a></div>
  ${GR.map(([g,lab])=>`<div class="grp">${lab}</div><div class="grid">${MODULES.filter(m=>m.g===g).map((m,i,arr)=>`<a class="tile ${i<(3-arr.length%3)%3?"wide":""}" href="#${m.id}"><span class="ico">${ICO[m.id]||""}</span><span class="n">${m.n()}</span><b>${m.t}</b><span>${m.d}</span></a>`).join("")}</div>`).join("")}
  <div class="panel install" id="inst" hidden style="margin-top:16px"><span class="small">Installez l'application sur votre écran d'accueil pour l'utiliser hors connexion.</span><button class="btn primary" id="instBtn">Installer</button></div>
  <p class="note">Contenus établis d'après le <a href="https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006070716" target="_blank" rel="noopener">Code de procédure civile</a> et le <a href="https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006070721" target="_blank" rel="noopener">Code civil</a> et le <a href="https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006072050" target="_blank" rel="noopener">Code du travail</a> applicables au 28 octobre 2026, compte tenu des décrets n° 2023-1391, n° 2024-673, n° 2025-660 et n° 2026-683. Programme de référence : arrêté du 17 octobre 2016 modifié (CRFPA), arrêté du 31 décembre 2008 modifié (ENM) et arrêté du 29 avril 2016 modifié (concours de greffier des services judiciaires, procédure civile et prud'homale). Support d'entraînement : vérifiez toujours les textes en vigueur.</p>
  <p class="note"><a href="#mentions" style="color:var(--accent)">Mentions légales</a></p>
  <p class="note"><button class="btn" id="wipe">Effacer toute ma progression</button></p>`;
  app.querySelectorAll("[data-conc]").forEach(b=>b.onclick=()=>{store.set("conc",b.dataset.conc);applyConc();resetViews();vHome()});
  if(IOS&&!STANDALONE&&!store.get("iosHide",0)){const h=$("#iosInst");h.hidden=false;$("#iosLater").onclick=()=>{store.set("iosHide",1);h.hidden=true}}
  if(deferredPrompt&&!IOS){$("#inst").hidden=false;$("#instBtn").onclick=async()=>{deferredPrompt.prompt();deferredPrompt=null;$("#inst").hidden=true}}
  $("#wipe").onclick=e=>{const b=e.target;if(b.dataset.c){["qcm","fbox","dans","cas","act","qual","suj","fav"].forEach(k=>store.set(k,{}));store.set("exams",[]);b.textContent="Progression effacée";delete b.dataset.c;setTimeout(()=>route(),800)}else{b.dataset.c=1;b.textContent="Confirmer l'effacement"}};
}

/* ---------- Cours ---------- */
function vCours(param){
  if(param&&!param.startsWith("v:")){const c=CH.find(x=>x.id===param); if(!c)return vCours();
    const i=CH.indexOf(c), prev=CH[i-1], next=CH[i+1];
    ttl.textContent=c.titre;
    app.style.setProperty("--vc",vcOf(c.id));app.innerHTML=`<div class="row" style="justify-content:space-between;align-items:flex-start;gap:12px"><div style="min-width:0"><div class="eyebrow" style="color:var(--vc)">${esc((VO.find(v=>v.id===c.v)||{}).titre||"")} · Chapitre ${i+1} sur ${CH.length}${inConc(c.id)?"":" · hors programme "+esc(CONC[conc()].t)}</div><h1>${esc(c.titre)}</h1></div><div class="row noprint" style="gap:6px;flex:none">${starBtn("c:"+c.id,c.titre)}<a class="star" href="#imprimer/${c.id}" aria-label="Imprimer le chapitre" title="Imprimer ou enregistrer en PDF">${ICO.imprimer}</a></div></div>
    ${c.sections.map(s=>`<div class="sec"><h3>${esc(s.h)}</h3>${s.p.map(p=>`<p>${esc(p)}</p>`).join("")}</div>`).join("")}
    ${(()=>{const ds=window.DOCTRINE.map((d,k)=>[d,k]).filter(([d])=>d.c.includes(c.id));return ds.length?`<h3>Débats doctrinaux</h3><div class="stack">${ds.map(([d,k])=>`<a class="tile" href="#doctrine/${k}"><span class="n">${d.th.map(t=>esc(window.THESES[t].a)).join(" · ")}</span><b>${esc(d.titre)}</b></a>`).join("")}</div>`:""})()}
    <div class="panel row" style="margin-top:18px"><a class="btn primary" href="#qcm/${c.id}">QCM du chapitre</a><a class="btn" href="#fiches/${c.id}">Fiches du chapitre</a>${D.juris.some(j=>j.c===c.id)?`<a class="btn" href="#juris/${c.id}">Arrêts du chapitre</a>`:""}</div>
    <div class="row" style="justify-content:space-between;margin-top:14px">${prev?`<a class="btn" href="#cours/${prev.id}">Chapitre précédent</a>`:"<span></span>"}${next?`<a class="btn" href="#cours/${next.id}">Chapitre suivant</a>`:""}</div>`;
    return;}
  const vf=(param||"").startsWith("v:")?param.slice(2):"";
  app.innerHTML=`<h1>Fiches de cours</h1><p class="lead">${CH.length} chapitres répartis par volet du programme. Chaque fiche renvoie aux exercices correspondants.</p>${concNote()}
  ${VO.filter(v=>CH.some(c=>c.v===v.id)&&(!vf||v.id===vf)).map(v=>`<h3>${esc(v.titre)}</h3><div class="stack">${CH.filter(c=>c.v===v.id).map(c=>`<a class="tile" href="#cours/${c.id}" style="${inConc(c.id)?"":"opacity:.55"}"><span class="n">Chapitre ${CH.indexOf(c)+1} · ${ALL.qcm.filter(q=>q.c===c.id).length} QCM · ${ALL.fiches.filter(f=>f.c===c.id).length} fiches${inConc(c.id)?"":" · hors programme "+esc(CONC[conc()].t)}</span><b>${esc(c.titre)}</b><span>${c.sections.map(s=>esc(s.h)).join(" · ")}</span></a>`).join("")}</div>`).join("")}
  ${vf?`<p style="margin-top:14px"><a class="btn" href="#cours">Tous les volets</a></p>`:""}`;
}

/* ---------- QCM ---------- */
let qs=null;
function vQcm(param){
  if(!qs||qs.param!==param){qs={param,list:null,pos:0,ans:null,order:null,score:0}}
  const res=store.get("qcm",{});
  if(!qs.list){
    const c=param||"";
    app.innerHTML=`<h1>QCM</h1><p class="lead">Chaque question admet une ou plusieurs réponses exactes ; seule la combinaison complète est comptée juste. En répétition espacée, une question ratée revient le lendemain, une question réussie revient après 1, 3, 7 puis 15 jours.</p>${concNote()}
    <div class="panel stack"><div class="field"><label for="qc">Chapitre</label>${chapterSelect("qc",c)}</div>
    <div class="field"><label for="qm">Questions</label><select id="qm"><option value="rev">À réviser aujourd'hui (répétition espacée)</option><option value="all">Toutes</option><option value="new">Jamais traitées</option><option value="err">Mes erreurs</option><option value="fav">Mes favoris</option></select></div>
    <div class="field"><label for="qn">Longueur de la série</label><select id="qn"><option>10</option><option selected>20</option><option value="999">Toutes</option></select></div>
    <div class="row"><button class="btn primary" id="qgo">Commencer</button><span class="small muted" id="qinfo"></span></div></div>`;
    const info=()=>{const pool=pool_();$("#qinfo").textContent=pool.length+" question"+(pool.length>1?"s":"")+" disponible"+(pool.length>1?"s":"")};
    const pool_=()=>D.qcm.filter(q=>inSel(q.c,$("#qc").value)&&($("#qm").value==="all"||($("#qm").value==="fav"&&isFav("q:"+q.id))||($("#qm").value==="rev"&&qDue(res[q.id]))||($("#qm").value==="new"&&!res[q.id])||($("#qm").value==="err"&&res[q.id]&&!res[q.id].ok)));
    ["qc","qm"].forEach(id=>$("#"+id).onchange=info);info();
    $("#qgo").onclick=()=>{const p0=pool_(),pool=($("#qm").value==="rev"?shuffle(p0).sort((a,b)=>qBox(res[a.id])-qBox(res[b.id])||res[a.id].t-res[b.id].t):shuffle(p0)).slice(0,+$("#qn").value);if(!pool.length){$("#qinfo").textContent=$("#qm").value==="rev"?"Aucune question à réviser aujourd'hui : choisissez « Jamais traitées » ou « Toutes ».":"Aucune question.";return}qs.list=pool;qs.pos=0;qs.score=0;qs.ans=null;vQcm(param)};
    return;
  }
  if(qs.pos>=qs.list.length){
    const err=qs.list.filter(q=>!(store.get("qcm",{})[q.id]||{}).ok);
    app.innerHTML=`<h1>Série terminée</h1><div class="panel"><div class="big">${qs.score} / ${qs.list.length}</div><p class="muted">${err.length?"Chapitres à revoir : "+[...new Set(err.map(q=>chName(q.c)))].join(", ")+".":"Aucune erreur sur cette série."}</p><div class="row"><button class="btn primary" id="again">Nouvelle série</button><a class="btn" href="#">Accueil</a></div></div>`;
    $("#again").onclick=()=>{qs=null;vQcm(param)};return;
  }
  const q=qs.list[qs.pos]; if(!qs.order)qs.order=shuffle([0,1,2,3,4]);
  const a=qs.ans;
  app.innerHTML=`<div class="row" style="justify-content:space-between">${tagCh(q.c)}<span class="row" style="gap:8px"><span class="mono small muted">${qs.pos+1} / ${qs.list.length} · ${qs.score} juste${qs.score>1?"s":""}</span>${starBtn("q:"+q.id,"question")}</span></div>
  <div class="bar" style="margin:10px 0 14px"><i style="width:${qs.pos/qs.list.length*100}%"></i></div>
  <div class="q-text">${esc(q.q)}</div><div class="small muted">Une ou plusieurs réponses exactes.</div>
  <div class="opts">${qs.order.map((oi,p)=>{const o=q.o[oi],chk=a&&a.includes(oi);let cls="";if(a){if(chk&&o[1])cls="good";else if(chk)cls="bad";else if(o[1])cls="miss"}
   return `<label class="opt ${cls}"><input type="checkbox" id="o${oi}" data-o="${oi}" ${chk?"checked":""} ${a?"disabled":""}><span class="L">${L[p]}</span><span class="t">${esc(o[0])}</span></label>`}).join("")}</div>
  ${a?(()=>{const ok=isOk(q,a);return `<div class="expl"><p class="${ok?"v-ok":"v-ko"}">${ok?"Réponse juste.":"Réponse inexacte. Bonnes réponses : "+qs.order.map((oi,p)=>q.o[oi][1]?L[p]:"").join("")+"."}</p><p>${esc(q.e)}</p><div class="ref">${q.r.map(esc).join(" · ")}</div></div>
   <div class="row" style="margin-top:14px"><a class="btn" href="#cours/${q.c}">Revoir le cours</a><button class="btn primary" id="qnext">${qs.pos+1<qs.list.length?"Question suivante":"Voir le résultat"}</button></div>`})()
  :`<div class="row" style="margin-top:14px"><button class="btn primary" id="qval">Valider</button></div>`}`;
  if(!a)$("#qval").onclick=()=>{const sel=[...app.querySelectorAll("input:checked")].map(x=>+x.dataset.o);if(!sel.length){$("#qval").textContent="Cochez au moins une proposition";return}
    qs.ans=sel;const ok=isOk(q,sel);if(ok)qs.score++;recordQ(q,ok);vQcm(param)};
  else $("#qnext").onclick=()=>{qs.pos++;qs.ans=null;qs.order=null;vQcm(param);window.scrollTo(0,0)};
}
const isOk=(q,sel)=>{const g=q.o.map((o,k)=>o[1]?k:-1).filter(k=>k>=0);return sel.length===g.length&&g.every(k=>sel.includes(k))};

/* ---------- Fiches mémoire ---------- */
let fs_={cur:null,shown:false,c:null};
function vFiches(param){
  if(fs_.c!==(param||"")){fs_={cur:null,shown:false,c:param||""}}
  const box=store.get("fbox",{});
  const pool=D.fiches.filter(f=>inSel(f.c,fs_.c));
  const pick=()=>{const w=pool.map(f=>[f,Math.pow(2,5-(box[f.id]||1))]);let r=Math.random()*w.reduce((s,x)=>s+x[1],0);for(const [f,x] of w){r-=x;if(r<=0&&(!fs_.cur||f.id!==fs_.cur.id||pool.length===1))return f}return pool[0]};
  if(!fs_.cur||!pool.includes(fs_.cur))fs_.cur=pick();
  const f=fs_.cur, counts=[0,0,0,0,0]; pool.forEach(x=>counts[(box[x.id]||1)-1]++);
  app.innerHTML=`<h1>Fiches mémoire</h1><p class="lead">Une fiche sue monte d'une boîte ; une fiche manquée retourne en boîte 1. Les boîtes basses reviennent plus souvent.</p>${concNote()}
  <div class="row" style="margin-bottom:10px">${chapterSelect("fc",fs_.c)}</div>
  <div class="boxes">${counts.map((c,k)=>`<div><b>${c}</b>Boîte ${k+1}</div>`).join("")}</div>
  <div class="panel stack" style="margin-top:12px;min-height:220px"><div class="row" style="justify-content:space-between">${tagCh(f.c)}<span class="row" style="gap:8px"><span class="mono small muted">Boîte ${box[f.id]||1}</span>${starBtn("f:"+f.id,"fiche")}</span></div>
  <div class="q-text">${esc(f.q)}</div>
  ${fs_.shown?`<div class="expl"><p>${esc(f.a)}</p><div class="ref">${esc(f.r)}</div></div><div class="row"><button class="btn ok" id="fy">Je savais</button><button class="btn ko" id="fn">À revoir</button></div>`:`<div class="row"><button class="btn primary" id="fs">Voir la réponse</button></div>`}</div>`;
  $("#fc").onchange=e=>{location.hash="fiches"+(e.target.value?"/"+e.target.value:"")};
  if(!fs_.shown)$("#fs").onclick=()=>{fs_.shown=true;vFiches(param)};
  else{const grade=up=>{const b=store.get("fbox",{});b[f.id]=up?Math.min(5,(b[f.id]||1)+1):1;store.set("fbox",b);logAct();fs_.shown=false;fs_.cur=null;vFiches(param)};$("#fy").onclick=()=>grade(true);$("#fn").onclick=()=>grade(false)}
}

/* ---------- Jurisprudence ---------- */
let jHide=false;
function vJuris(param){
  const list=D.juris.filter(j=>inSel(j.c,param));
  app.innerHTML=`<h1>Jurisprudence</h1><p class="lead">Les arrêts à connaître pour ce volet. En mode entraînement, la solution est masquée : retrouvez la avant de l'afficher.</p>${concNote()}
  <div class="row" style="margin-bottom:12px">${chapterSelect("jc",param||"")}<label class="row small"><input type="checkbox" id="jh" ${jHide?"checked":""}> Mode entraînement</label></div>
  <div class="stack">${list.map((j,i)=>`<div class="panel"><div class="row" style="justify-content:space-between">${tagCh(j.c)}${starBtn("j:"+j.nom,j.nom)}</div>
  <h2 style="margin-top:8px">${esc(j.nom)}</h2><div class="ref">${esc(j.ref)}</div>
  ${jHide?`<details style="margin-top:10px"><summary>Afficher la solution</summary><p style="margin-top:8px">${esc(j.sol)}</p><p class="small muted">${esc(j.portee)}</p></details>`:`<p style="margin-top:10px">${esc(j.sol)}</p><p class="small muted">${esc(j.portee)}</p>`}</div>`).join("")}</div>`;
  $("#jc").onchange=e=>{location.hash="juris"+(e.target.value?"/"+e.target.value:"")};
  $("#jh").onchange=e=>{jHide=e.target.checked;vJuris(param)};
}

/* ---------- Étude des arrêts (droit administratif) ---------- */
const ARR=ALL.arrets||{themes:{},list:[]};
const TH2CH={...((ALL.arrets||{}).th2ch||{}),intro:"d1",orga:"d2",juridictions:"d3",sp:"d4",police:"d5",actes:"d6",contrats:"d7",legalite:"d8",resp:"d9",contentieux:"d10"};
const JURN={"TC":"Tribunal des conflits","CE":"Conseil d'État","CE Ass.":"Conseil d'État, Assemblée","CE Sect.":"Conseil d'État, Section","CE ord.":"Conseil d'État, ordonnance de référé","CE avis":"Conseil d'État, avis","Cons. const.":"Conseil constitutionnel","Cass. crim.":"Cour de cassation, chambre criminelle","Ass. plén.":"Cour de cassation, Assemblée plénière","CEDH":"Cour européenne des droits de l'homme","CEDH gr. ch.":"Cour européenne des droits de l'homme, grande chambre","CJUE gr. ch.":"Cour de justice de l'Union européenne, grande chambre"};
const fmtA=d=>{const [y,m,j]=d.split("-").map(Number);return (j===1?"1er":j)+" "+MOIS[m-1]+" "+y};
const arrRef=a=>a.jur+", "+fmtA(a.d);
const arrOk=a=>{const k=conc();if(!k)return true;if(k==="go")return a.lib;return inConc(TH2CH[a.th])};
const arrList=()=>ARR.list.filter(a=>arrOk(a)&&(!arF.m||a.m===arF.m));
const MAT={adm:"Droit administratif",pen:"Procédure pénale"};
const aBox=id=>(store.get("arr",{})[id]||{}).b||0;
const aDue=id=>{const r=store.get("arr",{})[id];return !r||(Date.now()-r.t)>=QINT[r.b-1]*864e5};
function recordA(id,ok){const r=store.get("arr",{}),pr=r[id]||{};r[id]={b:ok?Math.min(5,(pr.b||0)+1):1,t:Date.now(),n:(pr.n||0)+1,k:(pr.k||0)+(ok?1:0)};store.set("arr",r);logAct()}
const AMODES={date:"Nom → date et juridiction",portee:"Nom → portée",nom:"Solution → nom de l'arrêt",chrono:"Date → nom de l'arrêt",mix:"Mélange des quatre"};
let arTab="liste",arF={q:"",th:"",jur:"",m:"",lib:false,tri:"chrono",hide:false},aq=null,ac={cur:null,shown:false};
function arrDistract(a,pool,how,label){
  // how : "date" (années proches) ou "theme" (même thème d'abord)
  let c=pool.filter(x=>x.id!==a.id&&x.m===a.m);if(c.length<3)c=pool.filter(x=>x.id!==a.id);
  if(how==="date")c=c.sort((x,y)=>Math.abs(+x.d.slice(0,4)-+a.d.slice(0,4))-Math.abs(+y.d.slice(0,4)-+a.d.slice(0,4))).slice(0,10);
  else c=shuffle(c.filter(x=>x.th===a.th)).concat(shuffle(c.filter(x=>x.th!==a.th)));
  const out=[],seen=new Set([label(a)]);for(const x of (how==="date"?shuffle(c):c)){const l=label(x);if(!seen.has(l)){seen.add(l);out.push(x)}if(out.length===3)break}return out;
}
function arrQuestion(a,mode,pool){
  if(mode==="mix")mode=["date","portee","nom","chrono"][Math.floor(Math.random()*4)];
  const nm=x=>x.nom;
  if(mode==="date")return {mode,a,prompt:`Quelle est la juridiction et la date de l'arrêt « ${a.nom} » ?`,opts:shuffle([a,...arrDistract(a,pool,"date",arrRef)]),lab:arrRef};
  if(mode==="portee")return {mode,a,prompt:`Quelle est la portée de l'arrêt « ${a.nom} » ?`,opts:shuffle([a,...arrDistract(a,pool,"theme",x=>x.portee)]),lab:x=>x.portee};
  if(mode==="nom")return {mode,a,prompt:a.sol,sub:"Quel arrêt a posé cette solution ?",opts:shuffle([a,...arrDistract(a,pool,"theme",nm)]),lab:nm};
  return {mode,a,prompt:`${JURN[a.jur]||a.jur}, ${fmtA(a.d)}`,sub:`Thème : ${ARR.themes[a.th]}. De quel arrêt s'agit il ?`,opts:shuffle([a,...arrDistract(a,pool,"date",nm)]),lab:nm};
}
function arrCard(a,open){
  const r=store.get("arr",{})[a.id];
  return `<div class="panel" id="a-${a.id}"><div class="row" style="justify-content:space-between;gap:8px"><span class="row" style="gap:6px">${tagCh(TH2CH[a.th])}${a.lib?`<span class="tag" style="--vc:var(--v-lib)">Libertés</span>`:""}</span><span class="row" style="gap:8px">${r?`<span class="mono small muted">Boîte ${r.b}</span>`:""}${starBtn("a:"+a.id,a.nom)}</span></div>
  <h2 style="margin-top:8px">${esc(a.nom)}</h2><div class="ref">${esc(JURN[a.jur]||a.jur)}, ${esc(fmtA(a.d))}</div>
  ${arF.hide&&!open?`<details style="margin-top:10px"><summary>Afficher la solution et la portée</summary><p style="margin-top:8px">${esc(a.sol)}</p><p class="small"><b>Portée.</b> ${esc(a.portee)}</p></details>`:`<p style="margin-top:10px">${esc(a.sol)}</p><p class="small"><b>Portée.</b> ${esc(a.portee)}</p>`}</div>`;
}
function vArrets(param){
  const all=arrList(),st=store.get("arr",{});
  const seen=all.filter(a=>st[a.id]).length,known=all.filter(a=>(st[a.id]||{}).b>=4).length,due=all.filter(a=>aDue(a.id)).length;
  const head=`<h1>Étude des arrêts</h1><p class="lead">Les grands arrêts du droit administratif et de la procédure pénale : retrouver la juridiction, la date, la solution et la portée à partir du seul nom, et inversement. Un arrêt réussi monte d'une boîte ; un arrêt manqué revient en boîte 1.</p>${concNote()}
  <div class="boxes" style="grid-template-columns:repeat(4,1fr)"><div><b>${all.length}</b>Arrêts</div><div><b>${seen}</b>Déjà vus</div><div><b>${known}</b>Maîtrisés</div><div><b>${due}</b>À voir ou revoir</div></div>
  <div class="row" style="margin:14px 0 4px">${[["","Toutes matières"],["adm","Droit administratif"],["pen","Procédure pénale"]].map(([k,n])=>`<button class="chip ${arF.m===k?"on":""}" data-am="${k}">${n}</button>`).join("")}</div><div class="row" style="margin:6px 0 12px">${[["liste","Liste et frise"],["quiz","Quiz"],["cartes","Cartes mémoire"]].map(([k,n])=>`<button class="chip ${arTab===k?"on":""}" data-at="${k}">${n}</button>`).join("")}</div>`;
  const bindTabs=()=>{app.querySelectorAll("[data-at]").forEach(b=>b.onclick=()=>{arTab=b.dataset.at;if(param)location.hash="arrets";else vArrets()});app.querySelectorAll("[data-am]").forEach(b=>b.onclick=()=>{arF.m=b.dataset.am;arF.th="";aq=null;ac={cur:null,shown:false};if(param)location.hash="arrets";else vArrets()})};
  if(param){const a=ARR.list.find(x=>x.id===param);if(a){ttl.textContent=a.nom;app.style.setProperty("--vc",vcOf(TH2CH[a.th]));app.innerHTML=head+arrCard(a,true)+`<div class="row" style="margin-top:12px"><a class="btn" href="#arrets">Tous les arrêts</a><a class="btn" href="#cours/${TH2CH[a.th]}">Chapitre : ${esc(chName(TH2CH[a.th]))}</a></div>`;bindTabs();return}}
  if(arTab==="liste"){
    const q=norm(arF.q).split(/\s+/).filter(Boolean);
    let L=all.filter(a=>(!arF.th||a.th===arF.th)&&(!arF.jur||a.jur.startsWith(arF.jur))&&(!arF.lib||a.lib)&&q.every(w=>norm(a.nom+" "+a.sol+" "+a.portee+" "+a.d.slice(0,4)).includes(w)));
    if(arF.tri==="theme")L=L.slice().sort((x,y)=>Object.keys(ARR.themes).indexOf(x.th)-Object.keys(ARR.themes).indexOf(y.th)||(x.d<y.d?-1:1));
    let lastKey="";
    const body=L.map(a=>{const k=arF.tri==="theme"?ARR.themes[a.th]:(Math.floor(+a.d.slice(0,4)/10)*10)+"";const h=k!==lastKey?`<h3>${esc(arF.tri==="theme"?k:"Années "+k)}</h3>`:"";lastKey=k;return h+arrCard(a)}).join("");
    app.innerHTML=head+`<div class="searchbox">${ICO.recherche}<input type="search" id="aq" placeholder="Nom, mot clé ou année : Morsang, dignité, 1995" value="${esc(arF.q)}" aria-label="Rechercher un arrêt" autocomplete="off"></div>
    <div class="row" style="margin:10px 0 12px"><select id="ath" aria-label="Thème"><option value="">Tous les thèmes</option>${Object.entries(ARR.themes).filter(([k])=>all.some(a=>a.th===k)).map(([k,v])=>`<option value="${k}" ${arF.th===k?"selected":""}>${esc(v)}</option>`).join("")}</select>
    <select id="ajur" aria-label="Juridiction"><option value="">Toutes juridictions</option>${[["CE","Conseil d'État"],["TC","Tribunal des conflits"],["Cons. const.","Conseil constitutionnel"],["Cass.","Cour de cassation"],["Ass. plén.","Assemblée plénière"],["CEDH","Cour européenne des droits de l'homme"],["CJUE","Cour de justice de l'Union"]].map(([k,v])=>`<option value="${k}" ${arF.jur===k?"selected":""}>${v}</option>`).join("")}</select>
    <select id="atri" aria-label="Classement"><option value="chrono" ${arF.tri==="chrono"?"selected":""}>Frise chronologique</option><option value="theme" ${arF.tri==="theme"?"selected":""}>Par thème</option></select>
    <label class="row small"><input type="checkbox" id="alib" ${arF.lib?"checked":""}> Libertés fondamentales</label><label class="row small"><input type="checkbox" id="ahide" ${arF.hide?"checked":""}> Masquer les solutions</label></div>
    <p class="small muted">${L.length} arrêt${L.length>1?"s":""}</p><div class="stack" id="alist">${body||`<div class="panel"><p class="muted" style="margin:0">Aucun arrêt ne correspond.</p></div>`}</div>
    <p class="note">Dates recoupées entre deux tables académiques des grands arrêts administratifs et, pour les décisions récentes et les décisions pénales, avec leur numéro de requête ou de pourvoi. Pensez à vérifier sur Légifrance ou sur le site du Conseil d'État avant de citer une décision dans une copie.</p>`;
    bindTabs();
    const upd=(k,v)=>{arF[k]=v;vArrets();if(k==="q"){const i=$("#aq");i.focus();i.setSelectionRange(i.value.length,i.value.length)}};
    $("#aq").addEventListener("input",e=>upd("q",e.target.value));
    $("#ath").onchange=e=>upd("th",e.target.value);$("#ajur").onchange=e=>upd("jur",e.target.value);$("#atri").onchange=e=>upd("tri",e.target.value);
    $("#alib").onchange=e=>upd("lib",e.target.checked);$("#ahide").onchange=e=>upd("hide",e.target.checked);
    return;
  }
  if(arTab==="quiz"){
    if(!aq){
      app.innerHTML=head+`<div class="panel"><div class="f2">
      <div class="field"><label for="am">Exercice</label><select id="am">${Object.entries(AMODES).map(([k,v])=>`<option value="${k}">${esc(v)}</option>`).join("")}</select></div>
      <div class="field"><label for="ath2">Thème</label><select id="ath2"><option value="">Tous les thèmes</option>${Object.entries(ARR.themes).filter(([k])=>all.some(a=>a.th===k)).map(([k,v])=>`<option value="${k}">${esc(v)}</option>`).join("")}</select></div>
      <div class="field"><label for="ap">Arrêts proposés</label><select id="ap"><option value="rev">À revoir en priorité (${due})</option><option value="all">Tous, au hasard</option><option value="new">Jamais vus</option></select></div>
      <div class="field"><label for="an">Nombre de questions</label><select id="an"><option>10</option><option selected>20</option><option>40</option></select></div></div>
      <div class="row" style="margin-top:14px"><button class="btn primary" id="ago">Commencer</button><span class="small muted" id="ainfo"></span></div></div>`;
      bindTabs();
      $("#ago").onclick=()=>{const th=$("#ath2").value,p=$("#ap").value,n=+$("#an").value,base=all.filter(a=>!th||a.th===th);
        let L=p==="new"?base.filter(a=>!st[a.id]):p==="rev"?base.filter(a=>aDue(a.id)):base;
        L=p==="rev"?shuffle(L).sort((x,y)=>aBox(x.id)-aBox(y.id)):shuffle(L);L=L.slice(0,n);
        if(!L.length){$("#ainfo").textContent=p==="rev"?"Aucun arrêt à revoir aujourd'hui : choisissez « Tous ».":"Aucun arrêt pour ce choix.";return}
        const mode=$("#am").value;aq={list:L.map(a=>arrQuestion(a,mode,all.length>=4?all:ARR.list)),pos:0,score:0,ans:null};vArrets()};
      return;
    }
    if(aq.pos>=aq.list.length){const err=aq.list.filter(x=>x.ko).map(x=>x.a);
      app.innerHTML=head+`<div class="panel"><div class="big">${aq.score} / ${aq.list.length}</div><p class="muted">${err.length?"Arrêts à revoir : "+[...new Set(err.map(a=>a.nom))].map(esc).join(", ")+".":"Aucune erreur sur cette série."}</p><div class="row"><button class="btn primary" id="aagain">Nouvelle série</button></div></div>`;
      bindTabs();$("#aagain").onclick=()=>{aq=null;vArrets()};return}
    const Q=aq.list[aq.pos],A=aq.ans;
    app.innerHTML=head+`<div class="row" style="justify-content:space-between">${tagCh(TH2CH[Q.a.th])}<span class="mono small muted">${aq.pos+1} / ${aq.list.length} · ${aq.score} juste${aq.score>1?"s":""}</span></div>
    <div class="bar" style="margin:10px 0 14px"><i style="width:${aq.pos/aq.list.length*100}%"></i></div>
    <div class="eyebrow">${esc(AMODES[Q.mode])}</div><div class="q-text">${esc(Q.prompt)}</div>${Q.sub?`<div class="small muted">${esc(Q.sub)}</div>`:""}
    <div class="opts">${Q.opts.map((o,p)=>{let cls="";if(A!==null){if(o.id===Q.a.id)cls="good";else if(p===A)cls="bad"}return `<label class="opt ${cls}"><input type="radio" name="ao" data-p="${p}" ${A===p?"checked":""} ${A!==null?"disabled":""}><span class="L">${L[p]}</span><span class="t">${esc(Q.lab(o))}</span></label>`}).join("")}</div>
    ${A!==null?`<div class="expl"><p class="${Q.opts[A].id===Q.a.id?"v-ok":"v-ko"}">${Q.opts[A].id===Q.a.id?"Réponse juste.":"Réponse inexacte."}</p><p><b>${esc(Q.a.nom)}</b>, ${esc(JURN[Q.a.jur]||Q.a.jur)}, ${esc(fmtA(Q.a.d))}.</p><p>${esc(Q.a.sol)}</p><p class="small"><b>Portée.</b> ${esc(Q.a.portee)}</p></div><div class="row" style="margin-top:14px"><button class="btn primary" id="anext">${aq.pos+1<aq.list.length?"Question suivante":"Voir le résultat"}</button></div>`:""}`;
    bindTabs();
    if(A===null)app.querySelectorAll("input[name=ao]").forEach(i=>i.onchange=()=>{const p=+i.dataset.p,ok=Q.opts[p].id===Q.a.id;aq.ans=p;if(ok)aq.score++;else Q.ko=true;recordA(Q.a.id,ok);vArrets()});
    else $("#anext").onclick=()=>{aq.pos++;aq.ans=null;vArrets();window.scrollTo(0,0)};
    return;
  }
  /* cartes mémoire */
  const pool=all;if(!pool.length){app.innerHTML=head;bindTabs();return}
  const pick=()=>{const w=pool.map(a=>[a,Math.pow(2,5-Math.max(1,aBox(a.id)))]);let r=Math.random()*w.reduce((s,x)=>s+x[1],0);for(const [a,x] of w){r-=x;if(r<=0&&(!ac.cur||a.id!==ac.cur.id||pool.length===1))return a}return pool[0]};
  if(!ac.cur||!pool.includes(ac.cur))ac.cur=pick();
  const a=ac.cur;
  app.innerHTML=head+`<div class="panel stack" style="min-height:220px"><div class="row" style="justify-content:space-between">${tagCh(TH2CH[a.th])}<span class="row" style="gap:8px"><span class="mono small muted">Boîte ${Math.max(1,aBox(a.id))}</span>${starBtn("a:"+a.id,a.nom)}</span></div>
  <div class="q-text">${esc(a.nom)}</div><div class="small muted">Juridiction, date, solution, portée ?</div>
  ${ac.shown?`<div class="expl"><p><b>${esc(JURN[a.jur]||a.jur)}, ${esc(fmtA(a.d))}</b></p><p>${esc(a.sol)}</p><p class="small"><b>Portée.</b> ${esc(a.portee)}</p></div><div class="row"><button class="btn ok" id="ay">Je savais</button><button class="btn ko" id="an2">À revoir</button></div>`:`<div class="row"><button class="btn primary" id="ash">Retourner la carte</button></div>`}</div>`;
  bindTabs();
  if(!ac.shown)$("#ash").onclick=()=>{ac.shown=true;vArrets()};
  else{const g=ok=>{recordA(a.id,ok);ac={cur:null,shown:false};vArrets()};$("#ay").onclick=()=>g(true);$("#an2").onclick=()=>g(false)}
}

/* ---------- Tableau des délais ---------- */
const DUR=["24 heures","48 heures","3 jours","5 jours","8 jours","10 jours","15 jours","20 jours","1 mois","2 mois","3 mois","4 mois","5 mois","6 mois","1 an","2 ans","3 ans","5 ans","6 ans","10 ans","20 ans","30 ans"];
let dChecked=false;
function vDelais(){
  const ans=store.get("dans",{});
  app.innerHTML=`<h1>Tableau des délais</h1><p class="lead">Choisissez la durée de chaque délai, puis vérifiez. Le point de départ, la sanction et le texte s'affichent après correction.</p>${concNote()}
  <div class="row" style="margin-bottom:12px"><button class="btn primary" id="dck">Vérifier</button><button class="btn" id="drs">Effacer</button><span class="mono small muted">${dChecked?D.delais.filter((x,i)=>inConc(delaiCh(x))&&ans[i]===x.d).length+"/"+D.delais.filter(x=>inConc(delaiCh(x))).length+" exacts":""}</span></div>
  <div class="panel tbl"><table><thead><tr><th>Délai</th><th>Durée</th><th>Départ, sanction, texte</th></tr></thead><tbody>
  ${D.delais.map((x,i)=>{if(!inConc(delaiCh(x)))return "";const v=ans[i]||"",good=dChecked&&v===x.d;return `<tr class="${dChecked?(good?"good":"bad"):""}"><td>${esc(x.a)}</td><td><select data-i="${i}" id="d${i}" aria-label="Durée"><option value="">…</option>${DUR.map(o=>`<option ${o===v?"selected":""}>${o}</option>`).join("")}</select>${dChecked?`<div class="${good?"v-ok":"v-ko"} small">${good?"Exact":"Réponse : "+x.d}</div>`:""}</td><td class="small muted">${dChecked?`${esc(x.dep)}${x.s?"<br><b>Sanction :</b> "+esc(x.s):""}<br><span class="ref">${esc(x.t)}</span>`:""}</td></tr>`}).join("")}
  </tbody></table></div>`;
  app.querySelector("tbody").addEventListener("change",e=>{const i=e.target.dataset.i;if(i!==undefined){const a=store.get("dans",{});a[i]=e.target.value;store.set("dans",a)}});
  $("#dck").onclick=()=>{dChecked=true;vDelais()};
  $("#drs").onclick=()=>{store.set("dans",{});dChecked=false;vDelais()};
}

/* ---------- Calculateur ---------- */
function easter(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return new Date(Date.UTC(y,mo-1,da))}
const addD=(d,n)=>new Date(d.getTime()+n*864e5), key=d=>d.toISOString().slice(0,10);
function holidays(y,pent,am){const e=easter(y),H={};
  [["01-01","Jour de l'an"],["05-01","Fête du travail"],["05-08","Victoire 1945"],["07-14","Fête nationale"],["08-15","Assomption"],["11-01","Toussaint"],["11-11","Armistice"],["12-25","Noël"]].forEach(([md,n])=>H[y+"-"+md]=n);
  H[key(addD(e,1))]="Lundi de Pâques";H[key(addD(e,39))]="Ascension";if(pent)H[key(addD(e,50))]="Lundi de Pentecôte";
  if(am){H[key(addD(e,-2))]="Vendredi saint";H[y+"-12-26"]="Saint Étienne"}return H}
function addMonths(d,m){const y=d.getUTCFullYear(),mo=d.getUTCMonth()+m,day=d.getUTCDate(),last=new Date(Date.UTC(y,mo+1,0)).getUTCDate();return {date:new Date(Date.UTC(y,mo,Math.min(day,last))),cl:day>last}}
const JOURS=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],MOIS=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const fmt=d=>`${JOURS[d.getUTCDay()]} ${d.getUTCDate()===1?"1er":d.getUTCDate()} ${MOIS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
function vCalcul(){
  const pen=store.get("calcm","civ")==="pen";
  const parseD=d=>{const m=/^(\d+) (jours?|mois|ans?)$/.exec(d);return m?{n:+m[1],u:m[2].startsWith("jour")?"j":m[2]==="mois"?"m":"a"}:null};
  const presets=pen?D.delais.filter(x=>/^n\d/.test(delaiCh(x)||"")&&parseD(x.d)).map(x=>({...x,...parseD(x.d)})):D.delais.filter(x=>x.n);
  app.innerHTML=`<h1>Calculateur de délais</h1><div class="row" style="gap:8px;margin-bottom:10px"><button class="btn ${pen?"":"primary"}" id="kmc">Procédure civile</button><button class="btn ${pen?"primary":""}" id="kmp">Procédure pénale</button></div>
  <p class="lead">${pen?"En procédure pénale, tout délai expire le dernier jour à vingt quatre heures ; le délai qui expirerait un samedi, un dimanche ou un jour férié ou chômé est prorogé jusqu'au premier jour ouvrable suivant (art. 801 CPP). Le jour de l'acte ou de la décision qui fait courir le délai n'est pas compté.":"Le jour de l'acte ne compte pas ; le délai en mois expire au même quantième, ou au dernier jour du mois ; l'échéance tombant un samedi, un dimanche ou un jour férié est prorogée au premier jour ouvrable suivant (art. 640 à 643)."}</p>
  <div class="panel"><div class="f2">
   <div class="field"><label for="cp">Délai type</label><select id="cp"><option value="">Délai libre</option>${presets.map((x,i)=>`<option value="${i}">${esc(x.a)} (${x.d})</option>`).join("")}</select></div>
   <div class="field"><label for="cd">Date de l'acte, de l'événement ou de la notification</label><input type="date" id="cd" value="${new Date().toISOString().slice(0,10)}"></div>
   <div class="field"><label for="cn">Durée</label><div class="row"><input type="number" id="cn" min="1" value="${pen?10:1}" style="width:90px"><select id="cu" aria-label="Unité"><option value="j" ${pen?"selected":""}>jours</option><option value="m" ${pen?"":"selected"}>mois</option><option value="a">ans</option></select></div></div>
   ${pen?`<div class="field"><label class="row" style="margin-top:22px"><input type="checkbox" id="cf"> Délai exprimé en jours francs</label></div>`:`<div class="field"><label for="cl">Lieu où demeure le destinataire</label><select id="cl"><option value="0">France métropolitaine</option><option value="1">Outre mer (art. 643)</option><option value="2">Étranger</option></select></div>`}
  </div>
  <div class="stack small" style="margin-top:12px;gap:6px"><label class="row"><input type="checkbox" id="cpt" checked> Traiter le lundi de Pentecôte comme jour férié</label><label class="row"><input type="checkbox" id="cam"> Jours fériés d'Alsace et de Moselle (Vendredi saint, 26 décembre)</label></div>
  <div id="cout" class="expl"></div></div>`;
  $("#kmc").onclick=()=>{store.set("calcm","civ");vCalcul()};$("#kmp").onclick=()=>{store.set("calcm","pen");vCalcul()};
  const calc=()=>{
    const out=$("#cout"),cd=$("#cd").value;if(!cd){out.innerHTML='<p class="muted">Indiquez une date.</p>';return}
    const p=$("#cp").value!==""?presets[+$("#cp").value]:null,n=Math.max(1,parseInt($("#cn").value)||1),u=$("#cu").value,lieu=pen?0:+$("#cl").value,pent=$("#cpt").checked,am=$("#cam").checked,franc=pen&&$("#cf").checked;
    const st=new Date(cd+"T00:00:00Z"),steps=[`Point de départ : ${fmt(st)}. Ce jour ne compte pas${pen?"":" (art. 641)"}.`],warns=[];let end;
    if(u==="j"){end=addD(st,n);steps.push(`Délai de ${n} jour${n>1?"s":""} : échéance théorique le ${fmt(end)}.`)}
    else{const r=addMonths(st,u==="m"?n:12*n);end=r.date;steps.push(`Délai de ${n} ${u==="m"?"mois":(n>1?"ans":"an")} : échéance au même quantième, le ${fmt(end)}${r.cl?" (dernier jour du mois"+(pen?")":", art. 641 al. 2)"):""}.`)}
    if(franc){end=addD(end,1);steps.push(`Délai franc : ni le jour de départ ni le jour de l'échéance ne sont comptés ; l'acte peut encore être accompli le ${fmt(end)}.`);warns.push("Le mode de computation des délais francs résulte de la jurisprudence et non d'un texte général du code de procédure pénale : vérifiez la solution applicable au délai en cause avant de vous y fier.")}
    if(lieu){end=addMonths(end,lieu).date;steps.push(`Délai de distance de ${lieu} mois (art. 643) : ${fmt(end)}.`);if(p&&!p.dist)warns.push("L'article 643 ne vise que certains délais (comparution, appel, opposition, tierce opposition de l'article 586 al. 3, révision, pourvoi). Vérifiez qu'il s'applique ici.")}
    let f=end;const moved=[];for(let k=0;k<15;k++){const H=holidays(f.getUTCFullYear(),pent,am),dw=f.getUTCDay(),h=H[key(f)];if(dw===0||dw===6||h){moved.push(`${fmt(f)} (${h||(dw===6?"samedi":"dimanche")})`);f=addD(f,1)}else break}
    if(moved.length)steps.push(`Prorogation (${pen?"art. 801 CPP":"art. 642 al. 2"}) : ${moved.join(", puis ")} ; report au premier jour ouvrable.`);
    steps.push(`Le délai expire le dernier jour à vingt quatre heures (${pen?"art. 801 CPP":"art. 642 al. 1"}).`);
    if(pen)warns.push("Les délais exprimés en heures (garde à vue, appel des ordonnances du juge de l'application des peines) se calculent d'heure à heure et ne relèvent pas de ce calculateur. Certains délais courent de la signification et non du prononcé : vérifiez le point de départ.");
    if(moved.some(m=>m.includes("Pentecôte"))||(!pent&&key(f)===key(addD(easter(f.getUTCFullYear()),50))))warns.push("Le lundi de Pentecôte affecte l'échéance : son traitement comme jour chômé mérite une vérification.");
    out.innerHTML=`<div class="eyebrow">Échéance</div><div class="big">${fmt(f)}, à 24 heures</div>${p?`<p class="small muted" style="margin-top:6px">${esc(p.a)} · ${esc(p.t)}${p.s?" · Sanction : "+esc(p.s):""}</p>`:""}<ol class="steps">${steps.map(s=>`<li>${s}</li>`).join("")}</ol>${warns.map(w=>`<div class="warn">${w}</div>`).join("")}`;
  };
  $("#cp").onchange=()=>{if($("#cp").value!==""){const p=presets[+$("#cp").value];$("#cn").value=p.n;$("#cu").value=p.u;if(pen)$("#cf").checked=/francs/.test(p.a+" "+p.dep)}calc()};
  ["cd","cn","cu",pen?"cf":"cl","cpt","cam"].forEach(id=>{$("#"+id).addEventListener("input",calc);$("#"+id).addEventListener("change",calc)});calc();
}

/* ---------- Qualifications ---------- */
const CATC=["Exception de procédure","Fin de non recevoir","Défense au fond","Demande incidente"];
let qq=null;
function vQualif(){
  const mode=store.get("qualm","civ"),pen=mode==="pen"&&D.qualifPen&&D.qualifPen.length,QL=pen?D.qualifPen:D.qualif,CAT=pen?D.qualifCat:CATC;
  if(!qq||qq.mode!==mode)qq={mode,order:shuffle(QL.map((m,i)=>i)),pos:0,ok:0,done:0,ans:null};
  const m=QL[qq.order[qq.pos]],a=qq.ans;
  app.innerHTML=`<h1>Qualifications</h1><div class="row" style="gap:8px;margin-bottom:10px"><button class="btn ${pen?"":"primary"}" id="qmc">Procédure civile</button><button class="btn ${pen?"primary":""}" id="qmp">Procédure pénale : nullités</button></div>
  <p class="lead">${pen?"Déterminez comment et devant qui la nullité peut être invoquée : la chambre de l'instruction, la juridiction de jugement, ou nulle part, faute de recevabilité ou d'atteinte aux intérêts de la partie (art. 170 à 174, 385 et 802 CPP).":"Qualifiez le moyen soulevé : la qualification commande le moment, l'exigence d'un grief, l'office du juge et le juge compétent."}</p>
  <div class="panel"><div class="row" style="justify-content:space-between"><span class="tag">${pen?"Situation":"Moyen"} ${qq.pos+1} sur ${QL.length}</span><span class="mono small muted">${qq.done?qq.ok+"/"+qq.done+" justes":""}</span></div>
  <div class="q-text" style="margin:12px 0 14px">${esc(m[0])}</div>
  <div class="choices">${CAT.map((c,k)=>`<button class="btn ${a!==null?(k===m[1]?"right":(k===a?"wrong":"")):""}" data-k="${k}" ${a!==null?"disabled":""}>${c}</button>`).join("")}</div>
  ${a!==null?`<div class="expl"><p class="${a===m[1]?"v-ok":"v-ko"}">${a===m[1]?"Exact.":"Inexact : "+CAT[m[1]]+"."}</p><p>${esc(m[2])}</p><button class="btn primary" id="qn2">${qq.pos+1<QL.length?"Suivant":"Recommencer ("+qq.ok+"/"+QL.length+")"}</button></div>`:""}</div>`;
  $("#qmc").onclick=()=>{store.set("qualm","civ");vQualif()};$("#qmp").onclick=()=>{store.set("qualm","pen");vQualif()};
  app.querySelectorAll(".choices .btn").forEach(b=>b.onclick=()=>{if(qq.ans!==null)return;qq.ans=+b.dataset.k;qq.done++;if(qq.ans===m[1])qq.ok++;const qs2=store.get("qual",{});qs2[m[0].slice(0,80)]={ok:qq.ans===m[1],t:Date.now()};store.set("qual",qs2);logAct();vQualif()});
  if(a!==null)$("#qn2").onclick=()=>{if(qq.pos+1>=QL.length)qq=null;else{qq.pos++;qq.ans=null}vQualif()};
}

/* ---------- Cas pratiques ---------- */
function vCas(param){
  if(param!==undefined&&D.cas[+param]){const c=D.cas[+param],notes=store.get("cas",{});ttl.textContent=c.titre;
    app.innerHTML=`${tagCh(c.c)}<h1 style="margin-top:8px">${esc(c.titre)}</h1><div class="panel"><p>${esc(c.enonce)}</p></div>
    <div class="stack" style="margin-top:14px">${c.questions.map((q,i)=>`<div class="panel"><h3 style="margin-top:0">Question ${i+1}</h3><p>${esc(q.q)}</p>
    <label class="small muted" for="n${i}">Votre réponse (enregistrée sur cet appareil)</label><textarea id="n${i}" data-k="${param}-${i}">${esc(notes[param+"-"+i]||"")}</textarea>
    <details style="margin-top:10px"><summary>Afficher le corrigé</summary><div class="corr">${paras(q.corr).map(cpara).join("")}</div></details></div>`).join("")}</div>
    <div class="row" style="margin-top:14px"><button class="btn" id="cexp">Exporter le corrigé (Word)</button></div><p class="note">Méthode : pour chaque question, identifier le problème, énoncer la règle avec son texte, l'appliquer aux faits, conclure.</p>`;
    $("#cexp").onclick=()=>exportDoc("corrige-"+c.titre,c.titre,"Cas pratique · "+chName(c.c),c.enonce,c.questions);
    app.querySelectorAll("textarea").forEach(t=>t.addEventListener("input",()=>{const n=store.get("cas",{});n[t.dataset.k]=t.value;store.set("cas",n)}));return;}
  app.innerHTML=`<h1>Cas pratiques</h1><p class="lead">Énoncés au format de l'examen, avec corrigé rédigé selon la méthode problème, règle, application, conclusion.</p>
  ${concNote()}<div class="stack">${D.cas.map((c,i)=>!inConc(c.c)?"":`<a class="tile" href="#cas/${i}"><span class="n">${esc(chName(c.c))} · ${c.questions.length} questions</span><b>${esc(c.titre)}</b><span>${esc(c.enonce.slice(0,140))}…</span></a>`).join("")}</div>`;
}


/* ---------- Export Word des corrigés (Times New Roman 12) ---------- */
const paras=c=>Array.isArray(c)?c:[c];
const cpara=t=>{const m=/^(Problème|Règle|Application|Conclusion|Point de vigilance|Principe|Définition|Conditions|Effets|Régime|Procédure|Composition|Pouvoirs|Délais|Limites|Rôle du greffe|Fonctionnement|Sections|Formations|Hypothèse|Appel|Requête|Réforme|Greffe|Mesures|Plafond|Défendeur|Demandeur|Renvoi|Personnes habilitées|Défenseur syndical|Mineurs|Saisines particulières|Intérêt et portée|Formation incomplète|Opposition et pourvoi|Cas particuliers|Exécution et appel|Rapport de la caducité|Mesures provisoires|Renvoi au fond|Procédure accélérée au fond|Juridiction paritaire)\. /.exec(t);return m?`<p><b>${esc(m[1])}.</b> ${esc(t.slice(m[0].length))}</p>`:`<p>${esc(t)}</p>`};
function exportDoc(name,titre,meta,enonce,qs){
  const P=cpara;
  const body=`<h1>${esc(titre)}</h1>${meta?`<p class="meta">${esc(meta)}</p>`:""}<h2>Énoncé</h2>${P(enonce)}`+qs.map((q,i)=>`<h2>${qs.length>1?"Question "+(i+1):"Sujet"}</h2><p><b>${esc(q.q)}</b></p><h3>Corrigé</h3>${paras(q.corr).map(P).join("")}${q.grille?`<h3>Éléments attendus</h3><ul>${q.grille.map(g=>`<li>${esc(g[0])} (${fmtN(g[1])} pt)</li>`).join("")}</ul>`:""}`).join("")+`<p class="meta">Procedurae. Corrigé d'entraînement établi d'après les textes en vigueur au 28 octobre 2026 ; vérifiez toujours les textes applicables.</p>`;
  const html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${esc(titre)}</title><style>@page{size:21cm 29.7cm;margin:2.5cm}body,p,li,h1,h2,h3{font-family:"Times New Roman",serif;font-size:12pt}body{line-height:1.15}h1{font-weight:bold;text-align:center;margin:0 0 12pt}h2{font-weight:bold;margin:14pt 0 6pt}h3{font-weight:bold;font-style:italic;margin:10pt 0 4pt}p{text-align:justify;margin:0 0 6pt}.meta{font-style:italic}</style></head><body>${body}</body></html>`;
  const blob=new Blob(["﻿"+html],{type:"application/msword"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name.replace(/[^\wÀ-ÿ-]+/g,"-").replace(/-+/g,"-").toLowerCase()+".doc";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);toast("Corrigé exporté au format Word");
}

/* ---------- Simulateur d'entretien greffier ---------- */
let entT=null,ent=null;
const entMode=()=>store.get("entmode",conc()==="dsg"?"dsg":"greffier");
const fmtMS=s=>{s=Math.max(0,Math.round(s));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")};
function entDraw(n){const E=ALL.entretien,by={};E.questions.forEach((q,i)=>{(by[q.cat]=by[q.cat]||[]).push(i)});
  const sh=a=>a.map(x=>[Math.random(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
  const plan=entMode()==="dsg"?(n<=6?{dsgparcours:1,management:2,dsgsit:2,institution:1}:n<=8?{dsgparcours:1,management:2,dsgsit:2,institution:1,deonto:1,culture:1}:{dsgparcours:2,management:3,dsgsit:3,institution:1,deonto:1}):n<=6?{parcours:1,metier:1,institution:1,deonto:1,culture:1,situation:1}:n<=8?{parcours:1,metier:2,institution:1,deonto:1,culture:1,situation:2}:{parcours:2,metier:2,institution:2,deonto:1,culture:1,situation:2};
  let out=[];Object.keys(plan).forEach(c=>out=out.concat(sh(by[c]||[]).slice(0,plan[c])));return out}
function entHead(){const m=entMode();return `<div class="row" style="margin-bottom:10px">${[["greffier","Concours de greffier"],["dsg","Concours de directeur des services de greffe"]].map(([k,n])=>`<button class="chip ${m===k?"on":""}" data-em="${k}">${n}</button>`).join("")}</div>`+(m==="dsg"?`<h1>Entretien : directeur des services de greffe</h1><p class="lead">Simulation de l'épreuve n° 3 d'admission : exposé de cinq minutes au plus, puis échange avec le jury et mises en situation, dans la limite de trente minutes.</p>
    <div class="panel"><b>Modalités</b><ul class="small" style="margin:8px 0 0">
    <li>Entretien de 30 minutes au plus, dont 5 minutes au plus d'exposé ; coefficient 5 ; note inférieure à 5 éliminatoire.</li>
    <li>Concours externe : évaluation des qualités personnelles, du potentiel et du comportement face à des mises en situation, à partir de la fiche individuelle de renseignement.</li>
    <li>Concours interne : appréciation de l'expérience professionnelle, de l'aptitude aux fonctions, des motivations et des qualités personnelles, à partir du dossier de reconnaissance des acquis de l'expérience professionnelle.</li>
    <li>L'épreuve n° 4, interrogation de 15 minutes sur les finances publiques ou le droit de la fonction publique, se prépare avec les chapitres du volet « Directeur des services de greffe ».</li></ul>
    <p class="small muted" style="margin:8px 0 0">Source : notice du concours de directeur des services de greffe judiciaires, session 2027.</p></div>`:`<h1>Entretien greffier</h1><p class="lead">Simulation de l'épreuve orale d'admission du concours externe : présentation de cinq minutes, puis questions du jury, dans la limite de vingt cinq minutes.</p>
    <div class="panel"><b>Modalités</b><ul class="small" style="margin:8px 0 0">
    <li>Entretien de 25 minutes au plus, dont 5 minutes au plus de présentation du parcours et de la motivation, à partir de la fiche individuelle de renseignement ; coefficient 4 ; note inférieure à 5 éliminatoire.</li>
    <li>Le jury évalue les qualités personnelles, le potentiel et le comportement face à une situation concrète, notamment par une mise en situation.</li>
    <li>Grille utilisée par le jury en 2024 : présentation et qualité de l'échange ; connaissance de l'environnement professionnel et positionnement ; aptitude professionnelle et organisationnelle ; qualités relationnelles ; motivation et projet professionnel.</li></ul>
    <p class="small muted" style="margin:8px 0 0">Sources : notice du concours de greffier, session 2027 ; rapport du jury du concours national à affectation locale d'Aix-en-Provence, 2024.</p></div>
    <div class="panel" style="margin-top:12px"><b>Ce que le jury a relevé en 2024</b><ul class="small" style="margin:8px 0 0">
    <li>Missions du greffier et déontologie : majoritairement bien traitées.</li>
    <li>Environnement judiciaire (organisation d'une juridiction, partenaires, directions du ministère) : trop de candidats sans réponse.</li>
    <li>Points faibles : sécurité informatique, absence de visite d'audience publique, projet professionnel imprécis, difficulté à se positionner dans l'équipe.</li></ul></div>`);}
function vEntretien(param){
  const E=ALL.entretien,C=E.cats;if(entT){clearInterval(entT);entT=null}
  const rev=store.get("entrev",{});
  if(param==="banque"){ttl.textContent="Banque de questions";
    app.innerHTML=`<h1>Banque de questions</h1><p class="lead">${E.questions.length} questions classées par thème, avec des éléments de réponse à adapter à votre parcours.</p>
    ${Object.keys(C).map(c=>`<h2 style="margin-top:22px">${esc(C[c])}</h2><div class="stack">${E.questions.map((q,i)=>q.cat!==c?"":`<div class="panel"><b>${esc(q.q)}</b>${rev[i]?` <span class="tag">À revoir</span>`:""}<details style="margin-top:8px"><summary>Éléments de réponse</summary><ul class="small">${q.p.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="ref">${esc(q.r)}</div></details></div>`).join("")}</div>`).join("")}`;return}
  if(!ent||param!=="go"){
    const hist=store.get("enthist",[]);
    app.innerHTML=`${entHead()}
    <div class="panel" style="margin-top:12px"><label class="small muted" for="entplan">Votre plan de présentation (enregistré sur cet appareil)</label><textarea id="entplan" style="min-height:110px" placeholder="Parcours, expériences utiles, motivation, projet">${esc(store.get("entplan",""))}</textarea></div>
    <div class="row" style="margin-top:14px;align-items:center"><span class="small">Nombre de questions :</span>${[6,8,10].map(n=>`<button class="chip ${n===8?"on":""}" data-n="${n}">${n}</button>`).join("")}</div>
    <div class="row" style="margin-top:12px"><button class="btn primary" id="entgo">Lancer l'entretien</button><a class="btn" href="#entretien/banque">Banque de questions</a>${Object.keys(rev).length?`<button class="btn" id="entrv">Revoir mes ${Object.keys(rev).length} questions à revoir</button>`:""}</div>
    ${hist.length?`<p class="small muted" style="margin-top:14px">Dernières simulations : ${hist.slice(-5).reverse().map(h=>`${new Date(h.d).toLocaleDateString("fr-FR")} (${h.ok}/${h.n} à l'aise)`).join(" · ")}</p>`:""}`;
    let n=8;app.querySelectorAll("[data-n]").forEach(b=>b.onclick=()=>{n=+b.dataset.n;app.querySelectorAll("[data-n]").forEach(x=>x.classList.toggle("on",x===b))});
    $("#entplan").addEventListener("input",e=>store.set("entplan",e.target.value));
    app.querySelectorAll("[data-em]").forEach(b=>b.onclick=()=>{store.set("entmode",b.dataset.em);vEntretien()});
    const start=list=>{ent={list,pos:-1,t0:Date.now(),res:{},show:false,dur:entMode()==="dsg"?1800:1500};location.hash="#entretien/go"};
    $("#entgo").onclick=()=>start(entDraw(n));
    if($("#entrv"))$("#entrv").onclick=()=>start(Object.keys(rev).map(Number));
    return}
  /* déroulement */
  const L=ent.list,el=()=>(Date.now()-ent.t0)/1000;
  const draw=()=>{const s=el();
    if(ent.pos===-1){app.innerHTML=`<span class="tag">Présentation</span><div class="row" style="justify-content:space-between;align-items:center;margin-top:8px"><h1 style="margin:0">Présentez votre parcours</h1><span class="big mono" id="eclk">${fmtMS(300-s)}</span></div>
      <div class="bar" style="margin-top:10px"><i id="ebar" style="width:${Math.min(100,s/3)}%"></i></div>
      <div class="panel" style="margin-top:14px"><p style="margin:0">Exposez à voix haute, en cinq minutes au plus, votre parcours, vos expériences utiles et votre motivation. Vous ne disposez pas de votre fiche pendant l'épreuve.</p>${store.get("entplan","")?`<details style="margin-top:10px"><summary>Mon plan</summary><p class="small" style="white-space:pre-wrap">${esc(store.get("entplan",""))}</p></details>`:""}</div>
      <div class="row" style="margin-top:14px"><button class="btn primary" id="enext">Terminer la présentation et passer aux questions</button><button class="btn" id="eabort">Abandonner</button></div>`}
    else if(ent.pos<L.length){const i=L[ent.pos],q=E.questions[i];
      app.innerHTML=`<div class="row" style="justify-content:space-between;align-items:center"><span class="tag">${esc(C[q.cat])} · question ${ent.pos+1} sur ${L.length}</span><span class="big mono" id="eclk">${fmtMS(ent.dur-s)}</span></div>
      <div class="bar" style="margin-top:10px"><i id="ebar" style="width:${Math.min(100,s/(ent.dur/100))}%"></i></div>
      <div class="panel" style="margin-top:14px"><p style="font-size:1.1rem;margin:0"><b>${esc(q.q)}</b></p>
      <p class="small muted" style="margin:8px 0 0">Répondez à voix haute, comme devant le jury, avant d'afficher les éléments de réponse.</p>
      <details style="margin-top:10px" ${ent.show?"open":""} id="edet"><summary>Éléments de réponse</summary><ul class="small">${q.p.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="ref">${esc(q.r)}</div></details></div>
      <div class="row" style="margin-top:14px"><button class="btn primary" data-r="1">J'étais à l'aise</button><button class="btn" data-r="0">À revoir</button><button class="btn" id="eabort">Abandonner</button></div>`;
      app.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{const ok=b.dataset.r==="1";ent.res[i]=ok;const r=store.get("entrev",{});if(ok)delete r[i];else r[i]=1;store.set("entrev",r);ent.pos++;ent.show=false;draw()})}
    else{if(entT){clearInterval(entT);entT=null}const ok=Object.values(ent.res).filter(Boolean).length;
      if(!ent.saved){const h=store.get("enthist",[]);h.push({d:Date.now(),n:L.length,ok,dur:Math.round(s)});store.set("enthist",h.slice(-30));ent.saved=true}
      app.innerHTML=`<h1>Bilan de l'entretien</h1><div class="stats" style="margin-top:10px"><div><b>${ok}/${L.length}</b><span>Questions maîtrisées</span></div><div><b>${fmtMS(s)}</b><span>Durée totale</span></div><div><b>${s<=ent.dur?"Oui":"Non"}</b><span>Dans les ${ent.dur/60} minutes</span></div></div>
      <div class="stack" style="margin-top:14px">${L.map(i=>`<div class="panel"><span class="${ent.res[i]?"v-ok":"v-ko"} small">${ent.res[i]?"À l'aise":"À revoir"}</span><div><b>${esc(E.questions[i].q)}</b></div><details style="margin-top:6px"><summary>Éléments de réponse</summary><ul class="small">${E.questions[i].p.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details></div>`).join("")}</div>
      <div class="row" style="margin-top:14px"><a class="btn primary" href="#entretien">Nouvel entretien</a><a class="btn" href="#entretien/banque">Banque de questions</a></div>`;return}
    if($("#enext"))$("#enext").onclick=()=>{ent.pos=0;draw()};
    if($("#eabort"))$("#eabort").onclick=()=>{ent=null;location.hash="#entretien"};
    if($("#edet"))$("#edet").addEventListener("toggle",e=>{ent.show=e.target.open});};
  draw();
  entT=setInterval(()=>{if(!location.hash.startsWith("#entretien/go")||!ent){clearInterval(entT);entT=null;return}const s=el(),c=$("#eclk"),b=$("#ebar");if(!c)return;
    if(ent.pos===-1){c.textContent=fmtMS(300-s);if(b)b.style.width=Math.min(100,s/3)+"%";if(s>=300)c.classList.add("v-ko")}
    else{c.textContent=fmtMS(ent.dur-s);if(b)b.style.width=Math.min(100,s/(ent.dur/100))+"%";if(s>=ent.dur)c.classList.add("v-ko")}},500);
}


/* ---------- Mentions légales ---------- */
function vMentions(){ttl.textContent="Mentions légales";
  app.innerHTML=`<h1>Mentions légales</h1>
  <div class="panel"><h3 style="margin-top:0">Objet du site</h3><p>Procedurae est un projet pédagogique, gratuit et non commercial, qui vise à aider les étudiants dans leurs révisions de la procédure civile, de la procédure prud'homale et de la culture juridique, en vue des concours et examens (CRFPA, ENM, concours de greffier). Il ne se substitue pas aux enseignements dispensés par les universités, les instituts d'études judiciaires et les organismes de préparation, ni aux conseils des enseignants.</p></div>
  <div class="panel" style="margin-top:12px"><h3 style="margin-top:0">Mise à jour et responsabilité</h3><p>Le site est régulièrement mis à jour. Les contenus sont établis d'après les textes en vigueur au 28 octobre 2026, date indiquée sur la page d'accueil. Il revient toutefois à l'utilisateur de vérifier les textes et les contenus avant toute utilisation, notamment sur <a href="https://www.legifrance.gouv.fr" target="_blank" rel="noopener" style="color:var(--accent)">Légifrance</a>. Les contenus ne constituent pas une consultation juridique.</p></div>
  <div class="panel" style="margin-top:12px"><h3 style="margin-top:0">Signaler une erreur ou une évolution des textes</h3><p>Le site est destiné à un cercle restreint d'étudiants. Une erreur, une réforme ou une jurisprudence nouvelle peut être signalée directement à l'enseignant, en cours ou par les moyens de contact habituels.</p></div>
  <div class="panel" style="margin-top:12px"><h3 style="margin-top:0">Éditeur et hébergeur</h3><p>Éditeur et directeur de la publication : Paul Morris. Contact : par l'intermédiaire de l'enseignant, en cours ou par les moyens de contact habituels.</p><p>Hébergeur : GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États Unis.</p></div>
  <div class="panel" style="margin-top:12px"><h3 style="margin-top:0">Propriété intellectuelle</h3><p>Les textes officiels et les décisions de justice cités sont librement réutilisables. Les contenus rédigés pour le site (cours, fiches, questionnaires, cas pratiques, sujets et corrigés) sont protégés par le droit d'auteur : ils peuvent être utilisés pour un usage personnel de révision, mais toute reproduction ou diffusion à d'autres fins suppose l'autorisation de l'éditeur.</p></div>
  <div class="panel" style="margin-top:12px"><h3 style="margin-top:0">Données personnelles</h3><p>Le site ne demande aucun compte et ne dépose aucun cookie. La progression (réponses, statistiques, favoris, notes) est enregistrée uniquement sur l'appareil de l'utilisateur ; elle peut être exportée, importée ou effacée depuis le site, et n'est jamais transmise à l'éditeur.</p><p>Le site charge ses polices de caractères depuis le service Google Fonts, ce qui implique la transmission de l'adresse IP du visiteur à Google. L'hébergeur peut enregistrer des données techniques de connexion dans les conditions de sa propre politique de confidentialité.</p></div>
  <p class="note">Dernière mise à jour des mentions légales : 28 octobre 2026.</p>`;
}

/* ---------- Tableau de bord ---------- */
function chapStats(){
  const res=store.get("qcm",{}),box=store.get("fbox",{});
  return CH.filter(c=>inConc(c.id)).map(c=>{const Q=D.qcm.filter(q=>q.c===c.id),F=D.fiches.filter(x=>x.c===c.id);
    const qd=Q.filter(q=>res[q.id]),qok=Q.filter(q=>res[q.id]&&res[q.id].ok);
    const fm=F.filter(x=>(box[x.id]||1)>=4),fseen=F.filter(x=>box[x.id]);
    const parts=[];if(Q.length)parts.push(qok.length/Q.length);if(F.length)parts.push(F.reduce((s,x)=>s+((box[x.id]||1)-1)/4,0)/F.length);
    return {c,qt:Q.length,qd:qd.length,qok:qok.length,ft:F.length,fm:fm.length,fseen:fseen.length,
      m:parts.length?Math.round(parts.reduce((a,b)=>a+b,0)/parts.length*100):null,
      touched:qd.length+fseen.length>0}});
}
const pct=(a,b)=>b?Math.round(a/b*100):0;
const meter=(v,lab)=>`<div class="bar" role="img" aria-label="${lab||v+" %"}" title="${lab||v+" %"}"><i style="width:${v}%"></i></div>`;
let bordTab="volets",confirmImp=null;
function vBord(){
  const res=store.get("qcm",{}),box=store.get("fbox",{}),act=store.get("act",{}),qual=store.get("qual",{}),dans=store.get("dans",{});
  const S=chapStats();
  const qd=Object.keys(res).filter(id=>D.qcm.some(q=>q.id===id)),due=D.qcm.filter(q=>qDue(res[q.id])).length,exams=store.get("exams",[]),qok=qd.filter(id=>res[id].ok);
  const err=qd.length-qok.length;
  const fm=D.fiches.filter(x=>(box[x.id]||1)>=4).length;
  const qv=Object.values(qual),qvok=qv.filter(x=>x.ok).length;
  const DL=D.delais.filter(x=>inConc(delaiCh(x))),dok=D.delais.filter((x,i)=>inConc(delaiCh(x))&&dans[i]===x.d).length;
  // activité sur 28 jours
  const days=[];for(let k=27;k>=0;k--){const d=new Date();d.setDate(d.getDate()-k);days.push([d,act[dayKey(d)]||0])}
  const mx=Math.max(1,...days.map(x=>x[1]));
  let streak=0;for(let k=0;;k++){const d=new Date();d.setDate(d.getDate()-k);const n=act[dayKey(d)]||0;if(n)streak++;else if(k===0)continue;else break;if(k>3650)break}
  const tot7=days.slice(-7).reduce((s,x)=>s+x[1],0);
  const JC=["di","lu","ma","me","je","ve","sa"];
  const vol=VO.filter(v=>CH.some(c=>c.v===v.id&&inConc(c.id))).map(v=>{const cs=S.filter(s=>s.c.v===v.id);const sum=k=>cs.reduce((a,s)=>a+s[k],0);
    const ms=cs.filter(s=>s.m!==null);return {v,qt:sum("qt"),qd:sum("qd"),qok:sum("qok"),ft:sum("ft"),fm:sum("fm"),m:ms.length?Math.round(ms.reduce((a,s)=>a+s.m,0)/ms.length):0}});
  const weak=S.filter(s=>s.touched&&s.m!==null).sort((a,b)=>a.m-b.m).slice(0,5);
  const untouched=S.filter(s=>!s.touched);
  app.innerHTML=`<h1>Tableau de bord</h1><p class="lead">Votre progression, calculée à partir des réponses enregistrées sur cet appareil. La maîtrise d'un chapitre combine la part de ses QCM réussis et l'avancement de ses fiches dans les boîtes.</p>${concNote()}
  <div class="stats" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr))">
   <div><b>${pct(qd.length,D.qcm.length)} %</b><span>QCM traités (${qd.length}/${D.qcm.length})</span></div>
   <div><b>${qd.length?pct(qok.length,qd.length):0} %</b><span>QCM réussis à la dernière tentative</span></div>
   <div><b>${fm}/${D.fiches.length}</b><span>Fiches maîtrisées (boîte 4 ou 5)</span></div>
   <div><b>${qv.length?qvok+"/"+qv.length:"0"}</b><span>Qualifications justes</span></div>
   <div><b>${dok}/${DL.length}</b><span>Délais exacts</span></div>
   <div><b>${streak} j</b><span>Série de jours actifs</span></div>
  </div>
  <div class="row" style="margin-top:12px"><a class="btn primary" href="#qcm">${due} QCM à réviser aujourd'hui</a><a class="btn" href="#examen">Examen blanc</a></div>
  ${exams.length?`<h2 style="margin-top:22px">Examens blancs</h2><div class="panel"><div class="stack" style="gap:8px">${exams.slice(-8).reverse().map(e=>`<div style="display:flex;gap:10px;align-items:baseline"><span style="flex:1;min-width:0" class="small">${fmtD(new Date(e.d))} · ${e.n} questions${e.conc&&CONC[e.conc]?" · "+esc(CONC[e.conc].t):""}</span><span class="mono">${(e.ok/e.n*20).toFixed(1).replace(".",",")} / 20</span></div>${meter(Math.round(e.ok/e.n*100))}`).join("")}</div></div>`:""}
  <h2 style="margin-top:22px">Activité des quatre dernières semaines</h2>
  <p class="small muted">${tot7} réponse${tot7>1?"s":""} sur les sept derniers jours. Chaque barre représente un jour (QCM, fiches et qualifications).</p>
  <div class="panel"><div style="display:flex;align-items:flex-end;gap:2px;height:90px" role="img" aria-label="Nombre de réponses par jour sur 28 jours">
   ${days.map(([d,n])=>`<div title="${fmtD(d)} : ${n} réponse${n>1?"s":""}" style="flex:1;min-width:0;height:100%;display:flex;align-items:flex-end"><div style="width:100%;height:${n?Math.max(4,n/mx*100):2}%;background:${n?"var(--accent)":"var(--line)"};border-radius:4px 4px 0 0"></div></div>`).join("")}
  </div><div class="mono small muted" style="display:flex;justify-content:space-between;margin-top:6px"><span>${fmtD(days[0][0])}</span><span>aujourd'hui</span></div></div>
  <div class="row" style="margin:22px 0 10px"><button class="chip ${bordTab==="volets"?"on":""}" data-t="volets">Par volet</button><button class="chip ${bordTab==="chap"?"on":""}" data-t="chap">Par chapitre</button><button class="chip ${bordTab==="faibles"?"on":""}" data-t="faibles">Points faibles</button></div>
  <div id="btab">${bordTab==="volets"?`<div class="stack">${vol.map(x=>`<div class="panel"><div class="row" style="justify-content:space-between"><b style="font-family:var(--f-display)">${esc(x.v.titre)}</b><span class="mono">${x.m} %</span></div>${meter(x.m,"Maîtrise "+x.m+" %")}
     <p class="small muted" style="margin:8px 0 0">QCM : ${x.qd}/${x.qt} traités, ${x.qok} réussis · Fiches : ${x.fm}/${x.ft} maîtrisées</p>
     <div class="row" style="margin-top:8px"><a class="btn" href="#qcm/v:${x.v.id}">QCM du volet</a><a class="btn" href="#fiches/v:${x.v.id}">Fiches du volet</a></div></div>`).join("")}</div>`
   :bordTab==="chap"?`<div class="stack">${VO.filter(v=>CH.some(c=>c.v===v.id&&inConc(c.id))).map(v=>`<div class="panel"><div class="eyebrow">${esc(v.titre)}</div>${S.filter(s=>s.c.v===v.id).map(s=>`<div style="padding:10px 0;border-top:1px solid var(--line)"><div style="display:flex;gap:10px;align-items:baseline"><span style="flex:1;min-width:0">${esc(s.c.titre)}</span><span class="mono small" style="white-space:nowrap">${s.m===null?"sans exercice":s.touched?s.m+" %":"non commencé"}</span></div>${s.m===null?"":meter(s.m||0)}
     <div class="small muted" style="margin-top:6px">QCM ${s.qt?s.qok+"/"+s.qt:"aucun"} · Fiches ${s.ft?s.fm+"/"+s.ft:"aucune"} · ${s.qt?`<a href="#qcm/${s.c.id}" style="color:var(--accent)">QCM</a> · `:""}<a href="#cours/${s.c.id}" style="color:var(--accent)">Cours</a></div></div>`).join("")}</div>`).join("")}</div>`
   :`${weak.length?`<p class="small muted">Les cinq chapitres commencés dont la maîtrise est la plus faible.</p><div class="stack">${weak.map(s=>`<div class="panel"><div style="display:flex;gap:10px;align-items:baseline"><span style="flex:1;min-width:0"><span class="tag">${esc((VO.find(v=>v.id===s.c.v)||{}).titre||"")}</span> <b>${esc(s.c.titre)}</b></span><span class="mono" style="white-space:nowrap">${s.m} %</span></div>${meter(s.m)}
     <p class="small muted" style="margin:8px 0 0">${s.qd-s.qok>0?(s.qd-s.qok)+" QCM à reprendre · ":""}${s.ft-s.fm>0?(s.ft-s.fm)+" fiche"+(s.ft-s.fm>1?"s":"")+" à consolider":"Fiches maîtrisées"}</p>
     <div class="row" style="margin-top:8px"><a class="btn primary" href="#cours/${s.c.id}">Relire le cours</a>${s.qt?`<a class="btn" href="#qcm/${s.c.id}">QCM</a>`:""}${s.ft?`<a class="btn" href="#fiches/${s.c.id}">Fiches</a>`:""}</div></div>`).join("")}</div>`:`<div class="panel"><p class="muted">Aucun chapitre commencé pour l'instant : répondez à quelques QCM ou fiches pour faire apparaître vos points faibles.</p></div>`}
     ${err?`<div class="warn">${err} QCM en erreur à la dernière tentative : dans le module QCM, choisissez « Mes erreurs » pour les reprendre.</div>`:""}
     ${untouched.length?`<p class="small muted" style="margin-top:14px">Chapitres non commencés (${untouched.length}) : ${untouched.map(s=>`<a href="#cours/${s.c.id}" style="color:var(--accent)">${esc(s.c.titre)}</a>`).join(", ")}.</p>`:""}`}</div>
  <h2 style="margin-top:22px">Sauvegarde</h2>
  <div class="panel"><p class="small">La progression n'est enregistrée que sur cet appareil. Exportez la dans un fichier pour la conserver ou la transférer, puis importez ce fichier sur un autre appareil.</p>
  <div class="row"><button class="btn" id="bexp">Exporter ma progression</button><label class="btn" for="bimp">Importer une sauvegarde</label><input type="file" id="bimp" accept=".json,application/json" hidden></div><p class="small muted" id="bmsg" style="margin:8px 0 0"></p></div>
  <p class="note">Les QCM sont comptés selon la dernière tentative ; les qualifications et l'activité ne sont suivies que depuis la version 8.</p>`;
  $("#bexp").onclick=()=>{const o={app:"atelier-procedure-civile",v:1,date:new Date().toISOString(),data:{}};try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith("apc-"))o.data[k]=localStorage.getItem(k)}}catch(e){}
    const b=new Blob([JSON.stringify(o)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="procedurae-progression-"+dayKey()+".json";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);$("#bmsg").textContent="Fichier de sauvegarde créé."};
  $("#bimp").onchange=e=>{const file=e.target.files[0];if(!file)return;const rd=new FileReader();rd.onload=()=>{try{const o=JSON.parse(rd.result);if(o.app!=="atelier-procedure-civile"||!o.data)throw 0;const ks=Object.keys(o.data).filter(k=>k.startsWith("apc-"));
      if(!confirmImp){confirmImp=o;$("#bmsg").innerHTML="Sauvegarde du "+esc(fmtD(new Date(o.date)))+" lue ("+ks.length+" éléments). Elle remplacera la progression actuelle. <button class='btn ko' id='bok'>Confirmer l'import</button>";$("#bok").onclick=()=>{try{ks.forEach(k=>localStorage.setItem(k,confirmImp.data[k]))}catch(er){}confirmImp=null;applyConc();vBord();$("#bmsg").textContent="Progression importée."};}
    }catch(er){$("#bmsg").textContent="Ce fichier n'est pas une sauvegarde valide de l'application."}e.target.value=""};rd.readAsText(file)};
  app.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{bordTab=b.dataset.t;vBord()});
}
const fmtD=d=>d.getDate()+" "+["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."][d.getMonth()];

function resetViews(){aq=null;qs=null;fs_={cur:null,shown:false,c:null};qq=null;ex=null}
/* ---------- Recherche ---------- */
let sq="";
function searchIndex(){
  if(searchIndex.c)return searchIndex.c;const I=[];
  CH.forEach(c=>c.sections.forEach(s=>I.push({k:"Cours",c:c.id,t:c.titre+" · "+s.h,x:s.p.join(" "),h:"#cours/"+c.id})));
  ALL.fiches.forEach(f=>I.push({k:"Fiche",c:f.c,t:f.q,x:f.a+" "+f.r,fid:f.id,body:`<p>${esc(f.a)}</p><div class="ref">${esc(f.r)}</div>`}));
  ALL.qcm.forEach(q=>I.push({k:"QCM",c:q.c,t:q.q,x:q.o.map(o=>o[0]).join(" ")+" "+q.e,qid:q.id,body:`<p class="small"><b>Réponses exactes :</b> ${q.o.filter(o=>o[1]).map(o=>esc(o[0])).join(" ; ")}</p><p class="small">${esc(q.e)}</p><div class="ref">${q.r.map(esc).join(" · ")}</div>`}));
  ALL.juris.forEach(j=>I.push({k:"Arrêt",c:j.c,t:j.nom+" · "+j.ref,x:j.sol+" "+j.portee,jn:j.nom,body:`<p>${esc(j.sol)}</p><p class="small muted">${esc(j.portee)}</p>`}));
  ARR.list.forEach(a=>I.push({k:"Arrêt",c:TH2CH[a.th],t:a.nom+" · "+arrRef(a),x:a.sol+" "+a.portee,an:a.id,body:`<p>${esc(a.sol)}</p><p class="small muted">${esc(a.portee)}</p><a class="small" href="#arrets/${a.id}">Ouvrir dans l'étude des arrêts</a>`}));
  (window.SUJETS||[]).forEach(s=>I.push({k:"Sujet "+CONC[s.conc].t,c:null,t:s.titre,x:s.enonce+" "+s.questions.map(q=>q.q+" "+q.corr.join(" ")).join(" "),h:"#sujets/"+s.id}));
  ALL.cas.forEach((c,i)=>I.push({k:"Cas pratique",c:c.c,t:c.titre,x:c.enonce+" "+c.questions.map(q=>q.q+" "+paras(q.corr).join(" ")).join(" "),h:"#cas/"+i}));
  ALL.delais.forEach(d=>I.push({k:"Délai",c:delaiCh(d),t:d.a,x:d.d+" "+d.dep+" "+d.s+" "+d.t,body:`<p class="small"><b>${esc(d.d)}</b> · départ : ${esc(d.dep)}${d.s?" · sanction : "+esc(d.s):""}</p><div class="ref">${esc(d.t)}</div>`}));
  I.forEach(e=>{e.n=norm(e.t+" "+e.x)});return searchIndex.c=I;
}
function snippet(txt,terms){const n=norm(txt);let p=-1;for(const w of terms){p=n.indexOf(w);if(p>=0)break}const a=Math.max(0,p-70),s=(a?"…":"")+txt.slice(a,a+220)+(txt.length>a+220?"…":"");return hl(s,terms)}
function hl(s,terms){let out=esc(s);terms.forEach(w=>{if(w.length<2)return;const src=norm(out);let res="",i=0,k;const W=w;while((k=src.indexOf(W,i))>=0){res+=out.slice(i,k)+"<mark>"+out.slice(k,k+W.length)+"</mark>";i=k+W.length}out=res+out.slice(i)});return out}
function vRecherche(){
  app.innerHTML=`<h1>Recherche</h1><p class="lead">Un mot, une notion ou un numéro d'article : la recherche porte sur les cours, les fiches, les QCM, les arrêts, les délais et les sujets, sans tenir compte des accents.</p>${concNote()}
  <div class="searchbox">${ICO.recherche}<input type="search" id="sq" placeholder="Exemple : péremption, 528-1, astreinte" value="${esc(sq)}" aria-label="Rechercher" autocomplete="off"></div>
  <div id="sres" style="margin-top:16px"></div>`;
  const run=()=>{sq=$("#sq").value;const terms=norm(sq).split(/\s+/).filter(w=>w.length>1);const box=$("#sres");
    if(!terms.length){box.innerHTML=`<p class="muted small">Suggestions : ${["exécution provisoire","péremption","1448","médiation","astreinte","récusation","750-1"].map(w=>`<button class="chip" data-s="${esc(w)}">${esc(w)}</button>`).join(" ")}</p>`;box.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>{$("#sq").value=b.dataset.s;run()});return}
    const R=searchIndex().filter(e=>(!e.c||inConc(e.c))&&terms.every(w=>e.n.includes(w))).map(e=>({e,s:terms.reduce((a,w)=>a+(norm(e.t).includes(w)?3:0),0)})).sort((a,b)=>b.s-a.s).slice(0,80);
    box.innerHTML=R.length?`<p class="small muted">${R.length}${R.length===80?" premiers":""} résultat${R.length>1?"s":""}</p><div class="stack">${R.map(({e})=>{const head=`<div class="row" style="justify-content:space-between;gap:8px"><span class="row" style="gap:6px"><span class="tag" style="--vc:${e.c?vcOf(e.c):"var(--accent)"}">${esc(e.k)}</span>${e.c?`<span class="small muted">${esc(chName(e.c))}</span>`:""}</span>${e.qid?starBtn("q:"+e.qid,"question"):e.fid?starBtn("f:"+e.fid,"fiche"):e.jn?starBtn("j:"+e.jn,e.jn):e.an?starBtn("a:"+e.an,"arrêt"):""}</div><div style="font-weight:700;margin-top:6px">${hl(e.t,terms)}</div>`;
      return e.h?`<a class="panel hit" href="${e.h}">${head}<p class="snip">${snippet(e.x,terms)}</p></a>`:`<div class="panel">${head}<p class="snip small muted" style="margin:4px 0 0">${snippet(e.x,terms)}</p><details style="margin-top:8px"><summary>Afficher</summary><div style="margin-top:8px">${e.body}</div></details></div>`}).join("")}</div>`:`<div class="panel"><p class="muted" style="margin:0">Aucun résultat pour « ${esc(sq)} ». Essayez un terme plus court ou un numéro d'article seul.</p></div>`};
  $("#sq").addEventListener("input",run);run();setTimeout(()=>{try{$("#sq").focus()}catch(e){}},50);
}

/* ---------- Favoris ---------- */
function vFavoris(){
  const F=favs(),ks=Object.keys(F).sort((a,b)=>F[b]-F[a]);
  const item=k=>{const [ty,...r]=k.split(":"),id=r.join(":");
    if(ty==="q"){const q=ALL.qcm.find(x=>x.id===id);return q&&{g:"QCM",c:q.c,html:`<div class="q-text" style="font-size:1.02rem">${esc(q.q)}</div><details style="margin-top:8px"><summary>Voir la correction</summary><p class="small" style="margin-top:8px"><b>Réponses exactes :</b> ${q.o.filter(o=>o[1]).map(o=>esc(o[0])).join(" ; ")}</p><p class="small">${esc(q.e)}</p><div class="ref">${q.r.map(esc).join(" · ")}</div></details>`}}
    if(ty==="f"){const f=ALL.fiches.find(x=>x.id===id);return f&&{g:"Fiches",c:f.c,html:`<div style="font-weight:700">${esc(f.q)}</div><details style="margin-top:8px"><summary>Voir la réponse</summary><p style="margin-top:8px">${esc(f.a)}</p><div class="ref">${esc(f.r)}</div></details>`}}
    if(ty==="j"){const j=ALL.juris.find(x=>x.nom===id);return j&&{g:"Arrêts",c:j.c,html:`<div style="font-weight:700">${esc(j.nom)}</div><div class="ref">${esc(j.ref)}</div><p style="margin:8px 0 0">${esc(j.sol)}</p>`}}
    if(ty==="a"){const a=ARR.list.find(x=>x.id===id);return a&&{g:"Arrêts",c:TH2CH[a.th],html:`<div style="font-weight:700">${esc(a.nom)}</div><div class="ref">${esc(arrRef(a))}</div><p style="margin:8px 0 0">${esc(a.sol)}</p>`}}
    if(ty==="c"){const c=CH.find(x=>x.id===id);return c&&{g:"Chapitres",c:c.id,html:`<a href="#cours/${c.id}" style="font-weight:700;text-decoration:none">${esc(c.titre)}</a>`}}
    if(ty==="s"){const s=(window.SUJETS||[]).find(x=>x.id===id);return s&&{g:"Sujets",c:null,html:`<a href="#sujets/${s.id}" style="font-weight:700;text-decoration:none">${esc(s.titre)}</a><div class="small muted">${esc(CONC[s.conc].t)} · ${esc(s.type)}</div>`}}
    return null};
  const items=ks.map(k=>[k,item(k)]).filter(x=>x[1]);
  const groups=["Chapitres","QCM","Fiches","Arrêts","Sujets"];
  const nq=items.filter(x=>x[1].g==="QCM").length;
  app.innerHTML=`<h1>Favoris</h1><p class="lead">Les éléments marqués de l'étoile, pour une dernière révision avant l'épreuve. Ajoutez un favori depuis un QCM, une fiche, un arrêt, un chapitre ou un sujet.</p>
  ${nq?`<div class="row" style="margin-bottom:6px"><a class="btn primary" href="#qcm">Réviser mes ${nq} QCM favoris</a><span class="small muted">Choisissez « Mes favoris » dans le module QCM.</span></div>`:""}
  ${items.length?groups.filter(g=>items.some(x=>x[1].g===g)).map(g=>`<h3>${g}</h3><div class="stack">${items.filter(x=>x[1].g===g).map(([k,x])=>`<div class="panel"><div class="row" style="justify-content:space-between;margin-bottom:8px">${x.c?tagCh(x.c):`<span class="tag">Sujet</span>`}${starBtn(k,"")}</div>${x.html}</div>`).join("")}</div>`).join(""):`<div class="panel" style="text-align:center;padding:28px 18px"><div style="width:44px;height:44px;margin:0 auto 10px;color:var(--gilt)">${ICO.favoris}</div><p style="margin:0 auto" class="muted">Aucun favori pour l'instant. Touchez l'étoile d'une question, d'une fiche ou d'un arrêt pour l'ajouter ici.</p></div>`}`;
}

/* ---------- Impression ---------- */
function vImprimer(param){
  const c=CH.find(x=>x.id===param);if(!c)return vCours();
  ttl.textContent="Imprimer : "+c.titre;app.style.setProperty("--vc",vcOf(c.id));
  const F=ALL.fiches.filter(f=>f.c===c.id),J=ALL.juris.filter(j=>j.c===c.id);
  app.innerHTML=`<div class="panel noprint" style="margin-bottom:18px"><p style="margin:0 0 10px">Version imprimable du chapitre, avec ses fiches mémoire et ses arrêts. Pour un PDF, choisissez « Enregistrer au format PDF » comme imprimante.</p><div class="row"><button class="btn primary" id="pgo">${ICO.imprimer.replace('<svg','<svg width="18" height="18"')} Imprimer ou enregistrer en PDF</button><a class="btn" href="#cours/${c.id}">Retour au chapitre</a></div><p class="small muted" id="pmsg" style="margin:8px 0 0"></p></div>
  <div class="eyebrow" style="color:var(--vc)">${esc((VO.find(v=>v.id===c.v)||{}).titre||"")} · Procedurae</div><h1>${esc(c.titre)}</h1>
  ${c.sections.map(s=>`<div class="sec"><h3>${esc(s.h)}</h3>${s.p.map(p=>`<p>${esc(p)}</p>`).join("")}</div>`).join("")}
  ${F.length?`<h2 style="margin-top:26px">Fiches mémoire</h2><div class="stack">${F.map(f=>`<div class="panel"><div style="font-weight:700">${esc(f.q)}</div><p style="margin:6px 0 4px">${esc(f.a)}</p><div class="ref">${esc(f.r)}</div></div>`).join("")}</div>`:""}
  ${J.length?`<h2 style="margin-top:26px">Arrêts</h2><div class="stack">${J.map(j=>`<div class="panel"><div style="font-weight:700">${esc(j.nom)}</div><div class="ref">${esc(j.ref)}</div><p style="margin:6px 0 4px">${esc(j.sol)}</p><p class="small muted" style="margin:0">${esc(j.portee)}</p></div>`).join("")}</div>`:""}
  <p class="note">Textes à jour au 28 octobre 2026. Support d'entraînement : vérifiez toujours les textes en vigueur.</p>`;
  $("#pgo").onclick=()=>{try{window.print()}catch(e){}$("#pmsg").textContent="Si la fenêtre d'impression ne s'ouvre pas, utilisez la commande Imprimer de votre navigateur (Ctrl+P ou menu Partager sur téléphone)."};
}

/* ---------- Sujets d'examen ---------- */
let goT=null;
const sujNote=s=>{const st=store.get("suj",{})[s.id]||{},ck=st.chk||{};let tot=0,got=0,any=false;s.questions.forEach((q,i)=>q.grille.forEach((g,j)=>{tot+=g[1];if(ck[i+"-"+j]){got+=g[1];any=true}}));return {n:tot?got/tot*20:0,any,done:!!st.done}};
const fmtN=x=>x.toFixed(1).replace(".",",");
function vSujets(param){
  const S=window.SUJETS||[];
  if(param){const s=S.find(x=>x.id===param);if(!s)return vSujets();const st=store.get("suj",{})[s.id]||{};ttl.textContent=s.titre;
    const save=fn=>{const a=store.get("suj",{});a[s.id]=a[s.id]||{};fn(a[s.id]);store.set("suj",a)};
    app.innerHTML=`<span class="tag">${esc(CONC[s.conc].t)} · ${esc(s.type)}${s.duree?" · "+esc(s.duree):""}</span><div class="row" style="justify-content:space-between;align-items:flex-start;gap:12px;margin-top:8px"><h1 style="margin:0;min-width:0">${esc(s.titre)}</h1>${starBtn("s:"+s.id,s.titre)}</div>
    <div class="panel"><p style="margin:0">${esc(s.enonce)}</p></div>
    ${s.conc==="go"?`<div class="panel" style="margin-top:12px"><div class="row" style="justify-content:space-between"><b>Mode épreuve</b><span class="big mono" id="gclk">60:00</span></div><p class="small muted" id="gph" style="margin:6px 0 10px">Lancez la préparation d'une heure, puis l'exposé de quinze minutes.</p><div class="bar"><i id="gbar" style="width:0%"></i></div><div class="row" style="margin-top:10px"><button class="btn primary" id="gprep">Préparation : 1 h</button><button class="btn" id="gexp">Exposé : 15 min</button><button class="btn" id="gstop">Arrêter</button></div></div>`:""}
    <p class="small muted" style="margin-top:10px">Méthode : rédigez votre réponse avant d'ouvrir le corrigé, puis cochez dans la grille les éléments que vous aviez traités. La note obtenue est une autoévaluation indicative ; les jurys ne publient pas de barème officiel.</p>
    <div class="stack" style="margin-top:12px">${s.questions.map((q,i)=>`<div class="panel"><h3 style="margin-top:0">${s.questions.length>1?"Question "+(i+1):"Sujet"}</h3><p>${esc(q.q)}</p>
     <label class="small muted" for="sn${i}">Votre réponse (enregistrée sur cet appareil)</label><textarea id="sn${i}" data-i="${i}" style="min-height:140px">${esc((st.notes||{})[i]||"")}</textarea>
     <details style="margin-top:10px" ${(st.open||{})[i]?"open":""} data-d="${i}"><summary>Afficher le corrigé et la grille</summary><div class="corr">${q.corr.map(cpara).join("")}</div>
     <div style="margin-top:10px"><div class="small" style="font-weight:600;margin-bottom:6px">Grille : éléments attendus</div>${q.grille.map((g,j)=>`<label class="opt" style="margin-bottom:6px"><input type="checkbox" data-k="${i}-${j}" ${((st.chk||{})[i+"-"+j])?"checked":""}><span class="t">${esc(g[0])}</span><span class="mono small muted" style="margin-left:auto;white-space:nowrap">${fmtN(g[1])} pt</span></label>`).join("")}</div></details></div>`).join("")}</div>
    <div class="panel" style="margin-top:14px"><div class="row" style="justify-content:space-between"><b>Note d'autoévaluation</b><span class="big" id="snote">${fmtN(sujNote(s).n)} / 20</span></div>${meter(Math.round(sujNote(s).n*5))}
    <div class="row" style="margin-top:10px"><button class="btn" id="sdone">${st.done?"Sujet marqué comme traité":"Marquer comme traité"}</button><button class="btn" id="sreset">Effacer mes réponses et ma grille</button><button class="btn" id="sexp">Exporter le corrigé (Word)</button></div></div>`;
    $("#sexp").onclick=()=>exportDoc("corrige-"+s.id+"-"+s.titre,s.titre,CONC[s.conc].t+" · "+s.type+(s.duree?" · "+s.duree:""),s.enonce,s.questions);
    app.querySelectorAll("textarea[data-i]").forEach(x=>x.addEventListener("input",()=>save(o=>{o.notes=o.notes||{};o.notes[x.dataset.i]=x.value})));
    app.querySelectorAll("details[data-d]").forEach(d=>d.addEventListener("toggle",()=>save(o=>{o.open=o.open||{};o.open[d.dataset.d]=d.open})));
    app.querySelectorAll("input[data-k]").forEach(x=>x.onchange=()=>{save(o=>{o.chk=o.chk||{};o.chk[x.dataset.k]=x.checked});const n=sujNote(s);$("#snote").textContent=fmtN(n.n)+" / 20";app.querySelector(".panel .bar i").style.width=Math.round(n.n*5)+"%"});
    if(s.conc==="go"){const PH=[[0,"Introduction : accroche, définitions, problématique, annonce du plan (environ 3 minutes)."],[180,"Première partie (environ 5 minutes)."],[480,"Seconde partie (environ 5 minutes)."],[780,"Conclusion et ouverture : il reste 2 minutes."],[900,"Temps écoulé : concluez maintenant."]];
      const run=(sec,mode)=>{if(goT)clearInterval(goT);const t0=Date.now();const tick=()=>{if(!location.hash.startsWith("#sujets/"+s.id)){clearInterval(goT);goT=null;return}const el=Math.floor((Date.now()-t0)/1000),left=Math.max(0,sec-el);const c=$("#gclk");if(!c)return;c.textContent=String(Math.floor(left/60)).padStart(2,"0")+":"+String(left%60).padStart(2,"0");$("#gbar").style.width=Math.min(100,el/sec*100)+"%";
        $("#gph").textContent=mode==="exp"?PH.filter(p=>el>=p[0]).pop()[1]:(left>0?(el<600?"Analyse du sujet : termes, enjeux, actualité.":el<2400?"Recherche des idées et construction du plan en deux parties.":"Rédaction de l'introduction et de la conclusion ; le corps reste en notes."):"Préparation terminée : passez à l'exposé.");if(left<=0&&mode==="prep"){clearInterval(goT);goT=null}};tick();goT=setInterval(tick,1000)};
      $("#gprep").onclick=()=>run(3600,"prep");$("#gexp").onclick=()=>run(900,"exp");$("#gstop").onclick=()=>{if(goT)clearInterval(goT);goT=null;$("#gph").textContent="Minuteur arrêté."}}
    $("#sdone").onclick=()=>{save(o=>{o.done=!o.done;o.t=Date.now()});logAct();vSujets(param)};
    $("#sreset").onclick=e=>{const b=e.target;if(!b.dataset.c){b.dataset.c=1;b.textContent="Confirmer l'effacement";return}const a=store.get("suj",{});delete a[s.id];store.set("suj",a);vSujets(param)};
    return;}
  const ks=conc()?[conc()]:Object.keys(CONC);
  app.innerHTML=`<h1>Sujets d'examen</h1><p class="lead">Sujets originaux reproduisant la forme des épreuves : consultation de 2 heures pour le CRFPA, cas pratique ou composition pour l'ENM, questions à réponse courte pour le concours de greffier, exposé de quinze minutes pour le grand oral. Chaque sujet comporte un corrigé détaillé et une grille d'autoévaluation.</p>${concNote()}
  ${ks.map(k=>`<h3>${esc(CONC[k].t)}</h3><div class="stack">${S.filter(s=>s.conc===k).map(s=>{const n=sujNote(s);return `<a class="tile" href="#sujets/${s.id}"><span class="n">${esc(s.type)} · ${s.questions.length>1?s.questions.length+" questions":"1 sujet"}${n.done?" · traité":""}${n.any?" · "+fmtN(n.n)+" / 20":""}</span><b>${esc(s.titre)}</b><span>${esc(s.enonce.slice(0,130))}${s.enonce.length>130?"…":""}</span></a>`}).join("")}</div>`).join("")}`;
}

/* ---------- Examen blanc ---------- */
let ex=null,exTimer=null;
function vExam(){
  if(exTimer){clearInterval(exTimer);exTimer=null}
  if(!ex){
    app.innerHTML=`<h1>Examen blanc</h1><p class="lead">Une série de QCM tirée au hasard sur l'ensemble du programme, en temps limité. Aucune correction n'est donnée avant la fin ; la note est calculée sur 20, seule la combinaison complète comptant comme juste.</p>${concNote()}
    <div class="panel stack"><div class="field"><label for="en">Nombre de questions</label><select id="en"><option>20</option><option selected>30</option><option>40</option></select></div>
    <div class="field"><label for="ed">Durée</label><select id="ed"><option value="1">1 minute par question</option><option value="1.5" selected>1 minute 30 par question</option><option value="2">2 minutes par question</option><option value="0">Sans limite</option></select></div>
    <div class="row"><button class="btn primary" id="ego">Commencer l'examen</button><span class="small muted">${D.qcm.length} questions dans le programme retenu.</span></div></div>`;
    $("#ego").onclick=()=>{const n=Math.min(+$("#en").value,D.qcm.length),per=+$("#ed").value;
      const byV={};shuffle(D.qcm).forEach(q=>{const v=(CH.find(c=>c.id===q.c)||{}).v;(byV[v]=byV[v]||[]).push(q)});
      const list=[];const keys=Object.keys(byV);while(list.length<n&&keys.some(k=>byV[k].length))keys.forEach(k=>{if(list.length<n&&byV[k].length)list.push(byV[k].shift())});
      ex={list:shuffle(list),ans:list.map(()=>[]),ord:list.map(()=>shuffle([0,1,2,3,4])),pos:0,start:Date.now(),lim:per?per*n*60000:0,done:false,conc:conc()};vExam()};
    return;}
  if(ex.done)return exResult();
  const left=()=>ex.lim?Math.max(0,ex.lim-(Date.now()-ex.start)):null;
  const clock=()=>{const l=left();if(l===null)return "Sans limite";const s=Math.ceil(l/1000);return Math.floor(s/60)+" min "+String(s%60).padStart(2,"0")+" s"};
  const q=ex.list[ex.pos],sel=ex.ans[ex.pos];
  app.innerHTML=`<div class="row" style="justify-content:space-between"><span class="tag">Question ${ex.pos+1} / ${ex.list.length}</span><span class="mono small" id="eclk">${clock()}</span></div>
  <div class="bar" style="margin:10px 0 14px"><i style="width:${ex.ans.filter(a=>a.length).length/ex.list.length*100}%"></i></div>
  <div class="q-text">${esc(q.q)}</div><div class="small muted">Une ou plusieurs réponses exactes.</div>
  <div class="opts">${ex.ord[ex.pos].map((oi,p)=>`<label class="opt"><input type="checkbox" data-o="${oi}" ${sel.includes(oi)?"checked":""}><span class="L">${L[p]}</span><span class="t">${esc(q.o[oi][0])}</span></label>`).join("")}</div>
  <div class="row" style="margin-top:14px"><button class="btn" id="eprev" ${ex.pos?"":"disabled"}>Précédente</button>${ex.pos+1<ex.list.length?`<button class="btn primary" id="enext">Suivante</button>`:""}<button class="btn ${ex.pos+1<ex.list.length?"":"primary"}" id="eend">Terminer et corriger</button></div>
  <div class="row" style="margin-top:14px;gap:4px">${ex.list.map((x,k)=>`<button class="chip ${k===ex.pos?"on":""}" data-g="${k}" style="min-width:34px;${ex.ans[k].length&&k!==ex.pos?"border-color:var(--accent);color:var(--accent)":""}">${k+1}</button>`).join("")}</div>`;
  const save=()=>{ex.ans[ex.pos]=[...app.querySelectorAll(".opts input:checked")].map(x=>+x.dataset.o)};
  const go=k=>{save();ex.pos=k;vExam();window.scrollTo(0,0)};
  if(ex.pos)$("#eprev").onclick=()=>go(ex.pos-1);
  if(ex.pos+1<ex.list.length)$("#enext").onclick=()=>go(ex.pos+1);
  app.querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>go(+b.dataset.g));
  $("#eend").onclick=e=>{const b=e.target,blank=ex.ans.filter((a,k)=>k!==ex.pos&&!a.length).length+(app.querySelectorAll(".opts input:checked").length?0:1);
    if(!b.dataset.c){b.dataset.c=1;b.textContent=blank?"Confirmer ("+blank+" sans réponse)":"Confirmer la fin";return}save();finish()};
  const finish=()=>{if(exTimer){clearInterval(exTimer);exTimer=null}ex.done=true;ex.ans.forEach((a,k)=>recordQ(ex.list[k],a.length?isOk(ex.list[k],a):false));
    const ok=ex.list.filter((q,k)=>isOk(q,ex.ans[k])).length;const h=store.get("exams",[]);h.push({d:Date.now(),n:ex.list.length,ok,conc:ex.conc,min:Math.round((Date.now()-ex.start)/60000)});store.set("exams",h.slice(-50));exResult()};
  if(ex.lim)exTimer=setInterval(()=>{if(!location.hash.startsWith("#examen")||!ex||ex.done){clearInterval(exTimer);exTimer=null;return}const c=$("#eclk");if(c)c.textContent=clock();if(left()<=0){save();finish()}},1000);
}
function exResult(){
  const ok=ex.list.filter((q,k)=>isOk(q,ex.ans[k])).length,n=ex.list.length;
  const byV={};ex.list.forEach((q,k)=>{const v=(CH.find(c=>c.id===q.c)||{}).v;byV[v]=byV[v]||[0,0];byV[v][1]++;if(isOk(q,ex.ans[k]))byV[v][0]++});
  app.innerHTML=`<h1>Résultat de l'examen blanc</h1><div class="panel"><div class="big">${(ok/n*20).toFixed(1).replace(".",",")} / 20</div><p class="muted">${ok} réponse${ok>1?"s":""} juste${ok>1?"s":""} sur ${n} · durée ${Math.max(1,Math.round((Date.now()-ex.start)/60000))} min${ex.conc&&CONC[ex.conc]?" · programme "+esc(CONC[ex.conc].t):""}</p>
  <div class="stack" style="gap:8px">${VO.filter(v=>byV[v.id]).map(v=>`<div><div style="display:flex;gap:10px"><span style="flex:1" class="small">${esc(v.titre)}</span><span class="mono small">${byV[v.id][0]}/${byV[v.id][1]}</span></div>${meter(Math.round(byV[v.id][0]/byV[v.id][1]*100))}</div>`).join("")}</div>
  <div class="row" style="margin-top:14px"><button class="btn primary" id="eagain">Nouvel examen</button><a class="btn" href="#bord">Tableau de bord</a></div></div>
  <h2 style="margin-top:22px">Correction</h2><div class="stack">${ex.list.map((q,k)=>{const a=ex.ans[k],good=isOk(q,a);return `<details class="panel"><summary><span class="${good?"v-ok":"v-ko"}">${k+1}. ${good?"Juste":a.length?"Inexacte":"Sans réponse"}</span> <span class="small muted">${esc(chName(q.c))}</span></summary>
   <p class="q-text" style="margin-top:10px">${esc(q.q)}</p><div class="opts">${ex.ord[k].map((oi,p)=>{const o=q.o[oi],chk=a.includes(oi);const cls=chk&&o[1]?"good":chk?"bad":o[1]?"miss":"";return `<label class="opt ${cls}"><span class="L">${L[p]}</span><span class="t">${esc(o[0])}</span></label>`}).join("")}</div>
   <div class="expl"><p>${esc(q.e)}</p><div class="ref">${q.r.map(esc).join(" · ")}</div></div></details>`}).join("")}</div>`;
  $("#eagain").onclick=()=>{ex=null;vExam()};
}

/* ---------- Doctrine ---------- */
const thRef=k=>{const t=window.THESES[k];return `${esc(t.a)}, <i>${esc(t.t)}</i>, ${esc(t.u)}`};
function vDoctrine(param){
  const DO=window.DOCTRINE;
  if(param!==undefined&&DO[+param]){const d=DO[+param];ttl.textContent="Débat doctrinal";
    app.innerHTML=`<div class="row">${d.c.map(c=>`<a class="tag" href="#cours/${c}" style="text-decoration:none">${esc(chName(c))}</a>`).join(" ")}</div><h1 style="margin-top:8px">${esc(d.titre)}</h1>
    ${d.p.map(x=>{const m=x.match(/^([^.:]{3,40}[.:]) (.*)$/s);return m?`<p><b>${esc(m[1])}</b> ${esc(m[2])}</p>`:`<p>${esc(x)}</p>`}).join("")}
    <div class="panel small" style="margin-top:14px"><div class="eyebrow">Sources</div>${d.th.map(k=>`<p style="margin:0 0 6px">${thRef(k)}.</p>`).join("")}${d.src?`<p style="margin:0 0 6px">${esc(d.src)}</p>`:""}<p class="muted" style="margin:0">Les idées des auteurs sont restituées dans nos propres termes ; se reporter aux thèses pour leur formulation exacte.</p></div>`;return;}
  app.innerHTML=`<h1>Débats doctrinaux</h1><p class="lead">Les controverses à connaître, éclairées par des thèses récentes de droit processuel. Utiles pour l'oral, la dissertation de l'ENM et la discussion en cas pratique.</p>
  <div class="stack">${DO.map((d,k)=>`<a class="tile" href="#doctrine/${k}"><span class="n">${d.c.map(c=>esc(chName(c))).join(" · ")}</span><b>${esc(d.titre)}</b><span>${d.th.map(t=>esc(window.THESES[t].a)).join(", ")}</span></a>`).join("")}</div>
  <h3>Thèses exploitées</h3><div class="panel small">${Object.keys(window.THESES).map(k=>`<p style="margin:0 0 6px">${thRef(k)}.</p>`).join("")}</div>`;
}

/* ---------- Dissertations ---------- */
function vDissert(param){
  const DI=window.DISSERT;
  if(param!==undefined&&DI[+param]){const d=DI[+param],notes=store.get("cas",{}),k="dis-"+param;ttl.textContent="Dissertation";
    app.innerHTML=`<div class="eyebrow">Sujet</div><h1>${esc(d.s)}</h1>
    <div class="panel"><label class="small muted" for="dn">Votre problématique et votre plan (enregistrés sur cet appareil)</label><textarea id="dn" style="min-height:140px">${esc(notes[k]||"")}</textarea></div>
    <details style="margin-top:14px"><summary>Afficher la proposition de corrigé</summary>
    <div class="panel" style="margin-top:10px"><p><b>Problématique.</b> ${esc(d.prob)}</p>
    ${d.plan.map(([t,ss])=>`<h3>${esc(t)}</h3>${ss.map(x=>`<p style="margin-left:14px">${esc(x)}</p>`).join("")}`).join("")}
    <h3>Matériaux à mobiliser</h3><p>${d.mat.map(esc).join(" ; ")}.</p>
    <h3>Doctrine et sources</h3>${d.th.map(t=>`<p class="small">${thRef(t)}.</p>`).join("")}${d.src?`<p class="small">${esc(d.src)}</p>`:""}</div></details>
    <p class="note">Méthode : définir les termes, situer l'enjeu, formuler une problématique, puis un plan en deux parties et deux sous parties dont les intitulés répondent à la question posée.</p>`;
    $("#dn").addEventListener("input",e=>{const n=store.get("cas",{});n[k]=e.target.value;store.set("cas",n)});return;}
  app.innerHTML=`<h1>Dissertations</h1><p class="lead">Sujets de réflexion au format des compositions de l'ENM, en procédure civile et en procédure pénale. Rédigez votre plan avant d'afficher la proposition de corrigé.</p>
  <div class="stack">${DI.map((d,i)=>`<a class="tile" href="#dissert/${i}"><span class="n">${d.cat?esc(d.cat):d.th.map(t=>esc(window.THESES[t].a)).join(" · ")}</span><b>${esc(d.s)}</b><span>${esc(d.prob)}</span></a>`).join("")}</div>`;
}

/* ---------- Routeur ---------- */
const VIEWS={arrets:vArrets,recherche:vRecherche,favoris:vFavoris,imprimer:vImprimer,sujets:vSujets,entretien:vEntretien,mentions:vMentions,examen:vExam,bord:vBord,cours:vCours,qcm:vQcm,fiches:vFiches,juris:vJuris,delais:vDelais,calcul:vCalcul,qualif:vQualif,cas:vCas,doctrine:vDoctrine,dissert:vDissert};
function route(){
  const [v,p]=location.hash.slice(1).split("/");
  const m=MODULES.find(x=>x.id===v)||(v==="imprimer"?{t:"Imprimer"}:v==="mentions"?{t:"Mentions légales"}:null);
  back.hidden=!m; ttl.textContent=m?m.t:"Procedurae";
  back.href=(p&&["cours","cas","doctrine","dissert","sujets","entretien","arrets"].includes(v))?"#"+v:(v==="imprimer"&&p?"#cours/"+p:"#");
  document.querySelectorAll(".top .act a:not(#themeBtn)").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+v));
  if(!["cours","imprimer"].includes(v))app.style.removeProperty("--vc");
  (VIEWS[v]||vHome)(p);
  if(!p||v!=="qcm")window.scrollTo(0,0);
}
let deferredPrompt=null;
const IOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
const STANDALONE=window.navigator.standalone===true||(window.matchMedia&&matchMedia("(display-mode: standalone)").matches);
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{})}catch(e){}
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;const i=$("#inst");if(i&&!IOS){i.hidden=false;$("#instBtn").onclick=()=>{deferredPrompt.prompt();deferredPrompt=null;i.hidden=true}}});
const TH={auto:"automatique (selon l'appareil)",light:"clair",dark:"sombre"};
function applyTheme(m){const r=document.documentElement;if(m==="light"||m==="dark")r.setAttribute("data-theme",m);else r.removeAttribute("data-theme");const b=document.getElementById("themeBtn");if(b){b.title="Thème : "+TH[m]+". Toucher pour changer.";b.setAttribute("aria-label",b.title)}}
applyTheme(store.get("theme","auto"));
(document.getElementById("themeBtn")||{}).onclick=e=>{e.preventDefault();const o=["auto","light","dark"],c=store.get("theme","auto"),n=o[(o.indexOf(c)+1)%3];store.set("theme",n);applyTheme(n);toast("Thème "+TH[n])};
function toast(msg){let el=document.getElementById("toast");if(!el){el=document.createElement("div");el.id="toast";el.setAttribute("role","status");document.body.appendChild(el)}el.textContent=msg;el.className="on";clearTimeout(toast.t);toast.t=setTimeout(()=>{el.className=""},1800)}
window.addEventListener("hashchange",route);
route();
if("serviceWorker" in navigator&&location.protocol==="https:"&&!/claude\.ai|claudeusercontent/.test(location.hostname)){try{navigator.serviceWorker.register("sw.js").catch(()=>{})}catch(e){}}
})();
