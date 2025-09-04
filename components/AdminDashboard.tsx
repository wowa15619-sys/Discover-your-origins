import React, { useState, useEffect } from 'react';

interface AdminDashboardProps {
    onLogout: () => void;
}

const WalletIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v1.286a.75.75 0 00.75.75h2.25a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75h-.008A8.228 8.228 0 0111.25 4.533zM12.75 4.533A8.228 8.228 0 0018 4.5h-.008a.75.75 0 00-.75.75v1.286a.75.75 0 00.75.75h2.25a.75.75 0 00.75-.75V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533z" />
    <path fillRule="evenodd" d="M12 1.5a.75.75 0 00-.75.75v3a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75H12zM3 8.25a.75.75 0 000 1.5h18a.75.75 0 000-1.5H3zM4.029 10.533A9.721 9.721 0 003 10.5a.75.75 0 00-.75.75v9a.75.75 0 00.75.75h18a.75.75 0 00.75-.75v-9a.75.75 0 00-.75-.75c-.596 0-1.168.085-1.719.243a.75.75 0 00-.281.962l-1.378 2.755a.75.75 0 01-1.342 0l-1.378-2.755a.75.75 0 00-1.342 0l-1.378 2.755a.75.75 0 01-1.342 0L9.4 11.738a.75.75 0 00-1.342 0l-1.378 2.755a.75.75 0 01-1.342 0L4.029 10.533z" clipRule="evenodd" />
  </svg>
);

const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);


const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [totalPayments, setTotalPayments] = useState(0);
    const [copied, setCopied] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const cashAppTag = '$d0990ali';

    useEffect(() => {
        const savedPayments = localStorage.getItem('genealogyAppTotalPayments');
        setTotalPayments(savedPayments ? parseInt(savedPayments, 10) : 0);
    }, []);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(cashAppTag);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWithdraw = () => {
        localStorage.setItem('genealogyAppTotalPayments', '0');
        setTotalPayments(0);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);
    };

    const earnings = totalPayments * 5;

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-teal-300">لوحة تحكم الأرباح</h2>
                <button onClick={onLogout} className="text-sm text-gray-400 hover:text-white transition">تسجيل الخروج</button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Earnings Counter */}
                <div className="bg-gray-900/70 p-8 rounded-lg text-center border border-gray-700 flex flex-col justify-between">
                    <div>
                        <WalletIcon className="w-16 h-16 mx-auto text-teal-400 mb-4"/>
                        <p className="text-lg text-gray-400 mb-2">إجمالي الأرباح المسجلة</p>
                        <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400">
                            ${earnings.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            بناءً على {totalPayments} عملية دفع ناجحة.
                        </p>
                    </div>
                    <div className="mt-8">
                        <div className="h-8">
                          {showConfirmation && (
                              <p className="text-green-400 text-sm mb-2 transition-opacity duration-300">
                                  تم إعادة تعيين العداد بنجاح!
                              </p>
                          )}
                        </div>
                        <button
                            onClick={handleWithdraw}
                            disabled={earnings <= 0}
                            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            إعادة تعيين العداد (تم السحب)
                        </button>
                        <p className="text-xs text-gray-500 mt-2">استخدم هذا بعد إتمام التحويل يدوياً.</p>
                    </div>
                </div>

                {/* Cash App Payout Info */}
                <div className="bg-gray-900/70 p-8 rounded-lg text-center border border-teal-500/30 flex flex-col justify-between">
                    <div>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c4/Cash_App_logo.svg" alt="Cash App Logo" className="w-16 h-16 mx-auto mb-4 invert brightness-0" />
                        <h3 className="text-xl font-bold text-teal-300 mb-2">معلومات السحب</h3>
                        <p className="text-gray-400 mb-4">يتم إرسال الأرباح يدويًا إلى حساب Cash App الخاص بك.</p>
                        <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                            <span className="text-lg font-mono text-sky-300">{cashAppTag}</span>
                            <button
                                onClick={handleCopyToClipboard}
                                className="bg-teal-500 text-white px-3 py-1 rounded-md text-sm font-semibold flex items-center gap-2 hover:bg-teal-600 transition disabled:bg-green-500"
                                disabled={copied}
                            >
                                {copied ? <><CheckIcon className="w-4 h-4" /> تم النسخ</> : <><CopyIcon className="w-4 h-4" /> نسخ</>}
                            </button>
                        </div>
                    </div>
                     <div className="mt-8">
                        <p className="text-xs text-gray-500">
                            قم بنسخ المعرّف أعلاه لإرسال الأرباح. زر "إعادة تعيين العداد" مخصص لتتبع الأرباح المسحوبة فقط.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;