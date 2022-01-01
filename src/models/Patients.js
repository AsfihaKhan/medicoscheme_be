import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { STRING, INTEGER } = DataTypes

const Patients = sequelize.define('patients', {
  full_name: STRING,
  picture: STRING,
  age: INTEGER,
  gender: STRING,
  email: STRING,
  phone_no: STRING,
  address: STRING,
}, {
  timestamps: true,
  schema: process.env.Schema,
});

export default Patients;
