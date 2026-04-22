import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Moon, Sun, Globe, ClipboardCheck,
  ChevronRight, ChevronDown, BookOpen, 
  GraduationCap, Briefcase, Calculator, Building2, 
  Map, Droplets, Landmark, FileText, Heart, UtilityPole,
  Sparkles, Eye, Lock, X, MessageCircle, AlertTriangle, Bug,
  User, Settings, LogOut, Check, Wallet, CalendarDays, Stethoscope, Users,
  Filter, Sparkle, ShieldCheck, Info, LogIn, UserPlus, Clock, Send, FileSearch,
  SlidersHorizontal, Mail, Fingerprint, EyeOff, Lightbulb, UserCheck, MapPin, 
  Phone, Edit3, ShieldAlert, ShieldQuestion, Loader2, Landmark as Bank, Sprout, 
  Gavel, Waves, Zap, FileUp, Droplet, Plus, Trash2, Save, History, AtSign, Smartphone,
  Activity, UserRound, Mail as MailIcon, Briefcase as ProcurementIcon, ShieldAlert as AlertIcon,
  ShieldCheck as VerifiedIcon
} from 'lucide-react';
import { supabase } from './supabaseClient';

// --- Sequential 1-16 Category Service Data ---
const INITIAL_SERVICES = [
  { id: 1, title: { en: "1. Aids / Bantuan For Student", ms: "1. Bantuan Pelajar" }, icon: "GraduationCap", minAge: 5, maxAge: 25, maxIncome: 4850, keywords: ['student', 'school', 'laptop', 'book'], items: [
    { en: "Special Financial Assistance", ms: "Bantuan Kewangan Khas", desc: "One-off financial support to help students with school preparation costs." },
    { en: "Laptop Assistance", ms: "Laptop", desc: "Provision of digital devices for students to support modern e-learning needs." },
    { en: "Book Assistance", ms: "Bantuan Buku", desc: "Subsidy vouchers for the purchase of essential textbooks and school materials." },
    { en: "Free School Transport", ms: "Pengangkutan Sekolah Percuma", desc: "Subsidized transportation services for students in rural and urban areas." },
    { en: "School Scholarship", ms: "Biasiswa Sekolah", desc: "Academic excellence awards for high-performing primary and secondary school students." },
    { en: "Tuition Assistance", ms: "Bantuan Tuisyen", desc: "Financial support to cover monthly coaching and academic tuition fees." },
    { en: "Uniform Program", ms: "Program Pakaian Seragam", desc: "Vouchers to provide school uniforms, bags, and shoes for eligible families." }
  ]},
  { id: 2, title: { en: "2. Scholarships", ms: "2. Biasiswa" }, icon: "BookOpen", minAge: 17, maxAge: 35, maxIncome: 10000, keywords: ['degree', 'unimas', 'ipt', 'yayasan'], items: [
    { en: "Biasiswa Yayasan Sarawak Tun Taib", ms: "Biasiswa Yayasan Sarawak Tun Taib", desc: "Prestigious state scholarship for degree level studies in local institutions." },
    { en: "YBSTAR Scholarship", ms: "Biasiswa YBSTAR", desc: "Financial support specifically for technical and vocational excellence tracks." },
    { en: "Special UNIMAS Medical Scholarship", ms: "Biasiswa Khas Program Perubatan UNIMAS", desc: "Full funding for Sarawakians pursuing medical degrees at UNIMAS." },
    { en: "Yayasan Sarawak Local Scholarship", ms: "Biasiswa Tempatan Yayasan Sarawak", desc: "Funding for various diploma and undergraduate courses within Sarawak." },
    { en: "IPT Entry Assistance", ms: "Bantuan Kemasukan Ke IPT", desc: "Cash assistance to help students with initial university registration." },
    { en: "Bursary BP40", ms: "Bursari BP40", desc: "Special education fund targeting the B40 group for higher learning access." },
    { en: "i-GPS Graduate Return Initiative", ms: "Inisiatif Graduan Pulang Sarawak (i-GPS)", desc: "Travel airfare subsidy for Sarawakian students studying in other states." }
  ]},
  { id: 3, title: { en: "3. Pinjaman (Loans)", ms: "3. Pinjaman" }, icon: "Bank", minAge: 18, maxAge: 50, maxIncome: 99999, keywords: ['loan', 'pinjam', 'money'], items: [
    { en: "Domestic Study Loan", ms: "Biasiswa Pinjaman Pelajaran Dalam Negara", desc: "Low-interest loans for students pursuing higher education within Malaysia." },
    { en: "Overseas Study Loan", ms: "Pinjaman Pelajaran Luar Negara", desc: "Financial support for selected students pursuing specialized courses internationally." },
    { en: "Technical Training Loan", ms: "Biasiswa Pinjaman Latihan Teknikal", desc: "Funding for vocational and skill-based training programs across Sarawak." }
  ]},
  { id: 4, title: { en: "4. Program Dan Bantuan", ms: "4. Program Dan Bantuan" }, icon: "Sparkles", minAge: 7, maxAge: 100, maxIncome: 99999, keywords: ['community', 'english', 'award'], items: [
    { en: "Education Exchange Scholarship", ms: "Biasiswa Program Pertukaran Pelajaran", desc: "Opportunities for students to participate in international cultural and academic exchanges." },
    { en: "Community Education Program", ms: "Program Pendidikan Komuniti", desc: "Skill-building and lifelong learning initiatives for local village communities." },
    { en: "Premier Sarawak Special Award (AKPS)", ms: "Anugerah Khas Premier Sarawak (AKPS)", desc: "State recognition for individuals with outstanding achievements." }
  ]},
  { id: 5, title: { en: "5. Loan Repayments", ms: "5. Bayaran Balik Pinjaman" }, icon: "ClipboardCheck", minAge: 22, maxAge: 75, maxIncome: 99999, keywords: ['pay', 'repay', 'debt'], items: [
    { en: "Repayment Methods", ms: "Kaedah Bayaran", desc: "Information on official channels available for repaying state education loans." },
    { en: "Incentive Programs", ms: "Insentif", desc: "Discounts and incentives provided for consistent or early loan settlement." }
  ]},
  { id: 6, title: { en: "6. Performance Reports", ms: "6. Hantar Keputusan Semester" }, icon: "FileUp", minAge: 18, maxAge: 50, maxIncome: 99999, keywords: ['result', 'laporan', 'semester'], items: [
    { en: "Academic Result Form", ms: "Form", desc: "Official portal for scholars to submit their latest semester results." }
  ]},
  { id: 7, title: { en: "7. Business Trade", ms: "7. Perdagangan Bisnes" }, icon: "Briefcase", minAge: 18, maxAge: 70, maxIncome: 99999, keywords: ['business', 'telecom'], items: [
    { en: "Telecom Operate Permit", ms: "Permit Operasi Telekomunikasi", desc: "Licensing for companies providing telecommunication infrastructure services." },
    { en: "Panel Hotel Application", ms: "Permohonan Panel Hotel", desc: "Registration for hotels to provide accommodation for government events." },
    { en: "Sarawak Micro Credit Scheme (SMCS)", ms: "Skim Kredit Mikro Sarawak (SMCS)", desc: "Low-interest financial assistance for small business owners." }
  ]},
  { id: 8, title: { en: "8. Procurement & Tenders", ms: "8. Perolehan & Tender" }, icon: "ProcurementIcon", minAge: 18, maxAge: 80, maxIncome: 99999, keywords: ['tender', 'vendor', 'contractor'], items: [
    { en: "eProcurement Management", ms: "Pendaftaran Pembekal eProcurement", desc: "Integrated digital platform for all government supply chain activities." },
    { en: "State e-Procurement notices", ms: "Notis Sebutharga Dan Tender", desc: "Gateway for viewing active government procurement opportunities." }
  ]},
  { id: 9, title: { en: "9. Council Service", ms: "9. Perkhidmatan Majlis" }, icon: "Building2", minAge: 18, maxAge: 120, maxIncome: 99999, keywords: ['council', 'rates', 'bill'], items: [
    { en: "Indebtedness Clearance G(1)", ms: "Sijil Pelepasan Hutang G(1)", desc: "Official certificate confirming all council rates have been fully paid." },
    { en: "Assessment e-Billing", ms: "e-Billing Cukai Pintu", desc: "Switch to digital billing for annual council assessment rates." },
    { en: "Assessment Installment Plan", ms: "Bayaran Cukai Pintu Secara Ansuran", desc: "Structuring assessment rate payments into monthly installments." }
  ]},
  { id: 10, title: { en: "10. Education & Learning", ms: "10. Pendidikan & Pembelajaran" }, icon: "BookOpen", minAge: 7, maxAge: 60, maxIncome: 99999, keywords: ['school', 'scholarship'], items: [
    { en: "Apply For State Scholarships", ms: "Biasiswa Pinjaman Kerajaan Negeri Sarawak", desc: "Gateway for state-funded higher education financial support." },
    { en: "SPEAK Registration", ms: "Pendaftaran SPEAK", desc: "Career tracking system for students leaving the school system." }
  ]},
  { id: 11, title: { en: "11. Hydrology", ms: "11. Hidrologi" }, icon: "Droplet", minAge: 18, maxAge: 100, maxIncome: 99999, keywords: ['water', 'data'], items: [
    { en: "Year Book Purchase", ms: "Buku Hidrologi", desc: "Direct access to state water and weather records for personal reference." },
    { en: "Data Request", ms: "Mohon Data", desc: "Inter-departmental and private data sharing for planning." }
  ]},
  { id: 12, title: { en: "12. Land & Agriculture", ms: "12. Tanah & Pertanian" }, icon: "Sprout", minAge: 18, maxAge: 100, maxIncome: 99999, keywords: ['land', 'farm', 'crop'], items: [
    { en: "Rice And Maize Program", ms: "Program Pembangunan Padi Dan Jagung", desc: "State support for staple crop development and modernization." },
    { en: "Inland Fisheries Aid", ms: "Bantuan Pembangunan Perikanan Darat", desc: "Grants and technical support for aquaculture projects." }
  ]},
  { id: 13, title: { en: "13. Licence & Permit", ms: "13. Lesen & Permit" }, icon: "FileText", minAge: 18, maxAge: 100, maxIncome: 99999, keywords: ['license', 'permit'], items: [
    { en: "Carbon Storage Management", ms: "Pengurusan Tapak Simpanan Karbon", desc: "Licensing for the operation of carbon capture and sequestration facilities." },
    { en: "Endorsement Of Wireman", ms: "Pengesahan Wireman", desc: "Professional credentialing for authorized electrical technicians." }
  ]},
  { id: 14, title: { en: "14. Life Event", ms: "14. Acara Kehidupan" }, icon: "Heart", minAge: 18, maxAge: 120, maxIncome: 99999, keywords: ['marriage', 'job', 'nikah'], items: [
    { en: "Senior Citizen Health Benefit", ms: "Manfaat Kesihatan Warga Emas (SCHB)", desc: "Cashless healthcare access for seniors at panel clinics." },
    { en: "Adat Marriage Registration", ms: "Pendaftaran Perkahwinan Adat", desc: "Recording traditional native marriage arrangements for records." }
  ]},
  { id: 15, title: { en: "15. Social & Community", ms: "15. Sosial & Komuniti" }, icon: "Users", minAge: 0, maxAge: 120, maxIncome: 4850, keywords: ['aid', 'community', 'bib'], items: [
    { en: "Bantuan Ibu Bersalin (BIB)", ms: "Bantuan Ibu Bersalin (BIB)", desc: "Financial grant for Sarawakian mothers assisting with post-natal costs." },
    { en: "Bantuan Ihsan Kematian (BIK)", ms: "Bantuan Ihsan Kematian (BIK)", desc: "Compassionate grant provided to families for funeral arrangements." }
  ]},
  { id: 16, title: { en: "16. Utilities", ms: "16. Utiliti" }, icon: "UtilityPole", minAge: 18, maxAge: 120, maxIncome: 99999, keywords: ['water', 'electric', 'gas'], items: [
    { en: "New Water Supply Connection", ms: "Sambungan Air Baru", desc: "Installing fresh water meters and connection lines for homes." },
    { en: "Rural Electrification (BELB)", ms: "Bekalan Elektrik Luar Bandar (BELB)", desc: "Connecting remote longhouses to the state grid." }
  ]}
];

