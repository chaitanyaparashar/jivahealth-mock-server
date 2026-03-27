import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireAuth } from '../middleware/auth';
import { HEALTH_RECORDS } from '../store';
import { paginate } from '../helpers/paginate';
import { notFound } from '../helpers/respond';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const { userId } = (req as any).user;
  const { type, page = '1', limit = '20' } = req.query as any;
  let results = HEALTH_RECORDS.filter(r => r.userId === userId);
  if (type) results = results.filter(r => r.type === type);
  const p = paginate(results, Number(page), Number(limit));
  res.json({ records: p.data, total: p.total, page: p.page, limit: p.limit });
});

// Step 1: Get a presigned S3 URL
router.post('/upload-url', (req, res) => {
  const { userId } = (req as any).user;
  const { fileName, contentType, recordType } = req.body;
  const recordId = `hr_${uuid()}`;
  const uploadUrl = `https://mock-s3.jivahealth.in/health-records/${userId}/${recordId}/${fileName ?? 'document.pdf'}?X-Mock-Presigned=true`;
  res.json({
    recordId,
    uploadUrl,
    expiresIn: 300,
    recordType: recordType ?? 'report',
  });
});

// Step 3: Confirm upload after S3 PUT
router.post('/confirm', (req, res) => {
  const { userId } = (req as any).user;
  const { recordId, fileName, contentType, recordType, title, date, size } = req.body;
  const record = {
    id: recordId ?? `hr_${uuid()}`,
    userId,
    type: recordType ?? 'report',
    title: title ?? fileName ?? 'Health Record',
    fileName: fileName ?? 'document.pdf',
    contentType: contentType ?? 'application/pdf',
    url: `https://mock-s3.jivahealth.in/health-records/${userId}/${recordId}/${fileName ?? 'document.pdf'}`,
    size: size ?? 0,
    date: date ?? new Date().toISOString().slice(0, 10),
    uploadedAt: new Date().toISOString(),
  };
  HEALTH_RECORDS.push(record);
  res.status(201).json(record);
});

router.get('/:recordId', (req, res) => {
  const record = HEALTH_RECORDS.find(r => r.id === req.params.recordId);
  if (!record) { notFound(res, 'Health record'); return; }
  res.json(record);
});

router.delete('/:recordId', (req, res) => {
  const idx = HEALTH_RECORDS.findIndex(r => r.id === req.params.recordId);
  if (idx === -1) { notFound(res, 'Health record'); return; }
  HEALTH_RECORDS.splice(idx, 1);
  res.json({ success: true });
});

export default router;
