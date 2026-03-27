import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { APPOINTMENTS, DIAGNOSTIC_BOOKINGS, ORDERS } from '../store';

const router = Router();
router.use(requireAuth);

router.get('/active-items', (req, res) => {
  const { userId } = (req as any).user;
  const items: any[] = [];

  // Upcoming appointments
  const upcomingApts = APPOINTMENTS.filter(a => a.userId === userId && a.status === 'upcoming');
  upcomingApts.forEach(apt => {
    items.push({
      id: `active_${apt.id}`,
      type: 'appointment',
      title: `Consultation with ${apt.doctorName}`,
      subtitle: apt.specialty,
      date: `${apt.date} ${apt.time}`,
      status: apt.status,
      patientName: apt.patientName,
      actionLabel: apt.type === 'teleconsult' ? 'Join Call' : 'View Details',
      actionScreen: 'ConsultWaitingRoom',
      actionParams: { appointmentId: apt.id },
    });
  });

  // Ready reports
  const readyReports = DIAGNOSTIC_BOOKINGS.filter((b: any) => b.userId === userId && b.reportStatus === 'ready');
  readyReports.forEach((booking: any) => {
    items.push({
      id: `active_${booking.id}`,
      type: 'report',
      title: 'Lab Report Ready',
      subtitle: booking.tests?.map((t: any) => t.name).join(', ') ?? 'Diagnostic Report',
      date: booking.bookedAt,
      status: 'ready',
      patientName: '',
      actionLabel: 'View Report',
      actionScreen: 'ReportReady',
      actionParams: { reportId: booking.id },
    });
  });

  // Active medicine orders
  const activeOrders = ORDERS.filter((o: any) => o.userId === userId && o.status !== 'delivered' && o.status !== 'cancelled');
  activeOrders.forEach((order: any) => {
    items.push({
      id: `active_${order.id}`,
      type: 'medicine_order',
      title: 'Medicine Order',
      subtitle: `${order.items?.length ?? 0} items`,
      date: order.placedAt,
      status: order.status,
      patientName: '',
      actionLabel: 'Track Order',
      actionScreen: 'PharmacyDelivery',
      actionParams: { orderId: order.id },
    });
  });

  res.json({ items });
});

export default router;
