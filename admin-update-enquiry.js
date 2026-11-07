import {json,fail,requireAdmin,body,clean} from "../_lib.js";
export async function onRequestPost({request,env}) {
 const a=await requireAdmin(request,env); if(a.error) return a.error;
 const b=await body(request); const id=Number(b?.id), status=clean(b?.status,20), notes=clean(b?.internalNotes,4000);
 if(!Number.isInteger(id)||id<1||!["New","Contacted","Completed"].includes(status)) return fail("Invalid enquiry update");
 const r=await env.DB.prepare("UPDATE enquiries SET status=?,internal_notes=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(status,notes,id).run();
 if(!r.meta.changes) return fail("Enquiry not found",404);
 return json({ok:true});
}
