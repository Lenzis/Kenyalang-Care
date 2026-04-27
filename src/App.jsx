import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Moon, Sun, ClipboardCheck,
  ChevronRight, ChevronDown, BookOpen, 
  GraduationCap, Briefcase, Calculator, Building2, 
  Map, Droplets, Landmark, FileText, Heart, Users, 
  UtilityPole, Sparkles, Eye, Lock, X, MessageCircle, 
  AlertTriangle, Bug, User, Settings, LogOut, Check, 
  Wallet, CalendarDays, Stethoscope, Filter, Sparkle, 
  ShieldCheck, Info, LogIn, UserPlus, Clock, Send, 
  FileSearch, SlidersHorizontal, Mail, Fingerprint, 
  EyeOff, Lightbulb, UserCheck, MapPin, Phone, Edit3, 
  ShieldAlert, ShieldQuestion, Loader2, Landmark as Bank, 
  Sprout, Gavel, Waves, Zap, FileUp, Droplet, Plus, 
  Trash2, Save, History, AtSign, Smartphone, Activity, 
  UserRound, Menu, Camera, Maximize, ZoomIn, UserCog, 
  RefreshCw, Palette, LayoutGrid, Globe, Link as LinkIcon,
  GraduationCap as SchoolIcon, ChevronUp, Minimize2, Image,
  MessageSquare
} from 'lucide-react';

// --- Global UI Strings ---
const UI_TEXT = {
  title: 'Kenyalang Care', 
  adminPanel: 'Management Hub',
  aboutUs: 'About us', 
  privacy: 'Privacy policy', 
  noResults: 'No records found matching your search.', 
  authTitleLogin: 'User Access', 
  authTitleAdmin: 'Admin Unlock',
  authTitleSignup: 'Create Profile', 
  authSubtitleSignup: 'Official Sarawak Digital Identity',
  authErrorNotFound: "Identity not recognized.",
  authErrorWrongCreds: "Verification failed.",
  signUpWarning: "Once created, core details like your Name and MyKad (IC) are locked for security purposes.",
  about: "Kenyalang Care is the official digital services gateway for the citizens of Sarawak. Managed by the Digital Sarawak Unit, we aim to bridge the gap between government assistance and the community through high-efficiency identity verification and service accessibility.",
  privacyUrl: "https://www.termsfeed.com/live/d6005081-c8db-4c74-a101-75a592693761"
};

// --- Global Icon Mapping ---
const IconMap = { 
  GraduationCap, BookOpen, Bank, Sparkles, ClipboardCheck, 
  Briefcase, Building2, Sprout, FileText, Heart, Users, 
  UtilityPole, UserCog, RefreshCw, Palette, LayoutGrid,
  Calculator, FileUp, Droplets, Landmark, Globe, CalendarDays, FileSearch,
  Zap, Gavel, Waves, Smartphone, Activity, SchoolIcon, Bug, Droplet
};

// --- Mock Databases ---
const INITIAL_CITIZENS = [
  {
    id: "KC-980404135567",
    name: "Alexander Anak Robert",
    ic: "980404-13-5567",
    password: "User123!", 
    race: "Iban", religion: "Christianity", mobile: "123456789",
    applications: [{ id: "APP-001", name: "Kenyalang Gold Card", status: "Approved", date: "26 Apr 2026" }]
  }
];

const INITIAL_ADMINS = [
  { id: "#KC130001", name: "System Administrator", email: "admin@sarawak.gov.my" }
];

const INITIAL_BUGS = [
  { id: 1, desc: "Status not updating on mobile view.", screenshot: null, user: "KC-980404135567", time: "26 Apr 2026" }
];

