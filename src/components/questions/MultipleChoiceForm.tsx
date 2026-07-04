import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MultipleChoiceQuestion, MultipleChoiceOption } from '../../types';
import ScoreSelector from './ScoreSelector';
import { Plus, Trash2 } from 'lucide-react';

interface MultipleChoiceFormProps {
  onAdd: (question: MultipleChoiceQuestion) => void;
  editingQuestion?: MultipleChoiceQuestion | null;
  onUpdate?: (question: MultipleChoiceQuestion) => void;
  onCancel?: () => void;
  questionCount: number;
}

const MultipleChoiceForm: React.FC<MultipleChoiceFormProps> = ({
  onAdd, editingQuestion, onUpdate, onCancel, questionCount
}) => {
  const [text, setText] = useState(editingQuestion?.text || '');
  const [options, setOptions] = useState<MultipleChoiceOption[]>(
    editingQuestion?.options || [
      { id: uuidv4(), text: '', isCorrect: false },
      { id: uuidv4(), text: '', isCorrect: false },
      { id: uuidv4(), text: '', isCorrect: false },
      { id: uuidv4(), text: '', isCorrect: false },
    ]
  );
  const [score, setScore] = useState(editingQuestion?.score || 1);
  const [error, setError] = useState('');

  const letters = ['الف', 'ب', 'ج', 'د', 'ه', 'و'];

  const updateOption = (id: string, field: 'text' | 'isCorrect', value: string | boolean) => {
    if (field === 'isCorrect') {
      setOptions(options.map(opt => ({ ...opt, isCorrect: opt.id === id ? true : false })));
    } else {
      setOptions(options.map(opt => opt.id === id ? { ...opt, text: value as string } : opt));
    }
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { id: uuidv4(), text: '', isCorrect: false }]);
    }
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return;
    const removed = options.find(o => o.id === id);
    const newOptions = options.filter(o => o.id !== id);
    if (removed?.isCorrect && newOptions.length > 0) {
      newOptions[0].isCorrect = false;
    }
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      setError('متن سوال را وارد کنید.');
      return;
    }
    const filledOptions = options.filter(o => o.text.trim());
    if (filledOptions.length < 2) {
      setError('حداقل ۲ گزینه باید پر شده باشد.');
      return;
    }
    setError('');

    const finalOptions = filledOptions;

    if (editingQuestion && onUpdate) {
      onUpdate({ ...editingQuestion, text: text.trim(), options: finalOptions, score });
    } else {
      onAdd({
        id: uuidv4(),
        type: 'multiple-choice',
        text: text.trim(),
        options: finalOptions,
        score,
        order: questionCount + 1,
      });
      setText('');
      setOptions([
        { id: uuidv4(), text: '', isCorrect: false },
        { id: uuidv4(), text: '', isCorrect: false },
        { id: uuidv4(), text: '', isCorrect: false },
        { id: uuidv4(), text: '', isCorrect: false },
      ]);
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
          placeholder="متن سوال چهارگزینه‌ای را بنویسید..."
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none text-right"
          dir="rtl"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">
            گزینه‌ها <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 mr-2">(گزینه صحیح را علامت بزنید)</span>
          </label>
          <button
            type="button"
            onClick={addOption}
            disabled={options.length >= 6}
            className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 disabled:opacity-40"
          >
            <Plus size={14} /> افزودن گزینه
          </button>
        </div>

        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={opt.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateOption(opt.id, 'isCorrect', true)}
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  opt.isCorrect
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 hover:border-green-400'
                }`}
                title="گزینه صحیح"
              >
                {opt.isCorrect && <span className="text-xs">✓</span>}
              </button>
              <span className="text-sm font-bold text-gray-600 w-8 text-center">{letters[i]})</span>
              <input
                type="text"
                value={opt.text}
                onChange={e => updateOption(opt.id, 'text', e.target.value)}
                placeholder={`گزینه ${letters[i]}`}
                className={`flex-1 px-3 py-2 border-2 rounded-lg text-sm focus:outline-none text-right transition-all ${
                  opt.isCorrect
                    ? 'border-green-300 bg-green-50 focus:border-green-400'
                    : 'border-gray-200 focus:border-orange-400'
                }`}
                dir="rtl"
              />
              <button
                type="button"
                onClick={() => removeOption(opt.id)}
                disabled={options.length <= 2}
                className="text-red-400 hover:text-red-600 disabled:opacity-30 p-1"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
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
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md"
            >
              <Plus size={18} /> افزودن سوال
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceForm;
