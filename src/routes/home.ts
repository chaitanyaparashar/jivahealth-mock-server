import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { BOOKINGS, APPOINTMENTS, DIAGNOSTIC_BOOKINGS, ORDERS } from '../store';

const router = Router();
router.use(requireAuth);

router.get('/active-items', (req, res) => {
  const { userId } = (req as any).user;
  const items: any[] = [];

  // Upcoming bookings (unified)
  const upcomingBookings = BOOKINGS.filter(
    (b: any) => b.userId === userId && ['confirmed', 'active', 'in_progress', 'requested'].includes(b.status),
  );
  upcomingBookings.forEach((bk: any) => {
    const labelMap: Record<string, string> = {
      consultation: 'Join Call',
      in_person: 'View Details',
      procedure: 'View Details',
      diagnostic: 'View Details',
      pharmacy: 'Track Order',
      emergency: 'View Status',
    };
    const screenMap: Record<string, string> = {
      consultation: 'ConsultWaitingRoom',
      in_person: 'AppointmentDetail',
      procedure: 'AppointmentDetail',
      diagnostic: 'DiagnosticBookingDetail',
      pharmacy: 'PharmacyDelivery',
      emergency: 'EmergencyStatus',
    };
    items.push({
      id: `active_${bk.id}`,
      type: 'booking',
      title: bk.type === 'consultation'
        ? `Consultation with ${bk.details?.doctorName ?? 'Doctor'}`
        : bk.type === 'pharmacy'
          ? 'Medicine Order'
          : bk.type === 'diagnostic'
            ? `${bk.details?.testName ?? 'Diagnostic Test'}`
            : bk.type === 'emergency'
              ? 'Emergency Active'
              : `${bk.type} Booking`,
      subtitle: bk.details?.specialty ?? bk.details?.testName ?? `${bk.details?.items?.length ?? 0} items`,
      date: bk.details?.date ?? bk.createdAt,
      status: bk.status,
      patientName: bk.patientName,
      actionLabel: labelMap[bk.type] ?? 'View Details',
      actionScreen: screenMap[bk.type] ?? 'BookingDetail',
      actionParams: { bookingId: bk.id },
    });
  });

  // Ready reports from bookings
  const readyReports = BOOKINGS.filter(
    (b: any) => b.userId === userId && b.type === 'diagnostic' && b.status === 'report_ready',
  );
  readyReports.forEach((bk: any) => {
    items.push({
      id: `active_report_${bk.id}`,
      type: 'report',
      title: 'Lab Report Ready',
      subtitle: bk.details?.testName ?? 'Diagnostic Report',
      date: bk.details?.reportReadyAt ?? bk.updatedAt,
      status: 'ready',
      patientName: bk.patientName,
      actionLabel: 'View Report',
      actionScreen: 'ReportReady',
      actionParams: { bookingId: bk.id },
    });
  });

  // Legacy: upcoming appointments
  const upcomingApts = APPOINTMENTS.filter((a: any) => a.userId === userId && a.status === 'upcoming');
  upcomingApts.forEach((apt: any) => {
    items.push({
      id: `active_${apt.id}`,
      type: 'booking',
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

  // Legacy: ready diagnostic reports
  const readyDiagReports = DIAGNOSTIC_BOOKINGS.filter((b: any) => b.userId === userId && b.reportStatus === 'ready');
  readyDiagReports.forEach((booking: any) => {
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

  // Legacy: active medicine orders
  const activeOrders = ORDERS.filter((o: any) => o.userId === userId && o.status !== 'delivered' && o.status !== 'cancelled');
  activeOrders.forEach((order: any) => {
    items.push({
      id: `active_${order.id}`,
      type: 'booking',
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
