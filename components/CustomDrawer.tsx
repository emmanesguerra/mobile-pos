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
                    style={styles.drawerItem}
                />

            </DrawerContentScrollView>

            <View style={[styles.drawerFlex,]}>
                <DrawerItem
                    label="Sync Data"
                    onPress={() => { props.navigation.navigate('sync') }}
                    style={styles.logoutButton}
                    icon={({ color, size }) => (
                        <MaterialCommunityIcons name="database-sync-outline" size={size} color={color} />
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
        backgroundColor: '#FFF',
        paddingTop: 30,
        paddingBottom: 30,
        borderTopEndRadius: 30,
        borderBottomEndRadius: 30,
    },
    submenuContainer: {
        paddingLeft: 20,
        backgroundColor: '#FFF',
        borderRadius: 5,
        paddingVertical: 5, 
    },
    drawerItem: {
        marginTop: 50
    },
    logoutButton: {
        marginTop: 'auto',
        backgroundColor: '#FFF',
        borderTopEndRadius: 30,
        borderBottomEndRadius: 30,
        borderTopStartRadius: 0,
        borderBottomStartRadius: 0,
    }
});