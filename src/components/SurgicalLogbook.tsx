import React, { useState, useEffect } from 'react';

interface OpEntry {
  id: string;
  date: string;
  name: string;
  category: string;
  role: 'Surgeon' | 'Supervised' | 'Assistant';
  type: 'Emergency' | 'Elective';
  clavien: 'None' | 'Grade I' | 'Grade II' | 'Grade IIIa' | 'Grade IIIb' | 'Grade IV' | 'Grade V';
  pearls: string;
}

export default function SurgicalLogbook() {
  const [entries, setEntries] = useState<OpEntry[]>([]);
  const [form, setForm] = useState<Omit<OpEntry, 'id' | 'date'>>({
    name: '',
    category: 'HPB',
    role: 'Surgeon',
    type: 'Emergency',
    clavien: 'None',
    pearls: '',
  });

  useEffect(() => {
    const data = localStorage.getItem('board_surgical_logbook');
    if (data) {
      try { setEntries(JSON.parse(data)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveEntries = (updated: OpEntry[]) => {
    setEntries(updated);
    localStorage.setItem('board_surgical_logbook', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const newEntry: OpEntry = {
      ...form,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };
    saveEntries([newEntry, ...entries]);
    setForm({ name: '', category: 'HPB', role: 'Surgeon', type: 'Emergency', clavien: 'None', pearls: '' });
  };

  const deleteEntry = (id: string) => {
    const filtered = entries.filter(e => e.id !== id);
    saveEntries(filtered);
  };

  const exportCSV = () => {
    const headers = 'ID,Date,Operation,Category,Role,Type,Clavien-Dindo,Pearls\n';
    const rows = entries.map(e => `"${e.id}","${e.date}","${e.name}","${e.category}","${e.role}","${e.type}","${e.clavien}","${e.pearls.replace(/"/g, '""')}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Surgical_Logbook_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const total = entries.length;
  const surgeonOps = entries.filter(e => e.role === 'Surgeon').length;
  const emergencyOps = entries.filter(e => e.type === 'Emergency').length;
  const morbidityCount = entries.filter(e => e.clavien !== 'None').length;

  return (
    <div style={{ direction: 'rtl', margin: '1.5rem 0', fontFamily: 'inherit' }}>
      {/* شبكة العدادات الإحصائية */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#1e293b', color: '#fff', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>إجمالي العمليات</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{total}</div>
        </div>
        <div style={{ background: '#047857', color: '#fff', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>جراح رئيسي (Surgeon)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{surgeonOps}</div>
        </div>
        <div style={{ background: '#b91c1c', color: '#fff', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>طوارئ (Emergency)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{emergencyOps}</div>
        </div>
        <div style={{ background: '#b45309', color: '#fff', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>مضاعفات (Clavien > 0)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{morbidityCount}</div>
        </div>
      </div>

      {/* نموذج الإدخال السريع */}
      <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '1.5rem', color: '#0f172a' }}>
        <h4 style={{ margin: '0 0 1rem 0' }}>+ تدوين عملية جديدة اليوم</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="text"
            required
            placeholder="اسم الإجراء (مثال: Lap Cholecystectomy)"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #94a3b8' }}
          />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #94a3b8' }}>
            <option value="HPB">HPB & Biliary</option>
            <option value="Colorectal">Colorectal & Appendix</option>
            <option value="Upper GI">Upper GI & Stomach</option>
            <option value="Hernia">Hernia & Abdominal Wall</option>
            <option value="Trauma">Trauma & Emergency Laparotomy</option>
            <option value="Endocrine">Endocrine & Breast</option>
            <option value="Vascular">Emergency Vascular</option>
          </select>
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as any })} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #94a3b8' }}>
            <option value="Surgeon">Surgeon (جراح منفرد)</option>
            <option value="Supervised">Supervised (تحت الإشراف)</option>
            <option value="Assistant">Assistant (مساعد أول)</option>
          </select>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #94a3b8' }}>
            <option value="Emergency">Emergency (طارئة)</option>
            <option value="Elective">Elective (باردة)</option>
          </select>
          <select value={form.clavien} onChange={e => setForm({ ...form, clavien: e.target.value as any })} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #94a3b8' }}>
            <option value="None">المضاعفات: لا يوجد (Uneventful)</option>
            <option value="Grade I">Grade I (علاج دوائي بسيط)</option>
            <option value="Grade II">Grade II (مضادات حيوية / نقل دم)</option>
            <option value="Grade IIIa">Grade IIIa (تداخل بدون تخدير عام)</option>
            <option value="Grade IIIb">Grade IIIb (إعادة فتح بتخدير عام)</option>
            <option value="Grade IV">Grade IV (فشل عضوي / ICU)</option>
          </select>
        </div>
        <textarea
          rows={2}
          placeholder="ملاحظات سريرية أو صعوبات تشريحية واجهتك أثناء العملية..."
          value={form.pearls}
          onChange={e => setForm({ ...form, pearls: e.target.value })}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #94a3b8', marginBottom: '0.75rem' }}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>حفظ العملية</button>
          {entries.length > 0 && (
            <button type="button" onClick={exportCSV} style={{ background: '#475569', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer' }}>تصدير إلى Excel/CSV</button>
          )}
        </div>
      </form>

      {/* عرض قائمة العمليات */}
      <div>
        <h4 style={{ margin: '1rem 0 0.5rem 0' }}>سجل العمليات الأخير</h4>
        {entries.length === 0 ? (
          <p style={{ opacity: 0.6 }}>لا توجد عمليات مسجلة بعد. استخدم النموذج أعلاه لتدوين حالاتك اليومية.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {entries.slice(0, 15).map(entry => (
              <div key={entry.id} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{entry.name}</strong> <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>({entry.category} - {entry.date})</span>
                  {entry.pearls && <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>💡 {entry.pearls}</div>}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: entry.role === 'Surgeon' ? '#dcfce7' : '#f1f5f9', color: entry.role === 'Surgeon' ? '#166534' : '#334155' }}>{entry.role}</span>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: entry.type === 'Emergency' ? '#fee2e2' : '#e0e7ff', color: entry.type === 'Emergency' ? '#991b1b' : '#3730a3' }}>{entry.type}</span>
                  <button onClick={() => deleteEntry(entry.id)} style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

