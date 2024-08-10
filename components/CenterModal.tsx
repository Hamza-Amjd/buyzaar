import {
  Modal,
  StyleSheet,
  View,
} from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";

type modalProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};
const CenterModal: React.FC<modalProps> = ({ isVisible,onClose,children }) => {
  
  return (
      <Modal
        animationType="fade"
        presentationStyle="overFullScreen"
        transparent={true}
        statusBarTranslucent
        visible={isVisible}
        onTouchEnd={onClose}
        onRequestClose={
          onClose
        }>
        <View style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
         {children}
          </ThemedView>
        </View>
      </Modal>
      
  );
};

const styles = StyleSheet.create({

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(0,0,0,0.3)'
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width:'90%',
    gap:10
  },
  modalContainer:{
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    zIndex: 2000,
  },
  
});

export default CenterModal;
