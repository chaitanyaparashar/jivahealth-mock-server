import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireAuth, requireRole } from '../middleware/auth';
import { CONSULTATIONS, APPOINTMENTS } from '../store';
import { notFound } from '../helpers/respond';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const { userId, role } = (req as any).user;
  let results = role === 'doctor'
    ? CONSULTATIONS.filter(c => c.doctorId === 'doc1')
    : CONSULTATIONS.filter(c => c.userId === userId);
  res.json({ consultations: results });
});

router.get('/:consultationId', (req, res) => {
  const con = CONSULTATIONS.find(c => c.id === req.params.consultationId);
  if (!con) { notFound(res, 'Consultation'); return; }
  res.json(con);
});

// Doctor starts/updates a consultation
router.post('/', requireRole('doctor'), (req, res) => {
  const { appointmentId, notes, diagnosis } = req.body;
  const apt = APPOINTMENTS.find(a => a.id === appointmentId);
  const con = {
    id: `con_${uuid()}`,
    appointmentId,
    userId: apt?.userId ?? '',
    doctorId: apt?.doctorId ?? 'doc1',
    doctorName: apt?.doctorName ?? '',
    patientId: apt?.patientId ?? '',
    patientName: apt?.patientName ?? '',
    date: apt?.date ?? new Date().toISOString().slice(0, 10),
    notes: notes ?? '',
    diagnosis: diagnosis ?? '',
    status: 'ongoing',
    startedAt: new Date().toISOString(),
    endedAt: null,
  };
  CONSULTATIONS.push(con);
  if (apt) apt.status = 'in_progress';
  res.status(201).json(con);
});

router.put('/:consultationId/end', requireRole('doctor'), (req, res) => {
  const con = CONSULTATIONS.find(c => c.id === req.params.consultationId);
  if (!con) { notFound(res, 'Consultation'); return; }
  con.status = 'completed';
  con.endedAt = new Date().toISOString();
  Object.assign(con, req.body);
  res.json(con);
});

export default router;
