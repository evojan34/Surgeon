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

export default function SurgicalLogbook() {
  const [activeTab, setActiveTab] = useState<'home' | 'logbook' | 'curriculum' | 'review' | 'analytics'>('home');
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [showToast, setShowToast] = useState(false);

  // حقول معالج تسجيل العملية (Wizard)
  const [opName, setOpName] = useState('');
  const [opSpecialty, setOpSpecialty] = useState<Operation['specialty']>('HPB');
  const [opRole, setOpRole] = useState<Operation['role']>('Surgeon');
  const [opUrgency, setOpUrgency] = useState<Operation['urgency']>('Emergency');
  const [opOutcome, setOpOutcome] = useState<Operation['outcome']>('Uneventful');
  const [opPearl, setOpPearl] = useState('');

  // فلترة السجل
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  // بنك الأسئلة التفاعلي (MCQ)
  const [showMCQ, setShowMCQ] = useState(false);
  const [mcqAnswer, setMcqAnswer] = useState<number | null>(null);

  // قائمة العمليات الافتراضية
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
      pearl: 'High ligation of ileocolic vessels; ensure strict ureteric preservation.'
    }
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('surgery_suite_cases');
      if (saved) setOperations(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveOperation = () => {
    if (!opName.trim()) return;
    const newOp: Operation = {
      id: Date.now().toString(),
      name: opName.trim(),
      specialty: opSpecialty,
      role: opRole,
      urgency: opUrgency,
      outcome: opOutcome,
      date: new Date().toISOString().split('T')[0],
      pearl: opPearl.trim()
    };
    const updated = [newOp, ...operations];
    setOperations(updated);
    try {
      localStorage.setItem('surgery_suite_cases', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setOpName('');
    setOpPearl('');
    setShowWizard(false);
    setWizardStep(1);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const filteredOps = operations.filter(op => {
    if (selectedFilter === 'ALL') return true;
    return op.specialty === selectedFilter;
  });

  return (
    <div dir="rtl" className="surgery-app-root">
      
      {/* Toast Alert */}
      {showToast && (
        <div className="toast-box">
          ✓ تم تدوين العملية بنجاح في سجلك المعتمد
        </div>
      )}

      {/* ======================= TOP APP BAR ======================= */}
      <header className="app-header">
        <div className="user-info">
          <div className="user-avatar">د.إ</div>
          <div>
            <div className="user-name">
              <span>مرحبًا د. إيفان 👋</span>
              <span className="badge-resident">Year 2 Resident</span>
            </div>
            <p className="user-subtitle">استمر في التقدم، أنت أقرب لهدفك اليوم.</p>
          </div>
        </div>
        <div className="streak-badge">
          <span>🔥</span>
          <span>12 يوم</span>
        </div>
      </header>

      {/* ======================= MAIN CONTENT TABS ======================= */}
      <main className="app-main-content">

        {/* 1. HOME DASHBOARD */}
        {activeTab === 'home' && (
          <div className="tab-pane">
            
            {/* HERO CARD: Year 2 Bailey & Love */}
            <div className="hero-progress-card">
              <div className="hero-info">
                <span className="hero-kicker">المنهج التدريبي للجراحة العامة</span>
                <h2 className="hero-title">Year 2 — Bailey & Love 28th</h2>
                <div className="hero-stats">
                  <strong>204 / 300</strong> قسم مكتمل
                </div>
              </div>
              <div className="ring-container">
                <svg className="progress-ring" viewBox="0 0 36 36">
                  <path
                    className="ring-bg"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="ring-fill"
                    strokeDasharray="68, 100"
                    strokeLinecap="round"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="ring-text">68%</span>
              </div>
            </div>

            {/* 3 STATS CARDS */}
            <div className="stats-row">
              <div className="mini-stat-card" onClick={() => setActiveTab('logbook')}>
                <div className="mini-stat-header">
                  <span className="mini-stat-title">🔪 العمليات</span>
                  <span className="dot dot-blue"></span>
                </div>
                <div className="mini-stat-val">71 عملية</div>
                <div className="mini-stat-sub">
                  <span className="text-success">53 رئيسية</span> • <span className="text-danger">18 طوارئ</span>
                </div>
              </div>

              <div className="mini-stat-card" onClick={() => setActiveTab('curriculum')}>
                <div className="mini-stat-header">
                  <span className="mini-stat-title">📚 الدراسة</span>
                  <span className="dot dot-purple"></span>
                </div>
                <div className="mini-stat-val">12 / 17</div>
                <div className="mini-stat-sub">68% مكتمل</div>
              </div>

              <div className="mini-stat-card" onClick={() => setActiveTab('review')}>
                <div className="mini-stat-header">
                  <span className="mini-stat-title">🎯 هدف اليوم</span>
                  <span className="dot dot-amber"></span>
                </div>
                <div className="mini-stat-val">23 كارت</div>
                <div className="mini-stat-sub">2 موضوع • 1 مراجعة</div>
              </div>
            </div>

            {/* QUICK TOOLS */}
            <div className="section-block">
              <h3 className="section-heading">أدوات سريعة</h3>
              <div className="tools-grid">
                <button className="tool-btn" onClick={() => setActiveTab('curriculum')}>
                  <span className="tool-icon">📚</span>
                  <span>تصفح المنهج</span>
                </button>
                <button className="tool-btn" onClick={() => setShowWizard(true)}>
                  <span className="tool-icon">➕</span>
                  <span>تسجيل عملية</span>
                </button>
                <button className="tool-btn" onClick={() => setShowMCQ(true)}>
                  <span className="tool-icon">❓</span>
                  <span>بنك الأسئلة</span>
                </button>
                <button className="tool-btn" onClick={() => setActiveTab('review')}>
                  <span className="tool-icon">🧠</span>
                  <span>المراجعة</span>
                </button>
                <button className="tool-btn" onClick={() => setActiveTab('analytics')}>
                  <span className="tool-icon">📊</span>
                  <span>الإحصائيات</span>
                </button>
                <button className="tool-btn" onClick={() => setActiveTab('logbook')}>
                  <span className="tool-icon">🔪</span>
                  <span>السجل اليومي</span>
                </button>
              </div>
            </div>

            {/* LATEST ACTIVITY */}
            <div className="section-block">
              <div className="section-header-row">
                <h3 className="section-heading">آخر نشاط</h3>
                <span className="link-action" onClick={() => setActiveTab('logbook')}>عرض الكل</span>
              </div>
              <div className="timeline-list">
                {operations.slice(0, 2).map(op => (
                  <div key={op.id} className="timeline-card">
                    <div className="timeline-content">
                      <div className="timeline-top">
                        <span className="timeline-title">{op.name}</span>
                        <span className="tag-spec">{op.specialty}</span>
                      </div>
                      <div className="timeline-meta">
                        <span className="text-success">{op.role}</span>
                        <span>•</span>
                        <span className={op.urgency === 'Emergency' ? 'text-danger' : 'text-primary'}>{op.urgency}</span>
                        <span>•</span>
                        <span>{op.date}</span>
                      </div>
                    </div>
                    <span className="badge-outcome">✓ {op.outcome}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 2. OPERATIVE LOGBOOK */}
        {activeTab === 'logbook' && (
          <div className="tab-pane">
            <h2 className="tab-title">سجل العمليات الجراحية</h2>
            
            {/* Top Stat Summary Bar */}
            <div className="log-summary-bar">
              <div className="log-stat-item">
                <span className="log-stat-val">{operations.length}</span>
                <span className="log-stat-lbl">الإجمالي</span>
              </div>
              <div className="log-stat-item">
                <span className="log-stat-val text-success">53</span>
                <span className="log-stat-lbl">رئيسية</span>
              </div>
              <div className="log-stat-item">
                <span className="log-stat-val text-danger">18</span>
                <span className="log-stat-lbl">طوارئ</span>
              </div>
              <div className="log-stat-item">
                <span className="log-stat-val text-primary">72%</span>
                <span className="log-stat-lbl">دون مضاعفات</span>
              </div>
              <div className="log-stat-item">
                <span className="log-stat-val text-amber">5</span>
                <span className="log-stat-lbl">مضاعفات</span>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="filter-chips-row">
              {['ALL', 'HPB', 'Colorectal', 'Upper GI', 'Breast', 'Trauma'].map(chip => (
                <button
                  key={chip}
                  onClick={() => setSelectedFilter(chip)}
                  className={`filter-chip ${selectedFilter === chip ? 'active' : ''}`}
                >
                  {chip === 'ALL' ? 'الكل' : chip}
                </button>
              ))}
            </div>

            {/* Case List */}
            <div className="cases-list">
              {filteredOps.map(op => (
                <div key={op.id} className="case-card">
                  <div className="case-card-header">
                    <div>
                      <h4 className="case-name">{op.name}</h4>
                      <div className="case-subtitle">
                        <span>{op.specialty}</span> • <span className="text-primary">{op.role}</span>
                      </div>
                    </div>
                    <span className={`pill-urgency ${op.urgency === 'Emergency' ? 'urg-em' : 'urg-el'}`}>
                      {op.urgency}
                    </span>
                  </div>
                  <div className="case-card-footer">
                    <span className="case-date">{op.date}</span>
                    <span className="case-outcome">✓ {op.outcome}</span>
                  </div>
                  {op.pearl && (
                    <div className="case-pearl">
                      <strong>💡 Pearl:</strong> {op.pearl}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. CURRICULUM */}
        {activeTab === 'curriculum' && (
          <div className="tab-pane">
            <h2 className="tab-title">الخارطة الدراسية (Bailey & Love 28th)</h2>
            <div className="curriculum-overview">
              <span>Year 2 Curriculum Progress</span>
              <strong>68% (12 / 17 Topics)</strong>
            </div>

            <div className="module-cards-col">
              {[
                { title: 'المبادئ العامة في الجراحة', en: 'General Surgical Principles', p: 100, done: 5, total: 5, c: '#10b981' },
                { title: 'إصابات الحوادث والإنقاذ (ATLS)', en: 'Trauma & Damage Control', p: 60, done: 3, total: 5, c: '#0284c7' },
                { title: 'الكبد، المرارة والبنكرياس', en: 'HPB & Biliary Surgery', p: 45, done: 2, total: 5, c: '#f59e0b' },
                { title: 'القولون والمستقيم والشرج', en: 'Colorectal & Anorectal', p: 0, done: 0, total: 7, c: '#64748b' },
              ].map((m, i) => (
                <div key={i} className="module-card">
                  <div className="module-header">
                    <div>
                      <h4 className="module-title">{m.title}</h4>
                      <span className="module-en">{m.en}</span>
                    </div>
                    <span className="module-fraction">{m.done} / {m.total}</span>
                  </div>
                  <div className="module-bar-track">
                    <div className="module-bar-fill" style={{ width: `${m.p}%`, backgroundColor: m.c }}></div>
                  </div>
                  <div className="module-footer">
                    <span>مكتمل: {m.p}%</span>
                    <span className="text-primary font-bold">عرض الفصول ←</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SMART REVIEW */}
        {activeTab === 'review' && (
          <div className="tab-pane">
            <h2 className="tab-title">المراجعة الذكية (Spaced Repetition)</h2>
            
            <div className="srs-card">
              <span className="srs-badge">Today's Review</span>
              <div className="srs-count">23 Cards</div>
              <p className="srs-desc">بطاقات مستحقة للمراجعة اليوم وفق جدول التكرار المتباعد.</p>
              
              <div className="srs-breakdown">
                <div className="srs-stat-box text-danger">
                  <strong>5</strong>
                  <span>متأخرة</span>
                </div>
                <div className="srs-stat-box text-amber">
                  <strong>8</strong>
                  <span>تحتاج مراجعة</span>
                </div>
                <div className="srs-stat-box text-success">
                  <strong>10</strong>
                  <span>جديدة</span>
                </div>
              </div>

              <button className="srs-start-btn" onClick={() => setShowMCQ(true)}>
                ▶ ابدأ المراجعة الذكية
              </button>
            </div>
          </div>
        )}

        {/* 5. ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="tab-pane">
            <h2 className="tab-title">الإحصائيات السريرية (Analytics)</h2>

            <div className="stats-kpi-grid">
              <div className="kpi-card">
                <span className="kpi-lbl">إجمالي العمليات</span>
                <span className="kpi-val">71</span>
                <span className="text-success text-xs mt-1">تطور ممتاز</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-lbl">معدل المضاعفات</span>
                <span className="kpi-val text-success">4.2%</span>
                <span className="text-secondary text-xs mt-1">ضمن المعيار العالمي</span>
              </div>
            </div>

            <div className="analytics-card">
              <h4 className="analytics-heading">Distribution by Specialty</h4>
              <div className="bars-list">
                {[
                  { name: 'HPB', count: 28, pct: 40, col: '#0284c7' },
                  { name: 'Trauma', count: 18, pct: 25, col: '#f43f5e' },
                  { name: 'Colorectal', count: 14, pct: 20, col: '#818cf8' },
                  { name: 'Upper GI', count: 11, pct: 15, col: '#10b981' }
                ].map((item, idx) => (
                  <div key={idx} className="bar-row">
                    <div className="bar-row-info">
                      <span>{item.name}</span>
                      <span>{item.count} ({item.pct}%)</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${item.pct}%`, backgroundColor: item.col }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ======================= 3-STEP WIZARD MODAL ======================= */}
      {showWizard && (
        <div className="wizard-overlay">
          <div className="wizard-modal">
            <div className="wizard-header">
              <div className="wizard-step-indicator">
                <span className="step-circle">{wizardStep}</span>
                <span className="step-title">
                  {wizardStep === 1 && 'الخطوة 1: اسم وتخصص العملية'}
                  {wizardStep === 2 && 'الخطوة 2: دورك ونوع الدخول'}
                  {wizardStep === 3 && 'الخطوة 3: النتيجة وملاحظات الـ Pearls'}
                </span>
              </div>
              <button className="close-btn" onClick={() => setShowWizard(false)}>✕</button>
            </div>

            {/* STEP 1 */}
            {wizardStep === 1 && (
              <div className="wizard-body">
                <div className="form-group">
                  <label className="field-label">اسم العملية (Procedure Title)</label>
                  <input
                    type="text"
                    className="text-input"
                    placeholder="ابحث أو اكتب اسم العملية..."
                    value={opName}
                    onChange={(e) => setOpName(e.target.value)}
                  />
                  <div className="autocomplete-chips">
                    {[
                      'Laparoscopic Appendectomy',
                      'Laparoscopic Cholecystectomy',
                      'Hernia Repair',
                      'Thyroidectomy',
                      'Whipple Procedure',
                      'Right Hemicolectomy'
                    ].map((proc, i) => (
                      <span key={i} className="chip-auto" onClick={() => setOpName(proc)}>
                        {proc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">التخصص (Specialty)</label>
                  <div className="grid-selection-3">
                    {(['HPB', 'Colorectal', 'Breast', 'Upper GI', 'Trauma', 'Vascular'] as Operation['specialty'][]).map(spec => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => setOpSpecialty(spec)}
                        className={`select-card ${opSpecialty === spec ? 'active' : ''}`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={!opName}
                  onClick={() => setWizardStep(2)}
                  className="btn-next"
                >
                  التالي: دورك في العملية ←
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {wizardStep === 2 && (
              <div className="wizard-body">
                <div className="form-group">
                  <label className="field-label">دورك في العملية (Surgical Role)</label>
                  <div className="grid-selection-2">
                    {(['Surgeon', '1st Assistant', '2nd Assistant', 'Observer'] as Operation['role'][]).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setOpRole(r)}
                        className={`select-card ${opRole === r ? 'active' : ''}`}
                      >
                        {r === 'Surgeon' ? '🔵 Surgeon (رئيسي)' : r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">نوع الدخول (Admission Type)</label>
                  <div className="grid-selection-2">
                    <button
                      type="button"
                      onClick={() => setOpUrgency('Emergency')}
                      className={`select-card ${opUrgency === 'Emergency' ? 'active-danger' : ''}`}
                    >
                      ⚡ Emergency (طوارئ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpUrgency('Elective')}
                      className={`select-card ${opUrgency === 'Elective' ? 'active-primary' : ''}`}
                    >
                      📅 Elective (مجدولة)
                    </button>
                  </div>
                </div>

                <div className="actions-two">
                  <button className="btn-back" onClick={() => setWizardStep(1)}>السابق</button>
                  <button className="btn-next" onClick={() => setWizardStep(3)}>التالي: النتيجة ←</button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {wizardStep === 3 && (
              <div className="wizard-body">
                <div className="form-group">
                  <label className="field-label">نتيجة العملية (Outcome)</label>
                  <div className="grid-selection-3">
                    <button
                      type="button"
                      onClick={() => setOpOutcome('Uneventful')}
                      className={`select-card ${opOutcome === 'Uneventful' ? 'active-success' : ''}`}
                    >
                      ✅ Uneventful
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpOutcome('Complication')}
                      className={`select-card ${opOutcome === 'Complication' ? 'active-warning' : ''}`}
                    >
                      ⚠️ Complication
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpOutcome('Mortality')}
                      className={`select-card ${opOutcome === 'Mortality' ? 'active-danger' : ''}`}
                    >
                      ❌ Mortality
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">ما أهم شيء تعلمته؟ (Surgical Pearls)</label>
                  <textarea
                    rows={2}
                    className="text-input"
                    placeholder="نقطة تشريحية، صعوبة واجهتك..."
                    value={opPearl}
                    onChange={(e) => setOpPearl(e.target.value)}
                  />
                </div>

                <div className="photo-stub">
                  📷 إضافة صورة للعملية (Intra-operative photo)
                </div>

                <div className="actions-two">
                  <button className="btn-back" onClick={() => setWizardStep(2)}>السابق</button>
                  <button className="btn-save" onClick={handleSaveOperation}>💾 حفظ العملية</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= MCQ MODAL ======================= */}
      {showMCQ && (
        <div className="wizard-overlay">
          <div className="wizard-modal">
            <div className="wizard-header">
              <span className="text-primary font-bold text-xs">Question 04 / 25 • HPB Surgery</span>
              <button className="close-btn" onClick={() => { setShowMCQ(false); setMcqAnswer(null); }}>✕</button>
            </div>
            <div className="wizard-body">
              <p className="mcq-question">
                مريض عمره 45 سنة، خضع لاستئصال مرارة بالمنظار (Lap Chole)، وفي اليوم الثاني ظهرت آلام وحمى وارتفاع البيليروبين. ما هو الإجراء التشخيصي الأول الأكثر حساسية لتسرب الصفراء؟
              </p>
              
              <div className="mcq-options">
                {[
                  'A) Ultrasound of the Abdomen',
                  'B) MRCP (Magnetic Resonance Cholangiopancreatography)',
                  'C) Immediate Exploratory Laparotomy',
                  'D) Serum Amylase and Lipase only'
                ].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setMcqAnswer(i)}
                    className={`mcq-opt-btn ${mcqAnswer === i ? (i === 1 ? 'opt-correct' : 'opt-wrong') : ''}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {mcqAnswer !== null && (
                <div className="mcq-expl">
                  <strong className="text-success">✓ التفسير:</strong> MRCP هو المعيار الذهبي غير التداخلي لتشخيص تسربات القنوات الصفراوية بدقة عالية.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================= BOTTOM NAVIGATION ======================= */}
      <nav className="bottom-nav">
        <button
          onClick={() => setActiveTab('home')}
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">الرئيسية</span>
        </button>

        <button
          onClick={() => setActiveTab('logbook')}
          className={`nav-item ${activeTab === 'logbook' ? 'active' : ''}`}
        >
          <span className="nav-icon">🔪</span>
          <span className="nav-label">العمليات</span>
        </button>

        {/* Central Floating Action Button */}
        <div className="fab-container">
          <button
            onClick={() => setShowWizard(true)}
            className="fab-button"
            title="تسجيل عملية"
          >
            ➕
          </button>
        </div>

        <button
          onClick={() => setActiveTab('curriculum')}
          className={`nav-item ${activeTab === 'curriculum' ? 'active' : ''}`}
        >
          <span className="nav-icon">📚</span>
          <span className="nav-label">المنهج</span>
        </button>

        <button
          onClick={() => setActiveTab('review')}
          className={`nav-item ${activeTab === 'review' ? 'active' : ''}`}
        >
          <span className="nav-icon">🧠</span>
          <span className="nav-label">المراجعة</span>
        </button>
      </nav>

      {/* ======================= EMBEDDED STYLES ======================= */}
      <style>{`
        .surgery-app-root {
          background-color: #0B0F19;
          color: #F8FAFC;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          min-height: 100vh;
          padding-bottom: 90px;
          box-sizing: border-box;
          max-width: 680px;
          margin: 0 auto;
        }
        .surgery-app-root * {
          box-sizing: border-box;
        }
        .app-header {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(11, 15, 25, 0.9);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #1E293B;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #0284c7, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 14px;
          color: #fff;
        }
        .user-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
        }
        .badge-resident {
          font-size: 10px;
          background: rgba(2, 132, 199, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(2, 132, 199, 0.3);
          padding: 2px 8px;
          border-radius: 20px;
        }
        .user-subtitle {
          font-size: 11px;
          color: #94A3B8;
          margin: 2px 0 0;
        }
        .streak-badge {
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: #fbbf24;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .app-main-content {
          padding: 16px;
        }
        .tab-pane {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .hero-progress-card {
          background: linear-gradient(135deg, #131d36 0%, #0e1528 100%);
          border: 1px solid rgba(2, 132, 199, 0.25);
          border-radius: 24px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }
        .hero-kicker {
          font-size: 10px;
          font-weight: 800;
          color: #38bdf8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .hero-title {
          font-size: 17px;
          font-weight: 800;
          color: #fff;
          margin: 4px 0 8px;
        }
        .hero-stats {
          font-size: 12px;
          color: #cbd5e1;
        }
        .ring-container {
          position: relative;
          width: 76px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .progress-ring {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .ring-bg {
          color: #1e293b;
        }
        .ring-fill {
          color: #38bdf8;
          transition: stroke-dasharray 0.8s ease;
        }
        .ring-text {
          position: absolute;
          font-size: 14px;
          font-weight: 800;
          color: #fff;
        }
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .mini-stat-card {
          background: #111827;
          border: 1px solid #1E293B;
          border-radius: 16px;
          padding: 12px;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .mini-stat-card:hover {
          border-color: rgba(2, 132, 199, 0.4);
        }
        .mini-stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .mini-stat-title {
          font-size: 11px;
          font-weight: 700;
          color: #cbd5e1;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .dot-blue { background: #38bdf8; }
        .dot-purple { background: #818cf8; }
        .dot-amber { background: #f59e0b; }
        .mini-stat-val {
          font-size: 16px;
          font-weight: 800;
          color: #fff;
        }
        .mini-stat-sub {
          font-size: 9px;
          color: #94a3b8;
          margin-top: 3px;
        }
        .text-success { color: #10b981; }
        .text-danger { color: #f43f5e; }
        .text-primary { color: #38bdf8; }
        .text-amber { color: #f59e0b; }
        .section-block {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .section-heading {
          font-size: 11px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          margin: 0;
        }
        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .link-action {
          font-size: 11px;
          color: #38bdf8;
          font-weight: 700;
          cursor: pointer;
        }
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .tool-btn {
          background: #111827;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: #e2e8f0;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }
        .tool-btn:hover {
          background: #1e293b;
        }
        .tool-icon {
          font-size: 18px;
        }
        .timeline-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .timeline-card {
          background: #111827;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .timeline-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .timeline-title {
          font-size: 13px;
          font-weight: 700;
          color: #fff;
        }
        .tag-spec {
          font-size: 10px;
          background: #1e293b;
          color: #94a3b8;
          padding: 2px 6px;
          border-radius: 6px;
        }
        .timeline-meta {
          font-size: 10px;
          color: #94a3b8;
          display: flex;
          gap: 6px;
          margin-top: 4px;
        }
        .badge-outcome {
          font-size: 11px;
          font-weight: 700;
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 4px 8px;
          border-radius: 8px;
        }
        .tab-title {
          font-size: 16px;
          font-weight: 800;
          margin: 0;
        }
        .log-summary-bar {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          background: #111827;
          border: 1px solid #1e293b;
          border-radius: 14px;
          padding: 10px;
          text-align: center;
        }
        .log-stat-val {
          font-size: 15px;
          font-weight: 800;
          display: block;
        }
        .log-stat-lbl {
          font-size: 9px;
          color: #94a3b8;
          display: block;
          margin-top: 2px;
        }
        .filter-chips-row {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .filter-chip {
          background: #111827;
          border: 1px solid #1e293b;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 12px;
          cursor: pointer;
          white-space: nowrap;
        }
        .filter-chip.active {
          background: #0284c7;
          color: #fff;
          border-color: #0284c7;
        }
        .cases-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .case-card {
          background: #111827;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .case-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .case-name {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }
        .case-subtitle {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
        }
        .pill-urgency {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
        }
        .urg-em {
          background: rgba(244, 63, 94, 0.15);
          color: #f43f5e;
          border: 1px solid rgba(244, 63, 94, 0.3);
        }
        .urg-el {
          background: rgba(2, 132, 199, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(2, 132, 199, 0.3);
        }
        .case-card-footer {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #94a3b8;
          border-top: 1px solid #1e293b;
          padding-top: 8px;
        }
        .case-outcome {
          color: #10b981;
          font-weight: 700;
        }
        .case-pearl {
          background: #0b0f19;
          border: 1px solid #1e293b;
          border-radius: 10px;
          padding: 8px 10px;
          font-size: 11px;
          color: #fde68a;
          line-height: 1.4;
        }
        .curriculum-overview {
          background: #111827;
          border: 1px solid #1e293b;
          border-radius: 14px;
          padding: 14px;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #cbd5e1;
        }
        .module-cards-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .module-card {
          background: #111827;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .module-title {
          font-size: 13px;
          font-weight: 700;
          margin: 0;
        }
        .module-en {
          font-size: 10px;
          color: #94a3b8;
          display: block;
        }
        .module-fraction {
          font-size: 11px;
          color: #94a3b8;
        }
        .module-bar-track {
          width: 100%;
          height: 6px;
          background: #1e293b;
          border-radius: 3px;
          overflow: hidden;
        }
        .module-bar-fill {
          height: 100%;
          border-radius: 3px;
        }
        .module-footer {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #94a3b8;
        }
        .srs-card {
          background: #111827;
          border: 1px solid #1e293b;
          border-radius: 20px;
          padding: 24px 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .srs-badge {
          background: rgba(129, 140, 248, 0.15);
          color: #818cf8;
          border: 1px solid rgba(129, 140, 248, 0.3);
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 14px;
        }
        .srs-count {
          font-size: 32px;
          font-weight: 900;
          color: #fff;
        }
        .srs-desc {
          font-size: 12px;
          color: #94a3b8;
          margin: 0;
        }
        .srs-breakdown {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          width: 100%;
          padding: 12px 0;
          border-top: 1px solid #1e293b;
        }
        .srs-stat-box {
          background: #0b0f19;
          border: 1px solid #1e293b;
          border-radius: 10px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .srs-stat-box strong {
          font-size: 14px;
        }
        .srs-stat-box span {
          font-size: 9px;
          color: #94a3b8;
        }
        .srs-start-btn {
          width: 100%;
          height: 46px;
          background: #4f46e5;
          color: #fff;
          font-weight: 800;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-size: 13px;
        }
        .stats-kpi-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .kpi-card {
          background: #111827;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: 14px;
          display: flex;
          flex-direction: column;
        }
        .kpi-lbl {
          font-size: 11px;
          color: #94a3b8;
        }
        .kpi-val {
          font-size: 22px;
          font-weight: 900;
          margin-top: 4px;
        }
        .analytics-card {
          background: #111827;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .analytics-heading {
          font-size: 12px;
          font-weight: 800;
          color: #cbd5e1;
          margin: 0;
        }
        .bars-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .bar-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .bar-row-info {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #94a3b8;
        }
        .bar-track {
          width: 100%;
          height: 6px;
          background: #1e293b;
          border-radius: 3px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 3px;
        }
        .wizard-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        @media(min-width: 640px) {
          .wizard-overlay {
            align-items: center;
            padding: 16px;
          }
        }
        .wizard-modal {
          background: #0e1526;
          border: 1px solid #1e293b;
          width: 100%;
          max-width: 520px;
          border-radius: 24px 24px 0 0;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media(min-width: 640px) {
          .wizard-modal {
            border-radius: 24px;
          }
        }
        .wizard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #1e293b;
          padding-bottom: 12px;
        }
        .wizard-step-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .step-circle {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: rgba(2, 132, 199, 0.2);
          color: #38bdf8;
          font-weight: 800;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .step-title {
          font-size: 13px;
          font-weight: 700;
          color: #fff;
        }
        .close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 16px;
          cursor: pointer;
        }
        .wizard-body {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-label {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
        }
        .text-input {
          background: #0b0f19;
          border: 1px solid #1e293b;
          border-radius: 12px;
          height: 44px;
          padding: 0 12px;
          color: #fff;
          font-size: 13px;
          width: 100%;
          font-family: inherit;
        }
        textarea.text-input {
          height: auto;
          padding: 10px 12px;
        }
        .autocomplete-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 4px;
        }
        .chip-auto {
          background: #111827;
          border: 1px solid #1e293b;
          color: #cbd5e1;
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 6px;
          cursor: pointer;
        }
        .grid-selection-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }
        .grid-selection-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
        }
        .select-card {
          background: #0b0f19;
          border: 1px solid #1e293b;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 700;
          padding: 10px 6px;
          border-radius: 12px;
          cursor: pointer;
        }
        .select-card.active {
          background: rgba(2, 132, 199, 0.2);
          border-color: #0284c7;
          color: #38bdf8;
        }
        .select-card.active-primary {
          background: rgba(2, 132, 199, 0.2);
          border-color: #0284c7;
          color: #38bdf8;
        }
        .select-card.active-danger {
          background: rgba(244, 63, 94, 0.2);
          border-color: #f43f5e;
          color: #f43f5e;
        }
        .select-card.active-success {
          background: rgba(16, 185, 129, 0.2);
          border-color: #10b981;
          color: #10b981;
        }
        .select-card.active-warning {
          background: rgba(245, 158, 11, 0.2);
          border-color: #f59e0b;
          color: #f59e0b;
        }
        .actions-two {
          display: flex;
          gap: 8px;
          margin-top: 6px;
        }
        .btn-back {
          width: 35%;
          height: 44px;
          background: #1e293b;
          color: #cbd5e1;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
        }
        .btn-next {
          width: 100%;
          height: 44px;
          background: #0284c7;
          color: #fff;
          font-weight: 800;
          border: none;
          border-radius: 12px;
          cursor: pointer;
        }
        .actions-two .btn-next {
          width: 65%;
        }
        .btn-save {
          width: 65%;
          height: 44px;
          background: linear-gradient(135deg, #10b981, #0d9488);
          color: #fff;
          font-weight: 800;
          border: none;
          border-radius: 12px;
          cursor: pointer;
        }
        .photo-stub {
          background: #0b0f19;
          border: 1px dashed #1e293b;
          padding: 8px;
          border-radius: 10px;
          font-size: 11px;
          color: #94a3b8;
          text-align: center;
          cursor: pointer;
        }
        .toast-box {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 60;
          background: #10b981;
          color: #0b0f19;
          font-weight: 800;
          font-size: 12px;
          padding: 10px 18px;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.4);
        }
        .mcq-question {
          font-size: 13px;
          line-height: 1.5;
          color: #fff;
          margin: 0;
        }
        .mcq-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 6px;
        }
        .mcq-opt-btn {
          background: #0b0f19;
          border: 1px solid #1e293b;
          color: #cbd5e1;
          font-size: 12px;
          padding: 10px;
          border-radius: 10px;
          text-align: right;
          cursor: pointer;
        }
        .mcq-opt-btn.opt-correct {
          background: rgba(16, 185, 129, 0.2);
          border-color: #10b981;
          color: #10b981;
          font-weight: 700;
        }
        .mcq-opt-btn.opt-wrong {
          background: rgba(244, 63, 94, 0.2);
          border-color: #f43f5e;
          color: #f43f5e;
        }
        .mcq-expl {
          background: #0b0f19;
          border: 1px solid #1e293b;
          padding: 10px;
          border-radius: 10px;
          font-size: 11px;
          color: #cbd5e1;
          line-height: 1.4;
        }
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(11, 15, 25, 0.95);
          backdrop-filter: blur(14px);
          border-top: 1px solid #1e293b;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 6px 12px;
          z-index: 40;
          max-width: 680px;
          margin: 0 auto;
        }
        .nav-item {
          background: transparent;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          color: #94a3b8;
          cursor: pointer;
        }
        .nav-item.active {
          color: #38bdf8;
        }
        .nav-icon {
          font-size: 18px;
        }
        .nav-label {
          font-size: 10px;
          font-weight: 700;
        }
        .fab-container {
          position: relative;
          top: -14px;
        }
        .fab-button {
          width: 50px;
          height: 50px;
          border-radius: 16px;
          background: linear-gradient(135deg, #0284c7, #4f46e5);
          border: 2px solid #0b0f19;
          color: #fff;
          font-size: 22px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(2, 132, 199, 0.4);
          cursor: pointer;
        }
      `}</style>

    </div>
  );
}
