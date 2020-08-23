// Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const util = require("util");

const connection = mysql.createConnection({
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
    let deptArr = [];
    connectionQuery('SELECT name FROM department')
    .then(value=>{
        deptQuery = value;
        for (i=0; i<value.length;i++){
            deptArr.push(value[i].name);
        }
    }).then(()=>{
        inquirer.prompt({
            name:"department",
            type: "list",
            message: "Which department would you like to search?",
            choices: deptArr
        })
        .then((answer) => {
            const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;";
            connectionQuery(query).then(res => {
                console.log("\n");
                console.table(res);

                mainMenu();
            })
        })
    })
};
// view all employees by role
function viewAllEmpByRole(){

};
// add employee
function addEmp(){
    inquirer
    .prompt([
      {
        type: "input",
        message: "Enter employee first name",
        name: "firstname"
      },
      {
        type: "input",
        message: "Enter employee last name",
        name: "lastname"
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.firstname,
          last_name: answer.lastname,
          role_id: null,
          manager_id: null
        },
        function(err, answer) {
          if (err) {
            throw err;
          }
          console.table(answer);
        }
      );
    mainMenu();
    });
};
// add role
function addRole(){
    inquirer
    .prompt([
      {
        type: "input",
        message: "enter employee title",
        name: "addtitle"
      },
      {
        type: "input",
        message: "enter employee department id",
        name: "addDepId"
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.addtitle,
          department_id: answer.addDepId
        },
        function(err, answer) {
          if (err) {
            throw err;
          }
          console.table(answer);
        }
      );
      mainMenu();
    });
};
// add department
function addDept(){
    inquirer
    .prompt({
      type: "input",
      message: "enter department name",
      name: "dept"
    })
    .then(function(answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.dept
        },
        function(err, answer) {
          if (err) {
            throw err;
          }
        }
      ),
        console.table(answer);
      mainMenu();
    });
};
// update employee role
function updateEmpRole(){
    let allemp = [];
    connection.query("SELECT * FROM employee", function(err, answer) {
      // console.log(answer);
      for (let i = 0; i < answer.length; i++) {
        let employeeString =
          answer[i].id + " " + answer[i].first_name + " " + answer[i].last_name;
        allemp.push(employeeString);
      }
      // console.log(allemp)
  
      inquirer
        .prompt([
          {
            type: "list",
            name: "updateEmpRole",
            message: "select employee to update role",
            choices: allemp
          },
          {
            type: "list",
            message: "select new role",
            choices: ["manager", "employee"],
            name: "newrole"
          }
        ])
        .then(function(answer) {
          console.log("about to update", answer);
          const idToUpdate = {};
          idToUpdate.employeeId = parseInt(answer.updateEmpRole.split(" ")[0]);
          if (answer.newrole === "manager") {
            idToUpdate.role_id = 1;
          } else if (answer.newrole === "employee") {
            idToUpdate.role_id = 2;
          }
          connection.query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [idToUpdate.role_id, idToUpdate.employeeId],
            function(err, data) {
              mainMenu();
            }
          );
        });
    });
};

connection.connect((err)=>{
    if(err) throw err;
    // start main menu funciton
    console.log("\n Welcome to employee tracker \n");
    mainMenu();
});