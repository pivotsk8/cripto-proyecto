<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import axios from 'axios';
import Alerta from './components/Alerta.vue';
import Spinner from './components/Spinner.vue';

const monedas = ref([
  { codigo: 'USD', texto: 'Dolar de Estados unidos' },
  { codigo: 'COL', texto: 'Peso Colombiano' },
  { codigo: 'EUR', texto: 'Euro' },
  { codigo: 'GBP', texto: 'Libra Esterlina' },
]);
const criptomonedas = ref([]);
const error = ref('');
//usamos reactive cuando es un objeto que conocemos las llaves y que no sean muchas y las podemos poner en el obj
const cotizar = reactive({
  moneda: '',
  criptomoneda: '',
});
//usamos ref para un obj cuando no conocemos las llaves o son muchas
const cotizacion = ref({});
const cargando = ref(false);
onMounted(async () => {
  criptomonedas.value = (
    await axios.get(
      'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD',
    )
  ).data.Data;
});

const cotizarCripto = () => {
  const obtenerCotizacion = async () => {
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
      aler(error);
    } finally {
      cargando.value = false;
    }
  };

  Object.values(cotizar).includes('')
    ? (error.value = 'Todos los campos son requeridos')
    : obtenerCotizacion();
  setTimeout(() => {
    error.value = '';
  }, 1000);
};

const mostrarResultado = computed(() => {
  return Object.values(cotizacion.value).length > 0;
});
</script>

<template>
  <div class="contenedor">
    <h1 class="titulo">
      Cotizador de
      <span>Criptomonedas</span>
    </h1>

    <div class="contenido">
      <Alerta v-if="error">
        {{ error }}
      </Alerta>
      <form class="formulario" @submit.prevent="cotizarCripto">
        <div class="campo">
          <label for="moneda">Moneda:</label>
          <select id="moneda" v-model="cotizar.moneda">
            <option value="">-- Selecciona --</option>
            <option v-for="moneda in monedas" :value="moneda.codigo">
              {{ moneda.texto }}
            </option>
          </select>
        </div>

        <div class="campo">
          <label for="cripto">Criptomoneda:</label>
          <select id="cripto" v-model="cotizar.criptomoneda">
            <option value="">-- Selecciona --</option>
            <option
              v-for="criptomoneda in criptomonedas"
              :value="criptomoneda.CoinInfo.Name">
              {{ criptomoneda.CoinInfo.FullName }}
            </option>
          </select>
        </div>
        <input type="submit" value="Cotizar" />
      </form>

      <Spinner v-if="cargando" />

      <div v-if="mostrarResultado" class="contenedor-resultado">
        <h2>Cotizacion:</h2>

        <div class="resultado">
          <img
            :src="`http://cryptocompare.com/${cotizacion.IMAGEURL}`"
            alt="Imagen cripto" />
          <div>
            <p>
              El precio es de:
              <span>{{ cotizacion.PRICE }}</span>
            </p>
            <p>
              Precio mas alto del dia:
              <span>{{ cotizacion.HIGHDAY }}</span>
            </p>
            <p>
              Precio mas bajo del dia:
              <span>{{ cotizacion.LOWDAY }}</span>
            </p>
            <p>
              Variacion ultimas 24 horas:
              <span>{{ cotizacion.CHANGEPCT24HOUR }}%</span>
            </p>
            <p>
              Ultima Actualizacion:
              <span>{{ cotizacion.LASTUPDATE }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
