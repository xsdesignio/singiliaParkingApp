import React from 'react';
import { View } from 'react-native';

import Menu from "../src/components/menu";
import Header from "../src/components/header";
import BulletinsScreen from "../src/screens/BulletinsScreen";

export default function bulletinsView() {

    return(<View>
        <Header/>
        <BulletinsScreen/>
        <Menu/>
    </View>)
}


