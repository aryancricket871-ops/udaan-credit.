import {json,fail,requireAdmin,body,hashPassword,verifyPassword} from "../_lib.js";
export async function onRequestPost({request,env}) {
 const a=await requireAdmin(request,env); if(a.error) return a.error;
 const b=await body(request), old=String(b?.currentPassword||""), next=String(b?.newPassword||"");
 if(next.length<12) return fail("New password must be at least 12 characters.");
 const u=await env.DB.prepare("SELECT password_hash FROM admin_users WHERE id=?").bind(a.s.admin_id).first();
 if(!u||!(await verifyPassword(old,u.password_hash))) return fail("Current password is incorrect",401);
 await env.DB.prepare("UPDATE admin_users SET password_hash=?,must_change_password=0,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(await hashPassword(next),a.s.admin_id).run();
 return json({ok:true,message:"Password changed successfully."});
}
