//图表
var chart1; // globally available
$(document).ready(function() {
  chart1 = new Highcharts.Chart({
     title: {
        text: ''
     },
     colors: ['#f80', '#fff', '#0ff'],
     chart: {
        renderTo: 'canvas',
        type: 'spline',
        backgroundColor: 'transparent',
        borderColor: '#fff'
     },
     legend: {
        enabled: true,
        verticalAlign: 'top',
        borderWidth: 0,
        style: {
            align: 'right'
        },
        itemStyle: {
            color: '#fff'
        },
        itemHoverStyle: {

        },
        itemHiddenStyle: {

        }
     },
     xAxis: {
        categories: ['15:00', '16:00', '17:00', '18:00', '19:00'],
        lineColor: '#f80',
        tickColor: '#ff8800',
        labels: {
            style: {
                color: '#fff'
            }
        }
     },
     yAxis: {
        title: {
            text: ''
        },
        gridLineColor: '#777',
        max: 100,
        min: 0,
        tickInterval: 50,
        labels: {
            style: {
                color: '#fff'
            }
        }
     },
     series: [{
        name: 'CPU使用率',
        data: [25, 33, 60, 55, 12] // predefined JavaScript array
     }],
     credits: {
        enabled: false
     }
  });

});
//实例初始化
window.pageManager = new PageManager();
window.historyManager = new HistoryManager();
window.navManager = new NavManager();
//应用管理======================================================
var AppManager = function(){

};
AppManager.prototype = {
    init: function(){
        var _this = this;
        pageManager.init();
        navManager.init();


        var $document = $(document);
        //回退事件
        $document.on('history.back', function(e, obj){
            navManager.render(obj.header, obj.footer);
            pageManager.navTo(obj.page.name)
        });
        //添加历史事件
        $document.on('history.add', function(e, obj){
            //console.log('add event')
        });
        //动态配置页面功能
        $document.on('page', function(){//e, pageName, fromPage, param
            var args = arguments;
            var _method = _this.makeFun(args[1]);
            if(!_this[_method]){
                console.log('奥嚎，功能还没写哦');
                return;
            }
            _this[_method].apply(_this, Array.prototype.slice.call(arguments));
        })
        //默认使用登录页
        pageManager.navTo('login');

        //动态创建页面例子
        var p = pageManager.createPage('', 'Hello UED');
        //动态创建动态方法
        /*_this[_this.makeFun(p.name)] = function(e, pageName, fromPage, param){
            alert(arguments[1]);
            console.log(_this)
        }*/
        //pageManager.navTo(p.name, {id: 100});
        //pageManager.stretch();
        //end
    },
    makeFun: function(pageName){
        var upName = pageName.replace(/\b\w+\b/g, function(word){
            //console.log(word)
            return word.substring(0,1).toUpperCase()+word.substring(1);
        });
        return 'init' + upName + 'Page';
    },
    //滚动一个布局
    scrollPanel: function(id, option){
        var defaultOption = {
            scrollbarClass: 'myScrollbar',
            onBeforeScrollStart: function(e){
                var target = e.target;
                while (target.nodeType != 1) target = target.parentNode;
                if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                  e.preventDefault();
            }
        };
        var opt = $.extend(defaultOption, option);
        var $panel = $('#' + id);
        if($panel.data('scroller')){
            return;
        }
        var myScroll = new iScroll(id, opt);
        $panel.data('scroller', myScroll);
    },
    initLoginPage: function(e, pageName, fromPage, param){
        console.log(e, pageName, fromPage, param, 'lll')
        navManager.headerWrap.hide();
        navManager.footerWrap.hide();
        pageManager.stretch();
        $('#J_btn_login').off().on('click', function(){
            historyManager.add({
                page: {
                    name: 'login'
                }
            });
            pageManager.navTo('list');
        });

        //滚动控制
        /*var $loginPanel = $('#J_page_login');
        if(!$loginPanel.data('scroller')){
            var myScroll = new iScroll('J_page_login', { scrollbarClass: 'myScrollbar', onBeforeScrollStart:function(e){
                var target = e.target;
                while (target.nodeType != 1) target = target.parentNode;
                if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                  e.preventDefault();
            }});
            $loginPanel.data('scroller', myScroll);
        }*/
        this.scrollPanel('J_page_login');
    },
    //图表页
    initStatusPage: function(){
        //滚动控制
        /*var $chart = $('#J_scroll_chart');
        if(!$chart.data('scroller')){
            var myScroll = new iScroll('J_scroll_chart', { scrollbarClass: 'myScrollbar'});
            $chart.data('scroller', myScroll);
        }*/
        this.scrollPanel('J_scroll_chart');
    },
    //列表页
    initListPage: function(e, pageName, fromPage, param){
        //console.log(fromPage)
        navManager.headerWrap.show();
        var header = {
            title: {
                text: '服务器列表'
            },
            right: {
                actions: [
                    {
                        type: 'refresh',
                        text: '刷新',
                        fn: function(){
                            this.on('touchstart click', function(e){
                                e.preventDefault();
                                alert('不要刷新我');
                            })
                        }
                    }
                ]
            }
        };
        navManager.render(header);

        navManager.footerWrap.show();
        navManager.footerWrap.find('li').removeClass('active').eq(1).addClass('active');
        $('.list-view li').off().on('click', function(){
            historyManager.add({
                header: header,
                page: {
                    name: 'list'
                }
            });
            pageManager.navTo('detail');
        });
        //滚动控制
        /*var $list = $('#J_scroll_list');
        if(!$list.data('scroller')){
            var myScroll = new iScroll('J_scroll_list', { scrollbarClass: 'myScrollbar'});
            $list.data('scroller', myScroll);
        }*/
        this.scrollPanel('J_scroll_list');
        
    },
    initDetailPage: function(e, pageName, fromPage, param){
        //console.log(fromPage)
        navManager.headerWrap.show();
        navManager.footerWrap.show();
        var header = {
            title: {
                text: '服务器详情'
            },
            right: {
                actions: []
            }
        };
        navManager.render(header);

        navManager.footerWrap.find('li').removeClass('active').eq(3).addClass('active');
        $('.list-group li').off().on('click', function(){
            historyManager.add({
                header: header,
                page: {
                    name: 'detail'
                }
            });
            pageManager.navTo('about');
        });
        //滚动控制
        /*var $detail = $('#J_scroll_detail');
        if(!$detail.data('scroller')){
            var myScroll = new iScroll('J_scroll_detail', { scrollbarClass: 'myScrollbar'});
            $detail.data('scroller', myScroll);
        }*/
        this.scrollPanel('J_scroll_detail');
        
    },
    initAboutPage: function(e, pageName, fromPage, param){
        var _this = this;
        var header = {
            title: {
                text: '关于我们'
            }
        };
        navManager.render(header);
        $('#J_create').off().on('click', function(){
            historyManager.add({
                header: header,
                page: {
                    name: 'about'
                }
            });
            var $this= $(this);
            if($this.attr('data-nav')){
                pageManager.navTo($this.attr('data-nav'));
                navManager.render({
                    title: {
                        text: '新页面'
                    }
                });
                return false;
            }
            var html = new TemplateManager().load('tmpl');
            var p = pageManager.createPage('', html);
            $this.attr('data-nav', p.name);
            
            //动态创建动态方法
            _this[_this.makeFun(p.name)] = function(e, pageName, fromPage, param){
                //alert(arguments[1]);
                //console.log(arguments)
                p.$.attr('id', p.name);
                _this.scrollPanel(p.name);
                p.$.find('.container').css({
                    backgroundColor: '#fff'
                })
            }
            pageManager.navTo(p.name);
            navManager.render({
                title: {
                    text: '新页面'
                }
            });
            //pageManager.stretch();
        })
    }
};

var appManager = new AppManager();
appManager.init();