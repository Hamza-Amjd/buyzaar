import {
  Modal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?:any;
};

const CenterModal: React.FC<ModalProps> = ({ isVisible, onClose, width, children }) => {
  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <ThemedView style={[styles.modalContent, { width: width || '80%' }]}>
              {children}
            </ThemedView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default CenterModal;
