import { expect } from 'chai';
import createProxyState from '../src/state-proxy';
import utils from '../src/utils'; 

beforeEach(function() {
    this.items = [
        { id: 1, name: 'Item 1' },
        { id: 3, name: 'Item 3' },
        { id: 5, name: 'Item 5' },
        { id: 12, name: 'Item 12' }
    ];
    this.itemsNested = [
        { 
            id: 1, 
            name: 'Item 1',
            children: [
                {
                    id: 2,
                    name: 'Item 2'
                },
                {
                    id: 3,
                    name: 'Item 3',
                    children: [
                        {
                            id: 4,
                            name: 'Item 4'
                        },
                        {
                            id: 5,
                            name: 'Item 5'
                        }
                    ]
                }
            ]
        },
        {
            id: 6,
            name: 'Item 6'
        }
    ];
});


describe('#utils.findByProperty', function() {
    it('should find item by property', function() {
        const itemFound = utils.findByProperty(this.items, 'name', 'Item 3');
        expect(itemFound).to.deep.equal({ id: 3, name: 'Item 3' });
    });
});

describe('#utils.findById', function() {
    it('should find item by id', function() {
        const itemFound = utils.findById(this.items, 5);
        expect(itemFound).to.deep.equal({ id: 5, name: 'Item 5' });
    });
});

describe('#utils.findNestedByProperty', function() {
    it('should find nested item by property', function() {
        const itemFound = utils.findNestedByProperty(this.itemsNested, 'name', 'Item 4');
        expect(itemFound.id).to.deep.equal(4);
    });
});

describe('#utils.findNestedById', function() {
    it('should find nested item by id', function() {
        const itemFound = utils.findNestedById(this.itemsNested, 5);
        expect(itemFound.name).to.deep.equal('Item 5');
    });
});

describe('#utils.deleteByProperty', function() {
    it('should delete an item by property', function() {
        utils.deleteByProperty(this.items, 'name', 'Item 3');
        expect(this.items.length).to.equal(3);
    });
});

describe('#utils.deleteByProperty', function() {
    it('should return false if the item is not deleted', function() {
        let deleted = utils.deleteByProperty(this.items, 'name', 'Item 2');
        expect(deleted).to.equal(false);
    });
});

describe('#utils.deleteByProperty', function() {
    it('should return true if the item is deleted', function() {
        let deleted = utils.deleteByProperty(this.items, 'name', 'Item 5');
        expect(deleted).to.equal(true);
    });
});

describe('#utils.deleteNestedByProperty', function() {
    it('should delete a nested item given a property', function() {
        utils.deleteNestedByProperty(this.itemsNested, 'name', 'Item 3');
        expect(this.itemsNested[0].children.length).to.equal(1);
    });
});

describe('#utils.deleteNestedById', function() {
    it('should delete a nested item given an id', function() {
        utils.deleteNestedById(this.itemsNested, 3);
        expect(this.itemsNested[0].children.length).to.equal(1);
    });
});

describe('#utils.createItemsByProperty', function () {
    it('should return a object', function () {
        const itemsById = utils.createItemsByProperty(this.itemsNested, 'name');
        console.log(itemsById);
        expect(itemsById['Item 5'].id).to.equal(5);
    });
});

describe('#utils.createItemsById', function () {
    it('should return a object', function () {
        const itemsById = utils.createItemsById(this.itemsNested);
        console.log(itemsById);
        expect(itemsById[2].name).to.equal('Item 2');
    });
});
