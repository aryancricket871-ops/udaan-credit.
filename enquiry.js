import {json,fail,body,clean,rateLimit} from "../_lib.js";
export async function onRequestPost({request,env}) {
  const ip=request.headers.get("CF-Connecting-IP")||"unknown";
  try { if(!await rateLimit(env,"enquiry:"+ip,5,600)) return fail("Too many submissions. Please try again later.",429); } catch {}
  const b=await body(request);
  if(!b) return fail("Invalid request");
  const full_name=clean(b.fullName,100), mobile=clean(b.mobile,15), email=clean(b.email,150),
    category=clean(b.category,80), service=clean(b.service,120), state=clean(b.state,80),
    city=clean(b.city,80), message=clean(b.message,2000);
  if(full_name.length<2 || !/^[6-9]\d{9}$/.test(mobile) || !category || !service || !state || !city)
    return fail("Please complete required fields and enter a valid 10-digit Indian mobile number.");
  if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Please enter a valid email.");
  const exists=await env.DB.prepare("SELECT id FROM services WHERE category=? AND name=? AND active=1").bind(category,service).first();
  if(!exists) return fail("Please select a valid active service.");
  await env.DB.prepare("INSERT INTO enquiries(full_name,mobile,email,category,service,state,city,message) VALUES(?,?,?,?,?,?,?,?)")
    .bind(full_name,mobile,email,category,service,state,city,message).run();
  return json({ok:true,message:"Your enquiry has been submitted successfully. Our team will contact you."},201);
}
