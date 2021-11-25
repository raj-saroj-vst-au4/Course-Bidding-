$(document).ready(function () {
  $(".view_bids").on("click", function () {
    var course_code = $(this).closest("tr").find("td:first").text();

    $.ajax({
      method: "POST",
      url: "/api/fetch-bidrange",
      data: { course_code: course_code },
      statusCode: {
        200: function (result, status, xhr) {
          $("#auc-course-code").html(course_code);
          $("#max_bid").html(result.max);
          $("#min_bid").html(result.min);
          $("#prev_bids").modal("show");
          console.log(result);
        },
        404: function (output) {
          alert("Not enough bids till now");
          // $("#auc-course-code").html(course_code);
          // $("#prev_bids").modal("show");
        },
      },
    });
  });

  // $(".bid-num").keyup(function () {
  //     var totalbid = 0;
  //     $(".bid-num").each(()=>{
  //         totalbid += parseInt($(this).val())
  //     })
  //     console.log(totalbid);
  //     var ans = 120 - totalbid;
  //     console.log(ans);
  //     $("#bidpoints-left").html(ans);
  // })

  //To disable scrolling in input so that brjs below works
  $(document).on("wheel", "input[type=number]", function (e) {
    $(this).blur();
  });

  //reset course students array

  $("#reset_db").on("click", () => {
    $.ajax({
      method: "POST",
      url: "/api/clear-bid",
    });
  });

  $("#reset_bids").on("click", () => {
    $.ajax({
      method: "POST",
      url: "/api/remove-individual-bid",
      statusCode: {
        200: () => {
          alert("Your bids have been reset");
          window.location.reload();
        },
        500: () => {
          alert("Server side error contact sysad");
        },
      },
    });
  });

  //bids remaining js
  $(".bid-num").keyup(function () {
    var totalbid = 0;
    $(".bid-num").each(function () {
      totalbid += parseInt(+$(this).val());
    });
    console.log(`total of bids ${totalbid}`);
    var ans = 120 - totalbid;
    console.log(`points left ${ans}`);
    if (ans < 0) {
      alert("You've have reached your bidding limit !");
      $(this).val("0");
    } else {
      $("#bidpoints-left").html(" " + ans);
    }
  });

  //enable input field
  $('input[type="checkbox"]').click(function () {
    if ($(this).is(":checked")) {
      $(this).closest("tr").find("input").prop("disabled", false);
    } else if ($(this).is(":not(:checked)")) {
      $(this).closest("tr").find("input").prop("disabled", true);
    }
  });

  //checkbox counter

  // var countCheckedCheckboxesTerm1 = 0;
  // var countCheckedCheckboxesTerm2 = 0;
  // console.log($("#bidpoints-left").text());

  // var $checkboxes = $('input[type="checkbox", id]');

  // $checkboxes.change(function () {
  //   countCheckedCheckboxesTerm1 = $checkboxes.filter(":checked").length;
  //   console.log(
  //     " total count of checked boxes : " + countCheckedCheckboxesTerm1
  //   );
  // });

  //final bid submission js
  $("#bid_submit").click(function () {
    var bid_dataArray = [];

    $(".bid-num").each(function () {
      var course_code = $(this).closest("tr").find("td:first").text();
      var course_bid = $(this).closest("tr").find("input").val();
      if (course_bid) {
        bid_dataArray.push({ course_code: course_code, bid: course_bid });
      }
    });
    if (bid_dataArray.length < 10) {
      alert("Please bid for atleast 5 subjects in each term");
    } else if ($("#bidpoints-left").html() > 0) {
      alert(
        `You still have ${$("#bidpoints-left").html()} bidding points left`
      );
    } else {
      console.log(bid_dataArray);
      $.ajax({
        method: "POST",
        url: "/api/bidding-handler",
        data: {
          bid_dataArray: bid_dataArray,
        },
        statusCode: {
          200: () => {
            alert("All Bids placed successfully");
            location.reload();
          },
          409: () => {
            alert(
              "You've already placed your bid, please wait for the bidding windows to reopen"
            );
          },
          500: () => {
            alert("Server Side error please inform raj.saroj@iitb.ac.in");
          },
        },
      });
    }
  });
  $("#subject_stats").on("click", () => {
    window.location.href = "/stats-page";
  });
});
