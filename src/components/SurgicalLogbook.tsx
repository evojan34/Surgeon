import React, { useState, useEffect } from 'react';

// واجهة بيانات العملية الجراحية
interface SurgicalCase {
  id: string;
  procedureName: string;
  category: string;
  role: 'Surgeon' | 'First Assistant' | 'Supervised';
  urgency: 'Elective' | 'Emergency';
  complication: string;
  notes: string;
  date: string;
}

export default function SurgicalLogbook() {
  const [cases, setCases] = useState<SurgicalCase[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'SURGEON' | 'EMERGENCY' | 'COMPLICATIONS'>('ALL');
  const [showToast, setShowToast] = useState(false);

  // حقول النموذج
  const [procedureName, setProcedureName] = useState('');
  const [category, setCategory] = useState('HPB & Biliary');
  const [role, setRole] = useState<'Surgeon' | 'First Assistant' | 'Supervised'>('Surgeon');
  const [urgency, setUrgency] = useState<'Elective' | 'Emergency'>('Emergency');
  const [complication, setComplication] = useState('Uneventful');
  const [notes, setNotes] = useState('');

  // استرجاع البيانات المحفوظة محلياً عند التشغيل
  useEffect(() => {
    try {
      const saved = localStorage.getItem('board_surgical_logbook');
      if (saved) {
        setCases(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cases from localStorage', e);
    }
  }, []);

  // حفظ الحالة الجديدة
  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!procedureName.trim()) return;

    const newCase: SurgicalCase = {
      id: Date.now().toString(),
      procedureName: procedureName.trim(),
      category,
      role,
      urgency,
      complication,
      notes: notes.trim(),
      date: new Date().toLocaleDateString('ar-IQ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    };

    const updated = [newCase, ...cases];
    setCases(updated);
    try {
      localStorage.setItem('board_surgical_logbook', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    // تصفير الحقول وإظهار الإشعار
    setProcedureName('');
    setNotes('');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // حذف عملية
  const handleDeleteCase = (id: string) => {
    const updated = cases.filter(c => c.id !== id);
    setCases(updated);
    try {
      localStorage.setItem('board_surgical_logbook', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update localStorage', e);
    }
  };

  // العمليات المفلترة
  const filteredCases = cases.filter(c => {
    if (filter === 'SURGEON') return c.role === 'Surgeon';
    if (filter === 'EMERGENCY') return c.urgency === 'Emergency';
    if (filter === 'COMPLICATIONS') return c.complication !== 'Uneventful';
    return true;
  });

  // الحسابات الإحصائية
  const totalCount = cases.length;
  const surgeonCount = cases.filter(c => c.role === 'Surgeon').length;
  const emergencyCount = cases.filter(c => c.urgency === 'Emergency').length;
  const complicationCount = cases.filter(c => c.complication !== 'Uneventful').length;

  return (
    <div className="w-full max-w-4xl mx-auto my-6 font-sans text-slate-100 select-none">
      
      {/* Toast Alert للإشعار بحفظ العملية */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-500/90 text-white px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 border border-emerald-400/40 animate-bounce text-sm font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          تم تدوين العملية بنجاح في سجلك الجراحي!
        </div>
      )}

      {/* 1. شبكة العدادات الإحصائية الزجاجية (Modern Stat Badges) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        
        {/* إجمالي العمليات */}
        <div className="relative overflow-hidden bg-slate-900/70 border border-indigo-500/20 rounded-2xl p-4 backdrop-blur-xl shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-xs font-semibold tracking-wider">إجمالي العمليات</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-100 tracking-tight">{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">سجل البورد التراكمي</div>
        </div>

        {/* جراح رئيسي */}
        <div className="relative overflow-hidden bg-slate-900/70 border border-emerald-500/20 rounded-2xl p-4 backdrop-blur-xl shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold tracking-wider">جراح رئيسي (Surgeon)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-100 tracking-tight">{surgeonCount}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1 font-medium">حالات منفردة معتمدة</div>
        </div>

        {/* طوارئ */}
        <div className="relative overflow-hidden bg-slate-900/70 border border-rose-500/20 rounded-2xl p-4 backdrop-blur-xl shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold tracking-wider">حالات طارئة (Emergency)</span>
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-rose-100 tracking-tight">{emergencyCount}</div>
          <div className="text-[11px] text-rose-400/80 mt-1 font-medium">ساعات المناوبة الليلية</div>
        </div>

        {/* مضاعفات */}
        <div className="relative overflow-hidden bg-slate-900/70 border border-amber-500/20 rounded-2xl p-4 backdrop-blur-xl shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold tracking-wider">مضاعفات (Clavien {'>'} 0)</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-amber-100 tracking-tight">{complicationCount}</div>
          <div className="text-[11px] text-amber-400/80 mt-1 font-medium">متابعة التدقيق السريري</div>
        </div>

      </div>

      {/* 2. بطاقة نموذج تسجيل عملية جديدة (Dark Slate Medical Panel) */}
      <form onSubmit={handleAddCase} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 mb-8 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800/80 text-emerald-400 font-bold text-base">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          تدوين إجراء جراحي سريع
        </div>

        <div className="space-y-4">
          {/* اسم الإجراء */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 mr-1">
              اسم الإجراء الجراحي (Procedure Title)
            </label>
            <input
              type="text"
              required
              placeholder="مثال: Laparoscopic Cholecystectomy, Hartman's Procedure..."
              value={procedureName}
              onChange={(e) => setProcedureName(e.target.value)}
              className="w-full h-12 bg-slate-950/70 border border-slate-800 rounded-xl px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* التخصص والدور */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 mr-1">التخصص الفرعي (Sub-specialty)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-12 bg-slate-950/70 border border-slate-800 rounded-xl px-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="HPB & Biliary">جراحة الكبد والصفراء والبنكرياس (HPB)</option>
                <option value="Colorectal & Anorectal">القولون والمستقيم والشرج (Colorectal)</option>
                <option value="Upper GI & Bariatric">الجهاز الهضمي العلوي والبدانة (Upper GI)</option>
                <option value="Emergency & Trauma">الحوادث والطوارئ البطنية (Trauma/Emergency)</option>
                <option value="Hernia & Abdominal Wall">الفتوق وجدار البطن (Hernia)</option>
                <option value="Endocrine & Breast">الثدي والغدد الصماء (Breast & Endocrine)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 mr-1">دورك في العملية (Surgical Role)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full h-12 bg-slate-950/70 border border-slate-800 rounded-xl px-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="Surgeon">جراح منفرد / رئيسي (Surgeon)</option>
                <option value="Supervised">مُجرى تحت الإشراف (Supervised)</option>
                <option value="First Assistant">مساعد أول (First Assistant)</option>
              </select>
            </div>
          </div>

          {/* نوع الحالة والتصنيف */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 mr-1">أولوية الحالة (Admission Urgency)</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full h-12 bg-slate-950/70 border border-slate-800 rounded-xl px-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="Emergency">طارئة (Emergency)</option>
                <option value="Elective">باردة / مجدولة (Elective)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 mr-1">مضاعفات Clavien-Dindo Classification</label>
              <select
                value={complication}
                onChange={(e) => setComplication(e.target.value)}
                className="w-full h-12 bg-slate-950/70 border border-slate-800 rounded-xl px-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="Uneventful">لا يوجد (Uneventful Recovery)</option>
                <option value="Grade I: Minor Treatment">Grade I: علاج طفيف بالأدوية السريرية</option>
                <option value="Grade II: Pharmacological">Grade II: مضادات وريدية أو نقل دم</option>
                <option value="Grade IIIa: Intervention without GA">Grade IIIa: تداخل جراحي بدون تخدير عام</option>
                <option value="Grade IIIb: Intervention with GA">Grade IIIb: إعادة فتح تحت التخدير العام</option>
                <option value="Grade IV: ICU Admission">Grade IV: دخول العناية المركزة (ICU)</option>
              </select>
            </div>
          </div>

          {/* ملاحظات سريرية */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 mr-1">
              ملاحظات تشريحية أو صعوبات جراحية واجهتك (Clinical Pearls)
            </label>
            <textarea
              rows={2}
              placeholder="مثال: التصاقات شديدة في مثلث كالوت، تحويل إلى Subtotal Cholecystectomy..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* زر الحفظ العريض للإبهام */}
          <button
            type="submit"
            className="w-full h-13 mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            حفظ وتوثيق الحالة الجراحية
          </button>
        </div>
      </form>

      {/* 3. تبويبات التصفية وقائمة العمليات الأخيرة (Cards Feed) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            سجل الحالات الموثقة
          </h3>

          {/* تبويبات الفلترة السريعة */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'ALL' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              الكل ({cases.length})
            </button>
            <button
              onClick={() => setFilter('SURGEON')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'SURGEON' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              جراح رئيسي
            </button>
            <button
              onClick={() => setFilter('EMERGENCY')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'EMERGENCY' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              طوارئ
            </button>
            <button
              onClick={() => setFilter('COMPLICATIONS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'COMPLICATIONS' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              المضاعفات
            </button>
          </div>
        </div>

        {/* عرض الحالات أو شاشة الفراغ */}
        {filteredCases.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-3xl bg-slate-900/50 border border-dashed border-slate-800">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-300">لا توجد حالات مسجلة في هذا القسم</p>
            <p className="text-xs text-slate-500 mt-1">ابدأ بتوثيق العمليات الجراحية اليومية عبر النموذج بالأعلى لبناء ملفك المعتمد للبورد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-4 transition-all shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-100 text-base">{c.procedureName}</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {c.category}
                    </span>
                  </div>

                  {/* الشارات الملونة للعملية */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-md font-medium ${c.role === 'Surgeon' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-300'}`}>
                      {c.role === 'Surgeon' ? 'جراح رئيسي' : c.role}
                    </span>

                    <span className={`px-2 py-0.5 rounded-md font-medium ${c.urgency === 'Emergency' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                      {c.urgency === 'Emergency' ? 'طوارئ' : 'باردة'}
                    </span>

                    {c.complication !== 'Uneventful' && (
                      <span className="px-2 py-0.5 rounded-md font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {c.complication}
                      </span>
                    )}

                    <span className="text-slate-500 text-[11px] mr-auto">{c.date}</span>
                  </div>

                  {c.notes && (
                    <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 mt-2 font-mono">
                      {c.notes}
                    </p>
                  )}
                </div>

                {/* زر الحذف السريع */}
                <div className="flex items-center justify-end sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  <button
                    onClick={() => handleDeleteCase(c.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 active:scale-95 transition-all cursor-pointer"
                    title="حذف العملية"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
