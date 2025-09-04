import React, { useState, useRef } from 'react';
import { UserData } from '../types';

interface UploadStepProps {
  onComplete: (data: UserData) => void;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);


const UploadStep: React.FC<UploadStepProps> = ({ onComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('لم يتم اختيار صورة');
  const [includeRegions, setIncludeRegions] = useState('');
  const [excludeRegions, setExcludeRegions] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (image) {
      const data: UserData = { image };
      if (includeRegions.trim()) {
        data.includeRegions = includeRegions.split(',').map(r => r.trim()).filter(r => r);
      }
      if (excludeRegions.trim()) {
        data.excludeRegions = excludeRegions.split(',').map(r => r.trim()).filter(r => r);
      }
      onComplete(data);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };


  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700">
      <h2 className="text-3xl font-bold mb-2 text-center text-teal-300">الخطوة الأولى: حمّل صورتك</h2>
      <p className="text-center text-gray-400 mb-8">نحن نحترم خصوصيتك. يتم استخدام الصورة لإنشاء تقريرك فقط.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">صورتك الشخصية</label>
            <div 
              className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10 hover:border-teal-500 transition cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={0}
              aria-label="Upload your image"
            >
                <div className="text-center">
                    {image ? (
                        <img src={image} alt="Preview" className="mx-auto h-24 w-24 rounded-full object-cover mb-4" />
                    ) : (
                        <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
                    )}
                    <div className="mt-4 flex text-sm leading-6 text-gray-400">
                        <p className="pl-1">أو اسحب وأفلت</p>
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-semibold text-teal-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-teal-500"
                        >
                            <span>حمّل ملف</span>
                            <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                        </label>
                    </div>
                    <p className="text-xs leading-5 text-gray-500">{fileName}</p>
                </div>
            </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-bold text-center text-teal-300 mb-1">تخصيص التقرير (اختياري)</h3>
            <p className="text-center text-gray-400 mb-4 text-sm">أخبرنا بالمناطق التي تهمك لتحصل على تحليل أكثر دقة.</p>
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="includeRegions" className="block text-sm font-medium text-gray-300 mb-2">
                        مناطق للتركيز عليها
                    </label>
                    <textarea
                        id="includeRegions"
                        value={includeRegions}
                        onChange={(e) => setIncludeRegions(e.target.value)}
                        className="w-full bg-gray-900/70 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                        placeholder="مثال: شبه الجزيرة العربية, الشام, شمال أفريقيا"
                        rows={2}
                    />
                    <p className="text-xs text-gray-500 mt-1">اكتب المناطق مفصولة بفاصلة.</p>
                </div>
                <div>
                    <label htmlFor="excludeRegions" className="block text-sm font-medium text-gray-300 mb-2">
                        مناطق للاستبعاد
                    </label>
                    <textarea
                        id="excludeRegions"
                        value={excludeRegions}
                        onChange={(e) => setExcludeRegions(e.target.value)}
                        className="w-full bg-gray-900/70 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                        placeholder="مثال: أوروبا, شرق آسيا"
                        rows={2}
                    />
                    <p className="text-xs text-gray-500 mt-1">اكتب المناطق مفصولة بفاصلة.</p>
                </div>
            </div>
        </div>

        <button
          type="submit"
          disabled={!image}
          className="w-full bg-gradient-to-r from-teal-500 to-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:scale-105"
        >
          تحليل الصورة
        </button>
      </form>
    </div>
  );
};

export default UploadStep;