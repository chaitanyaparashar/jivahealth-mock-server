import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireAuth, requireRole } from '../middleware/auth';
import { APPOINTMENTS, DOCTORS, APPOINTMENT_REQUESTS } from '../store';
import { paginate } from '../helpers/paginate';
import { notFound } from '../helpers/respond';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const { userId, role } = (req as any).user;
  const { status, date, page = '1', limit = '20' } = req.query as any;
  let results = role === 'doctor'
    ? APPOINTMENTS.filter(a => a.doctorId === 'doc1')
    : APPOINTMENTS.filter(a => a.userId === userId);
  if (status) results = results.filter(a => a.status === status);
  if (date) results = results.filter(a => a.date === date);
  const p = paginate(results, Number(page), Number(limit));
  res.json({ appointments: p.data, total: p.total, page: p.page, limit: p.limit });
});

router.post('/', (req, res) => {
  const { userId } = (req as any).user;
  const { doctorId, patientId, date, time, type, aarogyasriId } = req.body;
  const doctor = DOCTORS.find(d => d.id === doctorId);
  const apt = {
    id: `apt_${uuid()}`,
    userId,
    doctorId,
    doctorName: doctor?.name ?? 'Unknown',
    specialty: doctor?.specialty ?? '',
    patientId,
    patientName: req.body.patientName ?? '',
    date, time, type,
    status: 'upcoming',
    fee: doctor?.discountedFee ?? doctor?.fee ?? 0,
    paymentStatus: 'pending',
    paymentId: null,
    aarogyasriId: aarogyasriId ?? null,
    confirmedAt: null,
  };
  APPOINTMENTS.push(apt);
  res.status(201).json(apt);
});

// PUT /appointments/:id/payment — Step 3 of consultation booking flow
router.put('/:appointmentId/payment', (req, res) => {
  const apt = APPOINTMENTS.find(a => a.id === req.params.appointmentId);
  if (!apt) { notFound(res, 'Appointment'); return; }
  const {
    doctorId, slotId, date, time, type, patientId, patientName, age, gender,
    complaint, healthRecordIds, voiceMessageId, paymentId, paymentMethod, amount, currency, aarogyasriId,
  } = req.body;
  Object.assign(apt, {
    doctorId, slotId, date, time, type,
    patientId, patientName, age, gender, complaint,
    healthRecordIds: healthRecordIds ?? [],
    voiceMessageId: voiceMessageId ?? null,
    paymentId, paymentMethod, fee: amount, currency,
    paymentStatus: 'paid',
    status: 'upcoming',
    aarogyasriId: aarogyasriId ?? null,
    roomWaitingId: `room_${apt.id}_${(date ?? '').replace(/-/g, '')}`,
    confirmedAt: new Date().toISOString(),
  });
  res.json(apt);
});

router.put('/:appointmentId/cancel', (req, res) => {
  const apt = APPOINTMENTS.find(a => a.id === req.params.appointmentId);
  if (!apt) { notFound(res, 'Appointment'); return; }
  apt.status = 'cancelled';
  res.json({ success: true, appointmentId: apt.id, refundStatus: 'initiated', refundAmount: apt.fee });
});

router.put('/:appointmentId/status', requireRole('doctor'), (req, res) => {
  const apt = APPOINTMENTS.find(a => a.id === req.params.appointmentId);
  if (!apt) { notFound(res, 'Appointment'); return; }
  apt.status = req.body.status;
  res.json({ success: true, appointmentId: apt.id, status: apt.status });
});

router.post('/request', (req, res) => {
  const { userId } = (req as any).user;
  const { hospitalId, procedureId, doctorId, patientId, patientName, preferredDate, notes } = req.body;
  const requestItem = {
    id: `areq_${uuid()}`,
    userId,
    hospitalId,
    procedureId: procedureId ?? null,
    doctorId: doctorId ?? null,
    patientId,
    patientName,
    preferredDate,
    notes: notes ?? null,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  APPOINTMENT_REQUESTS.push(requestItem);
  res.status(201).json({ requestId: requestItem.id, status: 'pending', message: 'Our team will contact you shortly to confirm your appointment.' });
});

router.get('/:appointmentId', (req, res) => {
  const apt = APPOINTMENTS.find(a => a.id === req.params.appointmentId);
  if (!apt) { notFound(res, 'Appointment'); return; }
  res.json(apt);
});

export default router;
