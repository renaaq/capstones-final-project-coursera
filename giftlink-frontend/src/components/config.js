const urlConfig = {
  backendUrl: process.env.REACT_APP_BACKEND_URL,
};

console.log(`backendUrl in config.js: ${urlConfig.backendUrl}`);

export { urlConfig };