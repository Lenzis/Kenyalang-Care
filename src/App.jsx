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
  MessageSquare, Shield
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
  authErrorNotFound: "Identity not recognized in system.",
  authErrorWrongCreds: "Invalid credentials provided.",
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
    name: "Elvin Owen",
    ic: "980404-13-5567",
    username: "elvin13",
    password: "User123!", 
    race: "Chinese", religion: "Christianity", gender: "Male", mobile: "123456789",
    permanentAddress: "SIBU, SARAWAK", correspondenceAddress: "JALAN JALAN DI SIBU, SARAWAK",
    applications: [{ id: "APP-001", name: "Kenyalang Gold Card", status: "Approved", date: "26 Apr 2026" }],
    loginHistory: [
      { time: "26 Apr 2026, 14:30:00", device: "Mac OS" }
    ]
  }
];

const INITIAL_ADMINS = [
  { id: "#KC130001", name: "System Administrator", email: "admin@sarawak.gov.my" }
];

const INITIAL_BUGS = [
  { id: 1, desc: "Status not updating on mobile view.", screenshot: null, user: "KC-980404135567", time: "26 Apr 2026" }
];

// --- Exhaustive Service Catalog ---
const INITIAL_SERVICES = [
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

// --- Simple Device Detector ---
const getDevice = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows PC';
  if (ua.includes('Mac')) return 'Mac OS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android Device';
  if (ua.includes('like Mac OS')) return 'iOS Device';
  return 'Unknown Device';
};

