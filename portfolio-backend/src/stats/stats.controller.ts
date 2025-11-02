import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiKeyGuard } from '../auth/api-key.guard';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  @UseGuards(ApiKeyGuard)
  getDashboardStats() {
    return this.statsService.getDashboardStats();
  }
}

