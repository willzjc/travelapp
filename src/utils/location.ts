/**
 * Gets the current location and converts it to a readable address
 * @returns Promise that resolves to a human-readable address
 */
export const getCurrentLocation = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    // Handle iOS permission issues
    const handlePermissionError = (error: GeolocationPositionError) => {
      if (error.code === error.PERMISSION_DENIED) {
        reject(
          new Error(
            'Location permission denied. Please enable location services in your device settings.'
          )
        );
      } else if (error.code === error.TIMEOUT) {
        reject(new Error('Location request timed out. Please try again.'));
      } else {
        reject(new Error('Unable to retrieve your location. Please try again later.'));
      }
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use reverse geocoding to get a human-readable address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          if (!response.ok) {
            throw new Error('Failed to get address from coordinates');
          }

          const data = await response.json();
          const address = data.display_name;
          resolve(address);
        } catch (error) {
          // If geocoding fails, return coordinates as fallback
          resolve(`${latitude}, ${longitude}`);
        }
      },
      handlePermissionError,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};
