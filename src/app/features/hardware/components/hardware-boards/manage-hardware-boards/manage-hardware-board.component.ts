import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { HardwareBoardDto } from 'src/app/shared/models/models';
import { DataService } from 'src/app/core/services/data.service';
import { DataTableConfig, TableColumnConfig, DataTableEvent } from 'src/app/shared/models/data-table.interface';
import { PageHeaderAction } from 'src/app/shared/components/ui/page-header/page-header.component';
import { RegisterHardwareBoardDialogComponent } from '../register-hardware-board-dialog/register-hardware-board-dialog.component';
import { EditHardwareBoardDialogComponent } from '../edit-hardware-board-dialog/edit-hardware-board-dialog.component';
import { DeleteHardwareBoardDialogComponent } from '../delete-hardware-board-dialog/delete-hardware-board-dialog.component';

@Component({
    templateUrl: './manage-hardware-board.component.html',
    styleUrls: ['./manage-hardware-board.component.scss'],
    selector: 'opena3xx-manage-hardware-boards',
    standalone: false
})
export class ManageHardwareBoardsComponent implements OnInit {
  tableConfig: DataTableConfig;
  data_loaded: boolean = false;
  headerActions: PageHeaderAction[] = [];

  constructor(
    private router: Router,
    private dataService: DataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeTableConfig();
    this.initializeHeaderActions();
    this.loadData();
  }

  private initializeTableConfig(): void {
    const columns: TableColumnConfig[] = [
      {
        key: 'id',
        label: 'ID',
        sortable: true,
        width: '60px',
        type: 'number'
      },
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        width: '25%',
        type: 'text'
      },
      {
        key: 'hardwareBusExtendersCount',
        label: 'Total Hardware Bus Extenders',
        sortable: true,
        width: '15%',
        type: 'number'
      },
      {
        key: 'totalInputOutputs',
        label: 'Total I/O(s)',
        sortable: true,
        width: '10%',
        type: 'number'
      },
      {
        key: 'actions',
        label: 'Actions',
        width: '400px',
        type: 'actions',
        actions: [
          {
            label: 'View Details',
            icon: 'visibility',
            color: 'primary',
            tooltip: 'View Details',
            action: (item) => this.onViewDetailsClick(item.id)
          },
          {
            label: 'Edit',
            icon: 'edit',
            color: 'primary',
            tooltip: 'Edit',
            action: (item) => this.onEditHardwareBoard(item)
          },
          {
            label: 'Delete',
            icon: 'delete',
            color: 'warn',
            tooltip: 'Delete',
            action: (item) => this.onDeleteHardwareBoard(item)
          }
        ]
      }
    ];

    this.tableConfig = {
      columns: columns,
      data: [],
      loading: !this.data_loaded,
      loadingMessage: 'Loading hardware boards...',
      emptyMessage: 'No hardware boards found',
      emptyIcon: 'developer_board_off',
      emptyAction: {
        label: 'Register First Hardware Board',
        action: () => this.registerHardwareBoard()
      },
      searchPlaceholder: 'Search by name...',
      searchEnabled: true,
      paginationEnabled: true,
      pageSizeOptions: [5, 10, 25, 100],
      sortEnabled: true,
      rowHover: true,
      elevation: 8
    };
  }

  private loadData() {
    this.data_loaded = false;
    this.tableConfig = { ...this.tableConfig, loading: true };

    firstValueFrom(this.dataService.getAllHardwareBoards())
      .then((data) => {
        this.tableConfig = {
          ...this.tableConfig,
          data: data as HardwareBoardDto[],
          loading: false
        };
        this.data_loaded = true;
      });
  }

  private initializeHeaderActions() {
    this.headerActions = [
      {
        label: 'Register Hardware Board',
        icon: 'add',
        color: 'primary',
        onClick: () => this.registerHardwareBoard()
      }
    ];
  }

  onViewDetailsClick(id: number) {
    // TODO: Implement view details functionality
    console.log('View details for hardware board:', id);
  }

  registerHardwareBoard() {
    const dialogRef = this.dialog.open(RegisterHardwareBoardDialogComponent, {
      width: '600px',
      disableClose: false,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'added') {
        // Refresh the data after successful addition
        this.loadData();
      }
    });
  }

  onEditHardwareBoard(hardwareBoard: HardwareBoardDto) {
    const dialogRef = this.dialog.open(EditHardwareBoardDialogComponent, {
      width: '500px',
      disableClose: false,
      data: { hardwareBoard }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'updated') {
        this.loadData();
      }
    });
  }

  onDeleteHardwareBoard(hardwareBoard: HardwareBoardDto) {
    const dialogRef = this.dialog.open(DeleteHardwareBoardDialogComponent, {
      width: '500px',
      disableClose: false,
      data: { hardwareBoard }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'deleted') {
        this.loadData();
      }
    });
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
