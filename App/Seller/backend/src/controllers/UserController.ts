import { Controller, Get, Post, Route, Body, Path, SuccessResponse } from "tsoa";

interface User {
  id: number;
  name: string;
}

interface CreateUserRequest {
  name: string;
}

@Route("users")
export class UserController extends Controller {
  @Get("{userId}")
  public async getUser(@Path() userId: number): Promise<User> {
    return { id: userId, name: "Ada" };
  }

  @SuccessResponse("201", "Created")
  @Post()
  public async createUser(@Body() body: CreateUserRequest): Promise<User> {
    this.setStatus(201);
    return { id: 1, name: body.name };
  }
}