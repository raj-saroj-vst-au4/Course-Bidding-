$(document).ready(function () {
    $('#view_bids').on('click',() => {
        console.log((this)[0])
        $('#prev_bids').modal('show');
    })
})