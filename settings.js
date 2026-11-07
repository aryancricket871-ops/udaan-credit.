import {json} from "../_lib.js";
export async function onRequestGet({env}) {
  const rows=await env.DB.prepare("SELECT setting_key,setting_value FROM website_settings").all();
  const settings=Object.fromEntries((rows.results||[]).map(r=>[r.setting_key,r.setting_value]));
  const services=await env.DB.prepare("SELECT category,name,description FROM services WHERE active=1 ORDER BY category,sort_order,name").all();
  return json({ok:true,settings,services:services.results||[]});
}
