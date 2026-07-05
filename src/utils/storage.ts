import { Preferences } from '@capacitor/preferences';
import { ExamData } from '../types';

const STORAGE_KEY = 'exam_designer_exams';

/* =========================
   SAVE
========================= */
export const saveExam = async (exam: ExamData): Promise<void> => {
  const exams = await getAllExams();

  const index = exams.findIndex(e => e.id === exam.id);

  const now = new Date().toISOString();

  if (index >= 0) {
    exams[index] = { ...exam, updatedAt: now };
  } else {
    exams.push({ ...exam, createdAt: now, updatedAt: now });
  }

  await Preferences.set({
    key: STORAGE_KEY,
    value: JSON.stringify(exams),
  });
};

/* =========================
   GET ALL
========================= */
export const getAllExams = async (): Promise<ExamData[]> => {
  try {
    const { value } = await Preferences.get({ key: STORAGE_KEY });
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.log('storage error', e);
    return [];
  }
};

/* =========================
   GET BY ID
========================= */
export const getExamById = async (id: string): Promise<ExamData | null> => {
  const exams = await getAllExams();
  return exams.find(e => e.id === id) || null;
};

/* =========================
   DELETE
========================= */
export const deleteExam = async (id: string): Promise<void> => {
  const exams = await getAllExams();
  const filtered = exams.filter(e => e.id !== id);

  await Preferences.set({
    key: STORAGE_KEY,
    value: JSON.stringify(filtered),
  });
};

/* =========================
   EXPORT
========================= */
export const exportAllExams = async (): Promise<string> => {
  const exams = await getAllExams();
  return JSON.stringify(exams, null, 2);
};

/* =========================
   IMPORT
========================= */
export const importExams = async (jsonData: string): Promise<boolean> => {
  try {
    const data = JSON.parse(jsonData);

    if (Array.isArray(data)) {
      await Preferences.set({
        key: STORAGE_KEY,
        value: JSON.stringify(data),
      });
      return true;
    }

    return false;
  } catch {
    return false;
  }
};
