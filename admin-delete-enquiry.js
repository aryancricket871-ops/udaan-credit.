import {json,fail,requireAdmin,body} from "../_lib.js";
export async function onRequestPost({request,env}) {
 const a=await requireAdmin(request,env); if(a.error) return a.error;
 const b=await body(request), id=Number(b?.id);
 if(!Number.isInteger(id)||id<1) return fail("Invalid enquiry ID");
 const r=await env.DB.prepare("DELETE FROM enquiries WHERE id=?").bind(id).run();
 if(!r.meta.changes) return fail("Enquiry not found",404);
 return json({ok:true});
}
