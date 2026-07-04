import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ShortAnswerQuestion } from '../../types';
import ScoreSelector from './ScoreSelector';
import { Plus } from 'lucide-react';

interface ShortAnswerFormProps {
  onAdd: (question: ShortAnswerQuestion) => void;
  editingQuestion?: ShortAnswerQuestion | null;
  onUpdate?: (question: ShortAnswerQuestion) => void;
  onCancel?: () => void;
  questionCount: number;
}

const ShortAnswerForm: React.FC<ShortAnswerFormProps> = ({
  onAdd, editingQuestion, onUpdate, onCancel, questionCount
}) => {
  const [text, setText] = useState(editingQuestion?.text || '');
  const [answer, setAnswer] = useState(editingQuestion?.answer || '');
  const [score, setScore] = useState(editingQuestion?.score || 1);
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
        type: 'short-answer',
        text: text.trim(),
        answer,
        score,
        order: questionCount + 1,
      });
      setText('');
      setAnswer('');
      setScore(1);
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
          placeholder="سوال پاسخ کوتاه را بنویسید..."
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 resize-none text-right"
          dir="rtl"
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          پاسخ صحیح (اختیاری، برای راهنمای دبیر):
        </label>
        <input
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="پاسخ کوتاه سوال..."
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 text-right"
          dir="rtl"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <ScoreSelector value={score} onChange={setScore} />
        <div className="flex gap-3">
          {editingQuestion ? (
            <>
              <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all">✓ ذخیره</button>
              <button onClick={onCancel} className="px-5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">انصراف</button>
            </>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md"
            >
              <Plus size={18} /> افزودن سوال
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShortAnswerForm;
