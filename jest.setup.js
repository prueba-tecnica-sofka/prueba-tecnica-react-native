import '@testing-library/react-native';  
  
// Mock de react-native modules  
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), {
	virtual: true,
});