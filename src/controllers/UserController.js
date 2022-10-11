import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


class UserController {
    async create(req, res){
        const { name, email, password } = req.body;
        console.log(req.body);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        });
        return res.send(user).status(201);
    }
}

export default new UserController();