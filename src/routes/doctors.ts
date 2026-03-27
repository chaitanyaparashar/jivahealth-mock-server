import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireAuth } from '../middleware/auth';
import { DOCTORS, DOCTOR_SLOTS, REVIEWS, SPECIALTIES } from '../store';
import { paginate } from '../helpers/paginate';
import { notFound } from '../helpers/respond';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const { specialty, language, available, page = '1', limit = '20' } = req.query as any;
  let results = [...DOCTORS];
  if (specialty) results = results.filter(d => d.specialty.toLowerCase().includes(specialty.toLowerCase()));
  if (language) results = results.filter(d => d.languages.some((l: string) => l.toLowerCase() === language.toLowerCase()));
  if (available !== undefined) results = results.filter(d => d.available === (available === 'true'));
  const p = paginate(results, Number(page), Number(limit));
  res.json({ doctors: p.data, total: p.total, page: p.page, limit: p.limit });
});

router.get('/specialties', (_req, res) => {
  res.json({ specialties: SPECIALTIES });
});

router.get('/:doctorId/slots', (req, res) => {
  const { date } = req.query as any;
  const { doctorId } = req.params;
  const doctor = DOCTORS.find(d => d.id === doctorId);
  if (!doctor) { notFound(res, 'Doctor'); return; }
  const times = DOCTOR_SLOTS[doctorId] ?? [];
  const slots = times.map(time => ({ slotId: `slot_${doctorId}_${time.replace(':', '')}`, time, available: true }));
  res.json({ doctorId, date: date ?? new Date().toISOString().slice(0, 10), slots });
});

router.get('/:doctorId/reviews', (req, res) => {
  const { doctorId } = req.params;
  const reviews = REVIEWS[doctorId] ?? [];
  const avg = reviews.length ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length : 0;
  res.json({ reviews, total: reviews.length, averageRating: parseFloat(avg.toFixed(1)) });
});

router.post('/:doctorId/reviews', (req, res) => {
  const { doctorId } = req.params;
  if (!REVIEWS[doctorId]) REVIEWS[doctorId] = [];
  const review = { reviewId: `rev_${uuid()}`, ...req.body, createdAt: new Date().toISOString() };
  REVIEWS[doctorId].push(review);
  res.status(201).json(review);
});

router.get('/:doctorId', (req, res) => {
  const doctor = DOCTORS.find(d => d.id === req.params.doctorId);
  if (!doctor) { notFound(res, 'Doctor'); return; }
  res.json(doctor);
});

export default router;
