(function () {

    function find_page() {

        var url = location.href;
        var time = 0;
        var time_interval = 250;
        var time_n = 3000 / time_interval;
        var ret_data;

        function wait() {

            time++;
            var len = time % 6 + 1
            console.log(len);
            var str = new Array(len + 1).join( '. ' );
            $('#_j_tip').html(str);


            if (ret_data && time > time_n) {
                show_result();
                return;
            }
            setTimeout(wait, time_interval);
        }

        setTimeout(wait, time_interval);

        function show_result() {

            var url = ret_data['url'];
            $('#_j_finding').hide();

            if (ret_data['succ']) {
                location.href = url;
            } else {
                $('#_j_no_found').fadeIn();
            }
        }

        var data = {url:url};
        url = 'http://cimage.sinaapp.com/ajax/find_page_for_gh_page.php';
        $.post(url, data, function (ret){

            ret_data = ret.data;

        }, 'json');


    };

    find_page();
})();