// --- Exhaustive 290+ Item Service Catalog ---
const INITIAL_SERVICES = [
  // --- SCHOOL AND STUDENTS ---
  { id: 1, group: "student", title: { en: "1. Aids / Bantuan for student" }, icon: "SchoolIcon", items: [
    { en: "Special Financial Assistance for Sarawak Student", desc: "Online Form", link: "https://myys.yayasansarawak.org.my/student_self_registration/step_1_form.php" },
    { en: "Laptop", desc: "Online Form", link: "https://myys.yayasansarawak.org.my/student_self_registration/step_1_form.php" },
    { en: "Book", desc: "Online Form", link: "https://myys.yayasansarawak.org.my/student_self_registration/step_1_form.php" },
    { en: "Free school transport", desc: "Please Apply Via School Authorities", link: "#" },
    { en: "School scholarship", desc: "Please Apply Via School Authorities", link: "#" },
    { en: "Tuition", desc: "Please Apply Via School Authorities", link: "#" },
    { en: "Uniform", desc: "Please Apply Via School Authorities", link: "#" }
  ]},
  { id: 2, group: "student", title: { en: "2. Biasiswa" }, icon: "BookOpen", items: [
    { en: "Biasiswa yayasan sarawak tun taib", desc: "Online Portal", link: "http://175.138.68.197:5300/Account/UserLogin.aspx?AspxAutoDetectCookieSupport=1" },
    { en: "Yayasan biasiswa Sarawak tunku Abdul rahman (YBSTAR)", desc: "Online Portal", link: "http://175.138.68.197:5300/Account/UserLogin.aspx" },
    { en: "Biasiswa khas program perubatan unias", desc: "Not Available", link: "#" },
    { en: "Biasiswa tempatan yayasan sarawak", desc: "Not Available", link: "#" },
    { en: "Bantuan kemasukan ke IPT", desc: "Online Portal", link: "http://175.138.68.197:51/iwps/Account/UserLogin.aspx" },
    { en: "Bursari BP40", desc: "Not Available", link: "#" },
    { en: "Inisiatif Graduan Pulang Sarawak (i - GPS)", desc: "Online Portal", link: "http://175.138.68.197:51/iwps/Account/UserLogin.aspx" }
  ]},
  { id: 3, group: "student", title: { en: "3. Pinjaman" }, icon: "Calculator", items: [
    { en: "Biasiswa pinjaman pelajaran dalam negara", desc: "Online Portal", link: "http://175.138.68.197:51/iwps/Account/UserLogin.aspx" },
    { en: "Pinjaman pelajaran luar negara", desc: "Online Portal", link: "http://175.138.68.197:51/iwps/Account/UserLogin.aspx" },
    { en: "Biasiswa pinjaman latihan teknikal", desc: "Online Portal", link: "http://175.138.68.197:51/iwps/Account/UserLogin.aspx" }
  ]},
  { id: 4, group: "student", title: { en: "4. Program dan bantuan" }, icon: "Users", items: [
    { en: "Biasiswa program pertukaran pelajaran", desc: "Form Download", link: "https://yayasansarawak.org.my/wp-content/uploads/2022/10/Borang-Permohonan-Pertukaran-Pelajaran-2022.pdf" },
    { en: "Program pendidikan komuniti", desc: "Not Available", link: "#" },
    { en: "Program bantuan pakaian seragam sekolah", desc: "Not Available", link: "#" },
    { en: "Program HiPERS ( sekolah luar bandar berprestasi tinggi)", desc: "Not Available", link: "#" },
    { en: "Perkhidmatan pengangkutan percuma pelajar sekolah", desc: "Not Available", link: "#" },
    { en: "Program tuisyen sekolah menengah", desc: "Not Available", link: "#" },
    { en: "Anugerah khas premier sarawak (AKPS)", desc: "Not Available (None)", link: "#" },
    { en: "Program pemerkasaan Bahasa inggeris (EPP)", desc: "Not Available", link: "#" },
    { en: "Anugerah Graduan Cemerlang", desc: "Not Available", link: "#" },
    { en: "YS-JPNS Collaborations Programs", desc: "Not Available", link: "#" }
  ]},
  { id: 5, group: "student", title: { en: "6. Bayaran balık pijaman" }, icon: "RefreshCw", items: [
    { en: "Kaedah", desc: "Not Available", link: "#" },
    { en: "Insentif", desc: "Not Available", link: "#" }
  ]},
  { id: 6, group: "student", title: { en: "7. Hantar Keputusan Semester / Laporan Prestasi Pengajian" }, icon: "FileUp", items: [
    { en: "Form", desc: "Online Form", link: "https://docs.google.com/forms/d/e/1FAIpQLSfhg1nbHOw4N_i8T212qY3QjZNM6nB1EdH4vsHszc9PNV8MDw/viewform" }
  ]},

  // --- SERVICE SARAWAK ---
  { id: 7, group: "service", title: { en: "1. Council Service" }, icon: "Building2", items: [
    { en: "Apply for e-Billing of Assessment Rates Bills", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/288/" },
    { en: "Application for Form G(1)-Certificate of Clearance of Indebtedness", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/270/" },
    { en: "Apply for Update Owner / Rate Payer Information with Local Councils", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/272/" },
    { en: "Apply for Rebate of Assessment Rates", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/274/" },
    { en: "Application for Transfer of Ownership of Rateable Holdings with Local Councils", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/271/" },
    { en: "Apply for Payment of Assessment Rates by Installment", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/275/" },
    { en: "Apply for House Numbering and Referencing of Rateable New Holding", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/276/" },
    { en: "Application for withdrawal of caveat with Local Councils", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/273/" },
    { en: "Apply for Remission of Rates", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/287/" }
  ]},
  { id: 8, group: "service", title: { en: "2. Utilities" }, icon: "Droplets", items: [
    { en: "Online Request of Hydrological Data (Private Agency/Organization)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/609/" },
    { en: "Change of Water Supply Account Ownership", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/293/" },
    { en: "Online Request of Hydrological Data (Individual)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/605/" },
    { en: "Renew Pipe Fitter licence", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/618/" },
    { en: "Apply for Delay Payment of Outstanding Water Bill", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/303/" },
    { en: "Request for Water Meter Replacement due to Meter Lost", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/296/" },
    { en: "Application For New Water Supply Connection", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/289/" },
    { en: "Request to Update Water Supply Consumer Account Information", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/312/" },
    { en: "Online Purchase of Sarawak Hydrological Year Book (Organization)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/600/" },
    { en: "Online Purchase of Sarawak Hydrological Year Book (Individual)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/597/" },
    { en: "Request to Change Water Tariff Classification", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/297/" },
    { en: "Renew Mains Layer License", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/616/" },
    { en: "Online Request of Hydrological Data (Government Agency/Semi Governement Agency)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/602/" },
    { en: "Apply for Mains Layer License", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/614/" },
    { en: "Application for Import Permit for Electrical Appliances (Individual)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/341/" },
    { en: "Apply for Relocation or Reposition of Water Meter", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/298/" },
    { en: "Reconnection of Water Supply due to Voluntary Disconnection", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/301/" },
    { en: "Apply for Disconnection of Water Supply Permenantly", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/290/" },
    { en: "New application for Certificate of Competency as Cable Jointer", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/335/" },
    { en: "Apply for Disconnection of Water Supply Temporarily", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/291/" },
    { en: "Request to Change Water Bill Delivery to Care Off Address", desc: "Not Available", link: "#" },
    { en: "Apply for Pipe Fitter License", desc: "Not Available", link: "#" },
    { en: "Online Request of Hydrological Data (IPTA/IPTS)", desc: "Not Available", link: "#" },
    { en: "Apply for Quarter's Final Water Bill", desc: "Not Available", link: "#" },
    { en: "Apply for Bekalan Elektrik Luar Bandar (BELB)", desc: "Not Available", link: "#" },
    { en: "Endorsement for Certificate of Competency as a Chargeman", desc: "Not Available", link: "#" },
    { en: "Endorsement for Certificate of Registration as an Electrical Installation Contractor", desc: "Not Available", link: "#" },
    { en: "Request of Water Meter Testing", desc: "Not Available", link: "#" },
    { en: "New application for Registration Certificate as an Electrical Installation Contractor", desc: "Not Available", link: "#" },
    { en: "New application for Certificate of Competency as Competent Electrical Engineer", desc: "Not Available", link: "#" },
    { en: "New application for Certificate of Competency as an Electrical Supervisor", desc: "Not Available", link: "#" },
    { en: "Apply for Lampu Jalan Kampung (LJK)", desc: "Not Available", link: "#" },
    { en: "Renewal for Certificate of Registration as an Electrical Installation Contractor", desc: "Not Available", link: "#" },
    { en: "Apply for Rural Water Supply in Sarawak", desc: "Not Available", link: "#" },
    { en: "Endorsement for Certificate of Registration as an Electrical Installation Contractor for Authorized to Test", desc: "Not Available", link: "#" },
    { en: "Apply For Adjustment And/Or Installment Of Water Bill Due To High Meter Reading", desc: "Not Available", link: "#" },
    { en: "Renewal application for Certificate of Competency as a Competent Electrical Engineer", desc: "Not Available", link: "#" },
    { en: "Endorsement for Certificate of Competency as a Competent Electrical Engineer", desc: "Not Available", link: "#" },
    { en: "Replacement for Certificate of Competency as a Chargeman", desc: "Not Available", link: "#" },
    { en: "Endorsement for Certificate of Competency as a Cable Jointer", desc: "Not Available", link: "#" },
    { en: "Application for Distribution of Gas Licence", desc: "Not Available", link: "#" },
    { en: "Replacement for Certificate of Competency as a Competent Electrical Engineer", desc: "Not Available", link: "#" },
    { en: "Renewal Certificate of Competency as an Electrical Supervisor", desc: "Not Available", link: "#" },
    { en: "Endorsement for Certificate of Competency as an Electrical Supervisor", desc: "Not Available", link: "#" },
    { en: "Replacement for Certificate of Registration as an Electrical Installation Contractor", desc: "Not Available", link: "#" },
    { en: "Renewal for Certificate of Competency as a Cable Jointer", desc: "Not Available", link: "#" },
    { en: "Replacement for Certificate of Competency as a Cable Jointer", desc: "Not Available", link: "#" },
    { en: "Application for Approval to Install (ATI) for the Gas Piping Installation", desc: "Not Available", link: "#" },
    { en: "Application for Approval to Operate (ATO) for the Gas Piping Installation", desc: "Not Available", link: "#" },
    { en: "Application for Certificate of Competency for Gas", desc: "Not Available", link: "#" },
    { en: "Application for Certificate of Registration as Gas Contractor", desc: "Not Available", link: "#" },
    { en: "Application for Certificate of Approval (COA) for Gas Fittings, Gas Appliances and Gas Equipment.", desc: "Not Available", link: "#" },
    { en: "Application for Certificate of Practice for Gas", desc: "Not Available", link: "#" },
    { en: "Application for Certificate of Approval (COA) for Assembler, Manufacturer or Importer of Gas Fittings, Gas Appliances and Gas Equipment.", desc: "Not Available", link: "#" },
    { en: "Application for Import Permit for Gas Fittings, Gas Appliances and Gas Equipment", desc: "Not Available", link: "#" },
    { en: "Application for Letter Of Release for Gas Fittings, Gas Appliances, and Gas Equipment.", desc: "Not Available", link: "#" }
  ]},
  { id: 9, group: "service", title: { en: "3. Business & Trade" }, icon: "Briefcase", items: [
    { en: "Register Contractors and Consultants with UPKJ", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/714/" },
    { en: "Sarawak Micro Credit Scheme (SMCS)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/390/" },
    { en: "Apply for Manufacturing Permit and Industrial Lot", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/330/" },
    { en: "Contractor and Supplier Registration, Catalogue Management, Bidding, Quotation and Tender Submission (eProcurement)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/595/" },
    { en: "Application To Become Panel Travel Agent", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/746/" },
    { en: "Application to become Panel Hotel", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/745/" },
    { en: "Siting Application for Telecommunication Tower and Structures", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/740/" },
    { en: "State e-Procurement Solution: Quotation and Tender Notices", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/751/" },
    { en: "Application for Wayleave (Telecommunication)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/789/" },
    { en: "Application for Rooftop Structure & In-Building System", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/749/" },
    { en: "Application for Permit to Operate (Telecommunication)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/791/" }
  ]},
  { id: 10, group: "service", title: { en: "4. Hydrology" }, icon: "Droplet", items: [
    { en: "Online Request of Hydrological Data (Private Agency/Organization)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/609/" },
    { en: "Online Request of Hydrological Data (Individual)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/605/" },
    { en: "Online Purchase of Sarawak Hydrological Year Book (Organization)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/600/" },
    { en: "Online Purchase of Sarawak Hydrological Year Book (Individual)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/597/" },
    { en: "Online Request of Hydrological Data (Government Agency/Semi Governement Agency)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/602/" },
    { en: "Online Request of Hydrological Data (IPTA/IPTS)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/607/" }
  ]},
  { id: 11, group: "service", title: { en: "5. License & Permit" }, icon: "FileSearch", items: [
    { en: "New Application for Sarawak Malaysia My Second Home (SMM2H)", desc: "Not Available", link: "#" },
    { en: "Certificate of Competency as a Wireman", desc: "Not Available", link: "#" },
    { en: "Certificate of Competency as a Chargeman", desc: "Not Available", link: "#" },
    { en: "Renewal of Wireman Competency Certificate", desc: "Not Available", link: "#" },
    { en: "Renew Pipe Fitter licence", desc: "Not Available", link: "#" },
    { en: "Apply for Renewal of Chargeman Competency Certificate", desc: "Not Available", link: "#" },
    { en: "Application for SPA Qualified Person Registration", desc: "Not Available", link: "#" },
    { en: "Application for Renewal of SPA Qualified Person", desc: "Not Available", link: "#" },
    { en: "Renew Mains Layer License", desc: "Not Available", link: "#" },
    { en: "Apply for Mains Layer License", desc: "Not Available", link: "#" },
    { en: "SPA Qualified Person Certificate", desc: "Not Available", link: "#" },
    { en: "Apply for Certificate of Water Supply Products", desc: "Not Available", link: "#" },
    { en: "Apply for Pipe Fitter License", desc: "Not Available", link: "#" },
    { en: "Application for Registration of EIA Consultant (Individual Registration by Consultant Firm)", desc: "Not Available", link: "#" },
    { en: "Application for Renewal of Registration of EIA Individual Consultant", desc: "Not Available", link: "#" },
    { en: "Application for Renewal of Registration of EIA Consultant Firm", desc: "Not Available", link: "#" },
    { en: "Application for Registration of EIA Consultant (Firm Registration)", desc: "Not Available", link: "#" },
    { en: "Siting Application for Telecommunication Tower and Structures", desc: "Not Available", link: "#" },
    { en: "Application for Registration of EIA Consultant (Individual Member Registration)", desc: "Not Available", link: "#" },
    { en: "New application for Registration Certificate as an Electrical Installation Contractor", desc: "Not Available", link: "#" },
    { en: "Apply for Registration & Appointment of Muslim Cemetery Committee", desc: "Not Available", link: "#" },
    { en: "Application for Renewal of EIA Consultant Registration (Individual Renewal by Consultant Firm)", desc: "Not Available", link: "#" },
    { en: "Apply for Endorsement of Wireman", desc: "Not Available", link: "#" },
    { en: "Update Membership of Professional Bodies for SPA Qualified Person", desc: "Not Available", link: "#" },
    { en: "Apply for Certificate of Approval to Manufacture, Import, Display, Sell or Advertise Equipment", desc: "Not Available", link: "#" },
    { en: "Apply for Certificate of Registration as a Switchboard Manufacturer", desc: "Not Available", link: "#" },
    { en: "Apply for Replacement of Wireman certificate", desc: "Not Available", link: "#" },
    { en: "Update of EIA Consultant information", desc: "Not Available", link: "#" },
    { en: "Application for Rooftop Structure & In-Building System", desc: "Not Available", link: "#" },
    { en: "Application of Storage Licence for Carbon Storage", desc: "Not Available", link: "#" },
    { en: "Replacement for Certificate of Competency as an Electrical Supervisor", desc: "Not Available", link: "#" },
    { en: "Renewal of Council Operating License", desc: "Not Available", link: "#" },
    { en: "Application of Storage Permit for Carbon Storage", desc: "Not Available", link: "#" },
    { en: "Lists of Approved Licensed Mains Layer and Licensed Pipe Fitter", desc: "Not Available", link: "#" },
    { en: "Application for Change of Permanent Specialist", desc: "Not Available", link: "#" },
    { en: "Application of Storage Operator for Carbon Storage", desc: "Not Available", link: "#" },
    { en: "List of Approved Water Supply Product Certificate", desc: "Not Available", link: "#" },
    { en: "SPA Application for Planning Permission of Development of Land", desc: "Not Available", link: "#" },
    { en: "SPA Application for Siting", desc: "Not Available", link: "#" },
    { en: "Application of Licence Extension for Carbon Storage", desc: "Not Available", link: "#" },
    { en: "Application for Storage Site Management for Carbon Storage", desc: "Not Available", link: "#" },
    { en: "Application for Termination of Storage Operator", desc: "Not Available", link: "#" }
  ]},
  { id: 12, group: "service", title: { en: "6. Life Events" }, icon: "CalendarDays", items: [
    { en: "Apply for Senior Citizen Health Benefit (SCHB)", desc: "Not Available", link: "#" },
    { en: "Apply Job with State Government", desc: "Not Available", link: "#" },
    { en: "Check Status Kenyalang Gold Card (KGC)", desc: "Not Available", link: "#" },
    { en: "Apply for Registration & Appointment of Muslim Cemetery Committee", desc: "Not Available", link: "#" },
    { en: "Application for Renewal of EIA Consultant Registration (Individual Renewal by Consultant Firm)", desc: "Not Available", link: "#" },
    { en: "Apply for Endorsement of Wireman", desc: "Not Available", link: "#" },
    { en: "Update Membership of Professional Bodies for SPA Qualified Person", desc: "Not Available", link: "#" },
    { en: "Apply for Certificate of Approval to Manufacture, Import, Display, Sell or Advertise Equipment", desc: "Not Available", link: "#" },
    { en: "Apply for Certificate of Registration as a Switchboard Manufacturer", desc: "Not Available", link: "#" },
    { en: "Apply for Replacement of Wireman certificate", desc: "Not Available", link: "#" },
    { en: "Update of EIA Consultant information", desc: "Not Available", link: "#" },
    { en: "Application for Rooftop Structure & In-Building System", desc: "Not Available", link: "#" },
    { en: "Application of Storage Licence for Carbon Storage", desc: "Not Available", link: "#" },
    { en: "Replacement for Certificate of Competency as an Electrical Supervisor", desc: "Not Available", link: "#" },
    { en: "Renewal of Council Operating License", desc: "Not Available", link: "#" },
    { en: "Application of Storage Permit for Carbon Storage", desc: "Not Available", link: "#" },
    { en: "Lists of Approved Licensed Mains Layer and Licensed Pipe Fitter", desc: "Not Available", link: "#" },
    { en: "Application for Change of Permanent Specialist", desc: "Not Available", link: "#" },
    { en: "Application of Storage Operator for Carbon Storage", desc: "Not Available", link: "#" },
    { en: "List of Approved Water Supply Product Certificate", desc: "Not Available", link: "#" },
    { en: "SPA Application for Planning Permission of Development of Land", desc: "Not Available", link: "#" },
    { en: "SPA Application for Siting", desc: "Not Available", link: "#" },
    { en: "Request for Permission to Get Married", desc: "Not Available", link: "#" },
    { en: "Pre Marriage Course Registration", desc: "Not Available", link: "#" },
    { en: "Native Court Sarawak: Case Status Enquiry", desc: "Not Available", link: "#" },
    { en: "Islamic Religious Enquiry", desc: "Not Available", link: "#" },
    { en: "Application for Adat Marriage Pre-Registration", desc: "Not Available", link: "#" },
    { en: "Request for Tuntutan Perceraian", desc: "Not Available", link: "#" },
    { en: "Request for Tuntutan Fasakh", desc: "Not Available", link: "#" },
    { en: "Request for Pengesahan Status Janda / Balu / Duda", desc: "Not Available", link: "#" },
    { en: "Request for Tuntutan Hak Tempat Tinggal", desc: "Not Available", link: "#" },
    { en: "Request for Pengesahan Ruju", desc: "Not Available", link: "#" },
    { en: "Request for Perisytiharan Pembubaran Perkahwinan Kerana Pertukaran Agama", desc: "Not Available", link: "#" },
    { en: "Request for Faraq Nikah", desc: "Not Available", link: "#" },
    { en: "Request for Tuntutan Gantirugi Pertunangan", desc: "Not Available", link: "#" },
    { en: "Request for Permission to Get Married 'Berwali Hakim Bukan Warganegara'", desc: "Not Available", link: "#" },
    { en: "Request for Permission to Get Married 'Perempuan Yang Bercerai Tanpa ‘Iddah / Janda Berhias'", desc: "Not Available", link: "#" },
    { en: "Request for Pengesahan ‘Iddah", desc: "Not Available", link: "#" },
    { en: "Request for Tuntutan Ila’", desc: "Not Available", link: "#" },
    { en: "Request for Tuntutan Harta Sepencarian Semasa Poligami", desc: "Not Available", link: "#" },
    { en: "Request for Tuntutan Pengesahan Lafaz Cerai", desc: "Not Available", link: "#" },
    { en: "Request for Tuntutan Sabitan Nusyuz", desc: "Not Available", link: "#" },
    { en: "Request for Pertukaran ‘Iddah", desc: "Not Available", link: "#" },
    { en: "Request for Tuntutan Khulu’ / Tebus Talaq", desc: "Not Available", link: "#" },
    { en: "Request for Tuntutan Wali Enggan / Ingkar", desc: "Not Available", link: "#" },
    { en: "Request for Tuntutan Pengesahan Cerai Ta’liq", desc: "Not Available", link: "#" },
    { en: "Request for Tuntutan Li’an", desc: "Not Available", link: "#" },
    { en: "Request Permission to Get Married 'Berwali Disebabkan Wali Dalam Ihram Haji / Umrah'", desc: "Not Available", link: "#" },
    { en: "Request for Tuntutan Zihar", desc: "Not Available", link: "#" }
  ]},
  { id: 13, group: "service", title: { en: "7. Social & Community" }, icon: "Heart", items: [
    { en: "Check Status Sarawak Basic Needs Assistance (SKAS) 2026", desc: "Not Available", link: "#" },
    { en: "Application for Public Housing", desc: "Not Available", link: "#" },
    { en: "Apply for Senior Citizen Health Benefit (SCHB)", desc: "Not Available", link: "#" },
    { en: "Check Eligibility Status for Senior Citizen Health Benefit (SCHB)", desc: "Not Available", link: "#" },
    { en: "Apply for Bantuan Ibu Bersalin (BIB)", desc: "Not Available", link: "#" },
    { en: "Check Balance for Senior Citizen Health Benefit (SCHB)", desc: "Not Available", link: "#" },
    { en: "Check Clinic Panel List for Senior Citizen Health Benefit (SCHB)", desc: "Not Available", link: "#" },
    { en: "Apply Job with State Government", desc: "Not Available", link: "#" },
    { en: "Admission Ticket To Museums In Sarawak Under Sarawak Museum Department", desc: "Not Available", link: "#" },
    { en: "Activate Kenyalang Gold Card (KGC)", desc: "Not Available", link: "#" },
    { en: "Check Status Kenyalang Gold Card (KGC)", desc: "Not Available", link: "#" },
    { en: "Apply to be Recognized as Sarawak Natives", desc: "Not Available", link: "#" },
    { en: "Admission Ticket to Sarawak's National Parks/Nature Reserves/Wildlife Centres", desc: "Not Available", link: "#" },
    { en: "Apply for Endowment Fund Sarawak (EFS)", desc: "Not Available", link: "#" },
    { en: "TALIKHIDMAT", desc: "Not Available", link: "#" },
    { en: "Apply for Bantuan Ketua Isi Rumah Wanita Sarawak", desc: "Not Available", link: "#" },
    { en: "Application To Become Panel Travel Agent", desc: "Not Available", link: "#" },
    { en: "Islamic Religious Enquiry", desc: "Not Available", link: "#" },
    { en: "Apply for Bantuan Ihsan Kematian (BIK)", desc: "Not Available", link: "#" },
    { en: "Apply for Bantuan Pesakit Buah Pinggang", desc: "Not Available", link: "#" },
    { en: "Application for Taman Kekal Pengeluaran Makanan (TKPM)", desc: "Not Available", link: "#" },
    { en: "Application to become Panel Hotel", desc: "Not Available", link: "#" },
    { en: "Apply for Non-Governmental Organization (NGO) Empowerment Assistance Grant", desc: "Not Available", link: "#" },
    { en: "Apply for Geran Pelancaran (GP)", desc: "Not Available", link: "#" },
    { en: "Sarawak Pre-Approved Plans", desc: "Not Available", link: "#" },
    { en: "Application for Fund Assistance for Houses of Worship", desc: "Not Available", link: "#" },
    { en: "Visitor Registration - Check Status", desc: "Not Available", link: "#" },
    { en: "Profile Record Registration for Houses of Worship", desc: "Not Available", link: "#" },
    { en: "Visitor Registration", desc: "Not Available", link: "#" },
    { en: "Profile Record Update for Houses of Worship", desc: "Not Available", link: "#" },
    { en: "Report Social Issue Case", desc: "Not Available", link: "#" },
    { en: "Submission of the Project Progress Report for Fund Assistance for Houses of Worship", desc: "Not Available", link: "#" },
    { en: "Projects Change of Scope for House of Worship", desc: "Not Available", link: "#" },
    { en: "SAMUDAH Issue Submission", desc: "Not Available", link: "#" },
    { en: "LDMS Author/Publisher Registration", desc: "Not Available", link: "#" },
    { en: "LDMS Author & Publisher Dashboard", desc: "Not Available", link: "#" },
    { en: "LDMS Author & Publisher Submission", desc: "Not Available", link: "#" }
  ]},
  { id: 14, group: "service", title: { en: "8. Land & Agriculture" }, icon: "Landmark", items: [
    { en: "New Farmer Profile Registration", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/545/" },
    { en: "Land Rent and Premium Enquiry and Payment", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/316/" },
    { en: "Apply for Livestock New Schemes", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/572/" },
    { en: "Application for Agricultural Development Program Assistance Scheme for Plantation Crop Division", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/589/" },
    { en: "Application For New Schemes, Product Development", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/588/" },
    { en: "Application for Taman Kekal Pengeluaran Makanan (TKPM)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/593/" },
    { en: "Application for Agricultural Development Program Assistance Scheme for Inland Fisheries Division", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/592/" },
    { en: "Extract of Strata Title", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/327/" },
    { en: "Apply for Community Agriculture Development Program (CADP)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/590/" },
    { en: "Application of e-LASIS user account", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/796/" },
    { en: "Buy Aerial Photograph", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/321/" },
    { en: "Check Land Application Status", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/806/" },
    { en: "Application for Certification under Planting Materials Authentication Scheme (SPBT)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/591/" },
    { en: "Buy Cartographic Map", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/322/" },
    { en: "Print Out of Strata Title", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/326/" },
    { en: "Request for Full Print Out Of Strata Title", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/328/" },
    { en: "Application of Residential Lots at Resettlement Schemes and Kampung Extension Scheme", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/809/" },
    { en: "Buy Orthophoto", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/320/" },
    { en: "Renewal of Land Leases", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/807/" },
    { en: "Application Development Program for Rice and Maize Grain", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/739/" },
    { en: "Application of Storage Licence for Carbon Storage", desc: "Not Available", link: "#" },
    { en: "Extract of Title", desc: "Not Available", link: "#" },
    { en: "Application for Certification of Crop Scheme", desc: "Not Available", link: "#" },
    { en: "Purchase Print out of Title", desc: "Not Available", link: "#" },
    { en: "Application for Permission to Deal", desc: "Not Available", link: "#" },
    { en: "Buy Cadastral Map produced by Land and Survey Department", desc: "Not Available", link: "#" },
    { en: "Application for Miscellaneous Temporary Occupation Licence", desc: "Not Available", link: "#" },
    { en: "Land Rent and Premium Enquiry and Payment", desc: "Not Available", link: "#" },
    { en: "Full Print Out of Title", desc: "Not Available", link: "#" },
    { en: "Buy Survey Plan", desc: "Not Available", link: "#" },
    { en: "Application for Renewal of TOL Residential Lots", desc: "Not Available", link: "#" },
    { en: "Application for Exchange of Farm Ownership", desc: "Not Available", link: "#" },
    { en: "Application of Storage Permit for Carbon Storage", desc: "Not Available", link: "#" },
    { en: "Online Lodgement of Land Instrument", desc: "Not Available", link: "#" },
    { en: "Application for Extension of Pawah Livestock Reimbursement", desc: "Not Available", link: "#" },
    { en: "Application of Storage Operator for Carbon Storage", desc: "Not Available", link: "#" },
    { en: "Application for New Utility Survey Job", desc: "Not Available", link: "#" },
    { en: "Application for Termination of Livestock Scheme", desc: "Not Available", link: "#" },
    { en: "Application for Ownership Transfer of Crop Division’s Development Program", desc: "Not Available", link: "#" },
    { en: "Buy Cartographic Map (hardcopy or softcopy PDF)", desc: "Not Available", link: "#" },
    { en: "Application for Sales of Rock Materials and Minerals Outside of Sarawak", desc: "Not Available", link: "#" },
    { en: "Application to Transfer Permanent Food Production Park (TKPM)’s Program", desc: "Not Available", link: "#" },
    { en: "Application for Renewal as a Permanent Food Production Park (TKPM)’s Participant", desc: "Not Available", link: "#" },
    { en: "Submission of Survey Jobs", desc: "Not Available", link: "#" },
    { en: "Extraction of Survey Job", desc: "Not Available", link: "#" },
    { en: "Submission of Strata Application & Surveys", desc: "Not Available", link: "#" },
    { en: "Application for Termination of Inland Fisheries’ Development Program", desc: "Not Available", link: "#" },
    { en: "Application for Transfer of Ownership for Agrobased Industry’s Development Program", desc: "Not Available", link: "#" },
    { en: "Application for Termination of Crop Division’s Development Program", desc: "Not Available", link: "#" },
    { en: "Application for Termination of Agrobased Industry’s Development Program", desc: "Not Available", link: "#" },
    { en: "Application for Termination as a Permanent Food Production Park (TKPM)’s Participant", desc: "Not Available", link: "#" },
    { en: "Application of Monitoring of Farm Record for Inland Fisheries", desc: "Not Available", link: "#" },
    { en: "Buy Orthophoto produced or procured by Land and Survey Department", desc: "Not Available", link: "#" },
    { en: "Buy Aerial Photograph produced by Land and Survey Department", desc: "Not Available", link: "#" },
    { en: "Submission of Utility Survey Job", desc: "Not Available", link: "#" }
  ]},
  { id: 15, group: "service", title: { en: "9. Education & Learning" }, icon: "SchoolIcon", items: [
    { en: "Apply for Scholarship (Biasiswa Pinjaman Kerajaan Negeri Sarawak)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/351/" },
    { en: "Online Request of Hydrological Data (Private Agency/Organization)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/609/" },
    { en: "Online Request of Hydrological Data (Individual)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/605/" },
    { en: "Search for Statutes of Sarawak", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/352/" },
    { en: "Online Purchase of Sarawak Hydrological Year Book (Organization)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/600/" },
    { en: "Online Purchase of Sarawak Hydrological Year Book (Individual)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/597/" },
    { en: "Online Request of Hydrological Data (Government Agency/Semi Government Agency)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/602/" },
    { en: "Online Request of Hydrological Data (IPTA/IPTS)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/607/" },
    { en: "School Leavers Registration (SPEAK)", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/725/" },
    { en: "Update School Profile [SPEAK]", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/728/" },
    { en: "Submission of Photos for 1 Village 1 Story", desc: "Online Service", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/723/" }
  ]}
];

const App = () => {
  // --- UI State ---
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderText, setPlaceholderText] = useState('Search services...');
  const [citizens, setCitizens] = useState(INITIAL_CITIZENS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [bugReports, setBugReports] = useState(INITIAL_BUGS);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false); 
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [sidebarAuthMode, setSidebarAuthMode] = useState('menu'); 
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [portalLogo, setPortalLogo] = useState('KC');
  
  // --- Admin UI State ---
  const [isCitizenHubMinimized, setIsCitizenHubMinimized] = useState(false);
  const [isCatalogHubMinimized, setIsCatalogHubMinimized] = useState(false);
  const [isBugHubMinimized, setIsBugHubMinimized] = useState(false);
  
  // --- Auth State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [verifiedIC, setVerifiedIC] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false); 
  const [signUpStep, setSignUpStep] = useState(1);
  const [authType, setAuthType] = useState('login'); 
  
  const [authIdentity, setAuthIdentity] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authName, setAuthName] = useState(''); 
  const [authRace, setAuthRace] = useState('');
  const [authReligion, setAuthReligion] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  
  const [bugDesc, setBugDesc] = useState('');
  const [bugScreen, setBugScreen] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [imageScale, setImageScale] = useState(1);
  const [isConfirmingPhoto, setIsConfirmingPhoto] = useState(false);
  
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState(null);

  const sidebarRef = useRef(null);
  const fileInputRef = useRef(null);
  const bugInputRef = useRef(null);

  // --- Handlers ---
  const handleMobileChange = (e) => {
    const d = e.target.value.replace(/\D/g, '');
    if (d.length <= 10) setMobilePhone(d);
  };

  const triggerBugAnimation = () => {
    setSidebarAuthMode('report-bug');
    setShowSidebar(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setTempImage(reader.result); setImageScale(1); setIsConfirmingPhoto(true); };
      reader.readAsDataURL(file);
    }
  };

  const handleBugScreenshot = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setBugScreen(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const submitBug = () => {
    if (!bugDesc) return;
    const newBug = {
      id: Date.now(), desc: bugDesc, screenshot: bugScreen, 
      user: verifiedIC || "Guest", time: new Date().toLocaleDateString()
    };
    setBugReports([newBug, ...bugReports]);
    setBugDesc(''); setBugScreen(null);
    changeAuthMode('menu');
  };

  const changeAuthMode = (mode) => {
    setAuthIdentity(''); setAuthPassword(''); setAuthEmail(''); setAuthError(null);
    setIsIdentityVerified(false); setIsVerifying(false); setSidebarAuthMode(mode);
  };

  const handleIdentityChange = (e) => {
    let val = e.target.value;
    if (authError) setAuthError(null);
    if (isIdentityVerified) setIsIdentityVerified(false);
    if (val.startsWith('#') || sidebarAuthMode === 'admin-login') {
      if (val.length > 10) return; setAuthIdentity(val.toUpperCase()); return;
    }
    if (/^[0-9-]*$/.test(val)) {
      const digits = val.replace(/\D/g, '');
      let formatted = digits.substring(0, 12);
      if (formatted.length > 6) {
        let temp = formatted.substring(0, 6) + '-' + formatted.substring(6, 8);
        if (formatted.length > 8) temp += '-' + formatted.substring(8, 12);
        formatted = temp;
      }
      setAuthIdentity(formatted);
    }
  };

  const handleVerifyIdentity = (e) => {
    if (e) e.preventDefault();
    setIsVerifying(true); setAuthError(null);
    setTimeout(() => {
      setIsVerifying(false);
      if (sidebarAuthMode === 'admin-login') {
        const found = INITIAL_ADMINS.find(a => a.id === authIdentity);
        if (!found) { setAuthError(UI_TEXT.authErrorNotFound); return; }
      } else {
        const found = citizens.find(c => c.ic === authIdentity);
        if (!found) { setAuthError(UI_TEXT.authErrorNotFound); return; }
      }
      setIsIdentityVerified(true);
    }, 1000);
  };

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
      if (sidebarAuthMode === 'admin-login') {
        const admin = INITIAL_ADMINS.find(a => a.id === authIdentity && a.email.toLowerCase() === authEmail.toLowerCase());
        if (admin) {
          setIsAdmin(true); setAuthName(admin.name); setVerifiedIC(admin.id);
          setIsLoggedIn(true); setShowSidebar(false); setSidebarAuthMode('menu');
        } else { setAuthError(UI_TEXT.authErrorWrongCreds); }
      } else {
        const user = citizens.find(c => c.ic === authIdentity && c.password === authPassword);
        if (user) {
          setIsAdmin(false); setAuthName(user.name); setVerifiedIC(user.ic);
          setIsLoggedIn(true); setShowSidebar(false); setSidebarAuthMode('menu');
        } else { setAuthError(UI_TEXT.authErrorWrongCreds); }
      }
    }, 1200);
  };

  const handleAuthSubmit = (e) => {
    if (e) e.preventDefault();
    if (signUpStep === 1) {
      if (mobilePhone.length < 8) { setAuthError("Invalid mobile."); return; }
      setSignUpStep(2); return;
    }
    if (signUpStep === 2) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regex.test(authPassword)) { setAuthError("Criteria not met."); return; }
      if (authPassword !== confirmPassword) { setAuthError("Mismatch."); return; }
      setSignUpStep(3); return;
    }
    setIsMatching(true);
    setTimeout(() => {
      setCitizens([...citizens, { ic: authIdentity, name: authName, password: authPassword, race: authRace, religion: authReligion, applications: [] }]);
      setVerifiedIC(authIdentity); setIsLoggedIn(true); setIsMatching(false); setShowAuthModal(false);
    }, 1500);
  };

  const handleLogout = () => {
    setIsLoggingOut(true); setShowSidebar(false);
    setTimeout(() => {
      setIsLoggedIn(false); setIsAdmin(false); setVerifiedIC(''); setAuthName(''); setProfileImage(null); 
      changeAuthMode('menu'); setIsLoggingOut(false); 
    }, 1200);
  };

  // --- Admin Logic ---
  const editCitizenIdentity = (ic) => {
    const c = citizens.find(cit => cit.ic === ic); if (!c) return;
    const nN = prompt("Name:", c.name); const nR = prompt("Race:", c.race); const nRe = prompt("Religion:", c.religion);
    if (nN && nR && nRe) setCitizens(prev => prev.map(cit => cit.ic === ic ? { ...cit, name: nN, race: nR, religion: nRe } : cit));
  };

  const switchAppStatus = (ic, appId) => {
    const nS = prompt("Status (Approved / Pending / Rejected):");
    if (["Approved", "Pending", "Rejected"].includes(nS)) {
      setCitizens(prev => prev.map(c => c.ic === ic ? { ...c, applications: c.applications.map(a => a.id === appId ? { ...a, status: nS } : a) } : c));
    }
  };

  const handleEditCategory = (id) => {
    const cat = services.find(s => s.id === id); const next = prompt("Rename:", cat.title.en);
    if (next) setServices(prev => prev.map(c => c.id === id ? { ...c, title: { en: next } } : c));
  };

  const handleAddItem = (catId) => {
    const n = prompt("Name:"); const d = prompt("Desc:"); const l = prompt("URL (# for empty):");
    if (n && d) setServices(services.map(s => s.id === catId ? { ...s, items: [...s.items, { en: n, desc: d, link: l || "#" }] } : s));
  };

  const handleEditItem = (catId, idx) => {
    const item = services.find(c => c.id === catId).items[idx];
    const nN = prompt("Name:", item.en); const nD = prompt("Desc:", item.desc); const nL = prompt("URL:", item.link);
    if (nN && nD) setServices(services.map(s => s.id === catId ? { ...s, items: s.items.map((it, i) => i === idx ? { ...it, en: nN, desc: nD, link: nL || "#" } : it) } : s));
  };

  const handleAddNewCategory = () => {
    const n = prompt("Title:"); if (n) setServices([...services, { id: Date.now(), title: { en: n }, icon: "LayoutGrid", items: [] }]);
  };

  const handleDeleteItem = (catId, idx) => { if (window.confirm("Remove?")) setServices(services.map(s => s.id === catId ? { ...s, items: s.items.filter((_, i) => i !== idx) } : s)); };

  const changeLogo = () => { const n = prompt("Logo Label:", portalLogo); if (n) setPortalLogo(n.substring(0, 3).toUpperCase()); };

  const handleConfirmPhoto = () => { setProfileImage(tempImage); setTempImage(null); setIsConfirmingPhoto(false); };
  const handleCancelPhoto = () => { setTempImage(null); setIsConfirmingPhoto(false); };

  // --- Filtering ---
  const studentServices = useMemo(() => services.filter(s => s.group === "student" && s.title.en.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery, services]);
  const sarawakServices = useMemo(() => services.filter(s => s.group === "service" && s.title.en.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery, services]);
  const filteredCitizens = useMemo(() => citizens.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.ic.includes(searchQuery)), [searchQuery, citizens]);

  useEffect(() => {
    const hints = ['Welfare', 'Status', 'Scholarship'];
    let idx = 0;
    const interval = setInterval(() => { setPlaceholderText(`Search ${isAdmin ? 'Database' : 'Portal'}...`); idx = (idx + 1) % hints.length; }, 4000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);

  const toggleCategory = (id) => setExpandedCategoryId(expandedCategoryId === id ? null : id);

  return (
    <div className={`min-h-screen relative font-sans transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Global Loader Overlay */}
      {(isLoggingOut || isMatching) && (
        <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-black/80 text-center">
           <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-6" />
           <p className="text-white font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Processing...</p>
        </div>
      )}

      {/* SIDEBAR DRAWER */}
      <div className={`fixed top-0 right-0 h-full w-[360px] z-[60] shadow-2xl transition-transform duration-500 ease-out transform ${showSidebar ? 'translate-x-0' : 'translate-x-full'} ${darkMode ? 'bg-slate-950 border-l border-white/5' : 'bg-white'}`}>
         <div className="p-8 border-b border-slate-500/10 flex justify-between items-center font-bold">
            {sidebarAuthMode !== 'menu' && <button onClick={() => changeAuthMode('menu')} className="text-[10px] font-black uppercase opacity-40 hover:opacity-100 flex items-center gap-2 font-bold"><ChevronRight className="w-4 h-4 rotate-180" /> Back</button>}
            <h3 className="font-black uppercase tracking-[0.3em] text-[10px] opacity-30 flex-grow text-center font-bold">My Menu</h3>
            <button onClick={() => {setShowSidebar(false); changeAuthMode('menu');}} className="p-2 rounded-full hover:bg-slate-500/10"><X className="w-6 h-6" /></button>
         </div>

         <div className="flex-grow overflow-y-auto scrollbar-hide p-8 text-center font-bold">
            {sidebarAuthMode === 'menu' && (
              <div className="space-y-10 animate-in fade-in zoom-in-95 font-bold">
                 <div className="flex flex-col items-center font-bold">
                    <div className="relative group">
                       <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center shadow-2xl overflow-hidden bg-slate-500/10 border-4 ${darkMode ? 'border-white/5' : 'border-white'}`}>
                          {profileImage ? <img src={profileImage} className="w-full h-full object-cover" alt="Avatar" style={{transform: `scale(${imageScale})`}} /> : <User className="w-14 h-14 text-white/50" />}
                       </div>
                       {isLoggedIn && !isAdmin && <button onClick={() => fileInputRef.current.click()} className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-yellow-500 text-black shadow-lg transform hover:scale-110 active:scale-95 transition-all"><Camera className="w-5 h-5" /></button>}
                       <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                    {isConfirmingPhoto && (
                      <div className="mt-8 p-6 rounded-3xl bg-slate-500/5 border border-yellow-500/20 animate-in slide-in-from-top-4 font-bold">
                         <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-yellow-500 shadow-inner mb-4">
                            <img src={tempImage} className="w-full h-full object-cover" style={{transform: `scale(${imageScale})`}} alt="Preview" />
                         </div>
                         <input type="range" min="0.5" max="3" step="0.01" value={imageScale} onChange={(e) => setImageScale(parseFloat(e.target.value))} className="w-full accent-yellow-500 mb-6 font-bold" />
                         <div className="flex gap-2 font-bold">
                            <button onClick={handleCancelPhoto} className="flex-grow py-3 rounded-xl bg-slate-500/10 text-[9px] font-black uppercase font-bold">Cancel</button>
                            <button onClick={handleConfirmPhoto} className="flex-grow py-3 rounded-xl bg-yellow-500 text-black text-[9px] font-black uppercase font-bold">Apply</button>
                         </div>
                      </div>
                    )}
                    {!isConfirmingPhoto && (
                      <div className="mt-6 font-bold">
                         <h4 className="font-black uppercase tracking-tighter text-2xl leading-tight font-bold">{isLoggedIn ? authName : "GUEST USER"}</h4>
                         {isLoggedIn && !isAdmin && <p className="text-[10px] font-bold opacity-30 mt-3 tracking-widest uppercase text-center font-bold">ID: KC-{verifiedIC.split('-').join('')}</p>}
                         {isLoggedIn && isAdmin && <p className="text-[10px] font-black text-purple-500 mt-2 tracking-widest uppercase text-center font-bold">Admin Hub Active</p>}
                      </div>
                    )}
                 </div>

                 {!isLoggedIn && !isConfirmingPhoto && (
                   <div className="space-y-3 font-bold font-bold">
                      <button onClick={() => changeAuthMode('login')} className="w-full py-5 rounded-3xl bg-black text-white dark:bg-white dark:text-black font-black uppercase text-xs tracking-widest shadow-xl transition-transform active:scale-95 font-bold font-bold font-bold">Log In</button>
                      <button onClick={() => { setShowAuthModal(true); setSignUpStep(1); setAuthType('signup'); setShowSidebar(false); }} className="w-full py-5 rounded-3xl border-2 border-slate-500/20 font-black uppercase text-xs tracking-widest hover:bg-slate-500/5 transition-all text-xs font-bold font-bold font-bold font-bold">Sign Up</button>
                   </div>
                 )}

                 {isLoggedIn && !isAdmin && !isConfirmingPhoto && (
                   <div className="space-y-2 text-left font-bold font-bold">
                      <button onClick={() => setSidebarAuthMode('overview')} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-slate-500/5 font-black text-sm transition-all hover:bg-yellow-500/10 font-bold font-bold font-bold"><Fingerprint className="w-5 h-5 opacity-40" /> My Profile</button>
                      <button onClick={() => setSidebarAuthMode('status')} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-slate-500/5 font-black text-sm transition-all hover:bg-yellow-500/10 font-bold font-bold font-bold"><Clock className="w-5 h-5 opacity-40" /> Track Status</button>
                      <button onClick={() => setSidebarAuthMode('security')} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-slate-500/5 font-black text-sm transition-all hover:bg-yellow-500/10 font-bold font-bold font-bold"><ShieldAlert className="w-5 h-5 opacity-40" /> Security</button>
                   </div>
                 )}

                 <div className="space-y-3 pt-6 border-t border-slate-500/10 font-bold font-bold font-bold">
                    <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center justify-between p-5 rounded-3xl bg-slate-500/5 transition-all font-bold font-bold">
                       <div className="flex items-center gap-4 font-bold font-bold">{darkMode ? <Sun className="w-5 h-5 text-yellow-500 font-bold" /> : <Moon className="w-5 h-5 font-bold" />}<span className="font-black text-xs uppercase font-bold">{darkMode ? 'Light' : 'Dark'} Mode</span></div>
                       <div className={`w-10 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-yellow-500' : 'bg-slate-300'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${darkMode ? 'left-6' : 'left-1'}`} /></div>
                    </button>
                 </div>
              </div>
            )}

            {sidebarAuthMode === 'report-bug' && (
              <div className="animate-in slide-in-from-right-4 text-left space-y-6 font-bold font-bold">
                 <h4 className="font-black uppercase text-2xl mb-4 font-bold">Report Issue</h4>
                 <div className="space-y-2 font-bold font-bold"><label className="text-[10px] font-black uppercase opacity-40 px-1 font-bold">Describe Issue</label><textarea value={bugDesc} onChange={(e) => setBugDesc(e.target.value)} rows="5" className="w-full p-5 rounded-2xl border-2 font-medium bg-transparent outline-none focus:border-red-500/50 font-bold font-bold" /></div>
                 <div className="space-y-2 font-bold font-bold"><label className="text-[10px] font-black uppercase opacity-40 px-1 font-bold">Screenshot</label><div onClick={() => bugInputRef.current.click()} className="w-full p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer font-bold">{bugScreen ? <img src={bugScreen} className="h-24 rounded-lg font-bold" alt="P" /> : <Image className="w-8 h-8 opacity-20 font-bold" />}</div><input type="file" ref={bugInputRef} className="hidden" accept="image/*" onChange={handleBugScreenshot} /></div>
                 <button onClick={submitBug} className="w-full py-5 rounded-3xl bg-red-600 text-white font-black uppercase tracking-widest shadow-xl active:scale-95 font-bold font-bold">Submit Report</button>
              </div>
            )}

            {(sidebarAuthMode === 'login' || sidebarAuthMode === 'admin-login') && (
              <div className="animate-in slide-in-from-right-4 text-left font-bold font-bold font-bold font-bold">
                 <h4 className="font-black uppercase text-2xl mb-8 font-bold font-bold">{sidebarAuthMode === 'login' ? 'User Access' : 'Admin Unlock'}</h4>
                 {authError && <div className="mb-6 p-4 rounded-2xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase flex items-center gap-3 animate-shake font-bold font-bold"><AlertTriangle className="w-4 h-4 font-bold" /> {authError}</div>}
                 <form onSubmit={isIdentityVerified ? handleLoginSubmit : handleVerifyIdentity} className="space-y-6 font-bold font-bold font-bold">
                    <div className="space-y-2 font-bold font-bold"><label className="text-[10px] font-black uppercase opacity-40 px-1 font-bold font-bold">Identity ID</label><input type="text" value={authIdentity} onChange={handleIdentityChange} className={`w-full p-5 rounded-2xl border-2 font-black outline-none bg-transparent ${isIdentityVerified ? 'border-green-500/40 font-bold' : 'font-bold'}`} /></div>
                    {isIdentityVerified && (<div className="space-y-2 font-bold font-bold"><label className="text-[10px] font-black uppercase opacity-40 px-1 font-bold font-bold">{sidebarAuthMode === 'login' ? 'Password' : 'Verified Email'}</label><input type={sidebarAuthMode === 'login' ? "password" : "email"} value={sidebarAuthMode === 'login' ? authPassword : authEmail} onChange={(e) => sidebarAuthMode === 'login' ? setAuthPassword(e.target.value) : setAuthEmail(e.target.value)} className="w-full p-5 rounded-2xl border-2 font-black outline-none bg-transparent font-bold" /></div>)}
                    <button type="submit" className={`w-full py-5 rounded-3xl text-white font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 font-bold font-bold font-bold ${sidebarAuthMode === 'login' ? 'bg-black dark:bg-white dark:text-black font-bold' : 'bg-purple-600 font-bold'}`}>{isVerifying ? <Loader2 className="animate-spin mx-auto font-bold" /> : (isIdentityVerified ? 'Access Portal' : 'Verify ID')}</button>
                 </form>
              </div>
            )}
         </div>

         <div className="p-8 border-t border-slate-500/10 text-center space-y-4 font-bold font-bold font-bold font-bold">
            {!isConfirmingPhoto && <button onClick={triggerBugAnimation} className="w-full py-4 rounded-2xl border border-red-500/20 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all font-bold font-bold font-bold">Report Bug</button>}
            {!isLoggedIn && sidebarAuthMode === 'menu' && !isConfirmingPhoto && <button onClick={() => changeAuthMode('admin-login')} className="w-full py-3 text-[10px] font-black uppercase opacity-10 hover:opacity-100 hover:text-purple-500 transition-all text-xs font-bold font-bold font-bold">Hey Admin</button>}
            {isLoggedIn && <button onClick={handleLogout} className="w-full flex items-center justify-center gap-4 p-5 text-red-500 font-black text-sm hover:bg-red-500/10 rounded-3xl transition-all active:scale-95 font-bold font-bold font-bold font-bold"><LogOut className="w-5 h-5 font-bold" /> Sign Out</button>}
         </div>
      </div>

      {/* MAIN WRAPPER - Push Logic */}
      <div className={`transition-transform duration-500 ease-out flex flex-col min-h-screen ${showSidebar ? '-translate-x-[360px]' : 'translate-x-0'}`}>
        <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
          <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between font-bold">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setSearchQuery('')}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-yellow-500 font-bold text-black text-xs shadow-lg transform group-hover:scale-110 transition-transform font-bold">{portalLogo}</div>
              <h1 className="font-black text-xl tracking-tighter uppercase font-bold font-bold">KENYALANG <span className="text-yellow-500 font-bold">CARE</span></h1>
            </div>
            <button onClick={() => setShowSidebar(true)} className={`p-3 rounded-2xl border transition-all hover:shadow-lg active:scale-95 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}><Menu className="w-6 h-6 opacity-60 font-bold font-bold" /></button>
          </div>
        </header>

        <main className="flex-grow w-full md:max-w-3xl mx-auto px-4 py-8 md:py-16 text-center font-bold font-bold">
          <div className="relative group mb-12 font-bold font-bold"><Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-yellow-600 z-10 font-bold font-bold" /><input type="text" placeholder={placeholderText} className={`w-full pl-16 pr-6 py-7 rounded-3xl border-2 outline-none font-bold text-lg shadow-2xl transition-all ${darkMode ? 'bg-white/10 border-white/20 text-white font-bold' : 'bg-white border-slate-200 focus:border-black font-bold'}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>

          {/* ADMIN PANELS */}
          {isLoggedIn && isAdmin && (
            <div className="mb-12 space-y-8 animate-in slide-in-from-top-4 duration-500 text-left font-bold">
               <div className="rounded-[2.5rem] border-2 border-purple-500/20 bg-purple-500/5 backdrop-blur-md overflow-hidden font-bold">
                  <div className="p-8 flex items-center justify-between font-bold"><div className="flex items-center gap-4 text-purple-600 font-bold"><UserCog className="w-6 h-6 font-bold" /><h2 className="text-xl font-black uppercase tracking-tighter font-bold">Citizen Hub</h2></div><button onClick={() => setIsCitizenHubMinimized(!isCitizenHubMinimized)} className="p-3 rounded-2xl bg-purple-600/10 text-purple-600 font-bold"><ChevronDown className="w-5 h-5 font-bold" /></button></div>
                  {!isCitizenHubMinimized && <div className="px-8 pb-10 space-y-4 font-bold">{filteredCitizens.map(citizen => (<div key={citizen.ic} className="p-5 rounded-[2rem] border border-purple-500/20 bg-white dark:bg-black/40 shadow-sm space-y-4 font-bold"><div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-bold font-bold"><div><h4 className="text-lg font-black uppercase font-bold">{citizen.name}</h4><p className="text-[9px] font-bold opacity-30 font-bold font-bold">IC: {citizen.ic} • {citizen.race} • {citizen.religion}</p></div><button onClick={() => editCitizenIdentity(citizen.ic)} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 text-white font-black uppercase text-[9px] font-bold font-bold"><Edit3 className="w-3 h-3 font-bold" /> Edit Identity</button></div><div className="pt-3 border-t border-purple-500/5 font-bold">{citizen.applications.map(app => (<div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 font-bold font-bold"><p className="font-black text-[10px] uppercase font-bold font-bold font-bold">{app.name}</p><div className="flex items-center gap-3 font-bold font-bold"><span className={`px-2.5 py-1 rounded-lg text-[8px] font-black text-white uppercase font-bold font-bold ${app.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'}`}>{app.status}</span><button onClick={() => switchAppStatus(citizen.ic, app.id)} className="p-1.5 rounded-lg bg-purple-100 text-purple-600 font-bold"><RefreshCw className="w-3.5 h-3.5 font-bold" /></button></div></div>))}</div></div>))}</div>}
               </div>
               <div className="rounded-[2.5rem] border-2 border-red-500/20 bg-red-500/5 backdrop-blur-md overflow-hidden font-bold font-bold">
                  <div className="p-8 flex items-center justify-between font-bold"><div className="flex items-center gap-4 text-red-600 font-bold"><Bug className="w-6 h-6 font-bold font-bold" /><h2 className="text-xl font-black uppercase tracking-tighter font-bold">Bug Management</h2></div><button onClick={() => setIsBugHubMinimized(!isBugHubMinimized)} className="p-3 rounded-2xl bg-red-600/10 text-red-600 font-bold font-bold"><ChevronDown className="w-5 h-5 font-bold" /></button></div>
                  {!isBugHubMinimized && <div className="px-8 pb-10 space-y-4 font-bold">{bugReports.map(bug => (<div key={bug.id} className="p-5 rounded-[2rem] border border-red-500/20 bg-white dark:bg-black/40 shadow-sm space-y-4 font-bold font-bold"><p className="text-[10px] font-black uppercase text-red-500 font-bold font-bold">ID: #{bug.id.toString().slice(-4)} • {bug.time}</p><p className="text-xs font-medium italic font-bold font-bold">"{bug.desc}"</p>{bug.screenshot && <img src={bug.screenshot} className="h-20 w-20 rounded-lg shadow font-bold" alt="Bug" />}<div className="pt-3 border-t border-red-500/10 flex justify-between items-center font-bold"><p className="text-[8px] font-black uppercase opacity-40 font-bold font-bold">Reporter: {bug.user}</p><button onClick={() => setBugReports(bugReports.filter(b => b.id !== bug.id))} className="text-[8px] font-black text-red-500 hover:underline font-bold font-bold font-bold">Resolve</button></div></div>))}</div>}
               </div>
            </div>
          )}

          {!isAdmin && (
            <div className="space-y-16 font-bold font-bold">
              <div className="space-y-6 font-bold text-left px-4 font-bold font-bold"><h2 className="text-3xl font-black uppercase flex items-center gap-4 font-bold font-bold"><SchoolIcon className="text-yellow-600 font-bold font-bold" /> School and Student</h2><div className="space-y-4 font-bold font-bold font-bold">{studentServices.map(cat => (<div key={cat.id} className={`rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${expandedCategoryId === cat.id ? 'border-yellow-500 shadow-lg' : 'border-slate-800/10 font-bold font-bold'}`}><div onClick={() => toggleCategory(cat.id)} className="p-8 cursor-pointer flex items-center gap-8 font-bold font-bold font-bold"><div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${expandedCategoryId === cat.id ? 'bg-yellow-500 text-black rotate-12 shadow-lg' : 'bg-slate-800/10 font-bold'}`}>{React.createElement(IconMap[cat.icon] || GraduationCap, { className: "w-7 h-7 font-bold font-bold font-bold" })}</div><div className="flex-grow font-bold font-bold font-bold"><h3 className={`font-black text-lg uppercase font-bold font-bold font-bold ${expandedCategoryId === cat.id ? 'text-yellow-600' : ''}`}>{cat.title.en}</h3></div><ChevronDown className={`transition-transform duration-500 ${expandedCategoryId === cat.id ? 'rotate-180 text-yellow-500 font-bold font-bold' : 'opacity-20 font-bold font-bold font-bold'}`} /></div>{expandedCategoryId === cat.id && <div className="px-8 pb-10 space-y-4 font-bold text-left font-bold font-bold font-bold">{cat.items.map((item, idx) => (<div key={idx} className="p-4 border-b border-slate-500/10 group last:border-none font-bold font-bold font-bold font-bold font-bold">
                {item.link !== "#" ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-black uppercase text-sm block hover:text-yellow-600 transition-colors font-bold font-bold font-bold font-bold font-bold text-blue-600 dark:text-blue-400">{item.en}</a>
                ) : (
                  <span className="font-black uppercase text-sm block text-slate-500 dark:text-slate-400 cursor-not-allowed font-bold font-bold">{item.en}</span>
                )}
                <p className="text-[10px] opacity-60 italic font-bold font-bold font-bold font-bold font-bold font-bold font-bold text-slate-600 dark:text-slate-300">
                  {item.link === "#" ? (item.desc || "Link Not Available") : "Online Portal Available"}
                </p>
              </div>))}</div>}</div>))}</div></div>

              <div className="space-y-6 font-bold text-left px-4 font-bold font-bold"><h2 className="text-3xl font-black uppercase flex items-center gap-4 font-bold font-bold font-bold"><Globe className="text-yellow-600 font-bold font-bold font-bold" /> Service Sarawak</h2><div className="space-y-4 font-bold font-bold font-bold font-bold">{sarawakServices.map(cat => (<div key={cat.id} className={`rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${expandedCategoryId === cat.id ? 'border-yellow-500 shadow-lg' : 'border-slate-800/10 font-bold font-bold font-bold'}`}><div onClick={() => toggleCategory(cat.id)} className="p-8 cursor-pointer flex items-center gap-8 font-bold font-bold font-bold font-bold"><div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${expandedCategoryId === cat.id ? 'bg-yellow-500 text-black rotate-12 shadow-lg' : 'bg-slate-800/10 font-bold'}`}>{React.createElement(IconMap[cat.icon] || GraduationCap, { className: "w-7 h-7 font-bold font-bold font-bold" })}</div><div className="flex-grow font-bold font-bold font-bold font-bold"><h3 className={`font-black text-lg uppercase font-bold font-bold font-bold font-bold ${expandedCategoryId === cat.id ? 'text-yellow-600' : ''}`}>{cat.title.en}</h3></div><ChevronDown className={`transition-transform duration-500 ${expandedCategoryId === cat.id ? 'rotate-180 text-yellow-500 font-bold font-bold' : 'opacity-20 font-bold font-bold font-bold'}`} /></div>{expandedCategoryId === cat.id && <div className="px-8 pb-10 space-y-4 font-bold text-left font-bold font-bold font-bold font-bold">{cat.items.map((item, idx) => (<div key={idx} className="p-4 border-b border-slate-500/10 group last:border-none font-bold font-bold font-bold font-bold font-bold font-bold">
                {item.link !== "#" ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-black uppercase text-sm block hover:text-yellow-600 transition-colors font-bold font-bold font-bold font-bold font-bold font-bold text-blue-600 dark:text-blue-400">{item.en}</a>
                ) : (
                  <span className="font-black uppercase text-sm block text-slate-500 dark:text-slate-400 cursor-not-allowed font-bold font-bold font-bold">{item.en}</span>
                )}
                <p className="text-[10px] opacity-60 italic font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold text-slate-600 dark:text-slate-300">
                  {item.link === "#" ? (item.desc || "Link Not Available") : "Online Portal Available"}
                </p>
              </div>))}</div>}</div>))}</div></div>
            </div>
          )}
        </main>

        <footer className={`mt-24 py-20 border-t ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="w-full md:max-w-3xl mx-auto px-4 text-center font-bold font-bold font-bold font-bold">
            <div className="flex items-center justify-center gap-12 text-xs font-medium opacity-60 mb-12 font-bold font-bold font-bold font-bold font-bold">
              <button onClick={() => setShowAboutUs(true)} className="hover:text-yellow-600 transition-all font-bold uppercase font-bold font-bold font-bold font-bold font-bold">About us</button>
              <span className="opacity-10 font-bold font-bold font-bold">•</span>
              <a href={UI_TEXT.privacyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-600 transition-all font-bold font-bold font-bold font-bold font-bold font-bold">Privacy policy</a>
            </div>
            <p className="text-[10px] opacity-20 uppercase font-black tracking-[0.4em] font-bold font-bold font-bold font-bold font-bold font-bold">© 2026 Kenyalang Care. Digital Sarawak Unit.</p>
          </div>
        </footer>
      </div>

      {/* ABOUT US Bubble */}
      {showAboutUs && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 font-bold font-bold font-bold" onClick={() => setShowAboutUs(false)}>
          <div className={`relative w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300 ${darkMode ? 'bg-slate-900 border-2 border-slate-800' : 'bg-white font-bold font-bold'}`} onClick={e => e.stopPropagation()}>
            <MessageSquare className="w-10 h-10 text-yellow-500 mx-auto mb-6 font-bold font-bold font-bold" />
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter font-bold font-bold font-bold">About Us</h3>
            <p className="text-sm opacity-80 leading-[1.6] font-bold text-justify mb-8 font-bold font-bold font-bold font-bold font-bold font-bold">{UI_TEXT.about}</p>
            <button onClick={() => setShowAboutUs(false)} className="w-full py-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all font-bold font-bold font-bold font-bold font-bold">Close Bubble</button>
          </div>
        </div>
      )}

      {/* SIGN UP MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-slate-950 animate-in fade-in overflow-y-auto font-bold font-bold font-bold">
          <div className="w-full max-w-5xl mx-auto p-8 md:p-16 relative flex-grow flex flex-col text-left font-bold font-bold font-bold">
            <button onClick={() => {setShowAuthModal(false); setSignUpStep(1);}} className="absolute top-8 right-8 p-3 rounded-full hover:bg-slate-500/10 transition-colors font-bold font-bold font-bold"><X className="w-8 h-8 opacity-40 font-bold font-bold font-bold font-bold font-bold" /></button>
            <div className="text-center mb-16 font-bold font-bold font-bold font-bold font-bold"><h3 className="text-5xl font-black uppercase tracking-tighter mb-4 font-bold font-bold font-bold font-bold font-bold font-bold">Registration Hub</h3><p className="text-sm font-bold opacity-30 uppercase tracking-[0.6em] font-bold font-bold font-bold font-bold font-bold">Official Sarawak Digital Identity</p></div>
            <button onClick={() => setShowAuthModal(false)} className="w-full py-8 rounded-[2.5rem] bg-black text-white font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xl mt-auto font-bold font-bold font-bold font-bold">Enter Hub <ChevronRight className="inline-block ml-4 font-bold font-bold" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;