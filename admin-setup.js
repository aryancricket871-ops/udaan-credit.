import {json,fail,body,clean,hashPassword} from "../_lib.js";
export async function onRequestPost({request,env}) {
  if(!env.BOOTSTRAP_SECRET) return fail("Initial setup is disabled. Configure BOOTSTRAP_SECRET first.",503);
  const b=await body(request);
  if(!b || request.headers.get("X-Setup-Secret")!==env.BOOTSTRAP_SECRET) return fail("Setup authorization failed",403);
  const count=await env.DB.prepare("SELECT COUNT(*) AS n FROM admin_users").first();
  if(count?.n) return fail("Admin setup has already been completed.",409);
  const username=clean(b.username,40), password=String(b.password||"");
  if(!/^[a-zA-Z0-9_.-]{3,40}$/.test(username) || password.length<8) return fail("Use a 3-40 character username and a password of at least 8 characters.");
  const hash=await hashPassword(password);
  await env.DB.prepare("INSERT INTO admin_users(username,password_hash,must_change_password) VALUES(?,?,1)").bind(username,hash).run();
  return json({ok:true,message:"Admin created. Log in and change the initial password immediately."},201);
}
