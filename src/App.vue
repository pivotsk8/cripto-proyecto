<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import Alerta from './components/Alerta.vue';

const monedas = ref([
  { codigo: 'USD', texto: 'Dolar de Estados unidos' },
  { codigo: 'COL', texto: 'Peso Colombiano' },
  { codigo: 'EUR', texto: 'Euro' },
  { codigo: 'GBP', texto: 'Libra Esterlina' },
]);
const criptomonedas = ref([]);
const cotizar = reactive({
  moneda: '',
  criptomoneda: '',
});
const error = ref('');
onMounted(async () => {
  criptomonedas.value = (
    await axios.get(
      'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD',
    )
  ).data.Data;
});

const cotizarCripto = () => {
  Object.values(cotizar).includes('')
    ? (error.value = 'Todos los campos son requeridos')
    : null;
  setTimeout(() => {
    error.value = '';
  }, 1000);
};
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
    </div>
  </div>
</template>
