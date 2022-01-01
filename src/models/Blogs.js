import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { STRING, INTEGER } = DataTypes

const Blogs = sequelize.define('blogs', {
  header: STRING,
  post: STRING,
  author: INTEGER,
}, {
  timestamps: true,
  schema: process.env.Schema,
});

export default Blogs;
