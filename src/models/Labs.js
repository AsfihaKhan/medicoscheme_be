import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { STRING, FLOAT, DATE } = DataTypes

const Labs = sequelize.define('labs', {
  picture: STRING,
  full_name: STRING,
  address: STRING,
  phone_no: STRING,
  email: STRING,
  report_deliverytime: STRING,
  license: STRING,
  ratings: FLOAT,
  status: STRING,
}, {
  timestamps: true,
  schema: process.env.Schema,
});

export default Labs;
