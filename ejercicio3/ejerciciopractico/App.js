import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, ActivityIndicator, View, FlatList, Image } from 'react-native';
import axios from 'axios';

const POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=20'; // Limitar a 20 Pokémon para la demostración

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    try {
      const response = await axios.get(POKE_API_URL);
      const data = response.data.results;

      // Obtener detalles de cada Pokémon
      const pokemonDetails = await Promise.all(data.map(async (pokemon) => {
        const detailResponse = await axios.get(pokemon.url);
        return detailResponse.data;
      }));

      setPokemons(pokemonDetails);
    } catch (error) {
      console.error('Error al cargar los Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <FlatList
          data={pokemons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.pokemonContainer}>
              <Image source={{ uri: item.sprites.front_default }} style={styles.pokemonImage} />
              <Text style={styles.pokemonName}>{item.name}</Text>
            </View>
          )}
        />
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
  pokemonContainer: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
  },
  pokemonImage: {
    width: 100,
    height: 100,
  },
  pokemonName: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
});
