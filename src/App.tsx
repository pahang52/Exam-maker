import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  Question,
  QuestionType,
  HeaderInfo,
  ExamData,
  QUESTION_TYPE_LABELS
} from './types';

import { saveExam, getAllExams } from './utils/storage';

// ✅ اصلاح مهم: استفاده از export واحد
import { exportPDF, exportWord } from './utils/export';

import HeaderForm from './components/HeaderForm';
import QuestionSection from './components/QuestionSection';
import ExamList from './components/ExamList';

import {
  Download,
  Save,
  List,
  PlusCircle,
  Printer,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Menu,
  X
} from 'lucide-react';

const QUESTION_TYPES: {
  type: QuestionType;
  icon: string;
  bgColor: string;
  borderColor: string;
}[] = [
  { type: 'true-false', icon: '✓✗', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  { type: 'fill-blank', icon: '📝', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { type: 'matching', icon: '↔️', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { type: 'multiple-choice', icon: '⊙', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  { type: 'short-answer', icon: '✏️', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  { type: 'descriptive', icon: '📄', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
];

const defaultHeader: HeaderInfo = {
  schoolName: '',
  studentName: '',
  fatherName: '',
  subject: '',
  grade: '',
  academicYear: '',
  date: '',
  teacherName: '',
  examTitle: '',
};

type Tab = 'designer' | 'saved';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('designer');
  const [header, setHeader] = useState<HeaderInfo>(defaultHeader);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examId, setExamId] = useState<string>(uuidv4());
  const [savedExams, setSavedExams] = useState<ExamData[]>([]);
  const [notification, setNotification] =
    useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setSavedExams(getAllExams());
  }, []);

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const totalScore = questions.reduce((sum, q) => sum + q.score, 0);

  const getExamData = (): ExamData => ({
    id: examId,
    header,
    questions,
    totalScore,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleAddQuestion = (question: Question) => {
    setQuestions(prev => [...prev, question]);
  };

  const handleUpdateQuestion = (updated: Question) => {
    setQuestions(prev =>
      prev.map(q => (q.id === updated.id ? updated : q))
    );
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleSave = () => {
    if (questions.length === 0) {
      showNotification('حداقل یک سوال اضافه کنید.', 'error');
      return;
    }
    const exam = getExamData();
    saveExam(exam);
    setSavedExams(getAllExams());
    showNotification('آزمون ذخیره شد ✅');
  };

  // ✅ PDF واقعی
  const handlePrint = async () => {
    if (questions.length === 0) {
      showNotification('ابتدا سوال اضافه کنید.', 'error');
      return;
    }

    try {
      await exportPDF(getExamData());
      showNotification('PDF ساخته شد ✅');
    } catch (e) {
      showNotification('خطا در تولید PDF', 'error');
    }
  };

  // ✅ Word واقعی
  const handleDownloadWord = async () => {
    if (questions.length === 0) {
      showNotification('ابتدا سوال اضافه کنید.', 'error');
      return;
    }

    try {
      await exportWord(getExamData());
      showNotification('Word ساخته شد ✅');
    } catch (e) {
      showNotification('خطا در تولید Word', 'error');
    }
  };

  const handleNewExam = () => {
    if (questions.length > 0 &&
      !confirm('آیا مطمئن هستید؟ آزمون پاک می‌شود.')) return;

    setHeader(defaultHeader);
    setQuestions([]);
    setExamId(uuidv4());
  };

  const handleEditExam = (exam: ExamData) => {
    setHeader(exam.header);
    setQuestions(exam.questions);
    setExamId(exam.id);
    setActiveTab('designer');
  };

  const questionsByType = Object.fromEntries(
    QUESTION_TYPES.map(qt => [
      qt.type,
      questions.filter(q => q.type === qt.type)
    ])
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50" dir="rtl">

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-white ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.msg}
        </div>
      )}

      {/* HEADER */}
      <header className="bg-blue-900 text-white p-4">
        <h1 className="font-bold">طراح سوالات آزمون</h1>
      </header>

      <main className="p-4">

        {activeTab === 'designer' ? (
          <>
            <HeaderForm header={header} onChange={setHeader} />

            {QUESTION_TYPES.map(qt => (
              <QuestionSection
                key={qt.type}
                type={qt.type}
                questions={questionsByType[qt.type] || []}
                allQuestionsCount={questions.length}
                startIndex={1}
                onAdd={handleAddQuestion}
                onUpdate={handleUpdateQuestion}
                onDelete={handleDeleteQuestion}
                icon={qt.icon}
                bgColor={qt.bgColor}
                borderColor={qt.borderColor}
              />
            ))}

            {/* ACTIONS */}
            <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-3">
              <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
                ذخیره
              </button>

              <button onClick={handlePrint} className="bg-red-600 text-white px-4 py-2 rounded">
                PDF
              </button>

              <button onClick={handleDownloadWord} className="bg-blue-600 text-white px-4 py-2 rounded">
                Word
              </button>

              <button onClick={handleNewExam} className="bg-gray-600 text-white px-4 py-2 rounded">
                جدید
              </button>
            </div>
          </>
        ) : (
          <ExamList
            exams={savedExams}
            onEdit={handleEditExam}
            onRefresh={() => setSavedExams(getAllExams())}
          />
        )}

      </main>
    </div>
  );
};

export default App;
