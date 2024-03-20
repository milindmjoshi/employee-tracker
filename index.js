const inquirer = require('inquirer');
const figlet = require('figlet');
const { printTable } = require('console-table-printer');
const {addDepartment, viewDepartments} = require("./util/department");
const {viewRoles, addRole} = require("./util/role");
const {addEmployee, updateEmployeeRole, viewEmployees} = require("./util/employee");

// Show banner for application
console.log(figlet.textSync("Employee Manager", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true
}))

// Show main menu for application
showMenu();

// Show main menu. There is a recursive call so the user stays in the menu until Quit is selected
function showMenu() {
    //console.log("show menu");
    inquirer.prompt(
        [{
            type: 'list',
            name: 'menuChoice',
            message: 'What would you like to do',
            choices: ['View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update Employee Role',
                'Quit'],
            default: 0
        }]
    ).then(async (answers) => {
        //console.log(answers);
        switch (answers.menuChoice) {
            case "View All Departments":
                //console.log("View Departments Selected");
                const deptartments = await viewDepartments();
                printTable(deptartments);
                //console.log("View Departments Exited");
                break;
            case "View All Roles":
                //console.log("View All Roles selected");
                const roles = await viewRoles();
                printTable(roles);
                break;
            case "View All Employees":
                //console.log("View all Employees selected");
                const employees = await viewEmployees();
                printTable(employees);
                break;
            case "Add a Department":
                //console.log("Add a Department selected");
                await addDepartment();
                break;
            case "Add a Role":
                //console.log("Add a Role selected");
                await addRole();
                break;
            case "Add an Employee":
                //console.log("Add an Employee selected");
                await addEmployee();
                break;
            case "Update Employee Role":
                //console.log("Update an Employee role selected");
                await updateEmployeeRole();
                break;
            case "Quit":
                console.log("Application exited");
                process.exit(0);
            default:
                console.log("Invalid selection");
                break;
        }
        //recursive call
        showMenu();
    })
}