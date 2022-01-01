import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { STRING, INTEGER, DATE, } = DataTypes

const ReportDengues = sequelize.define('report_dengues', {
  patient_id: INTEGER,
  delivery_time: DATE,
  report_name: STRING,
  referred_by: STRING,
  result: STRING,
}, {
  timestamps: true,
  schema: process.env.Schema,
});

export default ReportDengues;
