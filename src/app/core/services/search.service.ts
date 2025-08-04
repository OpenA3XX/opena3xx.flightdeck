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
  fromDate?: string;
  toDate?: string;
  manufacturer?: string;
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
  metadata: Record<string, any>;
  actions: SearchResultAction[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchResultAction {
  name: string;
  url: string;
  method: string;
  requiresConfirmation: boolean;
}

export interface SearchFacets {
  entityTypes: Record<string, number>;
  manufacturers: Record<string, number>;
  hardwareTypes: Record<string, number>;
  simulatorSdkTypes: Record<string, number>;
  dateRanges: Record<string, number>;
}

export interface SearchSuggestion {
  text: string;
  type: string;
  score: number;
}

export interface EntityType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface SearchStatistics {
  totalSearches: number;
  averageQueryLength: number;
  mostSearchedTerms: string[];
  searchSuccessRate: number;
  averageResponseTime: number;
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
    if (filters.fromDate) {
      params.set('fromDate', filters.fromDate);
    }
    if (filters.toDate) {
      params.set('toDate', filters.toDate);
    }
    if (filters.manufacturer) {
      params.set('manufacturer', filters.manufacturer);
    }
    if (filters.sortBy) {
      params.set('sortBy', filters.sortBy);
    }

    return this.http.get<SearchResponse>(`${this.BASE_URL}/api/search`, { params }).pipe(
      catchError(error => {
        console.warn('Search API not available, returning fallback response:', error);
        // Return fallback response when API is not available
        return of({
          query,
          totalResults: 0,
          page: 1,
          totalPages: 1,
          executionTimeMs: 0,
          isSuccess: true,
          results: [],
          facets: {
            entityTypes: {},
            manufacturers: {},
            hardwareTypes: {},
            simulatorSdkTypes: {},
            dateRanges: {}
          }
        });
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
        console.warn('Quick search API not available, returning fallback data:', error);
        // Return fallback data when API is not available
        return of([
          {
            id: '1',
            entityType: 'HardwarePanel',
            title: 'Hardware Panel 1',
            description: 'Main cockpit panel',
            manufacturer: 'OpenA3XX',
            relevanceScore: 0.95,
            snippet: 'Main cockpit panel for aircraft configuration',
            metadata: {},
            actions: [{ name: 'view', url: '/view/hardware-panel-details?id=1', method: 'GET', requiresConfirmation: false }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            entityType: 'HardwareOutputType',
            title: 'LED Generic Indicator',
            description: 'LED indicator component',
            manufacturer: 'OpenA3XX',
            relevanceScore: 0.87,
            snippet: 'LED indicator component for status display',
            metadata: {},
            actions: [{ name: 'view', url: '/manage/hardware-output-types', method: 'GET', requiresConfirmation: false }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            entityType: 'HardwareInputType',
            title: 'Button Switch',
            description: 'Push button switch',
            manufacturer: 'OpenA3XX',
            relevanceScore: 0.82,
            snippet: 'Push button switch for user input',
            metadata: {},
            actions: [{ name: 'view', url: '/manage/hardware-input-types', method: 'GET', requiresConfirmation: false }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ].filter(result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.entityType.toLowerCase().includes(query.toLowerCase()) ||
          (result.description && result.description.toLowerCase().includes(query.toLowerCase()))
        ));
      })
    );
  }

  /**
   * Search suggestions endpoint
   */
  getSuggestions(query: string, limit: number = 5): Observable<SearchSuggestion[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString());

    return this.http.get<SearchSuggestion[]>(`${this.BASE_URL}/api/search/suggestions`, { params }).pipe(
      catchError(error => {
        console.warn('Search suggestions API not available:', error);
        return of([]);
      })
    );
  }

  /**
   * Get available entity types
   */
  getEntityTypes(): Observable<EntityType[]> {
    return this.http.get<EntityType[]>(`${this.BASE_URL}/api/search/entity-types`).pipe(
      catchError(error => {
        console.warn('Entity types API not available, returning fallback data:', error);
        return of([
          { id: 'AircraftModel', name: 'Aircraft Models', description: 'Aircraft model definitions', icon: 'airplanemode_active' },
          { id: 'HardwarePanel', name: 'Hardware Panels', description: 'Hardware panel configurations', icon: 'dashboard' },
          { id: 'HardwareBoard', name: 'Hardware Boards', description: 'Hardware board definitions', icon: 'memory' },
          { id: 'HardwareInput', name: 'Hardware Inputs', description: 'Hardware input devices', icon: 'login' },
          { id: 'HardwareOutput', name: 'Hardware Outputs', description: 'Hardware output devices', icon: 'logout' },
          { id: 'HardwareInputType', name: 'Hardware Input Types', description: 'Hardware input type definitions', icon: 'input' },
          { id: 'HardwareOutputType', name: 'Hardware Output Types', description: 'Hardware output type definitions', icon: 'output' },
          { id: 'SimulatorEvent', name: 'Simulator Events', description: 'Simulator event definitions', icon: 'laptop' }
        ]);
      })
    );
  }

  /**
   * Get search statistics
   */
  getSearchStatistics(): Observable<SearchStatistics> {
    return this.http.get<SearchStatistics>(`${this.BASE_URL}/api/search/statistics`).pipe(
      catchError(error => {
        console.warn('Search statistics API not available:', error);
        return of({
          totalSearches: 0,
          averageQueryLength: 0,
          mostSearchedTerms: [],
          searchSuccessRate: 0,
          averageResponseTime: 0
        });
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
