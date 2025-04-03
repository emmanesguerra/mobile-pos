import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { View, StyleSheet, Dimensions } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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
            <DrawerItem
                label="Sync Data"
                onPress={() => { props.navigation.navigate('sync') }}
                labelStyle={{ fontSize: 16, marginLeft: 20 }}
                style={styles.syncButton}
                icon={({ color, size }) => (
                    <MaterialCommunityIcons name="database-sync-outline" size={30} color={color} />
                )}
            />
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
    syncButton: {
        marginTop: 'auto',
        marginBottom: 10,
        paddingLeft: 15,
        backgroundColor: '#FFF',
        borderTopEndRadius: 30,
        borderBottomEndRadius: 30,
        borderTopStartRadius: 0,
        borderBottomStartRadius: 0,
    }
});