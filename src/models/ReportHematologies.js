import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { STRING, INTEGER, DATE, } = DataTypes

const ReportHematologies = sequelize.define('report_hematologies', {
  patient_id: INTEGER,
  delivery_time: DATE,
  report_name: STRING,
  referred_by: STRING,
  hemoglobin_hb: STRING,
  esr_westergren: STRING,
  neutrophils: STRING,
  lymphocytes: STRING,
  monocytes: STRING,
  eosinophils: STRING,
  basophils: STRING,
  hct: STRING,
  mcv: STRING,
  mch: STRING,
  mchc: STRING,
  rbw_cv: STRING,
  mpv: STRING,
  pwd: STRING,
}, {
  timestamps: true,
  schema: process.env.Schema,
});

export default ReportHematologies;
