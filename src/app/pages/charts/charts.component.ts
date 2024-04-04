import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import Highcharts from 'highcharts/es-modules/masters/highcharts.src';
import { OportunidadModel } from '../../core/models/oportunidad.model';
import { OportunidadService } from '../../services/oportunidad/oportunidad.service';
import { PermisosDirective } from '../../core/directives/permisos/permisos.directive';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [HighchartsChartModule, CommonModule, PermisosDirective],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})

export class ChartsComponent implements OnInit {
  oportunidades: OportunidadModel[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  barChartOptions: Highcharts.Options;
  bigChartOptions: Highcharts.Options;

  ngOnInit(): void {
    this.obtenerOportunidades();
  }

  constructor(private oS: OportunidadService) {}

  obtenerOportunidades() {
    this.oS.getOportunidad().subscribe({
      next: (resp: any) => {
        if (resp.ok) {
          this.oportunidades = resp.oportunidad;
          
          this.calcularPorcentajes();
          this.calcularDistribucionPorNombreYEstado();
          this.initializeChart();
        } else {
          console.error('Error al obtener las oportunidades:', resp.msg);
          // mostrar un mensaje de error al usuario
        }
      },
      error: (error) => {
        console.error('Error al obtener las oportunidades:', error);
        // mostrar un mensaje de error al usuario o tomar otras acciones según sea necesario
      }
    });
  }

  calcularDistribucionPorNombreYEstado() {
    const distribucion: { [key: string]: { [key: string]: number } } = {};
  
    this.oportunidades.forEach((oportunidad) => {
      if (!distribucion[oportunidad.nameOportunity]) {
        distribucion[oportunidad.nameOportunity] = {};
      }
  
      if (!distribucion[oportunidad.nameOportunity][oportunidad.stateOportunity]) {
        distribucion[oportunidad.nameOportunity][oportunidad.stateOportunity] = 0;
      }
  
      distribucion[oportunidad.nameOportunity][oportunidad.stateOportunity]++;
    });
    this.crearBarChart(distribucion);
  }

  calcularPorcentajes() {
    const totalOportunidades = this.oportunidades.length;
  
    const oportunidadesPorEstado: { [key: string]: number } = this.oportunidades.reduce((acumulador: { [key: string]: number }, oportunidad: OportunidadModel) => {
      acumulador[oportunidad.stateOportunity] = (acumulador[oportunidad.stateOportunity] || 0) + 1;
      return acumulador;
    }, {});
  
    const porcentajesPorEstado: { [key: string]: number } = {};
    for (const estado in oportunidadesPorEstado) {
      const porcentaje = (oportunidadesPorEstado[estado] / totalOportunidades) * 100;
      porcentajesPorEstado[estado] = parseFloat(porcentaje.toFixed(2));
    }
    this.crearPieChart(porcentajesPorEstado);
  }

  crearPieChart(porcentajes: { [key: string]: number }) {
    this.chartOptions = {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Porcentaje de oportunidades por estado'
      },
      series: [{
        type: 'pie',
        name: 'Porcentaje',
        data: Object.entries(porcentajes).map(([estado, porcentaje]) => ({ name: estado, y: porcentaje }))
      }]
    };
  }

  crearBarChart(data: { [key: string]: { [key: string]: number } }) {
    const categorias = Object.keys(data);
  
    // Obtener todos los estados únicos de todas las categorías
    const estadosUnicos = new Set<string>();
    categorias.forEach(categoria => {
      Object.keys(data[categoria]).forEach(estado => {
        estadosUnicos.add(estado);
      });
    });
  
    const series: Highcharts.SeriesColumnOptions[] = [];
  
    estadosUnicos.forEach(estado => {
      const serie: Highcharts.SeriesColumnOptions = {
        name: estado, // Usar el nombre del estado como nombre de la serie
        data: categorias.map((nombre) => data[nombre][estado] || 0),
        type: 'column'
      };
      series.push(serie);
    });
  
    console.log('Series:', series);
  
    this.barChartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Distribución de oportunidades por nombre y estado'
      },
      xAxis: {
        categories: categorias
      },
      yAxis: {
        title: {
          text: 'Cantidad de oportunidades'
        }
      },
      series: series
    };
  }

  initializeChart() {
    const data = this.oportunidades;
  
    // Creamos un objeto para almacenar los datos del gráfico
    const chartData: { [name: string]: [number, number][] } = {};
  
    // Iteramos sobre las oportunidades para agruparlas por nombre y fecha de creación
    data.forEach((oportunidad: any) => {
      const fechaCreacion = new Date(oportunidad.createdAt).getTime();
      if (!chartData[oportunidad.nameOportunity]) {
        chartData[oportunidad.nameOportunity] = [];
      }
      // Incrementamos el contador de oportunidades para cada nombre
      chartData[oportunidad.nameOportunity].push([fechaCreacion, 1]);
    });
  
    // Convertimos el objeto chartData a un array de series para Highcharts
    const seriesData = Object.entries(chartData).map(([name, data]) => ({ name, data }));
  
    // Creamos las opciones del gráfico con una serie de líneas
    this.bigChartOptions = {
      chart: {
        type: 'line' // Cambiamos el tipo de gráfico a línea
      },
      title: {
        text: 'Distribución de oportunidades por fecha de creación'
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Fecha de Creación'
        }
      },
      yAxis: {
        title: {
          text: 'Número de Oportunidades'
        }
      },
      series: seriesData as Highcharts.SeriesOptionsType[]
    };
  }
  
  
}
