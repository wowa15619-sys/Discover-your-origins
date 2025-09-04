import React, { useState } from 'react';

interface PaymentStepProps {
  onComplete: () => void;
}

const CreditCardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15z" />
        <path fill="#fff" d="M21 9.75H3v-.75a3 3 0 013-3h12a3 3 0 013 3v.75z" />
    </svg>
);


const PaymentStep: React.FC<PaymentStepProps> = ({ onComplete }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };
  
  const formatExpiry = (value: string) => {
    return value.replace(
      /[^0-9]/g, ''
    ).replace(
      /^([2-9])$/g, '0$1'
    ).replace(
      /^(1{1})([3-9]{1})$/g, '0$1/$2'
    ).replace(
      /^0{1,}/g, '0'
    ).replace(
      /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, '$1/$2'
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
    }, 2000);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700">
      <h2 className="text-3xl font-bold mb-2 text-center text-teal-300">الخطوة الثانية: الدفع الآمن</h2>
      <p className="text-center text-gray-400 mb-8">يرجى إكمال الدفع للحصول على المزيد من التحليلات.</p>
      
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400">باقة تحليلات (5 استخدامات)</span>
            <span className="text-xl font-bold text-white">$5.00</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-2">رقم البطاقة</label>
            <div className="relative">
                <input
                    type="text"
                    id="cardNumber"
                    value={formatCardNumber(cardNumber)}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-4 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    required
                />
                <CreditCardIcon className="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
            </div>
          </div>

          <div className="flex space-x-4 rtl:space-x-reverse">
            <div className="flex-1">
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-300 mb-2">تاريخ الانتهاء</label>
              <input
                type="text"
                id="expiry"
                value={formatExpiry(expiry)}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="cvc" className="block text-sm font-medium text-gray-300 mb-2">CVC</label>
              <input
                type="text"
                id="cvc"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                placeholder="123"
                maxLength={3}
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-teal-500 to-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-wait hover:enabled:scale-105"
          >
            {isProcessing ? 'جاري المعالجة...' : 'ادفع 5$ واحصل على 5 تحليلات'}
          </button>
        </form>
      </div>
      <p className="text-xs text-gray-500 text-center mt-4">هذه عملية دفع وهمية لأغراض العرض فقط.</p>
    </div>
  );
};

export default PaymentStep;