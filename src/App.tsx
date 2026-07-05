import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  Question,
  QuestionType,
  HeaderInfo,
  ExamData
} from './types';

import { saveExam, getAllExams } from './utils/storage';
import { exportPDF, exportWord } from './utils/export';

import HeaderForm from './components/HeaderForm';
import QuestionSection from './components/QuestionSection';
import ExamList from './components/ExamList';

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
  const [examId, setExamId] = useState(uuidv4());
  const [savedExams, setSavedExams] = useState<ExamData[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    console.log("APP LOADED");
    setSavedExams(getAllExams());
  }, []);

  const totalScore = questions.reduce((sum, q) => sum + q.score, 0);

  const getExamData = (): ExamData => ({
    id: examId,
    header,
    questions,
    totalScore,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleSave = () => {
    if (!questions.length) return alert('سوالی وجود ندارد');

    saveExam(getExamData());
    setSavedExams(getAllExams());
    alert('ذخیره شد');
  };

  const handlePDF = async () => {
    try {
      await exportPDF(getExamData());
      alert('PDF ساخته شد');
    } catch (e) {
      console.log(e);
      alert('خطا در PDF');
    }
  };

  const handleWord = async () => {
    try {
      await exportWord(getExamData());
      alert('Word ساخته شد');
    } catch (e) {
      console.log(e);
      alert('خطا در Word');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">

      <header className="bg-blue-800 text-white p-3">
        <h1>طراح سوالات</h1>
      </header>

      <main className="p-3">

        {activeTab === 'designer' ? (
          <>
            <HeaderForm header={header} onChange={setHeader} />

            <QuestionSection
              type={'multiple-choice'}
              questions={questions}
              allQuestionsCount={questions.length}
              startIndex={1}
              onAdd={(q) => setQuestions([...questions, q])}
              onUpdate={(q) =>
                setQuestions(prev => prev.map(p => p.id === q.id ? q : p))
              }
              onDelete={(id) =>
                setQuestions(prev => prev.filter(p => p.id !== id))
              }
            />

            <div className="flex gap-2 fixed bottom-3 left-0 right-0 justify-center">
              <button onClick={handleSave}>ذخیره</button>
              <button onClick={handlePDF}>PDF</button>
              <button onClick={handleWord}>Word</button>
            </div>
          </>
        ) : (
          <ExamList exams={savedExams} />
        )}

      </main>
    </div>
  );
};

export default App;
