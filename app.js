(function(){
"use strict";
const ALL=window.DATA, CH=window.CHAPITRES, VO=window.VOLETS, D={};
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const store={get(k,d){try{const v=localStorage.getItem("apc-"+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem("apc-"+k,JSON.stringify(v))}catch(e){}}};
const chName=id=>(CH.find(c=>c.id===id)||{}).titre||id;
const shuffle=a=>{a=a.slice();for(let k=a.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[a[k],a[j]]=[a[j],a[k]]}return a};
const L="ABCDE";
/* Concours : chapitres relevant du programme de procédure civile de chaque épreuve.
   CRFPA : arrêté du 17 octobre 2016 modifié (procédure civile, modes amiables, arbitrage, procédures civiles d'exécution).
   ENM : arrêté du 31 décembre 2008 modifié, épreuve de droit civil et procédure civile (rubriques A à J).
   Greffier : arrêté du 29 avril 2016 modifié, épreuve écrite n° 2, partie procédure civile. */
const PCH=["pd","act","comp","juge","intro","del","def","inst","pre","jug","urg","vro","vre"];
const CONC={
 crfpa:{t:"CRFPA",ch:null,ref:"Arrêté du 17 octobre 2016 modifié",ep:"Épreuve écrite d'admissibilité de procédure (2 heures, coefficient 2), sous la forme d'une ou plusieurs consultations. La procédure civile est l'épreuve de procédure des candidats ayant choisi la spécialité droit civil, droit des affaires ou droit social ; en droit international et européen et en droit fiscal, le candidat choisit entre procédure civile et procédure administrative. Programme : procédure civile, modes amiables de résolution des différends, arbitrage, procédures civiles d'exécution. Tout le contenu de l'application est concerné."},
 enm:{t:"ENM",ch:PCH.filter(c=>c!=="frais").concat(["m1","m2","m3","m5"]),ref:"Arrêté du 31 décembre 2008 modifié",ep:"Épreuve écrite d'admissibilité de droit civil et procédure civile : composition ou cas pratique au choix du jury (premier concours), cas pratique (deuxième concours), cas pratique ou questions à réponse courte au choix du candidat (troisième concours). Le programme vise l'action en justice, les actes de procédure, les délais, les principes directeurs et l'influence du droit européen, la preuve, les procédures contentieuse et gracieuse, les effets du jugement, les voies de recours et les modes amiables (médiation et conciliation). L'arbitrage, les procédures civiles d'exécution, les procédures participatives et les frais du procès en sont exclus."},
 greffier:{t:"Greffier (procédure civile)",ch:PCH.concat(["m2","e1"]),ref:"Arrêté du 29 avril 2016 modifié",ep:"Épreuve écrite d'admissibilité n° 2 (3 heures, coefficient 4) : organisation judiciaire et administrative, puis, au choix, procédure civile et prud'homale ou procédure pénale. L'application couvre la partie procédure civile, y compris la conciliation et l'exécution des jugements ; elle ne traite ni la procédure prud'homale, ni l'organisation de la cour d'assises, des juridictions des mineurs et de l'ordre administratif, ni les auxiliaires de justice."}
};
const conc=()=>{const k=store.get("conc","");return CONC[k]?k:""};
const inConc=c=>{const k=conc();return !k||!CONC[k].ch||CONC[k].ch.includes(c)};
const delaiCh=x=>{const t=x.t;if(/CPCE/.test(t))return /L\. 111-4/.test(t)?"e1":/R\. 511/.test(t)?"e3":/R\. 211/.test(t)?"e4":"e5";if(/1343-5/.test(t))return "e1";if(/1534/.test(t))return "m2";if(/2238/.test(t))return "m1";if(/1463/.test(t))return "a2";if(/1494|1519/.test(t))return "a3";return "del"};
function applyConc(){D.qcm=ALL.qcm.filter(q=>inConc(q.c));D.fiches=ALL.fiches.filter(x=>inConc(x.c));D.juris=ALL.juris.filter(x=>inConc(x.c));D.cas=ALL.cas;D.delais=ALL.delais;D.qualif=ALL.qualif}
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
 {id:"bord",t:"Tableau de bord",d:"Progression par volet et par chapitre, points faibles",n:()=>"Suivi"},
 {id:"cours",t:"Fiches de cours",d:"Synthèses par chapitre, textes et jurisprudence",n:()=>CH.length+" chapitres"},
 {id:"examen",t:"Examen blanc",d:"Série chronométrée notée sur 20, correction à la fin",n:()=>"Épreuve"},
 {id:"qcm",t:"QCM",d:"Cinq propositions, une ou plusieurs exactes",n:()=>D.qcm.length+" questions"},
 {id:"fiches",t:"Fiches mémoire",d:"Répétition espacée en cinq boîtes",n:()=>D.fiches.length+" fiches"},
 {id:"juris",t:"Jurisprudence",d:"Grands arrêts : solution et portée",n:()=>D.juris.length+" arrêts"},
 {id:"delais",t:"Tableau des délais",d:"Durées à compléter, départ et sanction",n:()=>D.delais.length+" délais"},
 {id:"calcul",t:"Calculateur de délais",d:"Articles 640 à 643, jours fériés inclus",n:()=>"Outil"},
 {id:"qualif",t:"Qualifications",d:"Exception, fin de non recevoir, défense au fond",n:()=>D.qualif.length+" moyens"},
 {id:"cas",t:"Cas pratiques",d:"Énoncés type examen et corrigés rédigés",n:()=>D.cas.length+" cas"},
 {id:"doctrine",t:"Débats doctrinaux",d:"Thèses récentes, controverses et critiques",n:()=>window.DOCTRINE.length+" débats"},
 {id:"dissert",t:"Dissertations",d:"Sujets, problématiques et plans détaillés",n:()=>window.DISSERT.length+" sujets"}
];
const app=$("#app"), ttl=$("#ttl"), back=$("#back");

function chapterSelect(id,val,withAll=true){
  const vos=VO.filter(v=>CH.some(c=>c.v===v.id&&inConc(c.id)));
  return `<select id="${id}" aria-label="Chapitre">${withAll?'<option value="">Tous les volets</option>':""}${vos.map(v=>`<optgroup label="${esc(v.titre)}"><option value="v:${v.id}" ${val==="v:"+v.id?"selected":""}>Tout le volet ${esc(v.titre.toLowerCase())}</option>${CH.filter(c=>c.v===v.id&&inConc(c.id)).map(c=>`<option value="${c.id}" ${c.id===val?"selected":""}>${esc(c.titre)}</option>`).join("")}</optgroup>`).join("")}</select>`;
}
const inSel=(c,val)=>!val||(val.startsWith("v:")?(CH.find(x=>x.id===c)||{}).v===val.slice(2):c===val);

/* ---------- Accueil ---------- */
function vHome(){
  const qs=store.get("qcm",{}); const done=Object.keys(qs).length, ok=Object.values(qs).filter(x=>x.ok).length;
  const fb=store.get("fbox",{}); const known=Object.values(fb).filter(b=>b>=4).length;
  app.innerHTML=`<div class="eyebrow">CRFPA · ENM · Greffier (procédure civile)</div><h1>Atelier procédure civile</h1>
  <p class="lead">Révision du programme de procédure civile : cours, entraînement et outils. Votre progression reste enregistrée sur cet appareil.</p>
  <div class="panel" style="margin:14px 0"><div class="small muted" style="margin-bottom:6px">Mon concours : le contenu proposé suit son programme de procédure civile.</div><div class="row">${[["","Tous"]].concat(Object.keys(CONC).map(k=>[k,CONC[k].t])).map(([k,n])=>`<button class="chip ${conc()===k?"on":""}" data-conc="${k}">${esc(n)}</button>`).join("")}</div>${conc()?`<p class="small" style="margin:10px 0 0">${esc(CONC[conc()].ep)}</p><p class="small muted" style="margin:6px 0 0">${esc(CONC[conc()].ref)}.</p>`:""}</div>
  <div class="volets">${VO.map(v=>v.dispo?`<a class="chip on" style="text-decoration:none" href="#cours/v:${v.id}">${esc(v.titre)}</a>`:`<span class="chip">${esc(v.titre)} · à venir</span>`).join("")}</div>
  <div class="stats"><div><b>${done}/${D.qcm.length}</b><span>QCM traités</span></div><div><b>${done?Math.round(ok/done*100):0} %</b><span>QCM réussis</span></div><div><b>${known}/${D.fiches.length}</b><span>Fiches en boîte 4 ou 5</span></div></div>
  <p class="small" style="margin-top:8px"><a href="#bord" style="color:var(--accent)">Voir le tableau de bord détaillé</a></p>
  <div class="grid" style="margin-top:16px">${MODULES.map(m=>`<a class="tile" href="#${m.id}"><span class="n">${m.n()}</span><b>${m.t}</b><span>${m.d}</span></a>`).join("")}</div>
  <div class="panel install" id="inst" hidden style="margin-top:16px"><span class="small">Installez l'application sur votre écran d'accueil pour l'utiliser hors connexion.</span><button class="btn primary" id="instBtn">Installer</button></div>
  <p class="note">Contenus établis d'après le <a href="https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006070716" target="_blank" rel="noopener">Code de procédure civile</a> et le <a href="https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006070721" target="_blank" rel="noopener">Code civil</a> applicables au 27 octobre 2026, compte tenu des décrets n° 2023-1391, n° 2024-673, n° 2025-660 et n° 2026-683. Programme de référence : arrêté du 17 octobre 2016 modifié (CRFPA), arrêté du 31 décembre 2008 modifié (ENM) et arrêté du 29 avril 2016 modifié (concours de greffier des services judiciaires, partie procédure civile). Contenus confrontés à N. Cayrol, <i>Procédure civile</i>, Dalloz, coll. Cours, 5e éd., 2025. Support d'entraînement : vérifiez toujours les textes en vigueur.</p>
  <p class="note"><button class="btn" id="wipe">Effacer toute ma progression</button></p>`;
  app.querySelectorAll("[data-conc]").forEach(b=>b.onclick=()=>{store.set("conc",b.dataset.conc);applyConc();resetViews();vHome()});
  if(deferredPrompt){$("#inst").hidden=false;$("#instBtn").onclick=async()=>{deferredPrompt.prompt();deferredPrompt=null;$("#inst").hidden=true}}
  $("#wipe").onclick=e=>{const b=e.target;if(b.dataset.c){["qcm","fbox","dans","cas","act","qual"].forEach(k=>store.set(k,{}));store.set("exams",[]);b.textContent="Progression effacée";delete b.dataset.c;setTimeout(()=>route(),800)}else{b.dataset.c=1;b.textContent="Confirmer l'effacement"}};
}

/* ---------- Cours ---------- */
function vCours(param){
  if(param&&!param.startsWith("v:")){const c=CH.find(x=>x.id===param); if(!c)return vCours();
    const i=CH.indexOf(c), prev=CH[i-1], next=CH[i+1];
    ttl.textContent=c.titre;
    app.innerHTML=`<div class="eyebrow">Chapitre ${i+1} sur ${CH.length}${inConc(c.id)?"":" · hors programme "+esc(CONC[conc()].t)}</div><h1>${esc(c.titre)}</h1>
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
    <div class="field"><label for="qm">Questions</label><select id="qm"><option value="rev">À réviser aujourd'hui (répétition espacée)</option><option value="all">Toutes</option><option value="new">Jamais traitées</option><option value="err">Mes erreurs</option></select></div>
    <div class="field"><label for="qn">Longueur de la série</label><select id="qn"><option>10</option><option selected>20</option><option value="999">Toutes</option></select></div>
    <div class="row"><button class="btn primary" id="qgo">Commencer</button><span class="small muted" id="qinfo"></span></div></div>`;
    const info=()=>{const pool=pool_();$("#qinfo").textContent=pool.length+" question"+(pool.length>1?"s":"")+" disponible"+(pool.length>1?"s":"")};
    const pool_=()=>D.qcm.filter(q=>inSel(q.c,$("#qc").value)&&($("#qm").value==="all"||($("#qm").value==="rev"&&qDue(res[q.id]))||($("#qm").value==="new"&&!res[q.id])||($("#qm").value==="err"&&res[q.id]&&!res[q.id].ok)));
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
  app.innerHTML=`<div class="row" style="justify-content:space-between"><span class="tag">${esc(chName(q.c))}</span><span class="mono small muted">${qs.pos+1} / ${qs.list.length} · ${qs.score} juste${qs.score>1?"s":""}</span></div>
  <div class="bar" style="margin:10px 0 14px"><i style="width:${qs.pos/qs.list.length*100}%"></i></div>
  <div class="q-text">${esc(q.q)}</div><div class="small muted">Une ou plusieurs réponses exactes.</div>
  <div class="opts">${qs.order.map((oi,p)=>{const o=q.o[oi],chk=a&&a.includes(oi);let cls="";if(a){if(chk&&o[1])cls="good";else if(chk)cls="bad";else if(o[1])cls="miss"}
   return `<label class="opt ${cls}"><input type="checkbox" id="o${oi}" data-o="${oi}" ${chk?"checked":""} ${a?"disabled":""}><span class="L">${L[p]}</span><span class="t">${esc(o[0])}</span></label>`}).join("")}</div>
  ${a?(()=>{const ok=isOk(q,a);return `<div class="expl"><p class="${ok?"v-ok":"v-ko"}">${ok?"Réponse juste.":"Réponse inexacte. Bonnes réponses : "+qs.order.map((oi,p)=>q.o[oi][1]?L[p]:"").join("")+"."}</p><p>${esc(q.e)}</p><div class="ref">${q.r.map(esc).join(" · ")}</div></div>
   <div class="row" style="margin-top:14px"><button class="btn primary" id="qnext">${qs.pos+1<qs.list.length?"Question suivante":"Voir le résultat"}</button></div>`})()
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
  <div class="panel stack" style="margin-top:12px;min-height:220px"><div class="row" style="justify-content:space-between"><span class="tag">${esc(chName(f.c))}</span><span class="mono small muted">Boîte ${box[f.id]||1}</span></div>
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
  <div class="stack">${list.map((j,i)=>`<div class="panel"><div class="row" style="justify-content:space-between"><span class="tag">${esc(chName(j.c))}</span></div>
  <h2 style="margin-top:8px">${esc(j.nom)}</h2><div class="ref">${esc(j.ref)}</div>
  ${jHide?`<details style="margin-top:10px"><summary>Afficher la solution</summary><p style="margin-top:8px">${esc(j.sol)}</p><p class="small muted">${esc(j.portee)}</p></details>`:`<p style="margin-top:10px">${esc(j.sol)}</p><p class="small muted">${esc(j.portee)}</p>`}</div>`).join("")}</div>`;
  $("#jc").onchange=e=>{location.hash="juris"+(e.target.value?"/"+e.target.value:"")};
  $("#jh").onchange=e=>{jHide=e.target.checked;vJuris(param)};
}

/* ---------- Tableau des délais ---------- */
const DUR=["15 jours","1 mois","2 mois","3 mois","5 mois","6 mois","1 an","2 ans","10 ans","30 ans"];
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
  const presets=D.delais.filter(x=>x.n);
  app.innerHTML=`<h1>Calculateur de délais</h1><p class="lead">Le jour de l'acte ne compte pas ; le délai en mois expire au même quantième, ou au dernier jour du mois ; l'échéance tombant un samedi, un dimanche ou un jour férié est prorogée au premier jour ouvrable suivant (art. 640 à 643).</p>
  <div class="panel"><div class="f2">
   <div class="field"><label for="cp">Délai type</label><select id="cp"><option value="">Délai libre</option>${presets.map((x,i)=>`<option value="${i}">${esc(x.a)} (${x.d})</option>`).join("")}</select></div>
   <div class="field"><label for="cd">Date de l'acte, de l'événement ou de la notification</label><input type="date" id="cd" value="${new Date().toISOString().slice(0,10)}"></div>
   <div class="field"><label for="cn">Durée</label><div class="row"><input type="number" id="cn" min="1" value="1" style="width:90px"><select id="cu" aria-label="Unité"><option value="j">jours</option><option value="m" selected>mois</option><option value="a">ans</option></select></div></div>
   <div class="field"><label for="cl">Lieu où demeure le destinataire</label><select id="cl"><option value="0">France métropolitaine</option><option value="1">Outre mer (art. 643)</option><option value="2">Étranger</option></select></div>
  </div>
  <div class="stack small" style="margin-top:12px;gap:6px"><label class="row"><input type="checkbox" id="cpt" checked> Traiter le lundi de Pentecôte comme jour férié</label><label class="row"><input type="checkbox" id="cam"> Jours fériés d'Alsace et de Moselle (Vendredi saint, 26 décembre)</label></div>
  <div id="cout" class="expl"></div></div>`;
  const calc=()=>{
    const out=$("#cout"),cd=$("#cd").value;if(!cd){out.innerHTML='<p class="muted">Indiquez une date.</p>';return}
    const p=$("#cp").value!==""?presets[+$("#cp").value]:null,n=Math.max(1,parseInt($("#cn").value)||1),u=$("#cu").value,lieu=+$("#cl").value,pent=$("#cpt").checked,am=$("#cam").checked;
    const st=new Date(cd+"T00:00:00Z"),steps=[`Point de départ : ${fmt(st)}. Ce jour ne compte pas (art. 641).`],warns=[];let end;
    if(u==="j"){end=addD(st,n);steps.push(`Délai de ${n} jour${n>1?"s":""} : échéance théorique le ${fmt(end)}.`)}
    else{const r=addMonths(st,u==="m"?n:12*n);end=r.date;steps.push(`Délai de ${n} ${u==="m"?"mois":(n>1?"ans":"an")} : échéance au même quantième, le ${fmt(end)}${r.cl?" (dernier jour du mois, art. 641 al. 2)":""}.`)}
    if(lieu){end=addMonths(end,lieu).date;steps.push(`Délai de distance de ${lieu} mois (art. 643) : ${fmt(end)}.`);if(p&&!p.dist)warns.push("L'article 643 ne vise que certains délais (comparution, appel, opposition, tierce opposition de l'article 586 al. 3, révision, pourvoi). Vérifiez qu'il s'applique ici.")}
    let f=end;const moved=[];for(let k=0;k<15;k++){const H=holidays(f.getUTCFullYear(),pent,am),dw=f.getUTCDay(),h=H[key(f)];if(dw===0||dw===6||h){moved.push(`${fmt(f)} (${h||(dw===6?"samedi":"dimanche")})`);f=addD(f,1)}else break}
    if(moved.length)steps.push(`Prorogation (art. 642 al. 2) : ${moved.join(", puis ")} ; report au premier jour ouvrable.`);
    steps.push("Le délai expire le dernier jour à vingt quatre heures (art. 642 al. 1).");
    if(moved.some(m=>m.includes("Pentecôte"))||(!pent&&key(f)===key(addD(easter(f.getUTCFullYear()),50))))warns.push("Le lundi de Pentecôte affecte l'échéance : son traitement comme jour chômé mérite une vérification.");
    out.innerHTML=`<div class="eyebrow">Échéance</div><div class="big">${fmt(f)}, à 24 heures</div>${p?`<p class="small muted" style="margin-top:6px">${esc(p.a)} · ${esc(p.t)}${p.s?" · Sanction : "+esc(p.s):""}</p>`:""}<ol class="steps">${steps.map(s=>`<li>${s}</li>`).join("")}</ol>${warns.map(w=>`<div class="warn">${w}</div>`).join("")}`;
  };
  $("#cp").onchange=()=>{if($("#cp").value!==""){const p=presets[+$("#cp").value];$("#cn").value=p.n;$("#cu").value=p.u}calc()};
  ["cd","cn","cu","cl","cpt","cam"].forEach(id=>{$("#"+id).addEventListener("input",calc);$("#"+id).addEventListener("change",calc)});calc();
}

/* ---------- Qualifications ---------- */
const CAT=["Exception de procédure","Fin de non recevoir","Défense au fond","Demande incidente"];
let qq=null;
function vQualif(){
  if(!qq)qq={order:shuffle(D.qualif.map((m,i)=>i)),pos:0,ok:0,done:0,ans:null};
  const m=D.qualif[qq.order[qq.pos]],a=qq.ans;
  app.innerHTML=`<h1>Qualifications</h1><p class="lead">Qualifiez le moyen soulevé : la qualification commande le moment, l'exigence d'un grief, l'office du juge et le juge compétent.</p>
  <div class="panel"><div class="row" style="justify-content:space-between"><span class="tag">Moyen ${qq.pos+1} sur ${D.qualif.length}</span><span class="mono small muted">${qq.done?qq.ok+"/"+qq.done+" justes":""}</span></div>
  <div class="q-text" style="margin:12px 0 14px">${esc(m[0])}</div>
  <div class="choices">${CAT.map((c,k)=>`<button class="btn ${a!==null?(k===m[1]?"right":(k===a?"wrong":"")):""}" data-k="${k}" ${a!==null?"disabled":""}>${c}</button>`).join("")}</div>
  ${a!==null?`<div class="expl"><p class="${a===m[1]?"v-ok":"v-ko"}">${a===m[1]?"Exact.":"Inexact : "+CAT[m[1]]+"."}</p><p>${esc(m[2])}</p><button class="btn primary" id="qn2">${qq.pos+1<D.qualif.length?"Moyen suivant":"Recommencer ("+qq.ok+"/"+D.qualif.length+")"}</button></div>`:""}</div>`;
  app.querySelectorAll(".choices .btn").forEach(b=>b.onclick=()=>{if(qq.ans!==null)return;qq.ans=+b.dataset.k;qq.done++;if(qq.ans===m[1])qq.ok++;const qs2=store.get("qual",{});qs2[m[0].slice(0,80)]={ok:qq.ans===m[1],t:Date.now()};store.set("qual",qs2);logAct();vQualif()});
  if(a!==null)$("#qn2").onclick=()=>{if(qq.pos+1>=D.qualif.length)qq=null;else{qq.pos++;qq.ans=null}vQualif()};
}

/* ---------- Cas pratiques ---------- */
function vCas(param){
  if(param!==undefined&&D.cas[+param]){const c=D.cas[+param],notes=store.get("cas",{});ttl.textContent=c.titre;
    app.innerHTML=`<span class="tag">${esc(chName(c.c))}</span><h1 style="margin-top:8px">${esc(c.titre)}</h1><div class="panel"><p>${esc(c.enonce)}</p></div>
    <div class="stack" style="margin-top:14px">${c.questions.map((q,i)=>`<div class="panel"><h3 style="margin-top:0">Question ${i+1}</h3><p>${esc(q.q)}</p>
    <label class="small muted" for="n${i}">Votre réponse (enregistrée sur cet appareil)</label><textarea id="n${i}" data-k="${param}-${i}">${esc(notes[param+"-"+i]||"")}</textarea>
    <details style="margin-top:10px"><summary>Afficher le corrigé</summary><div class="corr">${esc(q.corr)}</div></details></div>`).join("")}</div>
    <p class="note">Méthode : pour chaque question, identifier le problème, énoncer la règle avec son texte, l'appliquer aux faits, conclure.</p>`;
    app.querySelectorAll("textarea").forEach(t=>t.addEventListener("input",()=>{const n=store.get("cas",{});n[t.dataset.k]=t.value;store.set("cas",n)}));return;}
  app.innerHTML=`<h1>Cas pratiques</h1><p class="lead">Énoncés au format de l'examen, avec corrigé rédigé selon la méthode problème, règle, application, conclusion.</p>
  ${concNote()}<div class="stack">${D.cas.map((c,i)=>!inConc(c.c)?"":`<a class="tile" href="#cas/${i}"><span class="n">${esc(chName(c.c))} · ${c.questions.length} questions</span><b>${esc(c.titre)}</b><span>${esc(c.enonce.slice(0,140))}…</span></a>`).join("")}</div>`;
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
    const b=new Blob([JSON.stringify(o)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="atelier-progression-"+dayKey()+".json";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);$("#bmsg").textContent="Fichier de sauvegarde créé."};
  $("#bimp").onchange=e=>{const file=e.target.files[0];if(!file)return;const rd=new FileReader();rd.onload=()=>{try{const o=JSON.parse(rd.result);if(o.app!=="atelier-procedure-civile"||!o.data)throw 0;const ks=Object.keys(o.data).filter(k=>k.startsWith("apc-"));
      if(!confirmImp){confirmImp=o;$("#bmsg").innerHTML="Sauvegarde du "+esc(fmtD(new Date(o.date)))+" lue ("+ks.length+" éléments). Elle remplacera la progression actuelle. <button class='btn ko' id='bok'>Confirmer l'import</button>";$("#bok").onclick=()=>{try{ks.forEach(k=>localStorage.setItem(k,confirmImp.data[k]))}catch(er){}confirmImp=null;applyConc();vBord();$("#bmsg").textContent="Progression importée."};}
    }catch(er){$("#bmsg").textContent="Ce fichier n'est pas une sauvegarde valide de l'application."}e.target.value=""};rd.readAsText(file)};
  app.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{bordTab=b.dataset.t;vBord()});
}
const fmtD=d=>d.getDate()+" "+["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."][d.getMonth()];

function resetViews(){qs=null;fs_={cur:null,shown:false,c:null};qq=null;ex=null}
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
  app.innerHTML=`<h1>Dissertations</h1><p class="lead">Sujets de réflexion au format de l'épreuve de droit civil et procédure civile de l'ENM. Rédigez votre plan avant d'afficher la proposition de corrigé.</p>
  <div class="stack">${DI.map((d,i)=>`<a class="tile" href="#dissert/${i}"><span class="n">${d.th.map(t=>esc(window.THESES[t].a)).join(" · ")}</span><b>${esc(d.s)}</b><span>${esc(d.prob)}</span></a>`).join("")}</div>`;
}

/* ---------- Routeur ---------- */
const VIEWS={examen:vExam,bord:vBord,cours:vCours,qcm:vQcm,fiches:vFiches,juris:vJuris,delais:vDelais,calcul:vCalcul,qualif:vQualif,cas:vCas,doctrine:vDoctrine,dissert:vDissert};
function route(){
  const [v,p]=location.hash.slice(1).split("/");
  const m=MODULES.find(x=>x.id===v);
  back.hidden=!m; ttl.textContent=m?m.t:"Atelier procédure civile";
  back.href=(p&&["cours","cas","doctrine","dissert"].includes(v))?"#"+v:"#";
  (VIEWS[v]||vHome)(p);
  if(!p||v!=="qcm")window.scrollTo(0,0);
}
let deferredPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;const i=$("#inst");if(i){i.hidden=false;$("#instBtn").onclick=()=>{deferredPrompt.prompt();deferredPrompt=null;i.hidden=true}}});
window.addEventListener("hashchange",route);
route();
if("serviceWorker" in navigator&&location.protocol==="https:"&&!/claude\.ai|claudeusercontent/.test(location.hostname)){try{navigator.serviceWorker.register("sw.js").catch(()=>{})}catch(e){}}
})();
