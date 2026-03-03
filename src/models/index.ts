"use strict";
import fs from "fs";
import path from "path";
import { Sequelize, ModelStatic, Model } from "sequelize";
// import sequelize from "../config/database";
import dotenv from 'dotenv';

dotenv.config();

// ──────────────────────────────────────────────────────────────
// Classic Sequelize CLI pattern — auto-discovers every model
// file in this directory. Just drop a new model file here and
// it will be picked up automatically. No manual registration.
// ──────────────────────────────────────────────────────────────


const config = require(__dirname + '/../config/database.js')['production'];


let sequelize = new Sequelize(config.database, config.username, config.password, config);


const basename = path.basename(__filename);
const db: Record<string, any> = {};

fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf(".") !== 0 &&          // skip hidden files
      file !== basename &&                 // skip this file (index.ts / index.js)
      !file.startsWith("BaseAttributes") && // skip helper file
      (file.slice(-3) === ".js" || file.slice(-3) === ".ts") &&
      file.indexOf(".test.") === -1 &&     // skip test files
      file.indexOf(".spec.") === -1 &&     // skip spec files
      file.indexOf(".d.ts") === -1         // skip declaration files
    );
  })
  .forEach((file: string) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const modelModule = require(path.join(__dirname, file));

    // Each model file's default export is the init function: (sequelize) => ModelClass
    const initFn = modelModule.default || modelModule;

    if (typeof initFn === "function") {
      const model = initFn(sequelize);
      db[model.name] = model;
    }
  });

// Call associate() on every model that defines it
Object.keys(db).forEach((modelName: string) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach sequelize instance & constructor to the db bag
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

