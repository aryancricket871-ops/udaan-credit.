PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  must_change_password INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  admin_id INTEGER NOT NULL,
  csrf_token TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON admin_sessions(expires_at);

CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  category TEXT NOT NULL,
  service TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK(status IN ('New','Contacted','Completed')),
  internal_notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_category ON enquiries(category);

CREATE TABLE IF NOT EXISTS website_settings (
  setting_key TEXT PRIMARY KEY,
  setting_value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(category, name)
);

INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Banking','Account Opening','Professional assistance for Account Opening.',0);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Banking','AEPS','Professional assistance for AEPS.',1);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Banking','BC Point','Professional assistance for BC Point.',2);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Insurance','Life Insurance','Professional assistance for Life Insurance.',0);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Insurance','Health Insurance','Professional assistance for Health Insurance.',1);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Insurance','Motor Insurance','Professional assistance for Motor Insurance.',2);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Finance','Home Loan','Professional assistance for Home Loan.',0);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Finance','Loan Against Property','Professional assistance for Loan Against Property.',1);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Finance','Personal Loan','Professional assistance for Personal Loan.',2);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Finance','Business Loan','Professional assistance for Business Loan.',3);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Finance','Credit Card','Professional assistance for Credit Card.',4);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Finance','OD/CC Limit','Professional assistance for OD/CC Limit.',5);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Finance','Vehicle Loan','Professional assistance for Vehicle Loan.',6);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Finance','Car Loan','Professional assistance for Car Loan.',7);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Registration & Taxation','Section 8 NGO','Professional assistance for Section 8 NGO.',0);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Registration & Taxation','Microfinance','Professional assistance for Microfinance.',1);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Registration & Taxation','NBFC Pvt Ltd','Professional assistance for NBFC Pvt Ltd.',2);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Registration & Taxation','LLP Registration','Professional assistance for LLP Registration.',3);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Registration & Taxation','OPC Registration','Professional assistance for OPC Registration.',4);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Registration & Taxation','MSME/Udyam','Professional assistance for MSME/Udyam.',5);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Registration & Taxation','GST','Professional assistance for GST.',6);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Registration & Taxation','ITR','Professional assistance for ITR.',7);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Registration & Taxation','12A','Professional assistance for 12A.',8);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Registration & Taxation','80G','Professional assistance for 80G.',9);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Registration & Taxation','NITI Aayog','Professional assistance for NITI Aayog.',10);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Registration & Taxation','NGO Darpan','Professional assistance for NGO Darpan.',11);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Registration & Taxation','CSR Registration','Professional assistance for CSR Registration.',12);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Registration & Taxation','E-Anudaan','Professional assistance for E-Anudaan.',13);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Registration & Taxation','ISO Certificate','Professional assistance for ISO Certificate.',14);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Real Estate','Property Sale','Professional assistance for Property Sale.',0);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Real Estate','Property Purchase','Professional assistance for Property Purchase.',1);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Real Estate','Property Rent','Professional assistance for Property Rent.',2);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Other Services','CIBIL Improvement Assistance','Professional assistance for CIBIL Improvement Assistance.',0);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Other Services','Job Placement','Professional assistance for Job Placement.',1);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('IT Services','Website Development','Professional assistance for Website Development.',0);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('IT Services','Software Development','Professional assistance for Software Development.',1);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('IT Services','Mobile App Development','Professional assistance for Mobile App Development.',2);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Trade & Investment','Mutual Fund SIP Plans','Professional assistance for Mutual Fund SIP Plans.',0);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Education','NIOS 10th','Professional assistance for NIOS 10th.',0);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Education','NIOS 12th','Professional assistance for NIOS 12th.',1);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Education','BA','Professional assistance for BA.',2);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Education','B.Com','Professional assistance for B.Com.',3);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Education','B.Sc','Professional assistance for B.Sc.',4);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Education','BBA','Professional assistance for BBA.',5);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Education','MA','Professional assistance for MA.',6);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Education','M.Com','Professional assistance for M.Com.',7);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Education','M.Sc','Professional assistance for M.Sc.',8);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Education','MBA','Professional assistance for MBA.',9);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Education','LLB','Professional assistance for LLB.',10);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Education','LLM','Professional assistance for LLM.',11);
INSERT OR IGNORE INTO services(category,name,description,sort_order) VALUES('Advertisement','Business Advertisement Services','Professional assistance for Business Advertisement Services.',0);
INSERT OR IGNORE INTO website_settings(setting_key,setting_value) VALUES('company_name','UDAAN CREDIT');
INSERT OR IGNORE INTO website_settings(setting_key,setting_value) VALUES('website_title','UDAAN CREDIT | Financial & Business Solutions');
INSERT OR IGNORE INTO website_settings(setting_key,setting_value) VALUES('headline','Your Trusted Partner for Financial & Business Solutions');
INSERT OR IGNORE INTO website_settings(setting_key,setting_value) VALUES('homepage_description','Banking, Finance, Insurance, Registration, Education and Digital Services — All Under One Roof.');
INSERT OR IGNORE INTO website_settings(setting_key,setting_value) VALUES('customer_care_number','');
INSERT OR IGNORE INTO website_settings(setting_key,setting_value) VALUES('whatsapp_number','');
INSERT OR IGNORE INTO website_settings(setting_key,setting_value) VALUES('email','');
INSERT OR IGNORE INTO website_settings(setting_key,setting_value) VALUES('address','India');
INSERT OR IGNORE INTO website_settings(setting_key,setting_value) VALUES('logo_url','');
INSERT OR IGNORE INTO website_settings(setting_key,setting_value) VALUES('facebook_url','');
INSERT OR IGNORE INTO website_settings(setting_key,setting_value) VALUES('instagram_url','');
INSERT OR IGNORE INTO website_settings(setting_key,setting_value) VALUES('linkedin_url','');
INSERT OR IGNORE INTO website_settings(setting_key,setting_value) VALUES('youtube_url','');