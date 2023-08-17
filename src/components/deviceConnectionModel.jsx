/* eslint-disable react/prop-types */
import React, { useCallback } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { colors } from "../styles/colorPalette";

/* import { Device } from "react-native-ble-plx"; */



const DeviceModalListItem = ({ item, connectToPeripheral, closeModal }) => {

  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item);
    closeModal();
  }, [closeModal, connectToPeripheral, item.item]);

  return (
    <TouchableOpacity
      onPress={connectAndCloseModal}
      style={modalStyle.ctaButton}
    >
      <Text style={modalStyle.ctaButtonText}>{item.item.name}</Text>
    </TouchableOpacity>
  );
};

const DeviceModal = (props) => {
  const { devices, visible, connectToPeripheral, closeModal } = props;

  const renderDeviceModalListItem = useCallback(
    (item) => {
      return (
        <DeviceModalListItem
          item={item}
          connectToPeripheral={connectToPeripheral}
          closeModal={closeModal}
        />
      );
    },
    [closeModal, connectToPeripheral]
  );

  return (
    <Modal
      style={modalStyle.modalContainer}
      animationType="slide"
      transparent={false}
      visible={visible}
    >
      <SafeAreaView style={modalStyle.modalTitle}>
        <Text style={modalStyle.modalTitleText}>
          Tap on a device to connect
        </Text>
        <FlatList
          contentContainerStyle={modalStyle.modalFlatlistContiner}
          data={devices}
          renderItem={renderDeviceModalListItem}
        />
      </SafeAreaView>
    </Modal>
  );
};

const modalStyle = StyleSheet.create({
  ctaButton: {
    alignItems: "center",
    backgroundColor: colors.light_green,
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    marginBottom: 5,
    marginHorizontal: 20,
  },
  ctaButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  /* modalCellOutline: {
    alignItems: "center",
    borderColor: colors.black,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 20,
    paddingVertical: 15,
  }, */
  modalContainer: {
    backgroundColor: colors.dark_blue,
    flex: 1,
  },
  modalFlatlistContiner: {
    flex: 1,
    justifyContent: "center",
  },
  modalTitle: {
    backgroundColor: colors.primary,
    flex: 1,
  },
  modalTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 40,
    textAlign: "center",
  },
});

export default DeviceModal;
