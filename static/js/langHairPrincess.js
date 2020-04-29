var u = navigator.userAgent,
    isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),userNum;

$(function () {
    userNum={
        changeStatus:[0,0,0,0],
        cash_num:0,
        myMagic:0,
        userMagic:0,
        amount:false, //浪花余额
        cons:0, //需花费
        rnd:{
            pet_num:50,
            lamp_num:10,
            comb_num:200
        }, //随机取值范围
        mult:{
            pet_num:1,
            lamp_num:1,
            comb_num:500
        },
        default:{
            pet_num:1,
            lamp_num:1,
            comb_num:500
        },
        current:{
            pet_num:false,
            lamp_num:false,
            comb_num:false
        },
        balance:{ //默认浪花
            pet_num:false,
            lamp_num:false,
            comb_num:false
        },
        last:{
            pet_num:false,
            lamp_num:false,
            comb_num:false
        }
    },dateArr={
        startDate:new Date('2019/04/19 00:00:00').getTime(),
        endDate:new Date('2019/04/27 00:00:00').getTime(),
        today:parseInt(new Date().getTime() / 86400000)*86400000 -28800000,
        viewDay:false
    };
    (dateArr.today > dateArr.endDate && (dateArr.today=dateArr.endDate));
    (dateArr.today < dateArr.startDate && (dateArr.today=dateArr.startDate));
    var rankData={};

    var flag = 0; //1：开播
    // var isbanner = false;
    var isdata = 0;
    var bF = false;
    var foolhash = false;

    template.helper('heatimgformat', function (item) {
        if (!item) {
            return 'static/images/false.png';
        }
        if (item.indexOf('net') > 0) {
            return 'static/images/false.png';
        } else {
            if (item.indexOf('google') > 0) {
                return 'static/images/false.png';
            } else {
                if (item.indexOf('face') > 0) {
                    return 'static/images/false.png';
                } else if (item.indexOf('googleusercontent') > 0) {
                    return 'static/images/false.png';
                }

                return item;
            }
        }
    });
    template.helper('numfomart', function (item) {
        if (Number(item) > 999 && Number(item) < 1000000) {
            return ((Number(item) / 1000).toFixed(1) + 'K');
        } else {
            if (Number(item) > 1000000) {
                return ((Number(item) / 1000000).toFixed(1) + 'M');
            } else {
                return (Number(item));
            }
        }
    });
    template.helper('tranDateFomart', function (item) {
        var date = new Date(item * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear();
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
        var D = date.getDate();
        var h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours());
        var m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
        var s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds());;
        return h+':'+m+' '+Y+'/'+M+'/'+D;
    });

    // domain = 'https://tw.api.langlive.com/';

    var domainurl = window.location.hostname;
    if(domainurl == "localhost"){
        domain = '/api/';
    }

    var ac1_index = domain + 'lact/tangled/ac1_index';  //首页
    var daily_rank = domain + 'lact/tangled/daily_rank';  //日榜
    var make = domain + 'lact/tangled/make';  //合成
    var make_log = domain + 'lact/tangled/make_log';  //合成日誌
    var smelt = domain + 'lact/tangled/smelt';  //熔煉
    var smelt_log = domain + 'lact/tangled/smelt_log';  //熔炼日志
    var send = domain + 'lact/tangled/send';  //总贡献榜
    var send_anc = domain + 'lact/tangled/send_anc';  //单主播贡献榜
    var data = domain + 'lact/tangled/data';  //二阶段榜单

    var exchange_init = domain + 'lact/tangled/exchange_init';  //兌換窗口初始化
    var exchange = domain + 'lact/tangled/exchange';  //兌換
    var exchange_log = domain + 'lact/tangled/exchange_log';  //兑换日志

    var page = {
        'base': function () {
            page.renderData();//渲染榜单
            page.gopage();//跳转直播间｜主页
            page.activex();//交互事件
        },
        'renderData': function () {
            setTimeout(function () {

                // //获取当前登陆的用户信息
                pfid = String(pfidv).length > 1 ? pfidv : 0;
                anchor_pfid = isNaN(parseInt(anchorv)) ? 0 : parseInt(anchorv);
                token = String(tokenv).length > 1 ? tokenv : 0;

                $('.pfid').val(pfidv);
                $('.HTTP_USER_TOKEN').val(tokenv);
                $('.anchor_pfid').val(anchorv);

                if (anchor_pfid != 0) {//直播间：客户端获取
                    $('.anchor_pfid').val(anchor_pfid);

                    if (anchor_pfid == pfid) {
                        flag = 1;
                    }
                } else {
                    //浏览器调试
                    isbanner = true;
                    $('.anchor_pfid').val(pfid);

                    if (location.href.indexOf('#') > 0) {
                        foolhash = true;
                        console.info('fool:' + foolhash);
                        isbanner = false;
                        $('.theanchorid').val(page.getParam('anchor_pfid'));

                        $('.pfid').val(page.getParam('HTTP_USER_UID'));
                        $('.HTTP_USER_TOKEN').val(page.getParam('HTTP_USER_TOKEN'));

                        if (isbanner) {
                            $('.anchor_pfid').val(page.getParam('HTTP_USER_UID'));
                        } else {
                            $('.anchor_pfid').val(page.getParam('anchor_pfid'));
                        }
                    }
                }
                getIdata();
                smelt_logDataPre();

            }, 150);
        },
        'activex': function () {
            $(document).scroll(function () {
                var returnTag = $(".returnTop");
                var scrollTop = $(document).scrollTop();
                if (scrollTop > $('.tabgroups').offset().top - 10) {
                    returnTag.show();
                } else {
                    returnTag.hide();
                }
            });

            $(".returnTop").click(function () {
                $("html,body").animate({scrollTop: $(".tabgroups").offset().top - 10}, 300);
            });

            $("body").on("click", ".btn-more", function () {
                $(this).parents(".pagebottom").prevAll().show();
                $(this).parents(".pagebottom").hide();
            });

            //大页签切换
            $("body").on("click", ".tabgroups li", function () {
                if (!$(this).hasClass("active")) {
                    $(this).siblings().removeClass().end().addClass("active");
                    var $tabgroups = $(".tabgroups");
                    var $activepage = $(".activepage");
                    $tabgroups.removeClass("I II III");

                    var $this = $(this);
                    var $index = parseInt($this.index());
                    switch ($index) {
                        case 0:
                            $tabgroups.addClass("I");
                            break;
                        case 1:
                            $tabgroups.addClass("II");
                            break;
                        case 2:
                            $tabgroups.addClass("III");
                            break;
                    }
                    if ($index < 2) {
                        $(".pagecontent").hide().eq($index).show();
                        $activepage.hide();
                        $('body').css('padding-bottom', '0').attr('pb', '0');
                        if ($index == 0) {
                        } else {
                            if (bF) {
                                $('body').css('padding-bottom', '4rem').attr('pb', '4rem');
                            }
                            $('.groupII').removeClass('hideDiv').addClass('showDiv');
                        }
                    } else {
                        $(".pagecontent").hide();
                        $activepage.show();
                        $('body').css('padding-bottom', '0').attr('pb', '0');
                    }
                }
            });

            //看分组数据
            $("body").on("click", ".grouPTabs li", function () {
                if (!$(this).hasClass("active")) {
                    if ($(this).index() < 3) {
                        $(this).siblings().removeClass().end().addClass("active");
                        $(".grouPTabs").removeClass("groupID1").removeClass("groupID2");
                        $(".grouPTabs").addClass("groupID" + (parseInt($(this).index()) + 1));
                        $(".dancepage .ranklist").hide().eq($(this).index()).fadeIn();
                    }
                }
            });

            //主播贡献榜 弹窗
            $("body").on("click", ".btn-contribution", function () {
                $(this).attr('type', $(this).parents('.pagecontent').attr('type'));
                $('.anchor_pfid').val($(this).attr('anchor_id'));
                $('.type').val($(this).attr('type'));
                $('.xi').attr({
                    'totop': $(document).scrollTop(),
                    'pb': $('body').attr('pb')
                });
                send_anchor();
            });

            //总贡献榜
            $("body").on("click", ".robberbtn", function () {
                sendpi();
            });

            //日榜
            $("body").on("click", ".daybtn", function () {
                $(".magicmodel").fadeIn();
                if(!dateArr.viewDay){
                    dateArr.viewDay = dateArr.today;
                    drawRanklist(dateArr.viewDay);
                }
            });
            $("body").on("click", ".datemenu .left,.datemenu .right", function () {
                if($(this).hasClass("disabled")){
                    return false;
                }
                var to = $(this).hasClass("left") ? -1 : 1;
                dateArr.viewDay += (to * 86400000);
                drawRanklist(dateArr.viewDay);
            });

            //我的合成记录
            $("body").on("click", ".toptitle", function () {
                $(".recordlist").removeClass("exchangelog");
                makeList();
            });

            //复用
            $("body").on("click", ".multiplex", function () {
                changeNum(userNum.last,'current');
            });

            //加减
            $("body").on("click", ".addcon .minus,.addcon .add", function () {
               changeCurrent($(this).attr('type'),$(this).attr('num-to'));
            });
            //随机
            $("body").on("click", ".random", function () {
                userNum.current.pet_num = randomNum('pet_num');
                userNum.current.lamp_num = randomNum('lamp_num');
                userNum.current.comb_num = randomNum('comb_num');
                drawNumDom('current');
            });

            //制作
            $("body").on("click", ".makebtn", function () {
                $(".makemodel").fadeIn();
                $(".makemodel .conlist p").text("是否確認使用變色龍 x" + userNum.current.pet_num + " 尋愛天燈 x" + userNum.current.lamp_num + " 梳子 x" + userNum.current.comb_num + " ,消耗 " + calcCons(userNum.current) + " 浪花合成物品？");
            });
            $("body").on("click",".makemodel .confirm",function () {
                // $(".makemodel .conlist p").text("您使用變色龍 x" + userNum.current.pet_num + " 尋愛天燈 x" + userNum.current.lamp_num + " 梳子 x" + userNum.current.comb_num);
                $(this).attr("class","second_confirm");
                $(".close").hide();
                makeData();
            });
            $("body").on("click", ".second_confirm", function () {
                $(this).parents(".cbg").hide();
                $(".mask,.spinner").hide();
                $(this).attr("class","confirm");
                $(".close").show();
                window.location.reload();
            });

            //魔法券合成记录
            $("body").on("click", ".magicscore_btn", function () {
                smelt_logData();
            });

            //合成1次
            $("body").on("click", ".final_synthetic .synbtn", function () {
                smelt_Data();
            });

            //弹幕
            $("body").on("click", ".off", function () {
                if($(this).attr("src") == "static/images/off.png"){
                    $(this).attr("src","static/images/on.png");
                    $('.barrage-wrapper').show();
                }else {
                    $(this).attr("src","static/images/off.png");
                    $('.barrage-wrapper').hide();
                }
            });

            //头图上面的兑换 ---- 初始化
            $("body").on("click", ".magicex_btn", function () {
                exchange_init_data();
            });
            //头图上面的兑换 --- 我的兌換紀錄
            $("body").on("click", ".princessmodel .exchange_btn", function () {
                exchange_log_data();
            });
            //头图上面的兑换 ---- 兑换
            $("body").on("click", ".princessmodel .exbtn0", function () {
                openChangeConfirm($(this).parent().attr('type'),$(this).siblings(".name").text(),$(this).text());
            });

            //头图上面的兑换 ---- 兑换---确认
            $("body").on("click", ".canexchange .confirm", function () {
                exchange_data($(this).attr('data-type'));
            });

            //关闭按钮
            $("body").on("click", ".xi,.close", function () {
                $(this).parents(".cbg").hide();
                $(".mask,.spinner").hide();
                $("body").removeAttr('style').css('font-size', '0.16rem');
                $("body").css({
                    'padding-bottom': $(this).attr('pb')
                });
                $('html').css({
                    'overflowY': 'auto',
                    'height': 'auto'
                });
                $('html,body').animate({scrollTop: $(this).attr('totop')}, 0);

            });
            $("body").on("click", ".synmodel .confirm", function () {
                $(this).parents(".cbg").hide();
                $(".mask,.spinner").hide();
                $(".magiclist .note").hide();
            });
            $("body").on("click", ".exchangelog .xi,.canexchange .xi", function () {
                $(this).parents(".cbg").hide();
                $(".princessmodel").fadeIn();
            });

        },
        'gopage': function () {
            $("body").on("click", '.goto', function () {
                var liveid = $(this).attr("data-liveid");
                var liveurl = $(this).attr("data-liveurl");
                var livekey = $(this).attr("data-livekey");
                var livepfid = $(this).attr("data-pfid");
                var direction = $(this).attr("data-direction");
                var cdn_id = $(this).attr("data-cdnid");
                var liveimg = $(this).attr("data-img");
                var stream_type = $(this).attr("data-stream");

                if (liveid != null) {
                    if (flag == 1) {
                        if (isiOS == true) {
                            window.webkit.messageHandlers.langWeb2App_showToast.postMessage({body: '{"msg":"你當前正在開播，無法跳轉到其他直播間！"}'});
                        } else {
                            javascriptinterface.langWeb2App_showToast("你當前正在開播，無法跳轉到其他直播間！");
                        }
                    } else {
                        h5toRoom(livepfid, liveid, liveurl, livekey, direction, cdn_id, liveimg, stream_type);
                    }
                } else {
                    h5toHomepage(livepfid);
                }

            });
        },
        'getParam': function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }
    };
    new page.base;

    function changeNum(data,type){
        setNum(data,type);
        drawNumDom(type);
    }
    function setNum(data,type){
        $.extend(userNum[type],data);
        $.each(userNum[type],function(k,v){
            userNum[type][k]=parseInt(v);
        });
    }
    function drawNumDom(type){
        switch (type) {
            case 'balance':
                // $(".addlist .first .total").text("x" + (userNum.balance.pet_num - userNum.current.pet_num));
                // $(".addlist .second .total").text("x" + (userNum.balance.lamp_num - userNum.current.lamp_num));
                // $(".addlist .third .total").text("x" + (userNum.balance.comb_num - userNum.current.comb_num));
                $(".addlist .first .total").text("x" + (userNum.balance.pet_num));
                $(".addlist .second .total").text("x" + (userNum.balance.lamp_num));
                $(".addlist .third .total").text("x" + (userNum.balance.comb_num));
                break;
            case 'current':
                $(".addlist .first .num").text(userNum.current.pet_num);
                $(".addlist .second .num").text(userNum.current.lamp_num);
                $(".addlist .third .num").text(userNum.current.comb_num);
                drawNumDom('balance');
                drawCons();
                break;
        }
    }
    function drawCons(){
        var _cons = calcCons(userNum.current);
        $('.lnum em').text(_cons);

        if(_cons>userNum.amount||
            userNum.current.comb_num>userNum.balance.comb_num||
            userNum.current.pet_num>userNum.balance.pet_num||
            userNum.current.lamp_num>userNum.balance.lamp_num||
            (userNum.current.comb_num*userNum.balance.comb_num*
            userNum.current.pet_num*userNum.balance.pet_num*
            userNum.current.lamp_num*userNum.balance.lamp_num)===0
        ){
            //lock make
            // $(".makebtn").addClass("disabled");
            $(".makecon .makebtn").attr("class","disabled");
        }else{
            //unlock make
            // $(".makebtn").removeClass("disabled");
            $(".makecon .disabled").attr("class","makebtn");
        }
        var _magic = calcMagic(userNum.current);
        $('.piclist .magic').text(_magic);
    }
    function drawViewday(){
        $('.datemenu .date').text(timestampToDate(dateArr.viewDay,'mm月dd日'));
        $('.datemenu .left,.datemenu .right').removeClass('disabled');
        if(dateArr.viewDay<=dateArr.startDate){
            //lock left btn
            $('.datemenu .left').addClass('disabled');
        }
        if(dateArr.viewDay>=dateArr.today){
            $('.datemenu .right').addClass('disabled');
            //lock right btn
        }
    }
    function drawRanklist(viewdate){
        drawViewday();
        var formatDate = timestampToDate(viewdate,'yyyymmdd')
        if(rankData['d'+formatDate]){
            var data = rankData['d'+timestampToDate(viewdate,'yyyymmdd')];
            if (data.ret_code == "0") {
                var anchor_send = data.data.send;
                if (anchor_send && anchor_send.length > 0) {
                    var sendlistrequest = $.get("template2019/modelist.html", function (data) {
                        var sendlistrender = template.compile(data);
                        $(".magicmodel .conlist").empty().prepend(sendlistrender(anchor_send));
                        $(".magicmodel .value em").text("魔法券");
                    });
                } else {
                    $(".magicmodel .conlist").empty().append('<p class="nodata">暫無數據</p>')
                }
            }
        }else{
            dailyData(viewdate);
        }
    }

    function changeCurrent(type,to){
        var checkRes = checkChange(type,to);
        if(checkRes===true){
            userNum.current[type] = userNum.current[type]*1 + (to * userNum.mult[type]);
            drawNumDom('current');
        }
    }
    function calcCons(data){
        return data.comb_num/userNum.mult.comb_num * 16 + data.pet_num * 38 + data.lamp_num * 46;
    }
    function calcMagic(data){
        return data.comb_num/userNum.mult.comb_num * 1 + data.pet_num * 5 + data.lamp_num * 7;
    }
    function checkChange(type,to){
        to = parseInt(to)
        var res =
            (userNum.current[type]+ to * userNum.mult[type] > userNum.balance[type]) ||
            (userNum.current[type]+ to * userNum.mult[type] < userNum.mult[type])
                ? false
                :true;
        return res;
    }
    function randomNum(type) {
        var max = userNum.rnd[type]*userNum.mult[type]>userNum.balance[type]?parseInt(userNum.balance[type]/userNum.mult[type]):userNum.rnd[type];
        var _num = parseInt(Math.random()*max)+1;
        return _num * userNum.mult[type]
    }
    function timestampToDate(timestamp,format){
        var _d = new Date(timestamp);
        var y = _d.getFullYear(),m = _d.getMonth()+1,d = _d.getDate();
        if(format.indexOf('yyyy')>-1){
            m = '0'+m;d = '0'+d;m=m.substr(-2,2);d=d.substr(-2,2);
        }
        format = format.replace('yyyy',y).replace('mm',m).replace('dd',d)
        return format;
    }
    //公主的魔法券兌換所四个状态
    function setStatus() {
        var statusClass=['exbtn-1','exbtn0','exbtn1'];
        var _price = [800,500,500,1500];
        var statusArr = userNum.changeStatus;
        var domArr = $('.princessmodel .exbtn');

        $(".princessmodel .mytitle em").text(userNum.myMagic);
        $(".princessmodel .prlist li:nth-child(4) em").text(userNum.cash_num);

        for(var i=0;i<statusArr.length;i++){
            var _s = statusArr[i]+1,_d = domArr.eq(i);
            var _classname=statusClass[_s]
            if(statusArr[i]===0&&userNum.myMagic<_price[i]){
                _classname = statusClass[0];
            }
            _d.attr('class','exbtn '+_classname);
        }
    }

    //
    function openChangeConfirm(type,text,btname){
        $(".canexchange").fadeIn();
        $(".princessmodel").fadeOut();
        $(".canexchange .btns .confirm").attr('data-type',type);
        $(".canexchange .conlist span").text(btname);
        $(".canexchange .conlist em").text(text);
    }

    // 第一个页签：魔法長髮
    function getIdata() {
        $.post(ac1_index,
            $('#anchorListForm').serialize(),
            function (data) {
                if (data.ret_code == "0") {

                    //倒计時1:魔法長髮
                    var leaveTime1 = data.data.count_down;
                    if (leaveTime1 > 0) {
                        timeStamp(leaveTime1, 1);
                    }
                    if (leaveTime1 == 0) {
                        $('.leftTime1').html('當前階段已結束');
                        $('#levelName').val('2');
                        $(".makemodel .conlist").html("<span class='endspan'>該階段已結束</span>");
                        $(".makemodel .btns").remove();
                    }
                    if (leaveTime1 < 0) {
                        $('.leftTime1').html('當前階段尚未開始');
                    }
                    userNum.amount = data.data.balance;
                    setNum({
                        comb_num:data.data.comb,
                        lamp_num:data.data.lamp,
                        pet_num:data.data.pet
                    },'balance');
                    changeNum(userNum.default,'current');//current must first
                    changeNum(data.data.last_info,'last');

                    var last_balance = data.data.balance;
                    $(".lastlhnum em").text(last_balance);

                    //是否能合成
                    var allow_merge = data.data.allow_merge;
                    if(allow_merge<=0){
                        $(".final_synthetic .synbtn").attr("class","disabled");
                    }

                    //弹幕
                    var bullet_list = data.data.bullet_list;
                    var speed=[
                        '9',
                        '7',
                        '9',
                        '9',
                        '9',
                        '9',
                        '9',
                        '9',
                        '9',
                        '9'
                    ];
                    var delay=[
                        '1.5',
                        '30',
                        '3.5',
                        '6.5',
                        '25',
                        '8',
                        '10.5',
                        '16',
                        '14',
                        '17'
                    ];
                    var top_number=[
                        '100',
                        '200',
                        '300',
                        '400',
                        '500',
                        '600',
                        '700',
                        '800',
                        '900',
                        '1000'
                    ];
                    var Stop_number=[
                        '180',
                        '280',
                        '380',
                        '480',
                        '580',
                        '680',
                        '780',
                        '880',
                        '980',
                        '1080'
                    ];
                    var html="";
                    for(var a=0;a<bullet_list.length;a++){
                        if(1){
                            var headimg = bullet_list[a].headimg;
                            var content = bullet_list[a].content;
                            var cssstyle={};
                            cssstyle={"top":top_number[a]/75+'rem',"-webkit-animation":'right '+speed[a]+'s infinite '+delay[a]+'s linear'};

                            var ceshi='<div class="barrage-list"><div class="display-list">' +
                                '<div><img class="reImg"  src="'+headimg+'"></div>'+
                                '<div class="barrage-text">'+content+'</div>' +
                                '</div></div>';

                            html+=ceshi;
                        }
                    }
                    $(".barrage-wrapper").append(html);
                    var barrageList=$(".barrage-list");
                    $.each(barrageList,function (a,item) {
                        var cssstyle={};
                        cssstyle={"top":top_number[a]/75+'rem',"-webkit-animation":'right '+speed[a]+'s infinite '+delay[a]+'s linear'};
                        $(item).css(cssstyle);
                    });

                    var anchor_group = data.data.group_id;
                    if (anchor_group && anchor_group > 0) {
                        $(".magicex_btn").show();
                    }

                    setTimeout(function () {
                        $("img.lazy").lazyload({
                            threshold: 280,
                            no_fake_img_loader: true
                        });
                    }, 300);
                    getIIdata();
                }
            }, "json"
        );
    }

    // 第二个页签：公主駕到
    function getIIdata() {
        $.post(data,
            $('#anchorListForm').serialize(),
            function (data) {
                if (data.ret_code == "0") {

                    //倒计時2:公主駕到
                    var leaveTime2 = data.data.count_down;
                    if (leaveTime2 > 0) {
                        timeStamp(leaveTime2, 2);
                    }
                    if (leaveTime2 == 0) {
                        $('.leftTime2').html('當前階段已結束');
                        $(".final_synthetic .synbtn").attr("class","disabled");
                    }
                    if (leaveTime2 < 0) {
                        $('.leftTime2').html('當前階段尚未開始');
                    }

                    //------------公主駕到分组数据----------------
                    //巔峰組
                    var dflist = data.data.list.PEAK;
                    if (dflist && dflist.length > 0) {
                        $(".pagecontent").eq(1).find(".ranklist").eq(0).find('.nodata').remove();
                        var dflistrequest = $.get("template2019/list.html", function (data) {
                            var dflistrender = template.compile(data);
                            $(".pagecontent").eq(1).find(".ranklist").eq(0).find(".btn-more").parents(".pagebottom").prevAll().remove();
                            $(".pagecontent").eq(1).find(".ranklist").eq(0).prepend(dflistrender(dflist));
                        });
                        if (dflist.length > 20) {
                            $(".pagecontent").eq(1).find(".ranklist").eq(0).find(".btn-more").show();
                        }
                    } else {
                        $(".pagecontent").eq(1).find(".ranklist").eq(0).find('.nodata').show();
                    }

                    //當紅組
                    var dhlist = data.data.list.HOT;
                    if (dhlist && dhlist.length > 0) {
                        $(".pagecontent").eq(1).find(".ranklist").eq(1).find('.nodata').remove();
                        var dhlistrequest = $.get("template2019/list.html", function (data) {
                            var dhlistrender = template.compile(data);
                            $(".pagecontent").eq(1).find(".ranklist").eq(1).find(".btn-more").parents(".pagebottom").prevAll().remove();
                            $(".pagecontent").eq(1).find(".ranklist").eq(1).prepend(dhlistrender(dhlist));
                        });
                        if (dhlist.length > 20) {
                            $(".pagecontent").eq(1).find(".ranklist").eq(1).find(".btn-more").show();
                        }
                    } else {
                        $(".pagecontent").eq(1).find(".ranklist").eq(1).find('.nodata').show();
                    }

                    //----------------------------------------
                    var anchor_group_id = data.data.anchor_info.group_id;
                    if (anchor_group_id && anchor_group_id > 0) {
                        bF = true;
                        var angr_id = data.data.anchor_info;
                        //把主播公主駕到底部信息加载进来
                        var anchor_info = [];
                        var user_info = data.data.anchor_info;
                        anchor_info.push(user_info);
                        anchor_info.type = '2';
                        var anchorInforequest = $.get("template2019/anchorInfo.html", function (data) {
                            var render = template.compile(data);
                            $(".dancepage").find(".anchorInfo").empty().append(render(anchor_info)).show();
                        });
                    }
                    setTimeout(function () {
                        $("img.lazy").lazyload({
                            threshold: 280,
                            no_fake_img_loader: true
                        });
                        if (anchor_group_id != "") {
                            if (!/android/i.test(navigator.userAgent)) {
                                var t = window.screen.height;
                            }
                            if (anchor_group_id == 1) {
                                $(".grouPTabs").addClass("groupID1").removeClass("groupID2");
                                $(".grouPTabs li").removeClass();
                                $(".grouPTabs li").eq(0).addClass("active");
                                $(".dancepage .ranklist").eq(0).show().siblings(".ranklist").hide();
                            } else if (anchor_group_id == 2) {
                                $(".grouPTabs").addClass("groupID2").removeClass("groupID1");
                                $(".grouPTabs li").removeClass();
                                $(".grouPTabs li").eq(1).addClass("active");
                                $(".dancepage .ranklist").eq(1).show().siblings(".ranklist").hide();
                            }
                        }
                        if ($('#levelName').val() == 2) {
                            $('.tabgroups').removeClass('I').removeClass('II');
                            $('.tabgroups li').removeClass('active');
                            $('.tabgroups li').removeClass('active').eq(1).trigger("click")
                        }
                    }, 300);
                    setTimeout(function () {
                        $('img.lazy').each(function () {
                            if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                                this.src = 'static/images/false.png';
                            }
                        });
                        if (anchor_group_id != "") {
                            $('#ifbai').val(1);
                            if ($('.anchorInfo ul').attr('rank') > 0) {
                                $('.ranklist:visible ul').each(function () {
                                    if ($(this).attr('pfid') == $('.anchorInfo ul').attr('pfid')) {
                                        $('html,body').animate({scrollTop: $(this).offset().top}, 300);
                                    }
                                });
                            }
                        }
                        $('.mask , .spinner').hide();
                    }, 2000);
                }
            }, "json"
        );
    }

    //单主播贡献榜
    function send_anchor() {
        $.post(send_anc,
            $('#anchor_sendForm').serialize(),
            function (data) {
                if (data.ret_code == "0") {

                    $(".anchormodel .title").text("- 貢獻榜 -");
                    $(".anchormodel .note").hide();

                    var anchor_send = data.data.send;
                    var Gsend = data.data.my_info;
                    var GAsend = [];
                    GAsend.push(Gsend);

                    if (anchor_send && anchor_send.length > 0) {
                        var sendlistrequest = $.get("template2019/modelist.html", function (data) {
                            var sendlistrender = template.compile(data);
                            $(".anchormodel .conlist").empty().prepend(sendlistrender(anchor_send));
                        });
                    } else {
                        $(".anchormodel .conlist").empty().append('<p class="nodata">暫無數據</p>')
                    }
                    var molistrequest = $.get("template2019/model_myinfo.html", function (data) {
                        var molistrender = template.compile(data);
                        $(".anchormodel .myinfo").empty().prepend(molistrender(GAsend));
                    });
                    $(".anchormodel").fadeIn();
                    $("html,body").css({
                        "height": "100%",
                        "overflowY": "hidden"
                    });
                }
            }, "json"
        );
    }

    //总贡献榜
    function sendpi() {
        $.post(send,
            $('#anchor_sendForm').serialize(),
            function (data) {
                if (data.ret_code == "0") {

                    $(".anchormodel .title").text("- 偷心的痞子大盜 -");
                    $(".anchormodel .note").show();

                    var anchor_send = data.data.send;
                    var Gsend = data.data.my_info;
                    var GAsend = [];
                    GAsend.push(Gsend);

                    if (anchor_send && anchor_send.length > 0) {
                        var sendlistrequest = $.get("template2019/modelist.html", function (data) {
                            var sendlistrender = template.compile(data);
                            $(".anchormodel .conlist").empty().prepend(sendlistrender(anchor_send));
                        });
                    } else {
                        $(".anchormodel .conlist").empty().append('<p class="nodata">暫無數據</p>')
                    }
                    var molistrequest = $.get("template2019/model_myinfo.html", function (data) {
                        var molistrender = template.compile(data);
                        $(".anchormodel .myinfo").empty().prepend(molistrender(GAsend));
                    });
                    $(".anchormodel").fadeIn();
                    $("html,body").css({
                        "height": "100%",
                        "overflowY": "hidden"
                    });
                }
            }, "json"
        );
    }

    //我的合成记录
    function makeList() {
        $.post(make_log,
            $('#anchor_sendForm').serialize(),
            function (data) {
                if (data.ret_code == "0") {

                    var datalist = data.data.data;
                    var datalist_total = "";
                    for(var i = 0; i<datalist.length;i++){
                        datalist_total += "<p>" + "<em>" + datalist[i].date + "</em>" + datalist[i].msg + "</p>";
                    }
                    $(".recordlist .conlist").empty().append(datalist_total);
                    if(datalist.length <=0){
                        $(".recordlist .note").show();
                    }
                    $(".recordlist").fadeIn();
                    $("html,body").css({
                        "height": "100%",
                        "overflowY": "hidden"
                    });
                }
            }, "json"
        );
    }

    //日榜
    function dailyData(viewDate) {
        var formatDate = timestampToDate(viewDate,'yyyymmdd');
        $("#anchor_sendForm .date").val(formatDate);
        $.post(daily_rank,
            $('#anchor_sendForm').serialize(),
            function (data) {
                rankData['d'+formatDate]=data;
                drawRanklist(viewDate)
            }, "json"
        );
    }

    //制作
    function makeData() {
        var petData = userNum.current.pet_num;
        var lampData = userNum.current.lamp_num;
        var combData = userNum.current.comb_num;
        $("#makeDataForm .pet").val(petData);
        $("#makeDataForm .lamp").val(lampData);
        $("#makeDataForm .comb").val(combData);
        $.post(make,
            $('#makeDataForm').serialize(),
            function (data) {
                //制作成功时
                var succ_msg = data.data.msg;
                //制作不成功时
                var msg = data.ret_msg;
                if (data.ret_code == "0") {
                    $(".makemodel .conlist p").text(succ_msg);
                }
                else {
                    $(".makemodel .conlist p").text(msg);
                }
            }, "json"
        );
    }

    //合成
    function smelt_logDataPre() {
        $.post(smelt_log,
            $('#anchor_sendForm').serialize(),
            function (data) {
                if (data.ret_code == "0") {
                    userNum.userMagic = data.data.ticket;
                    userNum.userMagic100 = data.data.ticket100;
                }
            }, "json"
        );
    }

    function smelt_logData() {
        $.post(smelt_log,
            $('#anchor_sendForm').serialize(),
            function (data) {
                if (data.ret_code == "0") {

                    $(".magiclist").fadeIn();
                    var ticket = data.data.ticket;
                    var ticket100 = data.data.ticket100;
                    $(".magiclist .top span").text(ticket);
                    $(".magiclist .top em").text(ticket100);

                    var list = data.data.list;
                    var maginList = "";
                    $.each(list,function (index,value) {
                        maginList += "<p><em>" + value.date + "</em>" + value.msg + "</p>";
                    });
                    $(".magiclist .list").empty().append(maginList);
                    if(list.length <=0){
                        $(".magiclist .note").show();
                    }
                    $(".magiclist .magcon").kxbdSuperMarquee({
                        isMarquee:true,
                        isEqual:false,
                        scrollDelay:40,
                        controlBtn:{up:'#goUM',down:'#goDM'},
                        direction:'up'
                    });
                }
            }, "json"
        );
    }

    //合成一次
    function smelt_Data() {
        $.post(smelt,
            $('#anchor_sendForm').serialize(),
            function (data) {
                if (data.ret_code == "0") {
                    $(".synmodel").fadeIn();
                    userNum.userMagic = parseInt(userNum.userMagic) - 100;
                    $(".magiclist .top span").text(userNum.userMagic);

                    if(userNum.userMagic<100){
                        $(".final_synthetic .synbtn").attr("class","disabled");
                    }
                }
            }, "json"
        );
    }

    //头图上面的兑换初始化
    function exchange_init_data() {
        $.post(exchange_init,
            $('#anchor_sendForm').serialize(),
            function (data) {
                if (data.ret_code == "0") {

                    $(".princessmodel").fadeIn();
                    var headimg = data.data.data.anchor.headimg;
                    var nickname = data.data.data.anchor.nickname;
                    var pfid = data.data.data.anchor.pfid;
                    $(".princessmodel .left img").attr("src",headimg);
                    $(".princessmodel .top .name").text(nickname);
                    $(".princessmodel .top .prid").text(pfid);

                    //我可用的魔法券
                    userNum.myMagic = data.data.data.remain;

                    //剩余次数
                    userNum.cash_num = 5 - data.data.data.cash_num;
                    userNum.changeStatus = data.data.data.status
                    setStatus();
                    if($('.anchor_pfid').val() != $('.pfid').val()){
                        $(".princessmodel .exchange_btn,.princessmodel .exbtn,.princessmodel .surplus").hide();
                    }

                }
            }, "json"
        );
    }

    //头图上面的兑换--我的兌換紀錄
    function exchange_log_data() {
        $.post(exchange_log,
            $('#anchor_sendForm').serialize(),
            function (data) {
                if (data.ret_code == "0") {

                    $(".princessmodel").fadeOut();
                    $(".recordlist").fadeIn().addClass("exchangelog");

                    var datalog = data.data.data;
                    var datalogList = "";
                    $.each(datalog,function (index,value) {
                        datalogList += "<p><em>" + value.date + "</em>" + value.msg + "</p>";
                    });
                    $(".recordlist .conlist").empty().append(datalogList);
                    console.log(datalog.length)
                    if(datalog.length <=0){
                        $(".recordlist .note").show();
                    }

                }
            }, "json"
        );
    }

    //头图上面的兑换--兑换
    function exchange_data(exType) {
        $("#exchangeForm .type").val(exType);
        $.post(exchange,
            $('#exchangeForm').serialize(),
            function (data) {
                exType *= 1;
                if (data.ret_code == "0") {
                    var remain = data.remain;
                    $(".princessmodel .mytitle em").text(remain);
                    $(".canexchange").fadeOut();
                    $(".princessmodel").fadeIn();
                    $(".princessmodel .surplus em").text($(".princessmodel .surplus em").text()-1)
                    userNum.myMagic -= ($('.prlist li[type="'+exType+'"] .exbtn').attr('data-magic')*1);
                    if(exType<4){
                        userNum.changeStatus[exType-1]=1;
                    }
                    else{
                        userNum.cash_num--;
                        if(userNum.cash_num===0){
                            userNum.changeStatus[exType-1]=1;
                        }
                    }
                    setStatus();
                }
                else {
                    var ret_msg = data.ret_msg;
                    $(".toast_div").text(ret_msg).show();
                    setTimeout(function () {
                        $(".toast_div").text(ret_msg).hide();
                    },1500);
                }
            }, "json"
        );
    }

    //--------勿改动--------第1、2阶段倒计時组件
    function g(a) {
        var time = parseInt(a) + "秒";
        if (parseInt(a) > 60) {
            var second = parseInt(a) % 60;
            if (second < 10) {
                second = '0' + second;
            }
            var min = parseInt(a / 60);
            time = min + "分" + second + "秒";
            if (min > 60) {
                min = parseInt(a / 60) % 60;
                if (min < 10) {
                    min = '0' + min;
                }
                var hour = parseInt(parseInt(a / 60) / 60);
                time = hour + "小時" + min + "分" + second + "秒";
                if (hour > 24) {
                    hour = parseInt(parseInt(a / 60) / 60) % 24;
                    var day = parseInt(parseInt(parseInt(a / 60) / 60) / 24);
                    time = day + "天" + hour + "小時" + min + "分" + second + "秒";
                }
            }
        }
        return time;
    }

    //--------阶段倒计時入口-------------------
    function timeStamp(second_time, p) {
        if (second_time == 0) {
            // $(".leftTime" + p).html('當前階段已結束');
            if (p == 1) {
                setTimeout(function () {
                    location.reload();
                }, 1500);
            }
        } else if (second_time > 0) {
            second_time--;
            $(".timer" + p).html(g(second_time));
            setTimeout(function () {
                timeStamp(second_time, p);
            }, 1000);
        }
    }

});

function afterTimeTabShow(year, month, day, hours, minutes) {
    var nowDate = new Date().getTime();
    var targetDate = new Date(year, (month - 1), day, hours, minutes).getTime();
    if (nowDate > targetDate) {
        $('.tabgroups').removeClass('I').addClass('II');
        $('.tabgroups li').removeClass('active').eq(1).addClass('active');
        $('.pagecontent').hide().eq(1).show();
    }
}

/*

 <p>本榜單為用戶對所有主播貢獻的許願星 排行</p>
 <p>許願星 相等的用戶依據達成的先後次序排序</p>*/
