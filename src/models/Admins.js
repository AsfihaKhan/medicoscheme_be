import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { STRING } = DataTypes

const Admins = sequelize.define('admins', {
  name: STRING,
}, {
  timestamps: true,
  schema: process.env.Schema,
});

export default Admins;
