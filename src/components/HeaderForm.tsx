import React, { useState } from 'react';
import { HeaderInfo } from '../types';
import { ChevronDown, ChevronUp, School } from 'lucide-react';

interface HeaderFormProps {
  header: HeaderInfo;
  onChange: (header: HeaderInfo) => void;
}

const HeaderForm: React.FC<HeaderFormProps> = ({ header, onChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (field: keyof HeaderInfo, value: string) => {
    onChange({ ...header, [field]: value });
  };

  const fields: { key: keyof HeaderInfo; label: string; placeholder: string; icon: string }[] = [
    { key: 'schoolName', label: 'نام دبیرستان', placeholder: 'مثال: دبیرستان شهید بهشتی', icon: '🏫' },
    { key: 'studentName', label: 'نام و نام خانوادگی', placeholder: 'نام دانش‌آموز', icon: '👤' },
    { key: 'fatherName', label: 'نام پدر', placeholder: 'نام پدر دانش‌آموز', icon: '👨' },
    { key: 'subject', label: 'درس', placeholder: 'مثال: ریاضی، فیزیک', icon: '📚' },
    { key: 'grade', label: 'پایه', placeholder: 'مثال: دهم، یازدهم، دوازدهم', icon: '🎓' },
    { key: 'academicYear', label: 'سال تحصیلی', placeholder: 'مثال: ۱۴۰۳-۱۴۰۴', icon: '📅' },
    { key: 'date', label: 'تاریخ', placeholder: 'تاریخ برگزاری آزمون', icon: '🗓️' },
    { key: 'teacherName', label: 'نام دبیر', placeholder: 'نام معلم', icon: '👩‍🏫' },
    { key: 'examTitle', label: 'عنوان آزمون', placeholder: 'مثال: آزمون نوبت اول', icon: '📝' },
  ];

  const filledCount = Object.values(header).filter(v => typeof v === 'string' && v.trim()).length;
  const hasPreview = Object.values(header).some(v => typeof v === 'string' && v.trim());

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          background: 'linear-gradient(to left, #2563eb, #1e40af)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <School size={18} />
          سربرگ آزمون
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {filledCount} / {fields.length} پر شده
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {isOpen && (
        <div style={{ padding: 20, background: '#fff' }}>
          <div style={{ marginBottom: 16, color: '#6b7280' }}>
            تمام فیلدهای سربرگ اختیاری هستند. فقط موارد پر شده در خروجی نمایش داده می‌شوند.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {fields.map(field => (
              <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 14, fontWeight: 600 }}>
                  {field.icon} {field.label}
                </label>
                <input
                  value={header[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 10,
                    outline: 'none',
                    textAlign: 'right',
                    background: '#f9fafb',
                  }}
                  dir="rtl"
                />
              </div>
            ))}
          </div>

          {hasPreview && (
            <div style={{ marginTop: 20, padding: 16, border: '1px dashed #cbd5e1', borderRadius: 12, background: '#f8fafc' }}>
              <div style={{ fontWeight: 'bold', marginBottom: 8 }}>پیش‌نمایش سربرگ</div>
              <div>بسمه تعالی</div>
              <div>اداره آموزش و پرورش</div>
              {header.schoolName && <div>{header.schoolName}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderForm;
