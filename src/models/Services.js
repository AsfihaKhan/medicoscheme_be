import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { STRING, INTEGER, FLOAT } = DataTypes

const Services = sequelize.define('services', {
  name: STRING,
  price: FLOAT,
  lab: INTEGER,
}, {
  timestamps: true,
  schema: process.env.Schema,
});

export default Services;
