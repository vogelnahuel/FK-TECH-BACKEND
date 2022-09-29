import Router from "express";

import { LoginController } from "../../modules/login/loginControllers";
import { LoginValidator } from "../../middleware/login/loginMiddleware";
import './loginSchema'

/**
 *  @brief inicializa las rutas con su path por defecto y Login validator middleware que valida los datos pasados por el usuario
 *
 */
const Login = Router();

/**
 * @swagger
 * /flexservice/api/login:
 *   post:
 *     summary: return login token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       500:
 *         description: Some server error
 */
Login.post("/", LoginValidator, LoginController.LoginPost);

export default Login;