const App = () => {
  // --- State ---
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [placeholderText, setPlaceholderText] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [heyMessage, setHeyMessage] = useState(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isReportingBug, setIsReportingBug] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [showStatusBoard, setShowStatusBoard] = useState(false);
  const [showAdjustableFilters, setShowAdjustableFilters] = useState(false);
  const [showProfileManagement, setShowProfileManagement] = useState(false);
  const [profileTab, setProfileTab] = useState('overview');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [signUpStep, setSignUpStep] = useState(1); 
  
  // Auth & Profile States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login'); 
  const [showPassword, setShowPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authIdentity, setAuthIdentity] = useState('');
  const [authName, setAuthName] = useState(''); 
  const [authDob, setAuthDob] = useState('');
  const [authGender, setAuthGender] = useState('');
  const [authRace, setAuthRace] = useState('');
  const [authReligion, setAuthReligion] = useState('');
  const [otherRace, setOtherRace] = useState('');
  const [otherReligion, setOtherReligion] = useState('');
  
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [verifiedIC, setVerifiedIC] = useState('');
  const [authError, setAuthError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Profile Details
  const [mobilePhone, setMobilePhone] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [correspondenceAddress, setCorrespondenceAddress] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  // Filter States
  const [minIncome, setMinIncome] = useState(''); 
  const [maxIncome, setMaxIncome] = useState(''); 
  const [ageInput, setAgeInput] = useState(''); 

  const menuRef = useRef(null);
  const privacyUrl = "https://www.termsfeed.com/live/adceebaa-54af-463f-8fbb-e6bafd896862";

  const IconMap = { GraduationCap, BookOpen, Bank, Sparkles, ClipboardCheck, Briefcase, Building2, Sprout, FileText, Heart, Users, UtilityPole, Droplet, FileUp, ProcurementIcon };

  // --- HANDLERS ---
  const handleViewModeClick = () => {
    const replies = t[language].heyReplies;
    setHeyMessage(replies[Math.floor(Math.random() * replies.length)]);
    setIsPulsing(true);
    setTimeout(() => { setHeyMessage(null); setIsPulsing(false); }, 2500);
  };

  const triggerBugAnimation = () => {
    if (isReportingBug) return;
    setIsReportingBug(true);
    setTimeout(() => setIsReportingBug(false), 2500);
  };

  const openAuth = (type) => {
    setAuthType(type);
    setSignUpStep(1);
    setShowAuthModal(true);
    setShowProfileMenu(false);
    setAuthIdentity('');
    setAuthName('');
    setAuthDob('');
    setAuthGender('');
    setAuthRace('');
    setAuthReligion('');
    setOtherRace('');
    setOtherReligion('');
    setShowPassword('');
    setConfirmPassword('');
    setIsIdentityVerified(false);
    setAuthError(null);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setShowProfileMenu(false);
    setTimeout(() => {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setVerifiedIC('');
      setIsLoggingOut(false);
      setShowProfileManagement(false);
    }, 1500);
  };

  const handleAgeChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 3) setAgeInput(val);
  };

  const handleIdentityChange = (e) => {
    let val = e.target.value;
    if (authError) setAuthError(null);
    if (isIdentityVerified) setIsIdentityVerified(false);

    if (/^[0-9-]*$/.test(val)) {
      const digits = val.replace(/\D/g, '');
      
      if (authType === 'signup' && digits.length >= 6) {
        const year = digits.substring(0, 2);
        const month = digits.substring(2, 4);
        const day = digits.substring(4, 6);
        const currentYear = new Date().getFullYear() % 100;
        const century = parseInt(year) > currentYear ? "19" : "20";
        setAuthDob(`${day}/${month}/${century}${year}`);
      }
      
      if (authType === 'signup' && digits.length === 12) {
        const lastDigit = parseInt(digits.slice(-1));
        setAuthGender(lastDigit % 2 === 0 ? "Female" : "Male");
      }

      let formatted = digits.substring(0, 12);
      if (formatted.length > 6) formatted = `${formatted.substring(0, 6)}-${formatted.substring(6, 8)}${formatted.length > 8 ? '-' : ''}${formatted.substring(8, 12)}`;
      setAuthIdentity(formatted);
    } else {
      setAuthIdentity(val);
    }
  };

  const handleVerifyIdentity = (e) => {
    e.preventDefault();
    const digitsOnly = authIdentity.replace(/\D/g, '');
    if (digitsOnly.length < 12 && !authIdentity.includes('@')) {
      setAuthError(t[language].authErrors.shortIc);
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (digitsOnly === "000000000000" || digitsOnly.length === 12 || authIdentity.includes('@')) {
        setIsIdentityVerified(true);
        setAuthError(null);
      } else {
        setAuthError(t[language].authErrors.notFound);
      }
    }, 1200);
  };

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
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, ic_number')
        .eq('id', data.user.id)
        .single();

      if (profile?.role === 'admin') setIsAdmin(true);
      setVerifiedIC(profile?.ic_number || '');
      setIsLoggedIn(true);
      setIsMatching(false);
      setShowAuthModal(false);
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
      profile: { guest: 'Guest User', user: 'ALEXANDER_AR98', signup: 'Sign Up' },
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
      profile: { guest: 'Pengguna Tamu', user: 'ALEXANDER_AR98', signup: 'Daftar' },
      searchSuggestions: ['Biasiswa', 'Bantuan Kewangan', 'SCHB', 'Sambungan Air']
    }
  }), [language]);

  const isEmailInput = useMemo(() => authIdentity.length > 0 && !/^[0-9-]*$/.test(authIdentity), [authIdentity]);

  const filteredServices = useMemo(() => {
    let list = services;
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(cat => 
        cat.title.en.toLowerCase().includes(q) || cat.title.ms.toLowerCase().includes(q) ||
        cat.keywords.some(k => k.includes(q))
      );
    }
    const ageNum = parseInt(ageInput);
    const minIncNum = parseInt(minIncome);
    list = list.filter(cat => {
      const ageMatch = isNaN(ageNum) || (ageNum >= cat.minAge && ageNum <= cat.maxAge);
      const incomeMatch = isNaN(minIncNum) || (minIncNum <= cat.maxIncome) || cat.maxIncome === 99999;
      return ageMatch && incomeMatch;
    });
    return list;
  }, [searchQuery, minIncome, ageInput, services]);

  const addItem = (catId) => {
    const name = prompt("Enter Service Name:");
    const desc = prompt("Enter One Sentence Description:");
    if (!name || !desc) return;
    setServices(prev => prev.map(cat => cat.id === catId ? { ...cat, items: [...cat.items, { en: name, ms: name, desc }] } : cat));
  };

  const deleteItem = (catId, idx) => {
    setServices(prev => prev.map(cat => cat.id === catId ? { ...cat, items: cat.items.filter((_, i) => i !== idx) } : cat));
  };

  const addEmailSuffix = (suffix) => {
    if (isIdentityVerified) setIsIdentityVerified(false);
    if (!authIdentity.includes('@')) setAuthIdentity(authIdentity + suffix);
    else setAuthIdentity(authIdentity.split('@')[0] + suffix);
  };

  // --- Effects ---
  useEffect(() => {
    const suggestions = t[language].searchSuggestions;
    let wordIdx = 0, dotIdx = 0;
    const dotSequence = ['', '.', '..', '...'];
    const interval = setInterval(() => {
      setPlaceholderText(`Search for ${suggestions[wordIdx]}${dotSequence[dotIdx]}`);
      dotIdx++;
      if (dotIdx > 3) { dotIdx = 0; wordIdx = (wordIdx + 1) % suggestions.length; }
    }, 600);
    return () => clearInterval(interval);
  }, [language, t]);

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setAgeInput('28');
      setMinIncome('3500');
      setMaxIncome('3500');
      setShowAdjustableFilters(false);
    } else {
      setAgeInput('');
      setMinIncome('');
      setMaxIncome('');
    }
  }, [isLoggedIn]);

  const toggleCategory = (id) => setExpandedCategoryId(expandedCategoryId === id ? null : id);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sign Out Loader */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in">
           <div className="flex flex-col items-center gap-5">
              <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
              <p className="text-white font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">{t[language].logoutNote}</p>
           </div>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all ${darkMode ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white/95 border-slate-200 shadow-sm'}`}>
        <div className="w-full px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => {setSearchQuery(''); setShowAdjustableFilters(false);}}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-yellow-500 font-bold text-black text-xs shadow-lg transform group-hover:scale-110 transition-transform">KC</div>
            <h1 className="font-black text-xl tracking-tighter uppercase">KENYALANG <span className="text-yellow-500">CARE</span></h1>
          </div>

          <div className="flex items-center gap-3" ref={menuRef}>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-full transition-all ${darkMode ? 'bg-slate-800 text-yellow-500 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
               {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className={`flex items-center gap-3 p-1 pr-3 rounded-full border transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'} active:scale-95`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLoggedIn ? (isAdmin ? 'bg-purple-500' : 'bg-green-500') : (darkMode ? 'bg-slate-700' : 'bg-black')}`}>
                  <User className="w-5 h-5 text-white" />
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>
              {showProfileMenu && (
                <div className={`absolute right-0 mt-3 w-72 rounded-3xl border-2 shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 text-slate-900'}`}>
                  <div className={`p-6 border-b ${darkMode ? 'border-slate-800 bg-slate-800/30' : 'border-slate-50 bg-slate-50/50'}`}>
                    <p className="font-bold text-lg leading-none">{isLoggedIn ? (isAdmin ? "Administrator" : t[language].profile.user) : t[language].profile.guest}</p>
                    {isLoggedIn && !isAdmin && <p className="text-[9px] uppercase font-bold opacity-30 mt-1">ID: KC-{verifiedIC.split('-').join('')}</p>}
                  </div>
                  <div className="p-2 space-y-1">
                    {!isLoggedIn ? (
                      <>
                        <button onClick={() => openAuth('login')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all hover:bg-slate-100 dark:hover:bg-yellow-500/10`}><LogIn className="w-5 h-5" /> {t[language].authTitle.login}</button>
                        <button onClick={() => openAuth('signup')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all hover:bg-slate-100 dark:hover:bg-yellow-500/10`}><UserPlus className="w-5 h-5" /> {t[language].profile.signup}</button>
                      </>
                    ) : (
                      <>
                        {isAdmin && <button onClick={() => { setShowAdminPanel(true); setShowProfileMenu(false); }} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm bg-purple-500/10 text-purple-500 hover:bg-purple-500 hover:text-white transition-all`}><Settings className="w-5 h-5" /> {t[language].adminPanel}</button>}
                        <button onClick={() => { setShowProfileManagement(true); setShowProfileMenu(false); }} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all hover:bg-slate-100 dark:hover:bg-yellow-500/10`}><ShieldCheck className="w-5 h-5" /> {t[language].manageProfile}</button>
                        <button onClick={() => { setShowStatusBoard(true); setShowProfileMenu(false); }} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all hover:bg-slate-100 dark:hover:bg-yellow-500/10`}><Clock className="w-5 h-5" /> {t[language].checkStatus}</button>
                      </>
                    )}
                    <button onClick={() => setLanguage(language === 'en' ? 'ms' : 'en')} className="w-full p-4 rounded-2xl text-xs font-bold uppercase hover:bg-slate-100 dark:hover:bg-yellow-500/10 flex items-center justify-between border-t border-slate-800/10"><Globe className="w-4 h-4" /> {language === 'en' ? 'English' : 'Bahasa Melayu'}</button>
                    {isLoggedIn && <button onClick={handleLogout} className="w-full p-4 text-red-500 font-bold text-sm flex items-center gap-3 hover:bg-red-500/5 rounded-2xl transition-all"><LogOut className="w-5 h-5" /> {t[language].profile.logout}</button>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="w-full md:max-w-3xl mx-auto px-4 py-8 md:py-16 min-h-[65vh]">
        {/* Search Bar */}
        <div className="relative group mb-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-yellow-600 z-10" />
          <input type="text" placeholder={placeholderText} className={`w-full pl-16 pr-16 py-6 rounded-3xl border-2 outline-none font-bold text-lg shadow-2xl transition-all backdrop-blur-md ${darkMode ? 'bg-white/10 border-white/20 focus:border-yellow-600 text-white' : 'bg-white border-slate-200 focus:border-black text-slate-900'}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <button onClick={() => setShowAdjustableFilters(!showAdjustableFilters)} className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all z-10 ${showAdjustableFilters ? 'bg-yellow-500 text-black shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-white/10 opacity-60 hover:opacity-100'}`}><SlidersHorizontal className="w-6 h-6" /></button>
        </div>

        {/* Filter */}
        {showAdjustableFilters && (
          <div className="flex justify-center mb-10">
            <div className={`w-full max-w-lg rounded-[2.5rem] border-2 p-8 animate-in zoom-in-95 fade-in duration-200 backdrop-blur-md shadow-2xl ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black shadow-lg"><Filter className="w-5 h-5" /></div><h2 className="text-lg font-bold uppercase tracking-tight">{t[language].matchTitle}</h2></div>
                <button onClick={() => { setAgeInput(''); setMinIncome(''); setMaxIncome(''); }} className="text-[10px] font-bold text-red-500 uppercase hover:underline">Reset</button>
              </div>
              <div className="space-y-6">
                <div className="space-y-2"><label className="text-[10px] font-bold uppercase opacity-40 px-1 tracking-[0.2em]">{t[language].filters.age}</label><input type="text" inputMode="numeric" placeholder={t[language].filters.placeholder} className={`w-full p-4 rounded-2xl border-2 font-bold outline-none transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-yellow-500' : 'bg-slate-50 border-slate-200 focus:border-black'}`} value={ageInput} onChange={handleAgeChange} /></div>
                {parseInt(ageInput) >= 20 && (
                  <div className="space-y-6 animate-in slide-in-from-top-4 fade-in duration-500"><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-[10px] font-bold uppercase opacity-40 px-1">{t[language].filters.incomeMin}</label><input type="text" inputMode="numeric" placeholder="0" className={`w-full p-4 rounded-2xl border-2 font-bold outline-none transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} value={minIncome} onChange={(e) => setMinIncome(e.target.value.replace(/\D/g, ''))} /></div><div className="space-y-2"><label className="text-[10px] font-bold uppercase opacity-40 px-1">{t[language].filters.incomeMax}</label><input type="text" inputMode="numeric" placeholder="5000" className={`w-full p-4 rounded-2xl border-2 font-bold outline-none transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} value={maxIncome} onChange={(e) => setMaxIncome(e.target.value.replace(/\D/g, ''))} /></div></div></div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Catalog */}
        <div className="space-y-4">
          {filteredServices.map(cat => (
            <div key={cat.id} className={`rounded-3xl border-2 transition-all duration-500 backdrop-blur-md ${expandedCategoryId === cat.id ? 'scale-[1.01]' : 'border-slate-800/10'} ${darkMode ? 'bg-white/5' : 'bg-white/80'}`}>
              <div onClick={() => toggleCategory(cat.id)} className="p-6 cursor-pointer flex items-center gap-6 relative overflow-hidden">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors relative z-10 ${expandedCategoryId === cat.id ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' : 'bg-slate-800/10'}`}>
                  {React.createElement(IconMap[cat.icon] || GraduationCap, { className: "w-7 h-7" })}
                </div>
                <div className="flex-grow relative z-10"><h3 className={`font-bold text-xl uppercase tracking-tight transition-colors ${expandedCategoryId === cat.id ? 'text-yellow-600' : ''}`}>{cat.title[language]}</h3></div>
                <ChevronDown className={`transition-transform duration-300 relative z-10 ${expandedCategoryId === cat.id ? 'rotate-180 text-yellow-500' : 'opacity-30'}`} />
              </div>
              {expandedCategoryId === cat.id && (
                <div className="px-6 pb-6 space-y-4 animate-in slide-in-from-top-4 relative z-10">
                  {cat.items.map((item, idx) => (
                    <div key={idx} className={`p-6 rounded-3xl border transition-all flex items-start justify-between group ${darkMode ? 'bg-slate-900 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex-grow pr-6"><p className="font-black uppercase tracking-tight text-sm mb-1">{item[language]}</p><p className="text-[11px] font-medium opacity-60 leading-relaxed italic">"{item.desc}"</p></div>
                      <button onClick={() => { setSelectedService(item); setShowApplicationForm(true); }} className={`p-3.5 rounded-2xl bg-white dark:bg-slate-800 border hover:bg-black hover:text-white dark:hover:bg-yellow-500 transition-all`}><ChevronRight className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Profile Modal */}
      {showProfileManagement && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className={`w-full max-w-5xl h-[85vh] rounded-[3.5rem] flex flex-col md:flex-row overflow-hidden border-2 border-slate-800/20 ${darkMode ? 'bg-slate-900' : 'bg-white shadow-2xl'}`}>
            <div className={`w-full md:w-72 p-8 border-b md:border-b-0 md:border-r ${darkMode ? 'border-white/5 bg-black/20' : 'border-slate-100 bg-slate-50/50'}`}>
               <div className="mb-10 text-center md:text-left">
                  <div className="w-20 h-20 bg-yellow-500 rounded-3xl mx-auto md:mx-0 flex items-center justify-center text-black mb-4 shadow-xl shadow-yellow-500/20"><UserRound className="w-10 h-10" /></div>
                  <h3 className="font-black uppercase tracking-tighter text-xl leading-none">{t[language].profile.user}</h3>
                  <p className="text-[9px] font-bold uppercase opacity-30 tracking-[0.2em] mt-3">ID: KC-{verifiedIC.split('-').join('')}</p>
               </div>
               <nav className="space-y-2">
                  {['overview', 'update', 'security', 'activity'].map(id => (
                    <button key={id} onClick={() => setProfileTab(id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${profileTab === id ? 'bg-yellow-500 text-black shadow-lg' : 'opacity-40 hover:opacity-100'}`}>
                      {id === 'overview' && <User className="w-5 h-5" />}
                      {id === 'update' && <Edit3 className="w-5 h-5" />}
                      {id === 'security' && <ShieldAlert className="w-5 h-5" />}
                      {id === 'activity' && <Activity className="w-5 h-5" />}
                      {id.charAt(0).toUpperCase() + id.slice(1)}
                    </button>
                  ))}
               </nav>
               <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 mt-8 text-red-500 font-bold text-sm hover:bg-red-500/5 rounded-2xl transition-all"><LogOut className="w-5 h-5" /> Sign Out</button>
            </div>
            <div className="flex-grow flex flex-col h-full">
               <div className="p-8 border-b border-white/5 flex justify-between items-center"><h4 className="font-black uppercase tracking-tighter text-2xl">{profileTab}</h4><button onClick={() => setShowProfileManagement(false)} className="p-3 rounded-full bg-slate-500/10"><X className="w-5 h-5" /></button></div>
               <div className="flex-grow p-10 overflow-y-auto scrollbar-hide">
                  {profileTab === 'overview' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 pb-10">
                       <section>
                          <h5 className="text-[10px] font-black uppercase opacity-30 tracking-[0.4em] mb-6 flex items-center gap-3"><Fingerprint className="w-3 h-3" /> Permanent Record</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                             {[
                               { label: 'Full Name', value: 'ALEXANDER ANAK ROBERT' },
                               { label: 'MyKad (IC)', value: verifiedIC },
                               { label: 'Account Status', value: 'ACTIVE • VERIFIED', color: 'text-green-500' },
                               { label: 'Country', value: 'MALAYSIA (SARAWAK)' },
                               { label: 'Date of Birth', value: authDob },
                               { label: 'Gender', value: authGender },
                               { label: 'Race', value: authRace || 'IBAN' },
                               { label: 'Religion', value: authReligion || 'CHRISTIAN' }
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
               </div>
            </div>
          </div>
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

      {showAboutUs && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg animate-in fade-in">
          <div className={`w-full max-w-lg rounded-[3.5rem] p-12 text-center shadow-2xl ${darkMode ? 'bg-slate-900 border-2 border-slate-800' : 'bg-white'}`}>
            <Info className="w-12 h-12 text-yellow-500 mx-auto mb-10" />
            <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter">{t[language].aboutUs}</h3>
            <p className="text-sm opacity-70 mb-12 leading-[1.8] font-medium text-justify">{t[language].aboutDetail}</p>
            <button onClick={() => setShowAboutUs(false)} className={`w-full py-6 rounded-[2rem] bg-black text-white font-black uppercase tracking-[0.3em] hover:bg-yellow-500 hover:text-black transition-all shadow-xl`}>{t[language].close}</button>
          </div>
        </div>
      )}

      {isReportingBug && (
        <div className="fixed inset-0 z-[70] pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute bottom-0 animate-bug-upward"><Bug className="w-24 h-24 text-yellow-500" /></div>
          <div className={`px-10 py-5 bg-black text-white rounded-full font-black shadow-2xl animate-in zoom-in-50 border border-white/10`}>{t[language].bugThanks}</div>
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
