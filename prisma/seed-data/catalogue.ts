// SAMPLE catalogue for development & demo. Replace with the company's approved product list
// (Admin → Products, or edit this file and re-run `npm run db:seed`).
// Indications are intentionally left empty — add only company-approved text.

export const DOSAGE_FORMS = [
  { name: "Tablets", slug: "tablets", icon: "tablets" },
  { name: "Capsules", slug: "capsules", icon: "pill" },
  { name: "Syrups", slug: "syrups", icon: "bottle" },
  { name: "Injections", slug: "injections", icon: "syringe" },
  { name: "Dry Syrups", slug: "dry-syrups", icon: "beaker" },
  { name: "Suspensions", slug: "suspensions", icon: "flask" },
  { name: "Creams", slug: "creams", icon: "droplet" },
  { name: "Ointments", slug: "ointments", icon: "droplets" },
  { name: "Eye/Ear Drops", slug: "eye-ear-drops", icon: "eye" },
];

export const RANGES = [
  { name: "Nutraceuticals", slug: "nutraceuticals", icon: "leaf" },
  { name: "Pediatric", slug: "pediatric", icon: "baby" },
  { name: "Gynecology", slug: "gynecology", icon: "venus" },
  { name: "Cardiac & Diabetic", slug: "cardiac-diabetic", icon: "heart" },
  { name: "Derma", slug: "derma", icon: "sparkles" },
  { name: "Respiratory", slug: "respiratory", icon: "wind" },
  { name: "General Range", slug: "general-range", icon: "stethoscope" },
];

export const THERAPEUTIC_AREAS = [
  { name: "Cardiology", slug: "cardiology", icon: "heart", description: "Antihypertensives, lipid-lowering agents and cardiovascular support formulations for physician and cardiologist prescriptions." },
  { name: "Diabetology", slug: "diabetology", icon: "droplet", description: "Oral anti-diabetic combinations and supportive formulations for diabetes management portfolios." },
  { name: "Dermatology", slug: "dermatology", icon: "sparkles", description: "Topical antifungals, antibacterials and derma-care products for dermatology practices." },
  { name: "Gynecology", slug: "gynecology", icon: "venus", description: "Hematinics, hormonal support and women's-health formulations for gynaecologists and maternity care." },
  { name: "Pediatrics", slug: "pediatrics", icon: "baby", description: "Child-friendly syrups, dry syrups and suspensions in palatable flavours and paediatric strengths." },
  { name: "Orthopedics", slug: "orthopedics", icon: "bone", description: "Analgesic, anti-inflammatory and bone-health formulations for orthopaedic and pain-management practices." },
  { name: "Gastroenterology", slug: "gastroenterology", icon: "gut", description: "Acid-peptic, anti-emetic and digestive-care formulations across tablets, capsules and suspensions." },
  { name: "Respiratory", slug: "respiratory", icon: "wind", description: "Cough, cold and anti-allergic formulations for general physicians, chest physicians and paediatricians." },
  { name: "Neurology", slug: "neurology", icon: "brain", description: "Neuropathic-care and neuro-vitamin formulations for neurologists and general physicians." },
  { name: "General Medicine", slug: "general-medicine", icon: "stethoscope", description: "Everyday anti-infectives, analgesics and antipyretics that form the backbone of any GP portfolio." },
  { name: "Nutraceuticals", slug: "nutraceuticals", icon: "leaf", description: "Vitamins, minerals, protein and wellness supplements for preventive and supportive care." },
  { name: "Ophthalmology", slug: "ophthalmology", icon: "eye", description: "Sterile eye drops including lubricants and anti-infectives for ophthalmic practice." },
];

type P = { brand: string; composition: string; form: string; range: string; area: string; type?: string; pack: string; strengths?: string; featured?: boolean };

