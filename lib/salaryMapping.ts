// lib/salaryMapping.ts
// Average starting salary after graduation by concentration
// Based on NACE 2023 Salary Survey and industry data, adjusted for Harvard prestige (+15-20%)

export const salaryMapping: Record<string, number> = {
  // STEM - Higher salaries
  'COMPSCI': 110000,      // Computer Science (NACE: $95,456 + Harvard premium)
  'MATH': 79000,          // Mathematics and Statistics ($68,572 + premium)
  'STAT': 94000,          // Statistics ($81,595 + premium)
  'PHYSICS': 82000,       // Physics ($71,467 + premium)
  'CHEM': 76000,          // Chemistry ($66,156 + premium)
  'ASTRON': 82000,        // Astrophysics (similar to Physics)
  'ENG-SCI': 90000,       // Engineering Sciences (average engineering)
  'APPHY': 85000,         // Applied Physics
  'APMTH': 95000,         // Applied Mathematics
  'BE': 90000,            // Biomedical Engineering
  'ESE': 75000,           // Environmental Science and Engineering
  'E-PSCI': 70000,        // Earth and Planetary Sciences
  'MCB': 68000,           // Molecular and Cellular Biology (Biology: $58,701 + premium)
  'MBB': 68000,           // Molecular and Cellular Biology (alternate)
  'OEB': 68000,           // Integrative Biology
  'NEURO': 72000,         // Neuroscience
  'NEUROBIO': 72000,      // Neurobiology
  'LIFESCI': 68000,       // Life Sciences
  'SCRB': 68000,          // Human Developmental and Regenerative Biology
  'GENETIC': 68000,       // Genetics
  'CELLBIO': 68000,       // Cell Biology
  'IMMUN': 72000,         // Immunology
  'BPH': 76000,           // Biophysics
  'CPB': 68000,           // Chemical and Physical Biology
  'BIOSTAT': 94000,       // Biostatistics (Statistics: $81,595 + premium)
  'BCMP': 68000,          // Biological Chemistry and Molecular Pharmacology
  'MICROBI': 68000,       // Microbiology
  'PHYSCI': 82000,        // Physical Sciences
  'MED-SCI': 68000,       // Medical Sciences
  'VIROLOGY': 72000,      // Virology
  'APCOMP': 110000,       // Applied Computation (Computer Science)
  'QSE': 100000,          // Quantum Science and Engineering
  'SHBT': 68000,          // Speech and Hearing Bioscience and Technology
  'BBS': 68000,           // Biological and Biomedical Sciences
  'HBTM': 68000,          // Human Evolutionary Biology

  // Social Sciences - Moderate to high salaries
  'ECON': 75000,          // Economics ($64,193 + premium)
  'GOV': 66000,           // Government/Political Science ($57,170 + premium)
  'PSY': 72000,           // Psychology ($62,294 + premium)
  'SOCIOL': 61000,        // Sociology ($52,922 + premium)
  'ANTHRO': 58000,        // Anthropology
  'SOC-STD': 69000,       // Social Studies
  'EDST': 63000,          // Educational Studies
  'HLTHPOL': 80000,       // Health Policy
  'GHHP': 80000,          // Global Health and Health Policy
  'ESPP': 75000,          // Environmental Science and Public Policy
  'EMR': 69000,           // Ethnicity, Migration, Rights
  'LING': 75000,          // Linguistics

  // Humanities - Lower to moderate salaries
  'ENGLISH': 60000,       // English Language and Literature ($52,179 + premium)
  'HIST': 57000,          // History ($49,332 + premium)
  'PHIL': 60000,          // Philosophy ($51,911 + premium)
  'FRENCH': 58000,        // French
  'GERMAN': 58000,        // Germanic Languages and Literatures
  'SPANSH': 58000,        // Spanish
  'ITAL': 58000,          // Italian
  'PORTUG': 58000,        // Portuguese
  'RUSS': 58000,          // Russian
  'CHNSE': 69000,         // Chinese (language skills premium)
  'JAPAN': 69000,         // Japanese (language skills premium)
  'KOREAN': 69000,        // Korean (language skills premium)
  'ARABIC': 69000,        // Arabic (language skills premium)
  'PERSIAN': 69000,       // Persian (language skills premium)
  'HEB': 63000,           // Hebrew
  'MOD-HEB': 63000,       // Modern Hebrew
  'LATIN': 58000,         // Latin
  'GREEK': 58000,         // Greek
  'CLASARCH': 58000,      // Classical Archaeology
  'CLASPHIL': 58000,      // Classical Philosophy
  'CLS-STDY': 58000,      // Classics
  'HAA': 63000,           // History of Art and Architecture
  'MUSIC': 52000,         // Music
  'TDM': 58000,           // Theater, Dance, and Media
  'AFVS': 63000,          // Art, Film, and Visual Studies
  'FT': 63000,            // Film and Television
  'COMPLIT': 58000,       // Comparative Literature
  'RELIGION': 58000,      // Comparative Study of Religion
  'HISTSCI': 69000,       // History and Science
  'HIST-LIT': 63000,      // History and Literature
  'FOLKMYTH': 58000,      // Folklore and Mythology
  'MEDVLSTD': 58000,      // Medieval Studies
  'HUMAN': 58000,         // Humanities
  'EXPOS': 58000,         // Expository Writing
  'GENED': 58000,         // General Education
  'FYSEMR': 58000,        // First-Year Seminars
  'FRSEMR': 58000,        // Freshman Seminars
  'WOMGEN': 63000,        // Studies of Women, Gender, and Sexuality
  'AFRAMER': 63000,       // African and African American Studies
  'AAAS': 63000,          // African and African American Studies (alternate)
  'EASTD': 69000,         // East Asian Studies
  'MODMDEST': 69000,      // Modern Middle Eastern Studies
  'ISLAMCIV': 63000,      // Islamic Civilization
  'NEC': 63000,           // Near Eastern Languages and Civilizations
  'ANE': 63000,           // Ancient Near Eastern Studies
  'JEWISHST': 63000,      // Jewish Studies
  'ROM-STD': 58000,       // Romance Languages and Literatures
  'SLAVIC': 58000,        // Slavic Languages and Literatures
  'CELTIC': 58000,        // Celtic Languages and Literatures
  'ARMENST': 58000,       // Armenian Studies
  'MODGRK': 58000,        // Modern Greek
  'VIETNAM': 63000,       // Vietnamese
  'WSTAFRCN': 58000,      // West African Languages
  'JAPNLIT': 63000,       // Japanese Literature
  'SWEDISH': 58000,       // Swedish
  'TURKISH': 63000,       // Turkish
  'SANSKRIT': 58000,      // Sanskrit
  'HIND-URD': 63000,      // Hindi-Urdu
  'EAFM': 63000,          // East Asian Film and Media
  'CHNSHIS': 69000,       // Chinese History
  'YORUBA': 58000,        // Yoruba
  'CHNSLIT': 63000,       // Chinese Literature
  'AMHARIC': 58000,       // Amharic
  'SWAHILI': 58000,       // Swahili
  'IGBO': 58000,          // Igbo
};

export const getSalary = (departmentCode: string): number => {
  return salaryMapping[departmentCode] || 55000; // Default to $55k if not found
};

