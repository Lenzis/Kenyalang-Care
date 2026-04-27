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
import { supabase } from './supabaseClient';

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
  authErrorWrongCreds: "Verification failed. Check credentials.",
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
  Zap, Gavel, Waves, Smartphone, Activity, SchoolIcon, Bug
};

// --- Mock Records Database ---
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

// --- Exhaustive Service Catalog ---
const INITIAL_SERVICES = [
  // --- SCHOOL AND STUDENTS ---
  { id: 1, group: "student", title: { en: "1. Aids / Bantuan for student" }, icon: "SchoolIcon", items: [
    { en: "Special Financial Assistance for Sarawak Student", desc: "Aids / Bantuan for student", link: "https://myys.yayasansarawak.org.my/student_self_registration/step_1_form.php" },
    { en: "Laptop", desc: "Digital aid for students", link: "https://myys.yayasansarawak.org.my/student_self_registration/step_1_form.php" },
    { en: "Book", desc: "Material assistance", link: "https://myys.yayasansarawak.org.my/student_self_registration/step_1_form.php" },
    { en: "Free school transport", desc: "Please Apply Via School Authorities", link: "#" },
    { en: "School scholarship", desc: "Please Apply Via School Authorities", link: "#" },
    { en: "Tuition", desc: "Please Apply Via School Authorities", link: "#" },
    { en: "Uniform", desc: "Please Apply Via School Authorities", link: "#" }
  ]},
  { id: 2, group: "student", title: { en: "2. Biasiswa" }, icon: "BookOpen", items: [
    { en: "Biasiswa yayasan sarawak tun taib", desc: "Higher learning scholarship", link: "http://175.138.68.197:5300/Account/UserLogin.aspx?AspxAutoDetectCookieSupport=1" },
    { en: "Yayasan biasiswa Sarawak tunku Abdul rahman (YBSTAR)", desc: "State scholarship", link: "http://175.138.68.197:5300/Account/UserLogin.aspx" },
    { en: "Biasiswa khas program perubatan unias", desc: "Medical sponsorship", link: "#" },
    { en: "Biasiswa tempatan yayasan sarawak", desc: "Local sponsorship", link: "#" },
    { en: "Bantuan kemasukan ke IPT", desc: "Entrance aid", link: "http://175.138.68.197:51/iwps/Account/UserLogin.aspx" },
    { en: "Bursari BP40", desc: "Financial assistance", link: "#" },
    { en: "Inisiatif Graduan Pulang Sarawak (i - GPS)", desc: "Graduate subsidy", link: "http://175.138.68.197:51/iwps/Account/UserLogin.aspx" }
  ]},
  { id: 3, group: "student", title: { en: "3. Pinjaman" }, icon: "Calculator", items: [
    { en: "Biasiswa pinjaman pelajaran dalam negara", desc: "Domestic loans", link: "http://175.138.68.197:51/iwps/Account/UserLogin.aspx" },
    { en: "Pinjaman pelajaran luar negara", desc: "International loans", link: "http://175.138.68.197:51/iwps/Account/UserLogin.aspx" },
    { en: "Biasiswa pinjaman latihan teknikal", desc: "Technical loans", link: "http://175.138.68.197:51/iwps/Account/UserLogin.aspx" }
  ]},
  { id: 4, group: "student", title: { en: "4. Program dan bantuan" }, icon: "Users", items: [
    { en: "Biasiswa program pertukaran pelajaran", desc: "Exchange funding", link: "https://yayasansarawak.org.my/wp-content/uploads/2022/10/Borang-Permohonan-Pertukaran-Pelajaran-2022.pdf" },
    { en: "Program pendidikan komuniti", desc: "Community learning", link: "#" },
    { en: "Program bantuan pakaian seragam sekolah", desc: "Uniform aid", link: "#" },
    { en: "Program HiPERS", desc: "High performance school program", link: "#" },
    { en: "Perkhidmatan pengangkutan percuma pelajar sekolah", desc: "Free student transport", link: "#" },
    { en: "Program tuisyen sekolah menengah", desc: "Tuition aid", link: "#" },
    { en: "Anugerah khas premier sarawak (AKPS)", desc: "Premier awards", link: "#" },
    { en: "Program pemerkasaan Bahasa inggeris (EPP)", desc: "English proficiency", link: "#" },
    { en: "Anugerah Graduan Cemerlang", desc: "Graduate awards", link: "#" },
    { en: "YS-JPNS Collaborations Programs", desc: "Joint education programs", link: "#" }
  ]},
  { id: 5, group: "student", title: { en: "6. Bayaran balık pijaman" }, icon: "RefreshCw", items: [
    { en: "Kaedah", desc: "Methods of repayment", link: "#" },
    { en: "Insentif", desc: "Early repayment incentives", link: "#" }
  ]},
  { id: 6, group: "student", title: { en: "7. Performance Reporting" }, icon: "FileUp", items: [
    { en: "Hantar Keputusan Semester / Laporan Prestasi Pengajian", desc: "Online results form", link: "https://docs.google.com/forms/d/e/1FAIpQLSfhg1nbHOw4N_i8T212qY3QjZNM6nB1EdH4vsHszc9PNV8MDw/viewform" }
  ]},

  // --- SERVICE SARAWAK ---
  { id: 7, group: "service", title: { en: "1. Council Service" }, icon: "Building2", items: [
    { en: "Apply for e-Billing of Assessment Rates Bills", desc: "Digital billing", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/288/" },
    { en: "Form G(1)-Certificate of Clearance", desc: "Debt clearance", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/270/" },
    { en: "Update Owner / Rate Payer Information", desc: "Record updates", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/272/" },
    { en: "Apply for Rebate of Assessment Rates", desc: "Rate rebates", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/274/" },
    { en: "Transfer of Ownership of Rateable Holdings", desc: "Ownership transfer", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/271/" },
    { en: "Apply for Payment by Installment", desc: "Assessment installments", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/275/" },
    { en: "House Numbering and Referencing", desc: "New holding info", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/276/" },
    { en: "withdrawal of caveat with Local Councils", desc: "Caveat removal", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/273/" },
    { en: "Apply for Remission of Rates", desc: "Rate remission", link: "https://service.sarawak.gov.my/web/web/home/sla_view/211/287/" }
  ]},
  { id: 8, group: "service", title: { en: "2. Utilities" }, icon: "Droplets", items: [
    { en: "Online Request of Hydrological Data (Org)", desc: "Data enquiry", link: "#" },
    { en: "Change of Water Supply Account Ownership", desc: "Account holder update", link: "#" },
    { en: "Renew Pipe Fitter licence", desc: "License renewal", link: "#" },
    { en: "Apply for Delay Payment", desc: "Bill extension", link: "#" },
    { en: "Water Meter Replacement due to Lost", desc: "Request for lost meter", link: "#" },
    { en: "Application For New Water Supply", desc: "New connection", link: "#" }
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
  
  // --- Auth & Session State ---
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
        if (!INITIAL_ADMINS.find(a => a.id === authIdentity)) { setAuthError(UI_TEXT.authErrorNotFound); return; }
      } else {
        if (!citizens.find(c => c.ic === authIdentity)) { setAuthError(UI_TEXT.authErrorNotFound); return; }
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

<<<<<<< HEAD
  const handleAuthSubmit = (e) => {
    if (e) e.preventDefault();
    if (signUpStep === 1) {
      if (mobilePhone.length < 8) { setAuthError("Invalid mobile."); return; }
      setSignUpStep(2); return;
    }
    if (signUpStep === 2) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regex.test(authPassword)) { setAuthError("Weak criteria."); return; }
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
    setTimeout(() => { setIsLoggedIn(false); setIsAdmin(false); setVerifiedIC(''); setAuthName(''); setProfileImage(null); changeAuthMode('menu'); setIsLoggingOut(false); }, 1200);
  };

  const editCitizenIdentity = (ic) => {
    const c = citizens.find(cit => cit.ic === ic); if (!c) return;
    const nN = prompt("Name:", c.name); const nR = prompt("Race:", c.race); const nRe = prompt("Religion:", c.religion);
    if (nN && nR && nRe) setCitizens(prev => prev.map(cit => cit.ic === ic ? { ...cit, name: nN, race: nR, religion: nRe } : cit));
  };

  const switchAppStatus = (ic, appId) => {
    const nS = prompt("Status (Approved / Pending / Rejected):");
    if (["Approved", "Pending", "Rejected"].includes(nS)) {
      setCitizens(prev => prev.map(c => c.ic === ic ? { ...c, applications: c.applications.map(a => a.id === appId ? { ...a, status: nS } : a) } : c));
=======
  const validatePassword = (pw) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pw);
  };

const handleAuthSubmit = async (e) => {
  if (e) e.preventDefault();
  setAuthError(null);

  // --- SIGNUP FLOW ---
  if (authType === 'signup') {
    if (signUpStep === 1) {
      setSignUpStep(2);
      return;
    }
    if (signUpStep === 2) {
      if (!validatePassword(showPassword)) {
        setAuthError("Password must be 8+ chars with uppercase, lowercase, number and symbol.");
        return;
      }
      if (showPassword !== confirmPassword) {
        setAuthError("Passwords do not match.");
        return;
      }
      setSignUpStep(3);
      return;
    }

    // Step 3: Final Submission to Supabase
    setIsMatching(true);
    
    // 1. Create the Auth Account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: emailAddress,
      password: showPassword,
    });

    if (authError) {
      setAuthError(authError.message);
      setIsMatching(false);
      return;
    }

    // 2. Save Custom Profile Data to the 'profiles' table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          full_name: authName,
          ic_number: authIdentity,
          dob: authDob,
          gender: authGender,
          race: authRace === 'Others' ? otherRace : authRace,
          religion: authReligion === 'Others' ? otherReligion : authReligion,
          mobile_phone: mobilePhone,
          email_address: emailAddress,
          permanent_address: permanentAddress,
          correspondence_address: correspondenceAddress,
          role: 'user' // Default role
        }]);

      if (profileError) {
        setAuthError("Profile saved, but error updating details: " + profileError.message);
      } else {
        setVerifiedIC(authIdentity);
        setIsLoggedIn(true);
        setShowAuthModal(false);
      }
    }
    setIsMatching(false);
  } 

  // --- LOGIN FLOW ---
  else {
    setIsMatching(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailAddress, // Note: You might want to add a password field to your login UI too
      password: showPassword, 
    });

    if (error) {
      setAuthError("Login failed: " + error.message);
      setIsMatching(false);
    } else {
      // Logic for Admin check (e.g., check role from profiles table)
// Logic for Admin check and fetching user data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*') // Get everything!
        .eq('id', data.user.id)
        .single();

      if (profile) {
        setAuthName(profile.full_name);
        setAuthDob(profile.dob);
        setAuthGender(profile.gender);
        setAuthRace(profile.race);
        setAuthReligion(profile.religion);
        setPermanentAddress(profile.permanent_address);
        setCorrespondenceAddress(profile.correspondence_address);
        setMobilePhone(profile.mobile_phone);
        
        if (profile.role === 'admin') setIsAdmin(true);
        setVerifiedIC(profile.ic_number || '');
      }
  }
};

  // --- Translations ---
  const t = useMemo(() => ({
    en: {
      title: 'Kenyalang Care',
      checkStatus: 'Track Status',
      manageProfile: 'Profile Settings',
      adminPanel: 'Admin Dashboard',
      reportBug: 'Report a bug',
      bugThanks: 'Thanks! Bug squashed! 🛡️',
      aboutUs: 'About Us',
      aboutDetail: 'Kenyalang Care is a centralized digital initiative designed to provide a unified bridge between the people of Sarawak and available support systems.',
      statusNote: 'LIVE SERVICE • PHASE 2',
      noResults: 'No matches found.',
      matchBtn: 'Verifying Identity...',
      authTitle: { login: 'Log In', signup: 'Sign Up' },
      authSubtitle: { login: 'Secure citizen access', signup: 'Create your digital profile' },
      authLabels: { identity: 'MyKad / Identity', password: 'Create Password', confirm: 'Confirm Password', verify: 'Verify Identity', name: 'Full Name' },
      authPlaceholder: 'MyKad Number',
      authErrors: { shortIc: "Incomplete Identity (12 digits required).", notFound: "Identity not recognized. Sign up below." },
      authSwitch: { login: "New User? Sign Up Here", signup: "Already have an account? Log In" },
      signUpReminder: "Important: Data Permanence",
      signUpWarning: "Once your account is created, core details like your Name and MyKad (IC) are locked. If you wish to change these in the future, you must contact Kenyalang Care Customer Support for manual verification.",
      close: 'Close',
      logoutNote: 'Signing Out...',
      matchTitle: 'Filter',
      filters: { incomeMin: 'Min Income (RM)', incomeMax: 'Max Income (RM)', age: 'Age', placeholder: 'Enter Age' },
      heyReplies: ["Matching aid...", "Updating profile view...", "Welcome back! 🦅"],
      profile: { guest: 'Guest User', user: authName || 'User', signup: 'Sign Up' },
      searchSuggestions: ['Scholarships', 'Financial Aid', 'SCHB', 'Water Connection']
    },
    ms: {
      title: 'Kenyalang Care',
      checkStatus: 'Jejak Status',
      manageProfile: 'Tetapan Profil',
      adminPanel: 'Papan Pemuka Admin',
      reportBug: 'Lapor pepijat',
      aboutUs: 'Tentang Kami',
      aboutDetail: 'Kenyalang Care adalah inisiatif digital berpusat yang direka untuk menjadi jambatan bersatu antara rakyat Sarawak dan sistem sokongan yang tersedia.',
      statusNote: 'PERKHIDMATAN LIVE • FASA 2',
      noResults: 'Tiada padanan ditemui.',
      matchBtn: 'Mengesahkan Identiti...',
      authTitle: { login: 'Log Masuk', signup: 'Daftar Akaun' },
      authSubtitle: { login: 'Akses rakyat selamat', signup: 'Bina profil digital anda' },
      authLabels: { identity: 'MyKad / Identiti', password: 'Cipta Kata Laluan', confirm: 'Sahkan Kata Laluan', verify: 'Sahkan Identiti', name: 'Nama Penuh' },
      authPlaceholder: 'No. MyKad',
      authErrors: { shortIc: "Identiti tidak lengkap (12 digit diperlukan).", notFound: "Identiti tidak dikenali. Daftar di bawah." },
      authSwitch: { login: "Pengguna Baru? Daftar Di Sini", signup: "Sudah berdaftar? Log Masuk" },
      signUpReminder: "Penting: Kekalan Data",
      signUpWarning: "Setelah akaun dicipta, butiran utama seperti Nama dan MyKad (IC) dikunci. Jika anda ingin menukar ini pada masa hadapan, anda mesti menghubungi Khidmat Pelanggan Kenyalang Care untuk pengesahan manual.",
      close: 'Tutup',
      logoutNote: 'Sedang Log Keluar...',
      matchTitle: 'Penapis',
      filters: { incomeMin: 'Pendapatan Min (RM)', incomeMax: 'Pendapatan Max (RM)', age: 'Umur', placeholder: 'Masukkan Umur' },
      heyReplies: ["Memadankan bantuan...", "Kemaskini paparan...", "Selamat kembali! 🦅"],
      profile: { guest: 'Pengguna Tamu', user: authName || 'User', signup: 'Daftar' },
      searchSuggestions: ['Biasiswa', 'Bantuan Kewangan', 'SCHB', 'Sambungan Air']
>>>>>>> origin/main
    }
  };

  const handleEditCategory = (id) => {
    const cat = services.find(s => s.id === id); const next = prompt("Rename:", cat.title.en);
    if (next) setServices(prev => prev.map(c => c.id === id ? { ...c, title: { en: next } } : c));
  };

  const handleAddItem = (catId) => {
    const n = prompt("Name:"); const d = prompt("Desc:"); const l = prompt("URL:");
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

  // --- Search Filtering ---
  const studentServices = useMemo(() => services.filter(s => s.group === "student" && s.title.en.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery, services]);
  const sarawakServices = useMemo(() => services.filter(s => s.group === "service" && s.title.en.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery, services]);
  const filteredCitizens = useMemo(() => citizens.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.ic.includes(searchQuery)), [searchQuery, citizens]);

  useEffect(() => {
<<<<<<< HEAD
    const hints = ['Aid', 'KGC', 'Portal'];
    let idx = 0;
    const interval = setInterval(() => { setPlaceholderText(`Search ${isAdmin ? 'Database' : 'Service'}...`); idx = (idx + 1) % hints.length; }, 4000);
=======
    // Check if user is already logged in when the page loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
      }
    });

    // Listen for logins/logouts
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    const suggestions = t[language].searchSuggestions;
    let wordIdx = 0, dotIdx = 0;
    const dotSequence = ['', '.', '..', '...'];
    const interval = setInterval(() => {
      setPlaceholderText(`Search for ${suggestions[wordIdx]}${dotSequence[dotIdx]}`);
      dotIdx++;
      if (dotIdx > 3) { dotIdx = 0; wordIdx = (wordIdx + 1) % suggestions.length; }
    }, 600);
>>>>>>> origin/main
    return () => clearInterval(interval);
  }, [isAdmin]);

  

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);

  const toggleCategory = (id) => setExpandedCategoryId(expandedCategoryId === id ? null : id);

  return (
    <div className={`min-h-screen relative font-sans transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Global Loader */}
      {(isLoggingOut || isMatching) && (
        <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-black/80 text-center">
           <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-6" />
           <p className="text-white font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Processing...</p>
        </div>
      )}

      {/* SIDEBAR DRAWER */}
      <div className={`fixed top-0 right-0 h-full w-[360px] z-[60] shadow-2xl transition-transform duration-500 ease-out transform ${showSidebar ? 'translate-x-0' : 'translate-x-full'} ${darkMode ? 'bg-slate-950 border-l border-white/5' : 'bg-white'}`}>
         <div className="p-8 border-b border-slate-500/10 flex justify-between items-center font-bold">
            {sidebarAuthMode !== 'menu' && <button onClick={() => changeAuthMode('menu')} className="text-[10px] font-black uppercase opacity-40 hover:opacity-100 flex items-center gap-2"><ChevronRight className="w-4 h-4 rotate-180" /> Back</button>}
            <h3 className="font-black uppercase tracking-[0.3em] text-[10px] opacity-30 flex-grow text-center">My Menu</h3>
            <button onClick={() => {setShowSidebar(false); changeAuthMode('menu');}} className="p-2 rounded-full hover:bg-slate-500/10"><X className="w-6 h-6" /></button>
         </div>

         <div className="flex-grow overflow-y-auto scrollbar-hide p-8 text-center font-bold">
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
                            <button onClick={handleConfirmPhoto} className="flex-grow py-3 rounded-xl bg-yellow-500 text-black text-[9px] font-black uppercase">Apply</button>
                         </div>
                      </div>
                    )}
                    {!isConfirmingPhoto && (
                      <div className="mt-6">
                         <h4 className="font-black uppercase tracking-tighter text-2xl leading-tight font-bold">{isLoggedIn ? authName : "GUEST USER"}</h4>
                         {isLoggedIn && !isAdmin && <p className="text-[10px] font-bold opacity-30 mt-3 tracking-widest uppercase text-center font-bold">ID: KC-{verifiedIC.split('-').join('')}</p>}
                         {isLoggedIn && isAdmin && <p className="text-[10px] font-black text-purple-500 mt-2 tracking-widest uppercase text-center font-bold">Admin Hub Active</p>}
                      </div>
                    )}
                 </div>

                 {!isLoggedIn && !isConfirmingPhoto && (
                   <div className="space-y-3 font-bold">
                      <button onClick={() => changeAuthMode('login')} className="w-full py-5 rounded-3xl bg-black text-white dark:bg-white dark:text-black font-black uppercase text-xs tracking-widest shadow-xl transition-transform active:scale-95 font-bold">Log In</button>
                      <button onClick={() => { setShowAuthModal(true); setSignUpStep(1); setAuthType('signup'); setShowSidebar(false); }} className="w-full py-5 rounded-3xl border-2 border-slate-500/20 font-black uppercase text-xs tracking-widest hover:bg-slate-500/5 transition-all text-xs font-bold">Sign Up</button>
                   </div>
                 )}

                 {isLoggedIn && !isAdmin && !isConfirmingPhoto && (
                   <div className="space-y-2 text-left font-bold">
                      <button onClick={() => setSidebarAuthMode('overview')} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-slate-500/5 font-black text-sm transition-all hover:bg-yellow-500/10 font-bold font-bold font-bold font-bold font-bold font-bold"><Fingerprint className="w-5 h-5 opacity-40" /> My Profile</button>
                      <button onClick={() => setSidebarAuthMode('status')} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-slate-500/5 font-black text-sm transition-all hover:bg-yellow-500/10 font-bold font-bold font-bold font-bold font-bold font-bold"><Clock className="w-5 h-5 opacity-40" /> Track Status</button>
                      <button onClick={() => setSidebarAuthMode('security')} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-slate-500/5 font-black text-sm transition-all hover:bg-yellow-500/10 font-bold font-bold font-bold font-bold font-bold font-bold"><ShieldAlert className="w-5 h-5 opacity-40" /> Security</button>
                   </div>
                 )}

                 <div className="space-y-3 pt-6 border-t border-slate-500/10 font-bold">
                    <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center justify-between p-5 rounded-3xl bg-slate-500/5 transition-all font-bold">
                       <div className="flex items-center gap-4">{darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}<span className="font-black text-xs uppercase">{darkMode ? 'Light' : 'Dark'} Mode</span></div>
                       <div className={`w-10 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-yellow-500' : 'bg-slate-300'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${darkMode ? 'left-6' : 'left-1'}`} /></div>
                    </button>
                 </div>
              </div>
            )}

            {sidebarAuthMode === 'report-bug' && (
              <div className="animate-in slide-in-from-right-4 text-left space-y-6 font-bold">
                 <h4 className="font-black uppercase text-2xl mb-4">Report Issue</h4>
                 <div className="space-y-2 font-bold"><label className="text-[10px] font-black uppercase opacity-40 px-1 font-bold">Describe Issue</label><textarea value={bugDesc} onChange={(e) => setBugDesc(e.target.value)} rows="5" className="w-full p-5 rounded-2xl border-2 font-medium bg-transparent outline-none focus:border-red-500/50 font-bold" /></div>
                 <div className="space-y-2 font-bold"><label className="text-[10px] font-black uppercase opacity-40 px-1 font-bold">Screenshot</label><div onClick={() => bugInputRef.current.click()} className="w-full p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer">{bugScreen ? <img src={bugScreen} className="h-24 rounded-lg" alt="P" /> : <Image className="w-8 h-8 opacity-20" />}</div><input type="file" ref={bugInputRef} className="hidden" accept="image/*" onChange={handleBugScreenshot} /></div>
                 <button onClick={submitBug} className="w-full py-5 rounded-3xl bg-red-600 text-white font-black uppercase tracking-widest shadow-xl active:scale-95 font-bold">Submit Report</button>
              </div>
            )}

            {(sidebarAuthMode === 'login' || sidebarAuthMode === 'admin-login') && (
              <div className="animate-in slide-in-from-right-4 text-left font-bold">
                 <h4 className="font-black uppercase text-2xl mb-8 font-bold">{sidebarAuthMode === 'login' ? 'User Access' : 'Admin Unlock'}</h4>
                 {authError && <div className="mb-6 p-4 rounded-2xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase flex items-center gap-3 animate-shake font-bold"><AlertTriangle className="w-4 h-4 font-bold" /> {authError}</div>}
                 <form onSubmit={isIdentityVerified ? handleLoginSubmit : handleVerifyIdentity} className="space-y-6 font-bold">
                    <div className="space-y-2 font-bold"><label className="text-[10px] font-black uppercase opacity-40 px-1 font-bold">Identity ID</label><input type="text" value={authIdentity} onChange={handleIdentityChange} className={`w-full p-5 rounded-2xl border-2 font-black outline-none bg-transparent ${isIdentityVerified ? 'border-green-500/40' : ''}`} /></div>
                    {isIdentityVerified && (<div className="space-y-2 font-bold"><label className="text-[10px] font-black uppercase opacity-40 px-1 font-bold">{sidebarAuthMode === 'login' ? 'Password' : 'Verified Email'}</label><input type={sidebarAuthMode === 'login' ? "password" : "email"} value={sidebarAuthMode === 'login' ? authPassword : authEmail} onChange={(e) => sidebarAuthMode === 'login' ? setAuthPassword(e.target.value) : setAuthEmail(e.target.value)} className="w-full p-5 rounded-2xl border-2 font-black outline-none bg-transparent" /></div>)}
                    <button type="submit" className={`w-full py-5 rounded-3xl text-white font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 font-bold ${sidebarAuthMode === 'login' ? 'bg-black dark:bg-white dark:text-black' : 'bg-purple-600'}`}>{isVerifying ? <Loader2 className="animate-spin mx-auto" /> : (isIdentityVerified ? 'Access Portal' : 'Verify ID')}</button>
                 </form>
              </div>
            )}
         </div>

         <div className="p-8 border-t border-slate-500/10 text-center space-y-4 font-bold">
            {!isConfirmingPhoto && <button onClick={triggerBugAnimation} className="w-full py-4 rounded-2xl border border-red-500/20 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all font-bold">Report Bug</button>}
            {!isLoggedIn && sidebarAuthMode === 'menu' && !isConfirmingPhoto && <button onClick={() => changeAuthMode('admin-login')} className="w-full py-3 text-[10px] font-black uppercase opacity-10 hover:opacity-100 hover:text-purple-500 transition-all text-xs font-bold">Hey Admin</button>}
            {isLoggedIn && <button onClick={handleLogout} className="w-full flex items-center justify-center gap-4 p-5 text-red-500 font-black text-sm hover:bg-red-500/10 rounded-3xl transition-all active:scale-95 font-bold"><LogOut className="w-5 h-5" /> Sign Out</button>}
         </div>
      </div>

      {/* MAIN WRAPPER */}
      <div className={`transition-transform duration-500 ease-out flex flex-col min-h-screen ${showSidebar ? '-translate-x-[360px]' : 'translate-x-0'}`}>
        <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all ${darkMode ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white/95 border-slate-200'}`}>
          <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between font-bold">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setSearchQuery('')}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-yellow-500 font-bold text-black text-xs shadow-lg transform group-hover:scale-110 transition-transform">{portalLogo}</div>
              <h1 className="font-black text-xl tracking-tighter uppercase font-bold">KENYALANG <span className="text-yellow-500 font-bold">CARE</span></h1>
            </div>
<<<<<<< HEAD
            <button onClick={() => setShowSidebar(true)} className={`p-3 rounded-2xl border transition-all hover:shadow-lg active:scale-95 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}><Menu className="w-6 h-6 opacity-60 font-bold" /></button>
          </div>
        </header>

        <main className="flex-grow w-full md:max-w-3xl mx-auto px-4 py-8 md:py-16 text-center font-bold">
          <div className="relative group mb-12 font-bold"><Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-yellow-600 z-10 font-bold" /><input type="text" placeholder={placeholderText} className={`w-full pl-16 pr-6 py-7 rounded-3xl border-2 outline-none font-bold text-lg shadow-2xl transition-all ${darkMode ? 'bg-white/10 border-white/20 text-white font-bold' : 'bg-white border-slate-200 focus:border-black font-bold'}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>

          {isLoggedIn && isAdmin && (
            <div className="mb-12 space-y-8 animate-in slide-in-from-top-4 duration-500 text-left font-bold">
               <div className="rounded-[2.5rem] border-2 border-purple-500/20 bg-purple-500/5 backdrop-blur-md overflow-hidden font-bold">
                  <div className="p-8 flex items-center justify-between font-bold"><div className="flex items-center gap-4 text-purple-600 font-bold"><UserCog className="w-6 h-6 font-bold" /><h2 className="text-xl font-black uppercase tracking-tighter font-bold">Citizen Hub</h2></div><button onClick={() => setIsCitizenHubMinimized(!isCitizenHubMinimized)} className="p-3 rounded-2xl bg-purple-600/10 text-purple-600 font-bold">{isCitizenHubMinimized ? <ChevronDown className="w-5 h-5 font-bold" /> : <ChevronUp className="w-5 h-5 font-bold" />}</button></div>
                  {!isCitizenHubMinimized && <div className="px-8 pb-10 space-y-4 font-bold">{filteredCitizens.map(citizen => (<div key={citizen.ic} className="p-5 rounded-[2rem] border border-purple-500/20 bg-white dark:bg-black/40 shadow-sm space-y-4 font-bold"><div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-bold"><div><h4 className="text-lg font-black uppercase font-bold">{citizen.name}</h4><p className="text-[9px] font-bold opacity-30 font-bold">IC: {citizen.ic} • {citizen.race} • {citizen.religion}</p></div><button onClick={() => editCitizenIdentity(citizen.ic)} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 text-white font-black uppercase text-[9px] font-bold"><Edit3 className="w-3 h-3 font-bold" /> Edit Identity</button></div><div className="pt-3 border-t border-purple-500/5 font-bold">{citizen.applications.map(app => (<div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 font-bold"><p className="font-black text-[10px] uppercase font-bold">{app.name}</p><div className="flex items-center gap-3 font-bold"><span className={`px-2.5 py-1 rounded-lg text-[8px] font-black text-white uppercase font-bold ${app.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'}`}>{app.status}</span><button onClick={() => switchAppStatus(citizen.ic, app.id)} className="p-1.5 rounded-lg bg-purple-100 text-purple-600 font-bold"><RefreshCw className="w-3.5 h-3.5 font-bold" /></button></div></div>))}</div></div>))}</div>}
               </div>
               <div className="rounded-[2.5rem] border-2 border-red-500/20 bg-red-500/5 backdrop-blur-md overflow-hidden font-bold">
                  <div className="p-8 flex items-center justify-between font-bold"><div className="flex items-center gap-4 text-red-600 font-bold"><Bug className="w-6 h-6 font-bold" /><h2 className="text-xl font-black uppercase tracking-tighter font-bold">Bug Reports</h2></div><button onClick={() => setIsBugHubMinimized(!isBugHubMinimized)} className="p-3 rounded-2xl bg-red-600/10 text-red-600 font-bold">{isBugHubMinimized ? <ChevronDown className="w-5 h-5 font-bold" /> : <ChevronUp className="w-5 h-5 font-bold" />}</button></div>
                  {!isBugHubMinimized && <div className="px-8 pb-10 space-y-4 font-bold">{bugReports.map(bug => (<div key={bug.id} className="p-5 rounded-[2rem] border border-red-500/20 bg-white dark:bg-black/40 shadow-sm space-y-4 font-bold"><p className="text-[10px] font-black uppercase text-red-500 font-bold">ID: #{bug.id.toString().slice(-4)} • {bug.time}</p><p className="text-xs font-medium italic font-bold">"{bug.desc}"</p>{bug.screenshot && <img src={bug.screenshot} className="h-20 w-20 rounded-lg shadow" alt="Bug" />}<div className="pt-3 border-t border-red-500/10 flex justify-between items-center font-bold"><p className="text-[8px] font-black uppercase opacity-40 font-bold">Reporter: {bug.user}</p><button onClick={() => setBugReports(bugReports.filter(b => b.id !== bug.id))} className="text-[8px] font-black text-red-500 hover:underline font-bold">Resolve</button></div></div>))}</div>}
               </div>
               <div className="rounded-[2.5rem] border-2 border-purple-500/20 bg-purple-500/5 backdrop-blur-md overflow-hidden font-bold">
                  <div className="p-8 flex items-center justify-between font-bold"><div className="flex items-center gap-4 text-purple-600 font-bold"><LayoutGrid className="w-6 h-6 font-bold" /><h2 className="text-xl font-black uppercase tracking-tighter font-bold">Service Hub</h2></div><div className="flex gap-2 font-bold"><button onClick={changeLogo} className="p-3 rounded-2xl bg-white text-purple-500 text-[9px] font-black uppercase font-bold">Logo: {portalLogo}</button><button onClick={() => setIsCatalogHubMinimized(!isCatalogHubMinimized)} className="p-3 rounded-2xl bg-purple-600/10 text-purple-600 font-bold">{isCatalogHubMinimized ? <ChevronDown className="w-5 h-5 font-bold" /> : <ChevronUp className="w-5 h-5 font-bold" />}</button></div></div>
                  {!isCatalogHubMinimized && <div className="px-8 pb-10 space-y-6 font-bold font-bold font-bold font-bold font-bold"><button onClick={handleAddNewCategory} className="w-full py-4 rounded-2xl bg-purple-600 text-white font-black uppercase text-[10px] font-bold">New Category</button>{services.map(cat => (<div key={cat.id} className="p-5 rounded-3xl border border-purple-500/10 bg-white/30 dark:bg-black/20 space-y-4 font-bold font-bold font-bold"><div className="flex items-center justify-between pb-3 border-b border-purple-500/5 font-bold font-bold"><h4 className="font-black text-sm uppercase text-purple-400 font-bold">{cat.title.en}</h4><div className="flex gap-2 font-bold"><button onClick={() => handleEditCategory(cat.id)} className="p-1.5 rounded-lg text-purple-500 font-bold"><Edit3 className="w-4 h-4 font-bold" /></button><button onClick={() => handleAddItem(cat.id)} className="p-1.5 rounded-lg bg-purple-600 text-white font-bold"><Plus className="w-4 h-4 font-bold" /></button></div></div><div className="grid gap-3 font-bold">{cat.items.map((it, idx) => (<div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm font-bold"><div className="flex-grow pr-4 font-bold"><p className="font-black text-[11px] uppercase font-bold">{it.en}</p><p className="text-[9px] opacity-40 italic font-bold font-bold">"{it.desc}"</p></div><div className="flex gap-2 font-bold"><button onClick={() => handleEditItem(cat.id, idx)} className="p-1.5 rounded-lg text-slate-500 font-bold"><Settings className="w-3 h-3 font-bold" /></button><button onClick={() => handleDeleteItem(cat.id, idx)} className="p-1.5 rounded-lg text-red-500 font-bold"><Trash2 className="w-3 h-3 font-bold" /></button></div></div>))}</div></div>))}</div>}
=======
            <div className="flex-grow flex flex-col h-full">
               <div className="p-8 border-b border-white/5 flex justify-between items-center"><h4 className="font-black uppercase tracking-tighter text-2xl">{profileTab}</h4><button onClick={() => setShowProfileManagement(false)} className="p-3 rounded-full bg-slate-500/10"><X className="w-5 h-5" /></button></div>
               <div className="flex-grow p-10 overflow-y-auto scrollbar-hide">
                  {profileTab === 'overview' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 pb-10">
                       <section>
                          <h5 className="text-[10px] font-black uppercase opacity-30 tracking-[0.4em] mb-6 flex items-center gap-3"><Fingerprint className="w-3 h-3" /> Permanent Record</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                             {[
                                { label: 'Full Name', value: authName || 'NOT SET' },
                                { label: 'MyKad (IC)', value: verifiedIC },
                                { label: 'Account Status', value: 'ACTIVE • VERIFIED', color: 'text-green-500' },
                                { label: 'Country', value: 'MALAYSIA (SARAWAK)' },
                                { label: 'Date of Birth', value: authDob },
                                { label: 'Gender', value: authGender },
                                { label: 'Race', value: authRace || 'NOT SET' },
                                { label: 'Religion', value: authReligion || 'NOT SET' }
                             ].map((field, i) => (
                               <div key={i} className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}><p className="text-[9px] font-bold uppercase opacity-30 mb-1">{field.label}</p><p className={`font-black text-sm ${field.color || ''}`}>{field.value}</p></div>
                             ))}
                          </div>
                       </section>
                       <section>
                          <h5 className="text-[10px] font-black uppercase opacity-30 tracking-[0.4em] mb-6 flex items-center gap-3"><MapPin className="w-3 h-3" /> Contact Details</h5>
                          <div className="grid grid-cols-1 gap-5">
                             <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}><p className="text-[9px] font-bold uppercase opacity-30 mb-1">Permanent Address</p><p className="font-black text-sm uppercase">{permanentAddress}</p></div>
                             <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}><p className="text-[9px] font-bold uppercase opacity-30 mb-1">Correspondence Address</p><p className="font-black text-sm uppercase">{correspondenceAddress}</p></div>
                             <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}><p className="text-[9px] font-bold uppercase opacity-30 mb-1">Mobile / Email</p><p className="font-black text-sm">{mobilePhone} • {emailAddress}</p></div>
                          </div>
                       </section>
                    </div>
                  )}
                  {profileTab === 'update' && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 max-w-2xl pb-10">
                       <div className="space-y-4"><label className="text-[10px] font-black uppercase opacity-40 px-1">Permanent Address</label><textarea rows="2" value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)} className={`w-full p-5 rounded-2xl border-2 font-bold outline-none transition-all focus:border-yellow-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} /></div>
                       <div className="space-y-4"><label className="text-[10px] font-black uppercase opacity-40 px-1">Correspondence Address</label><textarea rows="2" value={correspondenceAddress} onChange={(e) => setCorrespondenceAddress(e.target.value)} className={`w-full p-5 rounded-2xl border-2 font-bold outline-none transition-all focus:border-yellow-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} /></div>
                       <div className="space-y-4"><label className="text-[10px] font-black uppercase opacity-40 px-1">Mobile Phone</label><input type="text" value={mobilePhone} onChange={(e) => setMobilePhone(e.target.value)} className={`w-full p-5 rounded-2xl border-2 font-black outline-none transition-all focus:border-yellow-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} /></div>
                       <button onClick={() => setProfileTab('overview')} className="w-full py-5 rounded-2xl bg-yellow-500 text-black font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Save Profile Updates</button>
                    </div>
                  )}
>>>>>>> origin/main
               </div>
            </div>
          )}

          {!isAdmin && (
            <div className="space-y-16 font-bold">
              <div className="space-y-6 font-bold text-left px-4"><h2 className="text-3xl font-black uppercase flex items-center gap-4 font-bold"><SchoolIcon className="text-yellow-600 font-bold" /> School and Student</h2><div className="space-y-4 font-bold">{studentServices.map(cat => (<div key={cat.id} className={`rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${expandedCategoryId === cat.id ? 'border-yellow-500 shadow-lg' : 'border-slate-800/10'}`}><div onClick={() => toggleCategory(cat.id)} className="p-8 cursor-pointer flex items-center gap-8 font-bold"><div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${expandedCategoryId === cat.id ? 'bg-yellow-500 text-black rotate-12 shadow-lg' : 'bg-slate-800/10'}`}>{React.createElement(IconMap[cat.icon] || GraduationCap, { className: "w-7 h-7 font-bold" })}</div><div className="flex-grow font-bold"><h3 className={`font-black text-lg uppercase font-bold ${expandedCategoryId === cat.id ? 'text-yellow-600' : ''}`}>{cat.title.en}</h3></div><ChevronDown className={`transition-transform duration-500 ${expandedCategoryId === cat.id ? 'rotate-180 text-yellow-500' : 'opacity-20'}`} /></div>{expandedCategoryId === cat.id && <div className="px-8 pb-10 space-y-4 font-bold text-left">{cat.items.map((item, idx) => (<div key={idx} className="p-4 border-b border-slate-500/10 group last:border-none font-bold font-bold"><a href={item.link} target="_blank" rel="noopener noreferrer" className="font-black uppercase text-sm block hover:text-yellow-600 font-bold font-bold">{item.en}</a><p className="text-[10px] opacity-60 italic font-bold">"{item.desc}"</p></div>))}</div>}</div>))}</div></div>
              <div className="space-y-6 font-bold text-left px-4"><h2 className="text-3xl font-black uppercase flex items-center gap-4 font-bold font-bold font-bold"><Globe className="text-yellow-600 font-bold" /> Service Sarawak</h2><div className="space-y-4 font-bold">{sarawakServices.map(cat => (<div key={cat.id} className={`rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${expandedCategoryId === cat.id ? 'border-yellow-500 shadow-lg' : 'border-slate-800/10'}`}><div onClick={() => toggleCategory(cat.id)} className="p-8 cursor-pointer flex items-center gap-8 font-bold"><div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${expandedCategoryId === cat.id ? 'bg-yellow-500 text-black rotate-12 shadow-lg' : 'bg-slate-800/10'}`}>{React.createElement(IconMap[cat.icon] || GraduationCap, { className: "w-7 h-7 font-bold" })}</div><div className="flex-grow font-bold"><h3 className={`font-black text-lg uppercase font-bold ${expandedCategoryId === cat.id ? 'text-yellow-600' : ''}`}>{cat.title.en}</h3></div><ChevronDown className={`transition-transform duration-500 ${expandedCategoryId === cat.id ? 'rotate-180 text-yellow-500' : 'opacity-20'}`} /></div>{expandedCategoryId === cat.id && <div className="px-8 pb-10 space-y-4 font-bold text-left font-bold font-bold">{cat.items.map((item, idx) => (<div key={idx} className="p-4 border-b border-slate-500/10 group last:border-none font-bold font-bold font-bold"><a href={item.link} target="_blank" rel="noopener noreferrer" className="font-black uppercase text-sm block hover:text-yellow-600 font-bold font-bold">{item.en}</a><p className="text-[10px] opacity-60 italic font-bold font-bold font-bold">"{item.desc}"</p></div>))}</div>}</div>))}</div></div>
            </div>
          )}
        </main>

        <footer className={`mt-24 py-20 border-t ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="w-full md:max-w-3xl mx-auto px-4 text-center font-bold">
            <div className="flex items-center justify-center gap-12 text-xs font-medium opacity-60 mb-12 font-bold font-bold font-bold font-bold font-bold">
              <button onClick={() => setShowAboutUs(true)} className="hover:text-yellow-600 transition-all font-bold uppercase tracking-widest font-bold">About us</button>
              <span className="opacity-10 font-bold">•</span>
              <a href={UI_TEXT.privacyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-600 transition-all font-bold tracking-widest font-bold">Privacy policy</a>
            </div>
            <p className="text-[10px] opacity-20 uppercase font-black tracking-[0.4em] font-bold font-bold font-bold font-bold">© 2026 Kenyalang Care. Digital Sarawak Unit.</p>
          </div>
<<<<<<< HEAD
        </footer>
      </div>
=======
        </div>
      )}

      {/* Admin Portal */}
      {showAdminPanel && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in zoom-in-95">
          <div className={`w-full max-w-5xl h-[90vh] rounded-[3.5rem] flex flex-col overflow-hidden border-2 border-purple-500/30 ${darkMode ? 'bg-slate-900 shadow-purple-500/10' : 'bg-white shadow-2xl'}`}>
             <div className="p-10 flex justify-between items-center border-b border-white/5"><h3 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-5"><div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white"><Settings /></div>Admin Portal</h3><button onClick={() => setShowAdminPanel(false)} className="p-5 rounded-full bg-slate-100 dark:bg-slate-800"><X /></button></div>
             <div className="flex-grow overflow-y-auto p-10 space-y-12 scrollbar-hide">
                {services.map(cat => (
                  <section key={cat.id} className="p-8 rounded-[2.5rem] border-2 border-slate-800/10 bg-slate-500/5">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10"><h4 className="text-lg font-black uppercase text-purple-400">{cat.title.en}</h4><button onClick={() => addItem(cat.id)} className="px-4 py-2 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase hover:scale-105"><Plus className="w-4 h-4" /> Add Item</button></div>
                    <div className="grid gap-4">{cat.items.map((it, idx) => (<div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-black/10 border border-white/5"><div><p className="font-black text-xs uppercase">{it.en}</p><p className="text-[10px] opacity-40 italic">{it.desc}</p></div><button onClick={() => deleteItem(cat.id, idx)} className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button></div>))}</div>
                  </section>
                ))}
             </div>
             <div className="p-10 border-t border-white/5"><button onClick={() => setShowAdminPanel(false)} className="w-full py-6 rounded-[2rem] bg-purple-600 text-white font-black uppercase shadow-2xl">Exit Admin Mode</button></div>
          </div>
        </div>
      )}

      {/* FULL PAGE AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in overflow-y-auto">
          <div className={`w-full ${authType === 'signup' ? 'max-w-4xl' : 'max-w-md'} rounded-[3rem] p-10 md:p-14 relative shadow-2xl animate-in zoom-in-95 ${darkMode ? 'bg-slate-900 border-2 border-yellow-500/20' : 'bg-white'}`}>
            
            {signUpStep === 1 && (
              <>
                <div className="text-center mb-10">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 ${isIdentityVerified ? 'bg-green-500/20 scale-110' : 'bg-yellow-500/10'}`}>
                    {isVerifying ? <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" /> : (isIdentityVerified ? <ShieldCheck className="w-10 h-10 text-green-500" /> : (authType === 'login' ? <ShieldQuestion className="w-10 h-10 text-yellow-500" /> : <UserPlus className="w-10 h-10 text-yellow-500" />))}
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">{t[language].authTitle[authType]}</h3>
                  <p className="text-sm font-bold opacity-40 uppercase tracking-widest">{t[language].authSubtitle[authType]}</p>
                </div>

                {authError && (
                  <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase flex items-center gap-4 animate-shake"><AlertTriangle className="w-5 h-5 flex-shrink-0" /> {authError}</div>
                )}

                <form onSubmit={authType === 'signup' ? handleAuthSubmit : (isIdentityVerified ? handleAuthSubmit : handleVerifyIdentity)} className="space-y-6">
                  {authType === 'signup' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-6">
                          <h5 className="text-[10px] font-black uppercase opacity-30 tracking-[0.2em] border-b pb-2 border-slate-800/10">Personal Information</h5>
                          <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">{t[language].authLabels.name}</label><input required type="text" value={authName} onChange={(e) => setAuthName(e.target.value)} className={`w-full p-4 rounded-2xl border-2 font-black outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} /></div>
                          <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">{t[language].authLabels.identity}</label><input required type="text" value={authIdentity} onChange={handleIdentityChange} placeholder={t[language].authPlaceholder} className={`w-full p-4 rounded-2xl border-2 font-black outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200 focus:border-black'}`} /></div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">D.O.B (Auto)</label><input type="text" readOnly value={authDob} className={`w-full p-4 rounded-2xl border-2 font-black opacity-50 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} /></div>
                             <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Gender</label>
                                <select value={authGender} onChange={(e) => setAuthGender(e.target.value)} className={`w-full p-4 rounded-2xl border-2 font-black outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                   <option value="">Select</option>
                                   <option value="Male">Male</option>
                                   <option value="Female">Female</option>
                                </select>
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Race</label>
                                <select value={authRace} onChange={(e) => setAuthRace(e.target.value)} className={`w-full p-4 rounded-2xl border-2 font-black outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                   <option value="">Select</option>
                                   <option value="Iban">Iban</option>
                                   <option value="Bidayuh">Bidayuh</option>
                                   <option value="Malay">Malay</option>
                                   <option value="Chinese">Chinese</option>
                                   <option value="Melanau">Melanau</option>
                                   <option value="Orang Ulu">Orang Ulu</option>
                                   <option value="Others">Others</option>
                                </select>
                             </div>
                             {authRace === 'Others' && (
                                <div className="space-y-2 animate-in slide-in-from-left-2"><label className="text-[10px] font-black uppercase opacity-40 px-1 text-yellow-600">Specify Race</label><input required type="text" value={otherRace} onChange={(e) => setOtherRace(e.target.value)} className={`w-full p-4 rounded-2xl border-2 font-black outline-none ${darkMode ? 'bg-slate-800 border-yellow-500/50' : 'bg-white border-yellow-500/50'}`} /></div>
                             )}
                          </div>
                          <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Religion</label>
                             <select value={authReligion} onChange={(e) => setAuthReligion(e.target.value)} className={`w-full p-4 rounded-2xl border-2 font-black outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                <option value="">Select</option>
                                <option value="Christianity">Christianity</option>
                                <option value="Islam">Islam</option>
                                <option value="Buddhism">Buddhism</option>
                                <option value="Hinduism">Hinduism</option>
                                <option value="Sikhism">Sikhism</option>
                                <option value="Others">Others</option>
                             </select>
                             {authReligion === 'Others' && (
                                <div className="mt-4 space-y-2 animate-in slide-in-from-top-2"><label className="text-[10px] font-black uppercase opacity-40 px-1 text-yellow-600">Specify Religion</label><input required type="text" value={otherReligion} onChange={(e) => setOtherReligion(e.target.value)} className={`w-full p-4 rounded-2xl border-2 font-black outline-none ${darkMode ? 'bg-slate-800 border-yellow-500/50' : 'bg-white border-yellow-500/50'}`} /></div>
                             )}
                          </div>
                       </div>
                       <div className="space-y-6">
                          <h5 className="text-[10px] font-black uppercase opacity-30 tracking-[0.2em] border-b pb-2 border-slate-800/10">Contact & Addresses</h5>
                          <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Mobile Phone</label><input required type="text" value={mobilePhone} onChange={(e) => setMobilePhone(e.target.value)} className={`w-full p-4 rounded-2xl border-2 font-black outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} /></div>
                          <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Email Address</label><input required type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} className={`w-full p-4 rounded-2xl border-2 font-black outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} /></div>
                          <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Permanent Address</label><textarea rows="1" value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)} className={`w-full p-4 rounded-2xl border-2 font-black outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} /></div>
                          <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">Correspondence Address</label><textarea rows="1" value={correspondenceAddress} onChange={(e) => setCorrespondenceAddress(e.target.value)} className={`w-full p-4 rounded-2xl border-2 font-black outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} /></div>
                          <button type="submit" className="w-full py-5 rounded-2xl bg-black text-white font-black uppercase tracking-widest shadow-xl">Set Security Credentials <ChevronRight className="inline w-5 h-5 ml-2" /></button>
                       </div>
                    </div>
<div className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40 px-1">Email Address</label>
                <input 
                  required 
                  type="email" 
                  value={emailAddress} 
                  onChange={(e) => setEmailAddress(e.target.value)} 
                  placeholder="name@example.com" 
                  className={`w-full p-5 font-black outline-none transition-all rounded-2xl border-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} 
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40 px-1">Password</label>
                <input 
                  required 
                  type="password" 
                  value={showPassword} 
                  onChange={(e) => setShowPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className={`w-full p-5 font-black outline-none transition-all rounded-2xl border-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} 
                />
              </div>
            </div>
{authType === 'login' && (
    <button 
      type="submit" 
      className="w-full py-6 rounded-2xl bg-yellow-500 text-black font-black uppercase tracking-[0.2em] shadow-xl transform active:scale-95 transition-all mt-6"
    >
      Proceed Access
    </button>
  )}
                </form>
                <div className="mt-8 text-center border-t border-slate-800/10 pt-8"><button onClick={() => setAuthType(authType === 'login' ? 'signup' : 'login')} className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-yellow-600 transition-all underline underline-offset-8">{t[language].authSwitch[authType]}</button></div>
              </>
            )}

            {signUpStep === 2 && (
              <div className="animate-in zoom-in-95 max-w-md mx-auto py-10">
                 <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-yellow-500/10 rounded-full mx-auto flex items-center justify-center text-yellow-500 mb-6"><Lock className="w-10 h-10" /></div>
                    <h3 className="text-3xl font-black uppercase">Set Security</h3>
                 </div>
                 {authError && <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase animate-shake">{authError}</div>}
                 <div className="space-y-6">
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">{t[language].authLabels.password}</label><input required type="password" value={showPassword} onChange={(e) => setShowPassword(e.target.value)} className={`w-full p-5 rounded-2xl border-2 font-black outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50'}`} /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 px-1">{t[language].authLabels.confirm}</label><input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full p-5 rounded-2xl border-2 font-black outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50'}`} /></div>
                    <button onClick={handleAuthSubmit} className="w-full py-6 rounded-2xl bg-yellow-500 text-black font-black uppercase tracking-widest shadow-xl">Proceed Registration</button>
                    <button onClick={() => setSignUpStep(1)} className="w-full py-4 rounded-2xl border-2 border-slate-800/10 font-bold text-[10px] uppercase">Review Form</button>
                 </div>
              </div>
            )}

            {signUpStep === 3 && (
              <div className="animate-in zoom-in-95 max-w-xl mx-auto py-10">
                 <div className="w-20 h-20 bg-red-500/10 rounded-3xl mx-auto flex items-center justify-center text-red-500 mb-8 animate-pulse"><AlertIcon className="w-10 h-10" /></div>
                 <h3 className="text-2xl font-black uppercase text-center mb-4">{t[language].signUpReminder}</h3>
                 <div className="p-8 rounded-[2rem] border-2 border-red-500/20 bg-red-500/5 mb-8"><p className="text-xs font-medium leading-relaxed text-justify opacity-80">{t[language].signUpWarning}</p></div>
                 <button onClick={handleAuthSubmit} className="w-full py-6 rounded-2xl bg-black text-white font-black uppercase tracking-[0.2em] shadow-xl hover:bg-yellow-500 hover:text-black transition-all">Agree & Create Account</button>
              </div>
            )}
            <button onClick={() => setShowAuthModal(false)} className="block w-full mt-8 text-[10px] font-black opacity-20 hover:opacity-100 tracking-[0.3em] transition-all uppercase">{t[language].close}</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`mt-20 py-16 border-t ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="w-full md:max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-10 text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-10">
            <button onClick={() => setShowAboutUs(true)} className="hover:text-yellow-600 transition-all">{t[language].aboutUs}</button>
            <span className="opacity-20">•</span>
            <a href={privacyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-600 transition-all">Privacy Policy</a>
            <span className="opacity-20">•</span>
            <button onClick={triggerBugAnimation} className="hover:text-yellow-600 transition-all">Report Bug</button>
          </div>
          <button onClick={handleViewModeClick} className={`w-full py-3.5 rounded-2xl bg-black text-white border border-slate-800 font-black text-[10px] tracking-[0.5em] transition-all hover:border-yellow-500/50 mb-8`}>{heyMessage ? heyMessage : t[language].statusNote}</button>
          <p className="text-[9px] opacity-20 uppercase font-black tracking-[0.3em]">© 2026 Kenyalang Care. Digital Sarawak Unit.</p>
        </div>
      </footer>
>>>>>>> origin/main

      {/* ABOUT US Speach Bubble */}
      {showAboutUs && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 font-bold" onClick={() => setShowAboutUs(false)}>
          <div className={`relative w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300 ${darkMode ? 'bg-slate-900 border-2 border-slate-800' : 'bg-white font-bold'}`} onClick={e => e.stopPropagation()}>
            <MessageSquare className="w-10 h-10 text-yellow-500 mx-auto mb-6 font-bold" />
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter font-bold font-bold">About Us</h3>
            <p className="text-sm opacity-80 leading-[1.6] font-bold text-justify mb-8 font-bold font-bold font-bold">{UI_TEXT.about}</p>
            <button onClick={() => setShowAboutUs(false)} className="w-full py-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all font-bold font-bold font-bold font-bold font-bold">Close Bubble</button>
          </div>
        </div>
      )}

      {/* SIGN UP FLOW */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-slate-950 animate-in fade-in overflow-y-auto font-bold font-bold">
          <div className="w-full max-w-5xl mx-auto p-8 md:p-16 relative flex-grow flex flex-col text-left font-bold font-bold">
            <button onClick={() => {setShowAuthModal(false); setSignUpStep(1);}} className="absolute top-8 right-8 p-3 rounded-full hover:bg-slate-500/10 transition-colors font-bold font-bold"><X className="w-8 h-8 opacity-40 font-bold font-bold font-bold" /></button>
            <div className="text-center mb-16 font-bold"><h3 className="text-5xl font-black uppercase tracking-tighter mb-4 font-bold font-bold font-bold">Registration Hub</h3><p className="text-sm font-bold opacity-30 uppercase tracking-[0.6em] font-bold font-bold font-bold font-bold">Official Sarawak Digital Identity</p></div>
            <button onClick={() => setShowAuthModal(false)} className="w-full py-8 rounded-[2.5rem] bg-black text-white font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xl mt-auto font-bold font-bold">Enter Hub <ChevronRight className="inline-block ml-4 font-bold font-bold" /></button>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default App;
