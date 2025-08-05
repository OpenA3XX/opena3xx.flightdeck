import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { NotificationService, Notification, NotificationFilters } from '../../services/notification.service';
import { DataTableConfig, TableColumnConfig, DataTableEvent } from 'src/app/shared/models/data-table.interface';
import { PageHeaderAction } from 'src/app/shared/components/ui/page-header/page-header.component';

@Component({
    selector: 'app-notification-center',
    templateUrl: './notification-center.component.html',
    styleUrls: ['./notification-center.component.scss'],
    standalone: false
})
export class NotificationCenterComponent implements OnInit, OnDestroy {
  tableConfig: DataTableConfig;
  loading = false;
  totalNotifications = 0;
  unreadCount = 0;
  headerActions: PageHeaderAction[] = [];

  private subscriptions = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeTableConfig();
    this.initializeHeaderActions();
    this.loadNotifications();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeTableConfig(): void {
    const columns: TableColumnConfig[] = [
      {
        key: 'severity',
        label: 'Severity',
        sortable: true,
        width: '60px',
        type: 'text'
      },
      {
        key: 'title',
        label: 'Title',
        sortable: true,
        width: '20%',
        type: 'text'
      },
      {
        key: 'service',
        label: 'Service',
        sortable: true,
        width: '15%',
        type: 'text'
      },
      {
        key: 'timestamp',
        label: 'Time',
        sortable: true,
        width: '20%',
        type: 'date'
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        width: '120px',
        type: 'status'
      },
      {
        key: 'actions',
        label: 'Actions',
        width: '250px',
        type: 'actions',
        actions: [
          {
            label: 'Mark Read',
            icon: 'done',
            color: 'primary',
            tooltip: 'Mark as read',
            action: (item) => this.markAsRead(item),
            disabled: (item) => item.isRead
          },
          {
            label: 'Delete',
            icon: 'delete',
            color: 'warn',
            tooltip: 'Delete notification',
            action: (item) => this.deleteNotification(item)
          }
        ]
      }
    ];

    this.tableConfig = {
      columns: columns,
      data: [],
      loading: this.loading,
      loadingMessage: 'Loading notifications...',
      emptyMessage: 'No notifications found',
      emptyIcon: 'notifications_off',
      searchPlaceholder: 'Search by title, message, or service...',
      searchEnabled: true,
      paginationEnabled: true,
      pageSizeOptions: [10, 25, 50, 100],
      sortEnabled: true,
      rowHover: true,
      elevation: 8
    };
  }

  private initializeHeaderActions() {
    this.headerActions = [
      {
        label: 'Mark All Read',
        icon: 'done_all',
        color: 'primary',
        disabled: () => this.unreadCount === 0,
        onClick: () => this.markAllAsRead()
      },
      {
        label: 'Clear All',
        icon: 'clear_all',
        color: 'warn',
        disabled: () => this.totalNotifications === 0,
        onClick: () => this.clearAllNotifications()
      }
    ];
  }

  private setupSubscriptions(): void {
    // Subscribe to filtered notifications
    this.subscriptions.add(
      this.notificationService.filteredNotifications$.subscribe(notifications => {
        this.tableConfig = {
          ...this.tableConfig,
          data: notifications,
          loading: false
        };
        this.totalNotifications = notifications.length;
      })
    );

    // Subscribe to unread count
    this.subscriptions.add(
      this.notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      })
    );
  }

  private loadNotifications(): void {
    this.loading = true;
    // The service handles the loading automatically through observables
    this.loading = false;
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

  markAsRead(notification: Notification): void {
    this.notificationService.markNotificationAsRead(notification.id);
    this.showSnackBar('Notification marked as read');
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
    this.showSnackBar('All notifications marked as read');
  }

  deleteNotification(notification: Notification): void {
    this.notificationService.deleteNotification(notification.id);
    this.showSnackBar('Notification deleted');
  }

  clearAllNotifications(): void {
    this.notificationService.clearAllNotifications();
    // Force update the app component's unread count
    const currentUnreadCount = this.notificationService.getUnreadCount();
    console.log('Notification center - current unread count after clearing:', currentUnreadCount);
    this.showSnackBar('All notifications cleared');
  }



  updateFilters(filters: Partial<NotificationFilters>): void {
    this.notificationService.updateFilters(filters);
  }

  clearFilters(): void {
    this.notificationService.clearFilters();
  }

  getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'check_circle';
      case 'info':
      default:
        return 'info';
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'info':
      default:
        return 'primary';
    }
  }

  getServiceIcon(service?: string): string {
    if (!service) return 'help';

    const serviceLower = service.toLowerCase();
    if (serviceLower.includes('msfs') || serviceLower.includes('flight')) {
      return 'flight';
    }
    if (serviceLower.includes('rabbitmq')) {
      return 'compare_arrows';
    }
    if (serviceLower.includes('seq')) {
      return 'list_alt';
    }
    if (serviceLower.includes('coordinator') || serviceLower.includes('api')) {
      return 'hub';
    }
    return 'settings';
  }

  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
