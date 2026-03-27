import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { DOCTORS, MEDICINES, DIAGNOSTIC_TESTS, HOSPITALS, PROCEDURES } from '../store';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const { q } = req.query as any;
  if (!q || q.trim() === '') {
    res.json({ items: [], total: 0 });
    return;
  }
  const term = q.toLowerCase();

  const doctorItems = DOCTORS
    .filter(d => d.name.toLowerCase().includes(term) || d.specialty.toLowerCase().includes(term))
    .slice(0, 5)
    .map(d => ({ type: 'doctor', id: d.id, title: d.name, subtitle: d.specialty, fee: d.discountedFee ?? d.fee, available: d.available }));

  const medicineItems = MEDICINES
    .filter(m => m.name.toLowerCase().includes(term) || m.genericName.toLowerCase().includes(term))
    .slice(0, 5)
    .map(m => ({ type: 'medicine', id: m.id, title: m.name, subtitle: m.genericName, price: m.discountedPrice, prescriptionRequired: m.prescriptionRequired }));

  const testItems = DIAGNOSTIC_TESTS
    .filter(t => t.name.toLowerCase().includes(term) || t.category.toLowerCase().includes(term))
    .slice(0, 5)
    .map(t => ({ type: 'test', id: t.id, title: t.name, subtitle: t.category, price: t.discountedPrice, homeCollection: t.homeCollection }));

  const hospitalItems = HOSPITALS
    .filter(h => h.name.toLowerCase().includes(term) || h.address.toLowerCase().includes(term))
    .slice(0, 5)
    .map(h => ({ type: 'hospital', id: h.id, title: h.name, subtitle: h.address, rating: h.rating, aarogyasriEmpanelled: h.aarogyasriEmpanelled }));

  const procedureItems = PROCEDURES
    .filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term))
    .slice(0, 5)
    .map(p => ({ type: 'procedure', id: p.id, title: p.name, subtitle: p.category, avgCost: p.avgCost, aarogyasriCovered: p.aarogyasriCovered }));

  const items = [...doctorItems, ...medicineItems, ...testItems, ...hospitalItems, ...procedureItems];
  res.json({ items, total: items.length });
});

export default router;
