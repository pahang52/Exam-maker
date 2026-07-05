import React from 'react';
import { ExamData } from '../types';

interface Props {
  exams: ExamData[];
  onSelect?: (exam: ExamData) => void;
}

const ExamList: React.FC<Props> = ({ exams, onSelect }) => {
  if (!exams || exams.length === 0) {
    return <div>هیچ آزمونی نیست</div>;
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {exams.map((exam, index) => (
        <div
          key={exam.id || index}
          style={{
            border: '1px solid #ddd',
            padding: 12,
            borderRadius: 8,
            background: '#fff',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
            {exam.header?.examTitle || 'آزمون'}
          </div>

          <div>درس: {exam.header?.subject || '-'}</div>
          <div>نمره کل: {exam.totalScore ?? 0}</div>

          <div style={{ marginTop: 8 }}>
            {exam.questions?.map((q, i) => (
              <div key={q.id || i}>
                {i + 1}) {q.text} ({q.score})
              </div>
            ))}
          </div>

          {onSelect && (
            <button
              onClick={() => onSelect(exam)}
              style={{ marginTop: 12 }}
            >
              باز کردن
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExamList;
