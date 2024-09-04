import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Course',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      current_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      limit_people: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      img1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      img2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      img3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      valid: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
      },
    },
    {
      tableName: 'course', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
