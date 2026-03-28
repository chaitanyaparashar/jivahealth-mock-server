import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { DOCTORS, MEDICINES, DIAGNOSTIC_TESTS, HOSPITALS, PROCEDURES, RECENT_SEARCHES } from '../store';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const { q } = req.query as any;
  if (!q || q.trim() === '') {
    res.json({ query: '', totalResults: 0, items: [] });
    return;
  }
  const term = q.toLowerCase();

  const doctorItems = DOCTORS
    .filter(d => d.name.toLowerCase().includes(term) || d.specialty.toLowerCase().includes(term))
    .slice(0, 5)
    .map(d => ({ type: 'doctor', id: d.id, name: d.name, subtitle: d.specialty }));

  const medicineItems = MEDICINES
    .filter(m => m.name.toLowerCase().includes(term) || m.genericName.toLowerCase().includes(term))
    .slice(0, 5)
    .map(m => ({ type: 'medicine', id: m.id, name: m.name, subtitle: m.genericName }));

  const testItems = DIAGNOSTIC_TESTS
    .filter(t => t.name.toLowerCase().includes(term) || t.category.toLowerCase().includes(term))
    .slice(0, 5)
    .map(t => ({ type: 'test', id: t.id, name: t.name, subtitle: t.category }));

  const hospitalItems = HOSPITALS
    .filter(h => h.name.toLowerCase().includes(term) || h.address.toLowerCase().includes(term))
    .slice(0, 5)
    .map(h => ({ type: 'hospital', id: h.id, name: h.name, subtitle: h.address }));

  const procedureItems = PROCEDURES
    .filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term))
    .slice(0, 5)
    .map(p => ({ type: 'procedure', id: p.id, name: p.name, subtitle: p.category }));

  const items = [...doctorItems, ...medicineItems, ...testItems, ...hospitalItems, ...procedureItems];
  res.json({ query: q, totalResults: items.length, items });
});

router.get('/meta', (req, res) => {
  const popularProcedures = PROCEDURES.slice(0, 5).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    aarogyasriCovered: p.aarogyasriCovered,
  }));
  const suggestions = [
    'General Physician', 'Gynecologist', 'Blood Test', 'Paracetamol', 'Knee Replacement',
  ];
  res.json({ popularProcedures, suggestions });
});

router.get('/recent', (req, res) => {
  const { userId } = (req as any).user;
  res.json({ recentSearches: RECENT_SEARCHES[userId] ?? [] });
});

router.post('/recent', (req, res) => {
  const { userId } = (req as any).user;
  const { query } = req.body;
  if (!RECENT_SEARCHES[userId]) RECENT_SEARCHES[userId] = [];
  // Remove dupe and add to front
  RECENT_SEARCHES[userId] = [query, ...RECENT_SEARCHES[userId].filter(q => q !== query)].slice(0, 10);
  res.json({ success: true, recentSearches: RECENT_SEARCHES[userId] });
});

router.delete('/recent', (req, res) => {
  const { userId } = (req as any).user;
  RECENT_SEARCHES[userId] = [];
  res.json({ success: true });
});

export default router;
