# PageHeaderComponent

A reusable header component for consistent page layouts across the application.

## Features

- **Configurable Title & Subtitle**: Set the main title and optional subtitle
- **Dynamic Icon**: Optional Material Design icon
- **Flexible Action Buttons**: Multiple action buttons with different colors and states
- **Sticky Behavior**: Sticks to the top when scrolling (enabled by default)
- **Responsive Design**: Adapts to different screen sizes
- **Material Design**: Consistent with Angular Material styling
- **Type Safety**: Strongly typed action configuration

## Usage

### Basic Usage

```html
<opena3xx-page-header
  title="Page Title"
  subtitle="Optional subtitle text"
  icon="dashboard">
</opena3xx-page-header>
```

### Disable Sticky Behavior

```html
<opena3xx-page-header
  title="Page Title"
  subtitle="Optional subtitle text"
  icon="dashboard"
  [sticky]="false">
</opena3xx-page-header>
```

### With Action Buttons

```html
<opena3xx-page-header
  title="Aircraft Models"
  subtitle="Manage aircraft models and configurations"
  icon="flight"
  [actions]="headerActions">
</opena3xx-page-header>
```

### TypeScript Configuration

```typescript
import { PageHeaderAction } from 'src/app/shared/components/ui/page-header/page-header.component';

export class MyComponent {
  headerActions: PageHeaderAction[] = [
    {
      label: 'Add New',
      icon: 'add',
      color: 'primary',
      onClick: () => this.onAddNew()
    },
    {
      label: 'Export',
      icon: 'download',
      color: 'accent',
      onClick: () => this.onExport()
    },
    {
      label: 'Delete All',
      icon: 'delete',
      color: 'warn',
      disabled: true,
      onClick: () => this.onDeleteAll()
    }
  ];

  onAddNew() {
    // Handle add action
  }

  onExport() {
    // Handle export action
  }

  onDeleteAll() {
    // Handle delete action
  }
}
```

## Input Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | `string` | Yes | The main page title |
| `subtitle` | `string` | No | Optional subtitle text |
| `icon` | `string` | No | Material Design icon name |
| `actions` | `PageHeaderAction[]` | No | Array of action buttons |
| `sticky` | `boolean` | No | Enable sticky behavior (default: true) |

## PageHeaderAction Interface

```typescript
interface PageHeaderAction {
  label: string;           // Button text
  icon?: string;           // Material Design icon name
  color?: 'primary' | 'accent' | 'warn';  // Button color
  disabled?: boolean;      // Disable the button
  onClick: () => void;     // Click handler
}
```

## Styling

The component uses CSS custom properties for theming:

- `--mat-card-background-color`: Background color
- `--mat-primary-color`: Primary color for icons
- `--mat-text-color`: Text color
- `--mat-secondary-text-color`: Subtitle text color

## Responsive Behavior

- **Desktop**: Horizontal layout with title on left, actions on right
- **Tablet (≤768px)**: Vertical layout with actions below title
- **Mobile (≤480px)**: Stacked layout with full-width action buttons

## Examples

### Aircraft Models Page
```html
<opena3xx-page-header
  title="Aircraft Models"
  subtitle="Manage aircraft models and configurations"
  icon="flight"
  [actions]="[
    {
      label: 'Add Aircraft Model',
      icon: 'add',
      color: 'primary',
      onClick: () => this.onAddAircraftModel()
    }
  ]">
</opena3xx-page-header>
```

### Hardware Panels Page
```html
<opena3xx-page-header
  title="Hardware Panels"
  subtitle="Manage hardware panel configurations and assignments"
  icon="dashboard"
  [actions]="[
    {
      label: 'Add Hardware Panel',
      icon: 'add',
      color: 'primary',
      onClick: () => this.addHardwarePanel()
    },
    {
      label: 'Test Data Table',
      icon: 'table_chart',
      color: 'accent',
      onClick: () => this.goToTestDataTable()
    }
  ]">
</opena3xx-page-header>
``` 
