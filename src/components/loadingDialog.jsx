// LoadingDialog.js
import React from 'react';
import { Modal, ActivityIndicator, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from 'react-native-paper';

import { colors } from '../styles/colorPalette';

const LoadingDialog = ({ visible }) => {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent>
      <View style={styles.modalContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    </Modal>
  );
};

// Add prop validation for the 'visible' prop
LoadingDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
};


const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    backgroundColor: colors.light_green,
    flex: 1,
    justifyContent: 'center',
  },
});

export default LoadingDialog;
