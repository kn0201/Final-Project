import { Controller, Get } from '@nestjs/common';
import { LanguageService } from './language.service';

@Controller('languages')
export class LanguageController {
  constructor(private languageService: LanguageService) {}

  @Get()
  async getLanguageList() {
    return this.languageService.getLanguageList();
  }
}
