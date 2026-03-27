import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { HOSPITALS, PROCEDURES, DOCTORS } from '../store';
import { paginate } from '../helpers/paginate';
import { notFound } from '../helpers/respond';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const { q, type, aarogyasri, page = '1', limit = '20' } = req.query as any;
  let results = [...HOSPITALS];
  if (q) results = results.filter(h => h.name.toLowerCase().includes(q.toLowerCase()) || h.address.toLowerCase().includes(q.toLowerCase()));
  if (type) results = results.filter(h => h.type.toLowerCase() === type.toLowerCase());
  if (aarogyasri !== undefined) results = results.filter(h => h.aarogyasriEmpanelled === (aarogyasri === 'true'));
  const p = paginate(results, Number(page), Number(limit));
  res.json({ hospitals: p.data, total: p.total, page: p.page, limit: p.limit });
});

router.get('/aarogyasri', (_req, res) => {
  const empanelled = HOSPITALS.filter(h => h.aarogyasriEmpanelled);
  res.json({ hospitals: empanelled, total: empanelled.length });
});

router.get('/procedures', (req, res) => {
  const { q, aarogyasriCovered } = req.query as any;
  let results = [...PROCEDURES];
  if (q) results = results.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase()));
  if (aarogyasriCovered !== undefined) results = results.filter(p => p.aarogyasriCovered === (aarogyasriCovered === 'true'));
  res.json({ procedures: results, total: results.length });
});

// GET /:hospitalId/procedures
router.get('/:hospitalId/procedures', (req, res) => {
  const hospital = HOSPITALS.find(h => h.id === req.params.hospitalId);
  if (!hospital) { notFound(res, 'Hospital'); return; }
  // Return procedures matching hospital specialties
  const matchingProcedures = PROCEDURES.filter(p => hospital.specialties.some(s => s.toLowerCase().includes(p.category.toLowerCase()) || p.category.toLowerCase().includes(s.toLowerCase())));
  // Add hospital-specific pricing
  const withPricing = matchingProcedures.map(p => ({
    ...p,
    hospitalPrice: Math.round(p.avgCostMin + Math.random() * (p.avgCostMax - p.avgCostMin)),
    hospitalDiscount: hospital.aarogyasriEmpanelled && p.aarogyasriCovered ? '80% covered under Aarogyasri' : null,
  }));
  res.json({ procedures: withPricing, total: withPricing.length });
});

// GET /:hospitalId/procedures/:procedureId/doctors
router.get('/:hospitalId/procedures/:procedureId/doctors', (req, res) => {
  const hospital = HOSPITALS.find(h => h.id === req.params.hospitalId);
  if (!hospital) { notFound(res, 'Hospital'); return; }
  const procedure = PROCEDURES.find(p => p.id === req.params.procedureId);
  if (!procedure) { notFound(res, 'Procedure'); return; }
  // Return doctors whose specialty matches the procedure category
  const matchingDoctors = DOCTORS.filter(d => procedure.category.toLowerCase().includes(d.specialty.toLowerCase()) || d.specialty.toLowerCase().includes(procedure.category.toLowerCase()));
  res.json({ doctors: matchingDoctors, total: matchingDoctors.length });
});

router.get('/:hospitalId', (req, res) => {
  const hospital = HOSPITALS.find(h => h.id === req.params.hospitalId);
  if (!hospital) { notFound(res, 'Hospital'); return; }
  res.json(hospital);
});

export default router;
