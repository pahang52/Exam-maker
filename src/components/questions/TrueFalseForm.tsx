import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TrueFalseQuestion } from '../../types';
import ScoreSelector from './ScoreSelector';
import { Plus, CheckCircle, XCircle } from 'lucide-react';

interface TrueFalseFormProps {
  onAdd: (question: TrueFalseQuestion) => void;
  editingQuestion?: TrueFalseQuestion | null;
  onUpdate?: (question: TrueFalseQuestion) => void;
  onCancel?: () => void;
  questionCount: number;
}

const TrueFalseForm: React.FC<TrueFalseFormProps> = ({
  onAdd, editingQuestion, onUpdate, onCancel, questionCount
}) => {
  const [text, setText] = useState(editingQuestion?.text || '');
  const [answer, setAnswer] = useState<boolean | null>(editingQuestion?.answer ?? null);
  const [score, setScore] = useState(editingQuestion?.score || 0.5);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) {
      setError('متن سوال را وارد کنید.');
      return;
    }
    setError('');

    if (editingQuestion && onUpdate) {
      onUpdate({ ...editingQuestion, text: text.trim(), answer, score });
    } else {
      onAdd({
        id: uuidv4(),
        type: 'true-false',
        text: text.trim(),
        answer,
        score,
        order: questionCount + 1,
      });
      setText('');
      setAnswer(null);
      setScore(0.5);
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
          placeholder="جمله‌ای بنویسید که دانش‌آموز باید صحت یا غلط بودن آن را تعیین کند..."
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none text-right"
          dir="rtl"
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">پاسخ صحیح (اختیاری):</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAnswer(answer === true ? null : true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                answer === true
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-green-300'
              }`}
            >
              <CheckCircle size={16} />
              صحیح
            </button>
            <button
              type="button"
              onClick={() => setAnswer(answer === false ? null : false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                answer === false
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-red-300'
              }`}
            >
              <XCircle size={16} />
              غلط
            </button>
          </div>
        </div>

        <div className="mr-auto">
          <ScoreSelector value={score} onChange={setScore} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        {editingQuestion ? (
          <>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all"
            >
              ✓ ذخیره تغییرات
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
            >
              انصراف
            </button>
          </>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            افزودن سوال
          </button>
        )}
      </div>
    </div>
  );
};

export default TrueFalseForm;
