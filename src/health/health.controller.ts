import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/metadata/metadata';


@Public()
@Controller('health')
export class HealthController {
          @Get()
          checkHealth() {
                    return { success: true };
          }
}