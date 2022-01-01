import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { STRING, INTEGER } = DataTypes

const Reports = sequelize.define('reports', {
  report_id: INTEGER,
  patient_id: INTEGER,
  appointment_date: STRING,
  payment_id: INTEGER,
  service_id: INTEGER,
  type: STRING,
}, {
  timestamps: true,
  schema: process.env.Schema,
});

export default Reports;
