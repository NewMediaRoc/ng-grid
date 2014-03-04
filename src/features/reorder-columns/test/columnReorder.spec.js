describe('ui.grid.column-reorder', function () {
  var grid, $scope, $compile, recompile;

  var data = [
    { "name": "Ethel Price", "gender": "female", "company": "Enersol" },
    { "name": "Claudine Neal", "gender": "female", "company": "Sealoud" },
    { "name": "Beryl Rice", "gender": "female", "company": "Velity" },
    { "name": "Wilder Gonzales", "gender": "male", "company": "Geekko"}
  ];

  var mixedColDefs = [
    { field:"name", name:"Name", reorderable:true, orderIndex:2 },
    { field:"gender", name:"Gender", reorderable:false, orderIndex:1 },
    { field:"company", name:"Company", reorderable:false, orderIndex:0 },
    { field:"name", name:"Name", reorderable:true, orderIndex:3 },
  ];

  beforeEach(module('ui.grid'));
  beforeEach(module('ui.grid.column-reorder'));

  beforeEach(inject(function(_$compile_, $rootScope) {
    $scope = $rootScope;
    $compile = _$compile_;

    $scope.gridOpts = {
      enableColumnReordering: true,
      data: data
    };

    grid = angular.element('<div style="width: 500px; height: 300px" ui-grid="gridOpts"></div>');
    document.body.appendChild(grid[0]);

    recompile = function() {
      $compile(grid)($scope);
      $scope.$digest();
    };

    recompile();
  }));

  afterEach(function() {
    angular.element(grid).remove();
    grid = null;
  });

  describe('setting enableColumnReordering to true', function() {

    it('should attach the reorder directive to the column header elements', function() {
      var reorderableColumns = $(grid).find('[ui-grid-column-reorder]');

      expect(reorderableColumns.length).toEqual(3);
    });

//    beforeEach(function () {
//      $scope.gridOpts.columnDefs = mixedColDefs;
//    });

    describe('and not setting a column reorderable (or setting to true)', function(){
      xit('should by default cause reorder directive to be attached to the header elements', function() {
        //var resizers = $(grid).find('[ui-grid-column-resizer]');

        //expect(resizers.size()).toEqual(5);
      });
    });
    describe('and setting a columnDef reorderable to false',function(){
      xit('should place the ui-grid-column-reorder-locked class on the column header', function (){

      });
    });
  });

  //before each, insert 8 columns

  //when dragging column
  describe('when dragging a column', function () {

    describe('and dropping a column', function () {
      xit('should correctly move the first column just before the fifth column', function (){
        //expect resulting order to be: ?
      });
      xit('should correctly move the third column just before the fifth column', function (){
        //expect resulting order to be: ?
      });
      xit('should correctly move the last column just before the third column', function (){
        //expect resulting order to be: ?
      });
      xit('should correctly move the fifth column just before the third column', function (){
        //expect resulting order to be: ?
      });
      xit('should correctly move the first column just before the last column', function (){
        //expect resulting order to be: ?
      });

    });


    //already scrolled to the edge versus has scrolling room?

    describe('and dragging past the left edge of the viewport', function () {
      xit('should scroll horizontally to the right', function(){

      });
    });

    describe('and dragging past the right edge of the viewport', function () {
      xit('should scroll horizontally to the right', function(){

      });
    });

  });


//  describe('setting flag on colDef to false', function() {
//    it('should result in no resizer elements being attached to the column', function() {
//      $scope.gridOpts.columnDefs = [
//        { field: 'name' },
//        { field: 'gender', enableColumnResizing: false },
//        { field: 'company' }
//      ];
//
//      recompile();
//
//      var middleCol = $(grid).find('[ui-grid-header-cell]:nth-child(2)');
//      var resizer = middleCol.find('[ui-grid-column-resizer]');
//
//      expect(resizer.size()).toEqual(0);
//    });
//  });


//  // NOTE: these pixel sizes might fail in other browsers, due to font differences!
//  describe('when double-clicking a resizer', function() {
//    it('should resize the column to the maximum width of the rendered columns', function(done) {
//      var firstResizer = $(grid).find('[ui-grid-column-resizer]').first();
//
//      var colWidth = $(grid).find('.col0').first().width();
//
//      expect(colWidth).toEqual(166);
//
//      firstResizer.trigger('dblclick');
//
//      $scope.$digest();
//
//      var newColWidth = $(grid).find('.col0').first().width();
//
//      expect(newColWidth).toEqual(100);
//    });
//  });
//
//  describe('clicking on a resizer', function() {
//    it('should cause the column separator overlay to be added', function() {
//      var firstResizer = $(grid).find('[ui-grid-column-resizer]').first();
//
//      firstResizer.trigger('mousedown');
//      $scope.$digest();
//
//      var overlay = $(grid).find('.ui-grid-resize-overlay');
//
//      expect(overlay.size()).toEqual(1);
//
//      // The grid shouldn't have the resizing class
//      expect(grid.hasClass('column-resizing')).toEqual(false);
//    });
//
//    describe('and moving the mouse', function() {
//      it('should cause the overlay to move', function() {
//
//      });
//    });
//  });


});