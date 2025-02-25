import React from 'react';
import { View, StyleSheet } from 'react-native';
import Chatbot from './src/Chatbot';

const App = () => {
  return (
    <View style={styles.container}>
      <Chatbot />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-end',
  },
});

export default App;
