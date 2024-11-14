
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export interface LocationParameters {
    location:Location.LocationGeocodedAddress | undefined;
    locationCords: {latitude:number,longitude:number,latitudeDelta:number,longitudeDelta:number};
    errorMsg: string | null;
}
const useLocation = ():LocationParameters => {
  const [location, setLocation] = useState<Location.LocationGeocodedAddress>();
  const [locationCords, setLocationCords] = useState<{latitude:number,longitude:number,latitudeDelta:number,longitudeDelta:number}>();
  const [errorMsg, setErrorMsg] = useState<any>();

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      
      const locationCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setLocationCords(locationCoords);
      let regionName = await Location.reverseGeocodeAsync(locationCoords);
      setLocation(regionName[0]);
    };
    
    requestLocationPermission();
  }, []);
  //@ts-ignore
  return { location, locationCords, errorMsg };
};

export default useLocation;
