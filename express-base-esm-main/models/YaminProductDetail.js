import { DataTypes, DATE } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'YaminProductDetail',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      OrderId: {
        type: DataTypes.INTEGER,
      },
      Product_id: {
        type: DataTypes.INTEGER,
      },
      Product_image: {
        type: DataTypes.STRING,
      },
      Product_name: {
        type: DataTypes.STRING,
      },
      Product_unitprice: {
        type: DataTypes.INTEGER,
      },
      Product_quantity: {
        type: DataTypes.INTEGER,
      },
      Product_totalprice: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'YaminProductDetail', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
