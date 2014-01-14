/**
 * Created with JetBrains RubyMine.
 * User: xyooyy
 * Date: 14-1-10
 * Time: 下午2:43
 * To change this template use File | Settings | File Templates.
 */


function process_message(json_message) {
    var message = json_message.messages[0]
    message.content = trim(message.content)
    var fore_two_string = message.content.substring(0, 2).toUpperCase()

    judge_message()

    function judge_message() {
        var judge_message = {
            BM: function() { process_activity_sign_up_message() } ,
            JJ: function() { process_bid_sign_up_message() }
        }
        if(judge_message[fore_two_string]) {
            judge_message[fore_two_string]()
        }else {
            prompt_message_format()
        }

        function prompt_message_format() {
            if(fore_two_string != "BM" && fore_two_string != "JJ") {
                if(ActivityInfo.get_starting_activity().status == "start") {
                    console.log("活动报名格式不正确。请按格式：“BM ＋ 您的姓名” 发送短信。")
                }else if(Bid.get_biding().status == "start") {
                    console.log("竞价报名格式不正确。请按格式：“JJ ＋ 您的出价” 发送短信。")
                }else {
                    console.log("当前没有活动报名和竞价报名！")
                }
            }
        }
    }

    function process_activity_sign_up_message() {

        judge_activity_status()

        function judge_activity_status() {
            var judge_activity_status = {
                un_start: function() {console.log("活动报名还未开始, 请稍后再试。")},
                     end: function() {console.log("抱歉，活动报名已经结束。")},
                   start: function() {process_message_when_activity_status_start()}
            }
            judge_activity_status[ActivityInfo.get_starting_activity().status]()
        }

        function process_message_when_activity_status_start() {
            var repeat_activity_sign_up_info = find_repeat_activity_sign_up()
            if(repeat_activity_sign_up_info == undefined) {
                add_new_activity_sign_up_info()
            } else {
                console.log("您已经活动报名成功，请勿重复进行活动报名！")
            }
        }

        function find_repeat_activity_sign_up() {
            var activity_sign_up_infos = ActivitySignUp.get_activity_sign_up_info_array()
            var starting_activity = ActivityInfo.get_starting_activity()
            var repeatedly_activity_sign_up_info = _.find(activity_sign_up_infos, function(activity_sign_up_info) {
                return activity_sign_up_info.phone == message.phone && activity_sign_up_info.activity_name == starting_activity.name})
           return repeatedly_activity_sign_up_info
        }

        function add_new_activity_sign_up_info() {
            var activity_sign_up_person_name = trim(message.content.substring(2, message.content.length))
            var new_activity_sign_up_info = new ActivitySignUp(activity_sign_up_person_name, message.phone)
            ActivitySignUp.set_new_activity_sign_up_info_to_array(new_activity_sign_up_info)
            refresh_sign_up_info("activity_sign_up")
            console.log("恭喜，您活动报名成功。")
        }

    }

    function process_bid_sign_up_message() {
        if(_.isEmpty(Bid.get_biding()) || Bid.get_biding().status == "un_start") {
            console.log("竞价报名还未开始, 请稍后再试。")
        }

        if(Bid.get_biding().status == "end") {
            console.log("抱歉，竞价报名已经结束。")
        }

        if(Bid.get_biding().status == "start") {
            var bid_sign_up_infos = BidSignUp.get_bid_sign_up_info_array()
            var biding = Bid.get_biding()
            var repeatedly_bid_sign_up_info = _.find(bid_sign_up_infos, function(bid_sign_up_info) {
                return bid_sign_up_info.phone == message.phone && bid_sign_up_info.activity_name == biding.activity_name && bid_sign_up_info.bid_name == biding.name})
            if(repeatedly_bid_sign_up_info == undefined) {
                var activity_sign_up_info = _.find(ActivitySignUp.get_activity_sign_up_for_biding_activity(), function(activity_sign_up_info) {
                    return activity_sign_up_info.phone  == message.phone
                })

                if(activity_sign_up_info == undefined) {
                    console.log("您没有参加活动报名，无法进行竞价报名！")
                } else {
                    var bid_sign_up_price = trim(message.content.substring(2, message.content.length))
                    var new_bid_sign_up_info = new BidSignUp(activity_sign_up_info.name, message.phone, bid_sign_up_price)
                    BidSignUp.set_new_bid_sign_up_info_to_array(new_bid_sign_up_info)
                    refresh_sign_up_info("bid_sign_up")
                    console.log("恭喜，您竞价报名成功。")
                }
            } else {
                console.log("您已经竞价报名成功，请勿重复进行竞价报名！")
            }
        }

    }

    function refresh_sign_up_info(view_id) {
        var sig_up_view_element = document.getElementById(view_id)
        if(sig_up_view_element) {
            var scope = angular.element(sig_up_view_element).scope()
            scope.$apply(function() {
                scope.refresh_sign_up_infos()
            })
        }
    }
}

function trim(string) {      //删除左右两端的空格
    return string.replace(/(^\s*)|(\s*$)/g, "")
}

function left_trim(string) { //删除左边的空格
    return string.replace(/\b(0+)/gi,"")
//    return string.replace(/(^\s*)/g,"")

}

function right_trim(string) {  //删除右边的空格
    return string.replace(/(\s*$)/g,"");
}

//
//
//
//    if(message.content.substring(0, 2).toUpperCase() == "BM") {
//         process_activity_sign_up_message()
//    }
//
//    if(message.content.substring(0, 2).toUpperCase() == "JJ") {
//        process_bid_sign_up_message()
//    }
//        if(ActivityInfo.get_starting_activity().status == "un_start") {
//            console.log("活动报名还未开始, 请稍后再试。")
//        }
//
//        if(ActivityInfo.get_starting_activity().status == "end") {
//            console.log("抱歉，活动报名已经结束。")
//        }