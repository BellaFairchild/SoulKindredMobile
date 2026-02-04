import React from 'react';
import { View, Text } from 'react-native';

export default function TestRoot() {
    return (
        <View style={{ flex: 1, backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>SRC ROOT WORKING</Text>
            <Text>App folder bypassed.</Text>
        </View>
    );
}
