import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, Subject, BehaviorSubject, combineLatest, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, map, startWith, catchError } from 'rxjs/operators';
import { SearchService, SearchResponse, SearchFilters, SearchResult, EntityType } from '../../core/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSliderModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule
  ],
  providers: [SearchService]
})
export class SearchComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  searchResults$: Observable<SearchResponse | null>;
  entityTypes$: Observable<EntityType[]>;
  currentPage = 0;
  pageSize = 20;
  totalResults = 0;
  errorMessage: string | null = null;

  // Facets
  facets$ = new BehaviorSubject<any>(null);

  private destroy$ = new Subject<void>();
  private searchTrigger$ = new BehaviorSubject<{ query: string; filters: SearchFilters }>({
    query: '',
    filters: {}
  });

  constructor(
    private searchService: SearchService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      entityTypes: [[]],
      minScore: [0.1],
      includeInactive: [false],
      sortBy: ['relevance']
    });

    this.entityTypes$ = this.searchService.getEntityTypes();
  }

  ngOnInit(): void {
    this.setupSearchSubscription();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchSubscription(): void {
    this.searchResults$ = this.searchTrigger$.pipe(
      switchMap(({ query, filters }) => {
        if (!query || query.trim().length === 0) {
          return of(null);
        }

        this.errorMessage = null;

        return this.searchService.search(query, filters).pipe(
          map(response => {
            this.totalResults = response.totalResults;
            return response;
          }),
          catchError(error => {
            this.errorMessage = error.message || 'Something went wrong. Please try again.';
            console.error('Search error:', error);
            return of(null);
          })
        );
      }),
      takeUntil(this.destroy$)
    );
  }

  private setupFormSubscriptions(): void {
    // Watch for form changes and trigger search
    combineLatest([
      this.searchForm.get('query')!.valueChanges.pipe(startWith('')),
      this.searchForm.get('entityTypes')!.valueChanges.pipe(startWith([])),
      this.searchForm.get('minScore')!.valueChanges.pipe(startWith(0.1)),
      this.searchForm.get('includeInactive')!.valueChanges.pipe(startWith(false)),
      this.searchForm.get('sortBy')!.valueChanges.pipe(startWith('relevance'))
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([query, entityTypes, minScore, includeInactive, sortBy]) => {
      const filters: SearchFilters = {
        type: entityTypes.length > 0 ? entityTypes.join(',') : undefined,
        limit: this.pageSize,
        offset: this.currentPage * this.pageSize,
        minScore,
        includeInactive,
        sortBy: sortBy as any,
        includeFacets: true
      };

      this.searchTrigger$.next({ query, filters });
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.triggerSearch();
  }

  private triggerSearch(): void {
    const formValue = this.searchForm.value;
    const filters: SearchFilters = {
      type: formValue.entityTypes?.length > 0 ? formValue.entityTypes.join(',') : undefined,
      limit: this.pageSize,
      offset: this.currentPage * this.pageSize,
      minScore: formValue.minScore,
      includeInactive: formValue.includeInactive,
      sortBy: formValue.sortBy,
      includeFacets: true
    };

    this.searchTrigger$.next({ query: formValue.query, filters });
  }

  onResultClick(result: SearchResult): void {
    if (result.actions && result.actions.length > 0) {
      const primaryAction = result.actions.find(action => action.name === 'view') || result.actions[0];
      const frontendUrl = this.convertApiUrlToFrontendRoute(primaryAction.url);
      this.router.navigateByUrl(frontendUrl);
    }
  }

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

  getEntityTypeInfo(entityType: string) {
    return this.searchService.getEntityTypeInfo(entityType);
  }

  clearFilters(): void {
    this.searchForm.patchValue({
      entityTypes: [],
      minScore: 0.1,
      includeInactive: false,
      sortBy: 'relevance'
    });
  }


}
