import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Moon, Sun, Globe, ClipboardCheck,
  ChevronRight, ChevronDown, BookOpen, 
  GraduationCap, Briefcase, Calculator, Building2, 
  Map, Droplets, Landmark, FileText, Heart, UtilityPole,
  Sparkles, Eye, Lock, X, MessageCircle, AlertTriangle, Bug
} from 'lucide-react';

const App = () => {
  // --- State Management ---
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' or 'ms'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [placeholderText, setPlaceholderText] = useState('');
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showServiceNotice, setShowServiceNotice] = useState(false);
  const [heyMessage, setHeyMessage] = useState(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isReportingBug, setIsReportingBug] = useState(false);

  // --- Translations ---
  const t = {
    en: {
      title: 'Kenyalang Care',
      checkStatus: 'Check Status',
      reportBug: 'Report a bug',
      bugThanks: 'Thanks! Bug squashed! 🛡️',
      statusNote: 'VIEW ONLY MODE • PHASE 1',
      statusDetail: 'Login and Sync features are currently disabled. Interactive status tracking will be available in Phase 2.',
      noResults: 'No exact matches found.',
      suggestions: 'Recommended for you',
      authRequired: 'Login Required',
      authDetail: 'To check your application status, please log in first to sync your profile. This feature is restricted in view-only mode.',
      serviceUnavailable: 'Service Not Available',
      serviceDetail: 'This service is currently in View Mode only. Interactive application forms and submissions will be enabled in the upcoming phases.',
      close: 'Close',
      heyReplies: ["Hey! I'm still in development!", "Phase 2 is coming soon! ✨", "Just looking? Nice!", "Sarawak Digital Future!", "Stay tuned! 🦅"],
      searchSuggestions: [
        'Search for scholarships',
        'Search for student aids',
        'Search for business trade',
        'Search for council services',
        'Search for land & agriculture',
        'Search for utilities'
      ]
    },
    ms: {
      title: 'Kenyalang Care',
      checkStatus: 'Semak Status',
      footer: '© 2026 Kerajaan Sarawak. Hak Cipta Terpelihara.',
      reportBug: 'Lapor pepijat',
      bugThanks: 'Terima kasih! Pepijat dihapuskan! 🛡️',
      statusNote: 'MOD PAPARAN SAHAJA • FASA 1',
      statusDetail: 'Fungsi Log Masuk dan Penyatuan (Sync) dinyahaktifkan. Semakan status akan tersedia pada Fasa 2.',
      noResults: 'Tiada padanan tepat dijumpai.',
      suggestions: 'Cadangan untuk anda',
      authRequired: 'Log Masuk Diperlukan',
      authDetail: 'Untuk menyemak status permohonan, sila log masuk terlebih dahulu. Fungsi ini dihadkan dalam mod paparan sahaja.',
      serviceUnavailable: 'Perkhidmatan Tidak Tersedia',
      serviceDetail: 'Perkhidmatan ini buat masa ini dalam Mod Paparan sahaja. Borang permohonan interaktif akan diaktifkan dalam fasa-fasa akan datang.',
      close: 'Tutup',
      heyReplies: ["Hai! Saya masih dalam pembinaan!", "Fasa 2 akan menyusul! ✨", "Cuci mata ke tu?", "Masa depan digital Sarawak!", "Tunggu kejutan kami! 🦅"],
      searchSuggestions: [
        'Cari biasiswa',
        'Cari bantuan pelajar',
        'Cari perdagangan bisnes',
        'Cari perkhidmatan majlis',
        'Cari tanah & pertanian',
        'Cari utiliti'
      ]
    }
  };

  // --- Data Structure ---
  const servicesData = [
    { id: 1, title: { en: "Aids / Bantuan for student", ms: "Bantuan Pelajar" }, icon: <GraduationCap className="w-8 h-8" />, items: ["Bantuan kewangan khas", "Laptop", "Book", "Free school transport", "School scholarship", "Tuition", "Uniform"] },
    { id: 2, title: { en: "Biasiswa", ms: "Scholarships" }, icon: <BookOpen className="w-8 h-8" />, items: ["Biasiswa yayasan sarawak tun taib", "Yayasan biasiswa Sarawak tunku Abdul rahman (YBSTAR)", "Biasiswa khas program perubatan unias", "Biasiswa tempatan yayasan sarawak", "Bantuan kemasukan ke IPT", "Bursari BP40", "Inisiatif Graduan Pulang Sarawak (i - GPS)"] },
    { id: 3, title: { en: "Pinjaman", ms: "Loans" }, icon: <Calculator className="w-8 h-8" />, items: ["Biasiswa pinjaman pelajaran dalam negara", "Pinjaman pelajaran luar negara", "Biasiswa pinjaman latihan teknikal"] },
    { id: 4, title: { en: "Program dan bantuan", ms: "Programs & Aid" }, icon: <Heart className="w-8 h-8" />, items: ["Biasiswa program pertukaran pelajaran", "Program pendidikan komuniti", "Program bantuan pakaian seragam sekolah", "Program HiPERS", "Perkhidmatan pengangkutan percuma", "Program tuisyen sekolah menengah", "Anugerah khas premier sarawak (AKPS)", "Program pemerkasaan Bahasa inggeris (EPP)", "Anugerah Graduan Cemerlang", "YS-JPNS Collaborations Programs"] },
    { id: 6, title: { en: "Bayaran balik pinjaman", ms: "Loan Repayment" }, icon: <FileText className="w-8 h-8" />, items: ["Kaedah Pembayaran", "Insentif Pembayaran"] },
    { id: 7, title: { en: "Hantar Keputusan / Laporan", ms: "Submit Results" }, icon: <FileText className="w-8 h-8" />, items: ["Form Penghantaran Keputusan Semester", "Laporan Prestasi Pengajian"] },
    { id: 8, title: { en: "Business Trade", ms: "Perdagangan Bisnes" }, icon: <Briefcase className="w-8 h-8" />, items: ["Application for permit to operate (telecommunications)", "Application for rooftop structure & in-building system", "Application for WayLeave", "Application to become panel hotel", "Application to become panel travel agent", "Apply for manufacturing permit", "eProcurement (Contractor & Supplier)", "Register with UPKJ", "Sarawak Micro Credit Scheme (SMCS)", "Sitting application for telecommunication tower", "Quotation and Tender Notices"] },
    { id: 9, title: { en: "Council Service", ms: "Perkhidmatan Majlis" }, icon: <Building2 className="w-8 h-8" />, items: ["Certificate of clearance of indebtedness", "Transfer of ownership of rateable holdings", "Withdrawal of caveat", "e-billing of assessment rates", "House numbering and referencing", "Payment of assessment rates by installment", "Rebate of assessment rates", "Remission of rates", "Update owner information"] },
    { id: 10, title: { en: "Education & Learning", ms: "Pendidikan & Pembelajaran" }, icon: <GraduationCap className="w-8 h-8" />, items: ["Apply for scholarships (State Govt)", "Purchase Sarawak hydrological year book", "Online request of hydrological data", "School leavers registration (SPEAK)", "Search of statues of Sarawak", "1 village 1 story photos", "Update school profile"] },
    { id: 11, title: { en: "Hydrology", ms: "Hidrologi" }, icon: <Droplets className="w-8 h-8" />, items: ["Purchase Sarawak hydrological year book (individual)", "Purchase Sarawak hydrological year book (organization)", "Online request of hydrological data (government agency/semi government agency)", "Online request of hydrological data (individuals)", "Online request of hydrological data (IPTA/IPTS)", "Online request of hydrological data (private agency/organization)"] },
    { id: 12, title: { en: "Land & Agriculture", ms: "Tanah & Pertanian" }, icon: <Map className="w-8 h-8" />, items: ["Permission to deal", "Rice and maize development", "Inland fisheries assistance", "Plantation crop division assistance", "Certificate of crop scheme", "SPBT Authentication", "Exchange of farm ownership", "TOL residential renewal", "Rock materials sales outside Sarawak", "TKPM Application"] },
    { id: 13, title: { en: "Licence & Permit", ms: "Lesen & Permit" }, icon: <FileText className="w-8 h-8" />, items: ["Change of Permanent Specialist", "EIA Consultant Registration", "SPA Qualified Person Renewal", "Carbon Storage Licence", "Switchboard Manufacturer Registration", "Water Supply Products Certification", "Endorsement of Wireman"] },
    { id: 14, title: { en: "Life Event", ms: "Acara Kehidupan" }, icon: <Heart className="w-8 h-8" />, items: ["Adat Marriage Pre-Registration", "Senior Citizen Health Benefit (SCHB)", "Apply Job with State Government", "Kenyalang Gold Card (KGC) Status", "Islamic Religious Enquiry", "Native Court Case Status", "Pre Marriage Course", "Faraq Nikah / Iddah Requests", "Tuntutan Fasakh / Harta Sepencarian"] },
    { id: 15, title: { en: "Social & Community", ms: "Sosial & Komuniti" }, icon: <Landmark className="w-8 h-8" />, items: ["Activate KGC", "Museum Tickets", "National Park Tickets", "Bantuan Ibu Bersalin (BIB)", "Bantuan Ihsan Kematian (BIK)", "Endowment Fund Sarawak (EFS)", "NGO Empowerment Grant", "Recognized as Sarawak Natives"] },
    { id: 16, title: { en: "Utilities", ms: "Utiliti" }, icon: <UtilityPole className="w-8 h-8" />, items: ["Gas Piping Installation (ATI/ATO)", "Gas Competency Certificate", "New Water Supply Connection", "Water Bill Installments", "Rural Electrification (BELB)", "Lampu Jalan Kampung (LJK)", "Pipe Fitter License"] }
  ];

  // --- Effects ---
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Looping Placeholder Animation
  useEffect(() => {
    const suggestions = t[language].searchSuggestions;
    let phraseIdx = 0;
    let dotIdx = 0;
    let isWaiting = false;

    const interval = setInterval(() => {
      if (isWaiting) {
        dotIdx = (dotIdx + 1) % 4;
        setPlaceholderText(`${suggestions[phraseIdx]}${'.'.repeat(dotIdx)}`);
        if (dotIdx === 3) {
          setTimeout(() => {
            phraseIdx = (phraseIdx + 1) % suggestions.length;
          }, 800);
        }
      } else {
        setPlaceholderText(suggestions[phraseIdx]);
        isWaiting = true;
      }
    }, 500);

    return () => clearInterval(interval);
  }, [language]);

  // --- Search Filtering ---
  const filteredServices = useMemo(() => {
    if (!searchQuery) return servicesData;
    const query = searchQuery.toLowerCase();
    const matched = servicesData.filter(cat => 
      cat.title[language].toLowerCase().includes(query) || 
      cat.items.some(item => item.toLowerCase().includes(query))
    );
    return matched.length > 0 ? matched : servicesData.slice(0, 3);
  }, [searchQuery, language]);

  const hasNoResults = useMemo(() => {
    if (!searchQuery) return false;
    const query = searchQuery.toLowerCase();
    return !servicesData.some(cat => 
      cat.title[language].toLowerCase().includes(query) || 
      cat.items.some(item => item.toLowerCase().includes(query))
    );
  }, [searchQuery, language]);

  // --- Handlers ---
  const toggleCategory = (id) => {
    setExpandedCategoryId(expandedCategoryId === id ? null : id);
  };

  const handleViewModeClick = () => {
    const replies = t[language].heyReplies;
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    setHeyMessage(randomReply);
    setIsPulsing(true);
    setTimeout(() => {
      setHeyMessage(null);
      setIsPulsing(false);
    }, 2500);
  };

  const handleServiceItemClick = (e) => {
    e.stopPropagation();
    setShowServiceNotice(true);
  };

  const triggerBugAnimation = () => {
    if (isReportingBug) return;
    setIsReportingBug(true);
    setTimeout(() => {
      setIsReportingBug(false);
    }, 2500);
  };

  return (
    <div className={`min-h-screen transition-colors duration-100 ${darkMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-100 ${
        darkMode 
          ? 'bg-slate-900/95 border-slate-800 shadow-lg' 
          : 'bg-white/95 border-slate-200 shadow-sm'
      }`}>
        <div className="w-full px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setSearchQuery(''); setExpandedCategoryId(null);}}>
            <h1 className={`font-bold text-xl md:text-2xl tracking-tight transition-colors duration-100 ${darkMode ? 'text-white' : 'text-black'}`}>
              KENYALANG
              <span className="text-yellow-500"> CARE</span>
            </h1>
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            <button 
              onClick={() => setShowLoginAlert(true)}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 text-sm font-semibold transition-all duration-100 ${
                darkMode ? 'border-yellow-400/30 text-yellow-500 hover:bg-yellow-600/10' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span className="hidden md:inline">{t[language].checkStatus}</span>
            </button>
            <div className={`w-px h-6 mx-1 transition-colors duration-100 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
            <button onClick={() => setLanguage(l => l === 'en' ? 'ms' : 'en')} className={`p-2 rounded-lg transition-all duration-100 flex items-center gap-1 text-xs font-semibold ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
              <Globe className="w-4 h-4" />
              <span className="uppercase">{language}</span>
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg transition-all duration-100 ${darkMode ? 'hover:bg-slate-800 text-yellow-500' : 'hover:bg-slate-100 text-slate-600'}`}>
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="w-full md:max-w-[70%] mx-auto px-4 py-8 md:py-12">
        {/* Search Bar */}
        <div className="mb-8 md:mb-12">
          <div className="relative w-full mx-auto group">
            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-100 ${darkMode ? 'text-yellow-600 group-focus-within:text-yellow-500' : 'text-slate-400 group-focus-within:text-black'}`} />
            <input 
              type="text"
              placeholder={placeholderText}
              className={`w-full pl-14 pr-6 py-5 md:py-6 rounded-2xl border-2 transition-all duration-100 outline-none font-semibold text-lg md:text-xl shadow-xl ${
                darkMode 
                  ? 'bg-slate-900 border-slate-800 focus:border-yellow-600 text-white placeholder-slate-700' 
                  : 'bg-white border-slate-200 focus:border-black text-slate-900 placeholder-slate-400'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Suggestion Notification */}
        {hasNoResults && (
          <div className="mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className={`p-2 rounded-lg transition-colors duration-100 ${darkMode ? 'bg-yellow-600/20 text-yellow-500' : 'bg-slate-900 text-white'}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-[10px] opacity-50 uppercase tracking-[0.2em] leading-none mb-1 transition-opacity duration-100">{t[language].noResults}</p>
              <p className="font-bold text-lg md:text-xl uppercase tracking-tight transition-colors duration-100">{t[language].suggestions}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 md:gap-4">
          {filteredServices.map((cat) => (
            <div 
              key={cat.id}
              className={`group overflow-hidden rounded-3xl border-[2px] md:border-[3px] transition-all duration-100 ${
                expandedCategoryId === cat.id
                  ? (darkMode ? 'border-yellow-600 bg-slate-900 shadow-[0_0_25px_rgba(202,138,4,0.1)]' : 'border-black bg-white shadow-xl')
                  : (darkMode ? 'border-slate-800 bg-slate-900/50 hover:border-yellow-600/50' : 'border-slate-200 bg-white hover:border-black shadow-sm')
              }`}
            >
              <div onClick={() => toggleCategory(cat.id)} className="p-5 md:p-6 cursor-pointer flex items-center gap-4 md:gap-6 active:scale-[0.99] transition-transform">
                <div className={`w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  expandedCategoryId === cat.id
                    ? (darkMode ? 'bg-yellow-600 text-white shadow-[0_0_15px_rgba(202,138,4,0.4)]' : 'bg-black text-white')
                    : (darkMode ? 'bg-slate-800 text-yellow-600/60' : 'bg-slate-100 text-black/40 group-hover:bg-slate-200 group-hover:text-black/80')
                }`}>
                  <div className={`transition-transform duration-300 ${expandedCategoryId === cat.id ? 'scale-100' : 'scale-80 opacity-60'}`}>
                    {cat.icon}
                  </div>
                </div>
                <div className="flex-grow transition-colors duration-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg md:text-2xl uppercase tracking-tight leading-tight">{cat.title[language]}</h3>
                    {expandedCategoryId === cat.id 
                      ? <ChevronDown className={`w-6 h-6 md:w-8 md:h-8 transition-colors duration-100 ${darkMode ? 'text-yellow-600' : 'text-black'}`} /> 
                      : <ChevronRight className={`w-6 h-6 md:w-8 md:h-8 opacity-20 group-hover:opacity-100 transition-all duration-100 ${darkMode ? 'text-yellow-600' : 'text-black'}`} />
                    }
                  </div>
                  <p className={`text-[10px] md:text-xs font-medium opacity-40 uppercase tracking-[0.15em] mt-0.5 transition-opacity duration-100`}>
                    {cat.items.length} Services Available
                  </p>
                </div>
              </div>
              {expandedCategoryId === cat.id && (
                <div className={`px-5 pb-5 md:px-6 md:pb-6 animate-in slide-in-from-top-2 duration-150 border-t transition-colors duration-100 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    {cat.items.map((item, idx) => (
                      <div 
                        key={idx} 
                        onClick={handleServiceItemClick}
                        className={`flex items-center gap-3 p-3.5 md:p-4 rounded-xl font-semibold text-sm md:text-lg transition-all duration-100 cursor-pointer group/item ${
                          darkMode ? 'hover:bg-yellow-600 hover:text-white bg-slate-800/40 text-yellow-500/80' : 'hover:bg-black hover:text-white bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className={`w-2 h-2 flex-shrink-0 rounded-full transition-all duration-100 group-hover/item:scale-150 ${darkMode ? 'bg-yellow-600 group-hover/item:bg-white' : 'bg-black group-hover/item:bg-white'}`}></div>
                        <span className="leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-20 py-12 border-t transition-colors duration-100 ${darkMode ? 'bg-black border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="w-full md:max-w-[70%] mx-auto px-4 text-center">
          <div className="relative mb-10 group">
            {heyMessage && (
              <div className="absolute left-1/2 -top-12 -translate-x-1/2 animate-in slide-in-from-bottom-4 zoom-in-95 duration-300 pointer-events-none z-10">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-2xl font-bold text-sm whitespace-nowrap transition-colors duration-100 ${darkMode ? 'bg-yellow-600 text-white' : 'bg-black text-white'}`}>
                  <MessageCircle className="w-4 h-4 animate-bounce" />
                  {heyMessage}
                </div>
                <div className={`w-3 h-3 rotate-45 mx-auto -mt-1.5 transition-colors duration-100 ${darkMode ? 'bg-yellow-600' : 'bg-black'}`}></div>
              </div>
            )}
            <button 
              onClick={handleViewModeClick}
              className={`w-full bg-black text-white px-6 py-3 rounded-2xl font-bold text-xs md:text-sm tracking-[0.3em] flex items-center justify-center gap-3 shadow-lg border border-slate-800 transition-all duration-100 active:scale-[0.98] hover:border-slate-600 ${isPulsing ? 'animate-pulse border-yellow-600 scale-[1.01]' : ''}`}
            >
              <Eye className={`w-4 h-4 transition-transform duration-100 ${isPulsing ? 'scale-125 rotate-12' : ''} ${darkMode ? 'text-yellow-600' : 'text-slate-400'}`} />
              {t[language].statusNote}
            </button>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            <div className="w-10 h-1 bg-red-600 rounded-l-full opacity-30"></div>
            <div className="w-10 h-1 bg-black border border-slate-800 opacity-30"></div>
            <div className={`w-10 h-1 transition-colors duration-100 bg-yellow-500 rounded-r-full opacity-30`}></div>
          </div>
          <p className="text-[10px] md:text-xs font-medium uppercase tracking-[0.15em] opacity-30 max-w-lg mx-auto mb-4 leading-relaxed transition-opacity duration-100">
            {t[language].statusDetail}
          </p>
          
          <div className="flex items-center justify-center transition-opacity duration-100">
            <button 
              onClick={triggerBugAnimation}
              className={`text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] hover:underline cursor-pointer flex items-center gap-1.5 opacity-40 hover:opacity-100 ${darkMode ? 'text-yellow-500' : 'text-black'}`}
            >
              <Bug className={`w-3 h-3 ${isReportingBug ? 'animate-spin' : ''}`} />
              {t[language].reportBug}
            </button>
          </div>
        </div>
      </footer>

      {/* Bug Report Animation Overlay - UPDATED TO BOTTOM-TO-TOP ANIMATION */}
      {isReportingBug && (
        <div className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center overflow-hidden">
          <div className={`absolute left-1/2 -translate-x-1/2 bottom-0`}>
             <div className={`animate-[bug-upward_2.5s_linear_forwards] ${darkMode ? 'text-yellow-500' : 'text-black'}`}>
               <Bug className="w-16 h-16" />
             </div>
          </div>
          <div className={`px-8 py-4 rounded-full shadow-2xl font-bold text-lg animate-in zoom-in-50 fade-in duration-500 ${darkMode ? 'bg-yellow-500 text-black' : 'bg-black text-white'}`}>
            {t[language].bugThanks}
          </div>
        </div>
      )}

      {/* Login Required Alert */}
      {showLoginAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-sm rounded-[2rem] p-8 relative animate-in zoom-in-95 duration-200 transition-colors duration-100 ${darkMode ? 'bg-slate-900 text-white border-2 border-yellow-600/20 shadow-[0_0_50px_rgba(202,138,4,0.1)]' : 'bg-white text-slate-900 shadow-2xl'}`}>
            <button onClick={() => setShowLoginAlert(false)} className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-opacity duration-100">
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors duration-100 ${darkMode ? 'bg-yellow-600/10 text-yellow-600' : 'bg-red-50 text-red-600'}`}>
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight transition-colors duration-100">{t[language].authRequired}</h3>
              <p className="text-sm opacity-60 mb-8 leading-relaxed transition-opacity duration-100">
                {t[language].authDetail}
              </p>
              <button 
                onClick={() => setShowLoginAlert(false)}
                className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider transition-all duration-100 ${
                  darkMode ? 'bg-yellow-600 text-white hover:bg-yellow-500' : 'bg-black text-white hover:bg-slate-800'
                }`}
              >
                {t[language].close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Item Notice */}
      {showServiceNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-sm rounded-[2rem] p-8 relative animate-in zoom-in-95 duration-200 transition-colors duration-100 ${darkMode ? 'bg-slate-900 text-white border-2 border-yellow-600/20 shadow-[0_0_50px_rgba(202,138,4,0.1)]' : 'bg-white text-slate-900 shadow-2xl'}`}>
            <button onClick={() => setShowServiceNotice(false)} className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-opacity duration-100">
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors duration-100 ${darkMode ? 'bg-yellow-600/10 text-yellow-600' : 'bg-red-50 text-red-600'}`}>
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight transition-colors duration-100">{t[language].serviceUnavailable}</h3>
              <p className="text-sm opacity-60 mb-8 leading-relaxed transition-opacity duration-100">
                {t[language].serviceDetail}
              </p>
              <button 
                onClick={() => setShowServiceNotice(false)}
                className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider transition-all duration-100 ${
                  darkMode ? 'bg-yellow-600 text-white hover:bg-yellow-500' : 'bg-black text-white hover:bg-slate-800'
                }`}
              >
                {t[language].close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for the scurrying bug - UPDATED TO UPWARD MOTION */}
      <style>{`
        @keyframes bug-upward {
          0% { transform: translateY(110vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-20vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default App;