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
import CreateJWT from "../utils/CreateJWT";

export const SignIn = async (req, res, next) => {
  try {
    for (const el of ["user_name", "password"]) {
      if (!req.body[el]) {
        return next(new Error(`Provide your ${el}`));
      }
    }

    const { user_name, password } = req.body;

    const UserInfo = await Users.findOne({
      where: {
        user_name,
      },
    });
    if (!UserInfo) return next(new Error(`Username or Password is incorrect!`));

    const isEqual = await bcrypt.compare(password, UserInfo.password);
    if (!isEqual) return next(new Error("Username or Password is incorrect!"));

    const { id, role, user } = UserInfo;
    const token = CreateJWT(id, role);

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
      token,
      Data,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const SignUp = async (req, res, next) => {
  try {
    const { role, doctor, lab, patient } = req.body;

    // Role validation
    let checkRoleInfo = false;
    ["doctor", "lab", "patient"].map((el) => {
      if (role === el) checkRoleInfo = true;
    });
    if (!checkRoleInfo) {
      throw new Error(
        "Provide valid role information, like: 'doctor', 'lab' and 'patient'"
      );
    }

    if (role === "doctor") {
      const { user_name, password } = doctor;
      const DuplicateUser = await Users.findOne({
        where: { user_name },
      });
      if (DuplicateUser) return next(new Error(`Already use this username!`));

      const DoctorInfo = await Doctors.create({
        ...doctor,
        status: "pending",
      });
      if (!DoctorInfo)
        return next(new Error(`Something went wrong when creating doctor!`));

      const hashPass = await bcrypt.hash(password, 12);
      const UserInfo = await Users.create({
        user_name,
        password: hashPass,
        role: "doctor",
        user: DoctorInfo.id,
      });
      if (!UserInfo)
        return next(new Error(`Something went wrong when creating doctor!`));
    } else if (role === "lab") {
      const { user_name, password } = lab;
      const DuplicateUser = await Users.findOne({
        where: { user_name },
      });
      if (DuplicateUser) return next(new Error(`Already use this username!`));

      const LabInfo = await Labs.create({
        ...lab,
        status: "pending",
        ratings: 0
      });
      if (!LabInfo)
        return next(new Error(`Something went wrong when creating lab!`));

      const hashPass = await bcrypt.hash(password, 12);
      const UserInfo = await Users.create({
        user_name,
        password: hashPass,
        role: "lab",
        user: LabInfo.id,
      });
      if (!UserInfo)
        return next(new Error(`Something went wrong when creating lab!`));
    } else if (role === "patient") {
      const { user_name, password } = patient;
      const DuplicateUser = await Users.findOne({
        where: { user_name },
      });
      if (DuplicateUser) return next(new Error(`Already use this username!`));

      const PatientInfo = await Patients.create(patient);
      if (!PatientInfo)
        return next(new Error(`Something went wrong when creating patient!`));

      const hashPass = await bcrypt.hash(password, 12);
      const UserInfo = await Users.create({
        user_name,
        password: hashPass,
        role: "patient",
        user: PatientInfo.id,
      });
      if (!UserInfo)
        return next(new Error(`Something went wrong when creating patient!`));
    }

    SendMessage(res, "Account created successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
