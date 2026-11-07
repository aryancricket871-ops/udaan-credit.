import {requireAdmin,clean} from "../_lib.js";
const csv=v=>`"${String(v??"").replace(/"/g,'""')}"`;
export async function onRequestGet({request,env}) {
 const a=await requireAdmin(request,env,false); if(a.error) return a.error;
 const rows=await env.DB.prepare("SELECT id,full_name,mobile,email,category,service,state,city,message,status,internal_notes,created_at FROM enquiries ORDER BY created_at DESC").all();
 const headers=["ID","Full Name","Mobile","Email","Category","Service","State","City","Message","Status","Internal Notes","Created At"];
 const out=[headers,...(rows.results||[]).map(r=>[r.id,r.full_name,r.mobile,r.email,r.category,r.service,r.state,r.city,r.message,r.status,r.internal_notes,r.created_at])].map(r=>r.map(csv).join(",")).join("\r\n");
 return new Response("\uFEFF"+out,{headers:{"content-type":"text/csv; charset=utf-8","content-disposition":"attachment; filename=udaan-credit-enquiries.csv","cache-control":"no-store"}});
}
