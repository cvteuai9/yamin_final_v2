import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Users_Coupons',
    {
      id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      coupon_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'coupons',
          key: 'id',
        },
      },
      assigned_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      redeemed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('unused', 'used', 'expired'),
        allowNull: false,
        defaultValue: 'unused',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      tableName: 'users_coupons',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {
        beforeCreate: (record, options) => {
          record.assigned_at = new Date()
        },
      },
    }
  )
}
