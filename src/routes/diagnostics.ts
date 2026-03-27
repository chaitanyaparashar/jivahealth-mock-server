import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireAuth } from '../middleware/auth';
import { DIAGNOSTIC_TESTS, DIAGNOSTIC_BOOKINGS } from '../store';
import { paginate } from '../helpers/paginate';
import { notFound, badRequest } from '../helpers/respond';

const router = Router();
router.use(requireAuth);

router.get('/suggested', (req, res) => {
  const { patientId } = req.query as any;
  // Return some tests marked as doctor-suggested
  const suggested = DIAGNOSTIC_TESTS.slice(0, 3).map(t => ({ ...t, suggestedByDoctor: true, suggestedBy: 'Dr. Ramesh Kumar' }));
  res.json({ tests: suggested });
});

router.get('/tests', (req, res) => {
  const { q, category, homeCollection, fasting, page = '1', limit = '20' } = req.query as any;
  let results = [...DIAGNOSTIC_TESTS];
  if (q) results = results.filter(t => t.name.toLowerCase().includes(q.toLowerCase()) || t.category.toLowerCase().includes(q.toLowerCase()));
  if (category) results = results.filter(t => t.category.toLowerCase().includes(category.toLowerCase()));
  if (homeCollection !== undefined) results = results.filter(t => t.homeCollection === (homeCollection === 'true'));
  if (fasting !== undefined) results = results.filter(t => t.fasting === (fasting === 'true'));
  const p = paginate(results, Number(page), Number(limit));
  res.json({ tests: p.data, total: p.total, page: p.page, limit: p.limit });
});

router.get('/tests/:testId', (req, res) => {
  const test = DIAGNOSTIC_TESTS.find(t => t.id === req.params.testId);
  if (!test) { notFound(res, 'Diagnostic test'); return; }
  res.json(test);
});

router.get('/bookings', (req, res) => {
  const { userId } = (req as any).user;
  const results = DIAGNOSTIC_BOOKINGS.filter(b => b.userId === userId);
  res.json({ bookings: results, total: results.length });
});

router.post('/bookings', (req, res) => {
  const { userId } = (req as any).user;
  const { testIds, scheduledDate, scheduledTime, collectionAddress, paymentId, paymentMethod, amount } = req.body;
  if (!testIds || testIds.length === 0) { badRequest(res, 'testIds is required'); return; }
  const tests = testIds.map((id: string) => DIAGNOSTIC_TESTS.find(t => t.id === id)).filter(Boolean);
  const booking = {
    id: `diag_${uuid()}`,
    userId,
    tests,
    scheduledDate,
    scheduledTime,
    collectionAddress: collectionAddress ?? null,
    collectionType: collectionAddress ? 'home' : 'lab',
    paymentId: paymentId ?? null,
    paymentMethod: paymentMethod ?? 'online',
    amount: amount ?? tests.reduce((s: number, t: any) => s + (t?.discountedPrice ?? 0), 0),
    status: 'confirmed',
    reportStatus: 'pending',
    reportUrl: null,
    bookedAt: new Date().toISOString(),
  };
  DIAGNOSTIC_BOOKINGS.push(booking);
  res.status(201).json(booking);
});

router.get('/bookings/:bookingId', (req, res) => {
  const booking = DIAGNOSTIC_BOOKINGS.find(b => b.id === req.params.bookingId);
  if (!booking) { notFound(res, 'Diagnostic booking'); return; }
  res.json(booking);
});

export default router;
