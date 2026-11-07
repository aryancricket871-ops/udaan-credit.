import {json,requireAdmin,clean} from "../_lib.js";
export async function onRequestGet({request,env}) {
 const a=await requireAdmin(request,env,false); if(a.error) return a.error;
 const u=new URL(request.url), q=clean(u.searchParams.get("q"),100), category=clean(u.searchParams.get("category"),80),
 status=clean(u.searchParams.get("status"),20), service=clean(u.searchParams.get("service"),120);
 let sql="SELECT * FROM enquiries WHERE 1=1", args=[];
 if(q){sql+=" AND (full_name LIKE ? OR mobile LIKE ? OR email LIKE ?)";args.push(`%${q}%`,`%${q}%`,`%${q}%`);}
 if(category){sql+=" AND category=?";args.push(category);}
 if(status){sql+=" AND status=?";args.push(status);}
 if(service){sql+=" AND service=?";args.push(service);}
 sql+=" ORDER BY created_at DESC LIMIT 500";
 const rows=await env.DB.prepare(sql).bind(...args).all();
 const stats=await env.DB.prepare("SELECT COUNT(*) total,SUM(CASE WHEN date(created_at)=date('now') THEN 1 ELSE 0 END) today,SUM(CASE WHEN status='New' THEN 1 ELSE 0 END) new,SUM(CASE WHEN status='Contacted' THEN 1 ELSE 0 END) contacted,SUM(CASE WHEN status='Completed' THEN 1 ELSE 0 END) completed FROM enquiries").first();
 return json({ok:true,enquiries:rows.results||[],stats:stats||{}});
}
