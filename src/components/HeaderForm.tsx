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

  return (
    <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-l from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 transition-all"
      >
        <div className="flex items-center gap-3">
          <School size={22} />
          <div className="text-right">
            <h2 className="font-bold text-lg">سربرگ آزمون</h2>
            <p className="text-blue-200 text-sm">اطلاعات هدر برگه امتحان (اختیاری)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-200 bg-blue-700 px-3 py-1 rounded-full">
            {Object.values(header).filter(v => v && v.trim()).length} / {fields.length} پر شده
          </span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-sm text-amber-800 flex items-center gap-2">
            <span>ℹ️</span>
            <span>تمام فیلدهای سربرگ اختیاری هستند. فقط موارد پر شده در خروجی نمایش داده می‌شوند.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map(field => (
              <div key={field.key} className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <span>{field.icon}</span>
                  <span>{field.label}</span>
                </label>
                <input
                  type="text"
                  value={header[field.key]}
                  onChange={e => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-right bg-gray-50 focus:bg-white placeholder-gray-400"
                  dir="rtl"
                />
              </div>
            ))}
          </div>

          {/* Preview */}
          {Object.values(header).some(v => v && v.trim()) && (
            <div className="mt-6 border-2 border-dashed border-gray-200 rounded-xl p-4">
              <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">پیش‌نمایش سربرگ</h3>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-blue-800 text-white text-center py-3">
                  <div className="text-sm font-bold">بسمه تعالی</div>
                  <div className="font-bold">اداره آموزش و پرورش</div>
                  {header.schoolName && <div className="text-sm text-blue-200">{header.schoolName}</div>}
                </div>
                <div className="grid grid-cols-3 text-xs">
                  {[
                    { label: 'نام و نام خانوادگی', value: header.studentName },
                    { label: 'نام پدر', value: header.fatherName },
                    { label: 'درس', value: header.subject },
                    { label: 'پایه', value: header.grade },
                    { label: 'سال تحصیلی', value: header.academicYear },
                    { label: 'تاریخ', value: header.date },
                  ].map(item => (
                    <div key={item.label} className="border border-gray-200 p-2">
                      <div className="text-gray-500 text-xs">{item.label}:</div>
                      <div className="font-medium mt-0.5 border-b border-dotted border-gray-400 min-h-[16px]">
                        {item.value || ''}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 px-4 py-2 flex justify-between text-xs">
                  <span>دبیر: <strong>{header.teacherName || '___'}</strong></span>
                  <span>عنوان: <strong>{header.examTitle || '___'}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderForm;
