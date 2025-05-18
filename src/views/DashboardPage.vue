<template>
  <div class="dashboardpage">
    <Sidebar />
    <div class="dashboard-content">
      <section class="dashboard-row">
        <!-- Coluna Esquerda: Consumo Diário (em cima) e Cobertura (embaixo) -->
        <section class="dashboard-col dashboard-col-left">
          <section class="Quadro1">
            <section class="titulo_quadro">Consumo - Diário</section>
            <div v-if="consumoDiario">
              <div class="consumo-dia consumo-branco">{{ consumoDiario.datetime }}</div>
              <div class="consumo-volume consumo-branco">{{ consumoDiario.volume_diario }} m3</div>
              <div v-if="consumoAnterior" class="consumo-anterior-box">
                <div class="consumo-anterior-titulo">Dia anterior:</div>
                <div class="consumo-anterior-data">{{ consumoAnterior.datetime }}</div>
                <div class="consumo-anterior-volume">{{ consumoAnterior.volume_diario }} m3</div>
              </div>
            </div>
            <div v-else>
              <div class="texto_normal consumo-branco">Carregando dados...</div>
            </div>
          </section>
          <section class="Quadro3">
            <section class="titulo_quadro">Resumo - Consumo Diário</section>
            <div v-if="ultimosConsumos.length > 0" class="resumo-lista">
              <div v-for="(item, idx) in ultimosConsumos" :key="item.id_consumo_diario"
                   :class="['resumo-item', idx % 2 === 0 ? 'resumo-item-claro' : 'resumo-item-escuro']">
                <span class="resumo-dia">{{ item.datetime }}</span>
                <span class="resumo-volume">{{ item.volume_diario }} m³</span>
              </div>
            </div>
            <div v-else class="resumo-lista resumo-vazio consumo-branco">Carregando...</div>
          </section>
        </section>
        <!-- Coluna Direita: Detalhes (ocupa toda a altura da coluna) -->
        <section class="dashboard-col dashboard-col-right">
          <section class="Quadro2 quadro-detalhes-vertical">
            <div class="detalhes-header">
              <section class="titulo_quadro">Detalhes</section>
              <button class="btn-atualizar" @click="atualizarDetalhes" title="Atualizar Detalhes">
                &#x21bb;
              </button>
            </div>
            <div class="detalhes-container">
              <!-- Legenda do gráfico -->
              <div class="grafico-legenda">
                <h4>Consumo por Pontos Diários</h4>
                <p>Volume de água consumido ao longo do dia (em m³)</p>
              </div>
              
              <svg class="timeline-svg-horizontal" width="100%" height="250" viewBox="0 0 600 250" style="display:block;">
                <!-- Fundo -->
                <rect x="0" y="0" width="600" height="250" fill="#eaf6fb" />
                
                <!-- Grid -->
                <g stroke="#fff" stroke-width="1">
                  <!-- Linhas horizontais (para valores) -->
                  <line v-for="i in 5" :key="'h'+i" :y1="20 + (i-1)*42" :y2="20 + (i-1)*42" x1="80" x2="580" />
                  <!-- Linhas verticais (para tempo) -->
                  <line v-for="i in 6" :key="'v'+i" :x1="80 + (i-1)*100" :x2="80 + (i-1)*100" y1="20" y2="180" />
                </g>
                
                <!-- Eixos -->
                <line x1="80" y1="20" x2="80" y2="180" stroke="#007bb8" stroke-width="3" />
                <line x1="80" y1="180" x2="580" y2="180" stroke="#007bb8" stroke-width="3" />
                
                <!-- Labels do eixo Y (volumes) - dinâmico baseado nos dados -->
                <text v-if="pontosHorizontais.length > 0" x="70" y="40" font-size="13" fill="#007bb8" text-anchor="end">
                  {{ maxValorGrafico }}
                </text>
                <text v-if="pontosHorizontais.length > 0" x="70" y="100" font-size="13" fill="#007bb8" text-anchor="end">
                  {{ valorMedioGrafico }}
                </text>
                <text v-if="pontosHorizontais.length > 0" x="70" y="160" font-size="13" fill="#007bb8" text-anchor="end">
                  {{ minValorGrafico }}
                </text>
                
                <!-- Labels do eixo X (horários) -->
                <text v-for="(p, i) in pontosHorizontais" :key="'x-label'+i" 
                      :x="p.x" y="210" font-size="13" fill="#007bb8" text-anchor="middle">
                  {{ p.hora }}
                </text>
                
                <!-- Linha conectando os pontos -->
                <polyline :points="polylinePointsHorizontal" fill="none" stroke="#007bb8" stroke-width="3" />
                
                <!-- Pontos -->
                <g class="timeline-point" v-for="(p, i) in pontosHorizontais" :key="i">
                  <circle :cx="p.x" :cy="p.y" r="7" fill="#fff" stroke="#007bb8" stroke-width="3" 
                          @mouseenter="showTooltipHorizontal(i)" @mouseleave="hideTooltip" 
                          class="ponto-interativo" />
                </g>
              </svg>
              
              <!-- Detalhes do ponto selecionado (aproveitando espaço embaixo) -->
              <div class="detalhes-ponto">
                <div v-if="tooltip.show" class="ponto-detalhes">
                  <div class="ponto-info">
                    <span class="ponto-horario">{{ tooltip.ponto.hora }}</span>
                    <span class="ponto-valor">{{ tooltip.ponto.valor }} m³</span>
                  </div>
                  <div class="ponto-descricao">
                    Consumo registrado às {{ tooltip.ponto.hora }}
                  </div>
                </div>
                <div v-else class="ponto-placeholder">
                  <span>Passe o mouse sobre um ponto para ver os detalhes</span>
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>
      <section class="linha3">
        <section class="Quadro5 quadro-analise-diaria">
          <section class="titulo_quadro">Análise - Consumo Diário</section>
          <div class="analise-flex">
            <div class="analise-lista">
              <div v-for="(item, idx) in ultimosConsumos" :key="item.id_consumo_diario"
                   :class="['analise-item', idx % 2 === 0 ? 'analise-item-claro' : 'analise-item-escuro', item.id_consumo_diario === analiseSelecionadoId ? 'analise-item-selecionado' : '']"
                   @click="selecionarAnalise(item.id_consumo_diario)">
                <span class="analise-dia">{{ item.datetime }}</span>
                <span class="analise-volume">{{ item.volume_diario }} m³</span>
              </div>
            </div>
            <div class="analise-grafico">
              <div class="grafico-legenda grafico-legenda-analise">
                <h4>Consumo por Pontos Diários</h4>
                <p>Volume de água consumido ao longo do dia (em m³)</p>
              </div>
              <svg class="timeline-svg-horizontal" width="100%" height="250" viewBox="0 0 600 250" style="display:block;">
                <rect x="0" y="0" width="600" height="250" fill="#eaf6fb" />
                <g stroke="#fff" stroke-width="1">
                  <line v-for="i in 5" :key="'h'+i" :y1="20 + (i-1)*42" :y2="20 + (i-1)*42" x1="80" x2="580" />
                  <line v-for="i in 6" :key="'v'+i" :x1="80 + (i-1)*100" :x2="80 + (i-1)*100" y1="20" y2="180" />
                </g>
                <line x1="80" y1="20" x2="80" y2="180" stroke="#007bb8" stroke-width="3" />
                <line x1="80" y1="180" x2="580" y2="180" stroke="#007bb8" stroke-width="3" />
                <text v-if="analisePontosHorizontais.length > 0" x="70" y="40" font-size="13" fill="#007bb8" text-anchor="end">
                  {{ analiseMaxValorGrafico }}
                </text>
                <text v-if="analisePontosHorizontais.length > 0" x="70" y="100" font-size="13" fill="#007bb8" text-anchor="end">
                  {{ analiseValorMedioGrafico }}
                </text>
                <text v-if="analisePontosHorizontais.length > 0" x="70" y="160" font-size="13" fill="#007bb8" text-anchor="end">
                  {{ analiseMinValorGrafico }}
                </text>
                <text v-for="(p, i) in analisePontosHorizontais" :key="'x-label-analise'+i"
                      :x="p.x" y="210" font-size="13" fill="#007bb8" text-anchor="middle">
                  {{ p.hora }}
                </text>
                <polyline :points="analisePolylinePointsHorizontal" fill="none" stroke="#007bb8" stroke-width="3" />
                <g class="timeline-point" v-for="(p, i) in analisePontosHorizontais" :key="i">
                  <circle :cx="p.x" :cy="p.y" r="7" fill="#fff" stroke="#007bb8" stroke-width="3"
                          @mouseenter="showTooltipAnalise(i)" @mouseleave="hideTooltipAnalise"
                          class="ponto-interativo" />
                </g>
              </svg>
              <div class="detalhes-ponto">
                <div v-if="analiseTooltip.show" class="ponto-detalhes">
                  <div class="ponto-info">
                    <span class="ponto-horario">{{ analiseTooltip.ponto.hora }}</span>
                    <span class="ponto-valor">{{ analiseTooltip.ponto.valor }} m³</span>
                  </div>
                  <div class="ponto-descricao">
                    Consumo registrado às {{ analiseTooltip.ponto.hora }}
                  </div>
                </div>
                <div v-else class="ponto-placeholder">
                  <span>Passe o mouse sobre um ponto para ver os detalhes</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/SidebarMenu.vue'

