import React from 'react';

import PrintingSettingsScreen from '../../src/screens/PrintingSettingsScreen.jsx';

import Menu from "../../src/components/menu.jsx";
import Header from "../../src/components/header.jsx";
import { View } from 'react-native';


export default function PrintingSettingsView() {
  return (
    <View>
      <Header/>
      <PrintingSettingsScreen/>
      <Menu/>
    </View>
    
  );
}