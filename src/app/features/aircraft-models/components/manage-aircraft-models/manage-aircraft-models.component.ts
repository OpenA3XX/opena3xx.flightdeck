import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AircraftModelDto } from 'src/app/shared/models/models';
import { AircraftModelService } from '../../services/aircraft-model.service';
import { ViewAircraftModelDialogComponent } from '../view-aircraft-model-dialog/view-aircraft-model-dialog.component';
import { EditAircraftModelDialogComponent } from '../edit-aircraft-model-dialog/edit-aircraft-model-dialog.component';
import { AddAircraftModelDialogComponent } from '../add-aircraft-model-dialog/add-aircraft-model-dialog.component';
import { DeleteAircraftModelDialogComponent } from '../delete-aircraft-model-dialog/delete-aircraft-model-dialog.component';
import { DataTableConfig, TableColumnConfig, TableAction, DataTableEvent } from 'src/app/shared/models/data-table.interface';
import { PageHeaderAction } from 'src/app/shared/components/ui/page-header/page-header.component';

@Component({
    selector: 'opena3xx-manage-aircraft-models',
    templateUrl: './manage-aircraft-models.component.html',
    styleUrls: ['./manage-aircraft-models.component.scss'],
    standalone: false
})
export class ManageAircraftModelsComponent implements OnInit {
  tableConfig: DataTableConfig;
  loading = false;
  headerActions: PageHeaderAction[] = [];

  constructor(
    private aircraftModelService: AircraftModelService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeTableConfig();
    this.initializeHeaderActions();
    console.log('Initial tableConfig:', this.tableConfig);
    this.loadAircraftModels();
  }

  private initializeTableConfig(): void {
    const columns: TableColumnConfig[] = [
      {
        key: 'id',
        label: 'ID',
        sortable: true,
        width: '5%',
        type: 'number'
      },
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        width: '15%',
        maxWidth: '100px',
        type: 'text'
      },
      {
        key: 'manufacturer',
        label: 'Manufacturer',
        sortable: true,
        width: '15%',
        maxWidth: '100px',
        type: 'text'
      },
      {
        key: 'type',
        label: 'Type',
        sortable: true,
        width: '15%',
        maxWidth: '100px',
        type: 'text'
      },
      {
        key: 'isActive',
        label: 'Status',
        sortable: true,
        width: '5%',
        type: 'status'
      },
      {
        key: 'actions',
        label: 'Actions',
        width: '200px',
        type: 'actions',
        actions: [
          {
            label: 'View Details',
            icon: 'visibility',
            color: 'primary',
            tooltip: 'View Details',
            action: (item) => this.onViewAircraftModel(item.id)
          },
          {
            label: 'Edit',
            icon: 'edit',
            color: 'accent',
            tooltip: 'Edit',
            action: (item) => this.onEditAircraftModel(item.id)
          },
          {
            label: 'Delete',
            icon: 'delete',
            color: 'warn',
            tooltip: 'Delete',
            action: (item) => this.onDeleteAircraftModel(item.id)
          }
        ]
      }
    ];

