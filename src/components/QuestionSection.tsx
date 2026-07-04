import React, { useState } from 'react';
import {
  Question, QuestionType, QUESTION_TYPE_LABELS, QUESTION_TYPE_COLORS,
  TrueFalseQuestion, FillBlankQuestion, MatchingQuestion,
  MultipleChoiceQuestion, ShortAnswerQuestion, DescriptiveQuestion
} from '../types';
import TrueFalseForm from './questions/TrueFalseForm';
import FillBlankForm from './questions/FillBlankForm';
import MatchingForm from './questions/MatchingForm';
import MultipleChoiceForm from './questions/MultipleChoiceForm';
import ShortAnswerForm from './questions/ShortAnswerForm';
import DescriptiveForm from './questions/DescriptiveForm';
import QuestionCard from './QuestionCard';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionSectionProps {
  type: QuestionType;
  questions: Question[];
  allQuestionsCount: number;
  startIndex: number;
  onAdd: (question: Question) => void;
  onUpdate: (question: Question) => void;
  onDelete: (id: string) => void;
  icon: string;
  bgColor: string;
  borderColor: string;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({
  type, questions, allQuestionsCount, startIndex, onAdd, onUpdate, onDelete,
  icon, bgColor, borderColor
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const totalScore = questions.reduce((sum, q) => sum + q.score, 0);
  const label = QUESTION_TYPE_LABELS[type];
  const colorClass = QUESTION_TYPE_COLORS[type];

  const renderForm = () => {
    const commonProps = { questionCount: allQuestionsCount };
    if (editingQuestion) {
      switch (editingQuestion.type) {
        case 'true-false':
          return <TrueFalseForm
            {...commonProps}
            onAdd={() => {}}
            editingQuestion={editingQuestion as TrueFalseQuestion}
            onUpdate={(q) => { onUpdate(q); setEditingQuestion(null); }}
            onCancel={() => setEditingQuestion(null)}
          />;
        case 'fill-blank':
          return <FillBlankForm
            {...commonProps}
            onAdd={() => {}}
            editingQuestion={editingQuestion as FillBlankQuestion}
            onUpdate={(q) => { onUpdate(q); setEditingQuestion(null); }}
            onCancel={() => setEditingQuestion(null)}
          />;
        case 'matching':
          return <MatchingForm
            {...commonProps}
            onAdd={() => {}}
            editingQuestion={editingQuestion as MatchingQuestion}
            onUpdate={(q) => { onUpdate(q); setEditingQuestion(null); }}
            onCancel={() => setEditingQuestion(null)}
          />;
        case 'multiple-choice':
          return <MultipleChoiceForm
            {...commonProps}
            onAdd={() => {}}
            editingQuestion={editingQuestion as MultipleChoiceQuestion}
            onUpdate={(q) => { onUpdate(q); setEditingQuestion(null); }}
            onCancel={() => setEditingQuestion(null)}
          />;
        case 'short-answer':
          return <ShortAnswerForm
            {...commonProps}
            onAdd={() => {}}
            editingQuestion={editingQuestion as ShortAnswerQuestion}
            onUpdate={(q) => { onUpdate(q); setEditingQuestion(null); }}
            onCancel={() => setEditingQuestion(null)}
          />;
        case 'descriptive':
          return <DescriptiveForm
            {...commonProps}
            onAdd={() => {}}
            editingQuestion={editingQuestion as DescriptiveQuestion}
            onUpdate={(q) => { onUpdate(q); setEditingQuestion(null); }}
            onCancel={() => setEditingQuestion(null)}
          />;
      }
    }

    switch (type) {
      case 'true-false':
        return <TrueFalseForm {...commonProps} onAdd={(q) => { onAdd(q); }} />;
      case 'fill-blank':
        return <FillBlankForm {...commonProps} onAdd={(q) => { onAdd(q); }} />;
      case 'matching':
        return <MatchingForm {...commonProps} onAdd={(q) => { onAdd(q); }} />;
      case 'multiple-choice':
        return <MultipleChoiceForm {...commonProps} onAdd={(q) => { onAdd(q); }} />;
      case 'short-answer':
        return <ShortAnswerForm {...commonProps} onAdd={(q) => { onAdd(q); }} />;
      case 'descriptive':
        return <DescriptiveForm {...commonProps} onAdd={(q) => { onAdd(q); }} />;
    }
  };

  return (
    <div className={`rounded-2xl border-2 ${borderColor} overflow-hidden shadow-sm`}>
      {/* Section Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-6 py-4 ${bgColor} hover:opacity-90 transition-all`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div className="text-right">
            <h3 className="font-bold text-gray-800 text-base">{label}</h3>
            <p className="text-gray-500 text-sm">
              {questions.length} سوال
              {questions.length > 0 && ` · بارم کل: ${totalScore} نمره`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {questions.length > 0 && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${colorClass}`}>
              {questions.length} سوال
            </span>
          )}
          {isOpen ? <ChevronUp size={20} className="text-gray-600" /> : <ChevronDown size={20} className="text-gray-600" />}
        </div>
      </button>

      {isOpen && (
        <div className="bg-white">
          {/* Form */}
          <div className="p-6 border-b border-gray-100">
            <h4 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
              <span>📝</span>
              {editingQuestion ? 'ویرایش سوال' : 'افزودن سوال جدید'}
            </h4>
            {renderForm()}
          </div>

          {/* Questions List */}
          {questions.length > 0 && (
            <div className="p-4">
              <h4 className="text-sm font-bold text-gray-500 mb-3">
                سوال‌های این بخش ({questions.length} مورد):
              </h4>
              <div className="space-y-2">
                {questions.map((q, i) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    globalIndex={startIndex + i}
                    onEdit={(question) => {
                      setEditingQuestion(question);
                      setIsOpen(true);
                    }}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionSection;
