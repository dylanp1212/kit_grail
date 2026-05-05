import { Controller, Get, Route } from 'tsoa'

interface Health {
  status: string
}

@Route('health')
export class HealthController extends Controller {
  @Get()
  public async get(): Promise<Health> {
    return { status: 'ok' }
  }
}
