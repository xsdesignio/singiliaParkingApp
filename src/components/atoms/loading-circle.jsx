import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { colors } from '../../styles/colorPalette';


export default function LoadingCircle () {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={colors.green} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
