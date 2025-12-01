'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { csvParse } from 'd3';
import { getDepartmentName } from '@/lib/departmentNames';

export type DepartmentStats = {
  department: string;
  departmentName: string; // Full name
  num_courses: number;
  avg_rating: number;
  avg_hours: number;
  avg_enrollment: number;
  total_enrollment: number;
};

export type CourseSummary = {
  fas_id: string;
  course_code: string;
  course_title: string;
  department: string;
  rating: number;
  hours_per_week: number;
  num_students: number;
  semester: string;
};

export type TimeSeriesEntry = {
  department: string;
  semester: string;
  year: number;
  term: string;
  hours_per_week: number;
  rating: number;
  num_students: number;
};

type DataState = {
  departments: DepartmentStats[];
  courses: CourseSummary[];
  timeseries: TimeSeriesEntry[];
  selectedDept: DepartmentStats | null;
  setSelectedDept: (dept: DepartmentStats) => void;
  loading: boolean;
  error: string | null;
};

const DataContext = createContext<DataState | undefined>(undefined);

// Only include these specific concentrations (Harvard majors)
const ALLOWED_DEPARTMENTS = new Set([
  'AFRAMER',   // African and African American Studies (use this, not AAAS)
  'ANTHRO',    // Anthropology
  'APMTH',     // Applied Mathematics
  'AFVS',      // Art, Film, and Visual Studies
  'ASTRON',    // Astrophysics/Astronomy
  'BE',        // Biomedical Engineering
  'CPB',       // Chemical and Physical Biology
  'CHEM',      // Chemistry
  'CLS-STDY',  // Classics
  'COMPLIT',   // Comparative Literature
  'RELIGION',  // Comparative Study of Religion
  'COMPSCI',   // Computer Science
  'E-PSCI',    // Earth and Planetary Sciences
  'EASTD',     // East Asian Studies
  'ECON',      // Economics
  'ENG-SCI',   // Engineering Sciences / Electrical Engineering / Mechanical Engineering
  'ENGLISH',   // English
  'ESE',       // Environmental Science and Engineering
  'ESPP',      // Environmental Science and Public Policy
  'FOLKMYTH',  // Folklore and Mythology
  'GERMAN',    // Germanic Languages and Literatures
  'GOV',       // Government
  'HIST',      // History
  'HIST-LIT',  // History and Literature
  'HISTSCI',   // History and Science
  'HAA',       // History of Art and Architecture
  'SCRB',      // Human Developmental and Regenerative Biology (HDRB)
  'HBTM',      // Human Evolutionary Biology
  'OEB',       // Integrative Biology (Organismic and Evolutionary Biology)
  'LING',      // Linguistics
  'MATH',      // Mathematics
  'MCB',       // Molecular and Cellular Biology (use this, not MBB)
  'MUSIC',     // Music
  'NEC',       // Near Eastern Languages and Civilizations
  'NEURO',     // Neuroscience
  'PHIL',      // Philosophy
  'PHYSICS',   // Physics
  'PSY',       // Psychology
  'ROM-STD',   // Romance Languages and Literatures
  'SLAVIC',    // Slavic Languages and Literatures
  'SOC-STD',   // Social Studies
  'SOCIOL',    // Sociology
  'STAT',      // Statistics
  'TDM',       // Theater, Dance & Media
  'WOMGEN',    // Studies of Women, Gender, and Sexuality
]);

const parseDepartments = (text: string): DepartmentStats[] => {
  return csvParse(text, (row) => {
    const code = row.department || '';
    return {
      department: code,
      departmentName: getDepartmentName(code),
      num_courses: Number(row.num_courses || 0),
      avg_rating: Number(row.avg_rating || 0),
      avg_hours: Number(row.avg_hours || 0),
      avg_enrollment: Number(row.avg_enrollment || 0),
      total_enrollment: Number(row.total_enrollment || 0)
    };
  }).filter((d) => d.department && d.avg_hours > 0 && ALLOWED_DEPARTMENTS.has(d.department));
};

const parseCourses = (text: string): CourseSummary[] => {
  return csvParse(text, (row) => ({
    fas_id: row.fas_id || '',
    course_code: row.course_code || '',
    course_title: row.course_title || '',
    department: row.department || '',
    rating: Number(row.rating || 0),
    hours_per_week: Number(row.hours_per_week || 0),
    num_students: Number(row.num_students || 0),
    semester: row.semester || ''
  })).filter((c) => c.department && c.rating > 0 && c.hours_per_week > 0 && ALLOWED_DEPARTMENTS.has(c.department));
};

const parseTimeseries = (text: string): TimeSeriesEntry[] => {
  return csvParse(text, (row) => ({
    department: row.department || '',
    semester: row.semester || '',
    year: Number(row.year || 0),
    term: row.term || '',
    hours_per_week: Number(row.hours_per_week || 0),
    rating: Number(row.rating || 0),
    num_students: Number(row.num_students || 0),
  })).filter((e) => e.department && e.hours_per_week > 0 && e.year > 0 && ALLOWED_DEPARTMENTS.has(e.department));
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [departments, setDepartments] = useState<DepartmentStats[]>([]);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [timeseries, setTimeseries] = useState<TimeSeriesEntry[]>([]);
  const [selectedDept, setSelectedDept] = useState<DepartmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [deptRes, courseRes, timeseriesRes] = await Promise.all([
          fetch('/data/qguide_departments.csv'),
          fetch('/data/qguide_latest_semester.csv'),
          fetch('/data/qguide_timeseries.csv')
        ]);
        if (!deptRes.ok || !courseRes.ok || !timeseriesRes.ok) {
          throw new Error('Unable to load CSV data');
        }
        const [deptText, courseText, timeseriesText] = await Promise.all([
          deptRes.text(), 
          courseRes.text(),
          timeseriesRes.text()
        ]);
        const deptData = parseDepartments(deptText);
        const courseData = parseCourses(courseText);
        const timeseriesData = parseTimeseries(timeseriesText);
        
        // Sort departments alphabetically by departmentName
        const sortedDepts = [...deptData].sort((a, b) => 
          a.departmentName.localeCompare(b.departmentName)
        );
        
        // Find Computer Science as default
        const compSciDept = sortedDepts.find(d => d.department === 'COMPSCI');
        
        setDepartments(sortedDepts);
        setCourses(courseData);
        setTimeseries(timeseriesData);
        setSelectedDept(compSciDept ?? sortedDepts[0] ?? null);
      } catch (err) {
        console.error(err);
        setError('Could not load data from CSV. Check /data files.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const value = useMemo(
    () => ({
      departments,
      courses,
      timeseries,
      selectedDept,
      setSelectedDept,
      loading,
      error
    }),
    [departments, courses, timeseries, selectedDept, loading, error]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataContext must be used within DataProvider');
  return ctx;
}
