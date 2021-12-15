$(document).ready(function () {
  var xAxisTerm1 = [];
  var yAxisTerm1 = [];
  var xAxisTerm2 = [];
  var yAxisTerm2 = [];
  $.ajax({
    method: "POST",
    url: "/api/fetch-stats",
    statusCode: {
      200: function (result) {
        console.log(result);
        for (var i = 0; i < result.length; i++) {
          if (
            result[i].course_term == "1" &&
            result[i].course_students.length
          ) {
            console.log(
              result[i].course_code +
                " is a term 1 course with highest bid " +
                result[i].course_students[0].student_bid
            );
            xAxisTerm1.push(result[i].course_code);
            yAxisTerm1.push(result[i].course_students[0].student_bid);
          } else if (
            result[i].course_term == "2" &&
            result[i].course_students.length
          ) {
            console.log(
              result[i].course_code +
                " is a term 2 course with highest bid " +
                result[i].course_students[0].student_bid
            );
            xAxisTerm2.push(result[i].course_code);
            yAxisTerm2.push(result[i].course_students[0].student_bid);
          }
        }
        console.log(xAxisTerm1, yAxisTerm1);
        new Chart("myChart", {
          type: "bar",
          data: {
            labels: xAxisTerm1,
            datasets: [
              {
                //   backgroundColor: barColors,
                data: yAxisTerm1,
              },
            ],
          },
          options: {
            legend: { display: false },
            title: {
              display: true,
              text: "Most in-demand Subjects for Term 1",
            },
          },
        });
      },
    },
  });

  //var barColors = ["red", "green", "blue", "orange", "brown"];
});
