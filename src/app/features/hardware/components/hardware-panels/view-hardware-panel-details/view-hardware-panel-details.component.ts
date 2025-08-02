import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, HostBinding } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { LinkHardwareInputSelectorsDialogComponent } from '../../hardware-input-selectors/link-hardware-input-selectors-dialog/link-hardware-input-selectors-dialog.component';
import { MapHardwareInputSelectorsDialogComponent } from '../../hardware-input-selectors/map-hardware-input-selectors-dialog/map-hardware-input-selectors-dialog.component';
import { MapHardwareOutputSelectorsDialogComponent } from '../../hardware-output-selectors/map-hardware-output-selectors-dialog/map-hardware-output-selectors-dialog.component';
import { ViewHardwareInputSelectorsDialogComponent } from '../../hardware-input-selectors/view-hardware-input-selectors-dialog/view-hardware-input-selectors-dialog.component';
import { ViewHardwareOutputSelectorsDialogComponent } from '../../hardware-output-selectors/view-hardware-output-selectors-dialog/view-hardware-output-selectors-dialog.component';
import { HardwareInputDto, HardwareOutputDto, HardwarePanelDto } from 'src/app/shared/models/models';
import { DataService } from 'src/app/core/services/data.service';
import { DeleteHardwareInputDialogComponent } from '../../hardware-input-selectors/delete-hardware-input-dialog/delete-hardware-input-dialog.component';
import { PageHeaderAction } from 'src/app/shared/components/ui/page-header/page-header.component';
import { ThemeService } from 'src/app/core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'opena3xx-view-hardware-panel-details',
    templateUrl: './view-hardware-panel-details.component.html',
    styleUrls: ['./view-hardware-panel-details.component.scss'],
    standalone: false
})
export class ViewHardwarePanelDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  idParam!: number;
  public hardwarePanelDto: HardwarePanelDto;
  public displayedInputColumns: string[] = ['id', 'name', 'hardwareInputType', 'action'];
  public displayedOutputColumns: string[] = ['id', 'name', 'hardwareOutputType', 'action'];
  inputsDataSource = new MatTableDataSource<HardwareInputDto>();
  outputsDataSource = new MatTableDataSource<HardwareOutputDto>();

  showHardwareInputs: boolean = false;
  showHardwareOutputs: boolean = false;
  headerActions: PageHeaderAction[] = [];

  // Theme support
  isDarkMode: boolean = false;
  private themeSubscription: Subscription = new Subscription();

  @ViewChild('inputSort') inputSort: MatSort;
  @ViewChild('outputSort') outputSort: MatSort;

  @HostBinding('class.dark-theme') get darkThemeClass() {
    return this.isDarkMode;
  }

  constructor(
    private dataService: DataService,
    private router: Router,
    public viewHardwareInputOutputSelectorsDialog: MatDialog,
    public dialog: MatDialog,
    private themeService: ThemeService
  ) {}

  ngOnDestroy(): void {
    // Clean up ViewChild references
    if (this.inputsDataSource) {
      this.inputsDataSource.disconnect();
    }
    if (this.outputsDataSource) {
      this.outputsDataSource.disconnect();
    }

    // Clean up theme subscription
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.router.routerState.root.queryParams.subscribe((params) => {
      console.log('Received Query Params', params);
      this.idParam = params['id'];
    });
    this.initializeHeaderActions();
    this.fetchData();

    // Subscribe to theme changes
    if (this.themeService) {
      this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
        this.isDarkMode = isDark;
      });
    }
  }

  private initializeHeaderActions(): void {
    this.headerActions = [
      {
        label: 'Add Hardware Input',
        icon: 'add',
        color: 'primary',
        onClick: () => {
          // TODO: Implement add hardware input functionality
          console.log('Add Hardware Input clicked');
        }
      },
      {
        label: 'Add Hardware Output',
        icon: 'add',
        color: 'primary',
        onClick: () => {
          // TODO: Implement add hardware output functionality
          console.log('Add Hardware Output clicked');
        }
      },
      {
        label: 'Edit Hardware Panel Details',
        icon: 'edit',
        color: 'accent',
        onClick: () => this.onEditHardwareDetails()
      }
    ];
  }

  ngAfterViewInit() {
    this.connectSortToDataSources();
  }

  private connectSortToDataSources() {
    if (this.inputSort && this.inputsDataSource) {
      this.inputsDataSource.sort = this.inputSort;
    }
    if (this.outputSort && this.outputsDataSource) {
      this.outputsDataSource.sort = this.outputSort;
    }
  }

  fetchData() {
    this.dataService
      .getAllHardwarePanelDetails(this.idParam)
      .pipe(
        filter((x) => !!x),
        map((data_received: HardwarePanelDto) => {
          this.hardwarePanelDto = data_received;
          this.inputsDataSource = new MatTableDataSource<HardwareInputDto>(
            this.hardwarePanelDto.hardwareInputs
          );
          this.outputsDataSource = new MatTableDataSource<HardwareOutputDto>(
            this.hardwarePanelDto.hardwareOutputs
          );

          // Connect sorting after data is loaded
          this.connectSortToDataSources();

          if (this.hardwarePanelDto.hardwareInputs.length > 0) {
            this.showHardwareInputs = true;
          }
          if (this.hardwarePanelDto.hardwareOutputs.length > 0) {
            this.showHardwareOutputs = true;
          }
        })
      )
      .subscribe();
    return;
  }

  onEditHardwareDetails() {
    this.router.navigateByUrl(`/edit/hardware-panel?id=${this.hardwarePanelDto.id}`);
  }

  showInputSelectorDetails(data: HardwareInputDto): void {
    this.viewHardwareInputOutputSelectorsDialog.open(ViewHardwareInputSelectorsDialogComponent, {
      data: data,
      width: '600px',
    });
  }

  mapInputSelector(data: HardwareInputDto): void {
    const dialogRef = this.viewHardwareInputOutputSelectorsDialog.open(
      MapHardwareInputSelectorsDialogComponent,
      {
        data: data,
        width: '900px',
      }
    );
    dialogRef.afterClosed().subscribe(() => {
      this.fetchData();
    });
  }

  linkInputSelector(data: HardwareInputDto) {
    const dialogRef = this.viewHardwareInputOutputSelectorsDialog.open(
      LinkHardwareInputSelectorsDialogComponent,
      {
        data: data,
        width: '900px',
      }
    );
    dialogRef.afterClosed().subscribe(() => {
      this.fetchData();
    });
  }

  showOutputSelectorDetails(data: HardwareInputDto) {
    this.viewHardwareInputOutputSelectorsDialog.open(ViewHardwareOutputSelectorsDialogComponent, {
      data: data,
      width: '600px',
    });
  }

  mapOutputSelector(data: HardwareInputDto) {
    this.viewHardwareInputOutputSelectorsDialog.open(MapHardwareOutputSelectorsDialogComponent, {
      data: data,
      width: '900px',
    });
  }

  linkOutputSelector(data: HardwareInputDto) {
    // TODO: Implement link output selector functionality
    console.log('Link Output Selector clicked for:', data);
    // This would typically open a dialog similar to linkInputSelector
  }

  deleteHardwareInput(hardwareInput: HardwareInputDto) {
    const dialogRef = this.dialog.open(DeleteHardwareInputDialogComponent);
    dialogRef.componentInstance.hardwareInput = hardwareInput;
  }
}
