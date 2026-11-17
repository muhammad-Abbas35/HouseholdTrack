const starterData = [
 {id:"H-1025",head:"Ahmed Khan",area:"Gulshan",members:7,children:3,date:"14 Nov 2026",status:"Verified"},
 {id:"H-1024",head:"Sara Ahmed",area:"North Nazimabad",members:5,children:2,date:"13 Nov 2026",status:"Verified"},
 {id:"H-1023",head:"Imran Ali",area:"Clifton",members:6,children:2,date:"12 Nov 2026",status:"Pending"},
 {id:"H-1022",head:"Nadia Hussain",area:"Malir",members:4,children:1,date:"11 Nov 2026",status:"Needs review"},
 {id:"H-1021",head:"Bilal Sheikh",area:"Gulshan",members:8,children:4,date:"10 Nov 2026",status:"Verified"},
 {id:"H-1020",head:"Ayesha Malik",area:"Clifton",members:3,children:1,date:"09 Nov 2026",status:"Verified"},
 {id:"H-1019",head:"Usman Raza",area:"Malir",members:6,children:2,date:"08 Nov 2026",status:"Pending"},
 {id:"H-1018",head:"Farah Iqbal",area:"North Nazimabad",members:5,children:2,date:"07 Nov 2026",status:"Verified"}
];
let households = JSON.parse(localStorage.getItem("ht-households") || "null") || starterData;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const save = () => localStorage.setItem("ht-households", JSON.stringify(households));
const badge = status => `<span class="status ${status.replaceAll(" ","-")}">${status}</span>`;
function renderRows(list, target, recent=false){
  const rows = list.map(h => `<tr><td class="id-cell">${h.id}</td>${recent?"":`<td>${h.head}</td>`}<td>${h.area}</td><td>${h.members}</td><td>${h.children}</td><td>${h.date}</td><td>${badge(h.status)}</td>${recent?"":`<td><button class="btn btn-sm btn-light" onclick="editHousehold('${h.id}')" title="Update record"><i class="bi bi-pencil"></i></button></td>`}</tr>`).join("");
  $(target).innerHTML = rows || `<tr><td colspan="8" class="text-center py-4 text-muted">No matching household records found.</td></tr>`;
}
function render(){
  renderRows(households,"#householdRows");
  renderRows(households.slice(0,5),"#recentRows",true);
  $("#recordCount").textContent = `Showing ${households.length} household records`;
  $("#totalHouseholds").textContent = (1248 + households.length - starterData.length).toLocaleString();
  $("#totalPeople").textContent = (6482 + households.reduce((s,h)=>s+h.members,0) - starterData.reduce((s,h)=>s+h.members,0)).toLocaleString();
  $("#totalChildren").textContent = (2106 + households.reduce((s,h)=>s+h.children,0) - starterData.reduce((s,h)=>s+h.children,0)).toLocaleString();
  $("#reviewCount").textContent = 86 + households.filter(h=>h.status==="Needs review").length - starterData.filter(h=>h.status==="Needs review").length;
  const areas=["Gulshan","North Nazimabad","Clifton","Malir"], vals=[420,315,278,235];
  $("#areaBars").innerHTML=areas.map((a,i)=>`<div class="area-row"><span>${a}</span><div class="bar-track"><div class="bar-fill" style="width:${vals[i]/420*100}%"></div></div><strong>${vals[i]}</strong></div>`).join("");
}
function filterRows(){
 const q=$("#searchInput").value.toLowerCase(), area=$("#areaFilter").value, status=$("#statusFilter").value;
 renderRows(households.filter(h=>(`${h.id} ${h.head} ${h.area}`.toLowerCase().includes(q))&&(!area||h.area===area)&&(!status||h.status===status)),"#householdRows");
 $("#recordCount").textContent=`Showing ${households.filter(h=>(`${h.id} ${h.head} ${h.area}`.toLowerCase().includes(q))&&(!area||h.area===area)&&(!status||h.status===status)).length} matching records`;
}
function showToast(msg){$("#toastText").textContent=msg;bootstrap.Toast.getOrCreateInstance($("#appToast")).show();}
function navigate(view){
 $$(".view").forEach(v=>v.classList.toggle("active",v.id===`view-${view}`));
 $$(".side-nav .nav-link").forEach(a=>a.classList.toggle("active",a.dataset.view===view));
 const names={dashboard:"Dashboard",households:"Household records",campaigns:"Survey campaigns",reports:"Reports & analytics"};
 $("#pageCrumb").textContent=names[view]||"Dashboard";
 $("#sidebar").classList.remove("open");
}
$$("[data-view]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();navigate(el.dataset.view)}));
$$("[data-action='add']").forEach(el=>el.addEventListener("click",()=>openAdd()));
$("#menuBtn").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
["#searchInput","#areaFilter","#statusFilter"].forEach(s=>$(s).addEventListener("input",filterRows));
const modal = new bootstrap.Modal($("#householdModal"));
function openAdd(){ $("#householdForm").reset(); $("#houseId").disabled=false; $("#householdModal .modal-title").textContent="Add household"; $("#householdForm").dataset.edit=""; modal.show(); }
window.editHousehold = id => {
 const h=households.find(x=>x.id===id); if(!h)return;
 $("#householdForm").reset(); $("#houseId").value=h.id; $("#houseId").disabled=true;
 $("#houseArea").value=h.area; $("#houseHead").value=h.head; $("#houseMembers").value=h.members; $("#houseChildren").value=h.children; $("#houseStatus").value=h.status;
 $("#householdModal .modal-title").textContent="Update household"; $("#householdForm").dataset.edit=id; modal.show();
};
$("#householdForm").addEventListener("submit",e=>{
 e.preventDefault();
 const id=$("#houseId").value.trim();
 const record={id,area:$("#houseArea").value,head:$("#houseHead").value.trim(),members:+$("#houseMembers").value,children:+$("#houseChildren").value,date:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),status:$("#houseStatus").value};
 if(record.children>record.members){showToast("Children cannot exceed total family members.");return;}
 const edit=e.currentTarget.dataset.edit;
 if(edit){households=households.map(h=>h.id===edit?record:h);showToast("Household record updated.");}
 else {if(households.some(h=>h.id===id)){showToast("This Household ID already exists.");return;}households.unshift(record);showToast("New household added.");}
 save();render();filterRows();modal.hide();
});
$("#newCampaign").addEventListener("click",()=>showToast("Demo: campaign creation workflow can be added in the next version."));
$("#exportBtn").addEventListener("click",()=>{
 const headers=["Household ID","Head of Family","Area","Family Members","Children","Last Survey","Status"];
 const lines=[headers,...households.map(h=>[h.id,h.head,h.area,h.members,h.children,h.date,h.status])].map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
 const blob=new Blob([lines],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="household-records-demo.csv";a.click();URL.revokeObjectURL(url);showToast("CSV report exported.");
});
render();