export default {
  name: 'DashboardPage',
  components: {
    Sidebar
  },
  data() {
    return {
      temperatura: '28°C',
      consumoDiario: null,
      consumoAnterior: null,
      ultimosConsumos: [],
      detalhes: null,
      pontosConsumo: [], // Array dos pontos reais da API
      pontosHorizontais: [], // Array processado para o gráfico
      analiseSelecionadoId: null,
      analisePontos: [],
      analisePontosHorizontais: [],
      tooltip: {
        show: false,
        x: 0,
        y: 0,
        ponto: {}
      },
      analiseTooltip: { show: false, ponto: {} }
    }
  },
  mounted() {
    fetch('https://watergame.gabrieltomazini.com/api/v1/consumo-diario/')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          data.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
          this.consumoDiario = data[0];
          this.consumoAnterior = data.length > 1 ? data[1] : null;
          this.ultimosConsumos = data.slice(0, 7);
          // Buscar detalhes do consumo diário
          return fetch(`https://watergame.gabrieltomazini.com/api/v1/consumo-diario/${data[0].id_consumo_diario}/detalhado`)
            .then(res => res.json())
            .then(detalhes => {
              this.detalhes = detalhes;
              this.pontosConsumo = detalhes.pontos_consumo || [];
              this.processarPontosParaGrafico();
            });
        }
      })
      .catch(() => {
        this.consumoDiario = null;
        this.consumoAnterior = null;
        this.ultimosConsumos = [];
        this.detalhes = null;
        this.pontosConsumo = [];
        this.pontosHorizontais = [];
      });

      // Seleciona o mais recente por padrão
      this.$nextTick(() => {
        if (this.ultimosConsumos.length > 0) {
          this.selecionarAnalise(this.ultimosConsumos[0].id_consumo_diario);
        }
      });
  },
  computed: {
    polylinePointsVertical() {
      return [];
    },
    polylinePointsHorizontal() {
      return this.pontosHorizontais.map(p => `${p.x},${p.y}`).join(' ');
    },
    maxValorGrafico() {
      if (!this.pontosConsumo || this.pontosConsumo.length === 0) return '0.00';
      const max = Math.max(...this.pontosConsumo.map(p => parseFloat(p.consumo_pontos)));
      return max.toFixed(3);
    },
    minValorGrafico() {
      if (!this.pontosConsumo || this.pontosConsumo.length === 0) return '0.00';
      const min = Math.min(...this.pontosConsumo.map(p => parseFloat(p.consumo_pontos)));
      return min.toFixed(3);
    },
    valorMedioGrafico() {
      if (!this.pontosConsumo || this.pontosConsumo.length === 0) return '0.00';
      const max = parseFloat(this.maxValorGrafico);
      const min = parseFloat(this.minValorGrafico);
      return ((max + min) / 2).toFixed(3);
    },
    analisePolylinePointsHorizontal() {
      return this.analisePontosHorizontais.map(p => `${p.x},${p.y}`).join(' ');
    },
    analiseMaxValorGrafico() {
      if (!this.analisePontos || this.analisePontos.length === 0) return '0.00';
      const max = Math.max(...this.analisePontos.map(p => parseFloat(p.consumo_pontos)));
      return max.toFixed(3);
    },
    analiseMinValorGrafico() {
      if (!this.analisePontos || this.analisePontos.length === 0) return '0.00';
      const min = Math.min(...this.analisePontos.map(p => parseFloat(p.consumo_pontos)));
      return min.toFixed(3);
    },
    analiseValorMedioGrafico() {
      if (!this.analisePontos || this.analisePontos.length === 0) return '0.00';
      const max = parseFloat(this.analiseMaxValorGrafico);
      const min = parseFloat(this.analiseMinValorGrafico);
      return ((max + min) / 2).toFixed(3);
    }
  },
  methods: {
    processarPontosParaGrafico() {
      if (!this.pontosConsumo || this.pontosConsumo.length === 0) {
        this.pontosHorizontais = [];
        return;
      }

      // Ordenar pontos por datetime
      const pontosOrdenados = [...this.pontosConsumo].sort((a, b) => 
        new Date(a.datetime) - new Date(b.datetime)
      );

      // Encontrar valores min e max para escalonamento
      const valores = pontosOrdenados.map(p => parseFloat(p.consumo_pontos));
      const minValor = Math.min(...valores);
      const maxValor = Math.max(...valores);
      
      // Configurações do gráfico
      const larguraGrafico = 500; // 580 - 80 = espaço útil
      const alturaGrafico = 140; // 180 - 40 = espaço útil 
      const margemX = 80;
      const margemYTop = 40;
      const margemYBottom = 180;

      // Processar cada ponto
      this.pontosHorizontais = pontosOrdenados.map((ponto, index) => {
        // Posição X baseada no índice (distribuição uniforme)
        let x;
        if (pontosOrdenados.length === 1) {
          x = margemX + larguraGrafico / 2; // Centralizar se apenas um ponto
        } else {
          x = margemX + (index * larguraGrafico) / (pontosOrdenados.length - 1);
        }
        
        // Posição Y baseada no valor (escalonamento)
        let y;
        if (maxValor === minValor) {
          y = margemYTop + alturaGrafico / 2; // Centralizar se todos valores iguais
        } else {
          const proporcao = (parseFloat(ponto.consumo_pontos) - minValor) / (maxValor - minValor);
          y = margemYBottom - (proporcao * alturaGrafico);
        }

        // Extrair hora do datetime
        const hora = new Date(ponto.datetime).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        });

        return {
          x: x,
          y: y,
          hora: hora,
          valor: ponto.consumo_pontos,
          datetime: ponto.datetime
        };
      });
    },
    showTooltipVertical() {
      // Manter função para compatibilidade
    },
    showTooltipHorizontal(i) {
      const ponto = this.pontosHorizontais[i];
      this.tooltip = {
        show: true,
        x: 0,
        y: 0,
        ponto
      };
    },
    hideTooltip() {
      this.tooltip.show = false;
    },
    atualizarDetalhes() {
      // Lógica para atualizar os detalhes, se necessário
      if (this.consumoDiario && this.consumoDiario.id_consumo_diario) {
        fetch(`https://watergame.gabrieltomazini.com/api/v1/consumo-diario/${this.consumoDiario.id_consumo_diario}/detalhado`)
          .then(res => res.json())
          .then(detalhes => {
            this.detalhes = detalhes;
            this.pontosConsumo = detalhes.pontos_consumo || [];
            this.processarPontosParaGrafico();
          })
          .catch(err => {
            console.error('Erro ao atualizar detalhes:', err);
          });
      }
    },
    selecionarAnalise(id) {
      this.analiseSelecionadoId = id;
      fetch(`https://watergame.gabrieltomazini.com/api/v1/consumo-diario/${id}/detalhado`)
        .then(res => res.json())
        .then(detalhes => {
          this.analisePontos = detalhes.pontos_consumo || [];
          this.processarAnalisePontosParaGrafico();
        });
    },
    processarAnalisePontosParaGrafico() {
      if (!this.analisePontos || this.analisePontos.length === 0) {
        this.analisePontosHorizontais = [];
        return;
      }
      const pontosOrdenados = [...this.analisePontos].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
      const valores = pontosOrdenados.map(p => parseFloat(p.consumo_pontos));
      const minValor = Math.min(...valores);
      const maxValor = Math.max(...valores);
      const larguraGrafico = 500;
      const alturaGrafico = 140;
      const margemX = 80;
      const margemYTop = 40;
      const margemYBottom = 180;
      
      this.analisePontosHorizontais = pontosOrdenados.map((ponto, index) => {
        // Corrigir cálculo de X para não sair dos eixos
        let x;
        if (pontosOrdenados.length === 1) {
          x = margemX + larguraGrafico / 2;
        } else {
          x = margemX + (index * larguraGrafico) / (pontosOrdenados.length - 1);
        }
        
        let y;
        if (maxValor === minValor) {
          y = margemYTop + alturaGrafico / 2;
        } else {
          const proporcao = (parseFloat(ponto.consumo_pontos) - minValor) / (maxValor - minValor);
          y = margemYBottom - (proporcao * alturaGrafico);
        }
        const hora = new Date(ponto.datetime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        return { x, y, hora, valor: ponto.consumo_pontos, datetime: ponto.datetime };
      });
    },
    showTooltipAnalise(i) {
      const ponto = this.analisePontosHorizontais[i];
      this.analiseTooltip = { show: true, ponto };
    },
    hideTooltipAnalise() {
      this.analiseTooltip.show = false;
    }
  }
}
</script>

