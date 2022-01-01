import bcrypt from "bcryptjs";
import { QueryTypes } from "sequelize";
import db from "../config/Database";
import SendData from "../utils/responses/SendData";
import SendMessage from "../utils/responses/SendMessage";
import Users from "../models/Users";
import Admins from "../models/Admins";
import Doctors from "../models/Doctors";
import Labs from "../models/Labs";
import Patients from "../models/Patients";
import Services from "../models/Services";
import Blogs from "../models/Blogs";
import Payments from "../models/Payments";
import Appointments from "../models/Appointments";
import Notifications from "../models/Notifications";
import Reports from "../models/Reports";
import Reviews from "../models/Reviews";
import ReportImagings from "../models/ReportImagings";
import ReportDengues from "../models/ReportDengues";
import ReportPathologies from "../models/ReportPathologies";
import ReportHematologies from "../models/ReportHematologies";

export const GetProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new Error(`Provide user info!`));

    const UserInfo = await Users.findByPk(id);
    if (!UserInfo) return next(new Error(`User not found!`));

    const { user, user_name, role } = UserInfo;
    let Data;
    if (role === "admin") {
      Data = await Admins.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { id: user },
      });
    } else if (role === "doctor") {
      Data = await Doctors.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { id: user },
      });
    } else if (role === "lab") {
      Data = await Labs.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { id: user },
      });
    } else if (role === "patient") {
      Data = await Patients.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { id: user },
      });
    }

    SendData(res, {
      id,
      user_name,
      role,
      Data,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const ModifyProfile = async (req, res, next) => {
  try {
    const UserInfo = await Users.findByPk(req.user.id);
    if (!UserInfo) return next(new Error(`User not found!`));

    const { user, role } = UserInfo;
    const { doctor, lab, patient } = req.body;

    if (role === "doctor") {
      if (!doctor || Object.keys(doctor).length === 0)
        return next(new Error(`User not found!`));
      const DoctorInfo = await Doctors.update(doctor, {
        where: {
          id: user,
        },
      });
      if (!DoctorInfo)
        return next(
          new Error(`Something went wrong when modifying the profile!`)
        );
    } else if (role === "lab") {
      if (!lab || Object.keys(lab).length === 0)
        return next(new Error(`User not found!`));
      const LabInfo = await Labs.update(lab, {
        where: {
          id: user,
        },
      });
      if (!LabInfo)
        return next(
          new Error(`Something went wrong when modifying the profile!`)
        );
    } else if (role === "patient") {
      if (!patient || Object.keys(patient).length === 0)
        return next(new Error(`User not found!`));
      const PatientInfo = await Patients.update(patient, {
        where: {
          id: user,
        },
      });
      if (!PatientInfo)
        return next(
          new Error(`Something went wrong when modifying the profile!`)
        );
    }

    SendMessage(res, "Account modify successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const CreateServices = async (req, res, next) => {
  try {
    const { name, price } = req.body;
    if (!name) return next(new Error(`Provide service name!`));
    if (!price) return next(new Error(`Provide service price!`));

    if (req.user.role !== "lab") return next(new Error(`Not authenticated`));
    const ServiceInfo = await Services.create({
      name,
      price,
      lab: req.user.id,
    });
    if (!ServiceInfo)
      return next(new Error(`Something went wrong when creating the service!`));

    SendMessage(res, "Service created successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const GetServices = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new Error(`Provide lab information!`));

    const ServiceInfo = await Services.findAll({
      attributes: ["id", "name", "price"],
      where: { lab: id },
    });
    if (!ServiceInfo) return next(new Error(`Service not found!`));

    SendData(res, ServiceInfo);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const ModifyServices = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new Error(`Provide service information!`));

    let ServiceInfo = await Services.findByPk(id);
    if (!ServiceInfo) return next(new Error(`Service not found!`));

    const { name, price } = req.body;
    if (!name) return next(new Error(`Provide service name!`));
    if (!price) return next(new Error(`Provide service price!`));

    ServiceInfo = await Services.update(
      {
        name,
        price,
      },
      {
        where: { id },
      }
    );
    if (!ServiceInfo)
      return next(
        new Error(`Something went wrong when modifying the service!`)
      );

    SendMessage(res, "Service modify successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const GetDoctors = async (req, res, next) => {
  try {
    const DoctorsInfo = await db.query(
      ` SELECT 
       id, picture, full_name, designation, gender, bio, phone_no, email, chamber_address, offday, consulting_time, consulting_fee_new, license, consulting_fee_old, serial_limit, status, specialist, "degree"
      FROM 
        ${process.env.Schema}.get_doctors();
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!DoctorsInfo) return next(new Error(`Doctors not found!`));

    SendData(res, DoctorsInfo);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const GetLabs = async (req, res, next) => {
  try {
    const LabsInfo = await db.query(
      `
      SELECT 
id, picture, full_name, address, phone_no, email, report_deliverytime, license, ratings, status      FROM 
        ${process.env.Schema}.get_labs();
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!LabsInfo) return next(new Error(`Labs not found!`));

    SendData(res, LabsInfo);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const GetPatients = async (req, res, next) => {
  try {
    const PatientsInfo = await db.query(
      `
      SELECT 
        id, full_name, picture, age, gender, phone_no, address, email
      FROM 
        ${process.env.Schema}.get_patients();
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!PatientsInfo) return next(new Error(`Patients not found!`));

    SendData(res, PatientsInfo);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const ModifyDoctorStatus = async (req, res, next) => {
  try {
    const { id, status } = req.body;
    if (!id) return next(new Error(`Provide doctor information!`));
    if (!status) return next(new Error(`Provide status information!`));

    // Status validation
    let checkStatusInfo = false;
    ["reject", "accept"].map((el) => {
      if (status === el) checkStatusInfo = true;
    });
    if (!checkStatusInfo) {
      throw new Error(
        "Provide valid status information, like: 'reject', 'accept'"
      );
    }

    const UsersInfo = await Users.findByPk(id);
    if (!UsersInfo) return next(new Error(`Doctor not found!`));

    const DoctorInfo = await Doctors.update(
      { status },
      {
        where: {
          id: UsersInfo.user,
        },
      }
    );
    if (!DoctorInfo)
      return next(
        new Error(`Something went wrong when updating doctor information!`)
      );

    SendMessage(res, "Information modify successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const ModifyLabStatus = async (req, res, next) => {
  try {
    const { id, status } = req.body;
    if (!id) return next(new Error(`Provide lab information!`));
    if (!status) return next(new Error(`Provide status information!`));

    // Status validation
    let checkStatusInfo = false;
    ["reject", "accept"].map((el) => {
      if (status === el) checkStatusInfo = true;
    });
    if (!checkStatusInfo) {
      throw new Error(
        "Provide valid status information, like: 'reject', 'accept'"
      );
    }

    const UsersInfo = await Users.findByPk(id);
    if (!UsersInfo) return next(new Error(`Lab not found!`));

    const LabInfo = await Labs.update(
      { status },
      {
        where: {
          id: UsersInfo.user,
        },
      }
    );
    if (!LabInfo)
      return next(
        new Error(`Something went wrong when updating lab information!`)
      );

    SendMessage(res, "Information modify successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const CreateBlog = async (req, res, next) => {
  try {
    const { header, post } = req.body;
    if (!header) return next(new Error(`Provide blog header!`));
    if (!post) return next(new Error(`Provide blog body!`));

    if (req.user.role !== "doctor") return next(new Error(`Not authenticated`));

    const BlogInfo = await Blogs.create({
      header,
      post,
      author: req.user.id,
    });
    if (!BlogInfo)
      return next(new Error(`Something went wrong when creating a new blog!`));

    SendMessage(res, "Blog published successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const ModifyBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new Error(`Provide blog id!`));

    const { header, post } = req.body;
    if (!header) return next(new Error(`Provide blog header!`));
    if (!post) return next(new Error(`Provide blog body!`));

    if (req.user.role !== "doctor") return next(new Error(`Not authenticated`));

    const BlogInfo = await Blogs.update(
      {
        header,
        post,
      },
      {
        where: {
          id,
        },
      }
    );
    if (!BlogInfo)
      return next(new Error(`Something went wrong when modifying the blog!`));

    SendMessage(res, "Blog modify successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const DeleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new Error(`Provide blog id!`));

    if (req.user.role !== "doctor") return next(new Error(`Not authenticated`));

    const BlogInfo = await Blogs.destroy({
      where: {
        id,
      },
    });
    if (!BlogInfo)
      return next(new Error(`Something went wrong when deleting the blog!`));

    SendMessage(res, "Blog delete successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const GetBlogsByDoctor = async (req, res, next) => {
  try {
    if (req.user.role !== "doctor") return next(new Error(`Not authenticated`));

    const BlogInfo = await db.query(
      `
      SELECT 
        b.id, b."header", b.post, b."createdAt", d.picture, d.full_name, d.designation, d.specialist, d."degree"
      FROM 
        ${process.env.Schema}.blogs b,
        ${process.env.Schema}.doctors d,
        ${process.env.Schema}.users u
      WHERE
        b.author = ${req.user.id} and
        b.author = u.id AND
        u."user" = d.id
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!BlogInfo) return next(new Error(`Blog not found!`));

    SendData(res, BlogInfo);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const GetBlogs = async (req, res, next) => {
  try {
    const BlogInfo = await db.query(
      `
      SELECT 
        id, "header", post, "createdAt", picture, full_name, designation, specialist, "degree"      FROM 
        ${process.env.Schema}.get_blogs();
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!BlogInfo) return next(new Error(`Blog not found!`));

    SendData(res, BlogInfo);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const GetBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new Error(`Provide blog id!`));

    let BlogInfo = await Blogs.findByPk(id);
    if (!BlogInfo) return next(new Error(`Blog not found!`));

    BlogInfo = await db.query(
      `
      SELECT 
        id, "header", post, "createdAt", picture, full_name, designation, specialist, "degree"
      FROM 
        ${process.env.Schema}.get_blog_infos(${id});
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!BlogInfo) return next(new Error(`Blog not found!`));

    SendData(res, BlogInfo[0]);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const CreateAppointmentDoctor = async (req, res, next) => {
  try {
    const {
      doctor_id,
      appointment_date,
      is_new,
      amount,
      trx_id,
      payment_method,
    } = req.body;
    const { id } = req.user;

    if (!doctor_id) return next(new Error(`Provide doctor info!`));
    if (!appointment_date) return next(new Error(`Provide appointment date!`));
    if (!amount) return next(new Error(`Provide amount!`));
    if (!trx_id) return next(new Error(`Provide trx info!`));

    // Admin Info
    const AdminInfo = await Users.findOne({ user_name: "admin" });

    // Payment Info
    const PaymnetInfo = await Payments.create({
      amount,
      from: id,
      to: AdminInfo.id,
      trx_id,
      payment_method,
      from_type: "patient",
      to_type: "admin",
    });
    if (!PaymnetInfo)
      return next(
        new Error(`Something went wrong when creating this appointment!`)
      );

    const SerialInfo = await Appointments.count({
      where: {
        doctor_id,
        appointment_date,
      },
    });

    // Appointment
    const AppointmentInfo = await Appointments.create({
      doctor_id,
      patient_id: id,
      payment_id: PaymnetInfo.id,
      serial_num: SerialInfo + 1,
      appointment_date,
      is_new,
      status: "open",
    });
    if (!AppointmentInfo)
      return next(
        new Error(`Something went wrong when creating this appointment!`)
      );

    // Notifications
    await Notifications.create({
      details: `Created a new appointment, Appointment Date: ${appointment_date}, Serial Number: ${
        SerialInfo + 1
      }`,
      header: `Appointment Id: ${AppointmentInfo.id}`,
      from: id,
      from_type: "patient",
      to: doctor_id,
      to_type: "doctor",
      is_view: false,
    });

    SendMessage(res, "Appointment created successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const CompleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new Error(`Provide appointment info!`));

    let AppointmentInfo = await Appointments.findByPk(id);
    if (!AppointmentInfo) return next(new Error(`Appointment not found!`));

    AppointmentInfo = await Appointments.update(
      {
        status: "complete",
      },
      {
        where: {
          id,
        },
      }
    );
    if (!AppointmentInfo)
      return next(
        new Error(`Something went wrong when modifying this appointment!`)
      );

    SendMessage(res, "Appointment completed successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const GetNotifications = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const NotificationsInfo = await Notifications.findAll({
      attributes: ["id", "header", "details", "is_view", "createdAt"],
      where: {
        to: id,
        to_type: role,
      },
    });
    if (!NotificationsInfo) return next(new Error(`Notifications not found!`));

    SendData(res, NotificationsInfo);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const ModifyNotifications = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !ids.length)
      return next(new Error(`Provide notification info!`));

    for (let i = 0; i < ids.length; i++) {
      const NotificationsInfo = await Notifications.update(
        {
          is_view: true,
        },
        {
          where: {
            id: ids[i],
          },
        }
      );
      if (!NotificationsInfo)
        return next(
          new Error(`Something went wrong when updating notifications!`)
        );
    }
    SendMessage(res, "Notification modify successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const GetAppointmentByDoctor = async (req, res, next) => {
  try {
    const AppointmentsInfo = await db.query(
      `
      SELECT 
       id, serial_num, appointment_date, is_new, status, payment_id, amount, trx_id, patient_id, full_name, picture, age, gender, phone_no, address      FROM 
        ${process.env.Schema}.GetAppointmentByDoctor(${req.user.id});
    
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!AppointmentsInfo) return next(new Error(`Appointments not found!`));

    SendData(res, AppointmentsInfo);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const GetAppointmentByPatients = async (req, res, next) => {
  try {
    const AppointmentsInfo = await db.query(
      `
      SELECT 
 id, serial_num, appointment_date, is_new, status, payment_id, amount, trx_id, doctor_id, full_name, picture, designation, specialist
      FROM 
        ${process.env.Schema}.getappointmentbypatients(${req.user.id})
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!AppointmentsInfo) return next(new Error(`Appointments not found!`));

    SendData(res, AppointmentsInfo);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const GetBookedDoctors = async (req, res, next) => {
  try {
    const AppointmentsData = await db.query(
      `
      SELECT 
        appointment_date,  amount,  doctor_id,  full_name,  picture,  designation,  specialist
      FROM 
        ${process.env.Schema}.GetBookedDoctors(${req.user.id});
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!AppointmentsData) return next(new Error(`Appointments not found!`));

    const AppointmentsInfo = [];
    AppointmentsData.map((el) => {
      const {
        appointment_date,
        amount,
        doctor_id,
        full_name,
        picture,
        designation,
        specialist,
      } = el;
      const pos = AppointmentsInfo.findIndex(
        (app) => app.doctor_id === doctor_id
      );
      if (pos === -1) {
        AppointmentsInfo.push({
          appointment_date,
          amount,
          doctor_id,
          full_name,
          picture,
          designation,
          specialist,
          totalAppointment: 1,
        });
      } else {
        AppointmentsInfo[pos].totalAppointment += 1;
      }
    });

    SendData(res, AppointmentsInfo);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const CreateAppointmentLab = async (req, res, next) => {
  try {
    const { appointment_date, service_id, trx_id } = req.body;
    const { id } = req.user;

    if (!appointment_date) return next(new Error(`Provide appointment date!`));
    if (!service_id) return next(new Error(`Provide service info!`));
    if (!trx_id) return next(new Error(`Provide trx info!`));

    // Admin Info
    const AdminInfo = await Users.findOne({ user_name: "admin" });

    // Service
    const ServiceInfo = await Services.findByPk(service_id);
    if (!ServiceInfo) return next(new Error(`Service not found!`));

    // Payment Info
    const PaymnetInfo = await Payments.create({
      amount: ServiceInfo.price,
      from: id,
      from_type: "patient",
      to: AdminInfo.id,
      to_type: "admin",
      trx_id,
    });
    if (!PaymnetInfo)
      return next(
        new Error(`Something went wrong when creating this appointment!`)
      );

    // Reports
    const ReportInfo = await Reports.create({
      patient_id: id,
      appointment_date,
      payment_id: PaymnetInfo.id,
      service_id,
    });
    if (!ReportInfo)
      return next(
        new Error(`Something went wrong when creating this appointment!`)
      );

    // Notifications
    await Notifications.create({
      details: `Created a new appointment, Appointment Date: ${appointment_date}`,
      header: `Report Id: ${ReportInfo.id}`,
      from: id,
      from_type: "patient",
      to: ServiceInfo.lab,
      to_type: "lab",
      is_view: false,
    });

    SendMessage(res, "Appointment created successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const CreateReview = async (req, res, next) => {
  try {
    const { lab_id, ratings } = req.body;
    const { id } = req.user;

    if (!lab_id) return next(new Error(`Provide lab info!`));
    if (!ratings) return next(new Error(`Provide lab rating!`));

    const LabInfo = await Users.findOne({
      attributes: ["user"],
      where: {
        id: lab_id,
        role: "lab"
      }
    })
    if (!LabInfo) return next(new Error(`Lab not found!`));


    let ReviewInfo = await Reviews.findOne({
      where: {
        user_id: id,
        lab_id,
      }
    })

    if (ReviewInfo) {
      ReviewInfo = await Reviews.update(
        {
          ratings,
        },
        {
          where: {
            user_id: id,
            lab_id,
          },
        }
      );
    } else {
      ReviewInfo = await Reviews.create({
        user_id: id,
        lab_id,
        ratings,
      });
    }

    const AvgInfo = await db.query(`
      SELECT 
        avg(r.ratings) as ratings
      FROM 
        ${process.env.Schema}.reviews r
      WHERE 
        r.lab_id = ${lab_id}
    `, {
      type: QueryTypes.SELECT,
    })

    await Labs.update(
      {
        ratings: AvgInfo[0].ratings,
      },
      {
        where: {
          id: LabInfo.user
        },
      }
    );

    SendMessage(res, "Review added successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const ModifyReview = async (req, res, next) => {
  try {
    const { id, ratings } = req.body;

    if (!id) return next(new Error(`Provide review info!`));
    if (!ratings) return next(new Error(`Provide lab rating!`));

    const ReviewInfo = await Reviews.update(
      {
        ratings,
      },
      {
        where: {
          id,
        },
      }
    );
    if (!ReviewInfo)
      return next(
        new Error(`Something went wrong when modifying this review!`)
      );

    SendMessage(res, "Review modifying successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const GetPendingPatient = async (req, res, next) => {
  try {
    const PendingPatientInfo = await db.query(
      `
      SELECT 
           id, patient_id, appointment_date, service_id, "name", full_name, age
           FROM 
        ${process.env.Schema}.GetPendingPatient(${req.user.id});
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!PendingPatientInfo) return next(new Error(`Patients not found!`));

    SendData(res, PendingPatientInfo);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const CreateReportImaging = async (req, res, next) => {
  try {
    const {
      patient_id,
      report_name,
      image,
      referred_by,
      delivery_time,
      report_id,
    } = req.body;

    if (!patient_id) return next(new Error(`Provide patient info!`));
    if (!report_name) return next(new Error(`Provide report name!`));
    if (!image) return next(new Error(`Provide report image!`));
    if (!delivery_time) return next(new Error(`Provide report delivery time!`));
    if (!report_id) return next(new Error(`Provide report info!`));

    let ReportInfo = await Reports.findByPk(report_id);
    if (!ReportInfo) return next(new Error(`Report not found!`));

    const ReportImagingInfo = await ReportImagings.create({
      patient_id,
      report_name,
      image,
      referred_by,
      delivery_time,
    });
    if (!ReportImagingInfo)
      return next(new Error(`Something went wrong when creating this report!`));

    ReportInfo = await Reports.update(
      {
        report_id: ReportImagingInfo.id,
        type: "imaging",
      },
      {
        where: {
          id: report_id,
        },
      }
    );
    if (!ReportInfo)
      return next(new Error(`Something went wrong when creating this report!`));

    // Notifications
    await Notifications.create({
      details: `${report_name} report is ready, Delivery Date: ${delivery_time}`,
      header: `Report Id: ${report_id}`,
      from: req.user.id,
      from_type: "lab",
      to: patient_id,
      to_type: "patient",
      is_view: false,
    });

    SendMessage(res, "Report created successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const CreateReportDengue = async (req, res, next) => {
  try {
    const {
      patient_id,
      report_name,
      referred_by,
      delivery_time,
      report_id,
      result,
    } = req.body;

    if (!patient_id) return next(new Error(`Provide patient info!`));
    if (!report_name) return next(new Error(`Provide report name!`));
    if (!result) return next(new Error(`Provide report result!`));
    if (!delivery_time) return next(new Error(`Provide report delivery time!`));
    if (!report_id) return next(new Error(`Provide report info!`));

    let ReportInfo = await Reports.findByPk(report_id);
    if (!ReportInfo) return next(new Error(`Report not found!`));

    const ReportDengueInfo = await ReportDengues.create({
      patient_id,
      report_name,
      referred_by,
      delivery_time,
      result,
    });
    if (!ReportDengueInfo)
      return next(new Error(`Something went wrong when creating this report!`));

    ReportInfo = await Reports.update(
      {
        report_id: ReportDengueInfo.id,
        type: "dengue",
      },
      {
        where: {
          id: report_id,
        },
      }
    );
    if (!ReportInfo)
      return next(new Error(`Something went wrong when creating this report!`));

    // Notifications
    await Notifications.create({
      details: `${report_name} report is ready, Delivery Date: ${delivery_time}`,
      header: `Report Id: ${report_id}`,
      from: req.user.id,
      from_type: "lab",
      to: patient_id,
      to_type: "patient",
      is_view: false,
    });

    SendMessage(res, "Report created successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const CreateReportPathologie = async (req, res, next) => {
  try {
    const {
      patient_id,
      referred_by,
      report_name,
      delivery_time,
      report_id,
      color,
      appearance,
      sedimeent,
      reaction,
      albumin,
      suger,
      pus_cell,
      epithetical_cell,
      rbc,
      granular_cast,
      wbc_cast,
      pus_cells_cast,
      cellular_cast,
      spermatozoa,
      amorph_phosphate,
      calcium_oxalate,
      uric_acid,
      urates,
      triple_phosphate,
      calcium_carbonate,
      yest_cells,
    } = req.body;

    if (!patient_id) return next(new Error(`Provide patient info!`));
    if (!report_name) return next(new Error(`Provide report name!`));
    if (!delivery_time) return next(new Error(`Provide report delivery time!`));
    if (!report_id) return next(new Error(`Provide report info!`));

    let ReportInfo = await Reports.findByPk(report_id);
    if (!ReportInfo) return next(new Error(`Report not found!`));

    const ReportPathologieInfo = await ReportPathologies.create({
      patient_id,
      referred_by,
      report_name,
      delivery_time,
      color,
      appearance,
      sedimeent,
      reaction,
      albumin,
      suger,
      pus_cell,
      epithetical_cell,
      rbc,
      granular_cast,
      wbc_cast,
      pus_cells_cast,
      cellular_cast,
      spermatozoa,
      amorph_phosphate,
      calcium_oxalate,
      uric_acid,
      urates,
      triple_phosphate,
      calcium_carbonate,
      yest_cells,
    });
    if (!ReportPathologieInfo)
      return next(new Error(`Something went wrong when creating this report!`));

    ReportInfo = await Reports.update(
      {
        report_id: ReportPathologieInfo.id,
        type: "pathologie",
      },
      {
        where: {
          id: report_id,
        },
      }
    );
    if (!ReportInfo)
      return next(new Error(`Something went wrong when creating this report!`));

    // Notifications
    await Notifications.create({
      details: `Pathologie report is ready, Delivery Date: ${delivery_time}`,
      header: `Report Id: ${report_id}`,
      from: req.user.id,
      from_type: "lab",
      to: patient_id,
      to_type: "patient",
      is_view: false,
    });

    SendMessage(res, "Report created successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const CreateReportHematologie = async (req, res, next) => {
  try {
    const {
      patient_id,
      report_name,
      referred_by,
      delivery_time,
      report_id,
      hemoglobin_hb,
      esr_westergren,
      neutrophils,
      lymphocytes,
      monocytes,
      eosinophils,
      basophils,
      hct,
      mcv,
      mch,
      mchc,
      rbw_cv,
      mpv,
      pwd,
    } = req.body;

    if (!patient_id) return next(new Error(`Provide patient info!`));
    if (!report_name) return next(new Error(`Provide report name!`));
    if (!delivery_time) return next(new Error(`Provide report delivery time!`));
    if (!report_id) return next(new Error(`Provide report info!`));

    let ReportInfo = await Reports.findByPk(report_id);
    if (!ReportInfo) return next(new Error(`Report not found!`));

    const ReportHematologieInfo = await ReportHematologies.create({
      patient_id,
      report_name,
      referred_by,
      delivery_time,
      hemoglobin_hb,
      esr_westergren,
      neutrophils,
      lymphocytes,
      monocytes,
      eosinophils,
      basophils,
      hct,
      mcv,
      mch,
      mchc,
      rbw_cv,
      mpv,
      pwd,
    });
    if (!ReportHematologieInfo)
      return next(new Error(`Something went wrong when creating this report!`));

    ReportInfo = await Reports.update(
      {
        report_id: ReportHematologieInfo.id,
        type: "hematologie",
      },
      {
        where: {
          id: report_id,
        },
      }
    );
    if (!ReportInfo)
      return next(new Error(`Something went wrong when creating this report!`));

    // Notifications
    await Notifications.create({
      details: `${report_name} report is ready, Delivery Date: ${delivery_time}`,
      header: `Report Id: ${report_id}`,
      from: req.user.id,
      from_type: "lab",
      to: patient_id,
      to_type: "patient",
      is_view: false,
    });

    SendMessage(res, "Report created successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const GetReportInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new Error(`Provide report info!`));

    const ReportInfo = await db.query(
      `
      SELECT 
     appointment_date,report_id,"type",patient_id,full_name,picture,age,gender,phone_no,address
      FROM 
        ${process.env.Schema}.getreportinfo(${id})
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!ReportInfo) return next(new Error(`Report not found!`));

    const {
      report_id,
      appointment_date,
      type,
      patient_id,
      full_name,
      picture,
      age,
      gender,
      phone_no,
      address,
    } = ReportInfo[0];
    let Data;
    if (type === "imaging") {
      Data = await ReportImagings.findByPk(report_id);
    } else if (type === "dengue") {
      Data = await ReportDengues.findByPk(report_id);
    } else if (type === "pathologie") {
      Data = await ReportPathologies.findByPk(report_id);
    } else if (type === "hematologie") {
      Data = await ReportHematologies.findByPk(report_id);
    }

    SendData(res, {
      id,
      appointment_date,
      type,
      patient_id,
      full_name,
      picture,
      age,
      gender,
      phone_no,
      address,
      Data,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const GetBookedLabs = async (req, res, next) => {
  try {
    const LabsData = await db.query(
      `
      SELECT
        r.id, r.appointment_date, r."type", r.report_id, pay.amount, pay.trx_id, u.id as lab_id, l.full_name, l.picture, l.address, l.phone_no, l.email
      FROM
        ${process.env.Schema}.reports r,
        ${process.env.Schema}.payments pay,
        ${process.env.Schema}.services s,
        ${process.env.Schema}.users u,
        ${process.env.Schema}.labs l
      WHERE
        r.payment_id = pay.id AND
        r.service_id = s.id AND
        r.patient_id = ${req.user.id} AND
        u.id = s.lab AND
        u."user" = l.id
    `,
      {
        type: QueryTypes.SELECT,
      }
    );

    const LabsInfo = [];
    for (let i = 0; i < LabsData.length; i++) {
      const {
        lab_id,
        full_name,
        picture,
        address,
        phone_no,
        email,
        appointment_date,
        type,
        report_id,
        amount,
        trx_id,
      } = LabsData[i];
      let Data;
      if (type === "imaging") {
        Data = await ReportImagings.findByPk(report_id);
      } else if (type === "dengue") {
        Data = await ReportDengues.findByPk(report_id);
      } else if (type === "pathologie") {
        Data = await ReportPathologies.findByPk(report_id);
      } else if (type === "hematologie") {
        Data = await ReportHematologies.findByPk(report_id);
      }

      const ReviewInfo = await Reviews.findOne({
        attributes: ["ratings"],
        where: {
          user_id: req.user.id,
          lab_id,
        }
      });

      const pos = LabsInfo.findIndex((lab) => lab.lab_id === lab_id);
      if (pos === -1) {
        LabsInfo.push({
          lab_id,
          full_name,
          picture,
          address,
          phone_no,
          email,
          ratings: ReviewInfo ? ReviewInfo.ratings : 0,
          totalAppointment: 1,
          serviceHistory: [],
        });

        if (Data) {
          LabsInfo[0].serviceHistory.push({
            report_name: Data.report_name,
            amount,
            appointment_date,
            delivery_time: Data.delivery_time,
            trx_id,
          });
        }
      } else {
        LabsInfo[pos].totalAppointment += 1;
        if (Data) {
          LabsInfo[pos].serviceHistory.push({
            report_name: Data.report_name,
            amount,
            appointment_date,
            delivery_time: Data.delivery_time,
            trx_id,
          });
        }
      }
    }

    SendData(res, LabsInfo);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const AdminDashboard = async (req, res, next) => {
  try {
    const TotalPatientsInfo = await Users.count({
      where: {
        role: "patient",
      },
    });

    const TotalDoctorsInfo = await Users.count({
      where: {
        role: "doctor",
      },
    });

    const TotalLabsInfo = await Users.count({
      where: {
        role: "lab",
      },
    });

    const TotalTransactionsInfo = await Payments.count();
    const TotalReportsInfo = await Reports.count();

    SendData(res, {
      TotalPatientsInfo,
      TotalDoctorsInfo,
      TotalLabsInfo,
      TotalTransactionsInfo,
      TotalReportsInfo,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const DoctorDashboard = async (req, res, next) => {
  try {
    const TransactionsInfo = await db.query(
      `
      SELECT 
        a.id, a.patient_id, pa.full_name, pa.age, pa.gender, p.amount, p.trx_id, a.status, a.is_new, a.appointment_date
      FROM
        ${process.env.Schema}.appointments a,
        ${process.env.Schema}.payments p,
        ${process.env.Schema}.users u,
        ${process.env.Schema}.patients pa
      WHERE 
        a.doctor_id = ${req.user.id} AND
        a.payment_id = p.id AND
        a.patient_id = u.id AND
        u."user" = pa.id
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!TransactionsInfo) return next(new Error(`Transactions not found!`));

    let TotalEarned = 0;
    TransactionsInfo.map((el) => {
      TotalEarned += el.amount;
    });

    SendData(res, {
      TotalPatient: TransactionsInfo.length,
      TotalEarned,
      TransactionsInfo,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const LabDashboard = async (req, res, next) => {
  try {
    const DeliveredReportsInfo = await db.query(
      `
      SELECT
        r.id, r.patient_id, r.appointment_date, r."type", pay.amount, p.full_name, p.age, p.gender
      FROM
        ${process.env.Schema}.reports r,
        ${process.env.Schema}.payments pay,
        ${process.env.Schema}.users u,
        ${process.env.Schema}.patients p,
        ${process.env.Schema}.services s
      WHERE
        r.payment_id = pay.id AND
        r.patient_id = u.id AND
        u."user" = p.id AND
        r.service_id = s.id AND
        s.lab = ${req.user.id}
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!DeliveredReportsInfo)
      return next(new Error(`Delivered reports not found!`));

    let DeliveredReports = 0,
      EarnedMoney = 0;
    DeliveredReportsInfo.map((el) => {
      if (el.type !== null) DeliveredReports++;
      EarnedMoney += el.amount;
    });

    SendData(res, {
      TotalPatients: DeliveredReportsInfo.length,
      DeliveredReports,
      EarnedMoney,
      DeliveredReportsInfo,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const PatientDashboard = async (req, res, next) => {
  try {
    const DoctorAppointment = await Appointments.count({
      where: {
        patient_id: req.user.id,
      },
    });

    const ReportsInfo = await db.query(
      `
      SELECT
        r.id, r.appointment_date, r."type", pay.amount, pay.trx_id, s."name"
      FROM
        ${process.env.Schema}.reports r,
        ${process.env.Schema}.payments pay,
        ${process.env.Schema}.services s
      WHERE
        r.payment_id = pay.id AND
        r.service_id = s.id AND
        r.patient_id = ${req.user.id}
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!ReportsInfo) return next(new Error(`Delivered reports not found!`));

    const TransactionsInfo = await Payments.findAll({
      attributes: ["id", "amount", "trx_id", "createdAt"],
      where: {
        from: req.user.id,
        from_type: "patient",
      },
    });

    let TotalCost = 0;
    TransactionsInfo.map((el) => {
      TotalCost += el.amount;
    });

    SendData(res, {
      DoctorAppointment,
      LabAppointment: ReportsInfo.length,
      TotalCost,
      ReportsInfo,
      TransactionsInfo,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
