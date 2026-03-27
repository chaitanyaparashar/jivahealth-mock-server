import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { SYMPTOMS } from '../store';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const { q } = req.query as any;
  let results = [...SYMPTOMS];
  if (q) results = results.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));
  res.json({ symptoms: results });
});

export default router;
