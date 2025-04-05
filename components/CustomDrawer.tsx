import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { View, StyleSheet, Dimensions } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

export default function CustomDrawer(props: any) {

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.drawerContainer}
            >
                {/* Default Drawer Items */}
                <DrawerItemList
                    {...props}
                />
            </DrawerContentScrollView>

            <View style={[styles.drawerContainer, styles.drawerBottomContainer]}>
                <DrawerItem
                    label="Settings"
                    onPress={() => { props.navigation.navigate('settings') }}
                    labelStyle={{ fontSize: 14, marginLeft: 10 }}
                    style={styles.syncButton}
                    icon={({ color, size }) => (
                        <MaterialIcons name="settings" size={20} color={color} />
                    )}
                />
                <View style={styles.divider} />
                <DrawerItem
                    label="Sync Data"
                    onPress={() => { props.navigation.navigate('sync') }}
                    labelStyle={{ fontSize: 14, marginLeft: 10 }}
                    style={styles.syncButton}
                    icon={({ color, size }) => (
                        <MaterialCommunityIcons name="database-sync-outline" size={20} color={color} />
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerFlex: {
        flex: 1
    },
    drawerContainer: {
        backgroundColor: 'rgb(255, 255, 255)',
        paddingTop: 30,
        paddingBottom: 30,
        borderTopEndRadius: 30,
        borderBottomEndRadius: 30,
    },
    drawerBottomContainer: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    syncButton: {
        marginVertical: 0,
        backgroundColor: '#FFF',
        borderRadius: 30
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 0,
    },
});