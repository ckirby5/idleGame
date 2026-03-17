import { prisma } from "../server";
import type { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import jwt, { type Secret, type JwtPayload, type SignOptions } from "jsonwebtoken";

interface RegisterRequest {
    email: string;
    password: string;
    username: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface UserPayload {
    userId: number
}

export const register = async (req: Request, res: Response): Promise<void> => {
    const saltRounds = 15;
    const jwtSecret = process.env.JWT_SECRET as Secret;
    try {
        const { email, password, username } = req.body as unknown as RegisterRequest;
        if (await prisma.user.findUnique({ where: { email } })) {
            res.status(409).json({ error: "User already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await prisma.user.create({
            data: ({ email, passwordHash: hashedPassword, username  }),
        });
        await prisma.inventorySettings.create({
            data: {
                userId: user.id,
                // set default inventory settings
            },
        });
        const userPayload: UserPayload = { userId: user.id };
        const signOptions = { expiresIn: process.env.JWT_EXPIRES_IN ?? "1h" } as SignOptions;
        const token = jwt.sign(userPayload, jwtSecret as Secret, signOptions);
        

        res.status(201).json({ token, user: { id: user.id, email: user.email, username: user.username } });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const jwtSecret = process.env.JWT_SECRET as Secret;
    try {
        const { email, password } = req.body as unknown as LoginRequest;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        const userPayload: UserPayload = { userId: user.id };
        const signOptions = { expiresIn: process.env.JWT_EXPIRES_IN ?? "1h" } as SignOptions;
        const token = jwt.sign(userPayload, jwtSecret as Secret, signOptions);
        res.status(200).json({ token, user: { id: user.id, email: user.email, username: user.username } });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};
