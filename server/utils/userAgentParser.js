// utils/userAgentParser.js
import DeviceDetector from "device-detector-js";

export const parseUserAgent = (userAgentString) => {
  const detector = new DeviceDetector();
  const result = detector.parse(userAgentString);

  // Extract browser, OS, and device information
  const browser = result.client.name || "Unknown";
  const os = result.os.name || "Unknown";
  const device = result.device.type || "Unknown";

  return {
    browser,
    os,
    device,
  };
};
