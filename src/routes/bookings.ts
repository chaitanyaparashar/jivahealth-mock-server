import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireAuth } from '../middleware/auth';
import { BOOKINGS, DOCTORS } from '../store';
import { paginate } from '../helpers/paginate';
import { notFound, badRequest } from '../helpers/respond';

const router = Router();
router.use(requireAuth);

// GET /bookings — list with filters
router.get('/', (req, res) => {
  const { userId } = (req as any).user;
  const { type, status, patientId, date, dateFrom, dateTo, page = '1', limit = '20' } = req.query as any;
  let results = BOOKINGS.filter((b: any) => b.userId === userId);
  if (type) results = results.filter((b: any) => b.type === type);
  if (status) results = results.filter((b: any) => b.status === status);
  if (patientId) results = results.filter((b: any) => b.patientId === patientId);
  if (date) results = results.filter((b: any) => b.details?.date === date);
  if (dateFrom) results = results.filter((b: any) => (b.details?.date ?? b.createdAt) >= dateFrom);
  if (dateTo) results = results.filter((b: any) => (b.details?.date ?? b.createdAt) <= dateTo);
  const p = paginate(results, Number(page), Number(limit));
  res.json({ bookings: p.data, total: p.total, page: p.page, limit: p.limit });
});

// POST /bookings — create a new booking
router.post('/', (req, res) => {
  const { userId } = (req as any).user;
  const { type, patientId, patientName, details } = req.body;
  if (!type || !patientId || !details) {
    badRequest(res, 'type, patientId, and details are required');
    return;
  }

  // Idempotency check
  const idempotencyKey = req.headers['idempotency-key'] as string | undefined;
  if (idempotencyKey) {
    const existing = BOOKINGS.find((b: any) => b.idempotencyKey === idempotencyKey);
    if (existing) {
      res.status(200).json(existing);
      return;
    }
  }

  // Enrich details based on type
  const enrichedDetails = { ...details };
  if ((type === 'consultation' || type === 'in_person') && details.doctorId) {
    const doctor = DOCTORS.find(d => d.id === details.doctorId);
    if (doctor) {
      enrichedDetails.doctorName = enrichedDetails.doctorName ?? doctor.name;
      enrichedDetails.specialty = enrichedDetails.specialty ?? doctor.specialty;
    }
  }

  const now = new Date().toISOString();
  const statusMap: Record<string, string> = {
    consultation: 'confirmed',
    in_person: 'requested',
    procedure: 'requested',
    diagnostic: 'confirmed',
    pharmacy: 'confirmed',
    emergency: 'active',
  };

  const booking: any = {
    id: `bk_${uuid()}`,
    userId,
    type,
    status: statusMap[type] ?? 'pending',
    patientId,
    patientName: patientName ?? '',
    createdAt: now,
    updatedAt: now,
    details: enrichedDetails,
    ...(idempotencyKey ? { idempotencyKey } : {}),
  };

  BOOKINGS.push(booking);
  res.status(201).json(booking);
});

// GET /bookings/:bookingId
router.get('/:bookingId', (req, res) => {
  const booking = BOOKINGS.find((b: any) => b.id === req.params.bookingId);
  if (!booking) { notFound(res, 'Booking'); return; }
  res.json(booking);
});

// PUT /bookings/:bookingId/status
router.put('/:bookingId/status', (req, res) => {
  const booking = BOOKINGS.find((b: any) => b.id === req.params.bookingId);
  if (!booking) { notFound(res, 'Booking'); return; }
  const { status, reason, endedAt, notes } = req.body;
  booking.status = status;
  booking.updatedAt = new Date().toISOString();
  if (reason) booking.cancelReason = reason;
  if (endedAt && booking.details) booking.details.sessionEndedAt = endedAt;
  if (notes && booking.details) booking.details.notes = notes;

  const refundStatuses = ['cancelled', 'rejected'];
  res.json({
    success: true,
    bookingId: booking.id,
    status: booking.status,
    refundStatus: refundStatuses.includes(status) ? 'initiated' : null,
    refundAmount: refundStatuses.includes(status) ? 99 : null,
  });
});

// GET /bookings/:bookingId/summary
router.get('/:bookingId/summary', (req, res) => {
  const booking = BOOKINGS.find((b: any) => b.id === req.params.bookingId);
  if (!booking) { notFound(res, 'Booking'); return; }
  res.json({
    bookingId: booking.id,
    type: booking.type,
    status: booking.status,
    patientName: booking.patientName,
    createdAt: booking.createdAt,
    details: booking.details,
  });
});

// POST /bookings/:bookingId/location — emergency location share
router.post('/:bookingId/location', (req, res) => {
  const booking = BOOKINGS.find((b: any) => b.id === req.params.bookingId);
  if (!booking) { notFound(res, 'Booking'); return; }
  const { latitude, longitude, address } = req.body;
  if (booking.details) {
    booking.details.latitude = latitude;
    booking.details.longitude = longitude;
    booking.details.address = address;
  }
  res.json({ success: true, bookingId: booking.id });
});

// GET /bookings/:bookingId/tracking — pharmacy order tracking
router.get('/:bookingId/tracking', (req, res) => {
  const booking = BOOKINGS.find((b: any) => b.id === req.params.bookingId);
  if (!booking) { notFound(res, 'Booking'); return; }
  const placedAt = booking.createdAt;
  res.json({
    bookingId: booking.id,
    status: booking.status,
    estimatedDelivery: booking.details?.estimatedDelivery ?? null,
    trackingSteps: booking.details?.trackingSteps ?? [
      { label: 'Order Placed', timestamp: placedAt, completed: true },
      { label: 'Confirmed', timestamp: placedAt, completed: booking.status !== 'pending' },
      { label: 'Packed', timestamp: null, completed: ['shipped', 'out_for_delivery', 'delivered'].includes(booking.status) },
      { label: 'Shipped', timestamp: null, completed: ['out_for_delivery', 'delivered'].includes(booking.status) },
      { label: 'Delivered', timestamp: null, completed: booking.status === 'delivered' },
    ],
  });
});

// GET /bookings/:bookingId/report — diagnostic report
router.get('/:bookingId/report', (req, res) => {
  const booking = BOOKINGS.find((b: any) => b.id === req.params.bookingId);
  if (!booking) { notFound(res, 'Booking'); return; }
  res.json({
    bookingId: booking.id,
    reportUrl: booking.details?.reportUrl ?? 'https://example.com/reports/sample.pdf',
    reportReadyAt: booking.details?.reportReadyAt ?? null,
    testName: booking.details?.testName ?? null,
    expiresIn: 3600,
  });
});

export default router;
