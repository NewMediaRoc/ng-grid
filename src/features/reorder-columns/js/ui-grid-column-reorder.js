(function(){
  'use strict';

  // Extend the uiGridHeaderCell directive
  angular.module('ui.grid').directive('uiGridHeaderCell', ['$compile', function ($compile) {
    return {
      // Run after the original uiGridHeaderCell, and after the resizer feature
      priority: -9,
      require: '^uiGrid',
      compile: function(){
        return {
          post: function ($scope, $elm, $attrs, uiGridCtrl) {
            if (uiGridCtrl.grid.options.enableColumnReordering){
              if($scope.col.colDef.reorderable === false) {
                $elm.addClass('ui-grid-column-reorder-locked');
              } else {
                $compile(angular.element($elm.children()[1]).attr('ui-grid-column-reorder', '' ))($scope);
              }
            }
          }
        };
      }
    };
  }]);

  var module = angular.module('ui.grid.column-reorder', ['ui.grid']);

  /**
   * @ngdoc directive
   * @name ui.grid.reorderColumns.directive:uiGridColumnReorder
   * @element div
   * @restrict A
   *
   * @description
   * Draggable handle that controls column resizing.
   *
   * @example
   <doc:example module="app">
   <doc:source>
   <script>
   var app = angular.module('app', ['ui.grid', 'ui.grid.reorderColumns']);

   app.controller('MainCtrl', ['$scope', function ($scope) {
          $scope.gridOpts = {
            enableColumnReordering: true,
            data: [
              { "name": "Ethel Price", "gender": "female", "company": "Enersol" },
              { "name": "Claudine Neal", "gender": "female", "company": "Sealoud" },
              { "name": "Beryl Rice", "gender": "female", "company": "Velity" },
              { "name": "Wilder Gonzales", "gender": "male", "company": "Geekko" }
            ]
          };
        }]);
   </script>

   <div ng-controller="MainCtrl">
   <div class="testGrid" ui-grid="gridOpts"></div>
   </div>
   </doc:source>
   <doc:scenario>
   // TODO: finish

   </doc:scenario>
   </doc:example>
   */

  module.directive('uiGridColumnReorder', ['$log', '$document', 'uiGridConstants', 'gridUtil', function($log, $document, uiGridConstants, gridUtil) {
    return {
      //replace: true,
      priority: -11,//e
      //templateUrl: 'ui-grid/ui-grid-scrollbar',
      require: '?^uiGrid',
//      scope: {
//        'type': '@'
//      },
      link: function($scope, $elm, $attrs, uiGridCtrl) {


        if (uiGridCtrl === undefined) {
          throw new Error('[ui-grid-reorder-columns] uiGridCtrl is undefined!');
        }

        //$log.debug('ui-grid-reorder-columns link $elm:',$elm);

        var dragElement, dragElm, offsetX, offsetY, dragIndex;
        dragElement = $elm.parent();
        dragElm = dragElement[0];

        dragElm.draggable=true;

        dragElm.addEventListener('dragstart', function(e) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('Text', JSON.stringify($scope.col));
          this.classList.add('ui-grid-reorder-columns-dragging');
          dragElement.css({
            background: dragElement.parent().parent().parent().css('background')
          });
          return false;
        }, false );

        dragElm.addEventListener( 'dragend', function(e) {
          this.classList.remove('ui-grid-reorder-columns-dragging');
          return false;
        }, false );

//        dragElement.on('dragstart', function(event){
//          dragIndex=$scope.$index;
////          event.dataTransfer.effectAllowed = 'move';
////          event.dataTransfer.dropEffect = 'move';
//          //event.dataTransfer.setData('Text', $scope.);
//          console.log('drag event',event, " scope",$scope);
//          dragElement.addClass('ui-grid-reorder-columns-dragging');
//          dragElement.css({
//            background: dragElement.parent().parent().parent().css('background')
//            //width:dragElement.css('width')
//          });
//        });

        dragElm.addEventListener('dragover', function(e) {
          e.dataTransfer.dropEffect = 'move';
          // allows us to drop
          if (e.preventDefault) {
            e.preventDefault();
          }
          this.classList.add('ui-grid-reorder-columns-drag-over');
          return false;
        }, false );

        dragElm.addEventListener('dragenter', function(e) {
          this.classList.add('ui-grid-reorder-columns-drag-over');
          return false;
        }, false );

        dragElm.addEventListener( 'dragleave', function(e) {
          this.classList.remove('ui-grid-reorder-columns-drag-over');
          return false;
        }, false );

        dragElm.addEventListener('drop', function(e) {
          // Stops some browsers from redirecting.
          if (e.stopPropagation) {
            e.stopPropagation();
          }

          this.classList.remove('ui-grid-reorder-columns-drag-over');

          var droppedCol = e.dataTransfer.getData('Text');
          droppedCol = JSON.parse(droppedCol);
          var targetOrderIndex = $scope.col.colDef.orderIndex;
          var droppedIndex = droppedCol.colDef.orderIndex;

          //uiGridCtrl.reorderColumns(droppedCol, targetOrderIndex);
          uiGridCtrl.grid.reorderColumns(droppedIndex, targetOrderIndex);

          uiGridCtrl.grid.buildColumns()
          .then(function() {
            // Then refresh the grid canvas, rebuilding the styles so that the scrollbar updates its size
            uiGridCtrl.refreshCanvas(true);
          });

          dragElement.css({ background:'inherit' });

          return false;
        }, false );

//        function mousedown(event){
////          // Prevent default dragging of selected content
//          event.preventDefault();
//          offsetX = event.offsetX;
//          offsetY = event.offsetY;
//
//          var parentElement = $elm.parent();
//          dragElement = parentElement.clone();
//          dragElement.addClass('ui-grid-reorder-columns-dragging');
//          dragElement.css({
//            background: parentElement.parent().parent().parent().css('background'),
//            width:parentElement.css('width')
//          });
//          mousemove(event);
//          angular.element('body').append(dragElement);
//
//          $document.on('mousemove', mousemove);
//          $document.on('mouseup', mouseup);
//        }
//        //$elm.on('mousedown', mousedown);
//
//        function mousemove(event) {
//          dragElement.css({
//            top: (event.pageY-offsetY) + 'px',
//            left:  (event.pageX-offsetY) + 'px'
//          });
//        }
//
//        function mouseup(event) {
//          console.log("mouseup",event);
//          dragElement.remove();
//          $document.unbind('mousemove', mousemove);
//          $document.unbind('mouseup', mouseup);
//        }

        /**
         * Link stuff
         */

//        if ($scope.type === 'vertical') {
//          $elm.addClass('ui-grid-scrollbar-vertical');
//        }
//        else if ($scope.type === 'horizontal') {
//          $elm.addClass('ui-grid-scrollbar-horizontal');
//        }

        // Get the scrolling class from the "scrolling-class" attribute
//        var scrollingClass;
//        $attrs.$observe('scrollingClass', function(n, o) {
//          if (n) {
//            scrollingClass = n;
//          }
//        });

        // Show the scrollbar when the mouse hovers the grid, hide it when it leaves UNLESS we're currently scrolling.
        //   record when we're in or outside the grid for the mouseup event handler
//        var mouseInGrid;
//        function gridMouseEnter() {
//          mouseInGrid = true;
//          $elm.addClass('ui-grid-scrollbar-visible');
//
//          $document.on('mouseup', mouseup);
//        }
//        uiGridCtrl.grid.element.on('mouseenter', gridMouseEnter);

//        function gridMouseLeave() {
//          mouseInGrid = false;
//          if (! uiGridCtrl.grid.isScrolling()) {
//            $elm.removeClass('ui-grid-scrollbar-visible');
//          }
//        }
//        uiGridCtrl.grid.element.on('mouseleave', gridMouseLeave);

        /**
         *
         * Scrollbar sizing
         *
         */

          // Size the scrollbar according to the amount of data. 35px high minimum, otherwise scale inversely proportinal to canvas vs viewport height
//        function updateVerticalScrollbar(gridScope) {
//          var scrollbarHeight = Math.floor(Math.max(35, uiGridCtrl.grid.getViewportHeight() / uiGridCtrl.grid.getCanvasHeight() * uiGridCtrl.grid.getViewportHeight()));
//          uiGridCtrl.grid.verticalScrollbarStyles = '.grid' + uiGridCtrl.grid.id + ' .ui-grid-scrollbar-vertical { height: ' + scrollbarHeight + 'px; }';
//        }

//        function updateHorizontalScrollbar(gridScope) {
//          var minWidth = 35;
//          var scrollbarWidth = Math.floor(
//            Math.max(
//              minWidth,
//              uiGridCtrl.grid.getViewportWidth() / uiGridCtrl.grid.getCanvasWidth() * uiGridCtrl.grid.getViewportWidth()
//            )
//          );
//
//          scrollbarWidth = isNaN(scrollbarWidth) ? minWidth : scrollbarWidth;
//
//          uiGridCtrl.grid.horizontalScrollbarStyles = '.grid' + uiGridCtrl.grid.id + ' .ui-grid-scrollbar-horizontal { width: ' + scrollbarWidth + 'px; }';
//        }

//        if ($scope.type === 'vertical') {
//          uiGridCtrl.grid.registerStyleComputation(updateVerticalScrollbar);
//        }
//        else if ($scope.type === 'horizontal') {
//          uiGridCtrl.grid.registerStyleComputation(updateHorizontalScrollbar);
//        }

        // Only show the scrollbar when the canvas height is less than the viewport height
//        $scope.showScrollbar = function() {
//          // TODO: handle type
//          if ($scope.type === 'vertical') {
//            return uiGridCtrl.grid.getCanvasHeight() > uiGridCtrl.grid.getViewportHeight();
//          }
//          else if ($scope.type === 'horizontal') {
//            return uiGridCtrl.grid.getCanvasWidth() > uiGridCtrl.grid.getViewportWidth();
//          }
//        };

//        function getElmSize() {
//          if ($scope.type === 'vertical') {
//            return gridUtil.elementHeight($elm, 'margin');
//          }
//          else if ($scope.type === 'horizontal') {
//            return gridUtil.elementWidth($elm, 'margin');
//          }
//        }
//
//        function getElmMaxBound() {
//          if ($scope.type === 'vertical') {
//            return uiGridCtrl.grid.getViewportHeight() - getElmSize();
//          }
//          else if ($scope.type === 'horizontal') {
//            return uiGridCtrl.grid.getViewportWidth() - getElmSize();
//          }
//        }
//

        /**
         *
         * Scrollbar movement and grid scrolling
         *
         */

//        var startY = 0,
//          startX = 0,
//          y = 0,
//          x = 0;

        // Get the height of the scrollbar, including its margins
        // var elmHeight = gridUtil.elementHeight($elm, 'margin');


        // Get the "bottom boundary" which the scrollbar cannot scroll past (which is the viewport height minus the height of the scrollbar)
        // var elmBottomBound = uiGridCtrl.grid.getViewportHeight() - elmHeight;
        // var elmSize = getElmSize();
//        var elmMaxBound = getElmMaxBound();


        // On mousedown on the scrollbar, listen for mousemove events to scroll and mouseup events to unbind the move and mouseup event
//        function mousedown(event) {
//          // Prevent default dragging of selected content
//          event.preventDefault();
//
//          uiGridCtrl.grid.setScrolling(true);
//
//          $elm.addClass(scrollingClass);
//
//          // Get the height of the element in case it changed (due to canvas/viewport resizing)
//          // elmHeight = gridUtil.elementHeight($elm, 'margin');
//          // elmSize = getElmSize();
//
//          // Get the bottom boundary again
//          // elmBottomBound = uiGridCtrl.grid.getViewportHeight() - elmHeight;
//          elmMaxBound = getElmMaxBound();
//
//          // Store the Y value of where we're starting
//          startY = event.screenY - y;
//          startX = event.screenX - x;
//
//          $document.on('mousemove', mousemove);
//          $document.on('mouseup', mouseup);
//        }

        // Bind to the mousedown event
//        $elm.on('mousedown', mousedown);

        // Emit a scroll event when we move the mouse while scrolling
//        function mousemove(event) {
//          // The delta along the Y axis
//          y = event.screenY - startY;
//          x = event.screenX - startX;
//
//          // Make sure the value does not go above the grid or below the bottom boundary
//
//          var scrollArgs = { target: $elm };
//          if ($scope.type === 'vertical') {
//            if (y < 0) { y = 0; }
//            if (y > elmMaxBound) { y = elmMaxBound; }
//
//            var scrollPercentageY = y / elmMaxBound;
//
//            scrollArgs.y = { percentage: scrollPercentageY, pixels: y };
//          }
//          else if ($scope.type === 'horizontal') {
//            if (x < 0) { x = 0; }
//            if (x > elmMaxBound) { x = elmMaxBound; }
//
//            var scrollPercentageX = x / elmMaxBound;
//
//            scrollArgs.x = { percentage: scrollPercentageX, pixels: x };
//          }
//
//          // The percentage that we've scrolled is the y axis delta divided by the total scrollable distance (which is the same as the bottom boundary)
//
//          //TODO: When this is part of ui.grid module, the event name should be a constant
//          // $log.debug('scrollArgs', scrollArgs);
//          $scope.$emit(uiGridConstants.events.GRID_SCROLL, scrollArgs);
//        }

        // Bind to the scroll event which can come from the body (mouse wheel/touch events), or other places
//        var scrollDereg = $scope.$on(uiGridConstants.events.GRID_SCROLL, function(evt, args) {
//          // Make sure the percentage is normalized within the range 0-1
//
//          var scrollPercentage;
//          if ($scope.type === 'vertical') {
//            // Skip if no scroll on Y axis
//            if (! args.y) {
//              return;
//            }
//            scrollPercentage = args.y.percentage;
//          }
//          else if ($scope.type === 'horizontal') {
//            // Skip if no scroll on X axis
//            if (! args.x) {
//              return;
//            }
//            scrollPercentage = args.x.percentage;
//          }
//
//          if (scrollPercentage < 0) { scrollPercentage = 0; }
//          if (scrollPercentage > 1) { scrollPercentage = 1; }
//
//          // Get the height of the element in case it changed (due to canvas/viewport resizing)
//          // elmSize = getElmSize();
//
//          // Get the bottom bound again
//          elmMaxBound = getElmMaxBound();
//
//          // The new top value for the scrollbar is the percentage of scroll multiplied by the bottom boundary
//          var newScrollPosition = scrollPercentage * elmMaxBound;
//
//          // Prevent scrollbar from going beyond container
//          // if (newTop > uiGridCtrl.grid.getCanvasHeight() - elmHeight) {
//          //   newTop = uiGridCtrl.grid.getCanvasHeight() - elmHeight;
//          // }
//
//          // Store the new top in the y value
//
//          if ($scope.type === 'vertical') {
//            y = newScrollPosition;
//
//            // Set the css for top
//            $elm.css({
//              top: y + 'px'
//            });
//          }
//          else {
//            x = newScrollPosition;
//            $elm.css({
//              left: x + 'px'
//            });
//          }
//        });

        // When the user lets go of the mouse...
//        function mouseup() {
//          // Remove the "scrolling" class, if any
//          $elm.removeClass(scrollingClass);
//
//          if (! mouseInGrid) {
//            $elm.removeClass('ui-grid-scrollbar-visible');
//          }
//
//          uiGridCtrl.grid.setScrolling(false);
//
//          // Unbind the events we bound to the document
//          $document.off('mousemove', mousemove);
//          $document.off('mouseup', mouseup);
//        }


        /**
         *
         * For slide-in effect
         *
         */

        // if (! gridUtil.isTouchEnabled()) {
        //   $scope.grid.element.on('mouseenter mouseleave', function() {
        //     $elm.toggleClass('in');
        //   });
        // }
        // else {
        //   $elm.addClass('in');
        // }

        // $scope.grid.element.on('mouseout', function() {
        //   $log.debug('mouseout!');
        //   $elm.removeClass('in');
        // });


        /**
         *
         * Remove all
         *
         */

//        $elm.on('$destroy', function() {
//          scrollDereg();
//          $document.off('mousemove', mousemove);
//          $document.off('mouseup', mouseup);
//          $elm.unbind('mousedown');
//          uiGridCtrl.grid.element.off('mouseenter', gridMouseEnter);
//          uiGridCtrl.grid.element.off('mouseleave', gridMouseLeave);
//
//          // For fancy slide-in effect above
//          // $scope.grid.element.unbind('mouseenter');
//          // $scope.grid.element.unbind('mouseleave');
//        });
      }
    };
  }]);

})();