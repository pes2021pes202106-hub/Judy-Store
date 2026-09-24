const defaultMoments = [
  {id:1,title:"ليلة هادئة",description:"صورة تجريبية يمكنك استبدالها من الإدارة.",image:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=80"},
  {id:2,title:"تفاصيل صغيرة",description:"لقطة مناسبة لبداية معرض اللحظات.",image:"https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80"},
  {id:3,title:"بعد الغروب",description:"مشهد تجريبي للحفاظ على شكل الموقع.",image:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80"}
];
const defaultDesigns = [
  {id:1,title:"بوستر سينمائي",description:"تصميم تجريبي للمعرض.",image:"https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=80"},
  {id:2,title:"هوية بصرية",description:"مساحة جاهزة لإضافة أعمالك.",image:"https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1000&q=80"}
];
const defaultQuiz = [
  {q:"أي قسم يعرض الصور التي تضيفها الإدارة؟",a:["اللحظات","التعليقات","الإعدادات","المسابقة"],correct:0},
  {q:"ما الذي يمكن للزائر فعله في قسم التصميم؟",a:["استكشاف الأعمال","تعديل الموقع","تغيير كلمة المرور","إدارة الصور"],correct:0}
];

const get = (key, fallback) => {
  try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
  catch { return fallback; }
};
const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));

function renderMoments(){
  const grid=document.querySelector("#moments-grid"); if(!grid)return;
  const items=get("moments",defaultMoments);
  grid.innerHTML=items.length?items.map(x=>`
    <article class="moment-card">
      <button data-image="${escapeAttr(x.image)}" data-caption="${escapeAttr(x.title)}">
        <img src="${escapeAttr(x.image)}" alt="${escapeAttr(x.title)}" loading="lazy">
        <div class="moment-info"><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.description||"")}</p></div>
      </button>
    </article>`).join(""):`<div class="empty">لا توجد لحظات بعد.</div>`;
  grid.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.image,b.dataset.caption)));
}
function renderDesigns(){
  const grid=document.querySelector("#designs-grid"); if(!grid)return;
  const items=get("designs",defaultDesigns);
  grid.innerHTML=items.length?items.map(x=>`
    <article class="design-card">
      <img src="${escapeAttr(x.image)}" alt="${escapeAttr(x.title)}" loading="lazy">
      <div class="design-info"><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.description||"")}</p></div>
    </article>`).join(""):`<div class="empty">لا توجد تصميمات بعد.</div>`;
}
function renderComments(){
  const list=document.querySelector("#comments-list"); if(!list)return;
  const items=get("comments",[]);
  list.innerHTML=items.length?items.map(x=>`
    <article class="comment">
      <header><strong>${escapeHtml(x.name)}</strong><time>${escapeHtml(x.date)}</time></header>
      <p>${escapeHtml(x.text)}</p>
    </article>`).join(""):`<div class="empty">كن أول من يكتب تعليقًا.</div>`;
}
function setupComments(){
  const form=document.querySelector("#comment-form"); if(!form)return;
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const name=document.querySelector("#comment-name").value.trim();
    const text=document.querySelector("#comment-text").value.trim();
    if(!name||!text)return;
    const items=get("comments",[]);
    items.unshift({id:Date.now(),name,text,date:new Date().toLocaleDateString("ar-EG")});
    set("comments",items); form.reset(); renderComments();
  });
}
function setupQuiz(){
  const count=document.querySelector("#question-count"), text=document.querySelector("#question-text"), answers=document.querySelector("#answers"), feedback=document.querySelector("#quiz-feedback"), next=document.querySelector("#next-question");
  if(!count)return;
  const quiz=get("quiz",defaultQuiz); let index=0;
  function show(){
    const item=quiz[index]; count.textContent=`السؤال ${index+1} من ${quiz.length}`; text.textContent=item.q;
    answers.innerHTML=item.a.map((a,i)=>`<button class="answer" data-i="${i}">${escapeHtml(a)}</button>`).join("");
    feedback.textContent=""; next.classList.add("hidden");
    answers.querySelectorAll(".answer").forEach(btn=>btn.addEventListener("click",()=>{
      answers.querySelectorAll(".answer").forEach(b=>b.disabled=true);
      const i=Number(btn.dataset.i);
      if(i===item.correct){btn.classList.add("correct");feedback.textContent="إجابة صحيحة."}
      else{btn.classList.add("wrong");answers.querySelector(`[data-i="${item.correct}"]`).classList.add("correct");feedback.textContent="الإجابة الصحيحة موضحة أمامك."}
      if(index<quiz.length-1)next.classList.remove("hidden");
      else feedback.textContent += " انتهت المسابقة.";
    }));
  }
  next.addEventListener("click",()=>{index++;show()}); show();
}
function openModal(src,caption){
  const modal=document.querySelector("#image-modal"); if(!modal)return;
  document.querySelector("#modal-image").src=src; document.querySelector("#modal-image").alt=caption;
  document.querySelector("#modal-caption").textContent=caption; modal.hidden=false;
}
function setupModal(){
  const modal=document.querySelector("#image-modal");
  if(!modal)return;
  modal.addEventListener("click",e=>{if(e.target===modal||e.target.classList.contains("modal-close"))modal.hidden=true});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")modal.hidden=true});
}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function escapeAttr(s){return escapeHtml(s)}
renderMoments();renderDesigns();renderComments();setupComments();setupQuiz();setupModal();
if(window.lucide)lucide.createIcons();
