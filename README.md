# 📚 طراح سوالات پیشرفته آموزش و پرورش

<div dir="rtl">

## معرفی برنامه

سامانه طراحی سوالات پیشرفته برای معلمان و دبیران آموزش و پرورش ایران است. این برنامه به صورت وب اپلیکیشن و اپلیکیشن اندروید در دسترس است.

---

## ✨ ویژگی‌ها

### سربرگ آزمون (اختیاری)
- بسمه تعالی
- اداره آموزش و پرورش
- نام دبیرستان
- نام و نام خانوادگی دانش‌آموز
- نام پدر
- درس
- پایه
- سال تحصیلی
- تاریخ
- نام دبیر

### انواع سوالات
1. **✓✗ صحیح و غلط** - جملات صحیح یا غلط
2. **📝 جاخالی** - متن با جاهای خالی
3. **↔️ جورکردنی** - تطبیق دو ستون
4. **⊙ تستی (چهارگزینه‌ای)** - گزینه‌های چندگانه
5. **✏️ پاسخ کوتاه** - پاسخ‌های کوتاه
6. **📄 تشریحی** - پاسخ‌های تفصیلی

### بارم‌بندی
- از ۰.۲۵ تا ۱۰ نمره برای هر سوال
- نمایش مجموع بارم در لحظه
- هشدار برای تجاوز از ۲۰ نمره

### خروجی‌ها
- 🖨️ **پرینت** - چاپ مستقیم با فرمت‌بندی حرفه‌ای
- 📄 **PDF** - خروجی PDF از طریق مرورگر
- 📝 **Word (.docx)** - دانلود فایل Word
- 💾 **ذخیره** - ذخیره در حافظه مرورگر

### مدیریت سوالات
- ✏️ ویرایش سوالات
- 🗑️ حذف سوالات
- 📋 پیش‌نمایش زنده
- 💾 ذخیره و بارگذاری آزمون‌ها

---

## 🚀 راه‌اندازی

### پیش‌نیازها
- Node.js نسخه 18 یا بالاتر
- npm یا yarn

### نصب و اجرا

```bash
# کلون کردن پروژه
git clone https://github.com/YOUR_USERNAME/exam-designer.git
cd exam-designer

# نصب وابستگی‌ها
npm install

# اجرای محیط توسعه
npm run dev

# ساخت نسخه نهایی
npm run build
```

---

## 📱 ساخت APK اندروید

### روش ۱: از طریق GitHub Actions (توصیه می‌شود)

1. کد را در GitHub Push کنید
2. به بخش **Actions** بروید
3. روی **Build Android APK** کلیک کنید
4. فایل APK در **Artifacts** قابل دانلود است

### روش ۲: ساخت دستی

```bash
# ۱. نصب وابستگی‌ها
npm install
npm install -g @capacitor/cli

# ۲. ساخت وب اپ
npm run build

# ۳. اضافه کردن پلتفرم اندروید
npx cap add android

# ۴. همگام‌سازی
npx cap sync android

# ۵. باز کردن در Android Studio
npx cap open android

# ۶. یا ساخت مستقیم
cd android
./gradlew assembleDebug
```

فایل APK در مسیر زیر خواهد بود:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔑 تنظیمات GitHub Secrets (برای نسخه Release)

برای ساخت APK امضاشده، این Secrets را در مخزن GitHub خود اضافه کنید:

| نام Secret | توضیح |
|------------|-------|
| `KEYSTORE_BASE64` | فایل keystore به صورت Base64 |
| `KEYSTORE_PASSWORD` | رمز keystore |
| `KEY_ALIAS` | نام alias |
| `KEY_PASSWORD` | رمز key |

### ساخت Keystore

```bash
keytool -genkey -v \
  -keystore exam-designer.keystore \
  -alias exam-designer \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

### تبدیل به Base64

```bash
base64 exam-designer.keystore
```

---

## 📁 ساختار پروژه

```
exam-designer/
├── src/
│   ├── components/
│   │   ├── HeaderForm.tsx          # فرم سربرگ آزمون
│   │   ├── QuestionSection.tsx     # بخش هر نوع سوال
│   │   ├── QuestionCard.tsx        # کارت نمایش سوال
│   │   ├── ExamList.tsx            # لیست آزمون‌های ذخیره شده
│   │   └── questions/
│   │       ├── TrueFalseForm.tsx   # فرم صحیح/غلط
│   │       ├── FillBlankForm.tsx   # فرم جاخالی
│   │       ├── MatchingForm.tsx    # فرم جورکردنی
│   │       ├── MultipleChoiceForm.tsx # فرم تستی
│   │       ├── ShortAnswerForm.tsx # فرم پاسخ کوتاه
│   │       ├── DescriptiveForm.tsx # فرم تشریحی
│   │       └── ScoreSelector.tsx   # انتخابگر بارم
│   ├── types/
│   │   └── index.ts                # تعریف انواع داده
│   ├── utils/
│   │   ├── storage.ts              # مدیریت ذخیره‌سازی
│   │   ├── pdfExport.ts            # خروجی PDF/پرینت
│   │   └── wordExport.ts           # خروجی Word
│   ├── App.tsx                     # کامپوننت اصلی
│   └── main.tsx                    # نقطه ورود
├── android/                        # پروژه اندروید (Capacitor)
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       └── java/ir/education/examdesigner/
│   │           └── MainActivity.java
│   ├── build.gradle
│   ├── settings.gradle
│   └── variables.gradle
├── .github/
│   └── workflows/
│       └── build.yml               # GitHub Actions
├── capacitor.config.ts             # تنظیمات Capacitor
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🛠️ تکنولوژی‌های استفاده شده

| تکنولوژی | نسخه | کاربرد |
|-----------|------|---------|
| React | 19 | فریمورک UI |
| TypeScript | 5 | تایپ‌گذاری |
| Vite | 7 | Build tool |
| Tailwind CSS | 4 | استایل‌دهی |
| Capacitor | 5 | تبدیل به اپ اندروید |
| docx | 8 | تولید فایل Word |
| file-saver | 2 | دانلود فایل |
| lucide-react | - | آیکون‌ها |

---

## 📞 پشتیبانی

در صورت بروز مشکل، یک Issue در GitHub باز کنید.

---

## 📜 مجوز

MIT License - آزاد برای استفاده آموزشی

</div>
