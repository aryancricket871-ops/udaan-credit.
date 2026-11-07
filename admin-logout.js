import {json,requireAdmin} from "../_lib.js";
export async function onRequestPost({request,env}) {
 const a=await requireAdmin(request,env); if(a.error) return a.error;
 await env.DB.prepare("DELETE FROM admin_sessions WHERE id=?").bind(a.s.id).run();
 return json({ok:true},200,{"Set-Cookie":"uc_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"});
}
