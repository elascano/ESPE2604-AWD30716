import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id as string);
      
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { ruc, firstName, lastName, email, password } = req.body;
      
      const existingUser = await this.userService.getUserByRuc(ruc);
      if (existingUser) {
        res.status(400).json({ success: false, message: 'User with this RUC already exists' });
        return;
      }

      const newUser = await this.userService.createUser({
        ruc,
        firstName,
        lastName,
        email,
        password, 
      });

      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
      }

      const user = await this.userService.getLoginUser(email);
      
      if (!user || user.password !== password) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({ success: true, data: userWithoutPassword });
    } catch (error) {
      console.error('Login controller error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
