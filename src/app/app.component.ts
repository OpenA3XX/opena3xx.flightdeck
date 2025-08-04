import { Component, OnInit, OnDestroy, Renderer2, Inject, ChangeDetectorRef, DOCUMENT } from '@angular/core';

import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from './core/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { CoreHelper } from './core/core-helper';
import { ExitAppDialogComponent } from './core/components/exit-app-dialog.component';
import { ThemeService } from './core/services/theme.service';
import { DependencyStatusService, DependencyStatusResponse, DependencyStatus } from './core/services/dependency-status.service';
import { NotificationService } from './features/notifications/services/notification.service';
import { AppStateService } from './core/services/app-state.service';
import { Subscription } from 'rxjs';
import { UniversalSearchComponent } from './shared/components/ui/universal-search/universal-search.component';

/**
 * @title Autosize sidenav
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy
{
  isElectron: boolean = false;
  isExpanded: boolean = true;
  isRightMenuExpanded: boolean = true;
  showSubmenu: boolean = false;
  isShowing: boolean = false;
  isRightMenuShowing: boolean = false;
  showSubSubMenu: boolean = false;
  isFullscreen: boolean = false;
  apiAvailabilityStatus: boolean = false;
  isDarkMode: boolean = false;
  dependencyStatus: DependencyStatusResponse | null = null;
  unreadNotificationCount = 0;
  private themeSubscription: Subscription = new Subscription();
  private dependencyStatusSubscription: Subscription = new Subscription();
  private notificationSubscription: Subscription = new Subscription();

  private apiHealthPollingTime: number = 5000;

  fullscreen() {
    const element = document.documentElement;
    if (!this.isFullscreen) {
      this.isFullscreen = true;
      element.requestFullscreen();
    } else {
      this.isFullscreen = false;
      document.exitFullscreen();
    }
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
    this.cookieService.set('opena3xx.sidemenu.left.visibility.state', this.isExpanded.toString());
  }

  toggleRight() {
    this.isRightMenuExpanded = !this.isRightMenuExpanded;
    this.cookieService.set(
      'opena3xx.sidemenu.right.visibility.state',
      this.isRightMenuExpanded.toString()
    );
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
  constructor(
    public router: Router,
    private cookieService: CookieService,
    private dataService: DataService,
    private dialog: MatDialog,
    private coreHelper: CoreHelper,
    private renderer: Renderer2,
    private themeService: ThemeService,
    private dependencyStatusService: DependencyStatusService,
    private notificationService: NotificationService,
    private appStateService: AppStateService,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document

  ) {
    this.isExpanded = this.coreHelper.toBoolean(
      this.cookieService.get('opena3xx.sidemenu.left.visibility.state')
    );
    this.isRightMenuExpanded = this.coreHelper.toBoolean(
      this.cookieService.get('opena3xx.sidemenu.right.visibility.state')
    );

    this.checkApiHealth();
    setInterval(() => {
      this.checkApiHealth();
    }, this.apiHealthPollingTime);

    this.isElectron = this.coreHelper.isRunningAsApp();
  }

  ngOnInit() {
    this.isElectron = this.coreHelper.isRunningAsApp();

    if (this.isElectron) {
      // Add electron-app class to body
      this.renderer.addClass(this.document.body, 'electron-app');
    }

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    // Subscribe to dependency status updates
    this.dependencyStatusSubscription = this.dependencyStatusService.status$.subscribe(status => {
      this.dependencyStatus = status;
    });

    // Subscribe to notification updates via shared service
    console.log('Setting up notification subscription in app component');
    this.notificationSubscription = this.appStateService.unreadCount$.subscribe(count => {
      console.log('App component received unread count from AppStateService:', count);
      this.unreadNotificationCount = count;
      console.log('App component unreadNotificationCount updated to:', this.unreadNotificationCount);
      this.cdr.detectChanges();
    });
    console.log('Notification subscription set up in app component');

    // Start polling for dependency status
    this.dependencyStatusService.startPolling();
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
    this.dependencyStatusSubscription.unsubscribe();
    this.notificationSubscription.unsubscribe();
  }

  private checkApiHealth() {
    this.dataService
      .checkApiHealth()
      .then((state: boolean) => {
        if (state) {
          this.apiAvailabilityStatus = true;
        } else {
          this.apiAvailabilityStatus = false;
        }
      })
      .catch(() => {
        this.apiAvailabilityStatus = false;
      });
  }
  exit() {
    this.dialog.open(ExitAppDialogComponent);
  }
  clickDashboard() {
    this.router.navigateByUrl(`/dashboard`);
  }
  clickManageHardwarePanels() {
    this.router.navigateByUrl(`/manage/hardware-panels`);
  }

  clickManageAircraftModels() {
    this.router.navigateByUrl(`/manage/aircraft-models`);
  }

  clickManageHardwareInputTypes() {
    this.router.navigateByUrl(`/manage/hardware-input-types`);
  }

  clickManageHardwareOutputTypes() {
    this.router.navigateByUrl(`/manage/hardware-output-types`);
  }

  clickManageHardwareInputs() {
    this.router.navigateByUrl(`/manage/hardware-inputs`);
  }

  clickManageHardwareOutputs() {
    this.router.navigateByUrl(`/manage/hardware-outputs`);
  }

  clickSettings() {
    this.router.navigateByUrl(`/settings`);
  }

  clickNotifications() {
    this.router.navigateByUrl(`/notifications`);
  }

  updateUnreadCount(count: number) {
    this.unreadNotificationCount = count;
  }
  clickManageSimulatorEvents() {
    this.router.navigateByUrl(`/manage/simulator-events`);
  }
  clickManageHardwareBoards() {
    this.router.navigateByUrl(`/manage/hardware-boards`);
  }
  clickConsole() {
    this.router.navigateByUrl(`/console`);
  }

  clickConnectivity() {
    this.router.navigateByUrl(`/connectivity`);
  }

  // Dependency Status Helper Methods
  getStatusIcon(dependencyName: string): string {
    return this.dependencyStatusService.getStatusIcon(dependencyName);
  }

  getStatusClass(status: string): string {
    return this.dependencyStatusService.getStatusClass(status);
  }

  getDependencyTooltip(dependency: DependencyStatus | null): string {
    if (!dependency) return 'Status unknown';

    const lastChecked = new Date(dependency.lastChecked).toLocaleTimeString();
    const serviceDescription = this.getServiceDescription(dependency.name);

    return `${dependency.name} (${serviceDescription}): ${dependency.message} (Last checked: ${lastChecked})`;
  }

  getServiceDescription(serviceName: string): string {
    const descriptions: { [key: string]: string } = {
      'MSFS 2020/2024': 'Microsoft Flight Simulator 2020/2024 integration and event handling service',
      'RabbitMQ': 'Message broker for real-time communication and event distribution',
      'SEQ': 'Structured event querying and logging service for system monitoring',
      'Backend API': 'Core backend API service for data management and business logic',
      'Database': 'Database connection and data persistence service',
      'File System': 'File system access and storage management service',
      'Hardware Interface': 'Hardware communication and control interface',
      'Simulator Interface': 'Flight simulator integration and event handling service',
      'Notification Service': 'Real-time notification and alert management service',
      'Authentication Service': 'User authentication and authorization service',
      'Configuration Service': 'Application configuration and settings management',
      'Logging Service': 'System logging and error tracking service',
      'Cache Service': 'Data caching and performance optimization service'
    };
    return descriptions[serviceName] || 'Service description not available';
  }

  getFormattedTimestamp(timestamp: string | Date): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  getBackendApiTooltip(): string {
    return this.apiAvailabilityStatus
      ? 'Backend API is online and responding'
      : 'Backend API is offline or not responding';
  }

  /**
   * Get the appropriate logo path based on current theme
   */
  getLogoPath(): string {
    return this.themeService.getLogoPath();
  }
}
