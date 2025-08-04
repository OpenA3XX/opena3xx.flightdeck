import { CUSTOM_ELEMENTS_SCHEMA, NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// Core Services
import { DataService } from './core/services/data.service';
import { ConfigurationService } from './core/services/configuration.service';
import { RealTimeService } from './core/services/realtime.service';
import { CoreHelper } from './core/core-helper';
import { initializeApp } from './core/app-initializer';
import { GlobalErrorHandler } from './core/services/error-handler.service';
import { HttpRequestInterceptor } from './core/interceptors/http.interceptor';
import { LoadingService } from './core/services/loading.service';
import { PerformanceService } from './core/services/performance.service';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { FormValidationService } from './core/services/form-validation.service';

// Feature Modules
import { HardwareModule } from './features/hardware/hardware.module';
import { SimulatorModule } from './features/simulator/simulator.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { ConsoleModule } from './features/console/console.module';
import { SettingsModule } from './features/settings/settings.module';
import { AircraftModelsModule } from './features/aircraft-models/aircraft-models.module';

// Shared Module
import { SharedModule } from './shared/shared.module';
import { UniversalSearchComponent } from './shared/components/ui/universal-search/universal-search.component';

// Core Components
import { ExitAppDialogComponent } from './core/components/exit-app-dialog.component';

@NgModule({ declarations: [
        AppComponent,
        ExitAppDialogComponent
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatNativeDateModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        // Feature Modules
        HardwareModule,
        SimulatorModule,
        DashboardModule,
        ConsoleModule,
        SettingsModule,
        AircraftModelsModule,
        // Shared Module
        SharedModule,
        // Standalone Components
        UniversalSearchComponent], providers: [
        DataService,
        CoreHelper,
        ConfigurationService,
        RealTimeService,
        LoadingService,
        PerformanceService,
        AuthService,
        ThemeService,
        FormValidationService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [ConfigurationService],
            multi: true
        },
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpRequestInterceptor,
            multi: true
        },
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
