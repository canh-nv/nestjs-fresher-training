import { Controller, Get } from '@nestjs/common';
import { Public } from '../metadata/metadata';


@Public()
@Controller('health')
export class HealthController {
          @Get()
          checkHealth() {
                    return { success: true };
          }
}