import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { STRING, INTEGER, JSONB } = DataTypes

const Doctors = sequelize.define('doctors', {
  picture: STRING,
  full_name: STRING,
  designation: STRING,
  gender: STRING,
  bio: STRING,
  phone_no: STRING,
  email: STRING,
  chamber_address: STRING,
  offday: STRING,
  consulting_time: STRING,
  consulting_fee_new: INTEGER,
  consulting_fee_old: INTEGER,
  license: STRING,
  specialist: JSONB,
  serial_limit: INTEGER,
  degree: JSONB,
  status: STRING,
}, {
  timestamps: true,
  schema: process.env.Schema,
});

export default Doctors;
