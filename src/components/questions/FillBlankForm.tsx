import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FillBlankQuestion } from '../../types';
import ScoreSelector from './ScoreSelector';
import { Plus } from 'lucide-react';

interface FillBlankFormProps {
  onAdd: (question: FillBlankQuestion) => void;
  editingQuestion?: FillBlankQuestion | null;
  onUpdate?: (question: FillBlankQuestion) => void;
  onCancel?: () => void;
  questionCount: number;
}

const FillBlankForm: React.FC<FillBlankFormProps> = ({
  onAdd, editingQuestion, onUpdate, onCancel, questionCount
}) => {
  const [text, setText] = useState(editingQuestion?.text || '');
  const [blanks, setBlanks] = useState<string[]>(editingQuestion?.blanks || ['']);
  const [score, setScore] = useState(editingQuestion?.score || 1);
  const [error, setError] = useState('');

  const addBlank = () => setBlanks([...blanks, '']);
  const removeBlank = (i: number) => setBlanks(blanks.filter((_, idx) => idx !== i));
  const updateBlank = (i: number, value: string) => {
    const newBlanks = [...blanks];
    newBlanks[i] = value;
    setBlanks(newBlanks);
  };

  const insertBlankToText = () => {
    setText(prev => prev + ' ___ ');
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      setError('متن سوال را وارد کنید. از ___ برای جاخالی استفاده کنید.');
      return;
    }
    setError('');

    if (editingQuestion && onUpdate) {
      onUpdate({ ...editingQuestion, text: text.trim(), blanks, score });
    } else {
      onAdd({
        id: uuidv4(),
        type: 'fill-blank',
        text: text.trim(),
        blanks,
        score,
        order: questionCount + 1,
      });
      setText('');
      setBlanks(['']);
      setScore(1);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          متن سوال <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-blue-600 mb-2 bg-blue-50 px-3 py-2 rounded-lg">
          💡 برای جاخالی از سه خط زیر ( ___ ) استفاده کنید یا روی دکمه «درج جاخالی» کلیک کنید.
        </p>
        <div className="relative">
          <textarea
            value={text}
            onChange={e => { setText(e.target.value); setError(''); }}
            placeholder="مثال: کشور ایران در قاره ___ واقع شده و پایتخت آن ___ است."
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none text-right"
            dir="rtl"
          />
          <button
            type="button"
            onClick={insertBlankToText}
            className="absolute bottom-3 left-3 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg transition-all font-medium"
          >
            + درج جاخالی (___)
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">پاسخ‌های صحیح (اختیاری):</label>
          <button
            type="button"
            onClick={addBlank}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Plus size={14} /> افزودن پاسخ
          </button>
        </div>
        <div className="space-y-2">
          {blanks.map((blank, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-xs text-gray-500 w-16 text-center">جای {i + 1}:</span>
              <input
                type="text"
                value={blank}
                onChange={e => updateBlank(i, e.target.value)}
                placeholder={`پاسخ جاخالی ${i + 1}`}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 text-right"
                dir="rtl"
              />
              {blanks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBlank(i)}
                  className="text-red-400 hover:text-red-600 text-sm px-2"
                >✕</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ScoreSelector value={score} onChange={setScore} />

        <div className="flex gap-3">
          {editingQuestion ? (
            <>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all"
              >
                ✓ ذخیره
              </button>
              <button
                onClick={onCancel}
                className="px-5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                انصراف
              </button>
            </>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md"
            >
              <Plus size={18} />
              افزودن سوال
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FillBlankForm;
