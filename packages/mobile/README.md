## Building Blocks React Native Mobile Router and App Projects

Building Blocks - React Native Master App - Mobile Router and App Projects

### Expo migration (maintenance mode)

Expo in `react-native/` **defaults** to **`AppShell`**: React Navigation 6 + **legacy block screens** (same sources as this app) + Redux (`packages/mobile/src/store`).

Set **`EXPO_PUBLIC_USE_LEGACY_APP=true`** to use the original **`packages/mobile/App.tsx`** react-navigation v2 container unchanged.

`EXPO_PUBLIC_OFFLINE_MODE=false` is required for real API traffic from blocks (framework/runEngine); `react-native/src/services/api/client.ts` mocks are separate from block API calls.

## Getting Started

### Prerequisites

### Git Structure

### Installing

## Running the tests

## CI/CD Details

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).



