import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { BarChart } from 'react-native-chart-kit';

const Chatbot = () => {
  const [archivo, setArchivo] = useState(null);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        colors: [(opacity) => `rgba(134, 65, 244, ${opacity})`],
        label: 'Datos',
      },
    ],
  });
  const [prompt, setPrompt] = useState('');
  const [resumen, setResumen] = useState('');

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const uri = result.assets && result.assets[0] && result.assets[0].uri;
        if (uri) {
          setArchivo(uri);
        } else {
          console.log('El URI del archivo es inválido');
        }
      } else {
        console.log('Selección de archivo cancelada');
      }
    } catch (err) {
      console.error('Error al seleccionar el archivo:', err);
    }
  };

  const procesarData = async () => {
    try {
      const file = await FileSystem.readAsStringAsync(archivo, { encoding: FileSystem.EncodingType.Base64 });
      const workbook = XLSX.read(file, { type: 'base64' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      let jsonData = XLSX.utils.sheet_to_json(worksheet);

      setData(jsonData.slice(0, 5));

      const tipoMuerteCounts = {};
      jsonData.forEach((item) => {
        const tipo = item.tipo_muerrte || 'N/A';
        tipoMuerteCounts[tipo] = (tipoMuerteCounts[tipo] || 0) + 1;
      });

      const labels = Object.keys(tipoMuerteCounts);
      const values = Object.values(tipoMuerteCounts);

      setChartData({
        labels,
        datasets: [
          {
            data: values,
            colors: [(opacity) => `rgba(134, 65, 244, ${opacity})`],
            label: 'Tipos de Muerte',
          },
        ],
      });

      const resultadosProcesados = procesarArchivoConPrompt(jsonData, prompt);
      setResumen(resultadosProcesados);
      console.log('Resultados procesados:', resultadosProcesados);
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
    }
  };

  const procesarArchivoConPrompt = (jsonData, prompt) => {
    if (prompt.toLowerCase().includes('resumen') && prompt.toLowerCase().includes('gráfica')) {
      const resumen = `El archivo contiene ${jsonData.length} registros. Los tipos de muerte más comunes son: ${Object.keys(jsonData.reduce((acc, curr) => {
        acc[curr.tipo_muerrte] = (acc[curr.tipo_muerrte] || 0) + 1;
        return acc;
      }, {})).join(', ')}`;
      return resumen;
    } else {
      return 'No se encontró un resumen adecuado para el prompt.';
    }
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0, // Asegura que no haya decimales en los valores
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Chatbot para Procesar Archivos Excel</Text>
      <Button title="Subir Archivo Excel" onPress={handleFilePick} style={styles.boton} />
      <Text style={styles.etiqueta}>Ingrese el prompt:</Text>
      <TextInput
        value={prompt}
        onChangeText={(text) => setPrompt(text)}
        style={styles.input}
      />
      <Button title="Procesar Archivo" onPress={procesarData} style={styles.boton} />
      {data.length > 0 && (
        <View style={styles.resultados}>
          <Text style={styles.etiqueta}>Datos del archivo:</Text>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <View style={styles.fila}>
                <Text>{`Tipo: ${item.tipo_muerrte || 'N/A'}`}</Text>
                <Text>{`Zona: ${item.zona || 'N/A'}`}</Text>
                <Text>{`Subzona: ${item.subzona || 'N/A'}`}</Text>
                <Text>{`Distrito: ${item.distrito || 'N/A'}`}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <Text style={styles.etiqueta}>Resumen:</Text>
          <Text style={styles.resumen}>{resumen}</Text>
          <BarChart
            data={chartData}
            width={350}
            height={250}
            chartConfig={chartConfig}
            style={styles.grafica}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  titulo: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  boton: {
    marginBottom: 10,
    backgroundColor: '#007bff',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  etiqueta: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  resultados: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  resumen: {
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
  },
  grafica: {
    marginTop: 10,
    borderRadius: 5,
  },
});

export default Chatbot;
