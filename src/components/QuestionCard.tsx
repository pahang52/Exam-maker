import React from 'react';
import {
  Question, QUESTION_TYPE_LABELS, QUESTION_TYPE_COLORS,
  TrueFalseQuestion, FillBlankQuestion, MatchingQuestion,
  MultipleChoiceQuestion, ShortAnswerQuestion, DescriptiveQuestion
} from '../types';
import { Edit2, Trash2, GripVertical } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  globalIndex: number;
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, globalIndex, onEdit, onDelete }) => {
  const colorClass = QUESTION_TYPE_COLORS[question.type];
  const typeLabel = QUESTION_TYPE_LABELS[question.type];

  const renderPreview = () => {
    switch (question.type) {
      case 'true-false': {
        const q = question as TrueFalseQuestion;
        return (
          <div>
            <p className="text-gray-800 leading-relaxed mb-2">{q.text}</p>
            <div className="flex gap-4 text-sm">
              <span className={`px-3 py-1 rounded-full border ${q.answer === true ? 'bg-green-100 border-green-300 text-green-700 font-bold' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                ✓ صحیح
              </span>
              <span className={`px-3 py-1 rounded-full border ${q.answer === false ? 'bg-red-100 border-red-300 text-red-700 font-bold' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                ✗ غلط
              </span>
              {q.answer === null && <span className="text-xs text-gray-400 mt-1">پاسخ تعیین نشده</span>}
            </div>
          </div>
        );
      }

      case 'fill-blank': {
        const q = question as FillBlankQuestion;
        const highlighted = q.text.replace(/_{3,}/g, '<span class="inline-block border-b-2 border-blue-400 min-w-[60px] mx-1 text-center text-blue-500">___</span>');
        return (
          <div>
            <p className="text-gray-800 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: highlighted }} />
            {q.blanks.some(b => b.trim()) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {q.blanks.filter(b => b.trim()).map((blank, i) => (
                  <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    پاسخ {i + 1}: {blank}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      }

      case 'matching': {
        const q = question as MatchingQuestion;
        return (
          <div>
            <p className="text-gray-600 text-sm mb-2 italic">{q.text}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-purple-50 rounded-lg p-2">
                <div className="text-xs font-bold text-purple-600 mb-1">ستون الف</div>
                {q.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="text-gray-700 truncate">{i + 1}) {item.left}</div>
                ))}
                {q.items.length > 3 && <div className="text-xs text-gray-400">+{q.items.length - 3} مورد دیگر</div>}
              </div>
              <div className="bg-indigo-50 rounded-lg p-2">
                <div className="text-xs font-bold text-indigo-600 mb-1">ستون ب</div>
                {q.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="text-gray-700 truncate">{['الف', 'ب', 'ج'][i]}) {item.right}</div>
                ))}
                {q.items.length > 3 && <div className="text-xs text-gray-400">+{q.items.length - 3} مورد دیگر</div>}
              </div>
            </div>
          </div>
        );
      }

      case 'multiple-choice': {
        const q = question as MultipleChoiceQuestion;
        const letters = ['الف', 'ب', 'ج', 'د', 'ه', 'و'];
        return (
          <div>
            <p className="text-gray-800 leading-relaxed mb-2">{q.text}</p>
            <div className="grid grid-cols-2 gap-1 text-sm">
              {q.options.map((opt, i) => (
                <div key={i} className={`flex items-center gap-2 px-2 py-1 rounded-lg ${opt.isCorrect ? 'bg-green-100 text-green-800' : 'text-gray-600'}`}>
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs flex-shrink-0 ${opt.isCorrect ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                    {opt.isCorrect ? '✓' : ''}
                  </span>
                  <span className="truncate">{letters[i]}) {opt.text}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'short-answer': {
        const q = question as ShortAnswerQuestion;
        return (
          <div>
            <p className="text-gray-800 leading-relaxed mb-2">{q.text}</p>
            {q.answer && (
              <div className="text-sm bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1.5">
                <span className="text-yellow-700 font-semibold">پاسخ: </span>
                <span className="text-gray-700">{q.answer}</span>
              </div>
            )}
          </div>
        );
      }

      case 'descriptive': {
        const q = question as DescriptiveQuestion;
        return (
          <div>
            <p className="text-gray-800 leading-relaxed mb-2">{q.text}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded">{q.lines} خط پاسخ</span>
              {q.answerGuide && (
                <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded truncate max-w-[200px]">
                  راهنما: {q.answerGuide}
                </span>
              )}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-gray-300 cursor-grab group-hover:text-gray-400">
              <GripVertical size={18} />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {globalIndex}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colorClass}`}>
                {typeLabel}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {question.score} نمره
              </span>
            </div>
            {renderPreview()}
          </div>

          <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(question)}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
              title="ویرایش"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(question.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="حذف"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
