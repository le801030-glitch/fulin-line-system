function getCases(){return JSON.parse(localStorage.getItem("fulin_cases")||"[]")}
function saveCases(c){localStorage.setItem("fulin_cases",JSON.stringify(c))}
function esc(s=""){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function daysOld(c){
  const t = new Date(c.createdAt.replace(/\//g,"-"));
  return (Date.now()-t.getTime())/86400000;
}
function renderKpi(cases){
  document.getElementById("kpiAll").textContent=cases.length;
  document.getElementById("kpiDoing").textContent=cases.filter(c=>!["已完成"].includes(c.status)).length;
  document.getElementById("kpiDone").textContent=cases.filter(c=>c.status==="已完成").length;
  document.getElementById("kpiLate").textContent=cases.filter(c=>c.status!=="已完成" && daysOld(c)>7).length;
}
function renderCases(){
  const all=getCases(); renderKpi(all);
  const fs=document.getElementById("filterStatus").value;
  const q=document.getElementById("keyword").value.trim().toLowerCase();
  const rows=all.filter(c=>(!fs||c.status===fs)&&(!q||`${c.id} ${c.location} ${c.description}`.toLowerCase().includes(q)))
  .map(c=>`<tr>
    <td><b>${esc(c.id)}</b><br><span class="note">${esc(c.createdAt)}</span></td>
    <td><span class="tag">${esc(c.category)}</span></td>
    <td><b>${esc(c.location)}</b><br><span class="note">${esc(c.description)}</span></td>
    <td>${esc(c.status)}</td>
    <td>${esc(c.updatedAt)}</td>
    <td><button class="btn soft" onclick="editCase('${esc(c.id)}')">更新</button></td>
  </tr>`).join("");
  document.getElementById("caseRows").innerHTML=rows||`<tr><td colspan="6" class="note">目前沒有符合條件的案件。</td></tr>`;
}
function editCase(id){
  const c=getCases().find(x=>x.id===id); if(!c)return;
  document.getElementById("editId").value=id;
  document.getElementById("editStatus").value=c.status;
  document.getElementById("editNote").value="";
  document.getElementById("editModal").classList.add("show");
}
function closeModal(){document.getElementById("editModal").classList.remove("show")}
function saveUpdate(){
  const id=document.getElementById("editId").value;
  const status=document.getElementById("editStatus").value;
  const note=document.getElementById("editNote").value.trim()||"案件狀態已更新。";
  const cases=getCases(), c=cases.find(x=>x.id===id); if(!c)return;
  const now=new Date().toLocaleString("zh-TW",{hour12:false});
  c.status=status; c.updatedAt=now;
  c.history=c.history||[]; c.history.push({status,time:now,note});
  saveCases(cases); closeModal(); renderCases();
}
renderCases();
