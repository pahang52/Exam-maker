import { ExamData } from '../types';

const STORAGE_KEY = 'exam_designer_exams';

export const saveExam = (exam: ExamData): void => {
  const exams = getAllExams();
  const existingIndex = exams.findIndex(e => e.id === exam.id);
  if (existingIndex >= 0) {
    exams[existingIndex] = { ...exam, updatedAt: new Date().toISOString() };
  } else {
    exams.push({ ...exam, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
};

export const getAllExams = (): ExamData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const getExamById = (id: string): ExamData | null => {
  const exams = getAllExams();
  return exams.find(e => e.id === id) || null;
};

export const deleteExam = (id: string): void => {
  const exams = getAllExams().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
};

export const exportAllExams = (): string => {
  return JSON.stringify(getAllExams(), null, 2);
};

export const importExams = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    if (Array.isArray(data)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
