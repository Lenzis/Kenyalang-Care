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
  Gavel, Waves, Zap, FileUp, Droplet
} from 'lucide-react';

// --- Complete 16-Category Service Data ---
const SERVICES_DATA = [
  { id: 1, title: { en: "1. Aids / Bantuan for student", ms: "1. Bantuan Pelajar" }, icon: <GraduationCap className="w-8 h-8" />, minAge: 5, maxAge: 25, maxIncome: 4850, keywords: ['money', 'cash', 'duit', 'finance', 'laptop', 'book', 'transport', 'uniform'], items: [{ en: "Bantuan kewangan khas", ms: "Bantuan kewangan khas" }, { en: "Laptop", ms: "Laptop" }, { en: "Book", ms: "Buku" }, { en: "Free school transport", ms: "Pengangkutan sekolah percuma" }, { en: "School scholarship", ms: "Biasiswa sekolah" }, { en: "Tuition", ms: "Tuisyen" }, { en: "Uniform", ms: "Pakaian Seragam" }] },
  { id: 2, title: { en: "2. Biasiswa (Scholarships)", ms: "2. Biasiswa" }, icon: <BookOpen className="w-8 h-8" />, minAge: 17, maxAge: 35, maxIncome: 10000, keywords: ['study', 'ipt', 'degree', 'unimas', 'yayasan', 'bursary'], items: [{ en: "Biasiswa yayasan sarawak tun taib", ms: "Biasiswa yayasan sarawak tun taib" }, { en: "YBSTAR Scholarship", ms: "YBSTAR" }, { en: "Biasiswa khas program perubatan unimas", ms: "Biasiswa perubatan Unimas" }, { en: "Bantuan kemasukan ke IPT", ms: "Bantuan kemasukan ke IPT" }, { en: "Bursari BP40", ms: "Bursari BP40" }, { en: "i-GPS", ms: "i-GPS" }] },
  { id: 3, title: { en: "3. Pinjaman (Loans)", ms: "3. Pinjaman" }, icon: <Bank className="w-8 h-8" />, minAge: 18, maxAge: 50, maxIncome: 99999, keywords: ['money', 'loan', 'pinjam'], items: [{ en: "Biasiswa pinjaman pelajaran dalam negara", ms: "Pinjaman Dalam Negara" }, { en: "Pinjaman pelajaran luar negara", ms: "Pinjaman Luar Negara" }, { en: "Biasiswa pinjaman latihan teknikal", ms: "Pinjaman Latihan Teknikal" }] },
  { id: 4, title: { en: "4. Program dan bantuan", ms: "4. Program dan Bantuan" }, icon: <Sparkles className="w-8 h-8" />, minAge: 7, maxAge: 100, maxIncome: 99999, keywords: ['english', 'premier', 'award', 'akps', 'hipers'], items: [{ en: "Biasiswa program pertukaran pelajaran", ms: "Program Pertukaran" }, { en: "Program pendidikan komuniti", ms: "Pendidikan Komuniti" }, { en: "Program HiPERS", ms: "HiPERS" }, { en: "Anugerah khas premier sarawak (AKPS)", ms: "AKPS" }, { en: "English Powerment (EPP)", ms: "EPP" }] },
  { id: 6, title: { en: "6. Bayaran balik pinjaman", ms: "6. Bayaran Balik" }, icon: <ClipboardCheck className="w-8 h-8" />, minAge: 22, maxAge: 70, maxIncome: 99999, keywords: ['pay', 'repay', 'insentif'], items: [{ en: "Repayment Methods", ms: "Kaedah" }, { en: "Repayment Incentives", ms: "Insentif" }] },
  { id: 7, title: { en: "7. Hantar Keputusan / Laporan", ms: "7. Hantar Keputusan" }, icon: <FileUp className="w-8 h-8" />, minAge: 18, maxAge: 50, maxIncome: 99999, keywords: ['result', 'exam', 'semester', 'form'], items: [{ en: "Semester Result Form", ms: "Borang Keputusan Semester" }] },
  { id: 8, title: { en: "8. Business trade", ms: "8. Perdagangan Bisnes" }, icon: <Briefcase className="w-8 h-8" />, minAge: 18, maxAge: 70, maxIncome: 99999, keywords: ['telecommunications', 'hotel', 'manufacturing', 'tender', 'credit'], items: [{ en: "Permit to operate (telecommunications)", ms: "Permit Telekomunikasi" }, { en: "Application for WayLeave", ms: "Permohonan WayLeave" }, { en: "Application to become panel hotel", ms: "Panel Hotel" }, { en: "Sarawak Micro Credit Scheme (SMCS)", ms: "SMCS" }, { en: "eProcurement Solution", ms: "eProcurement" }] },
  { id: 9, title: { en: "9. Council Service", ms: "9. Perkhidmatan Majlis" }, icon: <Building2 className="w-8 h-8" />, minAge: 18, maxAge: 120, maxIncome: 99999, keywords: ['council', 'tax', 'rates', 'bill'], items: [{ en: "Clearance of indebtedness G(1)", ms: "Sijil Pelepasan Hutang" }, { en: "e-billing of assessment rates", ms: "e-billing Cukai" }, { en: "Rebate of assessment rates", ms: "Rebat Cukai" }] },
  { id: 10, title: { en: "10. Education & Learning", ms: "10. Pendidikan" }, icon: <BookOpen className="w-8 h-8" />, minAge: 7, maxAge: 60, maxIncome: 99999, keywords: ['scholarship', 'hydrological', 'SPEAK'], items: [{ en: "Apply for scholarships", ms: "Mohon Biasiswa" }, { en: "School leavers registration (SPEAK)", ms: "Pendaftaran SPEAK" }, { en: "1 village 1 story", ms: "1 kampung 1 cerita" }] },
  { id: 11, title: { en: "11. Hydrology", ms: "11. Hidrologi" }, icon: <Droplet className="w-8 h-8" />, minAge: 18, maxAge: 100, maxIncome: 99999, keywords: ['hydrological', 'data', 'water'], items: [{ en: "Sarawak hydrological year book", ms: "Buku Tahunan Hidrologi" }, { en: "Request hydrological data", ms: "Mohon Data Hidrologi" }] },
  { id: 12, title: { en: "12. Land & Agriculture", ms: "12. Tanah & Pertanian" }, icon: <Sprout className="w-8 h-8" />, minAge: 18, maxAge: 100, maxIncome: 99999, keywords: ['rice', 'maize', 'fisheries', 'crop', 'TKPM'], items: [{ en: "Rice and maize program", ms: "Program Padi & Jagung" }, { en: "Inland fisheries assistance", ms: "Bantuan Perikanan Darat" }, { en: "Taman Kekal pengeluaran makanan (TKPM)", ms: "TKPM" }] },
  { id: 13, title: { en: "13. Licence & permit", ms: "13. Lesen & Permit" }, icon: <FileText className="w-8 h-8" />, minAge: 18, maxAge: 100, maxIncome: 99999, keywords: ['EIA', 'carbon', 'storage', 'wireman'], items: [{ en: "Registration of EIA Consultant", ms: "Daftar Perunding EIA" }, { en: "Licence for Carbon Storage", ms: "Lesen Simpanan Karbon" }, { en: "Endorsement of Wireman", ms: "Pengesahan Wireman" }] },
  { id: 14, title: { en: "14. Life event", ms: "14. Acara Kehidupan" }, icon: <Heart className="w-8 h-8" />, minAge: 18, maxAge: 120, maxIncome: 99999, keywords: ['marriage', 'sick', 'hospital', 'job', 'kgc', 'nikah'], items: [{ en: "Adat Marriage Pre-Registration", ms: "Pendaftaran Perkahwinan Adat" }, { en: "Senior Citizen Health Benefit (SCHB)", ms: "SCHB" }, { en: "Check Status KGC", ms: "Semak Status KGC" }, { en: "Apply Job with State Government", ms: "Mohon Kerja Kerajaan" }] },
  { id: 15, title: { en: "15. Social & community", ms: "15. Sosial & Komuniti" }, icon: <Users className="w-8 h-8" />, minAge: 0, maxAge: 120, maxIncome: 4850, keywords: ['museum', 'park', 'money', 'BIB', 'BIK', 'EFS', 'housing'], items: [{ en: "Bantuan Ibu Bersalin (BIB)", ms: "BIB" }, { en: "Bantuan Ihsan Kematian (BIK)", ms: "BIK" }, { en: "Endowment Fund Sarawak (EFS)", ms: "EFS" }, { en: "Public Housing Application", ms: "Perumahan Awam" }] },
  { id: 16, title: { en: "16. Utilities", ms: "16. Utiliti" }, icon: <UtilityPole className="w-8 h-8" />, minAge: 18, maxAge: 120, maxIncome: 99999, keywords: ['gas', 'water', 'electric', 'LJK', 'BELB'], items: [{ en: "New Water Supply Connection", ms: "Sambungan Air Baru" }, { en: "Water Bill Installment Plan", ms: "Pelan Ansuran Bil Air" }, { en: "Rural Electrification (BELB)", ms: "Bekalan Elektrik Luar Bandar (BELB)" }] }
];

