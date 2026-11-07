import {json,fail,requireAdmin,body,clean} from "../_lib.js";
export async function onRequestGet({request,env}) {
 const a=await requireAdmin(request,env,false); if(a.error) return a.error;
 const rows=await env.DB.prepare("SELECT setting_key,setting_value FROM website_settings").all();
 const services=await env.DB.prepare("SELECT * FROM services ORDER BY category,sort_order,name").all();
 return json({ok:true,settings:Object.fromEntries((rows.results||[]).map(x=>[x.setting_key,x.setting_value])),services:services.results||[]});
}
export async function onRequestPost({request,env}) {
 const a=await requireAdmin(request,env); if(a.error) return a.error;
 const b=await body(request); if(!b) return fail("Invalid request");
 const allowed=["company_name","website_title","headline","homepage_description","customer_care_number","whatsapp_number","email","address","logo_url","facebook_url","instagram_url","linkedin_url","youtube_url"];
 for(const k of allowed) if(k in (b.settings||{})) {
  const v=clean(b.settings[k], k==="homepage_description"?1000:500);
  await env.DB.prepare("INSERT INTO website_settings(setting_key,setting_value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(setting_key) DO UPDATE SET setting_value=excluded.setting_value,updated_at=CURRENT_TIMESTAMP").bind(k,v).run();
 }
 if(Array.isArray(b.services)) {
  for(const s of b.services.slice(0,150)) {
   const id=Number(s.id), category=clean(s.category,80), name=clean(s.name,120), description=clean(s.description,500), active=s.active?1:0;
   if(!category||!name) continue;
   if(id>0) await env.DB.prepare("UPDATE services SET category=?,name=?,description=?,active=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(category,name,description,active,id).run();
   else await env.DB.prepare("INSERT OR IGNORE INTO services(category,name,description,active) VALUES(?,?,?,?)").bind(category,name,description,active).run();
  }
 }
 if(Array.isArray(b.deleteServiceIds)) for(const id of b.deleteServiceIds.slice(0,100)) await env.DB.prepare("DELETE FROM services WHERE id=?").bind(Number(id)).run();
 return json({ok:true});
}
