import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';

// Search API Interfaces
export interface SearchFilters {
  type?: string;
  limit?: number;
  offset?: number;
  minScore?: number;
  includeInactive?: boolean;
  sortBy?: 'relevance' | 'title' | 'createdDate' | 'updatedDate' | 'entityType';
  includeFacets?: boolean;
}

export interface SearchResponse {
  query: string;
  totalResults: number;
  page: number;
  totalPages: number;
  executionTimeMs: number;
  isSuccess: boolean;
  errorMessage?: string;
  results: SearchResult[];
  facets: SearchFacets;
}

export interface SearchResult {
  id: string;
  entityType: string;
  title: string;
  description: string;
  manufacturer?: string;
  relevanceScore: number;
  snippet: string;
  actions: SearchResultAction[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchResultAction {
  name: string;
  url: string;
}

export interface SearchFacets {
  entityTypes: Record<string, number>;
}

export interface EntityType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly BASE_URL: string;

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService
  ) {
    this.BASE_URL = this.configurationService.getApiBaseUrl();
  }

  /**
   * Main search endpoint
   */
  search(query: string, filters: SearchFilters = {}): Observable<SearchResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', filters.limit?.toString() || '20')
      .set('offset', filters.offset?.toString() || '0')
      .set('minScore', filters.minScore?.toString() || '0.1')
      .set('includeInactive', filters.includeInactive?.toString() || 'false')
      .set('includeFacets', filters.includeFacets?.toString() || 'true');

    if (filters.type) {
      params.set('type', filters.type);
    }

    return this.http.get<SearchResponse>(`${this.BASE_URL}/api/search`, { params }).pipe(
      catchError(error => {
        console.error('Search API error:', error);
        throw new Error('Failed to perform search. Please try again later.');
      })
    );
  }

  /**
   * Quick search endpoint for autocomplete
   */
  quickSearch(query: string, limit: number = 5): Observable<SearchResult[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString());

    return this.http.get<SearchResponse>(`${this.BASE_URL}/api/search/quick`, { params }).pipe(
      map(response => response.results || []),
      catchError(error => {
        console.error('Quick search API error:', error);
        throw new Error('Failed to perform quick search. Please try again later.');
      })
    );
  }

  /**
   * Get available entity types
   */
  getEntityTypes(): Observable<EntityType[]> {
    return this.http.get<EntityType[]>(`${this.BASE_URL}/api/search/entity-types`).pipe(
      catchError(error => {
        console.error('Entity types API error:', error);
        throw new Error('Failed to load entity types. Please try again later.');
      })
    );
  }

  /**
   * Get entity type icons and colors for UI
   */
  getEntityTypeInfo(entityType: string): { icon: string; color: string; label: string } {
    const entityTypeMap: Record<string, { icon: string; color: string; label: string }> = {
      'AircraftModel': {
        icon: 'airplanemode_active',
        color: '#2196f3',
        label: 'Aircraft Model'
      },
      'HardwarePanel': {
        icon: 'dashboard',
        color: '#1976d2',
        label: 'Hardware Panel'
      },
      'HardwareBoard': {
        icon: 'memory',
        color: '#9c27b0',
        label: 'Hardware Board'
      },
      'HardwareInput': {
        icon: 'login',
        color: '#4caf50',
        label: 'Hardware Input'
      },
      'HardwareOutput': {
        icon: 'logout',
        color: '#ff9800',
        label: 'Hardware Output'
      },
      'HardwareInputType': {
        icon: 'input',
        color: '#4caf50',
        label: 'Hardware Input Type'
      },
      'HardwareOutputType': {
        icon: 'output',
        color: '#ff9800',
        label: 'Hardware Output Type'
      },
      'SimulatorEvent': {
        icon: 'laptop',
        color: '#e91e63',
        label: 'Simulator Event'
      }
    };

    return entityTypeMap[entityType] || {
      icon: 'search',
      color: '#757575',
      label: entityType
    };
  }

  /**
   * Convert SearchResult to legacy SearchResult format for compatibility
   */
  convertToLegacyFormat(searchResult: SearchResult): any {
    // Convert API URL to frontend route
    let frontendUrl = '';
    if (searchResult.actions && searchResult.actions.length > 0) {
      const primaryAction = searchResult.actions.find(action => action.name === 'View') || searchResult.actions[0];
      frontendUrl = this.convertApiUrlToFrontendRoute(primaryAction.url);
    }

    return {
      id: searchResult.id,
      name: searchResult.title,
      type: searchResult.entityType,
      description: searchResult.description,
      url: frontendUrl,
      relevanceScore: searchResult.relevanceScore,
      snippet: searchResult.snippet,
      manufacturer: searchResult.manufacturer
    };
  }

  /**
   * Convert API URL to frontend route
   */
  private convertApiUrlToFrontendRoute(apiUrl: string): string {
    if (apiUrl.includes('/api/hardware-inputs/')) {
      const id = apiUrl.split('/').pop();
      return `/manage/hardware-inputs/${id}`;
    }
    if (apiUrl.includes('/api/hardware-outputs/')) {
      const id = apiUrl.split('/').pop();
      return `/manage/hardware-outputs/${id}`;
    }
    if (apiUrl.includes('/api/hardware-panels/')) {
      const id = apiUrl.split('/').pop();
      return `/manage/hardware-panels/${id}`;
    }
    if (apiUrl.includes('/api/aircraft-models/')) {
      const id = apiUrl.split('/').pop();
      return `/manage/aircraft-models/${id}`;
    }
    if (apiUrl.includes('/api/hardware-boards/')) {
      const id = apiUrl.split('/').pop();
      return `/manage/hardware-boards/${id}`;
    }
    if (apiUrl.includes('/api/hardware-input-types/')) {
      const id = apiUrl.split('/').pop();
      return `/manage/hardware-input-types/${id}`;
    }
    if (apiUrl.includes('/api/hardware-output-types/')) {
      const id = apiUrl.split('/').pop();
      return `/manage/hardware-output-types/${id}`;
    }
    // Add more mappings as needed
    return apiUrl; // Return original URL if no mapping found
  }
}
