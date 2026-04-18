# PGL-SoundRecorder

Aplicación de grabación de audio desarrollada con **React Native + Expo**.

## ¿Qué hace?

Permite grabar audios desde el micrófono del dispositivo, listarlos, reproducirlos individualmente y eliminarlos. Los audios se persisten entre sesiones mediante AsyncStorage.

## Documentación

- [Ejercicios y desarrollo](./docs/desarrollo.md)

## Estructura

```
PGL-SoundRecorder/
├── App.js                        # Entrada y navegación
├── screens/
│   └── RecorderScreen.js         # Pantalla principal
├── components/
│   └── LoadingSpinner.js         # Componente de carga propio
├── services/
│   └── storageService.js         # Servicio AsyncStorage genérico + específico
└── docs/
    └── desarrollo.md
```

## Instalación

```bash
npx expo install expo-av @react-native-async-storage/async-storage @react-navigation/native @react-navigation/native-stack
```