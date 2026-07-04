export type QuestionType =
  | 'true-false'
  | 'fill-blank'
  | 'matching'
  | 'multiple-choice'
  | 'short-answer'
  | 'descriptive';

export interface HeaderInfo {
  schoolName: string;
  studentName: string;
  fatherName: string;
  subject: string;
  grade: string;
  academicYear: string;
  date: string;
  teacherName: string;
  examTitle: string;
}

export interface TrueFalseQuestion {
  id: string;
  type: 'true-false';
  text: string;
  answer: boolean | null;
  score: number;
  order: number;
}

export interface FillBlankQuestion {
  id: string;
  type: 'fill-blank';
  text: string;
  blanks: string[];
  score: number;
  order: number;
}

export interface MatchingItem {
  id: string;
  left: string;
  right: string;
}

export interface MatchingQuestion {
  id: string;
  type: 'matching';
  text: string;
  items: MatchingItem[];
  score: number;
  order: number;
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple-choice';
  text: string;
  options: MultipleChoiceOption[];
  score: number;
  order: number;
}

export interface ShortAnswerQuestion {
  id: string;
  type: 'short-answer';
  text: string;
  answer: string;
  score: number;
  order: number;
}

export interface DescriptiveQuestion {
  id: string;
  type: 'descriptive';
  text: string;
  answerGuide: string;
  score: number;
  order: number;
  lines: number;
}

export type Question =
  | TrueFalseQuestion
  | FillBlankQuestion
  | MatchingQuestion
  | MultipleChoiceQuestion
  | ShortAnswerQuestion
  | DescriptiveQuestion;

export interface ExamData {
  id: string;
  header: HeaderInfo;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  totalScore: number;
}

export const SCORE_OPTIONS = [
  0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5,
  2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5,
  5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10
];

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  'true-false': 'صحیح و غلط',
  'fill-blank': 'جاخالی',
  'matching': 'جورکردنی',
  'multiple-choice': 'تستی',
  'short-answer': 'پاسخ کوتاه',
  'descriptive': 'تشریحی',
};

export const QUESTION_TYPE_COLORS: Record<QuestionType, string> = {
  'true-false': 'bg-green-100 text-green-800 border-green-300',
  'fill-blank': 'bg-blue-100 text-blue-800 border-blue-300',
  'matching': 'bg-purple-100 text-purple-800 border-purple-300',
  'multiple-choice': 'bg-orange-100 text-orange-800 border-orange-300',
  'short-answer': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'descriptive': 'bg-red-100 text-red-800 border-red-300',
};

export const QUESTION_TYPE_ICONS: Record<QuestionType, string> = {
  'true-false': '✓✗',
  'fill-blank': '___',
  'matching': '↔',
  'multiple-choice': '⊙',
  'short-answer': '✏',
  'descriptive': '📝',
};
