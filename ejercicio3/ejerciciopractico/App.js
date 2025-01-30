import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, ActivityIndicator, View, FlatList, Button } from 'react-native';
import axios from 'axios';

const JOKE_API_URL = 'https://v2.jokeapi.dev/joke/Any?lang=es';

export default function App() {
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJoke();
  }, []);

  const fetchJoke = async () => {
    try {
      const response = await axios.get(JOKE_API_URL);
      const data = response.data;

      if (data.type === 'single') {
        setJokes((prevJokes) => [...prevJokes, { joke: data.joke }]);
      } else if (data.type === 'twopart') {
        setJokes((prevJokes) => [...prevJokes, { joke: `${data.setup}\n\n${data.delivery}` }]);
      }
    } catch (error) {
      console.error('Error al cargar la broma:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <>
          <FlatList
            data={jokes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.jokeContainer}>
                <Text style={styles.joke}>{item.joke}</Text> {/* Asegúrate de que cada broma esté dentro de <Text> */}
              </View>
            )}
          />
          <Button title="Agregar Broma" onPress={fetchJoke} />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  jokeContainer: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    width: '100%',
  },
  joke: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
});
