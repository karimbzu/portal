import {Request} from './request';

export interface Cart extends Request {
  cartId: number;
  dateTime: string;
}
