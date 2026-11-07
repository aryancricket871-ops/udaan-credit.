export async function onRequest({request}) {
 const url=new URL(request.url);
 if(url.pathname==="/admin" || url.pathname==="/admin/") return Response.redirect(new URL("/admin.html",url),302);
 return new Response("Not found",{status:404});
}
