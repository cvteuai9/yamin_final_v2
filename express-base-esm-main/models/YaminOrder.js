import { DataTypes, DATE, UUIDV4 } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'YaminOrder',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      state: {
        type: DataTypes.INTEGER,
      },
      order_uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      coupon_id: {
        type: DataTypes.INTEGER,
      },
      coupon_discount: {
        type: DataTypes.FLOAT,
      },
      amount: {
        type: DataTypes.INTEGER,
      },
      totalPrice: {
        type: DataTypes.INTEGER,
      },
      username: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.INTEGER,
      },
      delivery: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      note: {
        type: DataTypes.STRING,
      },
      payState: {
        type: DataTypes.STRING,
      },
      cardnumber: {
        type: DataTypes.INTEGER,
      },
      cardholder: {
        type: DataTypes.STRING,
      },
      cardexpiry: {
        type: DataTypes.INTEGER,
      },
      cvc: {
        type: DataTypes.INTEGER,
      },
      transaction_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'pending, paid, fail, cancel, error',
      },
      order_info: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'send to line pay',
      },
      reservation: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'get from line pay',
      },
      confirm: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'confirm from line pay',
      },
      return_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'YaminOrder', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
