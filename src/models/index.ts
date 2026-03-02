import sequelize from '../config/database';
import Posts, { initPostsModel } from './Posts';
import User, { initUserModel } from './User';

// Export models
export { User, Posts };
// Initialize all models
export const initModels = (): void => {
  initUserModel();
  initPostsModel();
  // Add other model initializations here as needed
};

// Define associations (if any)
export const defineAssociations = (): void => {
  // Example: User.hasMany(Post, { foreignKey: 'userId' });
  // Post.belongsTo(User, { foreignKey: 'userId' });
};

// Sync all models with database (for development only)
export const syncModels = async (force = false): Promise<void> => {
  try {
    initModels();
    defineAssociations();
 
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};