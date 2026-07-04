import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Question, QuestionType, HeaderInfo, ExamData,
  QUESTION_TYPE_LABELS
} from './types';
import { saveExam, getAllExams } from './utils/storage';
import { exportToPDF } from './utils/pdfExport';
import { exportToWord } from './utils/wordExport';
import HeaderForm from './components/HeaderForm';
import QuestionSection from './components/QuestionSection';
import ExamList from './components/ExamList';
import {
  Download, Save, List, PlusCircle,
  Printer, BookOpen, AlertCircle, CheckCircle2,
  Trash2, Menu, X
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
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
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
    setQuestions(prev => prev.map(q => q.id === updated.id ? updated : q));
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
    showNotification('آزمون با موفقیت ذخیره شد! ✅');
  };

  const handlePrint = () => {
    if (questions.length === 0) {
      showNotification('ابتدا سوال اضافه کنید.', 'error');
      return;
    }
    exportToPDF(getExamData());
  };

  const handleDownloadWord = async () => {
    if (questions.length === 0) {
      showNotification('ابتدا سوال اضافه کنید.', 'error');
      return;
    }
    try {
      await exportToWord(getExamData());
      showNotification('فایل Word با موفقیت دانلود شد! ✅');
    } catch {
      showNotification('خطا در تولید فایل Word.', 'error');
    }
  };

  const handleNewExam = () => {
    if (questions.length > 0 && !confirm('آیا مطمئن هستید؟ آزمون فعلی پاک می‌شود.')) return;
    setHeader(defaultHeader);
    setQuestions([]);
    setExamId(uuidv4());
  };

  const handleEditExam = (exam: ExamData) => {
    setHeader(exam.header);
    setQuestions(exam.questions);
    setExamId(exam.id);
    setActiveTab('designer');
    showNotification('آزمون برای ویرایش بارگذاری شد.');
  };

  const getQuestionsOfType = (type: QuestionType) =>
    questions.filter(q => q.type === type);

  const getStartIndexForType = (type: QuestionType): number => {
    const order: QuestionType[] = [
      'true-false', 'fill-blank', 'matching',
      'multiple-choice', 'short-answer', 'descriptive'
    ];
    let idx = 1;
    for (const t of order) {
      if (t === type) return idx;
      idx += getQuestionsOfType(t).length;
    }
    return idx;
  };

  const questionsByType = Object.fromEntries(
    QUESTION_TYPES.map(qt => [qt.type, getQuestionsOfType(qt.type)])
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50" dir="rtl">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-xl text-white font-medium transition-all ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-l from-blue-900 via-blue-800 to-indigo-900 text-white shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                📚
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">طراح سوالات پیشرفته</h1>
                <p className="text-blue-300 text-xs">آموزش و پرورش</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setActiveTab('designer')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'designer'
                    ? 'bg-white text-blue-800'
                    : 'text-blue-200 hover:bg-blue-700/50'
                }`}
              >
                <PlusCircle size={16} /> طراحی آزمون
              </button>
              <button
                onClick={() => { setActiveTab('saved'); setSavedExams(getAllExams()); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'saved'
                    ? 'bg-white text-blue-800'
                    : 'text-blue-200 hover:bg-blue-700/50'
                }`}
              >
                <List size={16} /> آزمون‌های ذخیره شده
                {savedExams.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {savedExams.length}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-blue-700/50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pb-2 flex flex-col gap-2">
              <button
                onClick={() => { setActiveTab('designer'); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm ${activeTab === 'designer' ? 'bg-white text-blue-800' : 'text-blue-200 hover:bg-blue-700/50'}`}
              >
                <PlusCircle size={16} /> طراحی آزمون
              </button>
              <button
                onClick={() => { setActiveTab('saved'); setSavedExams(getAllExams()); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm ${activeTab === 'saved' ? 'bg-white text-blue-800' : 'text-blue-200 hover:bg-blue-700/50'}`}
              >
                <List size={16} /> آزمون‌های ذخیره شده
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'designer' ? (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
            {/* Main Content */}
            <div className="space-y-5">
              {/* Header Form */}
              <HeaderForm header={header} onChange={setHeader} />

              {/* Question Sections */}
              <div>
                <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-blue-600" />
                  سوالات آزمون
                  {questions.length > 0 && (
                    <span className="text-sm font-normal bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full">
                      {questions.length} سوال · {totalScore} نمره
                    </span>
                  )}
                </h2>

                <div className="space-y-4">
                  {QUESTION_TYPES.map(qt => (
                    <QuestionSection
                      key={qt.type}
                      type={qt.type}
                      questions={questionsByType[qt.type] || []}
                      allQuestionsCount={questions.length}
                      startIndex={getStartIndexForType(qt.type)}
                      onAdd={handleAddQuestion}
                      onUpdate={handleUpdateQuestion}
                      onDelete={handleDeleteQuestion}
                      icon={qt.icon}
                      bgColor={qt.bgColor}
                      borderColor={qt.borderColor}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Score Summary */}
              <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-5 sticky top-24">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <span>📊</span> خلاصه آزمون
                </h3>

                {/* Score by type */}
                <div className="space-y-2 mb-4">
                  {QUESTION_TYPES.map(qt => {
                    const qs = questionsByType[qt.type] || [];
                    if (qs.length === 0) return null;
                    const score = qs.reduce((s, q) => s + q.score, 0);
                    return (
                      <div key={qt.type} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <span>{qt.icon}</span>
                          {QUESTION_TYPE_LABELS[qt.type]}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs">{qs.length} سوال</span>
                          <span className="font-bold text-blue-700">{score} نمره</span>
                        </div>
                      </div>
                    );
                  })}

                  {questions.length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-2">هنوز سوالی اضافه نشده</p>
                  )}
                </div>

                {/* Total */}
                <div className={`flex items-center justify-between p-3 rounded-xl font-bold ${
                  totalScore === 20
                    ? 'bg-green-100 text-green-800'
                    : totalScore > 20
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  <span>مجموع بارم:</span>
                  <span className="text-xl">{totalScore} نمره</span>
                </div>

                {totalScore !== 20 && totalScore > 0 && (
                  <p className={`text-xs mt-2 text-center ${totalScore > 20 ? 'text-red-500' : 'text-amber-600'}`}>
                    {totalScore > 20
                      ? `⚠️ ${totalScore - 20} نمره اضافه دارید`
                      : `💡 ${20 - totalScore} نمره باقی مانده تا ۲۰`
                    }
                  </p>
                )}

                {totalScore === 20 && (
                  <p className="text-xs mt-2 text-center text-green-600">✅ بارم‌بندی کامل است!</p>
                )}

                {/* Actions */}
                <div className="mt-5 space-y-2">
                  <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    <Save size={18} /> ذخیره آزمون
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-all"
                  >
                    <Printer size={18} /> پرینت / PDF
                  </button>
                  <button
                    onClick={handleDownloadWord}
                    className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl transition-all"
                  >
                    <Download size={18} /> دانلود Word
                  </button>
                  <button
                    onClick={handleNewExam}
                    className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 hover:bg-gray-50 text-gray-600 font-medium py-2.5 rounded-xl transition-all"
                  >
                    <Trash2 size={16} /> آزمون جدید
                  </button>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <h4 className="font-bold text-amber-800 mb-3 text-sm flex items-center gap-2">
                  💡 راهنمای سریع
                </h4>
                <ul className="space-y-1.5 text-xs text-amber-700">
                  <li>• روی هر نوع سوال کلیک کنید تا باز شود</li>
                  <li>• بارم از ۰.۲۵ تا ۱۰ نمره قابل تنظیم است</li>
                  <li>• سوالات قابل ویرایش و حذف هستند</li>
                  <li>• برای جاخالی از ___ استفاده کنید</li>
                  <li>• خروجی PDF و Word پشتیبانی فارسی دارند</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <List size={22} className="text-blue-600" /> آزمون‌های ذخیره شده
              </h2>
              <button
                onClick={() => { setActiveTab('designer'); handleNewExam(); }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition-all"
              >
                <PlusCircle size={16} /> آزمون جدید
              </button>
            </div>
            <ExamList
              exams={savedExams}
              onEdit={handleEditExam}
              onRefresh={() => setSavedExams(getAllExams())}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white/50 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p className="font-medium text-gray-700">سامانه طراح سوالات پیشرفته آموزش و پرورش</p>
          <p className="text-xs mt-1">طراحی و ساخت سوالات آزمون به صورت حرفه‌ای</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
