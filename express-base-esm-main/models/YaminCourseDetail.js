import { DataTypes, DATE } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'YaminCourseDetail',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      OrderId: {
        type: DataTypes.INTEGER,
      },
      Course_id: {
        type: DataTypes.INTEGER,
      },
      Course_image: {
        type: DataTypes.STRING,
      },
      Course_name: {
        type: DataTypes.STRING,
      },
      Course_unitprice: {
        type: DataTypes.INTEGER,
      },
      Course_quantity: {
        type: DataTypes.INTEGER,
      },
      Course_totalprice: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'YaminCourseDetail', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
