import { User } from "../models/user.js";
import { Op } from "sequelize";
export class UserRepository {
    async create(data) {
        return User.create(data);
    }
    async findById(id) {
        return User.findByPk(id);
    }
    async findByEmail(email) {
        return User.findOne({ where: { email } });
    }
    async search(query) {
        return User.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } },
                ],
            },
            attributes: ["id", "name", "email"],
            limit: 10,
        });
    }
    async findAll() {
        return User.findAll();
    }
    async update(id, data) {
        const user = await this.findById(id);
        if (!user) {
            return null;
        }
        return user.update(data);
    }
    async delete(id) {
        return User.destroy({ where: { id } });
    }
}
export const userRepo = new UserRepository();
