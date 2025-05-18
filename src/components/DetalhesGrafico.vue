<template>
  <div>
    <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend
} from 'chart.js'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Title, Legend)

export default {
  name: 'DetalhesGrafico',
  components: { Bar },
  props: {
    pontos: {
      type: Array,
      required: true
    }
  },
  computed: {
    chartData() {
      if (!this.pontos.length) return null
      return {
        labels: this.pontos.map(p => p.datetime.slice(11, 16)),
        datasets: [
          {
            label: 'Consumo (L)',
            data: this.pontos.map(p => parseFloat(p.consumo_pontos)),
            backgroundColor: '#fff',
            borderColor: '#007bb8',
            borderWidth: 2,
            hoverBackgroundColor: '#b3e5fc',
            hoverBorderColor: '#007bb8',
          }
        ]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `Consumo: ${ctx.parsed.y.toFixed(3)} L`
            }
          },
          title: { display: false }
        },
        scales: {
          x: {
            title: { display: true, text: 'Horário' },
            ticks: { color: '#111' }
          },
          y: {
            title: { display: true, text: 'Consumo (L)' },
            beginAtZero: true,
            ticks: { color: '#111' }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
canvas {
  background: transparent;
  max-height: 180px;
}
</style>
