import React, { useState, useEffect } from 'react';

// الأنواع والبيانات الهيكلية
interface Operation {
  id: string;
  name: string;
  specialty: 'HPB' | 'Colorectal' | 'Upper GI' | 'Breast' | 'Trauma' | 'Vascular';
  role: 'Surgeon' | '1st Assistant' | '2nd Assistant' | 'Observer';
  urgency: 'Emergency' | 'Elective';
  outcome: 'Uneventful' | 'Complication' | 'Mortality';
  date: string;
  pearl?: string;
}

interface CurriculumModule {
  id: string;
  title: string;
  enTitle: string;
  progress: number;
  completed: number;
  total: number;
  statusColor: string;
}

export default function SurgicalSuite() {
  // حالة الملاحة الرئيسية
  const [activeTab, setActiveTab] = useState<'home' | 'logbook' | 'curriculum' | 'review' | 'analytics'>('home');
  const [showWizard, setShowWizard] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<CurriculumModule | null>(null);
  const [showMCQModal, setShowMCQModal] = useState(false);

  // حالة نموذج التسجيل (Wizard)
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [opName, setOpName] = useState('');
  const [opSpecialty, setOpSpecialty] = useState<Operation['specialty']>('HPB');
  const [opRole, setOpRole] = useState<Operation['role']>('Surgeon');
  const [opUrgency, setOpUrgency] = useState<Operation['urgency']>('Emergency');
  const [opOutcome, setOpOutcome] = useState<Operation['outcome']>('Uneventful');
  const [opPearl, setOpPearl] = useState('');

  // بنك الأسئلة والمراجعة
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // فلتر سجل العمليات
  const [logFilter, setLogFilter] = useState<string>('ALL');

  // البيانات التأسيسية
  const [operations, setOperations] = useState<Operation[]>([
    {
      id: '1',
      name: 'Laparoscopic Cholecystectomy',
      specialty: 'HPB',
      role: 'Surgeon',
      urgency: 'Elective',
      outcome: 'Uneventful',
      date: '2026-10-05',
      pearl: 'Critical View of Safety (Strasberg) must be confirmed prior to cystic duct clipping.'
    },
    {
      id: '2',
      name: 'Exploratory Laparotomy & Splenectomy',
      specialty: 'Trauma',
      role: 'Surgeon',
      urgency: 'Emergency',
      outcome: 'Uneventful',
      date: '2026-10-04',
      pearl: 'Immediate packing of 4 quadrants; mobilize spleen medially by dividing splenorenal ligament.'
    },
    {
      id: '3',
      name: 'Right Hemicolectomy',
      specialty: 'Colorectal',
      role: '1st Assistant',
      urgency: 'Elective',
      outcome: 'Complication',
      date: '2026-10-02',
      pearl: 'High ligation of ileocolic vessels; ensure adequate ureter identification.'
    }
  ]);

  const curriculumModules: CurriculumModule[] = [
    { id: '1', title: 'المبادئ العامة في الجراحة', enTitle: 'General Surgical Principles', progress: 100, completed: 5, total: 5, statusColor: 'from-emerald-500 to-teal-500' },
    { id: '2', title: 'إصابات الحوادث والإنقاذ', enTitle: 'Trauma & Damage Control (ATLS)', progress: 60, completed: 3, total: 5, statusColor: 'from-sky-500 to-blue-600' },
    { id: '3', title: 'الكبد، المرارة والبنكرياس', enTitle: 'HPB & Biliary Surgery', progress: 45, completed: 2, total: 5, statusColor: 'from-amber-500 to-orange-600' },
    { id: '4', title: 'القولون والمستقيم والشرج', enTitle: 'Colorectal & Anorectal', progress: 0, completed: 0, total: 7, statusColor: 'from-slate-600 to-slate-700' }
  ];

  const quickProcedures = [
    'Laparoscopic Appendectomy',
    'Laparoscopic Cholecystectomy',
    'Hernia Repair (Lichtenstein)',
    'Thyroidectomy',
    'Whipple Procedure',
    'Right Hemicolectomy'
  ];

  // حفظ العملية الجديدة من الـ Wizard
  const handleSaveOperation = () => {
    if (!opName) return;
    const newOp: Operation = {
      id: Date.now().toString(),
      name: opName,
      specialty: opSpecialty,
      role: opRole,
      urgency: opUrgency,
      outcome: opOutcome,
      date: new Date().toISOString().split('T')[0],
      pearl: opPearl
    };
    setOperations([newOp, ...operations]);
    setShowWizard(false);
    setWizardStep(1);
    setOpName('');
    setOpPearl('');
  };

  const filteredOperations = operations.filter(op => {
    if (logFilter === 'ALL') return true;
    return op.specialty === logFilter;
  });

  return (
    <div dir="rtl" className="min-h-screen bg-[#0A0E1A] text-slate-100 font-sans pb-24 selection:bg-sky-500/30">
      
      {/* ========================================================================= */}
      {/* 1. TOP STATUS BAR                                                        */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-[#0A0E1A]/85 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-md shadow-sky-500/20">
              <div className="w-full h-full bg-[#0E1526] rounded-[14px] flex items-center justify-center font-bold text-sky-400 text-sm">
                د.إ
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-wide">د. إيفان</h1>
                <span className="text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full">
                  Year 2 Resident
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Surgery Suite • Bailey & Love 28th</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-amber-400 text-xs font-bold">
              <span>🔥</span>
              <span>12 يوم</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 pt-4">

        {/* ========================================================================= */}
        {/* 2. TAB: HOME DASHBOARD                                                    */}
        {/* ========================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-5 animate-fadeIn">
            {/* الترحيب */}
            <div>
              <h2 className="text-xl font-extrabold text-white">مرحبًا د. إيفان 👋</h2>
              <p className="text-xs text-slate-400 mt-0.5">استمر في التقدم، أنت أقرب لهدفك اليوم.</p>
            </div>

            {/* بطاقة المنهج الكبرى (Year 2 Hero) */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#121B33] via-[#0E162A] to-[#141829] border border-sky-500/20 rounded-3xl p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold tracking-wider text-sky-400 uppercase">الخطة الدراسية السريرية</span>
                  <h3 className="text-lg font-black text-white">Year 2 — Bailey & Love 28th</h3>
                  <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
                    <span className="font-semibold text-white">204 / 300</span>
                    <span className="text-slate-400">قسم مكتمل</span>
                  </div>
                </div>

                {/* Progress Ring */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-sky-400 transition-all duration-1000 ease-out"
                      strokeDasharray="68, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-sm font-black text-white">68%</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">الامتحان المقالي القادم: <strong className="text-slate-200">Stage 3 Essay</strong></span>
                <button 
                  onClick={() => setActiveTab('curriculum')}
                  className="text-sky-400 font-bold hover:underline flex items-center gap-1"
                >
                  متابعة المنهج ←
                </button>
              </div>
            </div>

            {/* البطاقات الإحصائية الثلاث الصغيرة */}
            <div className="grid grid-cols-3 gap-2.5">
              <div 
                onClick={() => setActiveTab('logbook')} 
                className="bg-[#10172B] border border-slate-800 hover:border-sky-500/30 p-3 rounded-2xl cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-300">🔪 العمليات</span>
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                </div>
                <div className="text-lg font-black text-white">71</div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                  <span className="text-emerald-400 font-bold">53</span> رئيسية • <span className="text-rose-400 font-bold">18</span> طوارئ
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('curriculum')} 
                className="bg-[#10172B] border border-slate-800 hover:border-indigo-500/30 p-3 rounded-2xl cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-300">📚 الدراسة</span>
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                </div>
                <div className="text-lg font-black text-white">12 / 17</div>
                <div className="text-[10px] text-indigo-300 mt-0.5 leading-tight font-medium">
                  68% من المنهج
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('review')} 
                className="bg-[#10172B] border border-slate-800 hover:border-amber-500/30 p-3 rounded-2xl cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-300">🎯 هدف اليوم</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                </div>
                <div className="text-lg font-black text-amber-300">23 كارت</div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                  2 موضوع • 1 مراجعة
                </div>
              </div>
            </div>

            {/* أدوات سريعة */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">أدوات سريعة</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'تصفح المنهج', icon: '📚', action: () => setActiveTab('curriculum') },
                  { label: 'تسجيل عملية', icon: '➕', action: () => setShowWizard(true) },
                  { label: 'بنك الأسئلة', icon: '❓', action: () => setShowMCQModal(true) },
                  { label: 'الإحصائيات', icon: '📊', action: () => setActiveTab('analytics') },
                  { label: 'المراجعة', icon: '🧠', action: () => setActiveTab('review') },
                  { label: 'سجل العمليات', icon: '🔪', action: () => setActiveTab('logbook') },
                ].map((tool, i) => (
                  <button
                    key={i}
                    onClick={tool.action}
                    className="h-16 bg-[#11182B]/80 hover:bg-[#15203A] border border-slate-800/80 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
                  >
                    <span className="text-lg">{tool.icon}</span>
                    <span className="text-[11px] font-semibold text-slate-200">{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* آخر نشاط (Timeline / Card List) */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">آخر العمليات المدونة</h3>
                <button onClick={() => setActiveTab('logbook')} className="text-xs text-sky-400 font-bold hover:underline">
                  عرض السجل كامل
                </button>
              </div>

              <div className="space-y-2">
                {operations.slice(0, 2).map((op) => (
                  <div key={op.id} className="bg-[#10172B] border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{op.name}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                          {op.specialty}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="text-emerald-400 font-medium">{op.role}</span>
                        <span>•</span>
                        <span className={op.urgency === 'Emergency' ? 'text-rose-400' : 'text-sky-400'}>
                          {op.urgency}
                        </span>
                        <span>•</span>
                        <span>{op.date}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ✓ {op.outcome}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. TAB: OPERATIVE LOGBOOK                                                */}
        {/* ========================================================================= */}
        {activeTab === 'logbook' && (
          <div className="space-y-4 animate-fadeIn">
            {/* رأس الصفحة مع الإحصائيات */}
            <div>
              <h2 className="text-lg font-bold text-white">سجل العمليات الجراحية</h2>
              <p className="text-xs text-slate-400">توثيق الحالات السريرية المعتمدة لاختبار البورد</p>
            </div>

            {/* شريط الإحصائيات العلوي */}
            <div className="grid grid-cols-5 gap-1.5 bg-[#10172B] border border-slate-800 p-2.5 rounded-2xl text-center">
              <div>
                <span className="text-base font-extrabold text-white block">{operations.length}</span>
                <span className="text-[9px] text-slate-400 block">الإجمالي</span>
              </div>
              <div>
                <span className="text-base font-extrabold text-emerald-400 block">
                  {operations.filter(o => o.role === 'Surgeon').length}
                </span>
                <span className="text-[9px] text-slate-400 block">رئيسي</span>
              </div>
              <div>
                <span className="text-base font-extrabold text-rose-400 block">
                  {operations.filter(o => o.urgency === 'Emergency').length}
                </span>
                <span className="text-[9px] text-slate-400 block">طوارئ</span>
              </div>
              <div>
                <span className="text-base font-extrabold text-sky-400 block">95%</span>
                <span className="text-[9px] text-slate-400 block">سلامة</span>
              </div>
              <div>
                <span className="text-base font-extrabold text-amber-400 block">
                  {operations.filter(o => o.outcome === 'Complication').length}
                </span>
                <span className="text-[9px] text-slate-400 block">مضاعفات</span>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {['ALL', 'HPB', 'Colorectal', 'Upper GI', 'Breast', 'Trauma'].map((f) => (
                <button
                  key={f}
                  onClick={() => setLogFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    logFilter === f
                      ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                      : 'bg-[#10172B] border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {f === 'ALL' ? 'الكل' : f}
                </button>
              ))}
            </div>

            {/* Cards List */}
            <div className="space-y-2.5">
              {filteredOperations.map((op) => (
                <div
                  key={op.id}
                  className="bg-[#10172B] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{op.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {op.specialty} • <span className="text-sky-400 font-semibold">{op.role}</span>
                      </p>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                      op.urgency === 'Emergency'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {op.urgency}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                    <span className="text-slate-500 font-mono text-[11px]">{op.date}</span>
                    <span className="text-emerald-400 font-medium">✓ {op.outcome}</span>
                  </div>

                  {op.pearl && (
                    <div className="bg-[#0A0E1A] border border-slate-800 p-2.5 rounded-xl text-xs text-amber-200/90 leading-relaxed font-sans">
                      <strong className="text-amber-400 font-bold block mb-0.5">💡 Surgical Pearl:</strong>
                      {op.pearl}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. TAB: BAILEY & LOVE CURRICULUM                                          */}
        {/* ========================================================================= */}
        {activeTab === 'curriculum' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-white">الخارطة الدراسية (Curriculum Roadmap)</h2>
              <p className="text-xs text-slate-400">Year 2 — Bailey & Love 28th Edition</p>
            </div>

            {/* كارت الحالة الإجمالية */}
            <div className="bg-[#10172B] border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">التقدم الإجمالي بالموضوعات</span>
                <div className="text-xl font-black text-white mt-0.5">12 / 17 موضوع</div>
              </div>
              <span className="text-lg font-black text-sky-400 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20">
                68%
              </span>
            </div>

            {/* Modules Cards */}
            <div className="space-y-2.5">
              {curriculumModules.map((module) => (
                <div
                  key={module.id}
                  onClick={() => setSelectedTopic(module)}
                  className="bg-[#10172B] border border-slate-800 hover:border-sky-500/40 p-4 rounded-2xl cursor-pointer transition-all active:scale-[0.99] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{module.title}</h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{module.enTitle}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-300">
                      {module.completed} / {module.total}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${module.statusColor} transition-all duration-700`}
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>نسبة الإنجاز: {module.progress}%</span>
                    <span className="text-sky-400 font-semibold flex items-center gap-1">
                      فتح التفاصيل ←
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. TAB: SMART REVIEW (SRS)                                                */}
        {/* ========================================================================= */}
        {activeTab === 'review' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-white">المراجعة الذكية (Spaced Repetition)</h2>
              <p className="text-xs text-slate-400">تثبيت المعلومات الجراحية طويلة المدى</p>
            </div>

            {/* بطاقة جلسة اليوم */}
            <div className="bg-gradient-to-br from-[#121A30] to-[#0E1528] border border-indigo-500/20 p-5 rounded-3xl text-center space-y-4 shadow-xl">
              <span className="inline-block text-xs font-bold bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                Today's Review Session
              </span>
              <div className="text-4xl font-black text-white tracking-tight">23 كارت</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                جاهزة للمراجعة المتباعدة بناءً على دقة استرجاعك السابقة للأدلة الجراحية.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                <div className="bg-[#0A0E1A] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-rose-400 block">5 متأخرة</span>
                  <span className="text-[10px] text-slate-500">Overdue</span>
                </div>
                <div className="bg-[#0A0E1A] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-amber-400 block">8 قيد التعلم</span>
                  <span className="text-[10px] text-slate-500">Learning</span>
                </div>
                <div className="bg-[#0A0E1A] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-emerald-400 block">10 جديدة</span>
                  <span className="text-[10px] text-slate-500">New Cards</span>
                </div>
              </div>

              <button
                onClick={() => setShowMCQModal(true)}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all text-sm cursor-pointer"
              >
                <span>▶</span>
                <span>ابدأ المراجعة اليومية السريعة</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. TAB: ANALYTICS                                                         */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-white">التحليلات الجراحية (Surgical Analytics)</h2>
              <p className="text-xs text-slate-400">تقييم الكفاءة وتوزيع التخصصات لملف الاعتماد</p>
            </div>

            {/* مؤشرات الأداء الأساسية */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#10172B] border border-slate-800 p-3.5 rounded-2xl">
                <span className="text-xs text-slate-400 block">إجمالي الإجراءات</span>
                <span className="text-2xl font-black text-white mt-1 block">71</span>
                <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">+12 هذا الشهر</span>
              </div>
              <div className="bg-[#10172B] border border-slate-800 p-3.5 rounded-2xl">
                <span className="text-xs text-slate-400 block">معدل المضاعفات العام</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">4.2%</span>
                <span className="text-[11px] text-slate-500 mt-1 block">ضمن النطاق العالمي الآمن</span>
              </div>
            </div>

            {/* Distribution by Specialty */}
            <div className="bg-[#10172B] border border-slate-800 p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                توزيع العمليات حسب التخصص (Specialty Distribution)
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'HPB & Biliary', count: 28, pct: 40, color: 'bg-sky-500' },
                  { name: 'Trauma & Emergency', count: 18, pct: 25, color: 'bg-rose-500' },
                  { name: 'Colorectal', count: 14, pct: 20, color: 'bg-indigo-500' },
                  { name: 'Upper GI & Hernia', count: 11, pct: 15, color: 'bg-emerald-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300 font-medium">{item.name}</span>
                      <span className="text-slate-400 font-mono">{item.count} حالة ({item.pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* توزيع الأدوار الجراحية */}
            <div className="bg-[#10172B] border border-slate-800 p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                الدور الجراحي (Role Distribution)
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-[#0A0E1A] rounded-xl border border-slate-800">
                  <span className="text-sm font-bold text-emerald-400 block">53</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Surgeon</span>
                </div>
                <div className="p-2 bg-[#0A0E1A] rounded-xl border border-slate-800">
                  <span className="text-sm font-bold text-sky-400 block">12</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">1st Assist</span>
                </div>
                <div className="p-2 bg-[#0A0E1A] rounded-xl border border-slate-800">
                  <span className="text-sm font-bold text-slate-300 block">4</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">2nd Assist</span>
                </div>
                <div className="p-2 bg-[#0A0E1A] rounded-xl border border-slate-800">
                  <span className="text-sm font-bold text-slate-400 block">2</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Observer</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 7. 3-STEP OPERATION WIZARD MODAL                                          */}
      {/* ========================================================================= */}
      {showWizard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-[#0E1526] border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl animate-slideUp">
            
            {/* مؤشر الخطوات العلوي */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center font-bold text-xs">
                  {wizardStep}
                </span>
                <h3 className="font-bold text-sm text-white">
                  {wizardStep === 1 && 'الخطوة 1: تحديد العملية والتخصص'}
                  {wizardStep === 2 && 'الخطوة 2: دورك ونوع الدخول'}
                  {wizardStep === 3 && 'الخطوة 3: النتيجة والملاحظات المهمة'}
                </h3>
              </div>
              <button
                onClick={() => setShowWizard(false)}
                className="text-slate-500 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* STEP 1 */}
            {wizardStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">اسم العملية</label>
                  <input
                    type="text"
                    placeholder="ابحث أو اكتب اسم العملية..."
                    value={opName}
                    onChange={(e) => setOpName(e.target.value)}
                    className="w-full h-11 bg-[#0A0E1A] border border-slate-800 rounded-xl px-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />
                  
                  {/* اقتراحات سريعة */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {quickProcedures.map((proc, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setOpName(proc)}
                        className="text-[11px] bg-slate-800/60 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/60"
                      >
                        {proc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">التخصص الفرعي</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['HPB', 'Colorectal', 'Breast', 'Upper GI', 'Trauma', 'Vascular'] as Operation['specialty'][]).map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => setOpSpecialty(spec)}
                        className={`h-10 text-xs font-bold rounded-xl border transition-all ${
                          opSpecialty === spec
                            ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                            : 'bg-[#0A0E1A] text-slate-400 border-slate-800'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={!opName}
                  onClick={() => setWizardStep(2)}
                  className="w-full h-12 bg-sky-500 disabled:opacity-40 text-slate-950 font-bold rounded-xl mt-2"
                >
                  التالي: دورك في العملية ←
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {wizardStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">دورك في العملية</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Surgeon', '1st Assistant', '2nd Assistant', 'Observer'] as Operation['role'][]).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setOpRole(role)}
                        className={`h-11 text-xs font-bold rounded-xl border transition-all ${
                          opRole === role
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-[#0A0E1A] text-slate-400 border-slate-800'
                        }`}
                      >
                        {role === 'Surgeon' ? '🔵 Surgeon (رئيسي)' : role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">نوع الدخول</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOpUrgency('Emergency')}
                      className={`h-11 text-xs font-bold rounded-xl border transition-all ${
                        opUrgency === 'Emergency'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-[#0A0E1A] text-slate-400 border-slate-800'
                      }`}
                    >
                      ⚡ Emergency (طوارئ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpUrgency('Elective')}
                      className={`h-11 text-xs font-bold rounded-xl border transition-all ${
                        opUrgency === 'Elective'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                          : 'bg-[#0A0E1A] text-slate-400 border-slate-800'
                      }`}
                    >
                      📅 Elective (مجدولة)
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="w-1/3 h-12 bg-slate-800 text-slate-300 font-bold rounded-xl"
                  >
                    السابق
                  </button>
                  <button
                    onClick={() => setWizardStep(3)}
                    className="w-2/3 h-12 bg-sky-500 text-slate-950 font-bold rounded-xl"
                  >
                    التالي: النتيجة والملاحظات ←
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {wizardStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">نتيجة الإجراء والتعافي</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setOpOutcome('Uneventful')}
                      className={`h-10 text-[11px] font-bold rounded-xl border ${
                        opOutcome === 'Uneventful'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-[#0A0E1A] text-slate-400 border-slate-800'
                      }`}
                    >
                      ✅ Uneventful
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpOutcome('Complication')}
                      className={`h-10 text-[11px] font-bold rounded-xl border ${
                        opOutcome === 'Complication'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-[#0A0E1A] text-slate-400 border-slate-800'
                      }`}
                    >
                      ⚠️ Complication
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpOutcome('Mortality')}
                      className={`h-10 text-[11px] font-bold rounded-xl border ${
                        opOutcome === 'Mortality'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-[#0A0E1A] text-slate-400 border-slate-800'
                      }`}
                    >
                      ❌ Mortality
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                    Pearls / أهم ما تعلمته من هذه العملية (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    value={opPearl}
                    onChange={(e) => setOpPearl(e.target.value)}
                    placeholder="نصيحة تقنية أو صعوبة تشريحية..."
                    className="w-full bg-[#0A0E1A] border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 cursor-pointer">
                  <span>📷</span>
                  <span>إضافة صورة للعملية (اختياري / Intra-op photo)</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="w-1/3 h-12 bg-slate-800 text-slate-300 font-bold rounded-xl"
                  >
                    السابق
                  </button>
                  <button
                    onClick={handleSaveOperation}
                    className="w-2/3 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/20"
                  >
                    💾 حفظ وتوثيق العملية
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. QUESTION BANK & MCQ MODAL                                              */}
      {/* ========================================================================= */}
      {showMCQModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0E1526] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl animate-fadeIn">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-sky-400">Question 04 / 25 • HPB Surgery</span>
              <button onClick={() => { setShowMCQModal(false); setSelectedAnswer(null); setIsAnswerSubmitted(false); }} className="text-slate-400">
                ✕
              </button>
            </div>

            {/* Question Card */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white leading-relaxed">
                مريض يبلغ 45 عامًا خضع لاستئصال مرارة بالمنظار (Lap Chole)، في اليوم الثاني ظهر لديه ألم شرسوفي وحمى خفيفة مع ارتفاع البيليروبين. ما هو الإجراء التشخيصي الأول الأكثر حساسية لتحديد تسرب الصفراء؟
              </h3>

              {/* Options A - D */}
              <div className="space-y-2 pt-2">
                {[
                  { text: 'A) Ultrasound of the Abdomen', isCorrect: false },
                  { text: 'B) MRCP (Magnetic Resonance Cholangiopancreatography)', isCorrect: true },
                  { text: 'C) Immediate Exploratory Laparotomy', isCorrect: false },
                  { text: 'D) Serum Amylase and Lipase only', isCorrect: false },
                ].map((opt, i) => {
                  let btnStyle = 'bg-[#0A0E1A] border-slate-800 text-slate-300';
                  if (isAnswerSubmitted) {
                    if (opt.isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    else if (selectedAnswer === i) btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                  } else if (selectedAnswer === i) {
                    btnStyle = 'border-sky-500 bg-sky-500/10 text-white';
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswerSubmitted}
                      onClick={() => setSelectedAnswer(i)}
                      className={`w-full p-3 text-right text-xs rounded-xl border transition-all ${btnStyle}`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Pearl */}
              {isAnswerSubmitted && (
                <div className="bg-[#0A0E1A] border border-slate-800 p-3.5 rounded-2xl space-y-2 animate-fadeIn text-xs leading-relaxed">
                  <div className="font-bold text-emerald-400">
                    {selectedAnswer === 1 ? '✓ إجابة صحيحة' : '✗ إجابة غير دقيقة'}
                  </div>
                  <p className="text-slate-300">
                    <strong>Explanation:</strong> MRCP هو الفحص غير التداخلي المعياري (Gold Standard Non-invasive) لتقييم شجرة القنوات الصفراوية بدقة دون مخاطر ERCP.
                  </p>
                  <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-amber-300">
                    <strong>Pearl 💡:</strong> في تسربات الصفراء، لا تتسرع بالفتح الجراحي؛ التدبير الأولي يكون بالموجات فوق الصوتية لتحديد التجمع، ثم تصريف عبر الجلد (PCD) مع ERCP ودعامة.
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                {!isAnswerSubmitted ? (
                  <button
                    disabled={selectedAnswer === null}
                    onClick={() => setIsAnswerSubmitted(true)}
                    className="w-full h-11 bg-sky-500 disabled:opacity-40 text-slate-950 font-bold rounded-xl"
                  >
                    تأكيد الإجابة
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedAnswer(null);
                      setIsAnswerSubmitted(false);
                    }}
                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
                  >
                    السؤال التالي (Next Question 05) →
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. TOPIC DETAILS DRAWER / MODAL                                           */}
      {/* ========================================================================= */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-[#0E1526] border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl animate-slideUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white">{selectedTopic.title}</h3>
                <span className="text-xs text-slate-400 font-mono">{selectedTopic.enTitle}</span>
              </div>
              <button onClick={() => setSelectedTopic(null)} className="text-slate-400">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { title: '📖 قراءة الفصل', desc: 'Bailey & Love Chapter' },
                { title: '🧠 Flashcards', desc: '42 بطاقة ذكية' },
                { title: '❓ MCQs', desc: 'اختبار تجريبي (20 سؤال)' },
                { title: '📝 My Notes', desc: 'ملاحظاتي السريرية' },
                { title: '⭐ Surgical Pearls', desc: 'أهم 15 قاعدة جراحية' },
                { title: '🔄 Review', desc: 'جلسة مراجعة متباعدة' },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (item.title.includes('MCQ')) {
                      setSelectedTopic(null);
                      setShowMCQModal(true);
                    }
                  }}
                  className="bg-[#0A0E1A] border border-slate-800 hover:border-sky-500/40 p-3 rounded-xl cursor-pointer transition-all"
                >
                  <span className="text-xs font-bold text-white block">{item.title}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{item.desc}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedTopic(null)}
              className="w-full h-11 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. BOTTOM NAVIGATION BAR + FLOATING ACTION BUTTON                        */}
      {/* ========================================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0E1A]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2">
        <div className="max-w-md mx-auto flex items-center justify-between relative">
          
          {/* Tab 1: الرئيسية */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 w-14 py-1 transition-all ${
              activeTab === 'home' ? 'text-sky-400' : 'text-slate-400'
            }`}
          >
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-bold">الرئيسية</span>
          </button>

          {/* Tab 2: العمليات */}
          <button
            onClick={() => setActiveTab('logbook')}
            className={`flex flex-col items-center gap-1 w-14 py-1 transition-all ${
              activeTab === 'logbook' ? 'text-sky-400' : 'text-slate-400'
            }`}
          >
            <span className="text-lg">🔪</span>
            <span className="text-[10px] font-bold">العمليات</span>
          </button>

          {/* Central Floating Action Button (FAB) */}
          <div className="relative -top-5">
            <button
              onClick={() => setShowWizard(true)}
              className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold flex items-center justify-center text-2xl shadow-xl shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all border-2 border-[#0A0E1A]"
              title="تسجيل عملية جديدة"
            >
              ➕
            </button>
          </div>

          {/* Tab 3: المنهج */}
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex flex-col items-center gap-1 w-14 py-1 transition-all ${
              activeTab === 'curriculum' ? 'text-sky-400' : 'text-slate-400'
            }`}
          >
            <span className="text-lg">📚</span>
            <span className="text-[10px] font-bold">المنهج</span>
          </button>

          {/* Tab 4: المراجعة */}
          <button
            onClick={() => setActiveTab('review')}
            className={`flex flex-col items-center gap-1 w-14 py-1 transition-all ${
              activeTab === 'review' ? 'text-sky-400' : 'text-slate-400'
            }`}
          >
            <span className="text-lg">🧠</span>
            <span className="text-[10px] font-bold">المراجعة</span>
          </button>

          {/* Tab 5: الإحصائيات */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 w-14 py-1 transition-all ${
              activeTab === 'analytics' ? 'text-sky-400' : 'text-slate-400'
            }`}
          >
            <span className="text-lg">📊</span>
            <span className="text-[10px] font-bold">الأرقام</span>
          </button>

        </div>
      </nav>

    </div>
  );
}
