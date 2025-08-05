import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, Subject, of, catchError, map } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, filter } from 'rxjs/operators';
import { SearchService, SearchResult, SearchFilters } from '../../../../core/services/search.service';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';

export interface LegacySearchResult {
  id: number;
  name: string;
  type: string;
  description?: string;
  url?: string;
  relevanceScore?: number;
  snippet?: string;
  manufacturer?: string;
}

@Component({
  selector: 'app-universal-search',
  templateUrl: './universal-search.component.html',
  styleUrls: ['./universal-search.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ClickOutsideDirective
  ]
})
export class UniversalSearchComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

  searchControl = new FormControl('');
  filteredResults$: Observable<LegacySearchResult[]> = of([]);
  searchResults: LegacySearchResult[] = [];
  errorMessage: string | null = null;
  searchFilters: SearchFilters = {
    limit: 10,
    minScore: 0.1,
    includeInactive: false
  };

  // Custom dropdown state
  selectedIndex = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupSearchSubscription();
  }

  ngAfterViewInit(): void {
    // Ensure ViewChild is properly initialized
    if (this.searchInput) {
      // ViewChild is ready
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Cmd+K or Ctrl+K to focus search
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.focusSearchInput();
    }
  }

  private setupSearchSubscription(): void {
    this.filteredResults$ = this.searchControl.valueChanges.pipe(
      debounceTime(50),
      distinctUntilChanged(),
      filter((value): value is string => typeof value === 'string' && value.length >= 2),
      switchMap(value => {
        this.errorMessage = null;
        console.log('Searching for:', value);
        return this.performSearch(value).pipe(
          map(results => {
            console.log('Search results:', results);
            this.selectedIndex = 0; // Reset selection
            return results;
          }),
          catchError(error => {
            console.error('Search error:', error);
            this.errorMessage = error.message || 'Something went wrong. Please try again.';
            return of([]);
          })
        );
      }),
      takeUntil(this.destroy$)
    );
  }

  private performSearch(query: string): Observable<LegacySearchResult[]> {
    return this.searchService.quickSearch(query, this.searchFilters.limit || 10).pipe(
      map(searchResults => {
        // Ensure searchResults is an array before mapping
        if (!Array.isArray(searchResults)) {
          console.warn('Search service returned non-array result:', searchResults);
          return [];
        }
        return searchResults.map(result => this.searchService.convertToLegacyFormat(result));
      }),
      catchError(error => {
        console.error('Search error:', error);
        throw error; // Re-throw to be handled by the calling method
      })
    );
  }

  private focusSearchInput(): void {
    if (this.searchInput && this.searchInput.nativeElement) {
      this.searchInput.nativeElement.focus();
    } else {
      // Retry after a short delay if not ready
      setTimeout(() => {
        this.focusSearchInput();
      }, 50);
    }
  }

  clearSearchInput(): void {
    this.searchControl.setValue('');
    this.selectedIndex = 0;
  }

  hideDropdown(): void {
    // Clear the input when clicking outside to hide the dropdown
    this.clearSearchInput();
  }

  // Custom dropdown navigation
  navigateResults(direction: number): void {
    this.filteredResults$.subscribe(results => {
      if (results.length === 0) return;

      this.selectedIndex = Math.max(0, Math.min(results.length - 1, this.selectedIndex + direction));
    });
  }

  selectCurrentResult(): void {
    this.filteredResults$.subscribe(results => {
      if (results.length > 0 && this.selectedIndex >= 0 && this.selectedIndex < results.length) {
        this.selectResult(results[this.selectedIndex]);
      }
    });
  }

  selectResult(result: LegacySearchResult): void {
    if (result.url) {
      // Navigate to the selected item using Angular Router
      this.router.navigateByUrl(result.url);
    }
    this.clearSearchInput();
  }

  onInputBlur(): void {
    // Small delay to allow for clicks on results
    setTimeout(() => {
      // The dropdown will automatically hide when there are no results
      // No need to manually control visibility
    }, 200);
  }

  getDisplayValue(result: LegacySearchResult): string {
    return result ? result.name : '';
  }

  getTypeIcon(type: string): string {
    const entityTypeInfo = this.searchService.getEntityTypeInfo(type);
    return entityTypeInfo.icon;
  }

  getTypeColor(type: string): string {
    const entityTypeInfo = this.searchService.getEntityTypeInfo(type);
    return entityTypeInfo.color;
  }

  getTypeLabel(type: string): string {
    const entityTypeInfo = this.searchService.getEntityTypeInfo(type);
    return entityTypeInfo.label;
  }
}
