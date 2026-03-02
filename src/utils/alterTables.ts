import sequelize from "../config/database";

const models = ["User", "Posts"];

async function Alter() {
  // console.log(models.length)
  //   let modelname = "User";
  //   try {
  //     await sequelize.models[modelname].sync({ alter : true });
  //     console.log(`The table for the ${modelname} model was just (re)created!`);
  //   } catch (error) {
  //     console.error(`Error syncing ${modelname}:`, (error as Error).message);
  //   }

  // for (let i = 0; i < models.length; i++) {
  //   let modelname = models[i];
  //   try {
  //     await sequelize.models[modelname].sync({ force: true });
  //     console.log(`The table for the ${modelname} model was just (re)created!`);
  //   } catch (error) {
  //     console.error(`Error syncing ${modelname}:`, (error as Error).message);
  //   }
  // }
}

export { Alter };
