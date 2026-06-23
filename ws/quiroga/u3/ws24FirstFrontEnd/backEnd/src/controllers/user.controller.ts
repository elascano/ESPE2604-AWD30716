import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../config/database';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
      const { ruc, firstName, middleName, lastName, secondLastName, email, password, birthDate } = req.body;
      
      const existingUser = await this.userService.getUserByRuc(ruc);
      if (existingUser) {
        res.status(400).json({ success: false, message: 'User with this RUC already exists' });
        return;
      }


      const existingEmail = await this.userService.getLoginUser(email);
      if (existingEmail) {
        res.status(400).json({ success: false, message: 'User with this Email already exists' });
        return;
      }

      const newUser = await this.userService.createUser({
        ruc,
        firstName,
        middleName,
        lastName,
        secondLastName,
        email,
        password,
        birthDate: birthDate ? new Date(birthDate) : null,
        profileCompleted: true
      });

      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      console.error('Register error:', error);
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
      

      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({ success: true, data: userWithoutPassword });
    } catch (error) {
      console.error('Login controller error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, newPassword } = req.body;

      if (!email || !newPassword) {
        res.status(400).json({ success: false, message: 'Email and newPassword are required' });
        return;
      }

      const user = await this.userService.getLoginUser(email);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      await this.userService.updatePassword(email, newPassword);

      res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async loginGoogle(req: Request, res: Response): Promise<void> {
    try {
      const { credential } = req.body;
      if (!credential) {
        res.status(400).json({ success: false, message: 'Token is required' });
        return;
      }

      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      
      if (!payload || !payload.email) {
        res.status(400).json({ success: false, message: 'Invalid token payload' });
        return;
      }

      let user = await this.userService.getLoginUser(payload.email);
      let needsProfileCompletion = false;

      if (!user || !user.profileCompleted) {

        needsProfileCompletion = true;
        const incompleteUser = user ? user : {
          email: payload.email,
          firstName: payload.given_name || 'Google',
          lastName: payload.family_name || 'User',
          ruc: '',
        };
        
        res.status(200).json({
          success: true,
          data: incompleteUser,
          needsProfileCompletion
        });
        return;
      }

      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({ 
        success: true, 
        data: userWithoutPassword,
        needsProfileCompletion: false
      });
    } catch (error) {
      console.error('Google Login error:', error);
      res.status(500).json({ success: false, message: 'Internal server error validating Google token' });
    }
  }

  public async completeProfile(req: Request, res: Response): Promise<void> {
    try {
      const { email, ruc, firstName, middleName, lastName, secondLastName, birthDate } = req.body;

      if (!email || !ruc) {
        res.status(400).json({ success: false, message: 'Email and RUC are required' });
        return;
      }


      const existingRucUser = await this.userService.getUserByRuc(ruc);
      if (existingRucUser && existingRucUser.email !== email) {
        res.status(400).json({ success: false, message: 'El RUC ingresado ya está registrado con otra cuenta.' });
        return;
      }

      let updatedUser;
      let existingUser = await this.userService.getLoginUser(email);
      
      if (existingUser) {
        updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            ruc,
            firstName,
            middleName,
            lastName,
            secondLastName,
            birthDate: birthDate ? new Date(birthDate) : null,
            profileCompleted: true
          }
        });
      } else {
        updatedUser = await this.userService.createUser({
          email,
          ruc,
          firstName,
          middleName,
          lastName,
          secondLastName,
          birthDate: birthDate ? new Date(birthDate) : null,
          profileCompleted: true
        });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.status(200).json({ success: true, data: userWithoutPassword });
    } catch (error) {
      console.error('Complete profile error:', error);
      res.status(500).json({ success: false, message: 'Internal server error completing profile' });
    }
  }
}
