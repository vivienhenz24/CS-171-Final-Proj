// lib/salaryMapping.ts
// Estimated average starting salary after graduation by concentration
// Based on typical career paths and industry data

export const salaryMapping: Record<string, number> = {
  // STEM - Higher salaries
  'COMPSCI': 120000,      // Computer Science
  'MATH': 85000,          // Mathematics
  'STAT': 90000,          // Statistics
  'PHYSICS': 95000,       // Physics
  'CHEM': 75000,          // Chemistry
  'ASTRON': 90000,        // Astrophysics
  'ENG-SCI': 95000,       // Engineering Sciences
  'APPHY': 100000,        // Applied Physics
  'APMTH': 110000,        // Applied Mathematics
  'BE': 95000,            // Biomedical Engineering
  'ESE': 90000,           // Environmental Science and Engineering
  'E-PSCI': 80000,        // Earth and Planetary Sciences
  'MCB': 75000,           // Molecular and Cellular Biology
  'MBB': 75000,           // Molecular and Cellular Biology (alternate)
  'OEB': 70000,           // Integrative Biology
  'NEURO': 80000,         // Neuroscience
  'NEUROBIO': 80000,      // Neurobiology
  'LIFESCI': 70000,       // Life Sciences
  'SCRB': 75000,          // Human Developmental and Regenerative Biology
  'GENETIC': 75000,       // Genetics
  'CELLBIO': 75000,       // Cell Biology
  'IMMUN': 80000,         // Immunology
  'BPH': 85000,           // Biophysics
  'CPB': 75000,           // Chemical and Physical Biology
  'BIOSTAT': 95000,       // Biostatistics
  'BCMP': 75000,          // Biological Chemistry and Molecular Pharmacology
  'MICROBI': 70000,       // Microbiology
  'PHYSCI': 85000,        // Physical Sciences
  'MED-SCI': 75000,       // Medical Sciences
  'VIROLOGY': 80000,      // Virology
  'APCOMP': 115000,       // Applied Computation
  'QSE': 110000,          // Quantum Science and Engineering
  'SHBT': 75000,          // Speech and Hearing Bioscience and Technology
  'BBS': 75000,           // Biological and Biomedical Sciences
  'HBTM': 70000,          // Human Evolutionary Biology

  // Social Sciences - Moderate to high salaries
  'ECON': 95000,          // Economics
  'GOV': 65000,           // Government
  'PSY': 60000,           // Psychology
  'SOCIOL': 55000,        // Sociology
  'ANTHRO': 50000,        // Anthropology
  'SOC-STD': 60000,       // Social Studies
  'EDST': 55000,          // Educational Studies
  'HLTHPOL': 70000,       // Health Policy
  'GHHP': 70000,          // Global Health and Health Policy
  'ESPP': 70000,          // Environmental Science and Public Policy
  'EMR': 60000,           // Ethnicity, Migration, Rights
  'LING': 65000,          // Linguistics

  // Humanities - Lower to moderate salaries
  'ENGLISH': 55000,       // English
  'HIST': 55000,          // History
  'PHIL': 50000,          // Philosophy
  'FRENCH': 50000,        // French
  'GERMAN': 50000,        // Germanic Languages and Literatures
  'SPANSH': 50000,        // Spanish
  'ITAL': 50000,          // Italian
  'PORTUG': 50000,        // Portuguese
  'RUSS': 50000,          // Russian
  'CHNSE': 60000,         // Chinese
  'JAPAN': 60000,         // Japanese
  'KOREAN': 60000,        // Korean
  'ARABIC': 60000,        // Arabic
  'PERSIAN': 60000,       // Persian
  'HEB': 55000,           // Hebrew
  'MOD-HEB': 55000,       // Modern Hebrew
  'LATIN': 50000,         // Latin
  'GREEK': 50000,         // Greek
  'CLASARCH': 50000,      // Classical Archaeology
  'CLASPHIL': 50000,      // Classical Philosophy
  'CLS-STDY': 50000,      // Classics
  'HAA': 55000,           // History of Art and Architecture
  'MUSIC': 45000,         // Music
  'TDM': 50000,           // Theater, Dance, and Media
  'AFVS': 55000,          // Art, Film, and Visual Studies
  'FT': 55000,            // Film and Television
  'COMPLIT': 50000,       // Comparative Literature
  'RELIGION': 50000,      // Comparative Study of Religion
  'HISTSCI': 60000,       // History and Science
  'HIST-LIT': 55000,      // History and Literature
  'FOLKMYTH': 50000,      // Folklore and Mythology
  'MEDVLSTD': 50000,      // Medieval Studies
  'HUMAN': 50000,         // Humanities
  'EXPOS': 50000,         // Expository Writing
  'GENED': 50000,         // General Education
  'FYSEMR': 50000,        // First-Year Seminars
  'FRSEMR': 50000,        // Freshman Seminars
  'WOMGEN': 55000,        // Studies of Women, Gender, and Sexuality
  'AFRAMER': 55000,       // African and African American Studies
  'AAAS': 55000,          // African and African American Studies (alternate)
  'EASTD': 60000,         // East Asian Studies
  'MODMDEST': 60000,      // Modern Middle Eastern Studies
  'ISLAMCIV': 55000,      // Islamic Civilization
  'NEC': 55000,           // Near Eastern Languages and Civilizations
  'ANE': 55000,           // Ancient Near Eastern Studies
  'JEWISHST': 55000,      // Jewish Studies
  'ROM-STD': 50000,       // Romance Languages and Literatures
  'SLAVIC': 50000,        // Slavic Languages and Literatures
  'CELTIC': 50000,        // Celtic Languages and Literatures
  'ARMENST': 50000,       // Armenian Studies
  'MODGRK': 50000,        // Modern Greek
  'VIETNAM': 55000,       // Vietnamese
  'WSTAFRCN': 50000,      // West African Languages
  'JAPNLIT': 55000,       // Japanese Literature
  'SWEDISH': 50000,       // Swedish
  'TURKISH': 55000,       // Turkish
  'SANSKRIT': 50000,      // Sanskrit
  'HIND-URD': 55000,      // Hindi-Urdu
  'EAFM': 55000,          // East Asian Film and Media
  'CHNSHIS': 60000,       // Chinese History
  'YORUBA': 50000,        // Yoruba
  'CHNSLIT': 55000,       // Chinese Literature
  'AMHARIC': 50000,       // Amharic
  'SWAHILI': 50000,       // Swahili
  'IGBO': 50000,          // Igbo
};

export const getSalary = (departmentCode: string): number => {
  return salaryMapping[departmentCode] || 55000; // Default to $55k if not found
};

