import React, { useState, useEffect } from 'react';

const messages = [
  "جاري معالجة العينة الخاصة بك...",
  "تحليل ملامح الوجه باستخدام الذكاء الاصطناعي...",
  "تحديد الواسمات الجينية...",
  "مقارنة البيانات مع قاعدة البيانات العالمية...",
  "تتبع مسارات الهجرة القديمة...",
  "تجميع تقرير الأصول الخاص بك...",
  "اللمسات الأخيرة على النتائج...",
];

const ProcessingStep: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
        className="text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700 flex flex-col items-center justify-center min-h-[400px]"
        role="status"
        aria-live="polite"
    >
      <div aria-hidden="true" className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-teal-400 mb-8"></div>
      <h2 className="text-3xl font-bold mb-4 text-teal-300">التحليل قيد التنفيذ</h2>
      <p className="text-lg text-gray-300 transition-opacity duration-500">
        {messages[messageIndex]}
      </p>
      <p className="text-sm text-gray-500 mt-8">قد تستغرق هذه العملية بضع لحظات. شكرًا لصبرك.</p>
    </div>
  );
};

export default ProcessingStep;