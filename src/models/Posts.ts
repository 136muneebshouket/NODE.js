import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { Model } from "sequelize";
import sequelize from "../config/database";
import { baseAttributes, baseOptions } from "./BaseAttributes";

class Posts extends Model<
  InferAttributes<Posts>,
  InferCreationAttributes<Posts>
> {
  static initModel(): void {
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
  }
}
// Export model initialization function
export const initPostsModel = (): void => {
  Posts.initModel();
};

export default Posts;
