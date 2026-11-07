import {json,fail,body,clean,verifyPassword,random,cookie,rateLimit} from "../_lib.js";
export async function onRequestPost({request,env}) {
  const ip=request.headers.get("CF-Connecting-IP")||"unknown";
  try { if(!await rateLimit(env,"login:"+ip,6,900)) return fail("Too many login attempts. Try again later.",429); } catch {}
  const b=await body(request); if(!b) return fail("Invalid request");
  const username=clean(b.username,40), password=String(b.password||"");
  const user=await env.DB.prepare("SELECT * FROM admin_users WHERE username=?").bind(username).first();
  if(!user || !(await verifyPassword(password,user.password_hash))) return fail("Invalid username or password",401);
  const sid=random(32), csrf=random(24), ttl=Math.max(1,Math.min(72,Number(env.SESSION_TTL_HOURS)||24));
  await env.DB.prepare("INSERT INTO admin_sessions(id,admin_id,csrf_token,expires_at) VALUES(?,?,?,?)")
    .bind(sid,user.id,csrf,Math.floor(Date.now()/1000)+ttl*3600).run();
  return json({ok:true,csrfToken:csrf,username:user.username,mustChangePassword:!!user.must_change_password},
    200,{"Set-Cookie":cookie("uc_session",sid,`; Max-Age=${ttl*3600}`)});
}
