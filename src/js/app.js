$(function () {

    // console.log('works');
    var urlCity = 'http://localhost:3000/city'

    let loadCity = () =>{
        $.ajax({
            url: urlCity,
            method: 'GET',
            dataType: 'json'
        }).done(function (response) {
            console.log(response);

            response.forEach(function (val) {
                console.log(val.name);
            })

        }).fail(function (msg) {
            console.log(msg);
        })
    }

    //TEST
    loadCity();


    //event handler for when the user chooses city from a drop-down:
    // $('#city').change(function (e) {
    // $('#city').on('change', function (e) {
    //     // console.log('works');
    //     //display 'search for attractions' after the user chooses city:
    //     $('.search').css('display', 'block');
    //
    // });



})