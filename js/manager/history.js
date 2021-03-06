/**
 * 历史管理器
 */
/*
一个历史单位：

*/
(function(window, $document) {
  var HistoryManager = function(){
      this.historys = [];
  };
  HistoryManager.prototype = {
      init: function(){

      },
      add: function(obj){
          var last = this.historys.length > 0 ? this.historys.slice(-1)[0] : {};
          //console.log(this.historys, last, obj)
          if(this.historys.length > 0 && (last.page.name === obj.page.name)){
            console.log('页面重复，不需要添加到历史记录: ' + obj.page.name)
            return;
          }
          var header = $.extend(true, {}, CONFIG.header, obj.header);
          var footer = $.extend(true, {}, CONFIG.footer, obj.footer);
          //TODO: 检查最后一个是否和要添加到重复,如果重复就不再添加
          this.historys.push({
              header: header,
              footer: footer,
              page: obj.page
          });
          $document.trigger('history.add', obj);
          console.log('History add:', obj.page.name)

      },
      back: function(){
          if(this.historys.length < 1){
              return;
          }
          var obj = this.historys.splice(-1)[0];
          //var obj = this.historys.pop();
          $document.trigger('history.back', obj);
          console.log('History remove:', obj.page.name);
      }
  };
  window.HistoryManager = HistoryManager;
})(this, $(document));