<style scoped>
/* Container principal do dashboard */
.dashboardpage {
  display: flex;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Área de conteúdo que fica ao lado do sidebar */
.dashboard-content {
  flex: 1;
  margin-left: 160px; /* Espaço maior para o sidebar */
  padding: 20px;
  box-sizing: border-box;
  min-width: 0; /* Importante para prevenir overflow */
}

/* Container das duas colunas principais */
.dashboard-row {
  display: flex;
  flex-direction: row;
  gap: 20px;
  height: calc(100vh - 120px); /* Ajuste conforme necessário */
  margin-bottom: 20px;
}

.dashboard-col {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Coluna esquerda - 50% do espaço disponível */
.dashboard-col-left {
  flex: 1;
  gap: 20px;
  justify-content: flex-start;
  min-width: 0; /* Remove largura mínima fixa */
}

/* Coluna direita - 50% do espaço disponível */
.dashboard-col-right {
  flex: 1;
  justify-content: flex-start;
  align-items: stretch;
  min-width: 0; /* Remove largura mínima fixa */
}

/* Estilos dos quadros */
.Quadro1, .Quadro3 {
  width: 100%;
  box-sizing: border-box;
  background: #00A5EC;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  padding: 20px;
  min-height: 120px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;
}

.Quadro2 {
  width: 100%;
  box-sizing: border-box;
  background: #00A5EC;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
}

.Quadro5 {
  width: 100%;
  box-sizing: border-box;
  background: #00A5EC;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  padding: 20px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;
}

.titulo_quadro {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  color: #111;
}

.consumo-dia {
  font-size: 2.2rem;
  font-weight: bold;
  color: #111;
  margin-bottom: 8px;
}

.consumo-volume {
  font-size: 3.2rem;
  font-weight: bold;
  color: #111;
  margin-bottom: 8px;
}

.consumo-branco {
  color: #fff !important;
}

.consumo-anterior-box {
  margin-top: 18px;
  background: rgba(255,255,255,0.10);
  border-radius: 8px;
  padding: 10px 16px;
  color: #fff;
}

.consumo-anterior-titulo {
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 2px;
}

.consumo-anterior-data, .consumo-anterior-volume {
  color: #fff;
  font-size: 1.05rem;
  margin-bottom: 2px;
}

.detalhes-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;
}

.btn-atualizar {
  background: rgba(255,255,255,0.32); /* Mais forte */
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  color: #007bb8;
  font-size: 1.3rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-atualizar:hover {
  background: rgba(255,255,255,0.5); /* Mais forte no hover */
}

.detalhes-container {
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 16px;
  position: relative;
  padding: 20px 20px 10px 20px;
  box-sizing: border-box;
}

.grafico-legenda {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  color: #fff;
}

.grafico-legenda h4 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
}

.grafico-legenda p {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  font-style: italic;
}

.timeline-svg-horizontal {
  display: block;
  width: 100%;
  max-width: 100%;
  height: 250px !important;
  min-height: 180px;
  background: transparent;
}

/* Estilo para pontos interativos */
.ponto-interativo {
  cursor: pointer;
  transition: all 0.2s ease;
}

.ponto-interativo:hover {
  r: 12; /* Ponto cresce quando hover */
  filter: drop-shadow(0 0 6px rgba(0, 123, 184, 0.5));
}

/* Área de detalhes embaixo do gráfico */
.detalhes-ponto {
  width: 100%;
  min-height: 48px;
  margin-top: 12px;
  padding: 10px;
  background: rgba(255,255,255,0.15);
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.3);
  box-sizing: border-box;
  transition: min-height 0.2s;
}

