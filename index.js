const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const util = require("util");

const connection =mysql.createConnection({
    host: "local host",
    user: "root",
    password: "hongjing123",
    database: "employees_DB"
});

//setting up connection.query to use promises instead of callbacks
//this allows to use async/await syntax
const connectionQuery = util.promisify(connection.query.bind(connection));

//main menu fn
function mainMenu(){
    //prompt user to choose an option
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "MAIN MENU",
            choices: [
                "View all employees",
                "View all employees by Role",
                "View all employees by Department",
                "View all employees by Manager",
                "Add employee",
                "Add role",
                "Add department",
                "Update employee role",
                "Update employee manager",
                "Delete employee",
                "Delete role",
                "Delete department",
                "View department budgets"
            ]
        })
        .then((answer)=>{
            switch (answer.action){
                case "View all employees":
                    viewAllEmp();
                    break;

                case "View all employees by Role":
                    viewAllEmpByRole();
                    break;

                case "View all employees by Department":
                    viewAllEmpByDept();
                    break;

                case "Add employee":
                    addEmp();
                    break;
                
                case "Add department":
                    addDept();
                    break;

                case "Add role":
                    addRole();
                    break;

                case "Update employee role":
                    updateEmpRole();
                    break;
            }
        });
};

//view all employees
function viewAllEmp(){
    let query = "SELECT * FROM employee";
    connectionQuery(query)
    .then(res => {
        console.log("\n");
        //display query results using console.table
        console.table(res);
        //back to main menu
        mainMenu();
    })
};

//view all employee by Department
function viewAllEmpByDept(){

};
// view all employees by role
function viewAllEmpByRole(){

};
// add employee
function addEmp(){};
// add role
function addRole(){};
// add department
function addDept(){};
// update employee role
function updateEmpRole(){};

connection.connect{(err)=>{
    if(err) throw err;
    // start main menu funciton
    console.log("\n Welcome to employee tracker \n");
    mainMenu();
}};