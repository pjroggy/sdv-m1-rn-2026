declare module 'react-native-maps' {
  import { ComponentType } from 'react';
  import { ViewProps } from 'react-native';
  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }
  export interface MapViewProps extends ViewProps {
    region?: Region;
    style?: any;
    children?: React.ReactNode;
  }
  export const Marker: ComponentType<any>;
  const MapView: ComponentType<MapViewProps>;
  export default MapView;
}