const App = () => {
  // --- UI State ---
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderText, setPlaceholderText] = useState('Search services...');
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false); 
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [sidebarAuthMode, setSidebarAuthMode] = useState('menu'); 
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [portalLogo, setPortalLogo] = useState('KC');
  
  // --- Data State ---
  const [citizens, setCitizens] = useState(INITIAL_CITIZENS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [bugReports, setBugReports] = useState(INITIAL_BUGS);

  // --- Admin UI State ---
  const [isCitizenHubMinimized, setIsCitizenHubMinimized] = useState(false);
  const [isCatalogHubMinimized, setIsCatalogHubMinimized] = useState(false);
  const [isBugHubMinimized, setIsBugHubMinimized] = useState(false);
  
  // --- Auth State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false); 
  const [signUpStep, setSignUpStep] = useState(1);
  const [authType, setAuthType] = useState('login'); 
  
  // --- Form State ---
  const [authIdentity, setAuthIdentity] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authName, setAuthName] = useState(''); 
  const [authUsername, setAuthUsername] = useState('');
  const [authGender, setAuthGender] = useState('');
  const [authRace, setAuthRace] = useState('');
  const [authReligion, setAuthReligion] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [correspondenceAddress, setCorrespondenceAddress] = useState('');
  
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

  const handleLoginIdentityChange = (e) => {
    if (authError) setAuthError(null);
    if (isIdentityVerified) setIsIdentityVerified(false);
    setAuthIdentity(e.target.value);
  };

  const handleSignUpIdentityChange = (e) => {
    if (authError) setAuthError(null);
    const digits = e.target.value.replace(/\D/g, '');
    let formatted = digits.substring(0, 12);
    if (formatted.length > 6) {
      formatted = formatted.substring(0, 6) + '-' + formatted.substring(6);
    }
    if (formatted.length > 9) {
      formatted = formatted.substring(0, 9) + '-' + formatted.substring(9);
    }
    setAuthIdentity(formatted);
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
      user: currentUser ? currentUser.ic : "Guest", time: new Date().toLocaleString()
    };
    setBugReports([newBug, ...bugReports]);
    setBugDesc(''); setBugScreen(null);
    changeAuthMode('menu');
  };

  const changeAuthMode = (mode) => {
    setAuthIdentity(''); setAuthPassword(''); setAuthEmail(''); setAuthError(null);
    setIsIdentityVerified(false); setIsVerifying(false); setSidebarAuthMode(mode);
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
        const found = citizens.find(c => c.ic === authIdentity || c.username === authIdentity);
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
          setIsAdmin(true); setCurrentUser(admin);
          setIsLoggedIn(true); setShowSidebar(false); setSidebarAuthMode('menu');
        } else { setAuthError(UI_TEXT.authErrorWrongCreds); }
      } else {
        const user = citizens.find(c => (c.ic === authIdentity || c.username === authIdentity) && c.password === authPassword);
        if (user) {
          const loginRecord = { time: new Date().toLocaleString(), device: getDevice() };
          const updatedUser = { ...user, loginHistory: [loginRecord, ...(user.loginHistory || [])] };
          
          setCitizens(prev => prev.map(c => c.ic === user.ic ? updatedUser : c));
          
          setIsAdmin(false); setCurrentUser(updatedUser);
          setIsLoggedIn(true); setShowSidebar(false); setSidebarAuthMode('menu');
        } else { setAuthError(UI_TEXT.authErrorWrongCreds); }
      }
    }, 1200);
  };

  const resetSignUpForm = () => {
    setSignUpStep(1);
    setAuthName('');
    setAuthIdentity('');
    setAuthRace('');
    setAuthReligion('');
    setAuthGender('');
    setAuthUsername('');
    setMobilePhone('');
    setEmailAddress('');
    setPermanentAddress('');
    setCorrespondenceAddress('');
    setAuthPassword('');
    setConfirmPassword('');
    setAuthError(null);
  };

  const handleAuthSubmit = (e) => {
    if (e) e.preventDefault();
    if (signUpStep === 1) {
      if (!authName || !authIdentity || !authRace || !authReligion || !authGender || !authUsername || !mobilePhone || !emailAddress || !permanentAddress || !correspondenceAddress) {
        setAuthError("Please fill in all details to proceed.");
        return;
      }
      if (mobilePhone.length < 8) { setAuthError("Invalid mobile."); return; }
      setSignUpStep(2); return;
    }
    if (signUpStep === 2) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regex.test(authPassword)) { setAuthError("Requirements: 8+ chars, upper, lower, number, symbol."); return; }
      if (authPassword !== confirmPassword) { setAuthError("Passwords mismatch."); return; }
      setSignUpStep(3); return;
    }
    if (signUpStep === 3) {
      setIsMatching(true);
      setTimeout(() => {
        const newCit = { 
          ic: authIdentity, name: authName, username: authUsername, password: authPassword, 
          race: authRace, religion: authReligion, gender: authGender, 
          permanentAddress, correspondenceAddress, mobile: mobilePhone, email: emailAddress,
          applications: [], loginHistory: [{ time: new Date().toLocaleString(), device: getDevice() }] 
        };
        setCitizens([...citizens, newCit]);
        setCurrentUser(newCit); setIsLoggedIn(true); setIsMatching(false); setShowAuthModal(false);
        resetSignUpForm();
      }, 1500);
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true); setShowSidebar(false);
    setTimeout(() => {
      setIsLoggedIn(false); setIsAdmin(false); setCurrentUser(null); setProfileImage(null); 
      changeAuthMode('menu'); resetSignUpForm(); setIsLoggingOut(false); 
    }, 1200);
  };

  const handleUpdateProfile = () => {
    if (!mobilePhone || !permanentAddress || !correspondenceAddress) {
      setAuthError("Mobile and Addresses cannot be empty.");
      return;
    }
    if (authPassword) {
       const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
       if (!regex.test(authPassword)) { setAuthError("New password does not meet requirements."); return; }
       if (authPassword !== confirmPassword) { setAuthError("Passwords mismatch."); return; }
    }
    
    const updatedUser = { 
      ...currentUser, 
      mobile: mobilePhone, 
      permanentAddress, 
      correspondenceAddress,
      password: authPassword ? authPassword : currentUser.password
    };
    
    setCitizens(prev => prev.map(c => c.ic === currentUser.ic ? updatedUser : c));
    setCurrentUser(updatedUser);
    setAuthError("Profile updated successfully!");
    setAuthPassword('');
    setConfirmPassword('');
    setTimeout(() => setAuthError(null), 3000);
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
    <div className={`min-h-screen relative overflow-x-hidden font-sans transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Global Loader Overlay */}
      {(isLoggingOut || isMatching) && (
        <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-black/80 text-center">
           <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-6" />
           <p className="text-white font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Processing...</p>
        </div>
      )}

      {/* SIDEBAR DRAWER */}
      <div className={`fixed top-0 right-0 h-full w-[360px] z-[60] shadow-2xl transition-transform duration-500 ease-out transform ${showSidebar ? 'translate-x-0' : 'translate-x-full'} ${darkMode ? 'bg-slate-950 border-l border-white/5' : 'bg-white'}`}>
         <div className="p-8 border-b border-slate-500/10 flex justify-between items-center">
            {sidebarAuthMode !== 'menu' && <button onClick={() => changeAuthMode('menu')} className="text-[10px] font-black uppercase opacity-40 hover:opacity-100 flex items-center gap-2"><ChevronRight className="w-4 h-4 rotate-180" /> Back</button>}
            <h3 className="font-black uppercase tracking-[0.3em] text-[10px] opacity-30 flex-grow text-center">My Menu</h3>
            <button onClick={() => {setShowSidebar(false); changeAuthMode('menu');}} className="p-2 rounded-full hover:bg-slate-500/10"><X className="w-6 h-6" /></button>
         </div>

         <div className="flex-grow overflow-y-auto scrollbar-hide p-8 text-center font-medium h-[calc(100%-160px)]">
            {sidebarAuthMode === 'menu' && (
              <div className="space-y-10 animate-in fade-in zoom-in-95">
                 <div className="flex flex-col items-center">
                    <div className="relative group">
                       <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center shadow-2xl overflow-hidden bg-slate-500/10 border-4 ${darkMode ? 'border-white/5' : 'border-white'}`}>
                          {profileImage ? <img src={profileImage} className="w-full h-full object-cover" alt="Avatar" style={{transform: `scale(${imageScale})`}} /> : <User className="w-14 h-14 text-white/50" />}
                       </div>
                       {isLoggedIn && !isAdmin && <button onClick={() => fileInputRef.current.click()} className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-yellow-500 text-black shadow-lg transform hover:scale-110 active:scale-95 transition-all"><Camera className="w-5 h-5" /></button>}
                       <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                    {isConfirmingPhoto && (
                      <div className="mt-8 p-6 rounded-3xl bg-slate-500/5 border border-yellow-500/20 animate-in slide-in-from-top-4">
                         <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-yellow-500 shadow-inner mb-4">
                            <img src={tempImage} className="w-full h-full object-cover" style={{transform: `scale(${imageScale})`}} alt="Preview" />
                         </div>
                         <input type="range" min="0.5" max="3" step="0.01" value={imageScale} onChange={(e) => setImageScale(parseFloat(e.target.value))} className="w-full accent-yellow-500 mb-6" />
                         <div className="flex gap-2">
                            <button onClick={handleCancelPhoto} className="flex-grow py-3 rounded-xl bg-slate-500/10 text-[9px] font-black uppercase">Cancel</button>
                            <button onClick={handleConfirmPhoto} className="flex-grow py-3 rounded-xl bg-yellow-500 text-black text-[9px] font-black uppercase font-bold">Apply</button>
                         </div>
                      </div>
                    )}
                    {!isConfirmingPhoto && (
                      <div className="mt-6">
                         <h4 className="font-black uppercase tracking-tighter text-2xl leading-tight">{isLoggedIn ? currentUser?.name : "GUEST USER"}</h4>
                         {isLoggedIn && !isAdmin && <p className="text-[10px] font-bold opacity-30 mt-3 tracking-widest uppercase text-center">ID: KC-{currentUser?.ic.split('-').join('')}</p>}
                         {isLoggedIn && isAdmin && <p className="text-[10px] font-black text-purple-500 mt-2 tracking-widest uppercase text-center">Admin Hub Active</p>}
                      </div>
                    )}
                 </div>

                 {!isLoggedIn && !isConfirmingPhoto && (
                   <div className="space-y-3">
                      <button onClick={() => changeAuthMode('login')} className="w-full py-5 rounded-3xl bg-black text-white dark:bg-white dark:text-black font-black uppercase text-xs tracking-widest shadow-xl transition-transform active:scale-95">Log In</button>
                      <button onClick={() => { setShowAuthModal(true); setSignUpStep(1); setShowSidebar(false); }} className="w-full py-5 rounded-3xl border-2 border-slate-500/20 font-black uppercase text-xs tracking-widest hover:bg-slate-500/5 transition-all">Sign Up</button>
                   </div>
                 )}

                 {isLoggedIn && !isAdmin && !isConfirmingPhoto && (
                   <div className="space-y-2 text-left">
                      <button onClick={() => {
                        setMobilePhone(currentUser?.mobile || '');
                        setPermanentAddress(currentUser?.permanentAddress || '');
                        setCorrespondenceAddress(currentUser?.correspondenceAddress || '');
                        setAuthPassword('');
                        setConfirmPassword('');
                        setAuthError(null);
                        setSidebarAuthMode('overview');
                      }} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-slate-500/5 font-black text-sm transition-all hover:bg-yellow-500/10"><Fingerprint className="w-5 h-5 opacity-40" /> My Profile</button>
                      <button onClick={() => setSidebarAuthMode('status')} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-slate-500/5 font-black text-sm transition-all hover:bg-yellow-500/10"><Clock className="w-5 h-5 opacity-40" /> Track Status</button>
                      <button onClick={() => setSidebarAuthMode('security')} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-slate-500/5 font-black text-sm transition-all hover:bg-yellow-500/10"><ShieldAlert className="w-5 h-5 opacity-40" /> Security</button>
                   </div>
                 )}

                 <div className="space-y-3 pt-6 border-t border-slate-500/10">
                    <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center justify-between p-5 rounded-3xl bg-slate-500/5 transition-all">
                       <div className="flex items-center gap-4">{darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}<span className="font-black text-xs uppercase">{darkMode ? 'Light' : 'Dark'} Mode</span></div>
                       <div className={`w-10 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-yellow-500' : 'bg-slate-300'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${darkMode ? 'left-6' : 'left-1'}`} /></div>
                    </button>
                 </div>
              </div>
            )}

            {/* MY PROFILE VIEW */}
            {sidebarAuthMode === 'overview' && !isAdmin && (
              <div className="animate-in slide-in-from-right-4 text-left">
                 <h4 className="font-black uppercase text-2xl mb-8">My Profile</h4>
                 {authError && <div className={`mb-6 p-4 rounded-2xl ${authError.includes('successfully') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} text-[10px] font-black uppercase flex items-center gap-3 animate-shake`}>{authError.includes('successfully') ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />} {authError}</div>}
                 
                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase opacity-20 tracking-widest border-b border-slate-500/10 pb-2">Identification (Locked)</h5>
                    {[{ l: 'MyKad', v: currentUser?.ic }, { l: 'Name', v: currentUser?.name }, { l: 'Race', v: currentUser?.race }, { l: 'Religion', v: currentUser?.religion }].map((f, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-500/5 opacity-50"><p className="text-[9px] font-bold opacity-30 uppercase">{f.l}</p><p className="font-black text-xs">{f.v || 'N/A'}</p></div>
                    ))}
                    
                    <h5 className="text-[10px] font-black uppercase opacity-20 tracking-widest border-b border-slate-500/10 pb-2 mt-8">Contact & Address</h5>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 ml-1">Mobile (+60)</label><input type="text" value={mobilePhone} onChange={handleMobileChange} className="w-full p-4 rounded-2xl border-2 font-black outline-none bg-transparent focus:border-yellow-500" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 ml-1">Permanent Address</label><textarea rows="2" value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value.toUpperCase())} className="w-full p-4 rounded-2xl border-2 font-black outline-none bg-transparent focus:border-yellow-500 resize-none" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 ml-1">Correspondence Address</label><textarea rows="2" value={correspondenceAddress} onChange={(e) => setCorrespondenceAddress(e.target.value.toUpperCase())} className="w-full p-4 rounded-2xl border-2 font-black outline-none bg-transparent focus:border-yellow-500 resize-none" /></div>

                    <h5 className="text-[10px] font-black uppercase opacity-20 tracking-widest border-b border-slate-500/10 pb-2 mt-8">Security (Change Password)</h5>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 ml-1">New Password</label><input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Leave blank to keep current" className="w-full p-4 rounded-2xl border-2 font-black outline-none bg-transparent focus:border-yellow-500" /></div>
                    {authPassword && (
                      <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 ml-1">Confirm New Password</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-4 rounded-2xl border-2 font-black outline-none bg-transparent focus:border-yellow-500" /></div>
                    )}
                    
                    <button onClick={handleUpdateProfile} className="w-full py-5 rounded-3xl bg-yellow-500 text-black font-black uppercase text-xs tracking-widest shadow-xl mt-4 active:scale-95 transition-transform">Save Changes</button>
                 </div>
              </div>
            )}

            {/* TRACK STATUS VIEW */}
            {sidebarAuthMode === 'status' && !isAdmin && (
              <div className="animate-in slide-in-from-right-4 text-left">
                 <h4 className="font-black uppercase text-2xl mb-8">Track Status</h4>
                 <div className="space-y-4">
                    {currentUser?.applications?.map(app => (
                      <div key={app.id} className="p-4 rounded-2xl bg-slate-500/5">
                        <p className="font-black text-[11px] uppercase">{app.name}</p>
                        <div className="flex justify-between items-center mt-3">
                           <span className={`px-2 py-1 rounded-lg text-[9px] font-black text-white uppercase ${app.status === 'Approved' ? 'bg-green-500' : app.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}>{app.status}</span>
                           <span className="text-[9px] font-bold opacity-40">{app.date}</span>
                        </div>
                      </div>
                    ))}
                    {(!currentUser?.applications || currentUser?.applications.length === 0) && <p className="text-xs opacity-40 text-center">No applications found.</p>}
                 </div>
              </div>
            )}

            {/* SECURITY TRACKING VIEW */}
            {sidebarAuthMode === 'security' && !isAdmin && (
              <div className="animate-in slide-in-from-right-4 text-left">
                 <div className="flex items-center gap-3 mb-8"><Shield className="text-yellow-500 w-8 h-8" /><h4 className="font-black uppercase text-2xl">Security</h4></div>
                 <h5 className="text-[10px] font-black uppercase opacity-20 tracking-widest border-b border-slate-500/10 pb-2 mb-4">Login History</h5>
                 <div className="space-y-3">
                    {currentUser?.loginHistory?.map((log, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-500/5 flex flex-col gap-1">
                         <span className="text-[11px] font-black">{log.device}</span>
                         <span className="text-[9px] font-bold opacity-40">{log.time}</span>
                      </div>
                    ))}
                    {(!currentUser?.loginHistory || currentUser?.loginHistory.length === 0) && <p className="text-xs opacity-40 text-center">No history available.</p>}
                 </div>
              </div>
            )}

            {/* REPORT BUG FORM */}
            {sidebarAuthMode === 'report-bug' && (
              <div className="animate-in slide-in-from-right-4 text-left space-y-6">
                 <h4 className="font-black uppercase text-2xl mb-4">Report Issue</h4>
                 <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Describe Issue</label><textarea value={bugDesc} onChange={(e) => setBugDesc(e.target.value)} rows="5" className="w-full p-5 rounded-2xl border-2 font-medium bg-transparent outline-none focus:border-red-500/50" /></div>
                 <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Screenshot</label><div onClick={() => bugInputRef.current.click()} className="w-full p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer">{bugScreen ? <img src={bugScreen} className="h-24 rounded-lg" alt="P" /> : <Image className="w-8 h-8 opacity-20" />}</div><input type="file" ref={bugInputRef} className="hidden" accept="image/*" onChange={handleBugScreenshot} /></div>
                 <button onClick={submitBug} className="w-full py-5 rounded-3xl bg-red-600 text-white font-black uppercase tracking-widest shadow-xl active:scale-95">Submit Report</button>
              </div>
            )}

            {/* LOGIN FORMS */}
            {(sidebarAuthMode === 'login' || sidebarAuthMode === 'admin-login') && (
              <div className="animate-in slide-in-from-right-4 text-left">
                 <h4 className="font-black uppercase text-2xl mb-8">{sidebarAuthMode === 'login' ? 'User Access' : 'Admin Unlock'}</h4>
                 {authError && <div className="mb-6 p-4 rounded-2xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase flex items-center gap-3 animate-shake"><AlertTriangle className="w-4 h-4" /> {authError}</div>}
                 <form onSubmit={isIdentityVerified ? handleLoginSubmit : handleVerifyIdentity} className="space-y-6">
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Identity ID or Username</label><input type="text" value={authIdentity} onChange={handleLoginIdentityChange} className={`w-full p-5 rounded-2xl border-2 font-black outline-none bg-transparent ${isIdentityVerified ? 'border-green-500/40' : ''}`} /></div>
                    {isIdentityVerified && (<div className="space-y-2 animate-in slide-in-from-top-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">{sidebarAuthMode === 'login' ? 'Password' : 'Verified Email'}</label><input type={sidebarAuthMode === 'login' ? "password" : "email"} value={sidebarAuthMode === 'login' ? authPassword : authEmail} onChange={(e) => sidebarAuthMode === 'login' ? setAuthPassword(e.target.value) : setAuthEmail(e.target.value)} className="w-full p-5 rounded-2xl border-2 font-black outline-none bg-transparent" /></div>)}
                    <button type="submit" className={`w-full py-5 rounded-3xl text-white font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${sidebarAuthMode === 'login' ? 'bg-black dark:bg-white dark:text-black' : 'bg-purple-600'}`}>{isVerifying ? <Loader2 className="animate-spin mx-auto" /> : (isIdentityVerified ? 'Access Portal' : 'Verify ID')}</button>
                 </form>
              </div>
            )}
         </div>

         {sidebarAuthMode === 'menu' && !isConfirmingPhoto && (
           <div className="absolute bottom-0 w-full p-8 border-t border-slate-500/10 text-center space-y-4 bg-slate-50 dark:bg-slate-950">
              <button onClick={triggerBugAnimation} className="w-full py-4 rounded-2xl border border-red-500/20 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Report Bug</button>
              {!isLoggedIn && <button onClick={() => changeAuthMode('admin-login')} className="w-full py-3 text-[10px] font-black uppercase opacity-10 hover:opacity-100 hover:text-purple-500 transition-all text-xs">Hey Admin</button>}
              {isLoggedIn && <button onClick={handleLogout} className="w-full flex items-center justify-center gap-4 p-5 text-red-500 font-black text-sm hover:bg-red-500/10 rounded-3xl transition-all active:scale-95"><LogOut className="w-5 h-5" /> Sign Out</button>}
           </div>
         )}
      </div>

      {/* MAIN WRAPPER - Push Logic */}
      <div className={`transition-transform duration-500 ease-out flex flex-col min-h-screen w-full ${showSidebar ? '-translate-x-[360px]' : 'translate-x-0'}`}>
        <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
          <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setSearchQuery('')}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-yellow-500 font-bold text-black text-xs shadow-lg transform group-hover:scale-110 transition-transform">{portalLogo}</div>
              <h1 className="font-black text-xl tracking-tighter uppercase">KENYALANG <span className="text-yellow-500">CARE</span></h1>
            </div>
            <button onClick={() => setShowSidebar(true)} className={`p-3 rounded-2xl border transition-all hover:shadow-lg active:scale-95 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}><Menu className="w-6 h-6 opacity-60" /></button>
          </div>
        </header>

        <main className="flex-grow w-full md:max-w-3xl mx-auto px-4 py-8 md:py-16 text-center">
          <div className="relative group mb-12"><Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-yellow-600 z-10" /><input type="text" placeholder={placeholderText} className={`w-full pl-16 pr-6 py-7 rounded-3xl border-2 outline-none font-bold text-lg shadow-2xl transition-all ${darkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-200 focus:border-black'}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>

          {/* ADMIN PANELS */}
          {isLoggedIn && isAdmin && (
            <div className="mb-12 space-y-8 animate-in slide-in-from-top-4 duration-500 text-left">
               <div className="rounded-[2.5rem] border-2 border-purple-500/20 bg-purple-500/5 backdrop-blur-md overflow-hidden">
                  <div className="p-8 flex items-center justify-between"><div className="flex items-center gap-4 text-purple-600"><UserCog className="w-6 h-6" /><h2 className="text-xl font-black uppercase tracking-tighter">Citizen Hub</h2></div><button onClick={() => setIsCitizenHubMinimized(!isCitizenHubMinimized)} className="p-3 rounded-2xl bg-purple-600/10 text-purple-600"><ChevronDown className="w-5 h-5" /></button></div>
                  {!isCitizenHubMinimized && <div className="px-8 pb-10 space-y-4">{filteredCitizens.map(citizen => (<div key={citizen.ic} className="p-5 rounded-[2rem] border border-purple-500/20 bg-white dark:bg-black/40 shadow-sm space-y-4"><div className="flex flex-col md:flex-row md:items-center justify-between gap-4"><div><h4 className="text-lg font-black uppercase">{citizen.name}</h4><p className="text-[9px] font-bold opacity-30 mt-2 uppercase">IC: {citizen.ic} • {citizen.race} • {citizen.religion}</p></div><button onClick={() => editCitizenIdentity(citizen.ic)} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 text-white font-black uppercase text-[9px]"><Edit3 className="w-3 h-3" /> Edit Identity</button></div><div className="pt-3 border-t border-purple-500/5">{citizen.applications?.map(app => (<div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5"><p className="font-black text-[10px] uppercase">{app.name}</p><div className="flex items-center gap-3"><span className={`px-2.5 py-1 rounded-lg text-[8px] font-black text-white uppercase ${app.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'}`}>{app.status}</span><button onClick={() => switchAppStatus(citizen.ic, app.id)} className="p-1.5 rounded-lg bg-purple-100 text-purple-600"><RefreshCw className="w-3.5 h-3.5" /></button></div></div>))}</div></div>))}</div>}
               </div>
               <div className="rounded-[2.5rem] border-2 border-red-500/20 bg-red-500/5 backdrop-blur-md overflow-hidden">
                  <div className="p-8 flex items-center justify-between"><div className="flex items-center gap-4 text-red-600"><Bug className="w-6 h-6" /><h2 className="text-xl font-black uppercase tracking-tighter">Bug Management</h2></div><button onClick={() => setIsBugHubMinimized(!isBugHubMinimized)} className="p-3 rounded-2xl bg-red-600/10 text-red-600"><ChevronDown className="w-5 h-5" /></button></div>
                  {!isBugHubMinimized && <div className="px-8 pb-10 space-y-4">{bugReports.map(bug => (<div key={bug.id} className="p-5 rounded-[2rem] border border-red-500/20 bg-white dark:bg-black/40 shadow-sm space-y-4"><p className="text-[10px] font-black uppercase text-red-500">ID: #{bug.id.toString().slice(-4)} • {bug.time}</p><p className="text-xs font-medium italic">"{bug.desc}"</p>{bug.screenshot && <img src={bug.screenshot} className="h-20 w-20 rounded-lg shadow" alt="Bug" />}<div className="pt-3 border-t border-red-500/10 flex justify-between items-center"><p className="text-[8px] font-black uppercase opacity-40">Reporter: {bug.user}</p><button onClick={() => setBugReports(bugReports.filter(b => b.id !== bug.id))} className="text-[8px] font-black text-red-500 hover:underline">Resolve</button></div></div>))}</div>}
               </div>
               <div className="rounded-[2.5rem] border-2 border-purple-500/20 bg-purple-500/5 backdrop-blur-md overflow-hidden">
                  <div className="p-8 flex items-center justify-between"><div className="flex items-center gap-4 text-purple-600"><LayoutGrid className="w-6 h-6" /><h2 className="text-xl font-black uppercase tracking-tighter">Service Editor</h2></div><div className="flex gap-2"><button onClick={changeLogo} className="p-3 rounded-2xl bg-white text-purple-500 text-[9px] font-black uppercase">Logo: {portalLogo}</button><button onClick={() => setIsCatalogHubMinimized(!isCatalogHubMinimized)} className="p-3 rounded-2xl bg-purple-600/10 text-purple-600"><ChevronDown className="w-5 h-5" /></button></div></div>
                  {!isCatalogHubMinimized && <div className="px-8 pb-10 space-y-6"><button onClick={handleAddNewCategory} className="w-full py-4 rounded-2xl bg-purple-600 text-white font-black uppercase text-[10px]">New Category</button>{services.map(cat => (<div key={cat.id} className="p-5 rounded-3xl border border-purple-500/10 bg-white/30 dark:bg-black/20 space-y-4"><div className="flex items-center justify-between pb-3 border-b border-purple-500/5"><h4 className="font-black text-sm uppercase text-purple-400">{cat.title.en}</h4><div className="flex gap-2"><button onClick={() => handleEditCategory(cat.id)} className="p-1.5 rounded-lg text-purple-500"><Edit3 className="w-4 h-4" /></button><button onClick={() => handleAddItem(cat.id)} className="p-1.5 rounded-lg bg-purple-600 text-white"><Plus className="w-4 h-4" /></button></div></div><div className="grid gap-3">{cat.items.map((it, idx) => (<div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm"><div className="flex-grow pr-4"><p className="font-black text-[11px] uppercase">{it.en}</p><p className="text-[9px] opacity-40 italic">"{it.desc}"</p></div><div className="flex gap-2"><button onClick={() => handleEditItem(cat.id, idx)} className="p-1.5 rounded-lg text-slate-500"><Settings className="w-3 h-3" /></button><button onClick={() => handleDeleteItem(cat.id, idx)} className="p-1.5 rounded-lg text-red-500"><Trash2 className="w-3 h-3" /></button></div></div>))}</div></div>))}</div>}
               </div>
            </div>
          )}

          {!isAdmin && (
            <div className="space-y-16">
              <div className="space-y-6 text-left px-4"><h2 className="text-3xl font-black uppercase flex items-center gap-4"><SchoolIcon className="text-yellow-600" /> School and Student</h2><div className="space-y-4">{studentServices.map(cat => (<div key={cat.id} className={`rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${expandedCategoryId === cat.id ? 'border-yellow-500 shadow-lg' : 'border-slate-800/10'}`}><div onClick={() => toggleCategory(cat.id)} className="p-8 cursor-pointer flex items-center gap-8"><div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${expandedCategoryId === cat.id ? 'bg-yellow-500 text-black rotate-12 shadow-lg' : 'bg-slate-800/10'}`}>{React.createElement(IconMap[cat.icon] || GraduationCap, { className: "w-7 h-7" })}</div><div className="flex-grow"><h3 className={`font-black text-lg uppercase ${expandedCategoryId === cat.id ? 'text-yellow-600' : ''}`}>{cat.title.en}</h3></div><ChevronDown className={`transition-transform duration-500 ${expandedCategoryId === cat.id ? 'rotate-180 text-yellow-500' : 'opacity-20'}`} /></div>{expandedCategoryId === cat.id && <div className="px-8 pb-10 space-y-4 text-left">{cat.items.map((item, idx) => (<div key={idx} className="p-4 border-b border-slate-500/10 group last:border-none">
                {item.link !== "#" ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-black uppercase text-sm block hover:text-yellow-600 transition-colors text-blue-600 dark:text-blue-400">{item.en}</a>
                ) : (
                  <span className="font-black uppercase text-sm block text-slate-500 dark:text-slate-400 cursor-not-allowed">{item.en}</span>
                )}
                <p className="text-[10px] opacity-60 italic text-slate-600 dark:text-slate-300">
                  {item.link === "#" ? (item.desc || "Link Not Available") : "Online Portal Available"}
                </p>
              </div>))}</div>}</div>))}</div></div>

              <div className="space-y-6 text-left px-4"><h2 className="text-3xl font-black uppercase flex items-center gap-4"><Globe className="text-yellow-600" /> Service Sarawak</h2><div className="space-y-4">{sarawakServices.map(cat => (<div key={cat.id} className={`rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${expandedCategoryId === cat.id ? 'border-yellow-500 shadow-lg' : 'border-slate-800/10'}`}><div onClick={() => toggleCategory(cat.id)} className="p-8 cursor-pointer flex items-center gap-8"><div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${expandedCategoryId === cat.id ? 'bg-yellow-500 text-black rotate-12 shadow-lg' : 'bg-slate-800/10'}`}>{React.createElement(IconMap[cat.icon] || GraduationCap, { className: "w-7 h-7" })}</div><div className="flex-grow"><h3 className={`font-black text-lg uppercase ${expandedCategoryId === cat.id ? 'text-yellow-600' : ''}`}>{cat.title.en}</h3></div><ChevronDown className={`transition-transform duration-500 ${expandedCategoryId === cat.id ? 'rotate-180 text-yellow-500' : 'opacity-20'}`} /></div>{expandedCategoryId === cat.id && <div className="px-8 pb-10 space-y-4 text-left">{cat.items.map((item, idx) => (<div key={idx} className="p-4 border-b border-slate-500/10 group last:border-none">
                {item.link !== "#" ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-black uppercase text-sm block hover:text-yellow-600 transition-colors text-blue-600 dark:text-blue-400">{item.en}</a>
                ) : (
                  <span className="font-black uppercase text-sm block text-slate-500 dark:text-slate-400 cursor-not-allowed">{item.en}</span>
                )}
                <p className="text-[10px] opacity-60 italic text-slate-600 dark:text-slate-300">
                  {item.link === "#" ? (item.desc || "Link Not Available") : "Online Portal Available"}
                </p>
              </div>))}</div>}</div>))}</div></div>
            </div>
          )}
        </main>

        <footer className={`mt-24 py-20 border-t ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="w-full md:max-w-3xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-12 text-xs font-medium opacity-60 mb-12">
              <button onClick={() => setShowAboutUs(true)} className="hover:text-yellow-600 transition-all font-bold uppercase tracking-widest">about us</button>
              <span className="opacity-10">•</span>
              <a href={UI_TEXT.privacyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-600 transition-all font-bold uppercase tracking-widest">privacy policy</a>
            </div>
            <p className="text-[10px] opacity-20 uppercase font-black tracking-[0.4em]">© 2026 Kenyalang Care. Digital Sarawak Unit.</p>
          </div>
        </footer>
      </div>

      {/* ABOUT US Bubble */}
      {showAboutUs && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowAboutUs(false)}>
          <div className={`relative w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300 ${darkMode ? 'bg-slate-900 border-2 border-slate-800' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <MessageSquare className="w-10 h-10 text-yellow-500 mx-auto mb-6" />
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter">About us</h3>
            <p className="text-sm opacity-80 leading-[1.6] font-medium text-justify mb-8">{UI_TEXT.about}</p>
            <button onClick={() => setShowAboutUs(false)} className="w-full py-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all">Close</button>
          </div>
        </div>
      )}

      {/* FULL PAGE SIGN UP MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-white dark:bg-slate-950 animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-5xl mx-auto p-8 md:p-16 relative flex-grow flex flex-col text-left">
            <button onClick={() => {setShowAuthModal(false); resetSignUpForm();}} className="absolute top-8 right-8 p-3 rounded-full hover:bg-slate-500/10 transition-colors"><X className="w-8 h-8 opacity-40" /></button>
            
            {signUpStep === 1 ? (
              <div className="animate-in slide-in-from-bottom-8 duration-500">
                <div className="text-center mb-16">
                  <h3 className="text-5xl font-black uppercase tracking-tighter mb-4">Create Profile</h3>
                  <p className="text-sm font-bold opacity-30 uppercase tracking-[0.6em]">Official Sarawak Digital Identity</p>
                </div>
                {authError && <div className="mb-10 p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase flex items-center gap-4 animate-shake"><AlertTriangle className="w-6 h-6" /> {authError}</div>}
                
                <form onSubmit={handleAuthSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                   <div className="space-y-8">
                      <h5 className="text-xs font-black uppercase opacity-20 tracking-widest border-b pb-4 border-slate-500/10">Personal Details</h5>
                      <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Full Name (As per IC)</label><input required type="text" value={authName} onChange={(e) => setAuthName(e.target.value.toUpperCase())} className="w-full p-5 rounded-3xl border-2 border-slate-500/10 font-black outline-none bg-transparent focus:border-yellow-500" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">MyKad Number</label><input required type="text" value={authIdentity} onChange={handleSignUpIdentityChange} placeholder="######-##-####" className="w-full p-5 rounded-3xl border-2 border-slate-500/10 font-black outline-none bg-transparent focus:border-yellow-500" /></div>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Race</label>
                            <select required value={authRace} onChange={(e) => setAuthRace(e.target.value)} className="w-full p-5 rounded-3xl border-2 border-slate-500/10 font-black outline-none bg-transparent focus:border-yellow-500"><option value="">Select</option><option value="Iban">Iban</option><option value="Malay">Malay</option><option value="Chinese">Chinese</option><option value="Bidayuh">Bidayuh</option><option value="Melanau">Melanau</option><option value="Others">Others</option></select>
                         </div>
                         <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Religion</label>
                            <select required value={authReligion} onChange={(e) => setAuthReligion(e.target.value)} className="w-full p-5 rounded-3xl border-2 border-slate-500/10 font-black outline-none bg-transparent focus:border-yellow-500"><option value="">Select</option><option value="Christianity">Christianity</option><option value="Islam">Islam</option><option value="Buddhism">Buddhism</option><option value="Hinduism">Hinduism</option><option value="Others">Others</option></select>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Gender</label>
                            <select required value={authGender} onChange={(e) => setAuthGender(e.target.value)} className="w-full p-5 rounded-3xl border-2 border-slate-500/10 font-black outline-none bg-transparent focus:border-yellow-500"><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option></select>
                         </div>
                         <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Choose Username</label><input required type="text" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} className="w-full p-5 rounded-3xl border-2 border-slate-500/10 font-black outline-none bg-transparent focus:border-yellow-500" /></div>
                      </div>
                   </div>
                   
                   <div className="space-y-8 flex flex-col">
                      <h5 className="text-xs font-black uppercase opacity-20 tracking-widest border-b pb-4 border-slate-500/10">Contact Records</h5>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Mobile</label><input required type="text" value={mobilePhone} onChange={handleMobileChange} placeholder="0123456789" className="w-full p-5 rounded-3xl border-2 border-slate-500/10 font-black bg-transparent outline-none focus:border-yellow-500" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Email</label><input required type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} placeholder="mail@example.com" className="w-full p-5 rounded-3xl border-2 border-slate-500/10 font-black bg-transparent outline-none focus:border-yellow-500" /></div>
                      </div>
                      <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Permanent Address</label><textarea required rows="2" value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value.toUpperCase())} className="w-full p-4 rounded-3xl border-2 border-slate-500/10 font-medium bg-transparent focus:border-yellow-500 resize-none" /></div>
                      <div className="space-y-2 flex-grow"><label className="text-[10px] font-black uppercase opacity-40 px-1">Correspondence Address</label><textarea required rows="2" value={correspondenceAddress} onChange={(e) => setCorrespondenceAddress(e.target.value.toUpperCase())} className="w-full p-4 rounded-3xl border-2 border-slate-500/10 font-medium bg-transparent focus:border-yellow-500 resize-none" /></div>
                      
                      <button type="submit" className="w-full py-8 rounded-[2.5rem] bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xl mt-auto">Confirm <ChevronRight className="inline-block ml-4" /></button>
                   </div>
                </form>
              </div>
            ) : signUpStep === 2 ? (
              <div className="animate-in zoom-in-95 max-w-xl mx-auto py-32 text-center w-full">
                 <div className="mb-16"><div className="w-24 h-24 bg-yellow-500/10 rounded-full mx-auto flex items-center justify-center text-yellow-500 mb-8"><Lock className="w-10 h-10" /></div><h3 className="text-5xl font-black uppercase">Set Security</h3></div>
                 {authError && <div className="mb-10 p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase flex items-center gap-4 animate-shake"><AlertTriangle className="w-6 h-6" /> {authError}</div>}
                 
                 <form onSubmit={handleAuthSubmit} className="space-y-10">
                    <div className="space-y-4 text-left">
                      <label className="text-xs font-black uppercase opacity-40 px-2">Create Password</label>
                      <input required type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full p-6 rounded-[2rem] border-2 border-slate-500/10 font-black outline-none bg-transparent focus:border-yellow-500 text-2xl" />
                      <p className="text-[9px] opacity-40 italic px-4">Must be 8+ characters, include upper/lowercase, number, and symbol.</p>
                    </div>
                    <div className="space-y-4 text-left">
                      <label className="text-xs font-black uppercase opacity-40 px-2">Confirm Password</label>
                      <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-6 rounded-[2rem] border-2 border-slate-500/10 font-black outline-none bg-transparent focus:border-yellow-500 text-2xl" />
                    </div>
                    <button type="submit" className="w-full py-8 rounded-[2.5rem] bg-yellow-500 text-black font-black uppercase tracking-widest shadow-xl transform active:scale-95 text-xl">Continue to Final Review</button>
                    <button type="button" onClick={() => setSignUpStep(1)} className="w-full py-4 text-[10px] font-black uppercase opacity-40">Back to Details</button>
                 </form>
              </div>
            ) : signUpStep === 3 ? (
              <div className="animate-in zoom-in-95 py-32 text-center max-w-2xl mx-auto">
                 <ShieldAlert className="w-24 h-24 text-red-500 mx-auto mb-10 animate-pulse" />
                 <h3 className="text-5xl font-black uppercase mb-8">Ready to Start?</h3>
                 <div className="p-10 rounded-[3rem] border-2 border-red-500/20 bg-red-500/5 mb-10 text-left shadow-inner"><p className="text-lg font-medium leading-relaxed opacity-80 text-justify">{UI_TEXT.signUpWarning}</p></div>
                 <button onClick={handleAuthSubmit} className="w-full py-8 rounded-[2.5rem] bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xl text-center">Agree & Enter Homepage</button>
                 <button type="button" onClick={() => setSignUpStep(2)} className="w-full py-4 text-[10px] font-black uppercase opacity-40 mt-4">Back to Security</button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;