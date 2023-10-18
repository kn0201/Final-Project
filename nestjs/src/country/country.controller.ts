import { Controller, Get } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {
  constructor(private countryService: CountryService) {}

  @Get()
  async getCountryList() {
    return this.countryService.getCountryList();
  }
}
