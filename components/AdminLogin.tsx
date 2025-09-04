import React, { useState } from 'react';

interface AdminLoginProps {
    onLoginSuccess: () => void;
}

const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm-3.75 5.25v3h7.5v-3a3.75 3.75 0 00-7.5 0z" clipRule="evenodd" />
  </svg>
);


const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Hardcoded credentials for simplicity
        if (username === 'admin' && password === 'secret') {
            setError('');
            onLoginSuccess();
        } else {
            setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
        }
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md mx-auto">
            <div className="text-center mb-8">
                <LockIcon className="w-16 h-16 mx-auto text-teal-400"/>
                <h2 className="text-3xl font-bold mt-4 text-teal-300">تسجيل دخول المدير</h2>
                <p className="text-gray-400">الوصول مقصور على المصرح لهم فقط.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">اسم المستخدم</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">كلمة المرور</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                        required
                    />
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-500 to-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:scale-105"
                >
                    تسجيل الدخول
                </button>
            </form>
             <p className="text-xs text-gray-500 text-center mt-4">
                <a href="/#" className="hover:text-teal-400">العودة إلى الموقع الرئيسي</a>
             </p>
        </div>
    );
};

export default AdminLogin;
