const cfg = window.APP_CONFIG || {};
document.getElementById("lineBtn").href = cfg.LINE_OFFICIAL_URL || "#";
document.getElementById("lineBtn2").href = cfg.LINE_OFFICIAL_URL || "#";

function openPanel(id){
  document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
  const el = document.getElementById(id);
  if(el){ el.classList.add("active"); el.scrollIntoView({behavior:"smooth", block:"start"}); }
}

function getCases(){
  return JSON.parse(localStorage.getItem("fulin_cases") || "[]");
}
function saveCases(cases){
  localStorage.setItem("fulin_cases", JSON.stringify(cases));
}
function makeCaseId(){
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  const cases = getCases().filter(x=>x.id.startsWith(`FL-${ymd}`));
  return `FL-${ymd}-${String(cases.length+1).padStart(3,"0")}`;
}
function escapeHtml(s=""){
  return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
}

document.getElementById("reportForm").addEventListener("submit", e=>{
  e.preventDefault();
  const id = makeCaseId();
  const now = new Date().toLocaleString("zh-TW",{hour12:false});
  const c = {
    id,
    category: document.getElementById("category").value,
    location: document.getElementById("location").value.trim(),
    description: document.getElementById("description").value.trim(),
    name: document.getElementById("name").value.trim(),
    contact: document.getElementById("contactValue").value.trim(),
    photoUrl: document.getElementById("photoUrl").value.trim(),
    status: "已收到",
    createdAt: now,
    updatedAt: now,
    history:[
      {status:"已收到", time:now, note:"系統已完成案件登記。"}
    ]
  };
  const cases = getCases();
  cases.unshift(c);
  saveCases(cases);
  document.getElementById("submitResult").innerHTML =
    `<div class="success"><b>案件已建立</b><br>案件編號：<b>${id}</b><br>目前狀態：🔵 已收到<br><br>請保留案件編號，之後可查詢處理進度。</div>`;
  document.getElementById("trackId").value = id;
  e.target.reset();
});

function trackCase(){
  const id = document.getElementById("trackId").value.trim();
  const c = getCases().find(x=>x.id===id);
  const box = document.getElementById("trackResult");
  if(!c){
    box.innerHTML = `<div class="warn">查無此案件。請確認案件編號是否正確。</div>`;
    return;
  }
  const statusIcon = {
    "已收到":"🔵","確認中":"🟡","已通報權責單位":"🟠","處理中":"🟣","已完成":"🟢","待其他單位處理":"🔴"
  }[c.status] || "⚪";
  const hist = c.history.map((h,i)=>`<div class="timeline-item ${i===c.history.length-1?"current":"done"}">
    <b>${escapeHtml(h.status)}</b><br><span class="note">${escapeHtml(h.time)}｜${escapeHtml(h.note||"")}</span>
  </div>`).join("");
  box.innerHTML = `
    <div class="card">
      <div><span class="status">${statusIcon} ${escapeHtml(c.status)}</span></div>
      <h3>${escapeHtml(c.id)}</h3>
      <p><b>分類：</b>${escapeHtml(c.category)}</p>
      <p><b>地點：</b>${escapeHtml(c.location)}</p>
      <p><b>問題：</b>${escapeHtml(c.description)}</p>
      <p><b>最後更新：</b>${escapeHtml(c.updatedAt)}</p>
      <div class="timeline">${hist}</div>
    </div>`;
}

async function initLiff(){
  if(!cfg.LIFF_ID || !window.liff) return;
  try{
    await liff.init({liffId:cfg.LIFF_ID});
    if(liff.isLoggedIn()){
      const p = await liff.getProfile();
      document.getElementById("name").value = p.displayName || "";
    }
  }catch(err){
    console.warn("LIFF init failed", err);
  }
}
initLiff();
