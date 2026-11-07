const json = (data, status=200, headers={}) => new Response(JSON.stringify(data), {
  status, headers: {"content-type":"application/json; charset=utf-8", "cache-control":"no-store", ...headers}
});
const fail = (message, status=400) => json({ok:false,error:message}, status);
const cookie = (name, value, attrs="") => `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict${attrs}`;
const getCookie = (request, name) => {
  const raw = request.headers.get("Cookie") || "";
  const part = raw.split(";").map(x=>x.trim()).find(x=>x.startsWith(name+"="));
  return part ? part.slice(name.length+1) : null;
};
const random = (n=32) => {
  const b = new Uint8Array(n); crypto.getRandomValues(b);
  return [...b].map(x=>x.toString(16).padStart(2,"0")).join("");
};
async function hashPassword(password, salt=random(16)) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({name:"PBKDF2",salt:Uint8Array.from(salt.match(/.{2}/g).map(x=>parseInt(x,16))),iterations:210000,hash:"SHA-256"},material,256);
  return `pbkdf2$210000$${salt}$${[...new Uint8Array(bits)].map(x=>x.toString(16).padStart(2,"0")).join("")}`;
}
async function verifyPassword(password, stored) {
  try {
    const [scheme,iter,salt,expected]=stored.split("$");
    if(scheme!=="pbkdf2") return false;
    const material=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);
    const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:Uint8Array.from(salt.match(/.{2}/g).map(x=>parseInt(x,16))),iterations:Number(iter),hash:"SHA-256"},material,256);
    const actual=[...new Uint8Array(bits)].map(x=>x.toString(16).padStart(2,"0")).join("");
    if(actual.length!==expected.length) return false;
    let diff=0; for(let i=0;i<actual.length;i++) diff|=actual.charCodeAt(i)^expected.charCodeAt(i);
    return diff===0;
  } catch { return false; }
}
async function session(request, env) {
  const sid=getCookie(request,"uc_session");
  if(!sid) return null;
  const row=await env.DB.prepare("SELECT s.id,s.csrf_token,s.expires_at,u.id AS admin_id,u.username,u.must_change_password FROM admin_sessions s JOIN admin_users u ON u.id=s.admin_id WHERE s.id=? AND s.expires_at>?").bind(sid,Math.floor(Date.now()/1000)).first();
  return row || null;
}
async function requireAdmin(request, env, checkCsrf=true) {
  const s=await session(request,env);
  if(!s) return {error:fail("Authentication required",401)};
  if(checkCsrf && !["GET","HEAD","OPTIONS"].includes(request.method) && request.headers.get("X-CSRF-Token")!==s.csrf_token)
    return {error:fail("Invalid CSRF token",403)};
  return {s};
}
async function body(request) {
  const ct=request.headers.get("content-type")||"";
  if(!ct.includes("application/json")) return null;
  try { return await request.json(); } catch { return null; }
}
const clean=(v,max=500)=>String(v??"").trim().slice(0,max);
async function rateLimit(env,key,limit=8,window=600) {
  // D1-backed fixed window counter; table is created in migration 0002.
  const now=Math.floor(Date.now()/1000), bucket=Math.floor(now/window);
  await env.DB.prepare("INSERT INTO rate_limits(k,bucket,hits) VALUES(?,?,1) ON CONFLICT(k,bucket) DO UPDATE SET hits=hits+1").bind(key,bucket).run();
  const row=await env.DB.prepare("SELECT hits FROM rate_limits WHERE k=? AND bucket=?").bind(key,bucket).first();
  return (row?.hits||0)<=limit;
}
export {json,fail,cookie,getCookie,random,hashPassword,verifyPassword,session,requireAdmin,body,clean,rateLimit};
