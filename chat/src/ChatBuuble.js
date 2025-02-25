import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatBuuble = ({ message }) => {
  return (
    <View style={[styles.bubble, message.type === 'user' ? styles.userBubble : styles.botBubble]}>
      <Text style={styles.text}>{message.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  userBubble: {
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#E0E0E0',
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
  },
});

export default ChatBuuble;