const App = () => {
  // --- State ---
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en'); 
  const [searchQuery, setSearchQuery] = useState('');
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
  
  // Auth States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login'); 
  const [showPassword, setShowPassword] = useState(false);
  const [authIdentity, setAuthIdentity] = useState('');
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [verifiedIC, setVerifiedIC] = useState('');
  const [authError, setAuthError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Filter States (Guest Mode)
  const [minIncome, setMinIncome] = useState(''); 
  const [maxIncome, setMaxIncome] = useState(''); 
  const [ageInput, setAgeInput] = useState(''); 
  const [employmentIdx, setEmploymentIdx] = useState(0);
  const [maritalIdx, setMaritalIdx] = useState(0);

  const menuRef = useRef(null);
  const privacyUrl = "https://www.termsfeed.com/live/adceebaa-54af-463f-8fbb-e6bafd896862";

  // --- Translations ---
  const t = {
    en: {
      title: 'Kenyalang Care',
      checkStatus: 'Track Status',
      manageProfile: 'Profile Settings',
      reportBug: 'Report a bug',
      bugThanks: 'Thanks! Bug squashed! 🛡️',
      aboutUs: 'About Us',
      aboutDetail: 'Kenyalang Care is a centralized digital initiative designed to streamline access to essential services, educational aids and assistance programs. Our mission is to empower the community by providing a seamless, transparent and user-friendly platform to connect individuals with the resources they need to thrive. Whether you are seeking student scholarships, council services or business trade permits, this portal serves as a unified bridge between the people and available support systems.',
      privacy: 'Privacy Policy',
      statusNote: 'LIVE SERVICE • PHASE 2',
      noResults: 'No matches found.',
      bestMatch: 'Intent Match Detected',
      matchBadge: 'Recommended',
      matchBtn: 'Recalculating...',
      authTitle: { login: 'Log In', signup: 'Sign Up' },
      authSubtitle: { login: 'Secure citizen access', signup: 'Create digital profile' },
      authLabels: { identity: 'Identity', password: 'Password', verify: 'Verify Identity', verified: 'Confirmed' },
      authPlaceholder: 'IC Number or Email',
      authErrors: {
        shortIc: "Can't Log In: Incomplete IC (12 digits required).",
        notFound: "Identity not found. Sign Up if you are a new user.",
        generic: "Verification failed."
      },
      authSwitch: { login: "New User? Sign Up Here", signup: "Existing User? Log In" },
      applyTitle: 'Application',
      applyBtn: 'Submit Application',
      close: 'Close',
      logoutNote: 'Logging Out...',
      matchTitle: 'Filter',
      matchSubtitle: 'Eligibility Check',
      filters: {
        incomeMin: 'Min Income (RM)',
        incomeMax: 'Max Income (RM)',
        age: 'Age',
        placeholder: 'Enter Age',
        employment: { label: 'Employment Status', levels: ['Any', 'Student', 'Working', 'Pensioner'] },
        marital: { label: 'Marital Status', levels: ['Any', 'Single', 'Married', 'Divorced'] }
      },
      heyReplies: ["Matching aid to profile...", "Highlighting best aids! ✨", "Welcome back! 🦅"],
      profile: { guest: 'Guest User', user: 'Verified Citizen', combined: 'Log In / Sign Up', logout: 'Log Out', verified: 'Verified Account', signup: 'Sign Up' },
      profileTitle: 'Digital Identity',
      profileSub: 'Verified Profile Data',
      sections: { personal: 'Personal Details', financial: 'Household & Eligibility', account: 'Account & Security' },
      searchSuggestions: ['Scholarships', 'Financial Aid', 'SCHB', 'Water Connection']
    },
    ms: {
      title: 'Kenyalang Care',
      checkStatus: 'Jejak Status',
      manageProfile: 'Tetapan Profil',
      reportBug: 'Lapor pepijat',
      aboutUs: 'Tentang Kami',
      aboutDetail: 'Kenyalang Care adalah inisiatif digital berpusat yang direka untuk memudahkan akses kepada perkhidmatan penting, bantuan pendidikan dan program bantuan. Misi kami adalah untuk memperkasakan komuniti dengan menyediakan platform yang lancar, telus dan mesra pengguna untuk menghubungkan individu dengan sumber yang mereka perlukan untuk berkembang maju. Sama ada anda mencari biasiswa pelajar, perkhidmatan majlis atau permit perdagangan perniagaan, portal ini berfungsi sebagai jambatan bersatu antara rakyat dan sistem sokongan yang tersedia.',
      privacy: 'Dasar Privasi',
      statusNote: 'PERKHIDMATAN LIVE • FASA 2',
      noResults: 'Tiada padanan ditemui.',
      bestMatch: 'Padanan Niat Dikesan',
      matchBadge: 'Disyorkan',
      matchBtn: 'Mengira semula...',
      authTitle: { login: 'Log Masuk', signup: 'Daftar Akaun' },
      authSubtitle: { login: 'Akses rakyat selamat', signup: 'Bina profil digital' },
      authLabels: { identity: 'Identiti', password: 'Kata Laluan', verify: 'Sahkan Identiti', verified: 'Disahkan' },
      authPlaceholder: 'No. IC atau Emel',
      authErrors: {
        shortIc: "Gagal Log Masuk: No. IC tidak lengkap (12 digit diperlukan).",
        notFound: "Identiti tidak ditemui. Sila Daftar jika anda pengguna baru.",
        generic: "Pengesahan gagal."
      },
      authSwitch: { login: "Pengguna Baru? Daftar Di Sini", signup: "Sudah berdaftar? Log Masuk" },
      applyTitle: 'Permohonan',
      applyBtn: 'Hantar Sekarang',
      close: 'Tutup',
      logoutNote: 'Sedang Log Keluar...',
      matchTitle: 'Penapis',
      matchSubtitle: 'Semak Kelayakan',
      filters: {
        incomeMin: 'Pendapatan Min (RM)',
        incomeMax: 'Pendapatan Max (RM)',
        age: 'Umur',
        placeholder: 'Masukkan Umur',
        employment: { label: 'Status Pekerjaan', levels: ['Semua', 'Pelajar', 'Bekerja', 'Pesara'] },
        marital: { label: 'Status Perkahwinan', levels: ['Semua', 'Bujang', 'Berkahwin', 'Duda/Janda'] }
      },
      heyReplies: ["Memadankan bantuan...", "Menonjolkan padanan terbaik! ✨", "Selamat kembali! 🦅"],
      profile: { guest: 'Pengguna Tamu', user: 'Rakyat Disahkan', combined: 'Log Masuk / Daftar', logout: 'Log Keluar', verified: 'Akaun Disahkan', signup: 'Daftar' },
      profileTitle: 'Identiti Digital Saya',
      profileSub: 'Data Profil Disahkan',
      sections: { personal: 'Butiran Peribadi', financial: 'Kelayakan', account: 'Keselamatan' },
      searchSuggestions: ['Biasiswa', 'Bantuan Kewangan', 'SCHB', 'Sambungan Air']
    }
  };

  // --- Handlers ---
  const triggerBugAnimation = () => {
    if (isReportingBug) return;
    setIsReportingBug(true);
    setTimeout(() => setIsReportingBug(false), 2500);
  };

  const handleViewModeClick = () => {
    const replies = t[language].heyReplies;
    const msg = replies[Math.floor(Math.random() * replies.length)];
    setHeyMessage(msg);
    setIsPulsing(true);
    setTimeout(() => { setHeyMessage(null); setIsPulsing(false); }, 2500);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setShowProfileMenu(false);
    setTimeout(() => {
      setIsLoggedIn(false);
      setVerifiedIC('');
      setIsLoggingOut(false);
    }, 1500);
  };

  const handleAgeChange = (e) => {
    const val = e.target.value;
    const onlyNums = val.replace(/[^0-9]/g, '');
    if (onlyNums.length <= 3) setAgeInput(onlyNums);
  };

  const handleIdentityChange = (e) => {
    let val = e.target.value;
    const isPotentiallyIC = /^[0-9-]*$/.test(val);
    
    if (authError) setAuthError(null);
    if (isIdentityVerified) setIsIdentityVerified(false);

    if (isPotentiallyIC) {
      const digits = val.replace(/\D/g, '').substring(0, 12);
      let formatted = digits;
      if (digits.length > 6) {
        formatted = `${digits.substring(0, 6)}-${digits.substring(6, 8)}`;
        if (digits.length > 8) formatted = `${formatted}-${digits.substring(8, 12)}`;
      }
      setAuthIdentity(formatted);
    } else {
      setAuthIdentity(val);
    }
  };

  const handleVerifyIdentity = (e) => {
    e.preventDefault();
    const digitsOnly = authIdentity.replace(/\D/g, '');
    const isIC = /^[0-9-]*$/.test(authIdentity);
    if (isIC && digitsOnly.length < 12) {
      setAuthError(t[language].authErrors.shortIc);
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (digitsOnly.length === 12 || authIdentity.includes('@')) {
        setIsIdentityVerified(true);
        setAuthError(null);
      } else {
        setAuthError(t[language].authErrors.notFound);
      }
    }, 1200);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsMatching(true);
    setTimeout(() => {
      setVerifiedIC(authIdentity);
      setIsLoggedIn(true);
      setIsMatching(false);
      setShowAuthModal(false);
    }, 1500);
  };

  const toggleCategory = (id) => setExpandedCategoryId(expandedCategoryId === id ? null : id);
  const handleServiceItemClick = (e, item) => {
    e.stopPropagation();
    setSelectedService(item);
    setShowApplicationForm(true);
  };

  const openAuth = (type) => {
    setAuthType(type);
    setShowAuthModal(true);
    setShowProfileMenu(false);
    setAuthIdentity('');
    setIsIdentityVerified(false);
    setAuthError(null);
  };

  // --- Search & Filter Logic ---
  const isEmailInput = useMemo(() => authIdentity.length > 0 && !/^[0-9-]*$/.test(authIdentity), [authIdentity]);

  const filteredServices = useMemo(() => {
    let list = SERVICES_DATA;
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(cat => 
        cat.title.en.toLowerCase().includes(q) || 
        cat.title.ms.toLowerCase().includes(q) ||
        cat.keywords.some(k => k.includes(q))
      );
    }
    if (!isLoggedIn) {
      const ageNum = parseInt(ageInput);
      const minIncNum = parseInt(minIncome);
      list = list.filter(cat => {
        const ageMatch = isNaN(ageNum) || (ageNum >= cat.minAge && ageNum <= cat.maxAge);
        const incomeMatch = isNaN(minIncNum) || (minIncNum <= cat.maxIncome) || cat.maxIncome === 99999;
        return ageMatch && incomeMatch;
      });
    }
    return list;
  }, [searchQuery, minIncome, ageInput, isLoggedIn]);

  const checkProfileMatch = (cat) => {
    if (!isLoggedIn) return false;
    const ageNum = 28; 
    const currentIncome = 3500;
    const matchesAge = ageNum >= cat.minAge && ageNum <= cat.maxAge;
    const matchesIncome = currentIncome <= cat.maxIncome || cat.maxIncome === 99999;
    return matchesAge && matchesIncome;
  };

  const recommendedServices = useMemo(() => SERVICES_DATA.slice(0, 3), []);
  const hasIntentMatch = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return ['money', 'duit', 'sick', 'sakit', 'hospital'].some(word => q.includes(word));
  }, [searchQuery]);

  // --- Effects ---
  useEffect(() => {
    const suggestions = t[language].searchSuggestions;
    let wordIdx = 0;
    let dotIdx = 0;
    const dotSequence = ['', '.', '..', '...'];
    const interval = setInterval(() => {
      setPlaceholderText(`Search for ${suggestions[wordIdx]}${dotSequence[dotIdx]}`);
      dotIdx++;
      if (dotIdx > 3) {
        dotIdx = 0;
        wordIdx = (wordIdx + 1) % suggestions.length;
      }
    }, 600);
    return () => clearInterval(interval);
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Logout Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="flex flex-col items-center gap-5">
              <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
              <p className="text-white font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">{t[language].logoutNote}</p>
           </div>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${darkMode ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white/95 border-slate-200'}`}>
        <div className="w-full px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => {setSearchQuery(''); setShowAdjustableFilters(false); setAgeInput(''); setMinIncome(''); setMaxIncome('');}}>
            <div className="w-10 h-10 flex items-center justify-center">
              <div className="w-full h-full rounded-xl flex items-center justify-center bg-yellow-500 font-bold text-black text-xs shadow-lg">KC</div>
            </div>
            <h1 className="font-bold text-xl md:text-2xl tracking-tight uppercase">KENYALANG <span className="text-yellow-500">CARE</span></h1>
          </div>

          <div className="relative" ref={menuRef}>
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className={`flex items-center gap-3 p-1 pr-3 rounded-full border transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'} active:scale-95`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLoggedIn ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : (darkMode ? 'bg-slate-700' : 'bg-black')}`}>
                <User className="w-5 h-5 text-white" />
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {showProfileMenu && (
              <div className={`absolute right-0 mt-3 w-72 rounded-3xl border-2 shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 text-slate-900'}`}>
                <div className={`p-6 border-b ${darkMode ? 'border-slate-800 bg-slate-800/30' : 'border-slate-50 bg-slate-50/50'}`}>
                  <p className="font-bold text-lg leading-none">{isLoggedIn ? t[language].profile.user : t[language].profile.guest}</p>
                </div>
                <div className="p-2 space-y-1">
                  {!isLoggedIn ? (
                    <>
                      <button onClick={() => openAuth('login')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${darkMode ? 'hover:bg-yellow-600/10 text-yellow-500' : 'hover:bg-slate-100'}`}>
                        <LogIn className="w-5 h-5" /> {t[language].authTitle.login}
                      </button>
                      <button onClick={() => openAuth('signup')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${darkMode ? 'hover:bg-yellow-600/10 text-yellow-500' : 'hover:bg-slate-100'}`}>
                        <UserPlus className="w-5 h-5" /> {t[language].profile.signup}
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setShowProfileManagement(true); setShowProfileMenu(false); }} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${darkMode ? 'hover:bg-yellow-600/10 text-yellow-500' : 'hover:bg-slate-100'}`}><Settings className="w-5 h-5" /> {t[language].manageProfile}</button>
                      <button onClick={() => { setShowStatusBoard(true); setShowProfileMenu(false); }} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${darkMode ? 'hover:bg-yellow-600/10 text-yellow-500' : 'hover:bg-slate-100'}`}><Clock className="w-5 h-5" /> {t[language].checkStatus}</button>
                    </>
                  )}
                  <div className="p-4 grid grid-cols-2 gap-2 border-t border-slate-800/10">
                    <button onClick={() => setLanguage(language === 'en' ? 'ms' : 'en')} className="p-2 rounded-xl border text-xs font-bold uppercase hover:bg-yellow-500/10">{language}</button>
                    <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl border text-xs font-bold uppercase hover:bg-yellow-500/10">{darkMode ? 'Light' : 'Dark'}</button>
                  </div>
                  {isLoggedIn && <button onClick={handleLogout} className="w-full p-4 text-red-500 font-bold text-sm flex items-center gap-3 active:scale-95 transition-all"><LogOut className="w-5 h-5" /> {t[language].profile.logout}</button>}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="w-full md:max-w-[70%] mx-auto px-4 py-8 md:py-12 min-h-[65vh]">
        <div className="relative group mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-600 z-10" />
          <input type="text" placeholder={placeholderText} className={`w-full pl-14 pr-16 py-5 rounded-2xl border-2 outline-none font-semibold text-lg shadow-xl transition-all backdrop-blur-md ${darkMode ? 'bg-white/10 border-white/20 focus:border-yellow-600 text-white' : 'bg-white border-slate-200 focus:border-black text-slate-900'}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          {!isLoggedIn && <button onClick={() => setShowAdjustableFilters(!showAdjustableFilters)} className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all z-10 ${showAdjustableFilters ? 'bg-yellow-500 text-black shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-white/10 opacity-60 hover:opacity-100'}`}><SlidersHorizontal className="w-6 h-6" /></button>}
        </div>

        {/* Filter Box */}
        {!isLoggedIn && showAdjustableFilters && (
          <div className="flex justify-center mb-10">
            <div className={`w-full max-w-lg rounded-[2.5rem] border-2 p-8 animate-in zoom-in-95 fade-in duration-200 backdrop-blur-md shadow-2xl ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black shadow-lg"><Filter className="w-5 h-5" /></div>
                  <h2 className="text-lg font-bold uppercase tracking-tight">{t[language].matchTitle}</h2>
                </div>
                <button onClick={() => { setAgeInput(''); setMinIncome(''); setMaxIncome(''); }} className="text-[10px] font-bold text-red-500 uppercase hover:underline">Reset</button>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase opacity-40 px-1 tracking-[0.2em]">{t[language].filters.age}</label>
                  <input type="text" inputMode="numeric" placeholder={t[language].filters.placeholder} className={`w-full p-4 rounded-2xl border-2 font-bold outline-none transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-yellow-500' : 'bg-slate-50 border-slate-200 focus:border-black'}`} value={ageInput} onChange={handleAgeChange} />
                </div>
                {parseInt(ageInput) >= 20 && (
                  <div className="space-y-6 animate-in slide-in-from-top-4 fade-in duration-500">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase opacity-40 px-1">{t[language].filters.incomeMin}</label>
                        <input type="text" inputMode="numeric" placeholder="0" className={`w-full p-4 rounded-2xl border-2 font-bold outline-none transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} value={minIncome} onChange={(e) => setMinIncome(e.target.value.replace(/\D/g, ''))} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase opacity-40 px-1">{t[language].filters.incomeMax}</label>
                        <input type="text" inputMode="numeric" placeholder="5000" className={`w-full p-4 rounded-2xl border-2 font-bold outline-none transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} value={maxIncome} onChange={(e) => setMaxIncome(e.target.value.replace(/\D/g, ''))} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {isMatching && <div className="mt-8 pt-6 border-t border-slate-800/10 text-[10px] font-bold uppercase animate-pulse text-yellow-500 flex items-center justify-center gap-3"><Loader2 className="w-3 h-3 animate-spin" /> {t[language].matchBtn}</div>}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {searchQuery && hasIntentMatch && filteredServices.length > 0 && (
            <div className="p-4 mb-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-4 animate-in fade-in slide-in-from-left-4">
               <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black shadow-lg"><Lightbulb className="w-5 h-5 animate-pulse" /></div>
               <div><p className="text-[10px] font-bold uppercase tracking-widest text-yellow-600">{t[language].bestMatch}</p><p className="text-sm font-bold opacity-80 leading-tight">Priority aid matching your search intent.</p></div>
            </div>
          )}

          {filteredServices.length === 0 && <div className="py-20 text-center opacity-30 font-bold uppercase tracking-[0.2em]">{t[language].noResults}</div>}

          {filteredServices.map(cat => {
            const isMatch = checkProfileMatch(cat);
            return (
              <div key={cat.id} className={`rounded-3xl border-2 transition-all duration-500 backdrop-blur-md ${expandedCategoryId === cat.id ? 'scale-[1.01]' : 'border-slate-800/10'} ${isMatch ? 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.25)] ring-1 ring-yellow-500/30' : 'border-slate-800/10'} ${darkMode ? (isMatch ? 'bg-yellow-500/10' : 'bg-white/10') : (isMatch ? 'bg-yellow-500/5' : 'bg-white/80 shadow-slate-200/50')}`}>
                <div onClick={() => toggleCategory(cat.id)} className="p-6 cursor-pointer flex items-center gap-6 relative overflow-hidden">
                  {isMatch && <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent animate-pulse-slow pointer-events-none" />}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors relative z-10 ${expandedCategoryId === cat.id || isMatch ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' : 'bg-slate-800/10'}`}>{cat.icon}</div>
                  <div className="flex-grow relative z-10">
                    <div className="flex items-center gap-3">
                       <h3 className={`font-bold text-xl uppercase tracking-tight transition-colors ${isMatch ? 'text-yellow-600 dark:text-yellow-500' : ''}`}>{cat.title[language]}</h3>
                       {isMatch && <div className="flex items-center gap-1.5 bg-yellow-500 text-black px-2.5 py-1 rounded-full text-[9px] font-black uppercase shadow-lg animate-bounce-subtle"><Sparkle className="w-3 h-3 fill-current" /> {t[language].matchBadge}</div>}
                    </div>
                  </div>
                  <ChevronDown className={`transition-transform duration-300 relative z-10 ${expandedCategoryId === cat.id ? 'rotate-180 text-yellow-500' : 'opacity-30'}`} />
                </div>
                {expandedCategoryId === cat.id && (
                  <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-3 animate-in slide-in-from-top-4 relative z-10">
                    {cat.items.map((item, idx) => (
                      <button key={idx} onClick={(e) => handleServiceItemClick(e, item)} className={`flex items-center justify-between p-5 rounded-2xl font-bold text-sm text-left transition-all ${darkMode ? 'bg-slate-800/50 hover:bg-yellow-500 hover:text-black border border-white/5 shadow-xl' : 'bg-white hover:bg-black hover:text-white shadow-sm border border-slate-100'} active:scale-98`}>{item[language]}<ChevronRight className="w-4 h-4" /></button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`w-full max-w-md rounded-[3rem] p-10 relative shadow-[0_0_50px_rgba(202,138,4,0.15)] animate-in zoom-in-95 ${darkMode ? 'bg-slate-900 border-2 border-yellow-500/20' : 'bg-white'}`}>
            <div className="text-center mb-8">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 ${isIdentityVerified ? 'bg-green-500/20 scale-110' : 'bg-yellow-500/10'}`}>
                {isVerifying ? <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" /> : (isIdentityVerified ? <ShieldCheck className="w-10 h-10 text-green-500" /> : (authType === 'login' ? <ShieldQuestion className="w-10 h-10 text-yellow-500" /> : <UserPlus className="w-10 h-10 text-yellow-500" />))}
              </div>
              <h3 className="text-3xl font-bold uppercase tracking-tighter mb-2">{t[language].authTitle[authType]}</h3>
              <p className="text-sm font-bold opacity-40 uppercase tracking-widest">{t[language].authSubtitle[authType]}</p>
            </div>

            {authError && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase leading-tight flex items-center gap-3 animate-shake">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {authError}
              </div>
            )}

            <form onSubmit={isIdentityVerified || authType === 'signup' ? handleLoginSubmit : handleVerifyIdentity} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-40 px-1 tracking-widest flex items-center gap-2"><Fingerprint className="w-3 h-3" /> {t[language].authLabels.identity}</label>
                <div className="relative flex flex-col">
                  <input required disabled={isVerifying} type="text" value={authIdentity} onChange={handleIdentityChange} placeholder={t[language].authPlaceholder} className={`w-full p-5 font-bold outline-none transition-all duration-300 rounded-2xl border-2 ${isEmailInput && !isIdentityVerified ? 'pb-14 h-[100px]' : 'h-[64px]'} ${isIdentityVerified ? 'border-green-500/50 bg-green-500/5' : (authError ? 'border-red-500/50 bg-red-500/5' : (darkMode ? 'bg-slate-800 border-slate-700 focus:border-yellow-500' : 'bg-slate-50 border-slate-200 focus:border-black'))}`} />
                  {isIdentityVerified && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in"><Check className="w-6 h-6 stroke-[3px]" /></div>}
                </div>
              </div>
              {(isIdentityVerified || authType === 'signup') && (
                <div className="space-y-1.5 animate-in slide-in-from-top-4 fade-in duration-500">
                  <label className="text-[10px] font-bold uppercase opacity-40 px-1 tracking-widest flex items-center gap-2"><Lock className="w-3 h-3" /> {t[language].authLabels.password}</label>
                  <input required type={showPassword ? "text" : "password"} placeholder="••••••••" className={`w-full p-5 h-[64px] rounded-2xl border-2 font-bold outline-none transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 text-slate-900'}`} />
                </div>
              )}
              <button type="submit" disabled={isVerifying || authIdentity.length < 5} className={`w-full py-5 mt-4 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 ${isIdentityVerified || authType === 'signup' ? 'bg-yellow-500 text-black shadow-yellow-500/20' : 'bg-black text-white'}`}>
                {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : (isIdentityVerified || authType === 'signup' ? (authType === 'login' ? 'LOG IN' : 'SIGN UP') : t[language].authLabels.verify)}
              </button>
            </form>
            
            <div className="mt-8 text-center border-t border-slate-800/10 pt-8">
              <button onClick={() => setAuthType(authType === 'login' ? 'signup' : 'login')} className="text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-yellow-500 transition-all underline underline-offset-4">
                {t[language].authSwitch[authType]}
              </button>
              <button onClick={() => setShowAuthModal(false)} className="block w-full mt-6 text-[10px] font-bold uppercase opacity-20 hover:opacity-100 tracking-[0.3em] transition-all">{t[language].close}</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Management Dashboard */}
      {showProfileManagement && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-in fade-in duration-300">
          <div className={`w-full max-w-4xl h-[90vh] rounded-[3.5rem] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 ${darkMode ? 'bg-slate-900 border-2 border-slate-800 shadow-yellow-500/5' : 'bg-white shadow-2xl'}`}>
            <div className="p-10 pb-6 border-b border-slate-800/10 flex justify-between items-center"><h3 className="text-3xl font-bold uppercase">{t[language].profileTitle}</h3><button onClick={() => setShowProfileManagement(false)} className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 shadow-md"><X /></button></div>
            <div className="flex-grow overflow-y-auto p-10 space-y-12 scrollbar-hide">
              <section className="space-y-6">
                <h4 className="text-[10px] font-bold uppercase opacity-30 flex items-center gap-3"><User className="w-3 h-3" /> {t[language].sections.personal}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-8 rounded-[2.5rem] border-2 border-slate-800/5 ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}><p className="text-[10px] font-bold uppercase opacity-30 mb-2 tracking-widest">Legal Name</p><p className="font-bold text-lg">{t[language].profile.user}</p></div>
                  <div className={`p-8 rounded-[2.5rem] border-2 border-slate-800/5 ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}><p className="text-[10px] font-bold uppercase opacity-30 mb-2 tracking-widest">Verified Identity (IC)</p><p className="font-bold text-lg">{verifiedIC}</p></div>
                </div>
              </section>
            </div>
            <div className="p-10 border-t border-slate-800/10"><button onClick={() => setShowProfileManagement(false)} className="w-full py-6 rounded-[2rem] bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.3em] shadow-2xl">Close Dashboard</button></div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutUs && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg animate-in fade-in">
          <div className={`w-full max-w-lg rounded-[3rem] p-10 text-center shadow-2xl ${darkMode ? 'bg-slate-900 border-2 border-slate-800' : 'bg-white'}`}>
            <Info className="w-10 h-10 text-yellow-500 mx-auto mb-8" />
            <h3 className="text-3xl font-bold uppercase mb-6 tracking-tighter">{t[language].aboutUs}</h3>
            <p className="text-sm opacity-60 mb-10 leading-relaxed font-medium">{t[language].aboutDetail}</p>
            <button onClick={() => setShowAboutUs(false)} className={`w-full py-5 rounded-2xl bg-black text-white font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all shadow-xl`}>{t[language].close}</button>
          </div>
        </div>
      )}

      {/* Status Board */}
      {showStatusBoard && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg animate-in fade-in duration-300">
          <div className={`w-full max-w-2xl h-[80vh] rounded-[3.5rem] p-12 flex flex-col animate-in slide-in-from-bottom-8 ${darkMode ? 'bg-slate-900 border-2 border-slate-800 shadow-yellow-500/5' : 'bg-white shadow-2xl'}`}>
            <div className="flex justify-between items-center mb-12"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-black shadow-lg"><Clock className="w-6 h-6" /></div><h3 className="text-3xl font-bold uppercase tracking-tighter">{t[language].checkStatus}</h3></div><button onClick={() => setShowStatusBoard(false)} className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 shadow-md hover:rotate-90 transition-all"><X className="w-6 h-6" /></button></div>
            <div className="flex-grow overflow-y-auto space-y-6 scrollbar-hide pr-2">
              {[{ name: 'Kenyalang Gold Card', status: 'Approved', date: '04 Apr 2026', color: 'bg-green-500' }, { name: 'Bursari BP40', status: 'In Review', date: '02 Apr 2026', color: 'bg-yellow-500' }].map((app, i) => (
                <div key={i} className="p-8 rounded-[2.5rem] border-2 border-slate-800/5 flex justify-between items-center bg-slate-500/5 hover:bg-yellow-500/5 transition-colors"><div><p className="font-bold uppercase text-lg">{app.name}</p><p className="text-[10px] font-bold opacity-30 mt-1 uppercase tracking-[0.2em]">{app.date}</p></div><span className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase text-white shadow-md ${app.color}`}>{app.status}</span></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className={`mt-16 py-10 border-t ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="w-full md:max-w-[70%] mx-auto px-4 text-center">
          <button onClick={handleViewModeClick} className={`w-full mb-8 py-3 rounded-2xl bg-black text-white border border-slate-800 font-bold text-[10px] md:text-xs tracking-[0.4em] flex items-center justify-center gap-3 transition-all hover:border-yellow-500/50 ${isPulsing ? 'animate-pulse scale-[1.01]' : ''}`}>
             {heyMessage ? heyMessage : <><Eye className="w-4 h-4 text-yellow-500" /> {t[language].statusNote}</>}
          </button>
          <div className="flex items-center justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
            <button onClick={() => setShowAboutUs(true)} className="hover:text-yellow-500 transition-colors">{t[language].aboutUs}</button>
            <span className="opacity-20">•</span>
            <a href={privacyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-colors">{t[language].privacy}</a>
            <span className="opacity-20">•</span>
            <button onClick={triggerBugAnimation} className="hover:text-yellow-500 transition-colors">{t[language].reportBug}</button>
          </div>
          <p className="mt-6 text-[9px] md:text-[10px] opacity-20 uppercase font-medium tracking-[0.3em]">© 2026 Kenyalang Care. Sarawak Digital Initiative.</p>
        </div>
      </footer>

      {isReportingBug && (
        <div className="fixed inset-0 z-[70] pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute bottom-0 animate-bug-upward"><Bug className="w-24 h-24 text-yellow-500" /></div>
          <div className={`px-10 py-5 bg-black text-white rounded-full font-bold shadow-2xl animate-in zoom-in-50 border border-white/10`}>{t[language].bugThanks}</div>
        </div>
      )}

      <style>{`
        @keyframes bug-upward { 0% { transform: translateY(110vh); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-20vh); opacity: 0; } }
        .animate-bug-upward { animation: bug-upward 2.5s linear forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.3; } }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default App;