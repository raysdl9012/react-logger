# ReactLoggerApp 🐞

A professional, high-performance visual logging system for **Ionic React** applications. Monitor logs, errors, and JSON objects in real-time with a beautiful floating UI that works seamlessly on **iOS**, **Android**, and **Web**.

![npm version](https://img.shields.io/npm/v/react-logger-app)
![license](https://img.shields.io/npm/l/react-logger-app)
![downloads](https://img.shields.io/npm/dm/react-logger-app)

## ✨ Features

- 🐞 **Three Log Levels**: Debug, Error, and Object
- � **Mobile-First Design**: Optimized for iOS and Android (WebView compatible)
- 🎨 **Liquid Glass UI**: Premium glassmorphism design with neon accents
- 🖱️ **Draggable Floating Button**: Minimizable, repositionable trigger
- 📦 **JSON Tree Viewer**: Expandable visualization for complex objects
- 💾 **Persistent Storage**: Save logs across sessions (localStorage/IndexedDB)
- 🔍 **Search & Filters**: Quickly find specific logs or filter by level
- 📥 **Export Logs**: Download as JSON files
- 🚀 **Virtualized List**: Handles thousands of logs without performance loss
- 🌐 **Cross-Platform**: Works in React components and TypeScript classes
- 🎯 **Zero Dependencies**: Lightweight with minimal peer dependencies

## 📦 Installation

```bash
npm install react-logger-app
# or
yarn add react-logger-app
# or
pnpm add react-logger-app
```

## 🚀 Quick Start

### 1. Setup Provider

Wrap your application with `LoggerProvider` and add `LoggerViewer` (typically in `App.tsx`):

```tsx
import { LoggerProvider, LoggerViewer } from 'react-logger-app';
import { IonApp } from '@ionic/react';

const App: React.FC = () => (
  <LoggerProvider config={{ persistence: true, maxLogs: 1000 }}>
    <IonApp>
      {/* Your app routes and components */}
      <LoggerViewer />
    </IonApp>
  </LoggerProvider>
);

export default App;
```

### 2. Use in React Components

```tsx
import { useLogger } from 'react-logger-app';

const MyComponent: React.FC = () => {
  const { debug, error, object } = useLogger();

  const handleAction = async () => {
    debug('Process started');
    
    try {
      const response = await fetchData();
      object(response, 'API Response');
    } catch (e) {
      error(e as Error);
    }
  };

  return <button onClick={handleAction}>Run Action</button>;
};
```

### 3. Use in TypeScript Classes

Perfect for services, utilities, and business logic outside React:

```tsx
import { Logger } from 'react-logger-app';

class AuthService {
  async login(credentials: Credentials) {
    Logger.debug('Login attempt started', 'AuthService');
    
    try {
      const user = await api.authenticate(credentials);
      Logger.object(user, 'Authenticated User');
      return user;
    } catch (error) {
      Logger.error(error as Error);
      throw error;
    }
  }
}
```

> **Note**: Logs sent via `Logger` before the provider mounts are buffered and displayed once the UI is ready.

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `persistence` | `boolean` | `false` | Enable log storage between sessions |
| `persistenceDriver` | `'localStorage'` \| `'indexedDB'` | `'localStorage'` | Storage backend for persisted logs |
| `maxLogs` | `number` | `500` | Maximum number of logs to retain |
| `onLogAdded` | `(log: LogEntry) => void` | `undefined` | Callback fired when a log is added |

### Example with Custom Config

```tsx
<LoggerProvider 
  config={{
    persistence: true,
    persistenceDriver: 'indexedDB',
    maxLogs: 2000,
    onLogAdded: (log) => {
      if (log.level === 'ERROR') {
        // Send to analytics or crash reporting
        analytics.trackError(log);
      }
    }
  }}
>
  <App />
</LoggerProvider>
```

## 📱 Platform Support

### ✅ Fully Tested On:
- **iOS** (Safari, WKWebView)
- **Android** (Chrome WebView, System WebView)
- **Web** (Chrome, Safari, Firefox, Edge)

### 🔧 Android-Specific Optimizations (v1.1.3+)
- Solid background fallback for WebView compatibility
- Disabled `backdrop-filter` on mobile to prevent rendering artifacts
- Conditional rendering to avoid z-index conflicts
- No animations on small screens for smoother performance

## 🎨 UI Features

### Floating Button
- **Draggable**: Reposition anywhere on screen
- **Badge Counter**: Shows unread log count
- **Auto-hide**: Disappears when panel is open (prevents visual conflicts)
- **Persistent Position**: Remembers location after drag

### Log Panel
- **Full-screen on Mobile**: Optimized for small screens
- **Virtualized Scrolling**: Smooth performance with 1000+ logs
- **Search Bar**: Filter logs by message or title
- **Level Filters**: Show only DEBUG, ERROR, or OBJECT logs
- **Export Button**: Download logs as JSON
- **Clear Button**: Remove all logs with confirmation

## 📖 API Reference

### `useLogger()` Hook

Returns an object with the following methods:

```tsx
const {
  debug,      // (message: string) => void
  error,      // (message: string | Error) => void
  object,     // (obj: any, title?: string) => void
  clear,      // () => void
  exportLogs, // () => LogEntry[]
  logs,       // LogEntry[]
  unreadCount // number
} = useLogger();
```

### `Logger` Static Class

For use outside React components:

```tsx
Logger.debug(message: string, title?: string): void
Logger.error(error: Error | string, title?: string): void
Logger.object(data: any, title?: string): void
```

### `LogEntry` Type

```tsx
interface LogEntry {
  id: string;
  timestamp: string;
  level: 'DEBUG' | 'ERROR' | 'OBJECT';
  message: string;
  title?: string;
  data?: any;
  stack?: string;
}
```

## 🛠️ Local Development

To run the demo app and test the logger:

```bash
# 1. Build the library
npm run build

# 2. Run the example app
cd example
npm install
npm run dev

# 3. Open http://localhost:5173
```

## 🐛 Troubleshooting

### Button not visible on Android
- **Solution**: Update to v1.1.3+ which includes Android-specific fixes
- Ensure `LoggerViewer` is placed inside `IonApp` or at root level
- Check z-index conflicts with other fixed/absolute positioned elements

### Logs not persisting
- Verify `persistence: true` in config
- Check browser storage permissions
- For IndexedDB, ensure browser supports it

### Performance issues with many logs
- Reduce `maxLogs` config value
- Use `clear()` periodically
- Enable persistence and restart app to clear memory

## 📄 License

MIT © [Reinner Leiva](https://github.com/raysdl9012)

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📦 Package Info

- **Package**: `react-logger-app`
- **Repository**: [github.com/raysdl9012/react-logger](https://github.com/raysdl9012/react-logger)
- **NPM**: [npmjs.com/package/react-logger-app](https://www.npmjs.com/package/react-logger-app)

---

Made with ❤️ for the Ionic React community
