/**
 * Created with JetBrains RubyMine.
 * User: xyooyy
 * Date: 13-12-28
 * Time: 上午10:31
 * To change this template use File | Settings | File Templates.
 */
function ActivityListController($scope, $http, $navigate) {

    scope_function_in_controller.activity_list($scope, $navigate)

    $scope.activity_array = ActivityInfo.get_activity_array()

    $scope.is_btn_click = function () {
        return (ActivityInfo.get_starting_activity().status != "start" && Bid.get_biding().status != "start")
    }

    $scope.jump_to_detail_activity = function(activity) {
        ActivityInfo.set_click_activity(activity)
        if(ActivityInfo.get_starting_activity().status != "start" ) {
            ActivityInfo.set_starting_activity(activity)
        }
        $scope.jump_to_activity_sign_up_view()
    }

    $scope.synchronous_data = function() {
        var user_name = User.get_current_user_name()
        $http.post('/users/synchronous_data', {name: user_name, activity_infos: $scope.activity_array})
            .success(function(response) {
                if(JSON.parse(response) == true) {
                     alert("同步数据成功")
                }else {
                    alert("同步数据失败")
                }
        }).error(function() {
                alert("请求服务器端出现问题")
            })
    }

}