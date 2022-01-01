import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { FLOAT, INTEGER } = DataTypes

const Reviews = sequelize.define('reviews', {
  user_id: INTEGER,
  lab_id: INTEGER,
  ratings: FLOAT,
}, {
  timestamps: true,
  schema: process.env.Schema,
});

export default Reviews;
