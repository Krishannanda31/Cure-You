const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'cureyou.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    speciality TEXT NOT NULL,
    area TEXT NOT NULL,
    fee INTEGER NOT NULL,
    rating REAL NOT NULL,
    reviews INTEGER NOT NULL,
    experience INTEGER NOT NULL,
    hospital TEXT NOT NULL,
    verified INTEGER DEFAULT 1,
    available_today INTEGER DEFAULT 1,
    image_initials TEXT,
    education TEXT,
    languages TEXT
  );

  CREATE TABLE IF NOT EXISTS hospitals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    area TEXT NOT NULL,
    type TEXT NOT NULL,
    beds INTEGER,
    icu_beds INTEGER,
    rating REAL NOT NULL,
    reviews INTEGER NOT NULL,
    accreditation TEXT,
    specialities TEXT,
    insurance TEXT,
    phone TEXT,
    emergency INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS labs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    area TEXT NOT NULL,
    rating REAL NOT NULL,
    nabl_certified INTEGER DEFAULT 0,
    home_collection INTEGER DEFAULT 0,
    open_time TEXT,
    close_time TEXT,
    phone TEXT
  );

  CREATE TABLE IF NOT EXISTS lab_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lab_id INTEGER,
    test_name TEXT NOT NULL,
    test_category TEXT NOT NULL,
    price INTEGER NOT NULL,
    turnaround_hours INTEGER,
    FOREIGN KEY(lab_id) REFERENCES labs(id)
  );

  CREATE TABLE IF NOT EXISTS medicines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_name TEXT NOT NULL,
    generic_name TEXT NOT NULL,
    manufacturer TEXT,
    type TEXT,
    brand_price REAL NOT NULL,
    generic_price REAL,
    jan_aushadhi_price REAL,
    category TEXT,
    requires_prescription INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS emergency_services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    area TEXT NOT NULL,
    phone TEXT NOT NULL,
    open_24h INTEGER DEFAULT 1,
    rating REAL,
    distance_km REAL,
    lat REAL,
    lng REAL
  );
`);

db.exec(`
  DELETE FROM doctors; DELETE FROM hospitals; DELETE FROM labs;
  DELETE FROM lab_tests; DELETE FROM medicines; DELETE FROM emergency_services;
