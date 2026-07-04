import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MatchingQuestion, MatchingItem } from '../../types';
import ScoreSelector from './ScoreSelector';
import { Plus, Trash2 } from 'lucide-react';

interface MatchingFormProps {
  onAdd: (question: MatchingQuestion) => void;
  editingQuestion?: MatchingQuestion | null;
  onUpdate?: (question: MatchingQuestion) => void;
  onCancel?: () => void;
  questionCount: number;
}

const MatchingForm: React.FC<MatchingFormProps> = ({
  onAdd, editingQuestion, onUpdate, onCancel, questionCount
}) => {
  const [text, setText] = useState(editingQuestion?.text || 'موارد ستون الف را با ستون ب جور کنید.');
  const [items, setItems] = useState<MatchingItem[]>(
    editingQuestion?.items || [
      { id: uuidv4(), left: '', right: '' },
      { id: uuidv4(), left: '', right: '' },
      { id: uuidv4(), left: '', right: '' },
    ]
  );
  const [score, setScore] = useState(editingQuestion?.score || 1);
  const [error, setError] = useState('');

  const addItem = () => setItems([...items, { id: uuidv4(), left: '', right: '' }]);
  const removeItem = (id: string) => {
    if (items.length <= 2) return;
    setItems(items.filter(item => item.id !== id));
  };
  const updateItem = (id: string, field: 'left' | 'right', value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = () => {
    const validItems = items.filter(item => item.left.trim() || item.right.trim());
    if (validItems.length < 2) {
      setError('حداقل ۲ ردیف باید پر شده باشد.');
      return;
    }
    setError('');

    if (editingQuestion && onUpdate) {
      onUpdate({ ...editingQuestion, text: text.trim(), items: validItems, score });
    } else {
      onAdd({
        id: uuidv4(),
        type: 'matching',
        text: text.trim(),
        items: validItems,
        score,
        order: questionCount + 1,
      });
      setText('موارد ستون الف را با ستون ب جور کنید.');
      setItems([
        { id: uuidv4(), left: '', right: '' },
        { id: uuidv4(), left: '', right: '' },
        { id: uuidv4(), left: '', right: '' },
      ]);
      setScore(1);
    }
  };

  const persianLetters = ['الف', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ی'];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">دستورالعمل سوال</label>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 text-right"
          dir="rtl"
          placeholder="دستورالعمل جورکردنی..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">جفت‌ها <span className="text-red-500">*</span></label>
          <button
            type="button"
            onClick={addItem}
            disabled={items.length >= 10}
            className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 disabled:opacity-40"
          >
            <Plus size={14} /> افزودن ردیف
          </button>
        </div>

        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 mb-2">
          <div></div>
          <div className="text-center text-xs font-bold text-gray-500 bg-gray-100 py-1.5 rounded">ستون الف</div>
          <div className="text-center text-xs font-bold text-gray-500 bg-gray-100 py-1.5 rounded">ستون ب</div>
          <div></div>
        </div>

        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={item.id} className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center">
              <div className="text-xs font-bold text-gray-500 w-8 text-center">
                {i + 1}
              </div>
              <input
                type="text"
                value={item.left}
                onChange={e => updateItem(item.id, 'left', e.target.value)}
                placeholder={`گزینه ${i + 1}`}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 text-right"
                dir="rtl"
              />
              <input
                type="text"
                value={item.right}
                onChange={e => updateItem(item.id, 'right', e.target.value)}
                placeholder={`${persianLetters[i] || i + 1}`}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 text-right"
                dir="rtl"
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                disabled={items.length <= 2}
                className="text-red-400 hover:text-red-600 disabled:opacity-30 p-1"
              >
                <Trash2 size={16} />
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
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md"
            >
              <Plus size={18} /> افزودن سوال
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchingForm;
