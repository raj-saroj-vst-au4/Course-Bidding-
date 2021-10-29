$(document).ready(function () {
    $('.view_bids').on('click',() => {
        console.log((this))
        $('#prev_bids').modal('show');
    })

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

    //bids remaining js
    $(".bid-num").keyup(function () {
        var totalbid = 0;
        $(".bid-num").each(function(){
            totalbid += parseInt(+$(this).val())
        })
        console.log(`total of bids ${totalbid}`);
        var ans = 120 - totalbid;
        console.log(`points left ${ans}`);
        if(ans < 0){
            alert("You've have reached your bidding limit !");
        }else{
            $("#bidpoints-left").html(" " + ans);
        }
        
    })

    //final bid submission js
    $('#bid_submit').click(function () {
        console.log($('#bidpoints-left').text())
        $(".bid-num").each(function(){
            var course_code = $(this).closest('tr').find('td:first').text();
            var course_bid = $(this).closest('tr').find('input').val();
            if(course_bid){
                console.log(`Bid for ${course_code} is ${course_bid}`);
            }
        })
    })
})