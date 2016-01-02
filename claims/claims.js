/* Common code */
Claim = new Mongo.Collection("claim");

/* Client code */
if (Meteor.isClient) {
  var chart;

  function buildChart(series) {

    chart = $('#container-column').highcharts({

      chart: {
        type: 'column'
      },

      title: {
        text: 'Monthly Total Cause of Medical Claims'
      },

      subtitle: {
        text: ''
      },

      credits: {
        enabled: false
      },

      xAxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ]
      },

      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },

      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
          showInLegend: false
        }
      },

      series: series
    });
  }

  Template.columnChart.onRendered(function() {
    // Create object containing all medical claims per medical issue and month
    var medicalClaimsForChart = {}
    var medicalClaims = ['Animal/Insect bite', 'Hypertension', 'Diabetes', 'CVA,Chronic Kidney disease', 'Abration', 'Hypersensitivity', 'Community acquired pneumonia', 'others'];
    _.each(medicalClaims, function(medicalClaim) {
      medicalClaimsForChart[medicalClaim] = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 };
    })

    Tracker.autorun(function() {
      var series = [];
      _.each(medicalClaims, function(medicalClaim) {
        _.each(Claim.find({
          medical: medicalClaim
        }).fetch(), function(claim) {
          medicalClaimsForChart[medicalClaim][claim.month]++
        });
        series.push({
          name: medicalClaim,
          data: _.values(medicalClaimsForChart[medicalClaim])
        });
      });

      // if there is no chart, built it
      if (!chart) {
        buildChart(series);
        return;
      }

      // Otherwise, simply update the data
      for(var i = 0; i < medicalClaims.length; i++){
        chart.highcharts().series[i].update({
          data: series[i].data
        });
      }

    });
  });

  Template.columnChart.events({
    'click #add-value': function() {
      var causesOfDeath = ['Cardiovascular', 'Respiratory', 'Renal failure', 'Cancer', 'Accident', 'Diabetes', 'Animal/Insect bite', 'Liver illness', 'others'];
      var medical = ['Animal/Insect bite', 'Hypertension', 'Diabetes', 'CVA,Chronic Kidney disease', 'Abration', 'Hypersensitivity', 'Community acquired pneumonia', 'others'];
      Claim.insert({
        "causeOfDeath": causesOfDeath[Math.floor(Math.random() * 8)],
        "month": Math.floor(Math.random() * 12)
      });
      Claim.insert({
        "medical": medical[Math.floor(Math.random() * 10)],
        "month": Math.floor(Math.random() * 12)
      });
    }
  });
}

/* Server code */
if (Meteor.isServer) {
  Meteor.startup(function() {
    console.log("starting");
    // Create random data
    if (Claim.find().count() === 0) {
      var causesOfDeath = ['Cardiovascular', 'Respiratory', 'Renal failure', 'Cancer', 'Accident', 'Diabetes', 'Animal/Insect bite', 'Liver illness', 'others'];
      var medical = ['Animal/Insect bite', 'Hypertension', 'Diabetes', 'CVA,Chronic Kidney disease', 'Abration', 'Hypersensitivity', 'Community acquired pneumonia', 'others'];

      for (var i = 0; i < 50; i++) {
        Claim.insert({
          "causeOfDeath": causesOfDeath[Math.floor(Math.random() * 8)],
          "month": Math.floor(Math.random() * 12)
        });
        Claim.insert({
          "medical": medical[Math.floor(Math.random() * 10)],
          "month": Math.floor(Math.random() * 12)
        });
      }
    }
    // Claim.remove();
  });
}
