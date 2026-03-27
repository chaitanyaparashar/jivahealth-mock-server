import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireAuth, requireRole } from '../middleware/auth';
import { PRESCRIPTIONS } from '../store';
import { paginate } from '../helpers/paginate';
import { notFound } from '../helpers/respond';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const { userId, role } = (req as any).user;
  const { page = '1', limit = '20' } = req.query as any;
  let results = role === 'doctor'
    ? PRESCRIPTIONS.filter(r => r.doctorId === 'doc1')
    : PRESCRIPTIONS.filter(r => r.patientUserId === userId || true); // show all for demo
  const p = paginate(results, Number(page), Number(limit));
  res.json({ prescriptions: p.data, total: p.total, page: p.page, limit: p.limit });
});

router.get('/:prescriptionId', (req, res) => {
  const rx = PRESCRIPTIONS.find(r => r.id === req.params.prescriptionId);
  if (!rx) { notFound(res, 'Prescription'); return; }
  res.json(rx);
});

// Doctor creates prescription
router.post('/', requireRole('doctor'), (req, res) => {
  const { consultationId, patientId, diagnosis, notes, followUpDate, medicines, tests } = req.body;
  const rx = {
    id: `rx_${uuid()}`,
    consultationId: consultationId ?? null,
    patientId,
    doctorId: 'doc1',
    diagnosis,
    notes: notes ?? '',
    followUpDate: followUpDate ?? null,
    medicines: medicines ?? [],
    tests: tests ?? [],
    createdAt: new Date().toISOString(),
  };
  PRESCRIPTIONS.push(rx);
  res.status(201).json(rx);
});

export default router;
