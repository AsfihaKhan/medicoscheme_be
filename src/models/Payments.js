import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { STRING, INTEGER, } = DataTypes

const Payments = sequelize.define('payments', {
  amount: INTEGER,
  from: INTEGER,
  to: INTEGER,
  trx_id: STRING,
  payment_method: STRING,
  from_type: STRING,
  to_type: STRING,
}, {
  timestamps: true,
  schema: process.env.Schema,
});

export default Payments;
