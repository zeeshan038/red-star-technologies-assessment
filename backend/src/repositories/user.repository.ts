import { User, UserCreationAttributes } from "../models/user.js";
import { Op } from "sequelize";

export class UserRepository {
    async create(data: UserCreationAttributes) {
        return User.create(data);
    }

    async findById(id: number) {
        return User.findByPk(id);
    }

    async findByEmail(email: string) {
        return User.findOne({ where: { email } });
    }

    async search(query: string) {
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

    async update(id: number, data: Partial<UserCreationAttributes>) {
        const user = await this.findById(id);
        if (!user) {
            return null;
        }
        return user.update(data);
    }

    async delete(id: number) {
        return User.destroy({ where: { id } });
    }
}

export const userRepo = new UserRepository();
