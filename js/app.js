//实例初始化
window.pageManager = new PageManager();
window.historyManager = new HistoryManager();
window.navManager = new NavManager();
//应用管理======================================================
var isTouch = 'ontouchstart' in window;
var events = (isTouch) ? {start: 'touchstart', move: 'touchmove', end: 'touchend'} : {start: 'mousedown', move: 'mousemove', end: 'mouseup'};
console.log('isTouch: ', isTouch)
var AppManager = function(){

};
AppManager.prototype = {
    init: function(){
        var _this = this;
        pageManager.init();
        navManager.init();
        var $document = $(document);
        $document.on('touchmove', function(e){
            e.preventDefault();
        })
        //回退事件
        $document.on('history.back', function(e, obj){
            navManager.render(obj.header, obj.footer);
            pageManager.navTo(obj.page.name, {_back: true})
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
                console.log('额，方法还没定义哦:this.' + _method);
                return;
            }
            _this[_method].apply(_this, Array.prototype.slice.call(arguments));
        })
        //默认使用登录页
        pageManager.navTo('login', {_effect: -1});

        //动态创建页面例子
        var p = pageManager.createPage('', 'Hello UED');
        console.log('page: ', p)
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
            return word.substring(0,1).toUpperCase() + word.substring(1);
        });
        return 'init' + upName + 'Page';
    },
    initPageFn: function(page, fn){
        this[this.makeFun(page.name)] = fn;
    },
    //滚动一个布局
    scrollPanel: function(id, option){
        var defaultOption = {
            scrollbarClass: 'myScrollbar',
            checkDOMChanges: true,
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
        //console.log(e, pageName, fromPage, param, 'lll')
        this.updateNavbar();
        $('#J_btn_login').off().on('click', function(){
            /*historyManager.add({
                page: {
                    name: 'login'
                }
            });*/
            pageManager.navTo('home');
        });

        //滚动控制
        this.scrollPanel('J_page_login');
    },
    //更新navbar
    updateNavbar: function(header, footer){
        if(!header){
            navManager.headerWrap.hide();
            pageManager.stretchHeader();
        }else{
            navManager.headerWrap.show();
            pageManager.shrinkHeader();
            navManager.render(header);
        }
        if(!footer){
            navManager.footerWrap.hide();
            pageManager.stretchFooter();
        }else{
            navManager.footerWrap.show();
            pageManager.shrinkFooter();
        }

    },
    //Home
    initHomePage: function(){
        var header = {
            title: {
                text: 'Home Page'
            },
            left: {},
            right: {
                actions: [
                    {
                        type: 'normal',
                        text: '登出',
                        fn: function(){
                            this.on('touchstart click', function(e){
                                e.preventDefault();
                                pageManager.navTo('login');
                            })
                        }
                    }
                ]
            }
        };
        historyManager.add({
            header: header,
            page: {
                name: 'home'
            }
        });
        this.updateNavbar(header, true);
        navManager.footerWrap.find('li').removeClass('active').eq(0).addClass('active');
        $('#J_home_list li').off().on('click', function(e){
            e.preventDefault();
            var $this = $(this);
            var name = $this.attr('data-nav');
            pageManager.navTo(name);
        });
        //滚动控制
        this.scrollPanel('J_scroll_home');
        //调用外部方法
        var pageHome =new PageHome(this, navManager, pageManager, historyManager);
        pageHome.init();
    },
    //列表页
    initListPage: function(e, pageName, fromPage, param){
        //console.log(fromPage)
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
        this.updateNavbar(header, true);
        navManager.footerWrap.find('li').removeClass('active').eq(1).addClass('active');
        $('.list-view li').off().on('click', function(e){
            e.preventDefault();
            historyManager.add({
                header: header,
                page: {
                    name: 'list'
                }
            });
            pageManager.navTo('detail');
        });
        //滚动控制
        this.scrollPanel('J_scroll_list');
        
    },
    initDetailPage: function(e, pageName, fromPage, param){
        //console.log(fromPage)
        var header = {
            title: {
                text: '服务器详情'
            },
            right: {}
        };
        this.updateNavbar(header, true);
        navManager.footerWrap.find('li').removeClass('active').eq(2).addClass('active');
        $('.list-group li').off().on('click', function(e){
            e.preventDefault();
            historyManager.add({
                header: header,
                page: {
                    name: 'detail'
                }
            });
            pageManager.navTo('about');
        });
        //滚动控制
        this.scrollPanel('J_scroll_chart');
        this.scrollPanel('J_scroll_detail');
        //调用外部方法
        var pageDetail =new PageDetail(this, navManager, pageManager, historyManager);
        pageDetail.init();
        //pageDetail.loadList();
        $('.tab-nav li').on('click', function(e){
            e.preventDefault();
            var $this = $(this);
            var tabContent = $this.parent().parent().next().find('.tab-content');
            var index = $('.tab-nav li').index($this);
            $('.tab-nav li').removeClass('active').eq(index).addClass('active');
            tabContent.find('.tab-pane').removeClass('active').eq(index).addClass('active').data('scroller').refresh();

        })
        
    },
    initAboutPage: function(e, pageName, fromPage, param){
        var _this = this;
        var header = {
            title: {
                text: '关于我们'
            },
            right: {}
        };
        this.updateNavbar(header, true);
        navManager.footerWrap.find('li').removeClass('active').eq(3).addClass('active');
        $('#J_create').off().on('click', function(){
            historyManager.add({
                header: header,
                page: {
                    name: 'about'
                }
            });
            var newHeader = {
                title: {
                    text: 'UI规范'
                },
                right: {
                    actions: [
                        {
                            text: "设置",
                            cls: '',
                            fn: function(){
                                $(this).on('click', function(e){
                                    e.preventDefault();
                                    alert($(this).html())
                                })
                            }
                        },
                        {
                            text: "查找",
                            cls: '',
                            fn: function(){
                                $(this).on('click', function(e){
                                    e.preventDefault();
                                    alert($(this).html())
                                })
                            }
                        },
                        {
                            text: "设置2",
                            cls: '',
                            fn: function(){
                                $(this).on('click', function(e){
                                    e.preventDefault();
                                    alert($(this).html())
                                })
                            }
                        }
                    ]
                }
            };
            var $this= $(this);
            if($this.attr('data-nav')){
                pageManager.navTo($this.attr('data-nav'));
                return false;
            }
            var html = new TemplateManager().load('tmpl');
            var p = pageManager.createPage('', html);
            $this.attr('data-nav', p.name);
            
            //动态创建动态方法如: initXxxPage
            _this.initPageFn(p, function(e, pageName, fromPage, param){
                p.$.attr('id', p.name);
                p.$.css({
                    //backgroundColor: '#fff',
                    color: '#fff'

                }).find('.scroller').css({
                    paddingBottom: '50px'
                });
                _this.updateNavbar(newHeader);
                _this.scrollPanel(p.name);
                //
                $('.list-group li').off().on('click', function(e){
                    e.preventDefault();
                    historyManager.add({
                        header: newHeader,
                        page: {
                            name: pageName
                        }
                    });
                    pageManager.navTo('about');
                });
                //fun
                $('.J_alert').off().on('click', function(e){
                    e.preventDefault();
                    alert('你点击了确定')
                });
                $('.J_back').off().on('click', function(e){
                    e.preventDefault();
                    historyManager.back();
                })

                //Loading初始化
                var opts = {
                    lines: 12, // The number of lines to draw
                    length: 4, // The length of each line
                    width: 2, // The line thickness
                    radius: 5, // The radius of the inner circle
                    color: '#000', // #rgb or #rrggbb
                    speed: 1, // Rounds per second
                    trail: 60, // Afterglow percentage
                    shadow: false, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    className: 'spinner', // The CSS class to assign to the spinner
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: 'auto', // Top position relative to parent in px
                    left: 'auto' // Left position relative to parent in px
                };
                $('.icon-loading').each(function(){
                    if($(this).find('.spinner').length > 0){
                        return;
                    }
                    new Spinner(opts).spin(this);
                })
            });
            pageManager.navTo(p.name);
            
            //pageManager.stretch();
        })
    }
};

var appManager = new AppManager();
appManager.init();