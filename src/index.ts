import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth';
import usersRouter from './routes/users';
import familyRouter from './routes/family';
import doctorsRouter from './routes/doctors';
import appointmentsRouter from './routes/appointments';
import consultationsRouter from './routes/consultations';
import voiceMessagesRouter from './routes/voiceMessages';
import prescriptionsRouter from './routes/prescriptions';
import pharmacyRouter from './routes/pharmacy';
import diagnosticsRouter from './routes/diagnostics';
import hospitalsRouter from './routes/hospitals';
import ashaRouter from './routes/asha';
import healthRecordsRouter from './routes/healthRecords';
import remindersRouter from './routes/reminders';
import notificationsRouter from './routes/notifications';
import supportRouter from './routes/support';
import bookingsRouter from './routes/bookings';
import emergencyRouter from './routes/emergency';
import adminRouter from './routes/admin';
import searchRouter from './routes/search';
import symptomsRouter from './routes/symptoms';
import labsRouter from './routes/labs';
import homeRouter from './routes/home';

const app = express();
app.use(cors());
app.use(express.json());

const v1 = express.Router();

v1.get('/health', (_req, res) => res.json({ status: 'ok', server: 'JivaHealth Mock', version: '1.0.0' }));

v1.use('/auth', authRouter);
v1.use('/users', usersRouter);
v1.use('/family', familyRouter);
v1.use('/doctors', doctorsRouter);
v1.use('/appointments', appointmentsRouter);
v1.use('/consultations', consultationsRouter);
v1.use('/voice-messages', voiceMessagesRouter);
v1.use('/prescriptions', prescriptionsRouter);
v1.use('/pharmacy', pharmacyRouter);
v1.use('/diagnostics', diagnosticsRouter);
v1.use('/hospitals', hospitalsRouter);
v1.use('/asha', ashaRouter);
v1.use('/health-records', healthRecordsRouter);
v1.use('/reminders', remindersRouter);
v1.use('/notifications', notificationsRouter);
v1.use('/support', supportRouter);
v1.use('/bookings', bookingsRouter);
v1.use('/emergency', emergencyRouter);
v1.use('/admin', adminRouter);
v1.use('/search', searchRouter);
v1.use('/symptoms', symptomsRouter);
v1.use('/labs', labsRouter);
v1.use('/home', homeRouter);

app.use('/v1', v1);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`JivaHealth Mock Server running on http://localhost:${PORT}/v1`);
  console.log('OTP for all numbers: 123456');
});

export default app;
