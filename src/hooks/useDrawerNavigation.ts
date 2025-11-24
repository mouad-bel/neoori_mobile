import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../types';

export const useDrawerNavigation = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  
  const openDrawer = () => {
    // Try to access drawer from parent navigator if nested
    const drawer = navigation.getParent('Drawer') || navigation;
    if (drawer && 'openDrawer' in drawer) {
      drawer.openDrawer();
    } else {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  };

  const closeDrawer = () => {
    const drawer = navigation.getParent('Drawer') || navigation;
    if (drawer && 'closeDrawer' in drawer) {
      drawer.closeDrawer();
    } else {
      navigation.dispatch(DrawerActions.closeDrawer());
    }
  };

  return {
    ...navigation,
    openDrawer,
    closeDrawer,
  };
};

