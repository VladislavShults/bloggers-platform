export const extractDeviceIdFromRefreshToken = (
  refreshToken: string,
): string | undefined => {
  const splitRefreshToken = refreshToken.split('.');
  const splitPayloadToken = atob(splitRefreshToken[1]).split(',');
  const splitDeviceId = splitPayloadToken[1].split(':');
  const deviceId = splitDeviceId[1].replace('"', '').replace('"', '');
  if (splitRefreshToken.length === 3 && deviceId) {
    return deviceId;
  }
};
