import { NextRequest } from 'next/server';

export function validateApiKey(request: NextRequest): boolean {
  // Get API key from header
  const apiKey = request.headers.get('X-API-Key');
  const expectedApiKey = process.env.CMS_API_KEY || process.env.NEXT_PUBLIC_CMS_API_KEY;

  // If no expected API key is set, allow all requests
  if (!expectedApiKey) {
    return true;
  }

  // If API key matches, allow request
  return apiKey === expectedApiKey;
}

export function requireApiKey(request: NextRequest): void {
  // if (!validateApiKey(request)) {
  //   throw new Error('Unauthorized: Invalid API Key');
  // }
}

