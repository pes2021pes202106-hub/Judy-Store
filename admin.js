const ADMIN_PASSWORD="golden-2026";
const defaultMoments=[
{id:1,title:"ليلة هادئة",description:"صورة تجريبية يمكنك استبدالها من الإدارة.",image:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=80"},
{id:2,title:"تفاصيل صغيرة",description:"لقطة مناسبة لبداية معرض اللحظات.",image:"https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80"},
{id:3,title:"بعد الغروب",description:"مشهد تجريبي للحفاظ على شكل الموقع.",image:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80"}];
const defaultDesigns=[
{id:1,title:"بوستر سينمائي",description:"تصميم تجريبي للمعرض.",image:"https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=80"},
{id:2,title:"هوية بصرية",description:"مساحة جاهزة لإضافة أعمالك.",image:"https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1000&q=80"}];
const defaultQuiz=[
{q:"أي قسم يعرض الصور التي تضيفها الإدارة؟",a:["اللحظات","التعليقات","الإعدادات","المسابقة"],correct:0},
{q:"ما الذي يمكن للزائر فعله في قسم التصميم؟",a:["استكشاف الأعمال","تعديل الموقع","تغيير كلمة المرور","إدارة الصور"],correct:0}];
const get=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const readFile=file=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)});
function login(){
 const form=document.querySelector("#login-form"),err=document.querySelector("#login-error");
 form.addEventListener("submit",e=>{e.preventDefault();if(document.querySelector("#password").value===ADMIN_PASSWORD){
   sessionStorage.setItem("adminLogged","1");showDashboard();
 }else err.textContent="كلمة المرور غير صحيحة.";});
}
function showDashboard(){document.querySelector("#login").hidden=true;document.querySelector("#dashboard").hidden=false;renderAll()}
function renderAll(){renderItems("moments",defaultMoments,"admin-moments","اللحظة");renderItems("designs",defaultDesigns,"admin-designs","التصميم");renderQuiz();renderComments()}
function renderItems(key,defaults,target,label){
 const list=document.querySelector("#"+target),items=get(key,defaults);
 list.innerHTML=items.map(x=>`<div class="admin-item"><div><strong>${esc(x.title)}</strong><br><small>${esc(x.description||"")}</small></div><button class="delete" data-key="${key}" data-id="${x.id}">حذف</button></div>`).join("")||"<p>لا توجد عناصر.</p>";
 list.querySelectorAll(".delete").forEach(b=>b.onclick=()=>{const arr=get(key,defaults).filter(x=>String(x.id)!==String(b.dataset.id));set(key,arr);renderAll()});
}
function renderQuiz(){
 const list=document.querySelector("#admin-quiz"),items=get("quiz",defaultQuiz);
 list.innerHTML=items.map((x,i)=>`<div class="admin-item"><div><strong>${i+1}. ${esc(x.q)}</strong><br><small>الإجابة الصحيحة: ${esc(x.a[x.correct])}</small></div><button class="delete" data-i="${i}">حذف</button></div>`).join("");
 list.querySelectorAll(".delete").forEach(b=>b.onclick=()=>{const arr=get("quiz",defaultQuiz);arr.splice(Number(b.dataset.i),1);set("quiz",arr);renderAll()});
}
function renderComments(){
 const list=document.querySelector("#admin-comments"),items=get("comments",[]);
 list.innerHTML=items.length?items.map(x=>`<div class="admin-item"><div><strong>${esc(x.name)}</strong><br><small>${esc(x.text)} · ${esc(x.date)}</small></div><button class="delete" data-id="${x.id}">حذف</button></div>`).join(""):"<p>لا توجد تعليقات.</p>";
 list.querySelectorAll(".delete").forEach(b=>b.onclick=()=>{set("comments",get("comments",[]).filter(x=>String(x.id)!==String(b.dataset.id)));renderComments()});
}
async function setupForms(){
 document.querySelector("#moment-form").onsubmit=async e=>{e.preventDefault();const f=document.querySelector("#moment-file").files[0];if(!f)return;
 const arr=get("moments",defaultMoments);arr.unshift({id:Date.now(),title:document.querySelector("#moment-title").value,description:document.querySelector("#moment-desc").value,image:await readFile(f)});set("moments",arr);e.target.reset();renderAll()};
 document.querySelector("#design-form").onsubmit=async e=>{e.preventDefault();const f=document.querySelector("#design-file").files[0];if(!f)return;
 const arr=get("designs",defaultDesigns);arr.unshift({id:Date.now(),title:document.querySelector("#design-title").value,description:document.querySelector("#design-desc").value,image:await readFile(f)});set("designs",arr);e.target.reset();renderAll()};
 document.querySelector("#quiz-form").onsubmit=e=>{e.preventDefault();const arr=get("quiz",defaultQuiz);arr.push({q:document.querySelector("#quiz-q").value,a:[0,1,2,3].map(i=>document.querySelector("#q-a"+i).value),correct:Number(document.querySelector("#q-correct").value)-1});set("quiz",arr);e.target.reset();renderAll()};
}
function tabs(){
 document.querySelectorAll(".tab").forEach(tab=>tab.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));tab.classList.add("active");document.querySelectorAll(".panel").forEach(p=>p.hidden=true);document.querySelector("#tab-"+tab.dataset.tab).hidden=false});
}
document.querySelector("#logout").onclick=()=>{sessionStorage.removeItem("adminLogged");location.reload()};
login();tabs();setupForms();if(sessionStorage.getItem("adminLogged")==="1")showDashboard();
