import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { saveAudios, loadAudios, clearAudios, AudioRecord } from '../services/StorageService';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors } from '../theme/colors';

export default function RecorderScreen() {
  const [recordings, setRecordings] = useState<AudioRecord[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [playingUri, setPlayingUri] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    (async () => {
      const saved = await loadAudios();
      if (saved) setRecordings(saved);
      setIsLoading(false);
    })();
  }, []);

  const startRecording = async (): Promise<void> => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      Alert.alert('Permiso denegado', 'Necesitas conceder acceso al micrófono.');
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording: rec } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(rec);
  };

  const stopRecording = async (): Promise<void> => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });

    const uri = recording.getURI();
    setRecording(null);
    if (!uri) return;

    const updated: AudioRecord[] = [
      ...recordings,
      { uri, name: `Audio ${recordings.length + 1}` },
    ];
    setRecordings(updated);
    await saveAudios(updated);
  };

  const playAudio = async (uri: string): Promise<void> => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      if (playingUri === uri) {
        setPlayingUri(null);
        return;
      }
    }

    setPlayingUri(uri);
    const { sound } = await Audio.Sound.createAsync({ uri });
    soundRef.current = sound;
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        setPlayingUri(null);
        sound.unloadAsync();
        soundRef.current = null;
      }
    });
  };

  const deleteOne = async (uri: string): Promise<void> => {
    const updated = recordings.filter((r) => r.uri !== uri);
    setRecordings(updated);
    await saveAudios(updated);
  };

  const deleteAll = (): void => {
    Alert.alert('Eliminar todo', '¿Borrar todos los audios?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          setRecordings([]);
          await clearAudios();
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <LoadingSpinner size={50} color={colors.primaryRed} />
        <Text style={styles.loadingText}>Cargando grabaciones…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Botón de grabar */}
      <TouchableOpacity
        style={[styles.recordBtn, recording ? styles.recordingBtn : styles.idleBtn]}
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={styles.recordBtnText}>
          {recording ? 'Parar' : 'Grabar'}
        </Text>
      </TouchableOpacity>

      {/* Indicador de grabación en curso */}
      {recording && (
        <View style={styles.recordingIndicator}>
          <LoadingSpinner size={20} color={colors.primaryRed} />
          <Text style={styles.recordingText}>Grabando…</Text>
        </View>
      )}

      {/* Lista de audios */}
      <FlatList
        data={recordings}
        keyExtractor={(item) => item.uri}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Pero grabate algo primero ¿no?</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.audioItem}>
            <Text style={styles.audioName}>{item.name}</Text>
            <View style={styles.audioActions}>
              <TouchableOpacity
                style={[styles.playBtn, playingUri === item.uri && styles.playingBtn]}
                onPress={() => playAudio(item.uri)}
              >
                <Text style={styles.btnText}>
                  {playingUri === item.uri ? 'Parar' : 'Iniciar'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteOne(item.uri)}
              >
                <Text style={styles.btnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Botón eliminar todos */}
      {recordings.length > 0 && (
        <TouchableOpacity style={styles.deleteAllBtn} onPress={deleteAll}>
          <Text style={styles.deleteAllText}>Eliminar todos</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.backgroundWhite, 
    alignItems: 'center', 
    padding: 20 
  },
  center: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  loadingText: { marginTop: 10, 
    color: colors.primaryText, 
    fontSize: 14 
  },

  recordBtn: {
    backgroundColor: colors.primaryRed, 
    borderRadius: 70,
    width: 140, 
    height: 140, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginVertical: 20, 
    elevation: 4,
  },
  recordingBtn: { 
    backgroundColor: colors.primaryRed 
  },
  idleBtn: { 
    backgroundColor: colors.primaryGreen 
  },

  recordBtnText: { 
    color: colors.textWhite, 
    fontSize: 18, 
    fontWeight: 'bold' 
  },

  recordingIndicator: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8,
    backgroundColor: colors.backgroundWhite, 
    borderRadius: 20,
    paddingHorizontal: 14, 
    paddingVertical: 6, 
    marginBottom: 10,
  },
  recordingText: { 
    color: colors.primaryRed, 
    fontWeight: '600' 
  },

  list: { 
    width: '100%', 
    marginTop: 10
  },
  emptyText: { 
    textAlign: 'center', 
    color: colors.primaryText, 
    marginTop: 30 
  },

  audioItem: {
    backgroundColor: colors.textWhite, 
    borderRadius: 12, 
    padding: 14,
    marginBottom: 10, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
    elevation: 2,
  },
  audioName: { 
    fontSize: 15, 
    color: colors.primaryText, 
    flex: 1 
  },
  audioActions: { 
    flexDirection: 'row', 
    gap: 8 
  },

  playBtn: {
    backgroundColor: colors.primaryBlue, 
    borderRadius: 8,
    paddingHorizontal: 14, 
    paddingVertical: 8,
  },
  playingBtn: { 
    backgroundColor: colors.primaryBlue 
  },
  deleteBtn: {
    backgroundColor: colors.primaryRed, 
    borderRadius: 8,
    paddingHorizontal: 14, 
    paddingVertical: 8,
  },
  btnText: { 
    color: colors.textWhite, 
    fontSize: 16 
  },

  deleteAllBtn: {
    backgroundColor: colors.primaryRed, 
    borderRadius: 10,
    paddingHorizontal: 30, 
    paddingVertical: 12, 
    marginTop: 10,
  },
  deleteAllText: { 
    color: colors.textWhite, 
    fontWeight: 'bold', 
    fontSize: 15 
  },
});
