import { Router } from "express";
import {
  GetProfile,
  ModifyProfile,
  CreateServices,
  GetServices,
  ModifyServices,
  GetDoctors,
  GetLabs,
  GetPatients,
  ModifyDoctorStatus,
  ModifyLabStatus,
  CreateBlog,
  ModifyBlog,
  DeleteBlog,
  GetBlogsByDoctor,
  GetBlogs,
  GetBlog,
  CreateAppointmentDoctor,
  CompleteAppointment,
  GetNotifications,
  ModifyNotifications,
  GetAppointmentByDoctor,
  GetAppointmentByPatients,
  GetBookedDoctors,
  CreateAppointmentLab,
  CreateReview,
  ModifyReview,
  GetPendingPatient,
  CreateReportImaging,
  CreateReportDengue,
  CreateReportPathologie,
  CreateReportHematologie,
  GetReportInfo,
  GetBookedLabs,
  AdminDashboard,
  DoctorDashboard,
  LabDashboard,
  PatientDashboard,
} from "../controllers/AppController";
import AuthorizedUser from "../middlewares/AuthorizedUser";

const router = Router();

// Public
router.get("/blogs", GetBlogs);
router.get("/blogs/:id", GetBlog);

router.use(AuthorizedUser);

router.get("/profile/:id", GetProfile);
router.patch("/profile", ModifyProfile);

// Services
router.post("/services", CreateServices);
router.get("/services/:id", GetServices);
router.patch("/services/:id", ModifyServices);

// Doctor
router.get("/doctors", GetDoctors);
router.patch("/doctors/status", ModifyDoctorStatus);
router.patch("/doctors/appointment-complete/:id", CompleteAppointment);
router.get("/doctors/appointments", GetAppointmentByDoctor);
router.get("/doctors/booked", GetBookedDoctors);

// Labs
router.get("/labs", GetLabs);
router.patch("/labs/status", ModifyLabStatus);
router.post("/labs/appointment", CreateAppointmentLab);
router.get("/labs/pending-patient", GetPendingPatient);
router.post("/labs/report-imaging", CreateReportImaging);
router.post("/labs/report-dengue", CreateReportDengue);
router.post("/labs/report-pathologie", CreateReportPathologie);
router.post("/labs/report-hematologies", CreateReportHematologie);
router.get("/labs/reports/:id", GetReportInfo);

// Patient
router.get("/patients", GetPatients);
router.post("/patients/appointment", CreateAppointmentDoctor);
router.get("/patients/appointments", GetAppointmentByPatients);
router.get("/patients/booked-labs", GetBookedLabs);

// Blog
router.post("/blogs", CreateBlog);
router.patch("/blogs/:id", ModifyBlog);
router.delete("/blogs/:id", DeleteBlog);
router.get("/blogs-by-doctor", GetBlogsByDoctor);

// Notification
router.get("/notifications", GetNotifications);
router.patch("/notifications", ModifyNotifications);

// Reviews
router.post("/reviews", CreateReview);
router.patch("/reviews", ModifyReview);

router.get("/dashboards/admin", AdminDashboard);
router.get("/dashboards/doctor", DoctorDashboard);
router.get("/dashboards/lab", LabDashboard);
router.get("/dashboards/patient", PatientDashboard);

export default router;
