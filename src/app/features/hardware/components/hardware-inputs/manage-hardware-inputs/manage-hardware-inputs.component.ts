import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareInputDto, HardwareInputTypeDto, HardwarePanelOverviewDto } from 'src/app/shared/models/models';
import { AddHardwareInputSelectorDialogComponent } from '../add-hardware-input-selector-dialog/add-hardware-input-selector-dialog.component';
import { DeleteHardwareInputSelectorDialogComponent } from '../delete-hardware-input-selector-dialog/delete-hardware-input-selector-dialog.component';
import { PageHeaderAction } from 'src/app/shared/components/ui/page-header/page-header.component';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'opena3xx-manage-hardware-inputs',
  templateUrl: './manage-hardware-inputs.component.html',
  styleUrls: ['./manage-hardware-inputs.component.scss'],
  standalone: false
})
export class ManageHardwareInputsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'hardwareInputType', 'hardwarePanelId', 'selectorsCount', 'actions'];
  dataSource = new MatTableDataSource<HardwareInputDto>();
  hardwarePanels: HardwarePanelOverviewDto[] = [];
  hardwareInputTypes: HardwareInputTypeDto[] = [];
  filterForm: FormGroup;
  loading = false;
  headerActions: PageHeaderAction[] = [];

  // Theme support
  isDarkMode: boolean = false;
  private themeSubscription: Subscription = new Subscription();

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private themeService: ThemeService
  ) {
    this.initializeFilterForm();
    this.initializeHeaderActions();
  }

  ngOnInit(): void {
    this.loadHardwarePanels();
    this.loadHardwareInputTypes();
    this.setupFilterListeners();
    this.loadData();

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  private initializeFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      panelId: [''],
      hardwareInputType: ['']
    });
  }

  private initializeHeaderActions(): void {
    this.headerActions = [
      {
        label: 'Refresh',
        icon: 'refresh',
        color: 'primary',
        onClick: () => this.loadData()
      }
    ];
  }

  private async loadHardwarePanels(): Promise<void> {
    try {
      const panels = await this.dataService.getAllHardwarePanelOverviewDetails().toPromise();
      this.hardwarePanels = panels as HardwarePanelOverviewDto[];
    } catch (error) {
      console.error('Error loading hardware panels:', error);
    }
  }

  private async loadHardwareInputTypes(): Promise<void> {
    try {
      const types = await this.dataService.getAllHardwareInputTypes().toPromise();
      this.hardwareInputTypes = types as HardwareInputTypeDto[];
    } catch (error) {
      console.error('Error loading hardware input types:', error);
    }
  }

  async loadData(): Promise<void> {
    try {
      this.loading = true;
      const filterValues = this.filterForm.value;
      const panelId = filterValues.panelId;
      const inputType = filterValues.hardwareInputType;

      console.log('Loading data with filters:', { panelId, inputType });

      // Get all inputs first
      let inputs = await this.dataService.getAllHardwareInputs(panelId).toPromise() as HardwareInputDto[];
      console.log('Raw inputs loaded:', inputs.length);

      // Apply client-side filtering for hardware input type
      if (inputType && inputType !== '') {
        inputs = inputs.filter(input => input.hardwareInputType === inputType);
        console.log('After input type filtering:', inputs.length);
      }

      this.dataSource.data = inputs;
      this.dataSource.sort = this.sort;
      console.log('Data source updated with', inputs.length, 'items');
    } catch (error) {
      console.error('Error loading hardware inputs:', error);
    } finally {
      this.loading = false;
    }
  }

  private setupFilterListeners(): void {
    // Listen to panel ID changes with debouncing
    this.filterForm.get('panelId')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value) => {
      console.log('Panel filter changed to:', value);
      this.loadData();
    });

    // Listen to hardware input type changes with debouncing
    this.filterForm.get('hardwareInputType')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value) => {
      console.log('Input type filter changed to:', value);
      this.loadData();
    });
  }

  onFilterChange(): void {
    this.loadData();
  }

  onAddSelector(hardwareInput: HardwareInputDto): void {
    const dialogRef = this.dialog.open(AddHardwareInputSelectorDialogComponent, {
      width: '500px',
      data: { hardwareInput }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'added') {
        this.loadData();
      }
    });
  }

  onDeleteSelector(hardwareInput: HardwareInputDto, selector: any): void {
    const dialogRef = this.dialog.open(DeleteHardwareInputSelectorDialogComponent, {
      width: '400px',
      data: { hardwareInput, selector }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'deleted') {
        this.loadData();
      }
    });
  }

  getPanelName(panelId: number): string {
    const panel = this.hardwarePanels.find(p => p.id === panelId);
    return panel ? panel.name : `Panel ${panelId}`;
  }

  getSelectorsCount(hardwareInput: HardwareInputDto): number {
    return hardwareInput.hardwareInputSelectors?.length || 0;
  }
}
