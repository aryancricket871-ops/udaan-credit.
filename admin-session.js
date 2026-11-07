import {json,requireAdmin} from "../_lib.js";
export async function onRequestGet({request,env}) {
 const a=await requireAdmin(request,env,false); if(a.error) return a.error;
 return json({ok:true,username:a.s.username,mustChangePassword:!!a.s.must_change_password,csrfToken:a.s.csrf_token});
}
