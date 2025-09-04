import React, { useState, useCallback, useEffect } from 'react';
import { AppStep, UserData, AncestryReport } from './types';
import LandingStep from './components/LandingStep';
import UploadStep from './components/UploadStep';
import PaymentStep from './components/PaymentStep';
import ProcessingStep from './components/ProcessingStep';
import ResultsStep from './components/ResultsStep';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { generateAncestryReport } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.Landing);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [ancestryReport, setAncestryReport] = useState<AncestryReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [footerClicks, setFooterClicks] = useState(0);

  // Admin and routing state
  const [route, setRoute] = useState(window.location.hash);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);


  const [usageCount, setUsageCount] = useState<number>(() => {
    const saved = localStorage.getItem('genealogyAppUsageCount');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [remainingUses, setRemainingUses] = useState<number>(() => {
    const saved = localStorage.getItem('genealogyAppRemainingUses');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('genealogyAppUsageCount', usageCount.toString());
  }, [usageCount]);

  useEffect(() => {
    localStorage.setItem('genealogyAppRemainingUses', remainingUses.toString());
  }, [remainingUses]);

  // Handle routing
  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);


  const handleStart = () => {
    setStep(AppStep.Upload);
    setError(null);
    setUserData(null);
    setAncestryReport(null);
  };

  const handleUploadComplete = (data: UserData) => {
    setUserData(data);
    if (usageCount === 0 || remainingUses > 0) {
      setStep(AppStep.Processing);
    } else {
      setStep(AppStep.Payment);
    }
  };

  const handlePaymentComplete = () => {
    setRemainingUses(prev => prev + 5);
    setStep(AppStep.Processing);
     // Track payment for admin earnings
    const currentPayments = parseInt(localStorage.getItem('genealogyAppTotalPayments') || '0', 10);
    localStorage.setItem('genealogyAppTotalPayments', (currentPayments + 1).toString());
  };

  const processRequest = useCallback(async () => {
    if (!userData) {
      setError("حدث خطأ ما. الرجاء البدء من جديد.");
      setStep(AppStep.Upload);
      return;
    }
    try {
      setError(null);
      const report = await generateAncestryReport(userData);
      setAncestryReport(report);
      setStep(AppStep.Results);

      if (usageCount > 0) {
        setRemainingUses(prev => Math.max(0, prev - 1));
      }
      setUsageCount(prev => prev + 1);

    } catch (err) {
      console.error("Error generating report:", err);
      setError("فشل في إنشاء التقرير. قد تكون هناك مشكلة في الاتصال. يرجى المحاولة مرة أخرى.");
      setStep(AppStep.Upload); // Go back to upload step on error, don't consume a "use"
    }
  }, [userData, usageCount]);

  useEffect(() => {
    if (step === AppStep.Processing) {
      processRequest();
    }
  }, [step, processRequest]);


  const renderUsageInfo = () => {
    if (step !== AppStep.Upload && step !== AppStep.Payment) return null;

    let infoText = '';
    if (usageCount === 0) {
        infoText = 'لديك محاولة واحدة مجانية متبقية.';
    } else if (remainingUses > 0) {
        infoText = `لديك ${remainingUses} محاولات متبقية.`;
    } else if (step === AppStep.Upload) {
        infoText = 'انتهت محاولاتك. المتابعة ستنقلك إلى صفحة الدفع.';
    }

    if (!infoText) return null;

    return (
        <div className="bg-gray-800/60 border border-teal-500/30 text-teal-200 p-3 rounded-lg mb-6 text-center text-sm">
            {infoText}
        </div>
    );
  }

  const renderMainApp = () => {
    switch (step) {
      case AppStep.Landing:
        return <LandingStep onStart={handleStart} />;
      case AppStep.Upload:
        return <UploadStep onComplete={handleUploadComplete} />;
      case AppStep.Payment:
        return <PaymentStep onComplete={handlePaymentComplete} />;
      case AppStep.Processing:
        return <ProcessingStep />;
      case AppStep.Results:
        return <ResultsStep report={ancestryReport!} userData={userData!} onReset={handleStart} />;
      default:
        return <LandingStep onStart={handleStart} />;
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    window.location.hash = '#/dashboard';
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    window.location.hash = '#/';
  };
  
  const handleFooterClick = () => {
    const newCount = footerClicks + 1;
    setFooterClicks(newCount);
    if (newCount >= 5) {
        window.location.hash = '#/admin';
        setFooterClicks(0);
    }
    // Hide the counter reset with a timeout
    setTimeout(() => setFooterClicks(0), 1500);
  };

  const renderContent = () => {
    switch (route) {
        case '#/admin':
            return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />;
        case '#/dashboard':
            if (isAdminAuthenticated) {
                return <AdminDashboard onLogout={handleAdminLogout} />;
            }
            window.location.hash = '#/admin'; // Redirect if not authenticated
            return null;
        default:
            return (
                <>
                    {error && (
                      <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6 text-center">
                        {error}
                      </div>
                    )}
                    {renderUsageInfo()}
                    {renderMainApp()}
                </>
            );
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center p-4 selection:bg-teal-400 selection:text-gray-900">
      <div className="w-full max-w-2xl mx-auto">
        {renderContent()}
      </div>
       <footer className="text-center text-gray-500 mt-8 text-sm" onClick={handleFooterClick} style={{ cursor: 'pointer' }}>
        <p>مستكشف الأنساب &copy; 2024. للأغراض التوضيحية فقط.</p>
      </footer>
    </div>
  );
};

export default App;
