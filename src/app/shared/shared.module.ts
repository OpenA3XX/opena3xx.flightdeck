import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

// UI Components
import { AutocompleteComponent } from './components/ui/autocomplete/autocomplete.component';
import { ButtonComponent } from './components/ui/button/button.component';
import { CheckboxComponent } from './components/ui/checkbox/checkbox.component';
import { DateComponent } from './components/ui/date/date.component';
import { DynamicFieldDirective } from './components/ui/dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from './components/ui/dynamic-form/dynamic-form.component';
import { HeadingComponent } from './components/ui/heading/heading.component';
import { InputComponent } from './components/ui/input/input.component';
import { RadiobuttonComponent } from './components/ui/radiobutton/radiobutton.component';
import { SelectComponent } from './components/ui/select/select.component';
import { SlideToggleComponent } from './components/ui/slide-toggle/slide-toggle.component';
import { SliderComponent } from './components/ui/slider/slider.component';
import { LoadingComponent } from './components/ui/loading/loading.component';
import { FloatingBackButtonComponent } from './components/ui/floating-back-button/floating-back-button.component';
import { DataTableComponent } from './components/ui/data-table/data-table.component';
import { PageHeaderComponent } from './components/ui/page-header/page-header.component';
import { DialogWrapperComponent } from './components/ui/dialog-wrapper/dialog-wrapper.component';

// Pipes
import { FormatDatePipe } from './pipes/format-date.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [
    // UI Components
    AutocompleteComponent,
    ButtonComponent,
    CheckboxComponent,
    DateComponent,
    DynamicFieldDirective,
    DynamicFormComponent,
    HeadingComponent,
    InputComponent,
    RadiobuttonComponent,
    SelectComponent,
    SlideToggleComponent,
    SliderComponent,
    LoadingComponent,
    FloatingBackButtonComponent,
    DataTableComponent,
    PageHeaderComponent,
    DialogWrapperComponent,

    // Pipes
    FormatDatePipe,
    TruncatePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ],
  exports: [
    // UI Components
    AutocompleteComponent,
    ButtonComponent,
    CheckboxComponent,
    DateComponent,
    DynamicFieldDirective,
    DynamicFormComponent,
    HeadingComponent,
    InputComponent,
    RadiobuttonComponent,
    SelectComponent,
    SlideToggleComponent,
    SliderComponent,
    LoadingComponent,
    FloatingBackButtonComponent,
    DataTableComponent,
    PageHeaderComponent,
    DialogWrapperComponent,

    // Pipes
    FormatDatePipe,
    TruncatePipe
  ]
})
export class SharedModule { }