.ponto-detalhes {
  min-height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ponto-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 8px;
}

.ponto-horario {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
}

.ponto-valor {
  font-size: 1.4rem;
  font-weight: bold;
  color: #fff;
  background: rgba(0, 123, 184, 0.3);
  padding: 4px 12px;
  border-radius: 6px;
}

.ponto-descricao {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  font-style: italic;
}

.ponto-placeholder {
  text-align: center;
  color: rgba(255,255,255,0.6);
  font-style: italic;
  padding: 30px 0;
  font-size: 0.9rem;
}

/* Estilos da lista de resumo */
.resumo-lista {
  width: 100%;
  margin-top: 8px;
  border-radius: 8px;
  overflow: hidden;
  background: none;
}

.resumo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  font-size: 1.08rem;
  font-weight: 500;
}

.resumo-item-claro {
  background: rgba(255,255,255,0.13);
  color: #fff;
}

.resumo-item-escuro {
  background: rgba(0,0,0,0.07);
  color: #fff;
}

.resumo-dia {
  font-weight: 400;
}

.resumo-volume {
  font-weight: 600;
}

.resumo-vazio {
  padding: 16px 0;
  text-align: center;
  color: #fff;
}

/* Estilos da análise diária */
.quadro-analise-diaria {
  min-height: 400px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  box-sizing: border-box;
}

