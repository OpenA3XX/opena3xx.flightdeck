import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { ConfigurationService } from '../services/configuration.service';

interface RequestBody {
  [key: string]: unknown;
}

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private loadingService: LoadingService,
    private configService: ConfigurationService
  ) {}

  intercept(request: HttpRequest<RequestBody>, next: HttpHandler): Observable<HttpEvent<RequestBody>> {
    // Check if this is a ping/heartbeat request that should not show loading
    const isPingRequest = this.isPingOrHeartbeatRequest(request);

    // Show loading indicator only for non-ping requests
    if (!isPingRequest && !this.isSearchRequest(request)) {
      this.loadingService.show();
    }

    // Add common headers
    const modifiedRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    // Log request in debug mode
    if (this.configService.isDebugModeEnabled()) {
      console.log('HTTP Request:', modifiedRequest);
    }

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Log error in debug mode
        if (this.configService.isDebugModeEnabled()) {
          console.error('HTTP Error:', error);
        }

        // Handle specific HTTP errors
        if (error.status === 401) {
          // Handle unauthorized - redirect to login or refresh token
          console.warn('Unauthorized request detected');
        }

        if (error.status === 0) {
          // Network error - API might be down
          console.error('Network error - API unreachable');
        }

        return throwError(() => error);
      }),
      finalize(() => {
        // Hide loading indicator only if it was shown (for non-ping requests)
        if (!isPingRequest) {
          this.loadingService.hide();
        }
      })
    );
  }

  private isSearchRequest(request: HttpRequest<RequestBody>): boolean {
    const url = request.url.toLowerCase();
    return url.includes('/api/search');
  }

  /**
   * Check if the request is a ping/heartbeat request that should not show loading
   */
  private isPingOrHeartbeatRequest(request: HttpRequest<RequestBody>): boolean {
    const url = request.url.toLowerCase();

    // List of URL patterns that should not trigger loading indicator
    const excludedPatterns = [
      '/core/heartbeat/ping',
      '/heartbeat',
      '/ping',
      '/health',
      '/status',
      '/keepalive',
      '/poll'
    ];

    // Check if request has a custom header to skip loading
    if (request.headers.has('X-Skip-Loading')) {
      return true;
    }

    return excludedPatterns.some(pattern => url.includes(pattern));
  }
}
