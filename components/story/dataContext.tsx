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

type DataState = {
  departments: DepartmentStats[];
  courses: CourseSummary[];
  selectedDept: DepartmentStats | null;
  setSelectedDept: (dept: DepartmentStats) => void;
  loading: boolean;
  error: string | null;
};

const DataContext = createContext<DataState | undefined>(undefined);

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
  }).filter((d) => d.department && d.avg_hours > 0);
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
  })).filter((c) => c.department && c.rating > 0 && c.hours_per_week > 0);
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [departments, setDepartments] = useState<DepartmentStats[]>([]);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [selectedDept, setSelectedDept] = useState<DepartmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [deptRes, courseRes] = await Promise.all([
          fetch('/api/data?file=departments_summary.csv'),
          fetch('/api/data?file=courses_summary.csv')
        ]);
        if (!deptRes.ok || !courseRes.ok) {
          throw new Error('Unable to load CSV data');
        }
        const [deptText, courseText] = await Promise.all([deptRes.text(), courseRes.text()]);
        const deptData = parseDepartments(deptText);
        const courseData = parseCourses(courseText);
        
        // Sort departments alphabetically by departmentName
        const sortedDepts = [...deptData].sort((a, b) => 
          a.departmentName.localeCompare(b.departmentName)
        );
        
        // Find Computer Science as default
        const compSciDept = sortedDepts.find(d => d.department === 'COMPSCI');
        
        setDepartments(sortedDepts);
        setCourses(courseData);
        setSelectedDept(compSciDept ?? sortedDepts[0] ?? null);
      } catch (err) {
        console.error(err);
        setError('Could not load data from CSV. Check /data/csv files.');
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
      selectedDept,
      setSelectedDept,
      loading,
      error
    }),
    [departments, courses, selectedDept, loading, error]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataContext must be used within DataProvider');
  return ctx;
}
