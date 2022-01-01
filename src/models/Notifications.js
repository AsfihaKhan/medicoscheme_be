import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { STRING, INTEGER, BOOLEAN } = DataTypes

const Notifications = sequelize.define('notifications', {
  details: STRING,
  header: STRING,
  from: INTEGER,
  from_type: STRING,
  to: INTEGER,
  to_type: STRING,
  is_view: BOOLEAN,
}, {
  timestamps: true,
  schema: process.env.Schema,
});

export default Notifications;
