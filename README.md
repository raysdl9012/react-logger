# ReactLoggerApp 🐞

A professional, high-performance visual logging system for **Ionic React** applications. Monitor logs, errors, and JSON objects in real-time with a beautiful floating UI that works seamlessly on **iOS**, **Android**, and **Web**.

---

### Created by **Reinner Steven Daza Leiva**
**Contact & Support:** [reivium.com](https://reivium.com/)

---

[![npm version](https://img.shields.io/npm/v/react-logger-app)](https://www.npmjs.com/package/react-logger-app)
[![license](https://img.shields.io/npm/l/react-logger-app)](https://github.com/raysdl9012/react-logger/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dm/react-logger-app)](https://www.npmjs.com/package/react-logger-app)

## 🚀 Why ReactLoggerApp?

Debugging on mobile devices is hard. Console logs are often inaccessible or require complex setups. **ReactLoggerApp** brings the developer console directly to your app with a premium "Liquid Glass" interface. It's designed specifically for production-grade Ionic React apps where you need to see exactly what's happening on the device without connecting a debugger.

## ✨ Features

- 🐞 **Three Log Levels**: Debug, Error (with stack traces), and Object (interactive JSON viewer).
- 🎨 **Liquid Glass UI**: Stunning glassmorphism design that looks premium on any app.
- 🖱️ **Draggable Floating UI**: Reposition the trigger button anywhere; it remembers its position.
- 💾 **Persistent History**: Save logs across app restarts using LocalStorage or IndexedDB.
- 🌐 **Cross-Platform**: Optimized for iOS Safari, Android WebViews, and desktop browsers.
- 🚀 **Virtualized Performance**: Easily handle thousands of logs with zero lag.
- 🔍 **Real-time Filtering**: Search through logs or filter by severity level instantly.
- 📥 **One-Click Export**: Download your entire log history as a formatted JSON file.

## 📦 Installation

```bash
npm install react-logger-app
# or
yarn add react-logger-app
```

## �️ Quick Setup

### 1. Wrap your App
Add the `LoggerProvider` and `LoggerViewer` at the root of your application (usually `App.tsx`):

```tsx
import { LoggerProvider, LoggerViewer } from 'react-logger-app';

const App = () => (
  <LoggerProvider config={{ persistence: true }}>
    <IonApp>
      <YourAppComponent />
      <LoggerViewer />
    </IonApp>
  </LoggerProvider>
);
```

### 2. Start Logging
Use the `useLogger` hook in your components:

```tsx
import { useLogger } from 'react-logger-app';

const MyPage = () => {
  const { debug, error, object } = useLogger();

  const handleAction = () => {
    debug('User clicked action');
    try {
      // ... logic
      object(result, 'Op Result');
    } catch (e) {
      error(e, 'Failed to process');
    }
  };
};
```

### 3. Log from Anywhere
Even outside React components (Services, Utilities, Redux middleware):

```tsx
import { Logger } from 'react-logger-app';

Logger.debug('Global event happened');
```

## ⚙️ Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `persistence` | `boolean` | `false` | Enable log storage between sessions |
| `persistenceDriver` | `'localStorage'` \| `'indexedDB'` | `'localStorage'` | Storage backend for persisted logs |
| `maxLogs` | `number` | `500` | Maximum number of logs to retain |

## 👨‍💻 Author

**Reinner Steven Daza Leiva**
Passionate about building high-quality tools for developers.
Connect with me: [reivium.com](https://reivium.com/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Download it now and take your Ionic debugging to the next level!** 🚀
