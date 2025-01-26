import { BcryptAdapter, JwtAdapter } from "@/core/adapters";
import { UserModel } from "@/data/postgres";
import { LoginDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";
import { AuthResponse } from "./auth.response";

export class AuthService {

  constructor(private readonly authResponse: AuthResponse) {}

  
  public async login(loginDto: LoginDto) {
    const user = await UserModel.findFirst({
      where: {
        email: loginDto.email,
      },
      include: {
        role: true,
      },
    });
    if (!user) throw CustomError.notFound("Correo o contraseña incorrectos");

    //* Compare password
    const passwordMatch = BcryptAdapter.compare(
      loginDto.password,
      user.password
    ); 
    if (!passwordMatch) throw CustomError.unauthorized("Correo o contraseña incorrectos");

    //* Generate token
    const token = (await JwtAdapter.generateToken({
      id: user.id_user,
    })) as string;
    if (!token) throw CustomError.internalServer("Error generating token");

    console.log("token", token);

    return this.authResponse.login(user, token);
  }


  public async logout() {
    return this.authResponse.logout();
  }
}
