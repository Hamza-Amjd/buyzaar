import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  BarcodeScanningResult,
  Camera,
  CameraView,
} from "expo-camera";
import Header from "../ui/Header";

interface ScannerProps {
  onBarcodeScanned: (scanningResult: BarcodeScanningResult) => void;
  onClose: () => void
}

const Scanner: React.FC<ScannerProps> = ({ onBarcodeScanned,onClose }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(true);

  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No camera access</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header} >
        <Header onBackPress={onClose}/>
      </View>
      <CameraView
      style={styles.camera}
        onBarcodeScanned={onBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
        }}
      >
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  header:{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1
  },
  overlay: {
    flex: 1,
    borderWidth: 2,
    margin: 20,
  },
});

export default Scanner;
