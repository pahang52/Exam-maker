import React, { useState } from 'react';
import { ExamData } from '../types';
import { deleteExam } from '../utils/storage';
import { exportToPDF } from '../utils/pdfExport';
import { exportToWord } from '../utils/wordExport';
import { Trash2, Edit2, FileText, Download, Eye, BookOpen, Calendar, User, RefreshCw } from 'lucide-react';

interface ExamListProps {
  onEdit: (exam: ExamData) => void;
  onRefresh: () => void;
  exams: ExamData[];
}

const ExamList: React.FC<ExamListProps> = ({ onEdit, onRefresh, exams }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewExam, setPreviewExam] = useState<ExamData | null>(null);

  const handleDelete = (id: string) => {
    if (deletingId === id) {
      deleteExam(id);
      onRefresh();
      setDeletingId(null);
    } else {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 3000);
    }
  };

  if (exams.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-bold mb-2">هنوز آزمونی ذخیره نشده</h3>
        <p className="text-sm">آزمون‌های طراحی شده اینجا نمایش داده می‌شوند</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-gray-700">{exams.length} آزمون ذخیره شده</h3>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <RefreshCw size={14} /> بروزرسانی
        </button>
      </div>

      {exams.map(exam => (
        <div key={exam.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h4 className="font-bold text-gray-800">
                  {exam.header.examTitle || 'آزمون بدون عنوان'}
                </h4>
                {exam.header.subject && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {exam.header.subject}
                  </span>
                )}
                {exam.header.grade && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    {exam.header.grade}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                {exam.header.teacherName && (
                  <span className="flex items-center gap-1">
                    <User size={12} /> {exam.header.teacherName}
                  </span>
                )}
                {exam.header.date && (
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {exam.header.date}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <BookOpen size={12} /> {exam.questions.length} سوال
                </span>
                <span className="text-blue-600 font-medium">{exam.totalScore} نمره</span>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries({
                  'true-false': 'ص/غ',
                  'fill-blank': 'جاخالی',
                  'matching': 'جورکردنی',
                  'multiple-choice': 'تستی',
                  'short-answer': 'کوتاه',
                  'descriptive': 'تشریحی',
                }).map(([type, label]) => {
                  const count = exam.questions.filter(q => q.type === type).length;
                  if (count === 0) return null;
                  return (
                    <span key={type} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {label}: {count}
                    </span>
                  );
                })}
              </div>

              <div className="text-xs text-gray-400 mt-1">
                ذخیره: {new Date(exam.updatedAt).toLocaleDateString('fa-IR')}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(exam)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                  title="ویرایش"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setPreviewExam(previewExam?.id === exam.id ? null : exam)}
                  className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all"
                  title="پیش‌نمایش"
                >
                  <Eye size={16} />
                </button>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => exportToPDF(exam)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="خروجی PDF / پرینت"
                >
                  <FileText size={16} />
                </button>
                <button
                  onClick={() => exportToWord(exam)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                  title="دانلود Word"
                >
                  <Download size={16} />
                </button>
              </div>
              <button
                onClick={() => handleDelete(exam.id)}
                className={`p-2 rounded-lg transition-all ${
                  deletingId === exam.id
                    ? 'bg-red-500 text-white'
                    : 'text-red-400 hover:bg-red-50'
                }`}
                title={deletingId === exam.id ? 'تأیید حذف' : 'حذف'}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Mini Preview */}
          {previewExam?.id === exam.id && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="text-center mb-3">
                  <div className="font-bold">بسمه تعالی</div>
                  <div className="text-gray-600">{exam.header.schoolName || 'دبیرستان'}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  {exam.header.subject && <span>درس: {exam.header.subject}</span>}
                  {exam.header.grade && <span>پایه: {exam.header.grade}</span>}
                  {exam.header.teacherName && <span>دبیر: {exam.header.teacherName}</span>}
                </div>
                <div className="space-y-1">
                  {exam.questions.slice(0, 5).map((q, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="font-bold">{i + 1})</span>
                      <span className="truncate flex-1">{q.text || '...'}</span>
                      <span className="text-blue-600">{q.score}نمره</span>
                    </div>
                  ))}
                  {exam.questions.length > 5 && (
                    <div className="text-xs text-gray-400 text-center">
                      ... {exam.questions.length - 5} سوال دیگر
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => exportToPDF(exam)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-lg transition-all"
                >
                  <FileText size={14} /> پرینت / PDF
                </button>
                <button
                  onClick={() => exportToWord(exam)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-all"
                >
                  <Download size={14} /> دانلود Word
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExamList;
