import { Request } from 'express';
import { IUser } from './iuser.interfaces';


// Mở rộng Request để bao gồm user có kiểu IUser
export interface AuthRequest extends Request {
  user: IUser; // Gán kiểu cho user
}