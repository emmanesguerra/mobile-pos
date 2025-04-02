import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomDrawer from '@/components/CustomDrawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';

const DrawerScreen = ({ title, icon }: any) => {
  const IconComponent = icon;
  return (
    <Drawer.Screen
      name="index"
      options={{
        drawerLabel: title,
        title: 'POS',
        drawerIcon: ({ color, size }) => (
          <IconComponent name={icon.name} size={size} color={color} />
        ),
      }} />
  )
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F00' }}>
      <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: 'transparent', // Optional: Change background color
            borderTopLeftRadius: 20, // Optional: Rounded corners
            borderBottomLeftRadius: 20,
            marginTop: 70,
          }
        }}>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'POS',
            title: 'POS',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="storefront-outline" size={24} color={color} />
            ),
          }} />
        <Drawer.Screen
          name="sales"
          options={{
            drawerLabel: 'Transaction History',
            title: 'Transaction History',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="history" size={size} color={color} />
            ),
          }} />
        <Drawer.Screen
          name="inventory-list"
          options={{
            drawerLabel: 'Products List',
            title: 'Products List',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="bag-handle-outline" size={24} color={color} />
            ),
          }} />
        <Drawer.Screen
          name="inventory-form"
          options={{
            drawerLabel: 'Add Products',
            title: 'Add Products',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="bag-add-outline" size={24} color={color} />
            ),
          }} />
          <Drawer.Screen
            name="sync"
            options={{
              drawerLabel: 'Sync Data',
              title: 'Sync Data',
              drawerItemStyle: {
                display: "none"
              }
            }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