export const PRODUCTS: P[] = [
  // Tablets
  { brand: "Dolplus 650", composition: "Paracetamol 650 mg", form: "tablets", range: "general-range", area: "general-medicine", pack: "10 × 15 Tablets (Blister)", strengths: "500 mg, 650 mg", featured: true },
  { brand: "Aceplus-P", composition: "Aceclofenac 100 mg + Paracetamol 325 mg", form: "tablets", range: "general-range", area: "orthopedics", pack: "10 × 10 Tablets (Alu-Alu)" },
  { brand: "Aceplus-SP", composition: "Aceclofenac 100 mg + Paracetamol 325 mg + Serratiopeptidase 15 mg", form: "tablets", range: "general-range", area: "orthopedics", pack: "10 × 10 Tablets (Alu-Alu)", featured: true },
  { brand: "Pantoplus 40", composition: "Pantoprazole 40 mg (Enteric-coated)", form: "tablets", range: "general-range", area: "gastroenterology", pack: "10 × 10 Tablets (Alu-Alu)", strengths: "20 mg, 40 mg" },
  { brand: "Telplus 40", composition: "Telmisartan 40 mg", form: "tablets", range: "cardiac-diabetic", area: "cardiology", pack: "10 × 10 Tablets (Alu-Alu)", strengths: "20 mg, 40 mg, 80 mg" },
  { brand: "Telplus-AM", composition: "Telmisartan 40 mg + Amlodipine 5 mg", form: "tablets", range: "cardiac-diabetic", area: "cardiology", pack: "10 × 10 Tablets (Alu-Alu)", featured: true },
  { brand: "Atorplus 10", composition: "Atorvastatin 10 mg", form: "tablets", range: "cardiac-diabetic", area: "cardiology", pack: "10 × 10 Tablets (Alu-Alu)", strengths: "10 mg, 20 mg, 40 mg" },
  { brand: "Glimplus-M1", composition: "Glimepiride 1 mg + Metformin 500 mg (SR)", form: "tablets", range: "cardiac-diabetic", area: "diabetology", pack: "10 × 15 Tablets (Blister)", strengths: "M1, M2", featured: true },
  { brand: "Vildaplus-M", composition: "Vildagliptin 50 mg + Metformin 500 mg", form: "tablets", range: "cardiac-diabetic", area: "diabetology", pack: "10 × 15 Tablets (Alu-Alu)", strengths: "50/500 mg, 50/1000 mg" },
  { brand: "Cefiplus 200", composition: "Cefixime 200 mg", form: "tablets", range: "general-range", area: "general-medicine", pack: "10 × 10 Tablets (Alu-Alu)" },
  { brand: "Azeeplus 500", composition: "Azithromycin 500 mg", form: "tablets", range: "respiratory", area: "general-medicine", pack: "10 × 3 Tablets (Alu-Alu)", strengths: "250 mg, 500 mg" },
  { brand: "Monplus-LC", composition: "Montelukast 10 mg + Levocetirizine 5 mg", form: "tablets", range: "respiratory", area: "respiratory", pack: "10 × 10 Tablets (Alu-Alu)", featured: true },
  { brand: "Ferroplus-XT", composition: "Ferrous Ascorbate eq. to Elemental Iron 100 mg + Folic Acid 1.5 mg", form: "tablets", range: "gynecology", area: "gynecology", pack: "10 × 10 Tablets (Alu-Alu)" },
  { brand: "Mefplus-D", composition: "Mefenamic Acid 250 mg + Dicyclomine 10 mg", form: "tablets", range: "gynecology", area: "gynecology", pack: "10 × 10 Tablets (Blister)" },
  { brand: "Progeplus 200", composition: "Progesterone 200 mg (SR)", form: "tablets", range: "gynecology", area: "gynecology", pack: "10 × 10 Tablets (Alu-Alu)" },
  { brand: "Ondaplus MD", composition: "Ondansetron 4 mg (Mouth Dissolving)", form: "tablets", range: "general-range", area: "gastroenterology", pack: "10 × 10 Tablets (Alu-Alu)" },
  { brand: "Calplus-CZ", composition: "Calcium Citrate 1000 mg + Vitamin D3 200 IU + Magnesium 100 mg + Zinc 4 mg", form: "tablets", range: "nutraceuticals", area: "orthopedics", type: "Nutraceutical", pack: "10 × 15 Tablets (Blister)" },
  { brand: "Biotiplus", composition: "Biotin 10 mg with Multivitamins & Minerals", form: "tablets", range: "derma", area: "dermatology", type: "Nutraceutical", pack: "10 × 10 Tablets (Alu-Alu)" },
  { brand: "Inosiplus", composition: "Myo-Inositol 1000 mg + D-Chiro-Inositol 25 mg + Folic Acid 200 mcg", form: "tablets", range: "gynecology", area: "gynecology", type: "Nutraceutical", pack: "10 × 10 Tablets (Alu-Alu)" },
  // Capsules
  { brand: "Omeplus 20", composition: "Omeprazole 20 mg", form: "capsules", range: "general-range", area: "gastroenterology", pack: "10 × 10 Capsules (Alu-Alu)" },
  { brand: "Pantoplus-DSR", composition: "Pantoprazole 40 mg + Domperidone 30 mg (SR)", form: "capsules", range: "general-range", area: "gastroenterology", pack: "10 × 10 Capsules (Alu-Alu)", featured: true },
  { brand: "Rabiplus-DSR", composition: "Rabeprazole 20 mg + Domperidone 30 mg (SR)", form: "capsules", range: "general-range", area: "gastroenterology", pack: "10 × 10 Capsules (Alu-Alu)" },
  { brand: "Amoxplus 500", composition: "Amoxicillin 500 mg", form: "capsules", range: "general-range", area: "general-medicine", pack: "10 × 10 Capsules (Blister)", strengths: "250 mg, 500 mg" },
  { brand: "Pregaplus-M", composition: "Pregabalin 75 mg + Methylcobalamin 750 mcg", form: "capsules", range: "general-range", area: "neurology", pack: "10 × 10 Capsules (Alu-Alu)" },
  { brand: "Vitaplus Gold", composition: "Multivitamin, Multimineral & Antioxidant Softgel", form: "capsules", range: "nutraceuticals", area: "nutraceuticals", type: "Nutraceutical", pack: "10 × 10 Softgels (Blister)" },
  // Syrups
  { brand: "Ambroplus-LS", composition: "Ambroxol 30 mg + Levosalbutamol 1 mg + Guaifenesin 50 mg per 5 ml", form: "syrups", range: "respiratory", area: "respiratory", pack: "100 ml Bottle", featured: true },
  { brand: "Lysiplus", composition: "L-Lysine with Multivitamin Syrup", form: "syrups", range: "pediatric", area: "pediatrics", type: "Nutraceutical", pack: "200 ml Bottle" },
  { brand: "Cyproplus", composition: "Cyproheptadine 2 mg + Tricholine Citrate 275 mg per 5 ml", form: "syrups", range: "pediatric", area: "pediatrics", pack: "200 ml Bottle" },
  { brand: "Ferroplus Syrup", composition: "Ferric Ammonium Citrate 160 mg + Folic Acid 0.5 mg + Cyanocobalamin 7.5 mcg per 15 ml", form: "syrups", range: "gynecology", area: "gynecology", pack: "200 ml Bottle" },
  // Suspensions
  { brand: "Dolplus Kid", composition: "Paracetamol 250 mg per 5 ml", form: "suspensions", range: "pediatric", area: "pediatrics", pack: "60 ml Bottle", strengths: "125 mg/5 ml, 250 mg/5 ml" },
  { brand: "Sucraplus-O", composition: "Sucralfate 1 g + Oxetacaine 20 mg per 10 ml", form: "suspensions", range: "general-range", area: "gastroenterology", pack: "200 ml Bottle" },
  { brand: "Magplus", composition: "Magaldrate 480 mg + Simethicone 20 mg per 5 ml", form: "suspensions", range: "general-range", area: "gastroenterology", type: "OTC", pack: "170 ml Bottle" },
  // Dry syrups
  { brand: "Cefiplus DS", composition: "Cefixime 50 mg per 5 ml", form: "dry-syrups", range: "pediatric", area: "pediatrics", pack: "30 ml Bottle with Water for Reconstitution", strengths: "50 mg/5 ml, 100 mg/5 ml" },
  { brand: "Amoxplus-CV DS", composition: "Amoxicillin 200 mg + Clavulanic Acid 28.5 mg per 5 ml", form: "dry-syrups", range: "pediatric", area: "pediatrics", pack: "30 ml Bottle" },
  { brand: "Azeeplus DS", composition: "Azithromycin 200 mg per 5 ml", form: "dry-syrups", range: "pediatric", area: "pediatrics", pack: "15 ml Bottle" },
  // Injections
  { brand: "Ceftriplus 1 g", composition: "Ceftriaxone 1 g", form: "injections", range: "general-range", area: "general-medicine", pack: "Vial with Water for Injection", strengths: "250 mg, 500 mg, 1 g" },
  { brand: "Pantoplus IV", composition: "Pantoprazole 40 mg", form: "injections", range: "general-range", area: "gastroenterology", pack: "Vial with Diluent" },
  { brand: "Dicloplus AQ", composition: "Diclofenac Sodium 75 mg per ml", form: "injections", range: "general-range", area: "orthopedics", pack: "1 ml Ampoule × 5" },
  { brand: "Mecoplus Inj", composition: "Methylcobalamin 500 mcg", form: "injections", range: "general-range", area: "neurology", pack: "1 ml Ampoule × 5" },
  // Creams / ointments
  { brand: "Luliplus", composition: "Luliconazole 1% w/w", form: "creams", range: "derma", area: "dermatology", pack: "30 g Tube", featured: true },
  { brand: "Ketoplus", composition: "Ketoconazole 2% w/w", form: "creams", range: "derma", area: "dermatology", pack: "30 g Tube" },
  { brand: "Fusiplus", composition: "Fusidic Acid 2% w/w", form: "creams", range: "derma", area: "dermatology", pack: "15 g Tube" },
  { brand: "Mupiplus", composition: "Mupirocin 2% w/w", form: "ointments", range: "derma", area: "dermatology", pack: "5 g Tube" },
  { brand: "Dicloplus Gel", composition: "Diclofenac Diethylamine 1.16% + Linseed Oil 3% + Methyl Salicylate 10% + Menthol 5%", form: "ointments", range: "general-range", area: "orthopedics", type: "OTC", pack: "30 g Tube" },
  // Drops
  { brand: "Moxiplus", composition: "Moxifloxacin 0.5% w/v", form: "eye-ear-drops", range: "general-range", area: "ophthalmology", pack: "5 ml Dropper Bottle" },
  { brand: "Tearplus", composition: "Carboxymethylcellulose Sodium 0.5% w/v", form: "eye-ear-drops", range: "general-range", area: "ophthalmology", type: "OTC", pack: "10 ml Dropper Bottle" },
  { brand: "Ciproplus", composition: "Ciprofloxacin 0.3% w/v Eye/Ear Drops", form: "eye-ear-drops", range: "general-range", area: "ophthalmology", pack: "10 ml Dropper Bottle" },
  // Nutraceutical powder
  { brand: "Proplus Powder", composition: "Protein Powder with Vitamins & Minerals", form: "", range: "nutraceuticals", area: "nutraceuticals", type: "Nutraceutical", pack: "200 g Jar" },
];
