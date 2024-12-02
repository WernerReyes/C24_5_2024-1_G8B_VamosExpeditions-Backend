import { BcryptAdapter, JwtAdapter } from "@/core/adapters";
import { UserModel } from "@/data/postgres";
import { LoginDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities/user.entity";
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
    if (!user) throw CustomError.notFound("User not found");

    //* Compare password
    const passwordMatch = BcryptAdapter.compare(
      loginDto.password,
      user.password
    );
    if (!passwordMatch) throw CustomError.unauthorized("Invalid password");

    const userEntity = UserEntity.fromObject(user);

    //* Generate token
    const token = (await JwtAdapter.generateToken({
      id: userEntity.id,
    })) as string;
    if (!token) throw CustomError.internalServer("Error generating token");

    return this.authResponse.login(userEntity, token);
  }

  public async logout() {
    return this.authResponse.logout();
  }
}