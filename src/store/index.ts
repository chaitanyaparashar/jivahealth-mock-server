import { v4 as uuid } from 'uuid';

// ─── STATIC REFERENCE DATA ───────────────────────────────────────────────────

export const DOCTORS = [
  { id: 'doc1', name: 'Dr. Ramesh Kumar', specialty: 'General Physician', qualification: 'MBBS, MD', experience: 15, rating: 4.8, reviewCount: 342, fee: 300, discountedFee: 99, hospital: 'Government General Hospital', languages: ['Telugu', 'Hindi', 'English'], available: true, nextSlot: 'Now', avatar: '👨‍⚕️', collegeName: 'Osmania Medical College', educationQualification: 'MBBS, MD (General Medicine)', surgeryCount: 0 },
  { id: 'doc2', name: 'Dr. Sunitha Reddy', specialty: 'Gynecologist', qualification: 'MBBS, MS (OBG)', experience: 12, rating: 4.9, reviewCount: 518, fee: 500, discountedFee: 199, hospital: 'Sunshine Hospital', languages: ['Telugu', 'English'], available: true, nextSlot: '10:30 AM', avatar: '👩‍⚕️', collegeName: 'Gandhi Medical College', educationQualification: 'MBBS, MS (OBG)', surgeryCount: 450 },
  { id: 'doc3', name: 'Dr. Venkat Rao', specialty: 'Orthopedic', qualification: 'MBBS, MS (Ortho)', experience: 20, rating: 4.7, reviewCount: 289, fee: 600, discountedFee: 249, hospital: 'Apollo Hospitals', languages: ['Telugu', 'English'], available: true, nextSlot: '2:00 PM', avatar: '👨‍⚕️', collegeName: 'Andhra Medical College', educationQualification: 'MBBS, MS (Ortho)', surgeryCount: 1200 },
  { id: 'doc4', name: 'Dr. Priya Sharma', specialty: 'Dermatologist', qualification: 'MBBS, MD (Derma)', experience: 8, rating: 4.6, reviewCount: 176, fee: 400, discountedFee: 149, hospital: 'Care Hospital', languages: ['Telugu', 'Hindi', 'English'], available: false, nextSlot: 'Tomorrow 9:00 AM', avatar: '👩‍⚕️', collegeName: 'Kamineni Institute of Medical Sciences', educationQualification: 'MBBS, MD (Derma)', surgeryCount: 0 },
  { id: 'doc5', name: 'Dr. Srinivas Murthy', specialty: 'Cardiologist', qualification: 'MBBS, MD, DM (Cardio)', experience: 18, rating: 4.9, reviewCount: 421, fee: 800, discountedFee: 399, hospital: 'NIMS', languages: ['Telugu', 'English'], available: true, nextSlot: '4:00 PM', avatar: '👨‍⚕️', collegeName: 'NIMS Medical College', educationQualification: 'MBBS, MD, DM (Cardiology)', surgeryCount: 800 },
  { id: 'doc6', name: 'Dr. Meera Devi', specialty: 'Pediatrician', qualification: 'MBBS, MD (Paeds)', experience: 10, rating: 4.8, reviewCount: 312, fee: 350, discountedFee: 129, hospital: 'Rainbow Hospital', languages: ['Telugu', 'Hindi'], available: true, nextSlot: 'Now', avatar: '👩‍⚕️', collegeName: 'SVS Medical College', educationQualification: 'MBBS, MD (Paediatrics)', surgeryCount: 0 },
];

export const SPECIALTIES = ['General Physician', 'Gynecologist', 'Orthopedic', 'Dermatologist', 'Cardiologist', 'Pediatrician', 'Neurologist', 'Ophthalmologist', 'Dentist', 'Psychiatrist'];

