
import React from 'react';

interface LandingStepProps {
  onStart: () => void;
}

const DnaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.755 3.368A.75.75 0 015.25 3h13.5a.75.75 0 010 1.5H11.31l-3.23 4.845a.75.75 0 01-1.06.04L4.755 7.118V3.368zm0 2.264l2.235 2.235.04-2.275a.75.75 0 00-.75-.75H4.755v.79zm14.49 2.217a.75.75 0 01-1.06-.04L12.69 3.005H18a.75.75 0 01.75.75v5.045l2.235-2.235.005 2.275a.75.75 0 00.75.75h.75a.75.75 0 00.75-.75v-8.25a.75.75 0 00-.75-.75h-2.25a.75.75 0 00-.75.75v.79l-1.47-1.47a2.25 2.25 0 00-3.182 0L9.91 3.005H5.25a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25V9.368a.75.75 0 01-1.5 0v1.177l-4.845-3.23a.75.75 0 01-.04-1.06zm-7.668 7.395a.75.75 0 10-1.06-1.06l-2.25 2.25a.75.75 0 000 1.06l2.25 2.25a.75.75 0 101.06-1.06L10.31 16.5l1.222-1.222zM15 13.5a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H15.75a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H15.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
  </svg>
);

const LandingStep: React.FC<LandingStepProps> = ({ onStart }) => {
  return (
    <div className="text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700 transition-all duration-300">
      <DnaIcon className="w-20 h-20 mx-auto mb-6 text-teal-400"/>
      <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400">اكتشف قصة أصولك</h1>
      <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
        انطلق في رحلة إلى ماضيك. حمّل صورتك لتبدأ تحليلًا جينيًا افتراضيًا واكشف عن النسيج الغني لتراثك وأصول أجدادك.
      </p>
      <p className="text-md text-sky-300 -mt-4 mb-8 font-semibold">تجربتك الأولى مجانية بالكامل!</p>
      <button
        onClick={onStart}
        className="bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-600 hover:to-sky-700 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
      >
        ابدأ رحلتك الآن
      </button>
    </div>
  );
};

export default LandingStep;
