const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const app = express();


const sets = {
  1:"energy",
  2:"guard",
  3:"swift",
  4:"blade",
  5:"rage",
  6:"focus",
  7:"endure",
  8:"fatal",
  10:"despair",
  11:"vampire",
  13:"violent",
  14:"nemesis",
  15:"will",
  16:"shield",
  17:"revenge",
  18:"destroy",
  19:"fight",
  20:"determination",
  21:"enhance",
  22:"accuracy",
  23:"tolerance",
  24:"seal",
  25:"intangible",
}

const selectSets = [
    { value: 0, label: 'All' },
    { value: 1, label: 'Energy' },
    { value: 2, label: 'Guard' },
    { value: 3, label: 'Swift' },
    { value: 4, label: 'Blade' },
    { value: 5, label: 'Rage' },
    { value: 6, label: 'Focus' },
    { value: 7, label: 'Endure' },
    { value: 8, label: 'Fatal' },
    { value: 10, label: 'Despair' },
    { value: 11, label: 'Vampire' },
    { value: 13, label: 'Violent' },
    { value: 14, label: 'Nemesis' },
    { value: 15, label: 'Will' },
    { value: 16, label: 'Shield' },
    { value: 17, label: 'Revenge' },
    { value: 18, label: 'Destroy' },
    { value: 19, label: 'Fight' },
    { value: 20, label: 'Determination' },
    { value: 21, label: 'Enhance' },
    { value: 22, label: 'Accuracy' },
    { value: 23, label: 'Tolerance' },
    { value: 24, label: 'Seal' },
    { value: 25, label: 'Intangible' },
];

const stats = {
  1:"HP flat",
  2:"HP%",
  3:"ATK flat",
  4:"ATK%",
  5:"DEF flat",
  6:"DEF%",
  8:"Speed",
  9:"CRate",
  10:"CDmg",
  11:"RES",
  12:"ACC",
}

const maxmain5 = {
  1:2088,
  2:51,
  3:135,
  4:51,
  5:135,
  6:51,
  8:39,
  9:47,
  10:65,
  11:51,
  12:51,
}

const maxmain6 = {
  1:2448,
  2:63,
  3:160,
  4:63,
  5:160,
  6:63,
  8:42,
  9:58,
  10:80,
  11:64,
  12:64,
}

const maxsub5 = {
  1:1500,
  2:35,
  3:75,
  4:35,
  5:75,
  6:35,
  8:25,
  9:25,
  10:25,
  11:35,
  12:35,
}

const maxsub6 = {
  1:1875,
  2:40,
  3:100,
  4:40,
  5:100,
  6:40,
  8:30,
  9:30,
  10:35,
  11:40,
  12:40,
}

const maxGrindHero = {
  1:450,
  2:7,
  3:22,
  4:7,
  5:22,
  6:7,
  8:4
}

const maxGrindLegend = {
  1:550,
  2:10,
  3:30,
  4:10,
  5:30,
  6:10,
  8:5
}

const maxGrindHeroAncient = {
  1:510,
  2:9,
  3:26,
  4:9,
  5:26,
  6:9,
  8:5
}

const maxGrindLegendAncient = {
  1:610,
  2:12,
  3:34,
  4:12,
  5:34,
  6:12,
  8:6
}

const maxGemHero = {
  1:420,
  2:11,
  3:30,
  4:11,
  5:30,
  6:11,
  8:8,
  9:7,
  10:8,
  11:9,
  12:9,
}

const maxGemLegend = {
  1:580,
  2:13,
  3:40,
  4:13,
  5:40,
  6:13,
  8:10,
  9:9,
  10:10,
  11:11,
  12:11,
}

const maxGemHeroAncient = {
  1:480,
  2:13,
  3:34,
  4:13,
  5:34,
  6:13,
  8:9,
  9:8,
  10:10,
  11:11,
  12:11,
}

