"use strict";
import {
  Sequelize,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from "sequelize";
import { baseAttributes, baseOptions } from "./BaseAttributes";

class Posts extends Model<
  InferAttributes<Posts>,
  InferCreationAttributes<Posts>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly deletedAt: CreationOptional<Date>;

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models: any) {
    // define association here
    // Example: Posts.belongsTo(models.User, { foreignKey: 'userId' });
  }
}

const initPosts = (sequelize: Sequelize): typeof Posts => {
  Posts.init(
    {
      ...baseAttributes,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "posts",
      ...baseOptions,
    },
  );
  return Posts;
};

export { Posts, initPosts };
export default initPosts;
