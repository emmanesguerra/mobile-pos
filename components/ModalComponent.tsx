import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ModalComponentProps {
  isVisible: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onPrint?: () => void;
  onSave?: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  isVisible,
  title,
  children,
  onClose,
  onPrint,
  onSave,
}) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>

          {/* Render dynamic content (passed as children) */}
          {children}

          <View style={styles.buttonGroup}>
            <View style={styles.leftButtons}>
              {onPrint && (
                <TouchableOpacity style={[styles.button]} onPress={onPrint}>
                  <Text style={styles.buttonText}>Print</Text>
                </TouchableOpacity>
              )}
              {onSave && (
                <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]} onPress={onSave}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={[styles.button, { backgroundColor: 'gray' }]} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#27548A',
    marginRight: 10,
    width: 100
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ModalComponent;
