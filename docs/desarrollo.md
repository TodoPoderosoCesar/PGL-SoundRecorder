# Desarrollo de la práctica

## Ejercicio 1 – Diseño de la pantalla

La pantalla contiene:
- **Botón circular** para iniciar/parar grabación.
- **Indicador animado** (spinner + texto) visible solo durante la grabación.
- **Lista** de audios grabados con nombre.
- **Botón de reproducción** individual por audio.
- **Botón de eliminación** individual y botón "Eliminar todos".

## Ejercicio 2 – Implementación

Desarrollado en `screens/RecorderScreen.js` usando `expo-av` para grabación y reproducción.

## Ejercicio 3 – Permisos

Se llama a `Audio.requestPermissionsAsync()` cada vez que el usuario pulsa grabar. Si el permiso no está concedido, se muestra una alerta y no se inicia la grabación.

## Ejercicio 4 – Persistencia entre sesiones

Con `useEffect` al montar el componente se llama a `loadAudios()`, que recupera los URIs guardados con AsyncStorage. Al grabar o eliminar se actualiza el almacenamiento automáticamente.

## Ejercicio 5 – Componente de carga propio

`components/LoadingSpinner.js` es un spinner animado creado con `Animated.Value` y rotación continua mediante `Animated.loop`. Se usa en:
1. Carga inicial de grabaciones (pantalla completa).
2. Durante la grabación (indicador pequeño inline).

## Ejercicio 6 – Animación propia

Debajo del botón de grabar aparece una animación de grabando y un loading spinner mientras la grabación está activa, implementada con `Animated.loop`.

## Fuentes

- [Expo Audio docs](https://docs.expo.dev/versions/latest/sdk/audio/)
- [AsyncStorage docs](https://react-native-async-storage.github.io/async-storage/)
- [React Native Animated](https://reactnative.dev/docs/animated)