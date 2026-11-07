import {json,fail,requireAdmin,body,clean} from "../_lib.js";
export async function onRequestPost({request,env}) {
 const a=await requireAdmin(request,env); if(a.error) return a.error;
 const b=await body(request), username=clean(b?.username,40);
 if(!/^[a-zA-Z0-9_.-]{3,40}$/.test(username)) return fail("Username must be 3-40 letters, numbers, dots, dashes or underscores.");
 try { await env.DB.prepare("UPDATE admin_users SET username=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(username,a.s.admin_id).run(); }
 catch { return fail("That username is already in use.",409); }
 return json({ok:true,username});
}
