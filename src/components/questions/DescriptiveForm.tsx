import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DescriptiveQuestion } from '../../types';
import ScoreSelector from './ScoreSelector';
import { Plus } from 'lucide-react';

interface DescriptiveFormProps {
  onAdd: (question: DescriptiveQuestion) => void;
  editingQuestion?: DescriptiveQuestion | null;
  onUpdate?: (question: DescriptiveQuestion) => void;
  onCancel?: () => void;
  questionCount: number;
}

const DescriptiveForm: React.FC<DescriptiveFormProps> = ({
  onAdd, editingQuestion, onUpdate, onCancel, questionCount
}) => {
  const [text, setText] = useState(editingQuestion?.text || '');
  const [answerGuide, setAnswerGuide] = useState(editingQuestion?.answerGuide || '');
  const [lines, setLines] = useState(editingQuestion?.lines || 5);
  const [score, setScore] = useState(editingQuestion?.score || 2);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) {
      setError('متن سوال را وارد کنید.');
      return;
    }
    setError('');

    if (editingQuestion && onUpdate) {
      onUpdate({ ...editingQuestion, text: text.trim(), answerGuide, lines, score });
    } else {
      onAdd({
        id: uuidv4(),
        type: 'descriptive',
        text: text.trim(),
        answerGuide,
        lines,
        score,
        order: questionCount + 1,
      });
      setText('');
      setAnswerGuide('');
      setLines(5);
      setScore(2);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          متن سوال <span className="text-red-500">*</span>
        </label>
        <textarea
          value={text}
          onChange={e => { setText(e.target.value); setError(''); }}
          placeholder="سوال تشریحی را بنویسید..."
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none text-right"
          dir="rtl"
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          راهنمای پاسخ (اختیاری، فقط برای دبیر):
        </label>
        <textarea
          value={answerGuide}
          onChange={e => setAnswerGuide(e.target.value)}
          placeholder="نکات کلیدی پاسخ را برای راهنمایی دبیر بنویسید..."
          rows={2}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-300 resize-none text-right bg-amber-50"
          dir="rtl"
        />
      </div>

      <div className="flex items-center gap-6 flex-wrap">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">تعداد خطوط پاسخ:</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLines(Math.max(1, lines - 1))}
              className="w-9 h-9 rounded-lg border-2 border-gray-200 flex items-center justify-center text-lg font-bold hover:bg-gray-100"
            >−</button>
            <span className="w-12 text-center font-bold text-lg">{lines}</span>
            <button
              type="button"
              onClick={() => setLines(Math.min(15, lines + 1))}
              className="w-9 h-9 rounded-lg border-2 border-gray-200 flex items-center justify-center text-lg font-bold hover:bg-gray-100"
            >+</button>
            <span className="text-sm text-gray-500">خط</span>
          </div>
        </div>

        <div className="mr-auto">
          <ScoreSelector value={score} onChange={setScore} />
        </div>
      </div>

      {/* Preview of lines */}
      <div className="bg-gray-50 rounded-xl p-3 border border-dashed border-gray-200">
        <p className="text-xs text-gray-500 mb-2">پیش‌نمایش فضای پاسخ ({lines} خط):</p>
        <div className="space-y-2">
          {Array(Math.min(lines, 4)).fill(0).map((_, i) => (
            <div key={i} className="border-b border-gray-300 h-6"></div>
          ))}
          {lines > 4 && <p className="text-xs text-gray-400 text-center">... {lines - 4} خط دیگر</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {editingQuestion ? (
          <>
            <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all">✓ ذخیره</button>
            <button onClick={onCancel} className="px-5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">انصراف</button>
          </>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md"
          >
            <Plus size={18} /> افزودن سوال
          </button>
        )}
      </div>
    </div>
  );
};

export default DescriptiveForm;
