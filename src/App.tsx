import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Question, QuestionType, HeaderInfo, ExamData } from './types';
import { saveExam, getAllExams } from './utils/storage';

import { exportPDF, exportWord } from './utils/export';

import HeaderForm from './components/HeaderForm';
import QuestionSection from './components/QuestionSection';
import ExamList from './components/ExamList';

const QUESTION_TYPES: { type: QuestionType; icon: string; bgColor: string; borderColor: string }[] = [
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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'designer' | 'saved'>('designer');
  const [header, setHeader] = useState<HeaderInfo>(defaultHeader);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examId, setExamId] = useState(uuidv4());
  const [savedExams, setSavedExams] = useState<ExamData[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setSavedExams(getAllExams());
  }, []);

  const totalScore = questions.reduce((s, q) => s + q.score, 0);

  const getExamData = (): ExamData => ({
    id: examId,
    header,
    questions,
    totalScore,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleSave = () => {
    if (!questions.length) return setNotification('سوالی وجود ندارد');
    saveExam(getExamData());
    setSavedExams(getAllExams());
    setNotification('ذخیره شد');
  };

  const handlePrint = async () => {
    if (!questions.length) return setNotification('سوالی وجود ندارد');
    await exportPDF(getExamData());
    setNotification('PDF ساخته شد');
  };

  const handleWord = async () => {
    if (!questions.length) return setNotification('سوالی وجود ندارد');
    await exportWord(getExamData());
    setNotification('Word ساخته شد');
  };

  const handleNew = () => {
    setHeader(defaultHeader);
    setQuestions([]);
    setExamId(uuidv4());
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100">

      {notification && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded">
          {notification}
        </div>
      )}

      <header className="bg-blue-900 text-white p-3 font-bold">
        Exam Maker
      </header>

      <main className="p-4">

        {activeTab === 'designer' ? (
          <>
            <HeaderForm header={header} onChange={setHeader} />

            {QUESTION_TYPES.map(q => (
              <QuestionSection
                key={q.type}
                type={q.type}
                questions={questions.filter(x => x.type === q.type)}
                allQuestionsCount={questions.length}
                startIndex={1}
                onAdd={(q) => setQuestions([...questions, q])}
                onUpdate={(q) =>
                  setQuestions(prev => prev.map(x => x.id === q.id ? q : x))
                }
                onDelete={(id) =>
                  setQuestions(prev => prev.filter(x => x.id !== id))
                }
                icon={q.icon}
                bgColor={q.bgColor}
                borderColor={q.borderColor}
              />
            ))}

            {/* FIXED ACTION BAR */}
            <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-2">
              <button onClick={handleSave} className="bg-green-600 text-white px-3 py-2 rounded">
                ذخیره
              </button>

              <button onClick={handlePrint} className="bg-red-600 text-white px-3 py-2 rounded">
                PDF
              </button>

              <button onClick={handleWord} className="bg-blue-600 text-white px-3 py-2 rounded">
                Word
              </button>

              <button onClick={handleNew} className="bg-gray-600 text-white px-3 py-2 rounded">
                جدید
              </button>
            </div>
          </>
        ) : (
          <ExamList
            exams={savedExams}
            onEdit={(e) => {
              setHeader(e.header);
              setQuestions(e.questions);
              setExamId(e.id);
              setActiveTab('designer');
            }}
            onRefresh={() => setSavedExams(getAllExams())}
          />
        )}

      </main>
    </div>
  );
};

export default App;
