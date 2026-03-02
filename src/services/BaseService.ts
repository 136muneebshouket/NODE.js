import { Model, ModelStatic } from 'sequelize';

export abstract class BaseService<T extends Model> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async findAll(options?: any): Promise<T[]> {
    return await this.model.findAll(options);
  }

  async findById(id: number, options?: any): Promise<T | null> {
    return await this.model.findByPk(id, options);
  }

  async findOne(options: any): Promise<T | null> {
    return await this.model.findOne(options);
  }

  async create(data: any, options?: any): Promise<any> {
    return await this.model.create(data, options);
  }

  async update(id: number, data: any, options?: any): Promise<[number, T[]]> {
    const result = await this.model.update(data, {
      where: { id },
      returning: true,
      ...options,
    });
    return result as [number, T[]];
  }

  async delete(id: number, options?: any): Promise<number> {
    return await this.model.destroy({
      where: { id },
      ...options,
    });
  }

  async count(options?: any): Promise<any> {
    const result = await this.model.count(options);
    return result;
  }
}