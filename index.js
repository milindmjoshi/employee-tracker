const mysql = require('mysql2');
const inquirer = require('inquirer');
const figlet = require('figlet');
const db = require("./db/connection");
const { printTable } = require('console-table-printer');

// Show banner for application
console.log(figlet.textSync("Employee Manager",{
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true
}))


showTrackerMenu();


function showTrackerMenu() {
    console.log("show menu");
    inquirer.prompt(
        [{
            type: 'rawlist',
            name: 'menuChoice',
            message: 'What would you like to do',
            choices: ['View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Quit'],
            default: 0
        }]
    ).then(async (answers) => {
        console.log(answers);
        switch (answers.menuChoice) {
            case "View All Departments":
                console.log("View Departments Selected");
                await viewDepartments();
                console.log("View Departments Exited");
                break;
            case "View All Roles":
                console.log("View All Roles selected");
                await viewRoles();
                break;
            case "View All Employees":
                console.log("View all Employees selected");
                await viewEmployees();
                break;
            case "Add a Department":
                console.log("Add a Department selected");
                await addDepartment();
                break;
            case "Add a Department":
                console.log("Add a Role selected");
                await addRole();
                break;
            case "Quit":
                console.log("Quit selected");
                process.exit(0);
            default:
                console.log("Invalid selection");
                break;
        }
        showTrackerMenu();
    })
}

//  function viewDepartments() {
//     const SQL = "SELECT id,name FROM DEPARTMENT";
//     db.query(SQL, (err, rows, fields) => {
//         if (err instanceof Error) {
//             console.log(err);
//             return;
//         }
//         // console.log(rows);
//         // console.log(fields);
//         printTable(rows);
//     });
//     console.log("Exit view departments");
// }

async function viewDepartments() {
    const SQL = "SELECT id,name FROM DEPARTMENT";
    let dbPromise = dbAPIPromiseWrapper(SQL);
    let rows = await dbPromise;
    printTable(rows);
}

function dbAPIPromiseWrapper(query,params) {
    return new Promise((resolve, reject) => {
        db.query(query, params,(err, rows, fields) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    })
}

async function viewRoles() {
    const SQL = "SELECT role.id, role.title, role.salary, department.name FROM role " +
        "JOIN department " +
        "ON role.department_id = department.id;";
    let dbPromise = dbAPIPromiseWrapper(SQL);
    let rows = await dbPromise;
    printTable(rows);
}



async function viewEmployees() {
    const SQL = "SELECT employee.id, employee.first_name, employee.last_name, role.title,role.salary, department.name AS 'dept name' " +
        " FROM employee " +
        " JOIN role " +
        " ON employee.role_id = role.id " +
        " JOIN department " +
        " ON role.department_id = department.id;";
    let dbPromise = dbAPIPromiseWrapper(SQL);
    let rows = await dbPromise;
    printTable(rows);
}

async function addDepartment() {
    const SQL = "INSERT INTO DEPARTMENT(name) VALUES (?)";
    await inquirer.prompt(
        [{
            type: 'text',
            name: 'department',
            message: 'What is the name of the department to add?'
        }]
    ).then( async (answers) => {
        console.log(answers.department);
        let dbPromise = dbAPIPromiseWrapper(SQL,[answers.department]);
        let results = await dbPromise;
        //console.log(results);
    })
}

function addRole() {
    const SQL = "INSERT INTO ROLE(title,salary,department_id) VALUES (?,?,?)";
    inquirer.prompt(
        [{
            type: 'text',
            name: 'tile',
            message: 'What is the title of the role to add?'
        }]
    ).then((answers) => {
        console.log(answers.department);
        db.query(SQL, [answers.department], (err, results, fields) => {
            if (err) return console.error(err.message);
        })
    })
}
