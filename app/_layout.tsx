import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomDrawer from '@/components/CustomDrawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { initializeDatabase } from '@/src/database/init';
import { SQLiteProvider } from 'expo-sqlite';
import { SettingsProvider } from '@/src/contexts/SettingsContext';


const getDrawerOptions = (label: string, icon: any) => ({
  drawerLabel: label,
  title: label,
  drawerIcon: ({ color, size }: { color: string; size: number }) => (
    <icon.component name={icon.name} size={30} color={color} />
  )
});

export default function Layout() {

  return (
    <SQLiteProvider databaseName="pos_system.db" onInit={initializeDatabase}>
      <SettingsProvider>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F00' }}>
          <Drawer
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
              drawerStyle: {
                backgroundColor: 'transparent',
                marginTop: 65,
              },
              overlayColor: 'rgba(241, 217, 195, 0.5)',
              drawerLabelStyle: { fontSize: 16, marginLeft: 20 },
            }}
          >
            <Drawer.Screen
              name="index"
              options={getDrawerOptions(
                "POS",
                {
                  name: "storefront-outline",
                  component: Ionicons
                })}
            />
            <Drawer.Screen
              name="sales"
              options={getDrawerOptions(
                "Transaction History",
                {
                  name: "history",
                  component: MaterialCommunityIcons
                })}
            />
            <Drawer.Screen
              name="inventory-list"
              options={getDrawerOptions(
                "Products List",
                {
                  name: "bag-handle-outline",
                  component: Ionicons
                })}
            />
            <Drawer.Screen
              name="inventory-form"
              options={getDrawerOptions(
                "Add Products",
                {
                  name: "bag-add-outline",
                  component: Ionicons
                })}
            />
            <Drawer.Screen
              name="settings"
              options={{
                title: "Application Settings",
                drawerItemStyle: { display: "none" }
              }} />
            <Drawer.Screen
              name="sync"
              options={{
                title: "Sync Data",
                drawerItemStyle: { display: "none" }
              }} />
          </Drawer>
        </GestureHandlerRootView>
      </SettingsProvider>
    </SQLiteProvider>
  );
}
