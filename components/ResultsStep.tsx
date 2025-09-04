import React from 'react';
import { AncestryReport, UserData } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ResultsStepProps {
  report: AncestryReport;
  userData: UserData;
  onReset: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-2 border border-gray-600 rounded-md shadow-lg text-sm">
          <p className="text-white font-bold">{`${data.region} : ${data.percentage}%`}</p>
          <p className="text-gray-300">{`مستوى الثقة: ${data.confidence}`}</p>
        </div>
      );
    }
    return null;
  };

const ResultsStep: React.FC<ResultsStepProps> = ({ report, userData, onReset }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-700">
        <div className="text-center md:text-right mb-4 md:mb-0">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400">تقرير أصولك الجينية</h2>
        </div>
        <img src={userData.image} alt="الصورة التي تم تحليلها" className="w-24 h-24 rounded-full object-cover border-4 border-teal-500"/>
      </div>

      <div className="mb-8 p-6 bg-gray-900/50 rounded-lg">
        <h3 className="text-2xl font-bold mb-3 text-teal-300">ملخص التقرير</h3>
        <p className="text-gray-300 leading-relaxed">{report.summary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="p-6 bg-gray-900/50 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-center text-teal-300">التوزيع الجيني</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer aria-label="Pie chart showing the user's genetic breakdown by region">
                        <PieChart>
                            <Pie
                                data={report.regionalBreakdown}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                innerRadius={40}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="percentage"
                                nameKey="region"
                                >
                                {report.regionalBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-sm">
                    <ul className="space-y-2">
                        {report.regionalBreakdown.map((item, index) => {
                            let confidenceClasses = 'text-gray-400 border-gray-500';
                            if (item.confidence === 'مرتفع') confidenceClasses = 'text-green-400 border-green-500';
                            else if (item.confidence === 'متوسط') confidenceClasses = 'text-yellow-400 border-yellow-500';
                            else if (item.confidence === 'منخفض') confidenceClasses = 'text-red-400 border-red-500';

                            return (
                                <li key={index} className="flex justify-between items-center bg-gray-800/50 p-2 rounded-md">
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 rounded-full ml-3 rtl:mr-3 rtl:ml-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                        <span className="font-semibold text-gray-200">{item.region}</span>
                                    </div>
                                    <div className="flex items-center gap-x-3">
                                        <span className={`text-xs font-bold w-16 text-center py-0.5 rounded-full border ${confidenceClasses}`}>
                                            {item.confidence}
                                        </span>
                                        <span className={`font-mono text-lg text-white w-12 text-left`}>{item.percentage}%</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>

        <div className="p-6 bg-gray-900/50 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-teal-300">السياق التاريخي</h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {report.historicalContexts.map((context, index) => (
                    <div key={index}>
                        <h4 className="font-bold text-teal-400">{context.region}</h4>
                        <p className="text-gray-400 text-sm">{context.context}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={onReset}
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
        >
          البدء من جديد
        </button>
      </div>
    </div>
  );
};

export default ResultsStep;