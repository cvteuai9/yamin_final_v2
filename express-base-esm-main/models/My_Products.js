import { DataTypes, DATE } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'My_Products',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      weight: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      brand_id: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
      },
      tea_id: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
      },
      package_id: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
      },
      style_id: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      available_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      valid: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
      },
      paths: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'my_products', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
