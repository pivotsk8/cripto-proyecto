//Es una funcion que encapsula y reutiliza la logica y el state
//Siempre son funciones e inician con use
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
export default function useCripto() {
  const criptomonedas = ref([]);
  //usamos ref para un obj cuando no conocemos las llaves o son muchas
  const cotizacion = ref({});
const cargando = ref(false);
  const monedas = ref([
    { codigo: 'USD', texto: 'Dolar de Estados unidos' },
    { codigo: 'COL', texto: 'Peso Colombiano' },
    { codigo: 'EUR', texto: 'Euro' },
    { codigo: 'GBP', texto: 'Libra Esterlina' },
  ]);

  const obtenerCotizacion = async (cotizar) => {
    cargando.value = true;
    cotizacion.value = {};
    try {
      const { moneda, criptomoneda } = cotizar;
      const url = (
        await axios.get(
          `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`,
        )
      ).data.DISPLAY[criptomoneda][moneda];
      //con la sintaxis del la linea 40 puedo itinerar el objeto pasando variables
      cotizacion.value = url;
    } catch (error) {
      alert(error);
    } finally {
      cargando.value = false;
    }
  };
  onMounted(async () => {
    criptomonedas.value = (
      await axios.get(
        'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD',
      )
    ).data.Data;
  });

  const mostrarResultado = computed(() => {
    return Object.values(cotizacion.value).length > 0;
  });

  return {
    monedas,
    criptomonedas,
    cotizacion,
    cargando,
    obtenerCotizacion,
    mostrarResultado,
  };
}