    this.tableConfig = {
      columns: columns,
      data: [],
      loading: this.loading,
      loadingMessage: 'Loading aircraft models...',
      emptyMessage: 'No aircraft models found',
      emptyIcon: 'flight_off',
      emptyAction: {
        label: 'Add First Aircraft Model',
        action: () => this.onAddAircraftModel()
      },
      searchPlaceholder: 'Search by name, manufacturer, or type...',
      searchEnabled: true,
      paginationEnabled: true,
      pageSizeOptions: [5, 10, 25, 100],
      sortEnabled: true,
      rowHover: true,
      elevation: 8
    };
  }

  private initializeHeaderActions() {
    this.headerActions = [
      {
        label: 'Add Aircraft Model',
        icon: 'add',
        color: 'primary',
        onClick: () => this.onAddAircraftModel()
      }
    ];
  }

  loadAircraftModels(): void {
    this.loading = true;
    this.tableConfig = { ...this.tableConfig, loading: true };

    this.aircraftModelService.getAllAircraftModels().subscribe({
      next: (aircraftModels) => {
        console.log('Loaded aircraft models:', aircraftModels);
        this.tableConfig = {
          ...this.tableConfig,
          data: aircraftModels,
          loading: false
        };
        console.log('Updated tableConfig:', this.tableConfig);
        this.loading = false;
        this.snackBar.open('Aircraft models loaded successfully', 'Close', {
          duration: 2000
        });
      },
      error: (error) => {
        console.error('Error loading aircraft models:', error);
        this.tableConfig = { ...this.tableConfig, loading: false };
        this.loading = false;
        this.snackBar.open('Error loading aircraft models', 'Close', {
          duration: 3000
        });
      }
    });
  }



  onAddAircraftModel(): void {
    try {
      console.log('Opening add aircraft model dialog');
      const dialogRef = this.dialog.open(AddAircraftModelDialogComponent, {
        width: '600px',
        maxHeight: '80vh',
        disableClose: false
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.action === 'added') {
          this.loadAircraftModels();
          this.snackBar.open('Aircraft model added successfully', 'Close', {
            duration: 2000
          });
        }
      });
    } catch (error) {
      console.error('Error opening add aircraft model dialog:', error);
      this.snackBar.open('Error opening aircraft model form', 'Close', {
        duration: 3000
      });
    }
  }

  onEditAircraftModel(id: number): void {
    try {
      console.log('Opening edit dialog for aircraft model ID:', id);
      const dialogRef = this.dialog.open(EditAircraftModelDialogComponent, {
        data: { id: id },
        width: '600px',
        maxHeight: '80vh',
        disableClose: false
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.action === 'updated') {
          this.loadAircraftModels();
          this.snackBar.open('Aircraft model updated successfully', 'Close', {
            duration: 2000
          });
        }
      });
    } catch (error) {
      console.error('Error opening edit dialog:', error);
      this.snackBar.open('Error opening aircraft model editor', 'Close', {
        duration: 3000
      });
    }
  }

  onViewAircraftModel(id: number): void {
    try {
      console.log('Opening view dialog for aircraft model ID:', id);
      const dialogRef = this.dialog.open(ViewAircraftModelDialogComponent, {
        data: { id: id },
        width: '600px',
        maxHeight: '80vh',
        disableClose: false
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (result.action === 'edit') {
            this.onEditAircraftModel(result.id);
          } else if (result.action === 'delete') {
            this.onDeleteAircraftModel(result.id);
          }
        }
      });
    } catch (error) {
      console.error('Error opening view dialog:', error);
      this.snackBar.open('Error opening aircraft model details', 'Close', {
        duration: 3000
      });
    }
  }

  onDeleteAircraftModel(id: number): void {
    try {
      // Find the aircraft model to get its name for the dialog
      const aircraftModel = this.tableConfig.data.find(model => model.id === id);
      if (!aircraftModel) {
        this.snackBar.open('Aircraft model not found', 'Close', {
          duration: 3000
        });
        return;
      }

      console.log('Opening delete dialog for aircraft model:', aircraftModel);
      const dialogRef = this.dialog.open(DeleteAircraftModelDialogComponent, {
        width: '500px',
        disableClose: false,
        data: {
          aircraftModel: aircraftModel
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          // User confirmed deletion
          this.aircraftModelService.deleteAircraftModel(id).subscribe({
            next: () => {
              this.snackBar.open('Aircraft model deleted successfully', 'Close', {
                duration: 2000
              });
              this.loadAircraftModels(); // Reload the data
            },
            error: (error) => {
              console.error('Error deleting aircraft model:', error);
              this.snackBar.open('Error deleting aircraft model', 'Close', {
                duration: 3000
              });
            }
          });
        }
      });
    } catch (error) {
      console.error('Error opening delete dialog:', error);
      this.snackBar.open('Error opening delete confirmation', 'Close', {
        duration: 3000
      });
    }
  }

  getStatusIcon(isActive: boolean): string {
    return isActive ? 'check_circle' : 'cancel';
  }

  getStatusColor(isActive: boolean): string {
    return isActive ? 'success' : 'warn';
  }

  onTableEvent(event: DataTableEvent): void {
    console.log('Table event:', event);

    switch (event.type) {
      case 'action':
        console.log('Action clicked:', event.action?.label, 'for item:', event.data);
        break;
      case 'rowClick':
        console.log('Row clicked:', event.data);
        break;
      case 'search':
        console.log('Search performed:', event.data);
        break;
      case 'pageChange':
        console.log('Page changed:', event.data);
        break;
      case 'sortChange':
        console.log('Sort changed:', event.data);
        break;
    }
  }
}
