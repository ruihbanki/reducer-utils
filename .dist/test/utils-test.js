'use strict';

var _chai = require('chai');

var _stateProxy = require('../src/state-proxy');

var _stateProxy2 = _interopRequireDefault(_stateProxy);

var _utils = require('../src/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

beforeEach(function () {
    this.items = [{ id: 1, name: 'Item 1' }, { id: 3, name: 'Item 3' }, { id: 5, name: 'Item 5' }, { id: 12, name: 'Item 12' }];
    this.itemsNested = [{
        id: 1,
        name: 'Item 1',
        children: [{
            id: 2,
            name: 'Item 2'
        }, {
            id: 3,
            name: 'Item 3',
            children: [{
                id: 4,
                name: 'Item 4'
            }, {
                id: 5,
                name: 'Item 5'
            }]
        }]
    }, {
        id: 6,
        name: 'Item 6'
    }];
});

describe('#utils.findByProperty', function () {
    it('should find item by property', function () {
        const itemFound = _utils2.default.findByProperty(this.items, 'name', 'Item 3');
        (0, _chai.expect)(itemFound).to.deep.equal({ id: 3, name: 'Item 3' });
    });
});

describe('#utils.findById', function () {
    it('should find item by id', function () {
        const itemFound = _utils2.default.findById(this.items, 5);
        (0, _chai.expect)(itemFound).to.deep.equal({ id: 5, name: 'Item 5' });
    });
});

describe('#utils.findNestedByProperty', function () {
    it('should find nested item by property', function () {
        const itemFound = _utils2.default.findNestedByProperty(this.itemsNested, 'name', 'Item 4');
        (0, _chai.expect)(itemFound.id).to.deep.equal(4);
    });
});

describe('#utils.findNestedById', function () {
    it('should find nested item by id', function () {
        const itemFound = _utils2.default.findNestedById(this.itemsNested, 5);
        (0, _chai.expect)(itemFound.name).to.deep.equal('Item 5');
    });
});

describe('#utils.deleteByProperty', function () {
    it('should delete an item by property', function () {
        _utils2.default.deleteByProperty(this.items, 'name', 'Item 3');
        (0, _chai.expect)(this.items.length).to.equal(3);
    });
});

describe('#utils.deleteByProperty', function () {
    it('should return false if the item is not deleted', function () {
        let deleted = _utils2.default.deleteByProperty(this.items, 'name', 'Item 2');
        (0, _chai.expect)(deleted).to.equal(false);
    });
});

describe('#utils.deleteByProperty', function () {
    it('should return true if the item is deleted', function () {
        let deleted = _utils2.default.deleteByProperty(this.items, 'name', 'Item 5');
        (0, _chai.expect)(deleted).to.equal(true);
    });
});

describe('#utils.deleteNestedByProperty', function () {
    it('should delete a nested item given a property', function () {
        _utils2.default.deleteNestedByProperty(this.itemsNested, 'name', 'Item 3');
        (0, _chai.expect)(this.itemsNested[0].children.length).to.equal(1);
    });
});

describe('#utils.deleteNestedById', function () {
    it('should delete a nested item given an id', function () {
        _utils2.default.deleteNestedById(this.itemsNested, 3);
        (0, _chai.expect)(this.itemsNested[0].children.length).to.equal(1);
    });
});

describe('#utils.createItemsByProperty', function () {
    it('should return a object', function () {
        const itemsById = _utils2.default.createItemsByProperty(this.itemsNested, 'name');
        console.log(itemsById);
        (0, _chai.expect)(itemsById['Item 5'].id).to.equal(5);
    });
});

describe('#utils.createItemsById', function () {
    it('should return a object', function () {
        const itemsById = _utils2.default.createItemsById(this.itemsNested);
        console.log(itemsById);
        (0, _chai.expect)(itemsById[2].name).to.equal('Item 2');
    });
});