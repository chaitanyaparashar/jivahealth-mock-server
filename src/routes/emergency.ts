import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireAuth } from '../middleware/auth';
import { EMERGENCY_EVENTS, HOSPITALS } from '../store';

const router = Router();
router.use(requireAuth);

// In-memory emergency contacts per user
const EMERGENCY_CONTACTS: Record<string, any[]> = {
  user_patient1: [
    { id: 'ec1', name: 'Lakshmi Naidu', relation: 'Spouse', phone: '9876543211' },
  ],
};

router.post('/sos', (req, res) => {
  const { userId } = (req as any).user;
  const { latitude, longitude, message } = req.body;
  const event = {
    id: `sos_${uuid()}`,
    userId,
    latitude: latitude ?? 16.5062,
    longitude: longitude ?? 80.648,
    message: message ?? 'Emergency! Need help.',
    status: 'active',
    dispatchedAt: new Date().toISOString(),
    resolvedAt: null,
  };
  EMERGENCY_EVENTS.push(event);
  res.status(201).json({
    sosId: event.id,
    message: 'Emergency services notified.',
    estimatedArrival: '8-10 minutes',
    nearbyHospital: HOSPITALS[0].name,
    nearbyHospitalPhone: HOSPITALS[0].phone,
    contactsNotified: (EMERGENCY_CONTACTS[userId] ?? []).map((c: any) => c.phone),
  });
});

router.get('/contacts', (req, res) => {
  const { userId } = (req as any).user;
  res.json({ contacts: EMERGENCY_CONTACTS[userId] ?? [] });
});

router.post('/contacts', (req, res) => {
  const { userId } = (req as any).user;
  if (!EMERGENCY_CONTACTS[userId]) EMERGENCY_CONTACTS[userId] = [];
  const contact = { id: `ec_${uuid()}`, ...req.body };
  EMERGENCY_CONTACTS[userId].push(contact);
  res.status(201).json(contact);
});

router.delete('/contacts/:contactId', (req, res) => {
  const { userId } = (req as any).user;
  if (!EMERGENCY_CONTACTS[userId]) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Contact not found.' } });
    return;
  }
  EMERGENCY_CONTACTS[userId] = EMERGENCY_CONTACTS[userId].filter((c: any) => c.id !== req.params.contactId);
  res.json({ success: true });
});

router.get('/nearby-hospitals', (req, res) => {
  res.json({ hospitals: HOSPITALS, total: HOSPITALS.length });
});

export default router;
