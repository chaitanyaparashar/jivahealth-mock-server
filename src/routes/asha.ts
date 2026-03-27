import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireAuth, requireRole } from '../middleware/auth';
import { ASHA_PATIENTS } from '../store';
import { paginate } from '../helpers/paginate';
import { notFound } from '../helpers/respond';

const router = Router();
router.use(requireAuth);
router.use(requireRole('asha', 'admin'));

router.get('/patients', (req, res) => {
  const { userId } = (req as any).user;
  const { riskLevel, village, q, page = '1', limit = '20' } = req.query as any;
  let results = ASHA_PATIENTS.filter(p => p.ashaId === userId);
  if (riskLevel) results = results.filter(p => p.riskLevel === riskLevel);
  if (village) results = results.filter(p => p.village.toLowerCase().includes(village.toLowerCase()));
  if (q) results = results.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.phone.includes(q));
  const p = paginate(results, Number(page), Number(limit));
  res.json({ patients: p.data, total: p.total, page: p.page, limit: p.limit });
});

router.post('/patients', (req, res) => {
  const { userId } = (req as any).user;
  const patient = {
    id: `ap_${uuid()}`,
    ashaId: userId,
    vitals: [],
    riskLevel: 'low',
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  ASHA_PATIENTS.push(patient);
  res.status(201).json(patient);
});

router.get('/patients/:patientId', (req, res) => {
  const patient = ASHA_PATIENTS.find(p => p.id === req.params.patientId);
  if (!patient) { notFound(res, 'Patient'); return; }
  res.json(patient);
});

router.put('/patients/:patientId', (req, res) => {
  const patient = ASHA_PATIENTS.find(p => p.id === req.params.patientId);
  if (!patient) { notFound(res, 'Patient'); return; }
  Object.assign(patient, req.body);
  res.json(patient);
});

router.post('/patients/:patientId/vitals', (req, res) => {
  const patient = ASHA_PATIENTS.find(p => p.id === req.params.patientId);
  if (!patient) { notFound(res, 'Patient'); return; }
  const vital = {
    id: `vt_${uuid()}`,
    ...req.body,
    recordedAt: new Date().toISOString(),
  };
  patient.vitals = patient.vitals ?? [];
  patient.vitals.push(vital);
  patient.lastVisit = new Date().toISOString().slice(0, 10);
  res.status(201).json(vital);
});

export default router;
