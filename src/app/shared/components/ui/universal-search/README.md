# Universal Search Component

A macOS-style universal search component that provides a centralized search experience across the OpenA3XX application.

## Features

### 🎯 **Core Functionality**
- **Global Search**: Search across hardware panels, types, boards, and other entities
- **Keyboard Shortcuts**: `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) to open search
- **Escape Key**: Close search with `Esc` key
- **Debounced Search**: 300ms delay to prevent excessive API calls
- **Auto-focus**: Automatically focuses the search input when opened

### 🎨 **Design Features**
- **macOS-style Modal**: Glassmorphism effect with backdrop blur
- **Responsive Design**: Adapts to different screen sizes
- **Dark Theme Support**: Full dark theme compatibility
- **Smooth Animations**: Fade-in and slide-down animations
- **Type-based Icons**: Different icons and colors for different entity types

### 🔍 **Search Results**
- **Rich Results**: Shows name, type, and description
- **Type Indicators**: Color-coded icons for different entity types
- **Navigation**: Click to navigate directly to the selected item
- **Loading States**: Shows spinner while searching
- **No Results**: Graceful handling of empty search results

## Usage

### Basic Implementation
```html
<app-universal-search></app-universal-search>
```

### In Toolbar (Recommended)
```html
<mat-toolbar>
  <h1>App Name</h1>
  <app-universal-search></app-universal-search>
  <span class="spacer"></span>
  <!-- Other toolbar items -->
</mat-toolbar>
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Open search |
| `Esc` | Close search |
| `Enter` | Select highlighted result |
| `↑/↓` | Navigate results |

## API Integration

The component currently uses placeholder data. To integrate with your backend API:

1. **Update the `performSearch()` method** in `universal-search.component.ts`
2. **Implement actual API calls** to your search endpoint
3. **Map the response** to the `SearchResult` interface
4. **Update navigation logic** to use Angular Router instead of `window.location.href`

### Example API Integration
```typescript
private performSearch(query: string): Observable<SearchResult[]> {
  return this.dataService.searchEntities(query).pipe(
    map(response => response.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      description: item.description,
      url: `/view/${item.type.toLowerCase()}/${item.id}`
    })))
  );
}
```

## Styling

The component uses SCSS with:
- **CSS Grid** for responsive layouts
- **Flexbox** for alignment
- **CSS Custom Properties** for theming
- **Backdrop filters** for glassmorphism effects
- **CSS Animations** for smooth transitions

### Customization
You can customize the appearance by overriding CSS variables or modifying the component styles.

## Entity Types Supported

| Type | Icon | Color | Description |
|------|------|-------|-------------|
| Hardware Panel | `dashboard` | `#1976d2` | Hardware panel entities |
| Hardware Input Type | `login` | `#4caf50` | Input type definitions |
| Hardware Output Type | `logout` | `#ff9800` | Output type definitions |
| Hardware Board | `memory` | `#9c27b0` | Hardware board entities |
| Aircraft Model | `airplanemode_active` | `#2196f3` | Aircraft model definitions |

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and roles
- **Focus Management**: Automatic focus and blur handling
- **High Contrast**: Supports high contrast themes

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Backdrop Filter**: Requires modern browsers for glassmorphism effects
- **Fallbacks**: Graceful degradation for older browsers

## Performance

- **Debounced Input**: Prevents excessive API calls
- **Lazy Loading**: Results load only when needed
- **Memory Management**: Proper cleanup on component destruction
- **Efficient Rendering**: Uses Angular's change detection efficiently 
