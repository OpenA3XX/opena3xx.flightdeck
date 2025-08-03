import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareOutputDto, HardwareOutputTypeDto, HardwarePanelOverviewDto } from 'src/app/shared/models/models';
import { AddHardwareOutputSelectorDialogComponent } from '../../hardware-output-selectors/add-hardware-output-selector-dialog/add-hardware-output-selector-dialog.component';
import { DeleteHardwareOutputSelectorDialogComponent } from '../../hardware-output-selectors/delete-hardware-output-selector-dialog/delete-hardware-output-selector-dialog.component';
import { DeleteHardwareOutputDialogComponent } from '../delete-hardware-output-dialog/delete-hardware-output-dialog.component';
import { PageHeaderAction } from 'src/app/shared/components/ui/page-header/page-header.component';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'opena3xx-manage-hardware-outputs',
  templateUrl: './manage-hardware-outputs.component.html',
  styleUrls: ['./manage-hardware-outputs.component.scss'],
  standalone: false
})
export class ManageHardwareOutputsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'hardwareOutputType', 'hardwarePanelId', 'selectorsCount', 'actions'];
  dataSource = new MatTableDataSource<HardwareOutputDto>();
  hardwarePanels: HardwarePanelOverviewDto[] = [];
  hardwareOutputTypes: HardwareOutputTypeDto[] = [];
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
    this.loadHardwareOutputTypes();
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
      hardwareOutputType: ['']
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

  private async loadHardwareOutputTypes(): Promise<void> {
    try {
      const types = await this.dataService.getAllHardwareOutputTypes().toPromise();
      this.hardwareOutputTypes = types as HardwareOutputTypeDto[];
    } catch (error) {
      console.error('Error loading hardware output types:', error);
    }
  }

  async loadData(): Promise<void> {
    try {
      this.loading = true;
      const filterValues = this.filterForm.value;
      const panelId = filterValues.panelId;
      const outputType = filterValues.hardwareOutputType;

      console.log('Loading data with filters:', { panelId, outputType });

      // Get all outputs first
      let outputs = await this.dataService.getAllHardwareOutputs(panelId).toPromise() as HardwareOutputDto[];
      console.log('Raw outputs loaded:', outputs.length);

      // Apply client-side filtering for hardware output type
      if (outputType && outputType !== '') {
        outputs = outputs.filter(output => output.hardwareOutputType === outputType);
        console.log('After output type filtering:', outputs.length);
      }

      this.dataSource.data = outputs;
      this.dataSource.sort = this.sort;
      console.log('Data source updated with', outputs.length, 'items');
    } catch (error) {
      console.error('Error loading hardware outputs:', error);
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

    // Listen to hardware output type changes with debouncing
    this.filterForm.get('hardwareOutputType')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value) => {
      console.log('Output type filter changed to:', value);
      this.loadData();
    });
  }

  onFilterChange(): void {
    this.loadData();
  }

  onAddSelector(hardwareOutput: HardwareOutputDto): void {
    const dialogRef = this.dialog.open(AddHardwareOutputSelectorDialogComponent, {
      width: '500px',
      data: { hardwareOutput }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'added') {
        this.loadData();
      }
    });
  }

  onDeleteSelector(hardwareOutput: HardwareOutputDto, selector: any): void {
    const dialogRef = this.dialog.open(DeleteHardwareOutputSelectorDialogComponent, {
      width: '400px',
      data: { hardwareOutput, selector }
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

  getSelectorsCount(hardwareOutput: HardwareOutputDto): number {
    return hardwareOutput.hardwareOutputSelectors?.length || 0;
  }

  onDeleteHardwareOutput(hardwareOutput: HardwareOutputDto): void {
    const dialogRef = this.dialog.open(DeleteHardwareOutputDialogComponent, {
      width: '500px',
      data: { hardwareOutput }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'deleted') {
        this.loadData();
      }
    });
  }
}