const maxGemLegendAncient = {
  1:640,
  2:15,
  3:44,
  4:15,
  5:44,
  6:15,
  8:11,
  9:10,
  10:12,
  11:13,
  12:13,
}

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('static'));

app.set('view engine', 'ejs');

let selected_file = '';
let runes = [];

app.get('/', (req, res) => {
    
    res.render('index', { message:'' });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define the directory where files will be saved
    },
    filename: function (req, file, cb) {
        selected_file= file.originalname;
      // Use the original filename for the uploaded file
        cb(null, file.originalname);
    }
  });
  
  const upload = multer({ 
    storage: storage
  });


app.use('/upload', (req, res, next) => {
    // Empty the 'uploads/' directory
    fs.emptyDirSync('uploads/');
    next();
  });

app.post('/upload', upload.single('jsonFile'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }else{
      fs.readFile('uploads/'+selected_file, 'utf8', (err, data) => {
        if (err) {
          return res.status(500).send('Error reading the file.');
        }
        
        try {
          // Parse the JSON data
          const jsonData = JSON.parse(data);
          // Return a specific attribute (e.g., 'attributeName')
          jsonData.unit_list.forEach(unit => {
            const equipedRunes = unit.runes;
            equipedRunes.forEach(rune=>{
              if((rune.class >= 5 && rune.class < 15) || rune.class >= 15){
                rune.efficiency = getEfficiency(rune,0);
                rune.efficiencyMaxHero = getEfficiency(rune,1);
                rune.efficiencyMaxLegend = getEfficiency(rune,2);
                runes.push(rune);  
              }
            });
          });
          jsonData.runes.forEach(rune=>{
            if((rune.class >= 5 && rune.class < 10) || rune.class >= 15){
                rune.efficiency = getEfficiency(rune,0);
                rune.efficiencyMaxHero = getEfficiency(rune,1);
                rune.efficiencyMaxLegend = getEfficiency(rune,2);
                runes.push(rune);   
            }
          });

          runes.sort(function(a, b) {
            return a.efficiencyMaxLegend - b.efficiencyMaxLegend;
          });
        } catch (error) {
          return res.status(500).send("Error"+error);
        }
      });
      return res.render('index',{message: 'File uploaded'});
    }
});


app.get('/runes',(req, res) => {
    if (selected_file=='') {
        return res.status(400).send('No json uploaded.');
    }else{
      return res.render('runes', {
        runes: [], 
        selectSets: selectSets,
        orderBy: "effiHero",
        set: 0,
        includeAncient: 1,
        distanceMin: 5,
        effiMin: 100
      });
    }  
});

app.post('/runes/filter', (req, res) => {
  const { orderBy, set, includeAncient, distanceMin, effiMin } = req.body;
  let runesToDisplay = runes;
  if(set!=0){
    runesToDisplay = runesToDisplay.filter(rune => rune.set_id == set);
  }
  if(includeAncient==0){
    runesToDisplay = runesToDisplay.filter(rune => rune.class <= 6);
  }
  runesToDisplay = runesToDisplay.filter(rune => Math.abs(rune.efficiency - rune.efficiencyMaxHero) >= parseInt(distanceMin));
  console.log(effiMin)
  runesToDisplay = runesToDisplay.filter(rune => rune.efficiencyMaxHero >= parseInt(effiMin));
  switch(orderBy){
      case 'effi':
        runesToDisplay.sort((a,b)=>{
          return a.efficiency - b.efficiency;
        });
        runesToDisplay.reverse();
        break;
      case 'effiHero':
        runesToDisplay.sort((a,b)=>{
          return a.efficiencyMaxHero - b.efficiencyMaxHero;
        });
        runesToDisplay.reverse();
        break;
      case 'effiLegend':
        runesToDisplay.sort((a,b)=>{
          return a.efficiencyMaxLegend - b.efficiencyMaxLegend;
        });
        runesToDisplay.reverse();
        break;
  }
  return res.render('runes', { 
    runes: runesToDisplay.slice(0,400),
    stats: stats, 
    sets: sets, 
    orderBy: orderBy,
    set: set,
    includeAncient: includeAncient,
    distanceMin: distanceMin,
    selectSets: selectSets,
    effiMin: effiMin
  });
});

