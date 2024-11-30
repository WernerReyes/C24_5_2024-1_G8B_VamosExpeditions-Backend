import 'dotenv/config';
import { get } from 'env-var';


export class Envs {

  public static readonly  PORT = get('PORT').required().asPortNumber()

}



