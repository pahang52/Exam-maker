import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  Question,
  HeaderInfo,
  ExamData,
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
  const [examId, setExamId] = useState<string>(uuidv4());
  const [savedExams, setSavedExams] = useState<ExamData[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setSavedExams(getAllExams());
  }, []);

  const totalScore = questions.reduce((sum, q) => sum + (q.score || 0), 0);

  const getExamData = (): ExamData => ({
    id: examId,
    header,
    questions,
    totalScore,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleSave = () => {
    if (!questions.length) {
      alert('سوالی وجود ندارد');
      return;
    }

    saveExam(getExamData());
    setSavedExams(getAllExams());
    showNotification('ذخیره شد');
  };

  const handlePDF = async () => {
    try {
      await exportPDF(getExamData());
      showNotification('PDF ساخته شد');
    } catch (e) {
      console.log(e);
      alert('خطا در PDF');
    }
  };

  const handleWord = async () => {
    try {
      await exportWord(getExamData());
      showNotification('Word ساخته شد');
    } catch (e) {
      console.log(e);
      alert('خطا در Word');
    }
  };

  const handleNewExam = () => {
    setExamId(uuidv4());
    setHeader(defaultHeader);
    setQuestions([]);
    setActiveTab('designer');
    showNotification('آزمون جدید ساخته شد');
  };

  return (
    <div style={{ direction: 'rtl', padding: 16 }}>
      <HeaderForm header={header} onChange={setHeader} />

      <div style={{ display: 'flex', gap: 8, margin: '16px 0', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => setActiveTab('designer')}>طراحی</button>
        <button type="button" onClick={() => setActiveTab('saved')}>ذخیره‌شده‌ها</button>
        <button type="button" onClick={handleNewExam}>آزمون جدید</button>
      </div>

      {notification && (
        <div style={{ marginBottom: 16, color: 'green' }}>
          {notification}
        </div>
      )}

      {activeTab === 'designer' ? (
        <>
          <QuestionSection
            type="true-false"
            questions={questions.filter(q => q.type === 'true-false')}
            allQuestionsCount={questions.length}
            startIndex={1}
            onAdd={(q) => setQuestions(prev => [...prev, q])}
            onUpdate={(q) => setQuestions(prev => prev.map(p => (p.id === q.id ? q : p)))}
            onDelete={(id) => setQuestions(prev => prev.filter(p => p.id !== id))}
            icon="✓✗"
            bgColor="bg-green-50"
            borderColor="border-green-200"
          />

          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <button type="button" onClick={handleSave}>ذخیره</button>
            <button type="button" onClick={handlePDF}>PDF</button>
            <button type="button" onClick={handleWord}>Word</button>
          </div>

          <div style={{ marginTop: 16 }}>
            <strong>مجموع نمره:</strong> {totalScore}
          </div>
        </>
      ) : (
        <ExamList
          exams={savedExams}
          onSelect={(exam) => {
            setExamId(exam.id);
            setHeader(exam.header);
            setQuestions(exam.questions);
            setActiveTab('designer');
          }}
        />
      )}
    </div>
  );
};

export default App;
