import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { STRING, INTEGER, ARRAY, DATE, } = DataTypes

const ReportImagings = sequelize.define('report_imagings', {
  patient_id: INTEGER,
  report_name: STRING,
  image: ARRAY(STRING),
  referred_by: STRING,
  delivery_time: DATE,
}, {
  timestamps: true,
  schema: process.env.Schema,
});

export default ReportImagings;
