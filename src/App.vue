<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const monedas = ref([
  { codigo: 'USD', texto: 'Dolar de Estados unidos' },
  { codigo: 'COL', texto: 'Peso Colombiano' },
  { codigo: 'EUR', texto: 'Euro' },
  { codigo: 'GBP', texto: 'Libra Esterlina' },
]);
const criptomonedas = ref([])
onMounted(async () => {
  criptomonedas.value = (
    await axios.get(
      'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD',
    )
  ).data.Data;
console.log(criptomonedas.value)
});
</script>

<template>
  <div class="contenedor">
    <h1 class="titulo">
      Cotizador de
      <span>Criptomonedas</span>
    </h1>

    <div class="contendor">
      <form class="formulario">
        <div class="campo">
          <label for="moneda">Moneda:</label>
          <select id="moneda">
            <option value="">-- Selecciona --</option>
            <option v-for="moneda in monedas" :value="moneda.codigo">
              {{ moneda.texto }}
            </option>
          </select>
        </div>
      </form>
    </div>
  </div>
</template>
