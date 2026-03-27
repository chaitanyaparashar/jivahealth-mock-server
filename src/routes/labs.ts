import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { LABS, LAB_TESTS, LAB_SLOTS } from '../store';
import { notFound } from '../helpers/respond';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const { q, homeCollection } = req.query as any;
  let results = [...LABS];
  if (q) results = results.filter(l => l.name.toLowerCase().includes(q.toLowerCase()));
  if (homeCollection !== undefined) results = results.filter(l => l.homeCollectionAvailable === (homeCollection === 'true'));
  res.json({ labs: results, total: results.length });
});

router.get('/:labId/tests', (req, res) => {
  const lab = LABS.find(l => l.id === req.params.labId);
  if (!lab) { notFound(res, 'Lab'); return; }
  const tests = LAB_TESTS[req.params.labId] ?? [];
  res.json({ tests });
});

router.get('/:labId/slots', (req, res) => {
  const lab = LABS.find(l => l.id === req.params.labId);
  if (!lab) { notFound(res, 'Lab'); return; }
  const { date } = req.query as any;
  let slots = LAB_SLOTS[req.params.labId] ?? [];
  if (date) slots = slots.filter((s: any) => s.date === date);
  res.json({ slots });
});

export default router;
