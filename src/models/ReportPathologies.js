import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { STRING, INTEGER, DATE, } = DataTypes

const ReportPathologies = sequelize.define('report_pathologies', {
  patient_id: INTEGER,
  delivery_time: DATE,
  referred_by: STRING,
  report_name: STRING,
  color: STRING,
  appearance: STRING,
  sedimeent: STRING,
  reaction: STRING,
  albumin: STRING,
  suger: STRING,
  pus_cell: STRING,
  epithetical_cell: STRING,
  rbc: STRING,
  granular_cast: STRING,
  wbc_cast: STRING,
  pus_cells_cast: STRING,
  cellular_cast: STRING,
  spermatozoa: STRING,
  amorph_phosphate: STRING,
  calcium_oxalate: STRING,
  uric_acid: STRING,
  urates: STRING,
  triple_phosphate: STRING,
  calcium_carbonate: STRING,
  yest_cells: STRING,
}, {
  timestamps: true,
  schema: process.env.Schema,
});

export default ReportPathologies;
