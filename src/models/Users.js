import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { STRING, INTEGER } = DataTypes

const Users = sequelize.define('users', {
  user_name: STRING,
  password: STRING,
  role: STRING,
  user: INTEGER,
}, {
  timestamps: true,
  schema: process.env.Schema,
});

export default Users;
