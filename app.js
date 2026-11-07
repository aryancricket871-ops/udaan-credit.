const $=s=>document.querySelector(s);
let siteSettings={}, serviceData=[];
const icons={"Banking":"▣","Insurance":"◇","Finance":"↗","Registration & Taxation":"▤","Real Estate":"⌂","Other Services":"✦","IT Services":"⌘","Trade & Investment":"◈","Education":"▥","Advertisement":"◎"};
const descriptions={"Banking":"Accessible banking and assisted digital banking services.","Insurance":"Protection solutions for you, your family and your assets.","Finance":"Explore finance options for personal and business goals.","Registration & Taxation":"Registration, compliance and documentation assistance.","Real Estate":"Support for property sale, purchase and rental needs.","Other Services":"Guidance for credit profile and career opportunities.","IT Services":"Digital products and technology services for your business.","Trade & Investment":"Investment-related services and long-term planning support.","Education":"Education programme and course-related assistance.","Advertisement":"Promote your brand with focused business advertising."};
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderServices(){
 const groups=[...new Set(serviceData.map(s=>s.category))];
 $("#service-grid").innerHTML=groups.map(cat=>`<article class="service-card"><div class="service-icon">${icons[cat]||"✦"}</div><h3>${esc(cat)}</h3><p>${esc(descriptions[cat]||"Professional support for your needs.")}</p><a href="#enquiry" data-category="${esc(cat)}">Explore services ↗</a></article>`).join("");
 $("#category").innerHTML='<option value="">Select category</option>'+groups.map(c=>`<option>${esc(c)}</option>`).join("");
 $("#service-grid").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{ $("#category").value=a.dataset.category; updateServices(); }));
}
function updateServices(){const cat=$("#category").value;const list=serviceData.filter(s=>s.category===cat);$("#service").disabled=!cat;$("#service").innerHTML=cat?'<option value="">Select specific service</option>'+list.map(s=>`<option>${esc(s.name)}</option>`).join(""):'<option value="">Select category first</option>';}
async function loadSettings(){
 try{const r=await fetch("/api/settings");const d=await r.json();if(!d.ok)throw 0;siteSettings=d.settings||{};serviceData=d.services||[];renderServices();
 const s=siteSettings;document.title=s.website_title||"UDAAN CREDIT";
 $("#brand-name").textContent=s.company_name||"UDAAN CREDIT";$("#hero-headline").textContent=s.headline||"Your Trusted Partner for Financial & Business Solutions";
 $("#hero-description").textContent=s.homepage_description||"Banking, Finance, Insurance, Registration, Education and Digital Services — All Under One Roof.";
 $("#phone-display").textContent=s.customer_care_number||"Add your customer care number";$("#email-display").textContent=s.email||"Add your email address";$("#address-display").textContent=s.address||"India";
 $("#top-contact").textContent=s.customer_care_number?"Call us: "+s.customer_care_number:"Serving clients across India";
 const wa=(s.whatsapp_number||"").replace(/\D/g,"");if(wa){$("#whatsapp-float").href=`https://wa.me/${wa}?text=${encodeURIComponent("Hello UDAAN CREDIT, I would like to know more about your services.")}`;}else{$("#whatsapp-float").style.display="none";}
 }catch(e){$("#service-grid").innerHTML="<p>Services are temporarily unavailable. Please refresh the page.</p>";}
}
$("#category").addEventListener("change",updateServices);
$("#menu-toggle").addEventListener("click",()=>$("#nav").classList.toggle("open"));
$("#nav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>$("#nav").classList.remove("open")));
$("#enquiry-form").addEventListener("submit",async e=>{
 e.preventDefault();const form=e.currentTarget, status=$("#form-status"), btn=form.querySelector("button");
 if(!form.reportValidity())return;
 const data=Object.fromEntries(new FormData(form).entries());data.mobile=data.mobile.replace(/\D/g,"");
 btn.disabled=true;btn.textContent="Submitting…";status.textContent="";
 try{const r=await fetch("/api/enquiry",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const d=await r.json();if(!r.ok||!d.ok)throw new Error(d.error||"Submission failed");
 status.className="form-status success";status.textContent=d.message;form.reset();updateServices();
 }catch(err){status.className="form-status error";status.textContent=err.message||"Could not submit. Please try again.";}
 finally{btn.disabled=false;btn.innerHTML='Submit Enquiry <span>↗</span>';}
});
$("#year").textContent=new Date().getFullYear();loadSettings();