function sortArray(efficiency){
  efficiency.sort((a,b)=>{
    return a -b;
  });
  efficiency.reverse();
}

app.get('/chart/runes',(req, res) => {
  
  const efficiencyData = runes.map(rune => rune.efficiency);
  const effiHeroData = runes.map(rune => rune.efficiencyMaxHero);
  const effiLegendData = runes.map(rune => rune.efficiencyMaxLegend);
  sortArray(efficiencyData);
  sortArray(effiHeroData);
  sortArray(effiLegendData);

  let xValues = [];
  for (let i = 0; i < 400; i++) {
    xValues[i]=i+1;
  }
  const chartData = {
    labels: xValues,
    datasets: [{
        label: 'Efficiency',
        data: efficiencyData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgb(75, 192, 192)',
        fill: false,
        lineTension: 0,
        pointRadius: 0,
    }, {
        label: 'Efficiency Max Hero',
        data: effiHeroData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor:'rgb(255, 99, 132)',
        fill: false,
        lineTension: 0,
        pointRadius: 0,
    }, {
        label: 'Efficiency Max Legend',
        data: effiLegendData,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor:'rgb(54, 162, 235)',
        fill: false,
        lineTension: 0,
        pointRadius: 0,
    }]
  };

  const chartOptions = {
    plugins: {
      title: {
          display: true,
          text: 'Efficiency - All'
      },
      legend: {
          position: 'bottom'
      },
  },
    scales: {
        x: {
            min: 1,
            type: 'linear',
            ticks: {
                stepSize: 25,
            }
        },
        y: {
            type: 'linear',
            ticks: {}
        }
    }
  };
  const chartConfig = {
    type: 'line',
    data: chartData,
    options: chartOptions
  };
  res.send(chartConfig);
});

app.get('/chart',(req,res)=>{
  return res.render('graph');
});

function getEfficiency(rune, useGrindstone){
  let efficiency = 1;
  if(rune.prefix_eff[0]!=0){
    let innate = rune.prefix_eff[1] / maxsub6[rune.prefix_eff[0]];
    if(rune.prefix_eff[0]==1 || rune.prefix_eff[0]==3 || rune.prefix_eff[0]==5){
      innate*=0.5;
    }
    efficiency += innate;
  }
  rune.sec_eff.forEach(stat => {
    const maxsub = (rune.class == 6 || rune.class==16 ? maxsub6[stat[0]] : maxsub5[stat[0]]);
    let grind = stat[3];
    let statValue = stat[1];
    if(useGrindstone==1){
      if(stat[0] <= 8){
        grind = maxGrindHero[stat[0]];
        if(rune.class >= 15){
          grind = maxGrindHeroAncient[stat[0]];
        }
      }
      if(stat[2]==1){
        statValue = maxGemHero[stat[0]];
        if(rune.class >= 15){
          statValue = maxGemHeroAncient[stat[0]];
        }
      }
      
    }else if(useGrindstone==2){
      if(stat[0] <= 8){
        grind = maxGrindLegend[stat[0]];
        if(rune.class >= 15){
          grind = maxGrindLegendAncient[stat[0]];
        }
      }
      if(stat[2]==1){
        statValue = maxGemLegend[stat[0]];
        if(rune.class >= 15){
          statValue = maxGemLegendAncient[stat[0]];
        }
      }
    }
    let subToAdd = (statValue+grind) / maxsub;
    if(stat[0] == 1 || stat[0] == 3 || stat[0] == 5){
      subToAdd*=0.5;
    }
    
    efficiency += subToAdd;
  });
  return ((efficiency/2.8)*100).toFixed(2);
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
  