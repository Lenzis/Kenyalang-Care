import fs from "node:fs";
import path from "node:path";
import { openDb } from "./db.js";

function readSql(relPath) {
  const abs = path.resolve(process.cwd(), relPath);
  return fs.readFileSync(abs, "utf8");
}

const db = openDb();
db.exec(readSql("./src/schema.sql"));

const insertCategory = db.prepare(
  `INSERT INTO service_category (id, title_en, title_ms, icon_key, sort_order)
   VALUES (@id, @title_en, @title_ms, @icon_key, @sort_order)
   ON CONFLICT(id) DO UPDATE SET
     title_en=excluded.title_en,
     title_ms=excluded.title_ms,
     icon_key=excluded.icon_key,
     sort_order=excluded.sort_order`
);

const insertItem = db.prepare(
  `INSERT INTO service_item (category_id, label, sort_order)
   VALUES (@category_id, @label, @sort_order)`
);

db.transaction(() => {
  // Re-seed safely (simple approach).
  db.exec("DELETE FROM service_item;");
  db.exec("DELETE FROM service_category;");

  const categories = [
    { id: 1, title_en: "Aids / Bantuan for student", title_ms: "Bantuan Pelajar", icon_key: "GraduationCap", sort_order: 1 },
    { id: 2, title_en: "Biasiswa", title_ms: "Scholarships", icon_key: "BookOpen", sort_order: 2 },
    { id: 3, title_en: "Pinjaman", title_ms: "Loans", icon_key: "Calculator", sort_order: 3 },
    { id: 4, title_en: "Program dan bantuan", title_ms: "Programs & Aid", icon_key: "Heart", sort_order: 4 },
    { id: 6, title_en: "Bayaran balik pinjaman", title_ms: "Loan Repayment", icon_key: "FileText", sort_order: 6 },
    { id: 7, title_en: "Hantar Keputusan / Laporan", title_ms: "Submit Results", icon_key: "FileText", sort_order: 7 },
    { id: 8, title_en: "Business Trade", title_ms: "Perdagangan Bisnes", icon_key: "Briefcase", sort_order: 8 },
    { id: 9, title_en: "Council Service", title_ms: "Perkhidmatan Majlis", icon_key: "Building2", sort_order: 9 },
    { id: 10, title_en: "Education & Learning", title_ms: "Pendidikan & Pembelajaran", icon_key: "GraduationCap", sort_order: 10 },
    { id: 11, title_en: "Hydrology", title_ms: "Hidrologi", icon_key: "Droplets", sort_order: 11 },
    { id: 12, title_en: "Land & Agriculture", title_ms: "Tanah & Pertanian", icon_key: "Map", sort_order: 12 },
    { id: 13, title_en: "Licence & Permit", title_ms: "Lesen & Permit", icon_key: "FileText", sort_order: 13 },
    { id: 14, title_en: "Life Event", title_ms: "Acara Kehidupan", icon_key: "Heart", sort_order: 14 },
    { id: 15, title_en: "Social & Community", title_ms: "Sosial & Komuniti", icon_key: "Landmark", sort_order: 15 },
    { id: 16, title_en: "Utilities", title_ms: "Utiliti", icon_key: "UtilityPole", sort_order: 16 }
  ];

  for (const c of categories) insertCategory.run(c);

  const itemsByCategory = {
    1: ["Bantuan kewangan khas", "Laptop", "Book", "Free school transport", "School scholarship", "Tuition", "Uniform"],
    2: [
      "Biasiswa yayasan sarawak tun taib",
      "Yayasan biasiswa Sarawak tunku Abdul rahman (YBSTAR)",
      "Biasiswa khas program perubatan unias",
      "Biasiswa tempatan yayasan sarawak",
      "Bantuan kemasukan ke IPT",
      "Bursari BP40",
      "Inisiatif Graduan Pulang Sarawak (i - GPS)"
    ],
    3: ["Biasiswa pinjaman pelajaran dalam negara", "Pinjaman pelajaran luar negara", "Biasiswa pinjaman latihan teknikal"],
    4: [
      "Biasiswa program pertukaran pelajaran",
      "Program pendidikan komuniti",
      "Program bantuan pakaian seragam sekolah",
      "Program HiPERS",
      "Perkhidmatan pengangkutan percuma",
      "Program tuisyen sekolah menengah",
      "Anugerah khas premier sarawak (AKPS)",
      "Program pemerkasaan Bahasa inggeris (EPP)",
      "Anugerah Graduan Cemerlang",
      "YS-JPNS Collaborations Programs"
    ],
    6: ["Kaedah Pembayaran", "Insentif Pembayaran"],
    7: ["Form Penghantaran Keputusan Semester", "Laporan Prestasi Pengajian"],
    8: [
      "Application for permit to operate (telecommunications)",
      "Application for rooftop structure & in-building system",
      "Application for WayLeave",
      "Application to become panel hotel",
      "Application to become panel travel agent",
      "Apply for manufacturing permit",
      "eProcurement (Contractor & Supplier)",
      "Register with UPKJ",
      "Sarawak Micro Credit Scheme (SMCS)",
      "Sitting application for telecommunication tower",
      "Quotation and Tender Notices"
    ],
    9: [
      "Certificate of clearance of indebtedness",
      "Transfer of ownership of rateable holdings",
      "Withdrawal of caveat",
      "e-billing of assessment rates",
      "House numbering and referencing",
      "Payment of assessment rates by installment",
      "Rebate of assessment rates",
      "Remission of rates",
      "Update owner information"
    ],
    10: [
      "Apply for scholarships (State Govt)",
      "Purchase Sarawak hydrological year book",
      "Online request of hydrological data",
      "School leavers registration (SPEAK)",
      "Search of statues of Sarawak",
      "1 village 1 story photos",
      "Update school profile"
    ],
    11: [
      "Purchase Sarawak hydrological year book (individual)",
      "Purchase Sarawak hydrological year book (organization)",
      "Online request of hydrological data (government agency/semi government agency)",
      "Online request of hydrological data (individuals)",
      "Online request of hydrological data (IPTA/IPTS)",
      "Online request of hydrological data (private agency/organization)"
    ],
    12: [
      "Permission to deal",
      "Rice and maize development",
      "Inland fisheries assistance",
      "Plantation crop division assistance",
      "Certificate of crop scheme",
      "SPBT Authentication",
      "Exchange of farm ownership",
      "TOL residential renewal",
      "Rock materials sales outside Sarawak",
      "TKPM Application"
    ],
    13: [
      "Change of Permanent Specialist",
      "EIA Consultant Registration",
      "SPA Qualified Person Renewal",
      "Carbon Storage Licence",
      "Switchboard Manufacturer Registration",
      "Water Supply Products Certification",
      "Endorsement of Wireman"
    ],
    14: [
      "Adat Marriage Pre-Registration",
      "Senior Citizen Health Benefit (SCHB)",
      "Apply Job with State Government",
      "Kenyalang Gold Card (KGC) Status",
      "Islamic Religious Enquiry",
      "Native Court Case Status",
      "Pre Marriage Course",
      "Faraq Nikah / Iddah Requests",
      "Tuntutan Fasakh / Harta Sepencarian"
    ],
    15: [
      "Activate KGC",
      "Museum Tickets",
      "National Park Tickets",
      "Bantuan Ibu Bersalin (BIB)",
      "Bantuan Ihsan Kematian (BIK)",
      "Endowment Fund Sarawak (EFS)",
      "NGO Empowerment Grant",
      "Recognized as Sarawak Natives"
    ],
    16: [
      "Gas Piping Installation (ATI/ATO)",
      "Gas Competency Certificate",
      "New Water Supply Connection",
      "Water Bill Installments",
      "Rural Electrification (BELB)",
      "Lampu Jalan Kampung (LJK)",
      "Pipe Fitter License"
    ]
  };

  for (const [categoryIdStr, labels] of Object.entries(itemsByCategory)) {
    const category_id = Number(categoryIdStr);
    labels.forEach((label, idx) => insertItem.run({ category_id, label, sort_order: idx + 1 }));
  }
})();

const countCategories = db.prepare("SELECT COUNT(*) AS n FROM service_category").get().n;
const countItems = db.prepare("SELECT COUNT(*) AS n FROM service_item").get().n;

console.log(`Seed complete. Categories: ${countCategories}, Items: ${countItems}`);
db.close();

