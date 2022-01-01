import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { STRING, INTEGER, BOOLEAN } = DataTypes

const Appointments = sequelize.define('appointments', {
  doctor_id: INTEGER,
  patient_id: INTEGER,
  payment_id: INTEGER,
  serial_num: INTEGER,
  appointment_date: STRING,
  is_new: BOOLEAN,
  status: STRING,
}, {
  timestamps: true,
  schema: process.env.Schema,
});

export default Appointments;
