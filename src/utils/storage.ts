import { ExamData } from '../types';

const STORAGE_KEY = 'exam_designer_exams';

const safeStorage = {
  get: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }
};

/* SAVE */
export const saveExam = (exam: ExamData): void => {
  const exams = getAllExams();

  const index = exams.findIndex(e => e.id === exam.id);
  const now = new Date().toISOString();

  if (index >= 0) {
    exams[index] = { ...exam, updatedAt: now };
  } else {
    exams.push({ ...exam, createdAt: now, updatedAt: now });
  }

  safeStorage.set(STORAGE_KEY, JSON.stringify(exams));
};

/* GET ALL */
export const getAllExams = (): ExamData[] => {
  try {
    const data = safeStorage.get(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/* GET BY ID */
export const getExamById = (id: string): ExamData | null => {
  return getAllExams().find(e => e.id === id) || null;
};

/* DELETE */
export const deleteExam = (id: string): void => {
  const exams = getAllExams().filter(e => e.id !== id);
  safeStorage.set(STORAGE_KEY, JSON.stringify(exams));
};