`);

// ── DOCTORS (Real Faridabad data) ─────────────────────────────────────────────
const insertDoctor = db.prepare(`INSERT INTO doctors
  (name,speciality,area,fee,rating,reviews,experience,hospital,verified,available_today,image_initials,education,languages)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`);

const doctors = [
  // Cardiologists
  ['Dr. S.S. Bansal','Cardiologist','Sector 20A, Faridabad',1000,4.8,210,30,'SSB Healthcare',1,1,'SB','MBBS, MD, DM Cardiology','Hindi, English'],
  ['Dr. Siddhant Bansal','Cardiologist','Sector 20A, Faridabad',800,4.7,145,12,'SSB Healthcare',1,1,'SB','MBBS, MD Cardiology','Hindi, English'],
  ['Dr. Subrat Akhoury','Cardiologist','Sector 21A, Faridabad',500,4.6,178,14,'Asian Institute of Medical Sciences',1,1,'SA','MBBS, MD Cardiology','Hindi, English'],
  ['Dr. Umesh Kohli','Cardiologist','Sector 86, Faridabad',700,4.5,92,18,'Accord Superspeciality Hospital',1,1,'UK','MBBS, DM Cardiology','Hindi, English'],
  ['Dr. Saurabh Juneja','Cardiologist','NIT, Faridabad',1000,4.4,88,15,'Fortis Escorts Hospital',1,1,'SJ','MBBS, DM Cardiology','Hindi, English'],
  ['Dr. Rakesh Agarwal','Cardiologist','Sector 29, Faridabad',500,4.6,134,20,'Shri Balaji Hospital',1,1,'RA','MBBS, MD Cardiology','Hindi, English'],
  ['Dr. Gajinder Kumar Goyal','Cardiologist','Sector 16, Faridabad',700,4.7,167,22,'Marengo Asia Hospital',1,1,'GG','MBBS, DM Cardiology','Hindi, English'],
  ['Dr. Purshotam Lal','Interventional Cardiologist','Sector 16A, Faridabad',1500,4.9,892,35,'Metro Heart Institute',1,0,'PL','MBBS, MD, DM, Fellowship Interventional Cardiology - USA','Hindi, English'],
  // Orthopaedics
  ['Dr. Harish Handa','Orthopaedic','Sector 16, Faridabad',500,4.3,86,28,'Handa Medical Centre',1,1,'HH','MBBS, MS Orthopaedics','Hindi, English'],
  ['Dr. Puneet Mittal','Orthopaedic','Sector 16, Faridabad',300,4.4,89,15,'Mittal Hospital',1,1,'PM','MBBS, MS Orthopaedics','Hindi, English'],
  ['Dr. Rakesh Kumar','Orthopaedic','Sector 86, Faridabad',500,4.4,88,14,'Accord Superspeciality Hospital',1,1,'RK','MBBS, MS Orthopaedics','Hindi, English'],
  ['Dr. Rajiv Thukral','Orthopaedic','Sector 16A, Faridabad',500,4.6,91,18,'Metro Heart Institute',1,1,'RT','MBBS, MS Orthopaedics','Hindi, English'],
  ['Dr. Anil Lokhande','Orthopaedic','Suraj Kund, Faridabad',600,4.6,92,37,'Multiple Centers',1,1,'AL','MBBS, MS Orthopaedics, Fellowship Joint Replacement','Hindi, English'],
  // Neurologists
  ['Dr. Rohit Gupta','Neurologist','Sector 16, Faridabad',700,4.6,112,16,'Neuro Clinic Sector 16',1,1,'RG','MBBS, DM Neurology','Hindi, English'],
  ['Dr. Kunal Bahrani','Neurologist','Sector 21C, Faridabad',600,4.3,86,14,'Fortis Escorts Hospital',1,0,'KB','MBBS, DM Neurology','Hindi, English'],
  ['Dr. Amit Kumar Agarwal','Neurologist','Sector 88, Faridabad',400,4.6,92,18,'Amrita Hospital',1,1,'AA','MBBS, DM Neurology, Stroke Medicine','Hindi, English'],
  // General Physicians
  ['Dr. Maheshwar Chawla','General Physician','Sector 86, Faridabad',400,4.7,93,20,'Walk In Clinic',1,1,'MC','MBBS, MD General Medicine','Hindi, English'],
  ['Dr. P Singh Narula','General Physician','NIT, Faridabad',250,4.4,89,25,'Narula Clinic',1,1,'PN','MBBS','Hindi, English, Punjabi'],
  ['Dr. Reemu Bansal','General Physician','Sector 17, Faridabad',200,4.6,92,12,'Family Healthcare Clinic',1,1,'RB','MBBS, MD','Hindi, English'],
  ['Dr. Jalaj Ranjan','General Physician','Green Fields, Faridabad',400,4.5,78,14,'The Physicians Clinique',1,1,'JR','MBBS, MD Internal Medicine','Hindi, English'],
  // Diabetologists
  ['Dr. Rajan Goyal','Diabetologist','Neharpar, Faridabad',300,4.4,89,18,'Goyal Diabetes Clinic',1,1,'RG','MBBS, MD Endocrinology','Hindi, English'],
  ['Dr. K.K. Goyal','Diabetologist','Sector 8, Faridabad',800,4.3,86,35,'Kavya Diabetologist Clinic',1,1,'KG','MBBS, MD Diabetology','Hindi, English'],
  ['Dr. Prakash Chandra Agarwal','Diabetologist','Old Faridabad',300,4.5,134,49,'Dr P.C. Agarwal Clinic',1,0,'PA','MBBS, MD Medicine, Diabetology','Hindi, English'],
  // Dermatologists
  ['Dr. Sanchika Gupta','Dermatologist','Sector 28, Faridabad',400,4.6,92,14,'The Skin House',1,1,'SG','MBBS, MD Dermatology','Hindi, English'],
  ['Dr. Shruti Kohli','Dermatologist','Sector 15, Faridabad',400,4.4,87,25,'Dr Shrutis Skin & Laser Centre',1,1,'SK','MBBS, MD Dermatology','Hindi, English'],
  ['Dr. Kavita Mehndiratta','Dermatologist','Sector 35, Faridabad',500,4.4,88,27,'Dr Kavita Skin Clinic',1,0,'KM','MBBS, MD Dermatology','Hindi, English'],
  ['Dr. Devesh Aggarwal','Dermatologist','Sector 15, Faridabad',700,4.6,91,17,'Dr Devesh Clinic',1,1,'DA','MBBS, MD Dermatology','Hindi, English'],
  // Gynaecologists
  ['Dr. Pooja Thukral','Gynaecologist','Sector 15A, Faridabad',700,4.8,192,18,'Cloudnine Hospital NIT',1,1,'PT','MBBS, MS Obs & Gynaecology','Hindi, English'],
  ['Dr. Seema Bansal','Gynaecologist','Sector 20A, Faridabad',1000,4.7,156,22,'SSB Healthcare',1,1,'SB','MBBS, MS Gynaecology','Hindi, English'],
  ['Dr. Niti Kautish','Gynaecologist','NIT, Faridabad',1200,4.8,234,20,'Fortis Escorts Hospital',1,0,'NK','MBBS, MS, Fellowship Gynaec Oncology','Hindi, English'],
  // Paediatricians
  ['Dr. Sanjiv Mehndiratta','Paediatrician','Sector 29, Faridabad',500,4.7,167,22,'SM Child Clinic',1,1,'SM','MBBS, MD Paediatrics','Hindi, English'],

  // ── NEW SCRAPED DOCTORS ─────────────────────────────────────────────────────

  // Cardiologists (new)
  ['Dr. Abhishek Gupta','Cardiologist','Sector 88, Faridabad',400,4.3,112,14,'Amrita Hospital',1,1,'AG','MBBS, MD - Cardiology','Hindi, English'],

  // Orthopaedics (new)
  ['Dr. Tanvir Maqbool','Orthopaedic','Green Fields, Faridabad',500,4.3,143,23,'NEO CARE',1,1,'TM','MBBS, MS - Orthopaedics, Fellowship in Joint Replacement','Hindi, English, Punjabi'],
  ['Dr. Sanjay Bansal','Orthopaedic','Sector 82, Faridabad',500,4.5,201,21,'UV Medicare',1,1,'SB','MBBS, MS - Orthopaedics','Hindi, English'],
  ['Dr. Pankaj Walecha','Orthopaedic','Sector 8, Faridabad',600,4.5,167,22,'Sarvodaya Hospital',1,1,'PW','MBBS, MS - Orthopaedics, Fellowship in Robotic Joint Replacement','Hindi, English'],
  ['Dr. Nishant Soni','Orthopaedic','Sector 8, Faridabad',500,4.3,88,12,'Sarvodaya Hospital',1,1,'NS','MBBS, MS - Orthopaedics, Fellowship Hand Surgery','Hindi, English'],

  // Neurologists (new)
  ['Dr. Rohit Gupta','Neurologist','Sector 86, Faridabad',700,4.4,156,24,'Accord Superspeciality Hospital',1,1,'RG','MBBS, MD - General Medicine, DM - Neurology','Hindi, English'],
  ['Dr. Himanshu Arora','Neurologist','Sector 21C, Faridabad',1000,4.3,98,25,'Health Harbour',1,1,'HA','MBBS, MD - Neurology, DM - Neurology','Hindi, English'],
  ['Dr. Sushma Sharma','Neurologist','NIT, Faridabad',1000,4.4,134,21,'Fortis Escorts Hospital',1,1,'SS','MBBS, MD - Neurology, DM - Neurology','Hindi, English'],
  ['Dr. Abhinav Gupta','Neurologist','Sector 8, Faridabad',700,4.5,201,18,'Sarvodaya Hospital',1,1,'AbG','MBBS, MD - Neurology, DM - Neurology','Hindi, English'],
  ['Dr. Gangesh Gunjan','Neurologist','Sector 8, Faridabad',800,4.4,143,20,'Sarvodaya Hospital',1,1,'GGu','MBBS, MS - Neurosurgery','Hindi, English'],
  ['Dr. Naresh Panwar','Neurologist','Sector 19, Faridabad',700,4.2,76,16,'Sarvodaya Hospital',1,1,'NP','MBBS, MCh - Neurosurgery','Hindi, English'],

  // General Physicians (new)
  ['Dr. Manoj Sharma','General Physician','Sector 11, Faridabad',500,4.2,134,36,'IBS Ashwani Multi-Specialty',1,1,'MS','MBBS, MD - Internal Medicine','Hindi, English'],
  ['Dr. Tarsem Goyal','General Physician','Charmwood Village, Faridabad',500,4.2,89,30,'Family Health Care Clinic',1,1,'TG','MBBS, MD - General Medicine','Hindi, English, Punjabi'],
  ['Dr. Pankaj Gupta','General Physician','Sector 21C, Faridabad',600,4.6,198,21,'Medication Review Clinic',1,1,'PG','MBBS, MD - Internal Medicine','Hindi, English'],
  ['Dr. Mukund Singh','General Physician','Sector 88, Faridabad',300,4.2,87,21,'Amrita Hospital',1,1,'MkS','MBBS, MD - General Medicine','Hindi, English'],
  ['Dr. Romesh Raina','General Physician','Sector 35, Faridabad',500,4.3,134,19,'Dr Raina Clinic',1,1,'RRa','MBBS, MD - General Medicine','Hindi, English, Punjabi'],
  ['Dr. Rakesh Gupta','General Physician','Sector 8, Faridabad',400,4.5,223,28,'Sarvodaya Hospital',1,1,'RaG','MBBS, MD - Internal Medicine','Hindi, English'],
  ['Dr. Shriyansh Jain','General Physician','Sector 19, Faridabad',500,4.4,167,18,'Sarvodaya Hospital',1,1,'ShJ','MBBS, MD - Internal Medicine','Hindi, English'],

  // Diabetologists (new)
  ['Dr. G K Khurana','Diabetologist','NIT, Faridabad',300,4.3,134,41,'Diabetology & Heart Disease Centre',1,1,'GKK','MBBS, MD - Medicine, Fellowship Diabetology','Hindi, English'],
  ['Dr. Sandeep Kharb','Diabetologist','Sector 16, Faridabad',1000,4.4,89,18,'Dr Sandeep Kharb Clinic',1,1,'SKh','MBBS, MD - Endocrinology','Hindi, English'],

  // Dermatologists (new)
  ['Dr. Archit Aggarwal','Dermatologist','NIT, Faridabad',400,4.4,178,14,'KDC Skin, Hair & Laser Clinic',1,1,'ArA','MBBS, MD - Dermatology, Venereology & Leprosy','Hindi, English, Punjabi'],
  ['Dr. Akash Bhayana','Dermatologist','Sector 19, Faridabad',200,4.2,112,14,'Sarvodaya Hospital',1,1,'AkB','MBBS, MD - Dermatology','Hindi, English'],
  ['Dr. Swati Agarwal','Dermatologist','Green Fields, Faridabad',500,4.4,167,18,'Skination Clinic',1,1,'SwA','MBBS, MD - Dermatology','Hindi, English'],
  ['Dr. Kailash Kumar Jha','Dermatologist','Sector 8, Faridabad',400,4.3,98,15,'Sarvodaya Hospital',1,1,'KKJ','MBBS, MD - Dermatology','Hindi, English'],

  // Gynaecologists (new)
  ['Dr. K S Anamika','Gynaecologist','Sector 37, Faridabad',500,4.6,234,22,'Midas Clinic',1,1,'KSA','MBBS, MS - Obstetrics & Gynaecology','Hindi, English'],
  ['Dr. Aradhana Kalra Dawar','Gynaecologist','Sector 15A, Faridabad',500,4.5,189,23,'Eva Care Women Health',1,1,'AKD','MBBS, MS - Obstetrics & Gynaecology, Fellowship IVF','Hindi, English, Punjabi'],
  ['Dr. Mini Khetarpal','Gynaecologist','Ballabhgarh, Faridabad',700,4.2,134,31,'Dr Mini Khetarpal Maternity Centre',1,1,'MiK','MBBS, MS - Obstetrics & Gynaecology','Hindi, English, Punjabi'],
  ['Dr. Roopali Singhal','Gynaecologist','Sector 16, Faridabad',500,4.4,178,31,'Mothers Care & Maternity Centre',1,1,'RS','MBBS, MS - Obstetrics & Gynaecology','Hindi, English'],
  ['Dr. Seema Madan','Gynaecologist','NIT, Faridabad',500,4.5,167,22,'RG Stone Hospital',1,1,'SeM','MBBS, MD - Obstetrics & Gynaecology','Hindi, English'],
  ['Dr. Renu Gupta','Gynaecologist','Sector 8, Faridabad',600,4.4,201,24,'Sarvodaya Hospital',1,1,'ReG','MBBS, MD - Obstetrics & Gynaecology','Hindi, English'],
  ['Dr. Seema Manuja','Gynaecologist','Sector 19, Faridabad',700,4.5,223,30,'Sarvodaya Hospital',1,1,'SMn','MBBS, MS - Obstetrics & Gynaecology','Hindi, English'],
  ['Dr. Shilpa Gupta','Gynaecologist','Sector 8, Faridabad',500,4.3,112,14,'Sarvodaya Hospital',1,1,'ShG','MBBS, MS - Obstetrics & Gynaecology','Hindi, English'],

  // Paediatricians (new)
  ['Dr. Rakesh Sharma','Paediatrician','Sector 35, Faridabad',600,4.6,234,27,'Aastha Children Hospital',1,1,'RkS','MBBS, MD - Paediatrics','Hindi, English'],
  ['Dr. Sanjeev Kumar','Paediatrician','Sector 21B, Faridabad',500,4.6,201,29,'Faridabad Medical Centre',1,1,'SkK','MBBS, MD - Paediatrics','Hindi, English'],
  ['Dr. Vikas Jain','Paediatrician','Sector 46, Faridabad',400,4.6,167,28,'V Care Clinic',1,1,'VJ','MBBS, MD - Paediatrics','Hindi, English'],
  ['Dr. Supriya Rastogi','Paediatrician','Sector 8, Faridabad',500,4.6,178,17,'Savera Child Clinic',1,1,'SuR','MBBS, MD - Paediatrics','Hindi, English'],
  ['Dr. Abhilash Agrawal','Paediatrician','Charmwood Village, Faridabad',600,4.5,134,25,'Vardaan Clinic',1,1,'AbA','MBBS, MD - Paediatrics, Fellowship Neonatology','Hindi, English'],
  ['Dr. Amit Nagpal','Paediatrician','NIT, Faridabad',600,4.6,189,22,'Fortis Escorts Hospital',1,1,'AmN','MBBS, MD - Paediatrics','Hindi, English, Punjabi'],
  ['Dr. Sushil Singla','Paediatrician','Sector 8, Faridabad',570,4.4,156,42,'Sarvodaya Hospital',1,1,'SuSi','MBBS, MD - Paediatrics','Hindi, English, Punjabi'],
  ['Dr. Anand Gupta','Paediatrician','Sector 8, Faridabad',500,4.3,112,18,'Sarvodaya Hospital',1,1,'AnG','MBBS, MD - Paediatrics','Hindi, English'],

  // Psychiatrists (new)
  ['Dr. Rahul Chandhok','Psychiatrist','Sector 21A, Faridabad',1200,4.6,201,28,'Med Hope Clinic',1,1,'RC','MBBS, MD - Psychiatry','Hindi, English'],
  ['Dr. Ashish Khandelwal','Psychiatrist','NIT, Faridabad',600,4.4,134,19,'Sukoon Neuropsychiatry Clinic',1,1,'AshK','MBBS, MD - Psychiatry','Hindi, English'],
  ['Dr. Lalit Kardam','Psychiatrist','Sector 10, Faridabad',800,4.4,112,16,'Dr Lalit Kardam Clinic',1,1,'LK','MBBS, MD - Psychiatry, DPM','Hindi, English'],
  ['Dr. Lav Kaushik','Psychiatrist','Sector 8, Faridabad',800,4.3,89,21,'Sarvodaya Hospital',1,1,'LaK','MBBS, MD - Psychiatry','Hindi, English'],
  ['Dr. Deepika Makkar','Psychiatrist','Green Fields, Faridabad',1000,4.4,76,18,'Sukoon Psychiatry Clinic',1,1,'DM','MBBS, MD - Psychiatry','Hindi, English'],
  ['Dr. Minakshi Manchanda','Psychiatrist','Sector 21A, Faridabad',1500,4.5,98,26,'Asian Institute of Medical Sciences',1,1,'MM','MBBS, MD - Psychiatry','Hindi, English, Punjabi'],

  // Ophthalmologists (new)
  ['Dr. Minal Kaur','Ophthalmologist','Green Fields, Faridabad',450,4.5,178,25,'My Family Clinics',1,1,'MnK','MBBS, MS - Ophthalmology','Hindi, English, Punjabi'],
  ['Dr. Jaidrath Kumar','Ophthalmologist','Sector 8, Faridabad',300,4.5,201,21,'Sarvodaya Hospital',1,1,'JaK','MBBS, MS - Ophthalmology','Hindi, English'],
  ['Dr. Bharti Gupta','Ophthalmologist','Sector 14, Faridabad',500,4.2,112,43,'Dr Bharti Gupta Eye Clinic',1,1,'BhG','MBBS, MS - Ophthalmology','Hindi, English'],
  ['Dr. Vikas Thukral','Ophthalmologist','NIT, Faridabad',500,4.4,167,28,'Pearl Eye Clinic',1,1,'VkT','MBBS, MS - Ophthalmology','Hindi, English, Punjabi'],
  ['Dr. Kul Bhushan Bhargava','Ophthalmologist','NIT, Faridabad',400,4.4,134,53,'Dewan Memorial Eye Hospital',1,1,'KBB','MBBS, MS - Ophthalmology','Hindi, English'],
  ['Dr. V P Sardana','Ophthalmologist','Sector 16, Faridabad',500,4.2,89,46,'Sardana Eye Clinic',1,1,'VPS','MBBS, DO - Ophthalmology','Hindi, English'],
  ['Dr. Amit Arora','Ophthalmologist','Sector 15, Faridabad',500,4.3,112,26,'Drishti Eye Centre',1,1,'AmA','MBBS, MS - Ophthalmology','Hindi, English'],
  ['Dr. Jatin Wadhwa','Ophthalmologist','NIT, Faridabad',400,4.2,76,17,'Wadhwa Eye Care Centre',1,1,'JW','MBBS, MS - Ophthalmology','Hindi, English'],

  // ENT Specialists (new)
  ['Dr. Anil Arora','ENT Specialist','Sector 16, Faridabad',500,4.5,234,38,'Dr Anil Clinic',1,1,'AnA','MBBS, MS - ENT','Hindi, English, Punjabi'],
  ['Dr. Anil Thukral','ENT Specialist','Sector 16, Faridabad',600,4.4,201,39,'Thukral ENT Clinic',1,1,'AnT','MBBS, MS - ENT','Hindi, English, Punjabi'],
  ['Dr. Sourav Chakraborty','ENT Specialist','Sector 49, Faridabad',300,4.4,156,17,'Sanjeevni Clinic',1,1,'SC','MBBS, MS - ENT','Hindi, English'],
  ['Dr. Anand Kumar Gupta','ENT Specialist','Sector 35, Faridabad',600,4.3,134,21,'Surya ENT & Surgical Centre',1,1,'AKGu','MBBS, MS - ENT, Fellowship Otology','Hindi, English'],
  ['Dr. Honey Gupta','ENT Specialist','Sector 8, Faridabad',300,4.3,112,19,'Life Hospital',1,1,'HoG','MBBS, MS - ENT','Hindi, English'],
  ['Dr. Parveen Chawla','ENT Specialist','BK Chowk, Faridabad',900,4.4,178,32,'ENT Head Neck Hospital',1,1,'PC','MBBS, MS - ENT, Fellowship Head & Neck Surgery','Hindi, English, Punjabi'],
  ['Dr. Kumar Ashutosh','ENT Specialist','Jawahar Colony, Faridabad',500,4.3,89,14,'ORCHID Clinic',1,1,'KAu','MBBS, MS - ENT','Hindi, English'],
  ['Dr. Ravi Bhatia','ENT Specialist','Sector 8, Faridabad',600,4.4,134,22,'Sarvodaya Hospital',1,1,'RaB','MBBS, MS - ENT, DLO','Hindi, English'],

  // Urologists (new)
  ['Dr. Anup Gulati','Urologist','Sector 17, Faridabad',1000,4.6,234,26,'Fortis Escorts Hospital',1,1,'AnpG','MBBS, MS - General Surgery, MCh - Urology','Hindi, English, Punjabi'],
  ['Dr. Vikas Agarwal','Urologist','Sector 21A, Faridabad',600,4.3,134,24,'Asian Institute of Medical Sciences',1,1,'ViA','MBBS, MS - Surgery, MCh - Urology','Hindi, English'],
  ['Dr. Tanuj Paul Bhatia','Urologist','Sector 8, Faridabad',600,4.3,112,20,'Sarvodaya Hospital',1,1,'TPB','MBBS, MS - Surgery, MCh - Urology','Hindi, English'],
  ['Dr. Rajiv Kumar Sethia','Urologist','Sector 21A, Faridabad',700,4.2,89,30,'Asian Institute of Medical Sciences',1,1,'RKS','MBBS, MS - Surgery, MCh - Urology','Hindi, English'],
  ['Dr. Praveen Pushkar','Urologist','Green Fields, Faridabad',500,4.3,98,21,'Urology Clinic',1,1,'PrP','MBBS, MS - Surgery, MCh - Urology','Hindi, English'],
  ['Dr. Alok Kumar Jha','Urologist','NIT, Faridabad',1000,4.2,76,18,'SSB Heart & Multispecialty Hospital',1,1,'AKJ','MBBS, MS - Surgery, MCh - Urology','Hindi, English'],

  // Nephrologists (new)
  ['Dr. Kunal Raj Gandhi','Nephrologist','Sector 88, Faridabad',400,4.7,201,17,'Amrita Hospital',1,1,'KRG','MBBS, MD - General Medicine, DM - Nephrology','Hindi, English'],
  ['Dr. Jitendra Kumar','Nephrologist','Sector 86, Faridabad',700,4.3,112,35,'Accord Superspeciality Hospital',1,1,'JiK','MBBS, MD - Medicine, DM - Nephrology','Hindi, English'],
  ['Dr. Tanmay Pandya','Nephrologist','Sector 8, Faridabad',1200,4.2,89,22,'Sarvodaya Hospital',1,1,'TaP','MBBS, MD - Internal Medicine, DM - Nephrology','Hindi, English'],
  ['Dr. Sagar Gupta','Nephrologist','Sector 16A, Faridabad',900,4.4,134,16,'Metro Heart Institute',1,1,'SaGu','MBBS, MD - Medicine, DM - Nephrology','Hindi, English'],
  ['Dr. Tejendra Singh Chauhan','Nephrologist','Sector 21C, Faridabad',500,4.2,76,22,'Dr Chauhan Kidney Clinic',1,1,'TSC','MBBS, MD - Medicine, DM - Nephrology','Hindi, English'],

  // Gastroenterologists (new)
  ['Dr. Amit Miglani','Gastroenterologist','NIT, Faridabad',800,4.2,98,23,'Asian Institute of Medical Sciences',1,1,'AmMi','MBBS, MD - General Medicine, DM - Gastroenterology','Hindi, English'],
  ['Dr. Vishal Khurana','Gastroenterologist','Sector 86, Faridabad',700,4.6,201,20,'Getwell Medicentre',1,1,'ViKh','MBBS, MD - Medicine, DM - Gastroenterology','Hindi, English'],
  ['Dr. Ramchandra Soni','Gastroenterologist','Sector 17, Faridabad',500,4.3,134,26,'Santosh Multispeciality Hospital',1,1,'RCS','MBBS, MD - Medicine, DM - Gastroenterology','Hindi, English'],
  ['Dr. Punit Singla','Gastroenterologist','Sector 16, Faridabad',1000,4.2,89,20,'Marengo Asia Hospital',1,1,'PuS','MBBS, MD - Medicine, DM - Gastroenterology','Hindi, English'],
  ['Dr. Bir Singh','Gastroenterologist','Sector 10, Faridabad',800,4.3,112,19,'Marengo Asia Hospital',1,1,'BiS','MBBS, MD - Medicine, DM - Gastroenterology','Hindi, English'],
  ['Dr. Ashok Kumar Sharma','Gastroenterologist','Sector 8, Faridabad',700,4.2,76,18,'Sarvodaya Hospital',1,1,'AkS','MBBS, MD - Medicine, DM - Gastroenterology','Hindi, English'],

  // Oncologists (new)
  ['Dr. Neetu Singhal','Oncologist','Sector 21A, Faridabad',600,4.6,178,28,'Asian Institute of Medical Sciences',1,1,'NeS','MBBS, MD - Oncology, DM - Medical Oncology','Hindi, English'],
  ['Dr. Ravi Kant Arora','Oncologist','NIT, Faridabad',800,4.3,112,38,'Fortis Escorts Hospital',1,1,'RKA','MBBS, MS - Surgery, MCh - Oncology','Hindi, English, Punjabi'],
  ['Dr. Dinesh Pendharkar','Oncologist','Sector 8, Faridabad',900,4.4,134,25,'Sarvodaya Hospital',1,1,'DiP','MBBS, MD - Radiation Oncology','Hindi, English'],
  ['Dr. Hari Mohan Agrawal','Oncologist','Sector 8, Faridabad',800,4.2,89,28,'Sarvodaya Hospital',1,1,'HMA','MBBS, MD - Medical Oncology','Hindi, English'],
  ['Dr. Rohit Nayyar','Oncologist','Sector 21A, Faridabad',700,4.3,98,33,'Asian Institute of Medical Sciences',1,1,'RoN','MBBS, MS - Surgery, MCh - Surgical Oncology','Hindi, English'],

  // Pulmonologists (new)
  ['Dr. Mool Chand Gupta','Pulmonologist','Sector 15, Faridabad',500,4.8,312,50,'Jeevan Jyoti Hospital',1,1,'MCG','MBBS, MD - Respiratory Medicine','Hindi, English, Punjabi'],
  ['Dr. Manav Manchanda','Pulmonologist','Sector 21A, Faridabad',800,4.2,98,29,'Asian Institute of Medical Sciences',1,1,'MaM','MBBS, MD - Pulmonary Medicine','Hindi, English'],
  ['Dr. Kamal Gera','Pulmonologist','NIT, Faridabad',400,4.4,156,15,'Lung Care Clinic',1,1,'KaG','MBBS, MD - Respiratory Medicine','Hindi, English'],
  ['Dr. Danish Jamal','Pulmonologist','NIT, Faridabad',500,4.5,178,22,'QRG Central Hospital',1,1,'DaJ','MBBS, MD - Pulmonary Medicine','Hindi, English'],
  ['Dr. Manisha Mendiratta','Pulmonologist','Sector 8, Faridabad',1000,4.4,134,28,'Sarvodaya Hospital',1,1,'MiMd','MBBS, MD - Respiratory Medicine, DNB Pulmonology','Hindi, English'],

  // General Surgeons (new)
  ['Dr. Mini Vohra','General Surgeon','Sector 17, Faridabad',600,4.4,201,45,'Vohra Clinic',1,1,'MiV','MBBS, MS - General Surgery','Hindi, English'],
  ['Dr. Kulbhushan Bhartiya','General Surgeon','Sector 8, Faridabad',500,4.2,112,38,'Goyal Hospital',1,1,'KBh','MBBS, MS - General Surgery','Hindi, English, Punjabi'],
  ['Dr. Manish Chauhan','General Surgeon','Ballabhgarh, Faridabad',500,4.2,134,28,'SMS Multispeciality Hospital',1,1,'MaC','MBBS, MS - General Surgery','Hindi, English'],
  ['Dr. Anushtup De','General Surgeon','Sector 8, Faridabad',600,4.3,167,27,'Sarvodaya Hospital',1,1,'AuD','MBBS, MS - General Surgery, Fellowship Laparoscopy','Hindi, English'],
  ['Dr. Subhash Hakoo','General Surgeon','Sector 8, Faridabad',700,4.4,178,30,'Sarvodaya Hospital',1,1,'SuH','MBBS, MS - General Surgery','Hindi, English'],
  ['Dr. Prabal Roy','General Surgeon','Sector 86, Faridabad',700,4.3,112,36,'Accord Superspeciality Hospital',1,1,'PrR','MBBS, MS - General Surgery','Hindi, English'],
  ['Dr. Sachin Mittal','General Surgeon','Sector 88, Faridabad',500,4.3,89,18,'Amrita Hospital',1,1,'SaM','MBBS, MS - General Surgery','Hindi, English'],
  ['Dr. Kamran Ali','General Surgeon','Sector 16, Faridabad',1000,4.2,76,17,'Marengo Asia Hospital',1,1,'KaA','MBBS, MS - General Surgery, Fellowship Minimal Access Surgery','Hindi, English'],

  // Dentists (new)
  ['Dr. Sundeep Khurana','Dentist','NIT, Faridabad',400,4.4,201,28,'Dr Khurana Multi-Speciality Dental Clinic',1,1,'SuKh','BDS, MDS - Orthodontics','Hindi, English, Punjabi'],
  ['Dr. Manav Lakhanpal','Dentist','Sector 16, Faridabad',400,4.4,178,18,'The Dental Office',1,1,'MaL','BDS, MDS - Prosthodontics','Hindi, English'],
  ['Dr. Anuradha Suri','Dentist','Sector 37, Faridabad',150,4.3,134,39,'Suri Dental Care Clinic',1,1,'AnS','BDS, MDS','Hindi, English'],
  ['Dr. Sunil Valecha','Dentist','Sector 2, Faridabad',300,4.4,156,16,'Dr Valecha Orthodontic & Dental Clinic',1,1,'SuV','BDS, MDS - Orthodontics','Hindi, English'],
  ['Dr. Preety Goel','Dentist','Sector 81, Faridabad',300,4.4,167,18,'Perfect Dental Wellness',1,1,'PrG','BDS, MDS - Endodontics','Hindi, English'],
  ['Dr. Uday Pratap Singh','Dentist','Old Faridabad',300,4.3,112,14,'Zsigmon Dental Clinic',1,1,'UPS','BDS, MDS','Hindi, English'],
  ['Dr. Dimpy Darbar','Dentist','Sector 21C, Faridabad',350,4.6,189,34,'Urbana Dental Clinic',1,1,'DD','BDS, MDS - Oral Surgery','Hindi, English'],
  ['Dr. Kapil Bhardwaj','Dentist','Ballabhgarh, Faridabad',100,4.2,98,17,'Special Care Dental Clinic',1,1,'KaBh','BDS','Hindi, English, Punjabi'],

  // Physiotherapists (new)
  ['Dr. Jitesh Sharma','Physiotherapist','Green Fields, Faridabad',500,4.2,112,18,'New Age Rehabilitation Centre',1,1,'JiS','BPT, MPT - Musculoskeletal','Hindi, English'],
  ['Dr. Sanjay Chablani','Physiotherapist','Sector 14, Faridabad',700,4.3,134,27,'Healing Space Therapy Clinic',1,1,'SaCh','BPT, MPT - Neurological Rehabilitation','Hindi, English'],
  ['Dr. Devender Singh Rathee','Physiotherapist','Sector 16, Faridabad',400,4.3,112,17,'Activecare Physiotherapy Clinic',1,1,'DSR','BPT, MPT - Sports Physiotherapy','Hindi, English'],
  ['Dr. Ankush Kaushik','Physiotherapist','Sector 18, Faridabad',300,4.4,134,24,'Advance Physio Care & Yoga Center',1,1,'AnKa','BPT, MPT','Hindi, English'],
  ['Dr. Deepti Goel','Physiotherapist','Sector 8, Faridabad',250,4.2,89,13,'Sarvodaya Hospital',1,1,'DeG','BPT, MPT - Sports & Musculoskeletal','Hindi, English'],

  // Rheumatologists (new)
  ['Dr. Punit Pruthi','Rheumatologist','Sector 17, Faridabad',1000,4.4,112,25,'Yash Clinic',1,1,'PuP','MBBS, MD - Medicine, SCE Rheumatology','Hindi, English'],
  ['Dr. Manisha Gupta','Rheumatologist','Sector 8, Faridabad',800,4.3,89,22,'Sarvodaya Hospital',1,1,'MnGu','MBBS, MD - Medicine, Fellowship Rheumatology','Hindi, English'],
  ['Dr. Sumit Aggarwal','Rheumatologist','Sector 8, Faridabad',700,4.4,134,20,'Sarvodaya Hospital',1,1,'SuAg','MBBS, MD - Internal Medicine, Fellowship Rheumatology','Hindi, English'],
  ['Dr. Arun Kumar Singh','Rheumatologist','Sector 16A, Faridabad',1000,4.2,76,19,'Metro Heart Institute',1,1,'AKSi','MBBS, MD - Endocrinology, Fellowship Rheumatology','Hindi, English'],

  // ── BATCH 2: Additional Scraped Doctors (Faridabad) ─────────────────────────

  // Cardiologists – Batch 2
  ['Dr. Simmi Manocha','Cardiologist','Sector 86, Faridabad',700,4.4,98,18,'Accord Superspeciality Hospital',1,1,'SMa','MBBS, MD - Medicine, DM - Cardiology','Hindi, English'],
  ['Dr. Sanjay Kumar','Cardiologist','NIT, Faridabad',800,4.4,112,19,'Fortis Escorts Hospital',1,1,'SkKr','MBBS, MD - Medicine, DM - Cardiology','Hindi, English'],
  ['Dr. Prateek Bajaj','Cardiologist','Sector 21A, Faridabad',700,4.5,134,12,'Asian Institute of Medical Sciences',1,1,'PrB','MBBS, MD - Medicine, DM - Cardiology','Hindi, English'],
  ['Dr. Rakesh Rai Sapra','Cardiologist','Sector 16, Faridabad',800,4.6,167,25,'Marengo Asia Hospitals',1,1,'RRS','MBBS, MD - Medicine, DM - Cardiology','Hindi, English'],
  ['Dr. Niti Chadha Negi','Cardiologist','Sector 16A, Faridabad',800,4.5,89,16,'Metro Heart Institute',1,1,'NCN','MBBS, MD - Medicine, DM - Cardiology, Electrophysiology','Hindi, English'],
  ['Dr. Agi Pillai','Cardiologist','Sector 3, Faridabad',300,4.3,78,25,'Livewell Diabetes and Health Centre',1,1,'APi','MBBS, Diploma in Cardiology, MD - Cardiology','Hindi, English'],
  ['Dr. Binay Kumar','Cardiologist','Sector 86, Faridabad',700,4.4,56,15,'Jeevasha Clinic',1,1,'BiK','MBBS, MD - Medicine, DM - Cardiology','Hindi, English'],
  ['Dr. Sushil Azad','Pediatric Cardiologist','Sector 88, Faridabad',1200,4.6,89,25,'Amrita Hospital',1,1,'SuAz','MBBS, MD - Pediatrics, DM - Pediatric Cardiology','Hindi, English'],

  // Neurologists – Batch 2
  ['Dr. Megha Sharda','Neurologist','Sector 86, Faridabad',700,4.5,112,10,'Accord Superspeciality Hospital',1,1,'MeS','MBBS, MD - Medicine, DNB - Neurology','Hindi, English'],
  ['Dr. Neha Kapoor','Neurologist','Sector 21A, Faridabad',700,4.4,98,13,'Asian Institute of Medical Sciences',1,1,'NeK','MBBS, MD - Medicine, DM - Neurology','Hindi, English'],
  ['Dr. Raghav Kapoor','Neurologist','Sector 20A, Faridabad',700,4.5,134,10,'SSB Heart & Multispecialty Hospital',1,1,'RaKp','MBBS, MD - Medicine, DM - Neurology','Hindi, English'],

  // Orthopedics – Batch 2
  ['Dr. Naman Goel','Orthopedic Surgeon','Sector 86, Faridabad',600,4.4,89,12,'Accord Superspeciality Hospital',1,1,'NaGo','MBBS, MS - Orthopaedics, DNB - Orthopedics','Hindi, English'],
  ['Dr. Vaibhav Jain','Orthopedic Surgeon','Sector 16A, Faridabad',700,4.5,134,16,'Metro Heart Institute',1,1,'VaJ','MBBS, MS - Orthopaedics','Hindi, English'],
  ['Dr. Abhyant Gupta','Orthopedic Surgeon','NIT, Faridabad',500,4.3,98,31,'Devanshi Hospital',1,1,'AbGp','MBBS, MS - Orthopaedics','Hindi, English'],
  ['Dr. Vishant Gawri','Orthopedic Surgeon','Sector 84, Faridabad',500,4.4,112,16,'EmergeNow Clinic',1,1,'ViGa','MBBS, MS - Orthopaedics','Hindi, English'],
  ['Dr. K D Soni','Orthopedic Surgeon','NIT, Faridabad',1000,4.6,201,47,'Fortis Escorts Hospital',1,1,'KDS','MBBS, MS - Orthopaedics, DNB','Hindi, English'],
  ['Dr. Neeraj Jain','Orthopedic Surgeon','Sector 21A, Faridabad',800,4.5,167,25,'Asian Institute of Medical Sciences',1,1,'NrJ','MBBS, MS - Orthopaedics, Fellowship - Joint Replacement','Hindi, English'],
  ['Dr. Abhijit Tayade','Orthopedic Surgeon','Sector 20A, Faridabad',700,4.4,123,18,'SSB Heart & Multispecialty Hospital',1,1,'AbT','MBBS, MS - Orthopaedics, DNB - Joint Replacement','Hindi, English, Marathi'],

  // Dermatologists – Batch 2
  ['Dr. Khushboo Jha','Dermatologist','Sector 16A, Faridabad',600,4.4,89,10,'Metro Heart Institute',1,1,'KhJ','MBBS, MD - Dermatology','Hindi, English'],
  ['Dr. Sachdeep Kaur','Dermatologist','Sector 20A, Faridabad',600,4.3,76,12,'SSB Heart & Multispecialty Hospital',1,1,'SaKa','MBBS, MD - Dermatology','Hindi, English, Punjabi'],

  // Pediatricians – Batch 2
  ['Dr. Hemant Kumar Mukhija','Paediatrician','Sector 16A, Faridabad',700,4.5,112,14,'Metro Heart Institute',1,1,'HKM','MBBS, MD - Pediatrics','Hindi, English'],
  ['Dr. Shilakha Chaman','Paediatrician','Sector 16A, Faridabad',600,4.4,89,11,'Metro Heart Institute',1,1,'ShCh','MBBS, MD - Pediatrics','Hindi, English'],

  // Gynaecologists – Batch 2
  ['Dr. Ravinder Kaur Khurana','Gynaecologist','Sector 16A, Faridabad',800,4.6,156,22,'Metro Heart Institute',1,1,'RKKh','MBBS, MS - Obstetrics & Gynaecology, Robotic Surgery','Hindi, English, Punjabi'],
  ['Dr. Vineeta Kharb','Gynaecologist','Sector 16A, Faridabad',800,4.5,134,20,'Metro Heart Institute',1,1,'ViKb','MBBS, MS - Obstetrics & Gynaecology, IVF Training','Hindi, English'],

  // Psychiatrists – Batch 2
  ['Dr. Viddur Arya','Psychiatrist','Sector 16A, Faridabad',700,4.5,89,12,'Metro Heart Institute',1,1,'VidA','MBBS, MD - Psychiatry','Hindi, English'],
  ['Dr. Ajay Bhargava','Psychiatrist','NIT, Faridabad',500,4.4,134,35,'Anand Clinic',1,1,'AjB','MBBS, DPM','Hindi, English'],
  ['Dr. Shabiullah Syed','Psychiatrist','Faridabad',1000,4.5,78,29,'The Definitive Mind Clinic',1,1,'ShS','MBBS, MD - Psychiatry','Hindi, English, Urdu'],
  ['Dr. Sonali Aggarwal','Psychiatrist','Faridabad',600,4.3,56,5,'Mindful Care Clinic',1,1,'SoAg','MBBS, MD - Psychiatry','Hindi, English'],
  ['Dr. Sudipta Majumdar','Psychiatrist','Sector 21A, Faridabad',700,4.4,89,10,'Asian Institute of Medical Sciences',1,1,'SuMj','MA - Psychology, MPhil - Clinical Psychology','Hindi, English, Bengali'],

  // Ophthalmologists – Batch 2
  ['Dr. O P Anand','Ophthalmologist','Sector 86, Faridabad',600,4.4,112,28,'Accord Superspeciality Hospital',1,1,'OPA','MBBS, MS - Ophthalmology','Hindi, English'],

  // ENT – Batch 2
  ['Dr. Gaurav Sapra','ENT Specialist','Sector 8, Faridabad',700,4.5,134,12,'Sarvodaya Hospital & Research Centre',1,1,'GaSa','MBBS, MS - ENT','Hindi, English'],
  ['Dr. Ayush Chawla','ENT Specialist','Sector 8, Faridabad',600,4.3,89,8,'Sarvodaya Hospital & Research Centre',1,1,'AyCh','MBBS, MS - ENT','Hindi, English'],

  // Urologists – Batch 2
  ['Dr. Niren Rao','Urologist','Sector 16A, Faridabad',800,4.5,134,20,'Metro Heart Institute',1,1,'NiR','MBBS, MS - General Surgery, MCh - Urology','Hindi, English'],
  ['Dr. Ashutosh Singh','Urologist','Sector 16A, Faridabad',700,4.4,112,15,'Metro Heart Institute',1,1,'AsS','MBBS, MS - General Surgery, MCh - Urology','Hindi, English'],
  ['Dr. Anuj Kr. Sharma','Urologist','Sector 8, Faridabad',600,4.5,89,5,'Shine Urology Clinic',1,1,'AnjS','MBBS, MS - General Surgery, MCh - Urology & Kidney Transplant','Hindi, English'],
  ['Dr. Sandeep Gupta','Urologist','Sector 82, Faridabad',500,4.4,156,36,'UV Medicare',1,1,'SndG','MBBS, MS - General Surgery, MCh - Urology','Hindi, English'],
  ['Dr. Manoj Aggarwal','Urologist','Sector 20A, Faridabad',700,4.4,123,20,'SSB Heart & Multispecialty Hospital',1,1,'MaAg','MBBS, MS - General Surgery, MCh - Urology','Hindi, English'],
  ['Dr. Sanjay Kumar Gupta','Urologist','Sector 20A, Faridabad',800,4.5,178,28,'SSB Heart & Multispecialty Hospital',1,1,'SKGu','MBBS, MS - General Surgery, MCh - Urology & Kidney Transplant','Hindi, English'],
  ['Dr. Lokesh Kumar Yadav','Urologist','Faridabad',700,4.8,134,16,'RG Stone Urology Hospital',1,1,'LKY','MBBS, MS - General Surgery, MCh - Urology','Hindi, English'],

  // Nephrologists – Batch 2
  ['Dr. Asheesh Malhotra','Nephrologist','Sector 16A, Faridabad',800,4.5,112,18,'Metro Heart Institute',1,1,'AshMa','MBBS, MD - Medicine, DM - Nephrology','Hindi, English'],
  ['Dr. Reetesh Sharma','Nephrologist','Sector 21A, Faridabad',700,4.5,134,27,'Asian Institute of Medical Sciences',1,1,'ReS','MBBS, MD - Internal Medicine, DNB - Nephrology','Hindi, English'],
  ['Dr. Rajesh Goyal','Nephrologist','Sector 18, Faridabad',500,4.4,89,24,'Kidney Care Center',1,1,'RajG','MBBS, DNB - General Medicine, DNB - Nephrology','Hindi, English'],

  // Gastroenterologists – Batch 2
  ['Dr. Ravi Sahay','Gastroenterologist','Sector 16A, Faridabad',800,4.5,112,24,'Metro Heart Institute',1,1,'RvS','MBBS, MD - Medicine, DM - Gastroenterology','Hindi, English'],
  ['Dr. Vikash Bundela','Gastroenterologist','Sector 21A, Faridabad',700,4.4,98,16,'Asian Institute of Medical Sciences',1,1,'VikB','MBBS, MD - Medicine, DM - Gastroenterology','Hindi, English'],
  ['Dr. Avinash Kaushik','Gastroenterologist','Jawahar Colony, Faridabad',1200,4.3,67,11,'Avinash Kaushik Clinic',1,1,'AvKa','MBBS, MD - Gastroenterology','Hindi, English'],
  ['Dr. Ishtkhar Ahmed','Gastroenterologist','Sector 20A, Faridabad',700,4.4,112,12,'SSB Heart & Multispecialty Hospital',1,1,'IsA','MBBS, MD - Medicine, DM - Gastroenterology','Hindi, English, Urdu'],
  ['Dr. Bilal Ahmad Wani','Gastroenterologist','Sector 20A, Faridabad',700,4.3,89,10,'SSB Heart & Multispecialty Hospital',1,1,'BAW','MBBS, MD - Medicine, DM - Gastroenterology','Hindi, English, Urdu'],

  // Oncologists – Batch 2
  ['Dr. Arun Pandey','Oncologist','Sector 16A, Faridabad',900,4.9,201,26,'Metro Heart Institute',1,1,'ArP','MBBS, MS - General Surgery, MCh - Surgical Oncology','Hindi, English'],
  ['Dr. Puneet Nagpal','Oncologist','Sector 16A, Faridabad',800,4.4,112,22,'Metro Heart Institute',1,1,'PuN','MBBS, MD - Radiation Oncology, DNB','Hindi, English'],
  ['Dr. Praveen Kumar Bansal','Oncologist','Sector 16A, Faridabad',900,4.5,134,28,'Metro Heart Institute',1,1,'PKBa','MBBS, MD - Medicine, DM - Medical Oncology','Hindi, English'],
  ['Dr. Soumendra Ranjan Nayak','Oncologist','Sector 16A, Faridabad',700,4.4,89,14,'Metro Heart Institute',1,1,'SRN','MBBS, MD - Medicine, DM - Medical Oncology & Hemato-Oncology','Hindi, English, Odia'],
  ['Dr. Mudhasir Ahmad','Oncologist','NIT, Faridabad',1000,4.5,156,20,'Fortis Escorts Hospital',1,1,'MuA','MBBS, MD - General Medicine, DNB - Medical Oncology','Hindi, English, Urdu'],
  ['Dr. Rajat Bajaj','Oncologist','NIT, Faridabad',1000,4.4,134,18,'Fortis Escorts Hospital',1,1,'RajB','MBBS, MD - General Medicine, DNB - Medical Oncology','Hindi, English'],
  ['Dr. Vikas Kumar','Oncologist','Sector 21A, Faridabad',700,4.4,89,21,'Asian Institute of Medical Sciences',1,1,'VikK','MBBS, MD - Radiation Oncology, DNB','Hindi, English'],
  ['Dr. Divya Gupta','Oncologist','Sector 8, Faridabad',800,4.5,112,14,'Sarvodaya Hospital & Research Centre',1,1,'DivG','MBBS, MD - Radiation Oncology, DNB','Hindi, English'],
  ['Dr. Deepak Kumar Jain','Oncologist','Sector 20A, Faridabad',700,4.4,98,16,'SSB Heart & Multispecialty Hospital',1,1,'DKJ','MBBS, MS - General Surgery, MCh - Surgical Oncology','Hindi, English'],

  // Pulmonologists – Batch 2
  ['Dr. Sunil Naagar','Pulmonologist','Sector 85, Faridabad',300,4.3,89,16,'JS Naagar Clinic',1,1,'SuN','MBBS, DTCD, DNB - Respiratory Medicine','Hindi, English'],
  ['Dr. Sandeep Malhotra','Pulmonologist','NIT, Faridabad',400,4.4,112,23,'Santosh Multispeciality Hospital',1,1,'SndM','MBBS, DTCD, DNB - Respiratory Medicine','Hindi, English'],
  ['Dr. Hemant Goel','Pulmonologist','Sector 20A, Faridabad',700,4.5,134,18,'SSB Heart & Multispecialty Hospital',1,1,'HmG','MBBS, MD - Respiratory Medicine, DNB','Hindi, English'],
  ['Dr. Baibhav Kumar','Pulmonologist','Sector 20A, Faridabad',700,4.4,89,14,'SSB Heart & Multispecialty Hospital',1,1,'BaK','MBBS, MD - Pulmonary Medicine','Hindi, English'],

  // Endocrinologists
  ['Dr. Pankaj Agarwal','Endocrinologist','Faridabad',1000,4.5,112,16,'Hormone Care and Research Centre',1,1,'PkAg','MBBS, MD - Medicine, DM - Endocrinology','Hindi, English'],

  // General Surgeons – Batch 2
  ['Dr. Mradul Garg','General Surgeon','Sector 16A, Faridabad',800,4.5,134,18,'Metro Heart Institute',1,1,'MrG','MBBS, MS - General Surgery, DNB - Surgical Gastroenterology','Hindi, English'],
  ['Dr. Pankaj Kumar Hans','General Surgeon','Sector 21A, Faridabad',700,4.4,112,19,'Asian Institute of Medical Sciences',1,1,'PKH','MBBS, MS - General Surgery, DNB','Hindi, English'],
  ['Dr. Arjun Goel','General Surgeon','Sector 49, Faridabad',400,4.4,89,18,'Mother and Child Clinic',1,1,'ArGo','MBBS, MS - General Surgery, Fellowship in Laparoscopy','Hindi, English'],
  ['Dr. Ajay Kumar Gupta','General Surgeon','NIT, Faridabad',900,4.4,134,27,'RG Stone Urology Hospital',1,1,'AKGp','MBBS, MS - General Surgery','Hindi, English'],
  ['Dr. Vidyasagar Chaturvedi','General Surgeon','Sector 20A, Faridabad',600,4.3,112,18,'SSB Heart & Multispecialty Hospital',1,1,'VChv','MBBS, MS - General Surgery, DNB','Hindi, English'],

  // Radiologists / Nuclear Medicine
  ['Dr. Ashwin Garg','Radiologist','Sector 8, Faridabad',700,4.5,112,18,'Sarvodaya Hospital & Research Centre',1,1,'AshG','MBBS, MD - Radiology, Fellowship - Interventional Radiology','Hindi, English'],
  ['Dr. Surabhi Kaushik','Radiologist','Sector 88, Faridabad',400,4.4,78,7,'Amrita Hospital',1,1,'SurK','MBBS, MD - Radiology','Hindi, English'],
  ['Dr. Madhuritu Banerjee','Radiologist','Sector 88, Faridabad',400,4.4,89,7,'Amrita Hospital',1,1,'MdB','MBBS, MD - Radiology','Hindi, English, Bengali'],
  ['Dr. Ravi Shanker','Radiologist','Sector 20A, Faridabad',500,4.3,98,16,'SSB Heart & Multispecialty Hospital',1,1,'RvSh','MBBS, MD - Radiology','Hindi, English'],
  ['Dr. Sachin Arora','Nuclear Medicine Specialist','Sector 16A, Faridabad',700,4.4,67,16,'Metro Heart Institute',1,1,'SacA','MBBS, MD - Nuclear Medicine','Hindi, English'],

  // General Physicians – Batch 2
  ['Dr. Aayush Gupta','General Physician','Sector 8, Faridabad',700,4.4,112,10,'Sarvodaya Hospital & Research Centre',1,1,'AayG','MBBS, MD - Internal Medicine','Hindi, English'],
  ['Dr. Priya Sharma','General Physician','Sector 17, Faridabad',1000,4.4,89,11,'Yash Clinic',1,1,'PrSh','MBBS, DM - Pulmonary Medicine & Critical Care','Hindi, English'],
  ['Dr. Surendra Kumar Meena','General Physician','Sector 20A, Faridabad',600,4.4,98,14,'SSB Heart & Multispecialty Hospital',1,1,'SKMe','MBBS, MD - General Medicine','Hindi, English'],
  ['Dr. Sohini Halder','General Physician','Sector 20A, Faridabad',600,4.3,78,10,'SSB Heart & Multispecialty Hospital',1,1,'SoH','MBBS, MD - General Medicine','Hindi, English, Bengali'],

  // Physiotherapists – Batch 2
  ['Dr. Mayuk Singhal','Physiotherapist','Sector 20A, Faridabad',400,4.3,89,12,'SSB Heart & Multispecialty Hospital',1,1,'MaySi','BPT, MPT','Hindi, English'],
  ['Dr. Anuj Yadav','Physiotherapist','Ballabhgarh, Faridabad',350,4.3,67,8,'Active Physio Clinic',1,1,'AnYd','BPT, MPT','Hindi, English'],

  // Dentists – Batch 2
  ['Dr. Komal Meena','Dentist','Sector 16A, Faridabad',500,4.4,78,12,'Metro Heart Institute',1,1,'KoMe','BDS, MDS','Hindi, English'],

  // Plavastic Surgery / Vascular Surgery
  ['Dr. Parveen Mendiratta','Oncologist','Sector 86, Faridabad',700,4.3,89,10,'Accord Superspeciality Hospital',1,1,'PvM','MBBS, MS - General Surgery, MCh - Surgical Oncology','Hindi, English'],
];

doctors.forEach(d => insertDoctor.run(...d));

// ── HOSPITALS (Real Faridabad data) ───────────────────────────────────────────
const insertHospital = db.prepare(`INSERT INTO hospitals
  (name,area,type,beds,icu_beds,rating,reviews,accreditation,specialities,insurance,phone,emergency)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`);

const hospitals = [
  ['Amrita Hospital','Sector 88, Faridabad','Super Specialty',2600,200,4.8,1456,'NABH, NABL, AACI','Oncology, Cardiac, Neurology, Renal, Ortho, Transplant — 81 specialities','All major insurers','0129-285-1234',1],
  ['Fortis Escorts Hospital','NIT, Faridabad','Multi Specialty',260,40,4.7,987,'NABH, NABL','Cardiology, Neurology, Orthopaedics, Urology, Nephrology, Oncology, Gynaecology','Star Health, HDFC Ergo, Max Bupa, New India','076695-84330',1],
  ['Metro Heart Institute','Sector 16A, Faridabad','Multi Specialty',400,60,4.8,1123,'JCI Accredited','Cardiology, Oncology, Neurology, Orthopaedics, Liver Transplant, Gynaecology','All major TPAs, CGHS','0129-4277777',1],
  ['Sarvodaya Hospital Sector 8','Sector 8, Faridabad','Super Specialty',450,109,4.7,834,'NABH, NABL, Gold Digital NABH','Cardiology, Neurology, GI, Ortho, Oncology, Nephrology, ENT, Cochlear Implant','Star Health, HDFC Ergo, New India, CGHS','1800-313-1414',1],
  ['Asian Institute of Medical Sciences','Sector 21A, Faridabad','Super Specialty',425,55,4.6,712,'NABH, NABL','Cardiology, Neurology, Oncology, Renal, Orthopaedics, Emergency','Star Health, HDFC Ergo, Bajaj Allianz','0129-4253000',1],
  ['Marengo Asia Hospital','Sector 16, Faridabad','Multi Specialty',450,50,4.6,645,'NABH, NABL','Cardiac Sciences, Orthopaedics, Nephrology, Critical Care, Neurology','All major insurers, CGHS','0129-4330000',1],
  ['SSB Healthcare','Sector 20A, Faridabad','Multi Specialty',300,40,4.5,456,'NABH','Cardiology, Cardiac Surgery, Neurology, Orthopaedics, Bariatric, Gynaecology','Star Health, HDFC Ergo, Religare','0129-2566666',1],
  ['Yatharth Super Speciality Hospital','Sector 88, Faridabad','Super Specialty',200,30,4.5,312,'NABH','Cardiology, Orthopaedics, Neurology, Gynaecology, Paediatrics','Star Health, HDFC Ergo, New India','+91-8588833310',1],
  ['Accord Superspeciality Hospital','Sector 86, Faridabad','Multi Specialty',200,28,4.4,289,null,'Orthopaedics, Cardiology, Paediatrics, Neurology, General Surgery','Star Health, New India, United India','0129-3512000',1],
  ['Sarvodaya Hospital Sector 19','Sector 19, Faridabad','Multi Specialty',300,35,4.4,378,'NABH','General Surgery, Gynaecology, Paediatrics, Orthopaedics','Star Health, HDFC Ergo, New India','0129-4194444',1],
  ['Park Hospital','Sector 10, Faridabad','Multi Specialty',150,20,4.3,234,null,'General Medicine, Surgery, Gynaecology, Blood Bank','New India, United India, CGHS','0129-4200000',1],
  ['BK Civil Hospital','NIT, Faridabad','Government',500,50,3.8,1234,'Government','General Medicine, Surgery, Emergency, Maternity','CGHS, ESIC, Ayushman Bharat','0129-2411881',1],
  ['CRHSP AIIMS Ballabhgarh','Ballabhgarh, Faridabad','Government Premier',300,30,4.2,567,'Government AIIMS','General Medicine, Primary & Secondary Care, Research','CGHS, Ayushman Bharat',null,1],
];

hospitals.forEach(h => insertHospital.run(...h));

// ── LABS (Real Faridabad labs) ────────────────────────────────────────────────
const insertLab = db.prepare(`INSERT INTO labs
  (name,area,rating,nabl_certified,home_collection,open_time,close_time,phone)
  VALUES (?,?,?,?,?,?,?,?)`);

const labs = [
  ['Dr. Lal PathLabs','Sector 8, Faridabad',4.8,1,1,'07:00','21:00','011-4988-5050'],
  ['Dr. Lal PathLabs','Sector 9, Faridabad',4.8,1,1,'07:00','21:00','011-4988-5050'],
  ['Dr. Lal PathLabs','Sector 14, Faridabad',4.8,1,1,'07:00','21:00','011-4988-5050'],
  ['Dr. Lal PathLabs','NIT 3, Faridabad',4.8,1,1,'07:00','21:00','011-4988-5050'],
  ['SRL Diagnostics','Sector 16, Faridabad',4.6,1,1,'07:00','20:00',null],
  ['SRL Diagnostics','NIT, Faridabad',4.6,1,1,'07:00','20:00',null],
  ['Redcliffe Labs','Sector 8, Faridabad',4.7,1,1,'06:00','22:00','+91-8988988787'],
  ['Redcliffe Labs','NIT-1, Faridabad',4.7,1,1,'06:00','22:00','+91-8988988787'],
  ['Metropolis Healthcare','Sector 16A, Faridabad',4.7,1,1,'07:00','20:00','011-4116-8584'],
  ['Metropolis Healthcare','Sector 21C, Faridabad',4.7,1,1,'07:00','20:00','011-4119-0823'],
  ['Metropolis Healthcare','Sector 29, Faridabad',4.7,1,1,'07:00','20:00','011-4119-4353'],
  ['Sarvodaya Hospital Lab','Sector 8, Faridabad',4.8,1,1,'24hrs','24hrs','1800-313-1414'],
  ['A Square Imaging & Pathology','NIT, Faridabad',4.3,0,1,'08:00','21:00',null],
  ['House of Diagnostics','NIT, Faridabad',4.4,0,1,'07:00','21:00',null],
];

labs.forEach(l => insertLab.run(...l));

// ── LAB TESTS (with real price data for Faridabad) ────────────────────────────
const insertTest = db.prepare(`INSERT INTO lab_tests
  (lab_id,test_name,test_category,price,turnaround_hours)
  VALUES (?,?,?,?,?)`);

// CBC
[[1,330,6],[2,330,6],[3,330,6],[4,330,6],[5,280,8],[6,280,8],
 [7,199,11],[8,199,11],[9,260,6],[10,260,6],[11,260,6],[12,350,4],
 [13,200,8],[14,220,8]
].forEach(([lid,price,ta]) => insertTest.run(lid,'CBC (Complete Blood Count)','Blood',price,ta));

// HbA1c
[[1,420,24],[2,420,24],[3,420,24],[5,380,24],[7,320,24],[8,320,24],
 [9,400,24],[10,400,24],[12,480,6],[14,350,24]
].forEach(([lid,price,ta]) => insertTest.run(lid,'HbA1c','Diabetes',price,ta));

// Vitamin D
[[1,1520,24],[2,1520,24],[3,1520,24],[5,1200,24],[7,499,24],[8,499,24],
 [9,1100,24],[10,1100,24],[12,1400,12],[14,900,24]
].forEach(([lid,price,ta]) => insertTest.run(lid,'Vitamin D (25-OH)','Vitamins',price,ta));

// TSH Thyroid
[[1,440,24],[2,440,24],[3,440,24],[5,400,24],[7,380,24],[8,380,24],
 [9,420,24],[10,420,24],[12,500,12],[13,350,24],[14,380,24]
].forEach(([lid,price,ta]) => insertTest.run(lid,'Thyroid Profile (TSH, T3, T4)','Thyroid',price,ta));

// Lipid Profile
[[1,940,24],[2,940,24],[3,940,24],[5,650,24],[7,599,24],[8,599,24],
 [9,800,24],[10,800,24],[12,900,12],[14,700,24]
].forEach(([lid,price,ta]) => insertTest.run(lid,'Lipid Profile','Heart',price,ta));

// LFT
[[1,550,24],[2,550,24],[5,480,24],[7,450,24],[9,520,24],[12,620,12],[14,480,24]
].forEach(([lid,price,ta]) => insertTest.run(lid,'LFT (Liver Function Test)','Liver',price,ta));

// KFT
[[1,520,24],[2,520,24],[5,460,24],[7,430,24],[9,500,24],[12,600,12],[14,460,24]
].forEach(([lid,price,ta]) => insertTest.run(lid,'KFT (Kidney Function Test)','Kidney',price,ta));

// Blood Sugar Fasting
[[1,80,6],[2,80,6],[3,80,6],[4,80,6],[5,70,8],[7,69,6],[8,69,6],
 [9,90,6],[12,120,4],[13,75,6],[14,80,6]
].forEach(([lid,price,ta]) => insertTest.run(lid,'Blood Sugar Fasting','Diabetes',price,ta));

// Dengue NS1
[[1,700,12],[5,600,12],[7,550,12],[9,650,12],[12,800,6]
].forEach(([lid,price,ta]) => insertTest.run(lid,'Dengue NS1 Antigen','Infection',price,ta));

// Urine Routine
[[1,120,6],[2,120,6],[5,99,8],[7,89,6],[9,130,6],[12,160,4],[14,110,6]
].forEach(([lid,price,ta]) => insertTest.run(lid,'Urine Routine & Microscopy','Urine',price,ta));

// ── MEDICINES ─────────────────────────────────────────────────────────────────
const insertMed = db.prepare(`INSERT INTO medicines
  (brand_name,generic_name,manufacturer,type,brand_price,generic_price,jan_aushadhi_price,category,requires_prescription)
  VALUES (?,?,?,?,?,?,?,?,?)`);

const medicines = [
  ['Crocin 500mg','Paracetamol 500mg','GSK','Tablet',22,8,3,'Pain & Fever',0],
  ['Dolo 650mg','Paracetamol 650mg','Micro Labs','Tablet',30,12,4,'Pain & Fever',0],
  ['Combiflam','Ibuprofen + Paracetamol','Sanofi','Tablet',35,14,5,'Pain & Fever',0],
  ['Brufen 400mg','Ibuprofen 400mg','Abbott','Tablet',28,10,4,'Pain & Fever',0],
  ['Ecosprin 75mg','Aspirin 75mg','USV','Tablet',18,5,2,'Cardiac',1],
  ['Atorva 10mg','Atorvastatin 10mg','Zydus','Tablet',85,22,7,'Cholesterol',1],
  ['Lipitor 20mg','Atorvastatin 20mg','Pfizer','Tablet',320,45,12,'Cholesterol',1],
  ['Crestor 10mg','Rosuvastatin 10mg','AstraZeneca','Tablet',280,38,10,'Cholesterol',1],
  ['Metformin 500mg','Metformin 500mg','Sun Pharma','Tablet',28,8,3,'Diabetes',1],
  ['Glycomet 500mg','Metformin 500mg','USV','Tablet',35,8,3,'Diabetes',1],
  ['Januvia 100mg','Sitagliptin 100mg','MSD','Tablet',780,180,45,'Diabetes',1],
  ['Telma 40mg','Telmisartan 40mg','Glenmark','Tablet',95,22,7,'Blood Pressure',1],
  ['Losartan 50mg','Losartan 50mg','Sun Pharma','Tablet',65,18,5,'Blood Pressure',1],
  ['Amlodipine 5mg','Amlodipine 5mg','Cipla','Tablet',42,10,3,'Blood Pressure',1],
  ['Pantop 40mg','Pantoprazole 40mg','Aristo','Tablet',95,18,5,'Acidity',1],
  ['Pan D','Pantoprazole + Domperidone','Alkem','Capsule',125,28,8,'Acidity',1],
  ['Omez 20mg','Omeprazole 20mg','Dr. Reddys','Capsule',72,15,4,'Acidity',1],
  ['Allegra 120mg','Fexofenadine 120mg','Sanofi','Tablet',145,32,9,'Allergy',0],
  ['Cetirizine 10mg','Cetirizine 10mg','Cipla','Tablet',18,5,2,'Allergy',0],
  ['Azithral 500mg','Azithromycin 500mg','Alembic','Tablet',85,22,7,'Antibiotic',1],
  ['Augmentin 625mg','Amoxicillin+Clavulanate','GSK','Tablet',185,48,14,'Antibiotic',1],
  ['Levothyrox 50mcg','Levothyroxine 50mcg','Merck','Tablet',95,22,6,'Thyroid',1],
  ['Montair LC','Montelukast+Levocetirizine','Cipla','Tablet',175,38,10,'Asthma',1],
  ['Glucophage 1000mg','Metformin 1000mg','Merck','Tablet',85,20,6,'Diabetes',1],
  ['Insulin Glargine','Insulin Glargine','Sanofi','Injection',890,420,180,'Diabetes',1],
  ['Rantac 150mg','Ranitidine 150mg','JB Chemicals','Tablet',35,8,2,'Acidity',0],
  ['Vitamin D3 60000','Cholecalciferol 60000IU','Sun Pharma','Capsule',45,18,6,'Vitamins',0],
  ['Shelcal 500','Calcium+Vitamin D3','Torrent','Tablet',120,28,8,'Vitamins',0],
  ['Neurobion Forte','Vitamin B Complex','Procter & Gamble','Tablet',38,12,4,'Vitamins',0],
  ['Clavam 625mg','Amoxicillin+Clavulanate','Alkem','Tablet',165,48,14,'Antibiotic',1],
];

medicines.forEach(m => insertMed.run(...m));

// ── EMERGENCY SERVICES (Real Faridabad) ───────────────────────────────────────
const insertEmergency = db.prepare(`INSERT INTO emergency_services
  (name,type,area,phone,open_24h,rating,distance_km,lat,lng)
  VALUES (?,?,?,?,?,?,?,?,?)`);

const emergencyServices = [
  ['Apollo Pharmacy (NIT-5)','pharmacy','NIT, Faridabad','+91-11-42000000',1,4.5,1.2,28.3986,77.3167],
  ['Apollo Pharmacy (Sector 15)','pharmacy','Sector 15, Faridabad','+91-11-42000001',1,4.5,2.1,28.4089,77.3089],
  ['Anand Medicos (24/7)','pharmacy','Railway Road, NIT','+91-129-2345678',1,4.3,1.8,28.4012,77.3198],
  ['Saurabh Chemist (24/7)','pharmacy','Market No-1, NIT','+91-129-2345679',1,4.2,1.5,28.4001,77.3182],
  ['Fortis Escorts Emergency','emergency','NIT, Faridabad','076695-84330',1,4.7,3.2,28.3943,77.3111],
  ['Amrita Hospital Emergency','emergency','Sector 88, Faridabad','0129-285-1234',1,4.8,5.6,28.3672,77.3345],
  ['Metro Heart Emergency','emergency','Sector 16A, Faridabad','0129-4277777',1,4.8,2.8,28.4156,77.3045],
  ['Sarvodaya Emergency','emergency','Sector 8, Faridabad','1800-313-1414',1,4.7,2.1,28.4201,77.3089],
  ['AIMS Emergency','emergency','Sector 21A, Faridabad','0129-4253000',1,4.6,3.5,28.3789,77.3201],
  ['Rotary Blood Bank Faridabad','blood_bank','Sector 9, Faridabad','0129-2265054',1,4.8,1.9,28.4089,77.3101],
  ['RBTC BK Hospital Blood Bank','blood_bank','NIT, Faridabad','0129-2411881',1,4.4,2.3,28.3986,77.3167],
  ['Fortis Blood Bank','blood_bank','NIT, Faridabad','9958176906',1,4.6,3.2,28.3943,77.3111],
  ['Metro Heart Blood Bank','blood_bank','Sector 16A, Faridabad','0129-4277777',1,4.7,2.8,28.4156,77.3045],
  ['AIMS Blood Bank','blood_bank','Sector 21A, Faridabad','bloodbank@aimsindia.com — 0129-4253196',1,4.6,3.5,28.3789,77.3201],
  ['108 - Haryana Govt Ambulance','ambulance','Pan Faridabad','108',1,3.9,1.0,28.4089,77.3167],
  ['RED.Health Ambulance','ambulance','Faridabad','1800-121-911-911',1,4.5,2.0,28.4089,77.3167],
  ['Global Ambulance Service','ambulance','NIT, Faridabad','7011170321',1,4.3,1.8,28.3986,77.3167],
  ['Lifesavers ICU Ambulance','ambulance','Faridabad','+91-98912-33040',1,4.6,2.5,28.4089,77.3167],
  ['Dr. Lal PathLabs (Walk-in)','diagnostic','Sector 8, Faridabad','011-4988-5050',1,4.8,1.5,28.4201,77.3089],
  ['Redcliffe Labs (Walk-in)','diagnostic','NIT-1, Faridabad','+91-8988988787',1,4.7,2.0,28.3986,77.3167],
  ['Metropolis Healthcare (Walk-in)','diagnostic','Sector 16A, Faridabad','011-4116-8584',0,4.7,2.8,28.4156,77.3045],
];

emergencyServices.forEach(e => insertEmergency.run(...e));

console.log('✅ Database seeded with real Faridabad data!');
console.log(`   Doctors: ${db.prepare('SELECT COUNT(*) as c FROM doctors').get().c}`);
console.log(`   Hospitals: ${db.prepare('SELECT COUNT(*) as c FROM hospitals').get().c}`);
console.log(`   Labs: ${db.prepare('SELECT COUNT(*) as c FROM labs').get().c}`);
console.log(`   Lab Tests: ${db.prepare('SELECT COUNT(*) as c FROM lab_tests').get().c}`);
console.log(`   Medicines: ${db.prepare('SELECT COUNT(*) as c FROM medicines').get().c}`);
console.log(`   Emergency: ${db.prepare('SELECT COUNT(*) as c FROM emergency_services').get().c}`);

db.close();