export const DOCTOR_SLOTS: Record<string, string[]> = {
  doc1: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'],
  doc2: ['10:30', '11:00', '11:30', '16:00', '16:30'],
  doc3: ['14:00', '14:30', '15:00', '15:30'],
  doc4: ['09:00', '09:30', '10:00'],
  doc5: ['16:00', '16:30', '17:00'],
  doc6: ['08:30', '09:00', '09:30', '10:00', '10:30'],
};

export const MEDICINES = [
  { id: 'med1', name: 'Paracetamol 500mg', genericName: 'Paracetamol', dosage: '500mg', form: 'Tablet', manufacturer: 'Cipla', price: 30, discountedPrice: 22, prescriptionRequired: false, inStock: true },
  { id: 'med2', name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', dosage: '250mg', form: 'Capsule', manufacturer: 'Sun Pharma', price: 85, discountedPrice: 65, prescriptionRequired: true, inStock: true },
  { id: 'med3', name: 'Cetirizine 10mg', genericName: 'Cetirizine', dosage: '10mg', form: 'Tablet', manufacturer: 'Mankind', price: 45, discountedPrice: 32, prescriptionRequired: false, inStock: true },
  { id: 'med4', name: 'Metformin 500mg', genericName: 'Metformin HCL', dosage: '500mg', form: 'Tablet', manufacturer: 'USV', price: 60, discountedPrice: 45, prescriptionRequired: true, inStock: true },
  { id: 'med5', name: 'Ambroxol Syrup', genericName: 'Ambroxol HCL', dosage: '15mg/5ml', form: 'Syrup', manufacturer: 'Boehringer', price: 95, discountedPrice: 75, prescriptionRequired: false, inStock: true },
  { id: 'med6', name: 'Omeprazole 20mg', genericName: 'Omeprazole', dosage: '20mg', form: 'Capsule', manufacturer: 'Cipla', price: 55, discountedPrice: 40, prescriptionRequired: false, inStock: true },
  { id: 'med7', name: 'Azithromycin 500mg', genericName: 'Azithromycin', dosage: '500mg', form: 'Tablet', manufacturer: 'Pfizer', price: 120, discountedPrice: 95, prescriptionRequired: true, inStock: false },
  { id: 'med8', name: 'Amlodipine 5mg', genericName: 'Amlodipine Besylate', dosage: '5mg', form: 'Tablet', manufacturer: 'Torrent', price: 40, discountedPrice: 28, prescriptionRequired: true, inStock: true },
];

export const DIAGNOSTIC_TESTS = [
  { id: 'test1', name: 'Complete Blood Count (CBC)', category: 'Blood Tests', description: 'Measures RBC, WBC, platelets', price: 400, discountedPrice: 249, sampleType: 'Blood', reportTime: '6 hours', fasting: false, homeCollection: true, popular: true },
  { id: 'test2', name: 'Blood Sugar Fasting', category: 'Diabetes', description: 'Glucose levels after 8h fast', price: 150, discountedPrice: 99, sampleType: 'Blood', reportTime: '4 hours', fasting: true, homeCollection: true, popular: true },
  { id: 'test3', name: 'Lipid Profile', category: 'Cardiac', description: 'Cholesterol and triglycerides panel', price: 600, discountedPrice: 399, sampleType: 'Blood', reportTime: '12 hours', fasting: true, homeCollection: true, popular: true },
  { id: 'test4', name: 'Thyroid Profile (TSH)', category: 'Thyroid', description: 'Thyroid stimulating hormone', price: 350, discountedPrice: 229, sampleType: 'Blood', reportTime: '6 hours', fasting: false, homeCollection: true },
  { id: 'test5', name: 'Urine Routine', category: 'Urine Tests', description: 'Physical and chemical urine analysis', price: 120, discountedPrice: 89, sampleType: 'Urine', reportTime: '3 hours', fasting: false, homeCollection: false },
  { id: 'test6', name: 'Chest X-Ray', category: 'Radiology', description: 'Standard PA view chest X-ray', price: 400, discountedPrice: 299, sampleType: 'N/A', reportTime: 'Same day', fasting: false, homeCollection: false },
  { id: 'test7', name: 'Full Body Checkup', category: 'Health Packages', description: 'Comprehensive 60+ parameter health package', price: 2500, discountedPrice: 1499, sampleType: 'Blood, Urine', reportTime: '24 hours', fasting: true, homeCollection: true, popular: false },
  { id: 'test8', name: 'Diabetes Care Package', category: 'Health Packages', description: 'HbA1c, Fasting Sugar, Lipid Profile and more', price: 1200, discountedPrice: 799, sampleType: 'Blood', reportTime: '12 hours', fasting: true, homeCollection: true, popular: false },
];

export const HOSPITALS = [
  { id: 'hosp1', name: 'Government General Hospital', type: 'Government', address: 'Governorpet, Vijayawada', distance: '1.2 km', rating: 4.2, specialties: ['General Medicine', 'Orthopedics', 'Gynecology'], aarogyasriEmpanelled: true, phone: '0866-2577700', bedCount: 800, emergencyAvailable: true },
  { id: 'hosp2', name: 'Apollo Hospitals', type: 'Private', address: 'Jubilee Hills, Hyderabad', distance: '3.5 km', rating: 4.7, specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics'], aarogyasriEmpanelled: true, phone: '040-23607777', bedCount: 350, emergencyAvailable: true },
  { id: 'hosp3', name: 'NIMS', type: 'Government', address: 'Punjagutta, Hyderabad', distance: '5.1 km', rating: 4.4, specialties: ['Cardiology', 'Neurology', 'Nephrology', 'Urology'], aarogyasriEmpanelled: true, phone: '040-23489000', bedCount: 1200, emergencyAvailable: true },
  { id: 'hosp4', name: 'Sunshine Hospital', type: 'Private', address: 'Begumpet, Hyderabad', distance: '4.8 km', rating: 4.5, specialties: ['Gynecology', 'Pediatrics', 'Fertility'], aarogyasriEmpanelled: false, phone: '040-44558800', bedCount: 150, emergencyAvailable: false },
  { id: 'hosp5', name: 'Rainbow Children\'s Hospital', type: 'Private', address: 'Banjara Hills, Hyderabad', distance: '6.2 km', rating: 4.8, specialties: ['Pediatrics', 'Neonatology', 'Pediatric Surgery'], aarogyasriEmpanelled: false, phone: '040-44886600', bedCount: 200, emergencyAvailable: true },
  { id: 'hosp6', name: 'Care Hospitals', type: 'Private', address: 'Banjara Hills, Hyderabad', distance: '5.8 km', rating: 4.6, specialties: ['Cardiology', 'Gastroenterology', 'Dermatology', 'Orthopedics'], aarogyasriEmpanelled: true, phone: '040-30418000', bedCount: 300, emergencyAvailable: true },
  { id: 'hosp7', name: 'Osmania General Hospital', type: 'Government', address: 'Afzalgunj, Hyderabad', distance: '7.3 km', rating: 4.0, specialties: ['General Medicine', 'Surgery', 'Psychiatry', 'Dermatology'], aarogyasriEmpanelled: true, phone: '040-24600999', bedCount: 1500, emergencyAvailable: true },
  { id: 'hosp8', name: 'Yashoda Hospital', type: 'Private', address: 'Secunderabad', distance: '8.1 km', rating: 4.5, specialties: ['Oncology', 'Transplant', 'Neurology', 'Cardiology'], aarogyasriEmpanelled: true, phone: '040-45674567', bedCount: 400, emergencyAvailable: true },
];

export const PROCEDURES = [
  { id: 'proc1', name: 'Knee Replacement', category: 'Orthopedics', avgCost: '₹1,50,000', avgCostMin: 120000, avgCostMax: 180000, aarogyasriCovered: true },
  { id: 'proc2', name: 'Cataract Surgery', category: 'Ophthalmology', avgCost: '₹25,000', avgCostMin: 20000, avgCostMax: 35000, aarogyasriCovered: true },
  { id: 'proc3', name: 'Heart Bypass (CABG)', category: 'Cardiology', avgCost: '₹3,00,000', avgCostMin: 250000, avgCostMax: 400000, aarogyasriCovered: true },
  { id: 'proc4', name: 'Appendectomy', category: 'Surgery', avgCost: '₹40,000', avgCostMin: 30000, avgCostMax: 55000, aarogyasriCovered: false },
  { id: 'proc5', name: 'Dialysis (per session)', category: 'Nephrology', avgCost: '₹2,500', avgCostMin: 2000, avgCostMax: 3500, aarogyasriCovered: true },
  { id: 'proc6', name: 'Normal Delivery', category: 'Gynecology', avgCost: '₹20,000', avgCostMin: 15000, avgCostMax: 30000, aarogyasriCovered: true },
  { id: 'proc7', name: 'Caesarean Section (C-Section)', category: 'Gynecology', avgCost: '₹50,000', avgCostMin: 40000, avgCostMax: 70000, aarogyasriCovered: true },
  { id: 'proc8', name: 'Hernia Repair', category: 'Surgery', avgCost: '₹35,000', avgCostMin: 25000, avgCostMax: 50000, aarogyasriCovered: false },
  { id: 'proc9', name: 'Dental Implant', category: 'Dentistry', avgCost: '₹30,000', avgCostMin: 25000, avgCostMax: 40000, aarogyasriCovered: false },
  { id: 'proc10', name: 'Root Canal Treatment', category: 'Dentistry', avgCost: '₹8,000', avgCostMin: 5000, avgCostMax: 12000, aarogyasriCovered: false },
];

export const REVIEWS: Record<string, any[]> = {
  doc1: [
    { reviewId: 'rev1', patientName: 'Raju N.', rating: 5, comment: 'Very caring doctor. Explained everything clearly.', createdAt: '2026-02-01T10:00:00Z' },
    { reviewId: 'rev2', patientName: 'Lakshmi D.', rating: 5, comment: 'Quick consultation, accurate diagnosis.', createdAt: '2026-01-20T14:00:00Z' },
  ],
  doc2: [
    { reviewId: 'rev3', patientName: 'Sravani K.', rating: 5, comment: 'Best gynecologist. Very professional.', createdAt: '2026-02-10T09:00:00Z' },
  ],
};

// ─── MUTABLE IN-MEMORY STATE ──────────────────────────────────────────────────

export interface UserRecord {
  id: string;
  name: string;
  phone: string;
  role: 'patient' | 'doctor' | 'asha' | 'admin';
  email?: string;
  gender?: string;
  dob?: string;
  address?: string;
  abhaId?: string;
  avatar: string;
  blocked: boolean;
  createdAt: string;
}

export const USERS: UserRecord[] = [
  { id: 'user_patient1', name: 'Raju Naidu', phone: '9876543210', role: 'patient', gender: 'Male', dob: '1984-06-15', address: '12-3, MG Road, Vijayawada, AP', avatar: '👨', blocked: false, createdAt: '2025-01-01T00:00:00Z' },
  { id: 'user_doctor1', name: 'Dr. Ramesh Kumar', phone: '9800000001', role: 'doctor', gender: 'Male', dob: '1978-03-22', address: 'Hyderabad, TS', avatar: '👨‍⚕️', blocked: false, createdAt: '2025-01-01T00:00:00Z' },
  { id: 'user_asha1',   name: 'Priya Devi', phone: '9800000002', role: 'asha', gender: 'Female', dob: '1990-09-10', address: 'Guntur, AP', avatar: '👩', blocked: false, createdAt: '2025-01-01T00:00:00Z' },
  { id: 'user_admin1', name: 'Admin User', phone: '9800000003', role: 'admin', gender: 'Male', avatar: '👤', blocked: false, createdAt: '2025-01-01T00:00:00Z' },
];

export const OTP_STORE: Record<string, string> = {};

export const FAMILY_MEMBERS: any[] = [
  { id: 'fm1', userId: 'user_patient1', name: 'Raju Naidu', relation: 'Self', age: 42, gender: 'Male', avatar: '👨', conditions: ['Type 2 Diabetes', 'Hypertension'] },
  { id: 'fm2', userId: 'user_patient1', name: 'Lakshmi Naidu', relation: 'Spouse', age: 38, gender: 'Female', avatar: '👩', conditions: [] },
  { id: 'fm3', userId: 'user_patient1', name: 'Rama Naidu', relation: 'Father', age: 68, gender: 'Male', avatar: '👴', conditions: ['Arthritis'] },
];

export const APPOINTMENTS: any[] = [
  { id: 'apt1', userId: 'user_patient1', doctorId: 'doc1', doctorName: 'Dr. Ramesh Kumar', specialty: 'General Physician', patientId: 'fm1', patientName: 'Raju Naidu', date: '2026-03-10', time: '10:30', type: 'teleconsult', status: 'upcoming', fee: 99, paymentStatus: 'paid', paymentId: 'pay_mock1', confirmedAt: '2026-03-05T09:00:00Z' },
  { id: 'apt2', userId: 'user_patient1', doctorId: 'doc5', doctorName: 'Dr. Srinivas Murthy', specialty: 'Cardiologist', patientId: 'fm1', patientName: 'Raju Naidu', date: '2026-02-15', time: '11:00', type: 'teleconsult', status: 'completed', fee: 399, paymentStatus: 'paid', paymentId: 'pay_mock2', confirmedAt: '2026-02-14T10:00:00Z' },
];

export const CONSULTATIONS: any[] = [];
export const PRESCRIPTIONS: any[] = [
  { id: 'rx1', consultationId: 'con_mock1', patientId: 'fm1', doctorId: 'doc1', diagnosis: 'Upper Respiratory Tract Infection (URTI)', notes: 'Rest and hydration advised.', followUpDate: '2026-03-26', medicines: [{ name: 'Paracetamol 500mg', dosage: '1 tablet', frequency: 'Thrice daily', duration: '3 days', instructions: 'After food' }, { name: 'Cetirizine 10mg', dosage: '1 tablet', frequency: 'Once daily', duration: '5 days', instructions: 'At night' }], tests: ['CBC', 'Chest X-Ray if cough persists'], createdAt: '2026-02-15T11:45:00Z' },
];

export const CART: Record<string, any[]> = {};
export const ORDERS: any[] = [];
export const DIAGNOSTIC_BOOKINGS: any[] = [];
export const HEALTH_RECORDS: any[] = [];
export const REMINDERS: any[] = [];

export const NOTIFICATIONS: Record<string, any[]> = {
  user_patient1: [
    { id: 'notif1', type: 'appointment', title: 'Appointment Tomorrow', body: 'Your appointment with Dr. Ramesh Kumar is tomorrow at 10:30 AM at Government General Hospital.', read: false, createdAt: '2026-03-06T08:00:00Z' },
    { id: 'notif2', type: 'reminder', title: 'Medicine Reminder', body: 'Time to take Metformin 500mg. Please take it after meals.', read: false, createdAt: '2026-03-07T09:00:00Z' },
    { id: 'notif3', type: 'report', title: 'Lab Report Ready', body: 'Your blood test report from Apollo Diagnostics is now available. Tap to view.', read: false, createdAt: '2026-03-06T14:30:00Z' },
    { id: 'notif4', type: 'follow_up', title: 'Follow-up Due', body: 'Dr. Priya Sharma recommends a follow-up consultation within the next 7 days.', read: false, createdAt: '2026-03-05T11:00:00Z' },
    { id: 'notif5', type: 'promotion', title: 'Aarogyasri Offer', body: 'Get 80% off on your next teleconsultation using your Aarogyasri card. Valid till March 31.', read: true, createdAt: '2026-03-04T10:00:00Z' },
    { id: 'notif6', type: 'system', title: 'Profile Updated', body: 'Your health profile has been updated successfully. Keep it up to date for better care.', read: true, createdAt: '2026-03-03T16:00:00Z' },
    { id: 'notif7', type: 'reminder', title: 'Blood Pressure Check', body: 'Reminder: Check your blood pressure today and log it in your health records.', read: true, createdAt: '2026-03-03T08:00:00Z' },
    { id: 'notif8', type: 'appointment', title: 'Appointment Confirmed', body: 'Your appointment with Dr. Anjali Reddy on March 12 at 3:00 PM has been confirmed.', read: true, createdAt: '2026-03-02T09:00:00Z' },
  ],
};

export const SUPPORT_TICKETS: any[] = [
  { id: 'TKT-001', userId: 'user_patient1', subject: 'Unable to join video call', category: 'technical', status: 'open', messages: [{ senderId: 'user_patient1', senderRole: 'patient', message: 'I get an error when trying to join the call.', sentAt: '2026-03-01T10:00:00Z' }], createdAt: '2026-03-01T10:00:00Z' },
];

export const EMERGENCY_EVENTS: any[] = [];

export const ASHA_PATIENTS: any[] = [
  { id: 'ap1', ashaId: 'user_asha1', name: 'Manga Devi', age: 35, gender: 'Female', village: 'Pedapalli', phone: '9876500001', aadhaar: 'XXXX-XXXX-0001', conditions: ['Anaemia'], riskLevel: 'medium', vitals: [], lastVisit: '2026-03-01' },
  { id: 'ap2', ashaId: 'user_asha1', name: 'Suresh Babu', age: 52, gender: 'Male', village: 'Nadendla', phone: '9876500002', aadhaar: 'XXXX-XXXX-0002', conditions: ['Hypertension', 'Diabetes'], riskLevel: 'high', vitals: [], lastVisit: '2026-02-28' },
  { id: 'ap3', ashaId: 'user_asha1', name: 'Radha Kumari', age: 28, gender: 'Female', village: 'Pedapalli', phone: '9876500003', aadhaar: 'XXXX-XXXX-0003', conditions: ['Pregnancy - 7th month'], riskLevel: 'medium', vitals: [], lastVisit: '2026-03-03' },
];

export const VOICE_MESSAGES: any[] = [];

export const SYMPTOMS = [
  { id: 'sym1', name: 'Fever', icon: '🤒', relatedSpecialties: ['General Physician'] },
  { id: 'sym2', name: 'Cold & Cough', icon: '🤧', relatedSpecialties: ['General Physician'] },
  { id: 'sym3', name: 'Headache', icon: '🤕', relatedSpecialties: ['General Physician', 'Neurologist'] },
  { id: 'sym4', name: 'Stomach Pain', icon: '🤢', relatedSpecialties: ['General Physician', 'Gastroenterologist'] },
  { id: 'sym5', name: 'Back Pain', icon: '😣', relatedSpecialties: ['Orthopedic'] },
  { id: 'sym6', name: 'Joint Pain', icon: '🦴', relatedSpecialties: ['Orthopedic'] },
  { id: 'sym7', name: 'Skin Rash', icon: '🔴', relatedSpecialties: ['Dermatologist'] },
  { id: 'sym8', name: 'Eye Problem', icon: '👁️', relatedSpecialties: ['Ophthalmologist'] },
  { id: 'sym9', name: 'Chest Pain', icon: '💔', relatedSpecialties: ['Cardiologist'] },
  { id: 'sym10', name: 'Breathing Difficulty', icon: '😮‍💨', relatedSpecialties: ['General Physician', 'Cardiologist'] },
  { id: 'sym11', name: 'Toothache', icon: '🦷', relatedSpecialties: ['Dentist'] },
  { id: 'sym12', name: 'Ear Pain', icon: '👂', relatedSpecialties: ['ENT'] },
  { id: 'sym13', name: 'Period Problems', icon: '🩸', relatedSpecialties: ['Gynecologist'] },
  { id: 'sym14', name: 'Child Illness', icon: '👶', relatedSpecialties: ['Pediatrician'] },
  { id: 'sym15', name: 'Mental Health', icon: '🧠', relatedSpecialties: ['Psychiatrist'] },
];

export const LABS = [
  { id: 'lab1', name: 'Apollo Diagnostics', address: 'Jubilee Hills, Hyderabad', distance: '2.1 km', rating: 4.6, phone: '040-44445555', openHours: '7:00 AM - 9:00 PM', homeCollectionAvailable: true },
  { id: 'lab2', name: 'Thyrocare', address: 'Ameerpet, Hyderabad', distance: '3.4 km', rating: 4.4, phone: '040-33334444', openHours: '6:30 AM - 8:00 PM', homeCollectionAvailable: true },
  { id: 'lab3', name: 'Dr. Lal PathLabs', address: 'Banjara Hills, Hyderabad', distance: '4.2 km', rating: 4.7, phone: '040-22223333', openHours: '7:00 AM - 10:00 PM', homeCollectionAvailable: true },
  { id: 'lab4', name: 'SRL Diagnostics', address: 'Secunderabad', distance: '6.8 km', rating: 4.3, phone: '040-11112222', openHours: '7:00 AM - 7:00 PM', homeCollectionAvailable: false },
  { id: 'lab5', name: 'Vijaya Diagnostics', address: 'Kukatpally, Hyderabad', distance: '8.5 km', rating: 4.5, phone: '040-55556666', openHours: '6:00 AM - 9:00 PM', homeCollectionAvailable: true },
];

export const LAB_TESTS: Record<string, any[]> = {
  lab1: [
    { labId: 'lab1', testId: 'test1', testName: 'Complete Blood Count (CBC)', price: 400, discountedPrice: 280, available: true },
    { labId: 'lab1', testId: 'test2', testName: 'Blood Sugar Fasting', price: 150, discountedPrice: 110, available: true },
    { labId: 'lab1', testId: 'test3', testName: 'Lipid Profile', price: 600, discountedPrice: 450, available: true },
    { labId: 'lab1', testId: 'test4', testName: 'Thyroid Profile (TSH)', price: 350, discountedPrice: 260, available: true },
  ],
  lab2: [
    { labId: 'lab2', testId: 'test1', testName: 'Complete Blood Count (CBC)', price: 350, discountedPrice: 249, available: true },
    { labId: 'lab2', testId: 'test2', testName: 'Blood Sugar Fasting', price: 120, discountedPrice: 89, available: true },
    { labId: 'lab2', testId: 'test3', testName: 'Lipid Profile', price: 500, discountedPrice: 350, available: true },
  ],
  lab3: [
    { labId: 'lab3', testId: 'test1', testName: 'Complete Blood Count (CBC)', price: 420, discountedPrice: 299, available: true },
    { labId: 'lab3', testId: 'test2', testName: 'Blood Sugar Fasting', price: 160, discountedPrice: 120, available: true },
    { labId: 'lab3', testId: 'test3', testName: 'Lipid Profile', price: 650, discountedPrice: 480, available: true },
    { labId: 'lab3', testId: 'test4', testName: 'Thyroid Profile (TSH)', price: 380, discountedPrice: 280, available: true },
    { labId: 'lab3', testId: 'test7', testName: 'Full Body Checkup', price: 2800, discountedPrice: 1699, available: true },
  ],
  lab4: [
    { labId: 'lab4', testId: 'test1', testName: 'Complete Blood Count (CBC)', price: 380, discountedPrice: 260, available: true },
    { labId: 'lab4', testId: 'test3', testName: 'Lipid Profile', price: 550, discountedPrice: 399, available: true },
  ],
  lab5: [
    { labId: 'lab5', testId: 'test1', testName: 'Complete Blood Count (CBC)', price: 360, discountedPrice: 250, available: true },
    { labId: 'lab5', testId: 'test2', testName: 'Blood Sugar Fasting', price: 130, discountedPrice: 95, available: true },
    { labId: 'lab5', testId: 'test3', testName: 'Lipid Profile', price: 520, discountedPrice: 370, available: true },
    { labId: 'lab5', testId: 'test6', testName: 'Chest X-Ray', price: 450, discountedPrice: 320, available: true },
  ],
};

export const LAB_SLOTS: Record<string, any[]> = {
  lab1: [
    { id: 'ls1', labId: 'lab1', date: '2026-03-17', time: '08:00 AM', available: true },
    { id: 'ls2', labId: 'lab1', date: '2026-03-17', time: '09:00 AM', available: true },
    { id: 'ls3', labId: 'lab1', date: '2026-03-17', time: '10:00 AM', available: false },
    { id: 'ls4', labId: 'lab1', date: '2026-03-17', time: '11:00 AM', available: true },
    { id: 'ls5', labId: 'lab1', date: '2026-03-18', time: '08:00 AM', available: true },
    { id: 'ls6', labId: 'lab1', date: '2026-03-18', time: '09:00 AM', available: true },
  ],
  lab2: [
    { id: 'ls7', labId: 'lab2', date: '2026-03-17', time: '07:00 AM', available: true },
    { id: 'ls8', labId: 'lab2', date: '2026-03-17', time: '08:00 AM', available: true },
    { id: 'ls9', labId: 'lab2', date: '2026-03-17', time: '09:00 AM', available: true },
  ],
  lab3: [
    { id: 'ls10', labId: 'lab3', date: '2026-03-17', time: '07:30 AM', available: true },
    { id: 'ls11', labId: 'lab3', date: '2026-03-17', time: '08:30 AM', available: true },
    { id: 'ls12', labId: 'lab3', date: '2026-03-17', time: '09:30 AM', available: true },
    { id: 'ls13', labId: 'lab3', date: '2026-03-17', time: '10:30 AM', available: false },
  ],
  lab4: [
    { id: 'ls14', labId: 'lab4', date: '2026-03-17', time: '08:00 AM', available: true },
    { id: 'ls15', labId: 'lab4', date: '2026-03-17', time: '09:00 AM', available: true },
  ],
  lab5: [
    { id: 'ls16', labId: 'lab5', date: '2026-03-17', time: '07:00 AM', available: true },
    { id: 'ls17', labId: 'lab5', date: '2026-03-17', time: '08:00 AM', available: true },
    { id: 'ls18', labId: 'lab5', date: '2026-03-17', time: '09:00 AM', available: true },
    { id: 'ls19', labId: 'lab5', date: '2026-03-17', time: '10:00 AM', available: true },
  ],
};

export const PHARMACY_PARTNERS = [
  { id: 'pharm1', name: 'MedPlus Pharmacy', address: 'Jubilee Hills, Hyderabad', distance: '1.5 km', phone: '040-66667777', whatsappNumber: '919876543210', deliveryAvailable: true, openHours: '8:00 AM - 11:00 PM' },
  { id: 'pharm2', name: 'Apollo Pharmacy', address: 'Banjara Hills, Hyderabad', distance: '2.8 km', phone: '040-77778888', whatsappNumber: '919876543211', deliveryAvailable: true, openHours: '24 Hours' },
  { id: 'pharm3', name: 'Netmeds Partner Store', address: 'Ameerpet, Hyderabad', distance: '3.2 km', phone: '040-88889999', whatsappNumber: null, deliveryAvailable: true, openHours: '9:00 AM - 10:00 PM' },
  { id: 'pharm4', name: 'Jan Aushadhi Kendra', address: 'Secunderabad', distance: '5.1 km', phone: '040-99990000', whatsappNumber: null, deliveryAvailable: false, openHours: '8:00 AM - 8:00 PM' },
];

export const CALLBACK_REQUESTS: any[] = [];
export const APPOINTMENT_REQUESTS: any[] = [];
