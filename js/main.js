const app = new Vue({
  el: '#app',
  data: {
    baseUrl: 'http://localhost:3000/',
    covid: [],
    bulan: ['Januari', 'Februari', 'Maret'],
    provinsi: 'Jawa Tengah'
  },
  created() {
    this.getDataCovid()
    this.renderChart()
  },
  computed: {
    dataChart() {  
      let data = this.covid
      .filter(x => x.nama == this.provinsi)
      .map(x => {
        const sembuh = this.sum(x.bulan, 'sembuh')
        const positif = this.sum(x.bulan, 'positif')
        const pdp = this.sum(x.bulan, 'pdp')
        const meninggal = this.sum(x.bulan, 'meninggal')
        return {
          sembuh: sembuh,
          positif: positif,
          pdp: pdp,
          meninggal: meninggal,
        }
      })[0]
      let line = [
        {
          label: 'Sembuh',
          color: 'red',
          data: data.sembuh
        },
        {
          label: 'Positive',
          color: 'blue',
          data: data.positif
        },
        {
          label: 'Pdp',
          color: 'yellow',
          data: data.pdp
        },
        {
          label: 'Meninggal',
          color: 'green',
          data: data.meninggal
        },
      ]
      return line.map(x => {
        return {
          label: x.label,
          backgroundColor: x.color,
          borderColor: x.color,
          data: x.data,
          fill: false,
        }
      })
    }
  },
  methods: {
    sum(bulan, key) {
        let sum = []
        for (let i = 0; i < this.bulan.length; i++) {
          sum[i] = bulan[this.bulan[i].toLowerCase()][key]       
        }
        return sum
    },
    getDataCovid() {
      async function getUserAsync(name) 
      {
        let response = await fetch(`http://localhost:3000/${name}`);
        let data = await response.json()
        return data;
      }

      getUserAsync('covid')
        .then(data => {
          this.covid = data
          console.log(data)
        });
    },
    renderChart() {
      let line = [
        {
          label: 'Sembuh',
          color: 'red',
          data: [20,25,40]
        },
        {
          label: 'Positive',
          color: 'blue',
          data: [200, 300, 409]
        },
        {
          label: 'Pdp',
          color: 'yellow',
          data: [234, 400, 490]
        },
        {
          label: 'Meninggal',
          color: 'green',
          data:[90, 98, 100]
        },
      ]
      var config = {
        type: 'line',
        data: {
          labels: this.bulan,
          datasets: line.map(x => {
            return {
              label: x.label,
              backgroundColor: x.color,
              borderColor: x.color,
              data: x.data,
              fill: false,
            }
          })
        },
        options: {
          responsive: true,
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Bulan'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Jumlah'
              }
            }]
          }
        }
      };
      window.onload = function() {
        var ctx = document.getElementById('canvas').getContext('2d');
        window.myLine = new Chart(ctx, config);
      };
    }
  }
})