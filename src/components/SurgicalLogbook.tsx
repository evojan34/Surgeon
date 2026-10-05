import React, { useState, useEffect } from 'react';

interface SurgicalCase {
  id: string;
  procedureName: string;
  category: string;
  role: 'Surgeon' | 'Supervised' | 'Assistant';
  urgency: 'Elective' | 'Emergency';
  complication: string;
  notes: string;
  date: string;
}

export default function SurgicalLogbook() {
  const [cases, setCases] = useState<SurgicalCase[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'SURGEON' | 'EMERGENCY' | 'COMPLICATIONS'>('ALL');
  const [showToast, setShowToast] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true);

  // Form Fields
  const [procedureName, setProcedureName] = useState('');
  const [category, setCategory] = useState('HPB & Biliary');
  const [role, setRole] = useState<'Surgeon' | 'Supervised' | 'Assistant'>('Surgeon');
  const [urgency, setUrgency] = useState<'Elective' | 'Emergency'>('Emergency');
  const [complication, setComplication] = useState('Uneventful');
  const [notes, setNotes] = useState('');

  // استرجاع السجل المخزن محلياً
  useEffect(() => {
    try {
      const saved = localStorage.getItem('board_surgical_logbook');
      if (saved) setCases(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
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
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    };

    const updated = [newCase, ...cases];
    setCases(updated);
    try {
      localStorage.setItem('board_surgical_logbook', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setProcedureName('');
    setNotes('');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  const handleDelete = (id: string) => {
    const updated = cases.filter(c => c.id !== id);
    setCases(updated);
    localStorage.setItem('board_surgical_logbook', JSON.stringify(updated));
  };

  const filtered = cases.filter(c => {
    if (filter === 'SURGEON') return c.role === 'Surgeon';
    if (filter === 'EMERGENCY') return c.urgency === 'Emergency';
    if (filter === 'COMPLICATIONS') return c.complication !== 'Uneventful';
    return true;
  });

  return (
    <div className="w-full max-w-2xl mx-auto my-4 px-2 select-none text-zinc-100 font-sans">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-zinc-950 font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm animate-fade-in">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
          تم تدوين الحالة في سجلك بنجاح
        </div>
      )}

      {/* 1. لوحة المؤشرات السريعة (Clean Minimal Stats) */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-3 text-center backdrop-blur-md">
          <span className="text-[10px] text-zinc-400 font-medium block">الإجمالي</span>
          <span className="text-xl font-extrabold text-zinc-100 mt-0.5 block">{cases.length}</span>
        </div>
        <div className="bg-zinc-900/90 border border-emerald-500/20 rounded-2xl p-3 text-center backdrop-blur-md">
          <span className="text-[10px] text-emerald-400 font-medium block">جراح رئيسي</span>
          <span className="text-xl font-extrabold text-emerald-300 mt-0.5 block">
            {cases.filter(c => c.role === 'Surgeon').length}
          </span>
        </div>
        <div className="bg-zinc-900/90 border border-rose-500/20 rounded-2xl p-3 text-center backdrop-blur-md">
          <span className="text-[10px] text-rose-400 font-medium block">طوارئ</span>
          <span className="text-xl font-extrabold text-rose-300 mt-0.5 block">
            {cases.filter(c => c.urgency === 'Emergency').length}
          </span>
        </div>
        <div className="bg-zinc-900/90 border border-amber-500/20 rounded-2xl p-3 text-center backdrop-blur-md">
          <span className="text-[10px] text-amber-400 font-medium block">مضاعفات</span>
          <span className="text-xl font-extrabold text-amber-300 mt-0.5 block">
            {cases.filter(c => c.complication !== 'Uneventful').length}
          </span>
        </div>
      </div>

      {/* 2. بطاقة تسجيل الحالة (Structured Segmented Form) */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-4 sm:p-5 mb-6 shadow-xl backdrop-blur-xl">
        <div 
          onClick={() => setIsFormOpen(!isFormOpen)} 
          className="flex items-center justify-between cursor-pointer pb-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <h2 className="text-sm font-bold text-zinc-100 tracking-wide">تسجيل إجراء جراحي جديد</h2>
          </div>
          <span className="text-xs text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-full">
            {isFormOpen ? 'إخفاء' : 'إظهار النموذج'}
          </span>
        </div>

        {isFormOpen && (
          <form onSubmit={handleSave} className="mt-3 space-y-4">
            
            {/* اسم العملية */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">اسم العملية (Procedure)</label>
              <input
                type="text"
                required
                placeholder="مثال: Laparoscopic Appendectomy"
                value={procedureName}
                onChange={(e) => setProcedureName(e.target.value)}
                className="w-full h-11 bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* تصنيف التخصص */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">التخصص الجراحي</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="HPB & Biliary">كبد، مرارة، وبنكرياس (HPB & Biliary)</option>
                <option value="Colorectal">قولون ومستقيم وشرج (Colorectal)</option>
                <option value="Upper GI & Bariatric">جهاز هضمي علوي وبدانة (Upper GI)</option>
                <option value="Trauma & Acute Abdomen">حوادث وبطن حاد (Trauma / Acute)</option>
                <option value="Abdominal Wall & Hernia">فتوق وجدار البطن (Hernia)</option>
                <option value="Endocrine & Breast">ثدي وغدد صماء (Breast & Endocrine)</option>
              </select>
            </div>

            {/* نوع الأولوية: أزرار اختيار سريعة (Segmented Pills) */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">نوع الدخول</label>
              <div className="grid grid-cols-2 gap-2 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setUrgency('Emergency')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${urgency === 'Emergency' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  طوارئ (Emergency) ⚡
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('Elective')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${urgency === 'Elective' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  مجدولة (Elective) 📅
                </button>
              </div>
            </div>

            {/* الدور الجراحي: خيارات ثلاثية مريحة */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">دورك الجراحي</label>
              <div className="grid grid-cols-3 gap-1.5 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setRole('Surgeon')}
                  className={`py-2 text-[11px] font-bold rounded-lg transition-all ${role === 'Surgeon' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  جراح رئيسي
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Supervised')}
                  className={`py-2 text-[11px] font-bold rounded-lg transition-all ${role === 'Supervised' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  تحت الإشراف
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Assistant')}
                  className={`py-2 text-[11px] font-bold rounded-lg transition-all ${role === 'Assistant' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  مساعد أول
                </button>
              </div>
            </div>

            {/* تصنيف المضاعفات */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">المضاعفات (Clavien-Dindo)</label>
              <select
                value={complication}
                onChange={(e) => setComplication(e.target.value)}
                className="w-full h-11 bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Uneventful">بدون مضاعفات (Uneventful Recovery)</option>
                <option value="Grade I">Grade I: علاج سريري طفيف بدون أدوية</option>
                <option value="Grade II">Grade II: علاج دوائي وريدي أو نقل دم</option>
                <option value="Grade III">Grade III: تدخل تداخلي جراحي / تنظيري</option>
                <option value="Grade IV">Grade IV: دخول وحدة العناية المركزة (ICU)</option>
              </select>
            </div>

            {/* الملاحظات السريرية */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">ملاحظات ودروس مستفادة (Pearls)</label>
              <input
                type="text"
                placeholder="نقاط تشريحية هامة أو صعوبات أثناء العملية..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-10 bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* زر الحفظ العريض */}
            <button
              type="submit"
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-zinc-950 font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 transition-all text-sm mt-2"
            >
              حفظ الحالة في السجل
            </button>
          </form>
        )}
      </div>

      {/* 3. سجل الحالات الموثقة (Clean Timeline Feed) */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3 px-1">
          <span className="text-xs font-bold text-zinc-400">الحالات الأخيرة</span>
          
          {/* فلتر سريع */}
          <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-[10px]">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg ${filter === 'ALL' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-500'}`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilter('SURGEON')}
              className={`px-2.5 py-1 rounded-lg ${filter === 'SURGEON' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-zinc-500'}`}
            >
              رئيسي
            </button>
            <button
              onClick={() => setFilter('EMERGENCY')}
              className={`px-2.5 py-1 rounded-lg ${filter === 'EMERGENCY' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-zinc-500'}`}
            >
              طوارئ
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-10 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
            <p className="text-xs text-zinc-500">لا توجد عمليات مسجلة هنا حتى الآن</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(c => (
              <div 
                key={c.id} 
                className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-3.5 flex items-start justify-between gap-3 hover:border-zinc-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-100">{c.procedureName}</span>
                    <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md">
                      {c.date}
                    </span>
                  </div>

                  {/* الشارات الملونة */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">
                      {c.category}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${c.role === 'Surgeon' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-300'}`}>
                      {c.role === 'Surgeon' ? 'جراح منفرد' : c.role}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${c.urgency === 'Emergency' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                      {c.urgency === 'Emergency' ? 'طوارئ' : 'مجدولة'}
                    </span>
                    {c.complication !== 'Uneventful' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {c.complication}
                      </span>
                    )}
                  </div>

                  {c.notes && (
                    <p className="text-[11px] text-zinc-400 mt-1 bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/40">
                      {c.notes}
                    </p>
                  )}
                </div>

                {/* زر الحذف */}
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-zinc-600 hover:text-rose-400 p-1 rounded-lg transition-colors"
                  title="حذف"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