.analise-flex {
  display: flex;
  flex-direction: row;
  gap: 24px;
  width: 100%;
  height: 100%;
  align-items: flex-start;
  justify-content: stretch;
}

.analise-lista {
  flex: 0 0 35%;
  min-width: 280px;
  max-width: 350px;
  background: rgba(0,0,0,0.07);
  border-radius: 8px;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  height: auto;
  max-height: 350px;
  overflow-y: auto;
}

.analise-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 18px;
  font-size: 1.06rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.analise-item-claro {
  background: rgba(255,255,255,0.13);
  color: #111;
}

.analise-item-escuro {
  background: rgba(0,0,0,0.07);
  color: #111;
}

.analise-item-selecionado {
  background: #fff !important;
  color: #007bb8 !important;
  font-weight: bold;
  transform: scale(1.02);
}

.analise-dia {
  font-weight: 400;
}

.analise-volume {
  font-weight: 700;
}

.analise-grafico {
  flex: 1;
  min-width: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 16px;
}

.grafico-legenda-analise {
  margin-bottom: 16px;
}

.grafico-legenda-analise h4 {
  font-size: 1.05rem;
  margin: 0 0 6px 0;
}

.grafico-legenda-analise p {
  font-size: 0.85rem;
}

@media (max-width: 1200px) {
  .analise-lista {
    min-width: 240px;
    max-width: 300px;
  }
}

@media (max-width: 900px) {
  .dashboard-content {
    margin-left: 80px;
    padding: 10px;
  }
  
  .dashboard-row {
    flex-direction: column;
    gap: 16px;
    height: auto;
  }
  
  .dashboard-col, 
  .dashboard-col-left, 
  .dashboard-col-right {
    min-width: unset;
    max-width: unset;
    width: 100%;
    height: auto;
    flex: none;
  }
  
  .Quadro2 {
    min-height: 320px;
    width: 100%;
  }

  .quadro-analise-diaria {
    min-height: 350px;
    height: auto;
  }
  
  .analise-flex {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
    justify-content: flex-start;
  }
  
  .analise-lista {
    max-width: 100%;
    width: 100%;
    min-width: unset;
    max-height: 200px;
  }
  
  .analise-grafico {
    width: 100%;
    min-width: unset;
  }
}

@media (max-width: 600px) {
  .dashboard-content {
    margin-left: 0; /* Remove margin do sidebar em telas muito pequenas */
    padding: 5px;
  }
  
  .quadro-analise-diaria {
    min-height: 200px;
    height: 200px;
    max-height: 240px;
  }
  
  .timeline-svg-horizontal {
    height: 120px !important;
  }
}
</style>