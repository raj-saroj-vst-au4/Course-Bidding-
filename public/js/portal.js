$(document).ready(function () {
  $(".view_bids").on("click", () => {
    console.log(this);
    $("#prev_bids").modal("show");
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
    } else {
      $("#bidpoints-left").html(" " + ans);
    }
  });

  //final bid submission js
  $("#bid_submit").click(function () {
    var bid_dataArray = [];
    console.log($("#bidpoints-left").text());
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
        success: function (data) {
          return alert(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          return alert(jqXHR);
        },
      });
    }
  });
});
