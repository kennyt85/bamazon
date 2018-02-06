const inquire = require('inquirer');
const sqlQueries = require('./sqlQueries.js')
const createTable = require('./createTable.js');

class Manager {
    constructor() {}


    addInventoryPrompt() {
        inquire.prompt([{
                type: 'inputs',
                name: 'productId',
                message: 'Enter item Id:'
            },
            {
                type: 'inputs',
                name: 'numOfStock',
                message: 'How many quantity you want to add:'
            }
        ]).then((data) => {
            let query = `UPDATE products SET stock_quantity = stock_quantity + ${data.numOfStock} WHERE item_id = ${data.productId}`;
            sqlQueries.allQuery(query);
            console.log('item has been added to inventory.');
            return this.menuPrompt();
        }).catch((err) => {
            if (err) {
                console.log('something busted', err);
            }
        });
    }

    addNewProductPrompt() {
        inquire.prompt([{
                type: 'inputs',
                name: 'productName',
                message: 'Enter item name:'
            },
            {
                type: 'inputs',
                name: 'departmentName',
                message: 'what department is the item belong to:'
            },
            {
                type: 'inputs',
                name: 'productPrice',
                message: 'Enter item price:'
            },

            {
                type: 'inputs',
                name: 'numOfStock',
                message: 'Enter item quantity:'
            }
        ]).then((data) => {
            let query = `INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE(${data.productName},${data.departmentName},${data.productPrice},${data.numOfStock})`;
            sqlQueries.allQuery(query);
            console.log('New product has been added.');
            return this.menuPrompt();
        }).catch((err) => {
            if (err) {
                console.log('something busted', err);
            }
        });
    }



    menuPrompt() {
        inquire.prompt([{
            type: 'list',
            name: 'view',
            message: 'What would you like to do:',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        }]).then(((data) => {
            switch (data.view) {
                case 'View Products for Sale':
                    let selectQuery = 'SELECT * FROM products';
                    let header = ['Product Id', 'Product Name', 'Department_name', 'Price', 'In Stock'];
                    let table = createTable.createTable(header);
                    sqlQueries.queryTable(table, this.menuPrompt, selectQuery);
                    break;
                case 'View Low Inventory':
                    let query2 = 'SELECT * FROM products WHERE stock_quantity <= 5';
                    let header = ['Product Id', 'Product Name', 'Department_name', 'Price', 'In Stock'];
                    let table = createTable.createTable(header);
                    sqlQueries.queryTable(table, this.menuPrompt, query2);
                    break;
                case 'Add to Inventory':
                    this.addInventoryPrompt();
                    break;
                case 'Add New Product':
                    this.addNewProductPrompt();
                    break;
                default:
                    console.log('not valid');
            }
        }).bind(this)).catch((err) => {
            if (err) {
                console.log('something busted', err);
            }
        });
    };
}

module.exports = Manager;