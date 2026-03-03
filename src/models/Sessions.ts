import {
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { Model } from "sequelize";

import { baseAttributes, baseOptions } from "./BaseAttributes";

interface TableAttributes {
  id: CreationOptional<number>;
  token: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  deletedAt: CreationOptional<Date>;
}

class Sessions
  extends Model<InferAttributes<Sessions>, InferCreationAttributes<Sessions>>
  implements TableAttributes
{
  declare id: CreationOptional<number>;
  declare token: string;
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
    // Example: User.hasMany(models.Posts, { foreignKey: 'userId' });
  }
}

const initSessions = (sequelize: Sequelize): typeof Sessions => {
  Sessions.init(
    {
      ...baseAttributes,
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
       
      },
    },
    {
      sequelize,
      // remember tableName should be same name as in the migration file of this Sessions
      tableName: "sessions",
      ...baseOptions,
    },
  );
  return Sessions;
};

export { Sessions, initSessions };
export default initSessions;
