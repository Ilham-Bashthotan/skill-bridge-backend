import { Injectable } from '@nestjs/common';

@Injectable()
export class JobValidation {
  // Validation rules specific to jobs
  validateJobTitle(title: string): boolean {
    return Boolean(
      title && title.trim().length >= 3 && title.trim().length <= 200,
    );
  }

  validateJobDescription(description: string): boolean {
    return Boolean(
      description &&
        description.trim().length >= 10 &&
        description.trim().length <= 5000,
    );
  }

  validateCompanyName(company: string): boolean {
    return Boolean(
      company && company.trim().length >= 2 && company.trim().length <= 100,
    );
  }

  validateRequirements(requirements: string): boolean {
    return Boolean(
      requirements &&
        requirements.trim().length >= 10 &&
        requirements.trim().length <= 2000,
    );
  }

  validateLocation(location: string): boolean {
    return Boolean(
      location && location.trim().length >= 2 && location.trim().length <= 100,
    );
  }

  validateSearchQuery(query: string): boolean {
    return Boolean(query && query.trim().length >= 1);
  }

  validatePaginationParams(page: number, limit: number): boolean {
    return page >= 1 && limit >= 1 && limit <= 100;
  }

  validateSortField(field: string): boolean {
    const allowedFields = ['created_at', 'title', 'company'];
    return allowedFields.includes(field);
  }

  validateSortOrder(order: string): boolean {
    const allowedOrders = ['asc', 'desc'];
    return allowedOrders.includes(order);
  }
}
