const menuBtn=document.querySelector('.menu-btn');const links=document.querySelector('.links');if(menuBtn&&links){menuBtn.addEventListener('click',()=>{const open=links.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});}
const milestones=[
  {date:'2026-05-10',label:'Call advertised'},
  {date:'2026-06-10',label:'Submission deadline'},
  {date:'2026-06-20',label:'Document check notice'},
  {date:'2026-06-28',label:'Correction window closes'},
  {date:'2026-07-12',label:'Pre-review merit list'},
  {date:'2026-07-24',label:'External review outcome'},
  {date:'2026-08-05',label:'Final selection list'}
];
function fmt(d){return new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric'}).format(d)}
function daysBetween(a,b){return Math.round((b-a)/(1000*60*60*24))}
function initTimeline(){const rail=document.querySelector('[data-timeline]');if(!rail)return;const start=new Date(milestones[0].date+'T00:00:00');const end=new Date(milestones[milestones.length-1].date+'T00:00:00');const today=new Date();today.setHours(0,0,0,0);const total=Math.max(1,daysBetween(start,end));let pct=(daysBetween(start,today)/total)*100;pct=Math.max(0,Math.min(100,pct));const fill=rail.querySelector('.rail-fill');const marker=rail.querySelector('.today-marker');if(fill)fill.style.width=pct+'%';if(marker){marker.style.left=pct+'%';marker.querySelector('span').textContent='Today: '+fmt(today);}const status=document.querySelector('[data-status-summary]');const next=milestones.find(m=>new Date(m.date+'T00:00:00')>=today);if(status){if(today<start)status.textContent='The call has not opened yet.';else if(today>end)status.textContent='The published call window has completed.';else status.textContent=next?`Next step: ${next.label} on ${fmt(new Date(next.date+'T00:00:00'))}.`:'Final stage reached.'}document.querySelectorAll('[data-ms-date]').forEach(el=>{const d=new Date(el.dataset.msDate+'T00:00:00');const item=el.closest('.milestone');const pill=item.querySelector('.status-pill');if(today>d){item.classList.add('done');pill.textContent='Done';pill.classList.add('done')}else if(daysBetween(today,d)<=7&&daysBetween(today,d)>=0){item.classList.add('current');pill.textContent='Next';pill.classList.add('current')}else{pill.textContent='Pending'}})}
initTimeline();
const tabs=document.querySelectorAll('.tab[data-filter]');tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));tab.classList.add('active');const f=tab.dataset.filter;document.querySelectorAll('.resource-card').forEach(card=>{card.style.display=(f==='all'||card.dataset.type===f)?'block':'none';});}));
const search=document.querySelector('[data-search]');if(search){search.addEventListener('input',()=>{const q=search.value.toLowerCase();document.querySelectorAll('[data-search-item]').forEach(el=>{el.style.display=el.textContent.toLowerCase().includes(q)?'block':'none';});});}
const appForm=document.querySelector('#application-form');if(appForm){appForm.addEventListener('submit',e=>{e.preventDefault();const msg=document.querySelector('#form-message');if(msg){msg.textContent='Draft saved locally. In production this action would submit through the HEC research portal workflow.';msg.hidden=false;}appForm.reset();});}
