# react-looger 🐞

A professional, high-performance visual logging system for Ionic React applications. Monitor logs, errors, and JSON objects in real-time with a beautiful floating UI.

![Logger Preview](https://github.com/your-repo/react-looger/raw/main/assets/preview.png)

## Features

- ✅ **Three Log Levels**: Debug, Error, and Object.
- 🐞 **Floating UI**: Draggable, minimizable, and responsive button.
- 📦 **JSON Tree Viewer**: Expandable visualization for complex objects.
- 💾 **Persistence**: Option to store logs in `localStorage` or `IndexedDB`.
- 🔍 **Search & Filters**: Quickly find specific logs or filter by level.
- 📥 **Export**: Download logs as JSON files.
- 🌓 **Dark Mode**: Automatic support for system theme.
- 🚀 **Virtualized List**: Handles thousands of logs without performance loss.

## Installation

```bash
npm install react-looger
# or
yarn add react-looger
```

## Setup

Wrap your application with the `LoggerProvider` and add the `LoggerViewer` component (ideally in your `App.tsx`).

```tsx
import { LoggerProvider, LoggerViewer } from 'react-looger';

const App: React.FC = () => (
  <LoggerProvider config={{ persistence: true, maxLogs: 1000 }}>
    <IonApp>
      {/* Your app components */}
      <LoggerViewer />
    </IonApp>
  </LoggerProvider>
);
```

## Usage

Use the `useLogger` hook anywhere in your components.

```tsx
import { useLogger } from 'react-looger';

const MyComponent: React.FC = () => {
  const { debug, error, object } = useLogger();

  const handleAction = () => {
    debug('Process started');
    
    try {
      const userData = { id: 1, name: 'John Doe', roles: ['admin', 'user'] };
      object(userData, 'User Data');
    } catch (e) {
      error(e as Error);
    }
  };

  return <button onClick={handleAction}>Run Action</button>;
};
```

### Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `persistence` | `boolean` | `false` | Enable log storage between sessions. |
| `persistenceDriver` | `'localStorage' \| 'indexedDB'` | `'localStorage'` | Choose where to store logs. |
| `maxLogs` | `number` | `500` | Maximum number of logs to keep. |
| `onLogAdded` | `(log: LogEntry) => void` | `undefined` | Callback fired every time a log is added. |

## Local Development & Demo

To see the Liquid Glass logger in action within a sample Ionic React environment:

1.  **Build the Library**:
    ```bash
    npm run build
    ```
2.  **Run the Demo**:
    ```bash
    cd example
    npm install
    npm run dev
    ```
3.  **View**: Open `http://localhost:5173` in your browser.

## API Reference

### `useLogger()`
Returns:
- `debug(message: string)`: Log a debug message.
- `error(message: string | Error)`: Log an error or Error object.
- `object(obj: any, title?: string)`: Log a serializable object.
- `clear()`: Delete all current logs.
- `exportLogs()`: Get an array of all `LogEntry` objects.
- `logs`: Current array of logs.
- `unreadCount`: Number of logs added while panel was closed.

## License

MIT
