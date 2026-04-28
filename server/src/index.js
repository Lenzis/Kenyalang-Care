class KenyalangCare {
  constructor(id) {
    this.id = id;
    this.systemTag = "Kenyalang Care Official Portal";
  }
}

class AssistanceProgram extends KenyalangCare {
  constructor(id, titleEn, titleMs, iconKey) {
    super(id);
    this.title = { en: titleEn, ms: titleMs };
    this.iconKey = iconKey;
    this.items = []; 
  }

  addItems(itemsArray) {
    this.items = itemsArray;
  }

  // THE PARENT METHOD
  getEligibility() {
    return "Standard eligibility criteria for Sarawak residents apply.";
  }
}

// INHERITANCE (extends)
class StudentAid extends AssistanceProgram {
  constructor(id, titleEn, titleMs, iconKey) {
    super(id, titleEn, titleMs, iconKey);
    this.categoryType = "Student & Education";
  }

  // POLYMORPHISM (Overriding the parent method)
  getEligibility() {
    return "Must be a Sarawakian student enrolled in a recognized university.";
  }
}

class FinancialAid extends AssistanceProgram {
  constructor(id, titleEn, titleMs, iconKey) {
    super(id, titleEn, titleMs, iconKey);
    this.categoryType = "Financial Support";
  }

  // POLYMORPHISM (Overriding the parent method)
  getEligibility() {
    return "Must be a Sarawakian from the B40 or M40 income group.";
  }
}

app.get("/api/services", (_req, res) => {
  // 1. Fetch data procedurally (No Controller Class needed)
  const categories = db.prepare(`SELECT id, title_en, title_ms, icon_key FROM service_category ORDER BY sort_order ASC, id ASC`).all();
  const items = db.prepare(`SELECT id, category_id, label FROM service_item`).all();

  const itemsByCategory = new Map();
  for (const it of items) {
    const arr = itemsByCategory.get(it.category_id) ?? [];
    arr.push(it.label);
    itemsByCategory.set(it.category_id, arr);
  }

  // Instantiate your OOP Domain Models
  const programObjects = categories.map((c) => {
    let program;

    if (c.title_en.includes("student") || c.title_en.includes("Education")) {
      program = new StudentAid(c.id, c.title_en, c.title_ms, c.icon_key);
    } else if (c.title_en.includes("Financial") || c.title_en.includes("Loans")) {
      program = new FinancialAid(c.id, c.title_en, c.title_ms, c.icon_key);
    } else {
      program = new AssistanceProgram(c.id, c.title_en, c.title_ms, c.icon_key);
    }

    program.addItems(itemsByCategory.get(c.id) ?? []);
    
    // We attach the polymorphic result so the React frontend can see it!
    program.eligibilityRequirement = program.getEligibility();
    
    return program;
  });

  res.json(programObjects);
});