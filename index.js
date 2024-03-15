const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = require("./db/connection");
const { printTable } = require('console-table-printer');


inquirer.prompt(
    [{
        type: 'rawlist',
        name: 'menuChoice',
        message: 'What would you like to do',
        choices: ['View All Departments', 
                  'View All Roles',
                  'View All Employees'],
        default: 0    
    }]
).then((answers)=>{
    console.log(answers);
    switch(answers.menuChoice){
        case "View All Departments":
            console.log("View Departments Selected");
            viewDepartments();
            break;
        case "View All Roles":
            console.log("View All Roles selected");
            viewRoles();
            break;
        case "View All Employees":
            console.log("View all Employees selected");
            viewEmployees();
            break;
        default:
            console.log("Invalid selection");
    }
})

function viewDepartments(){
    const SQL = "SELECT id,name FROM DEPARTMENT";
    db.query(SQL, (err, rows, fields) => {
        if (err instanceof Error) {
          console.log(err);
          return;
        }
        // console.log(rows);
        // console.log(fields);
        printTable(rows);
      });
}

function viewRoles(){
    const SQL = "SELECT role.id, role.title, role.salary, department.name FROM role " + 
    "JOIN department " + 
    "ON role.department_id = department.id;";
    db.query(SQL, (err, rows, fields) => {
        if (err instanceof Error) {
          console.log(err);
          return;
        }
        // console.log(rows);
        // console.log(fields);
        printTable(rows);
      });
}

function viewEmployees(){
    const SQL = "SELECT employee.id, employee.first_name, employee.last_name, role.title,role.salary, department.name AS 'dept name' " +  
    " FROM employee " + 
    " JOIN role " + 
    " ON employee.role_id = role.id " + 
    " JOIN department " + 
    " ON role.department_id = department.id;";
    db.query(SQL, (err, rows, fields) => {
        if (err instanceof Error) {
          console.log(err);
          return;
        }
        // console.log(rows);
        // console.log(fields);
        printTable(rows);
      });
}
