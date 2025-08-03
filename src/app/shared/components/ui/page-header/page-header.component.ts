import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface PageHeaderAction {
  label: string | (() => string);
  icon?: string | (() => string);
  color?: 'primary' | 'accent' | 'warn' | (() => 'primary' | 'accent' | 'warn');
  disabled?: boolean | (() => boolean);
  onClick: () => void;
}

@Component({
  selector: 'opena3xx-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: false
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() actions: PageHeaderAction[] = [];
  @Input() sticky: boolean = true; // Default to sticky behavior

  onActionClick(action: PageHeaderAction): void {
    if (!this.getDisabledState(action)) {
      action.onClick();
    }
  }

  getDisabledState(action: PageHeaderAction): boolean {
    if (typeof action.disabled === 'function') {
      return action.disabled();
    }
    return action.disabled || false;
  }

  getActionLabel(action: PageHeaderAction): string {
    if (typeof action.label === 'function') {
      return action.label();
    }
    return action.label;
  }

  getActionIcon(action: PageHeaderAction): string | undefined {
    if (typeof action.icon === 'function') {
      return action.icon();
    }
    return action.icon;
  }

  getActionColor(action: PageHeaderAction): 'primary' | 'accent' | 'warn' {
    if (typeof action.color === 'function') {
      return action.color();
    }
    return action.color || 'primary';
  }
}
