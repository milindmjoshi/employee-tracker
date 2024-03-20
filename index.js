const mysql = require('mysql2');
const inquirer = require('inquirer');
const figlet = require('figlet');
const db = require("./db/connection");
const { printTable } = require('console-table-printer');

// Show banner for application
console.log(figlet.textSync("Employee Manager", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true
}))


showTrackerMenu();


function showTrackerMenu() {
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
                await viewDepartments();
                //console.log("View Departments Exited");
                break;
            case "View All Roles":
                //console.log("View All Roles selected");
                await viewRoles();
                break;
            case "View All Employees":
                //console.log("View all Employees selected");
                await viewEmployees();
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
        showTrackerMenu();
    })
}

async function viewDepartments() {
    const SQL = "SELECT id,name FROM DEPARTMENT";
    let dbPromise = dbAPIPromiseWrapper(SQL);
    let rows = await dbPromise;
    printTable(rows);
    //console.log(rows);
    return rows;
}

function dbAPIPromiseWrapper(query, params) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, rows, fields) => {
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
    return rows;
}



async function viewEmployees() {
    const SQL = "SELECT emp.id, emp.first_name, emp.last_name, role.title,role.salary, " + 
                " department.name AS 'dept name' , CONCAT(man.first_name,' ',man.last_name) AS 'manager' " +
        " FROM employee emp" +
        " JOIN role " +
        " ON emp.role_id = role.id " +
        " JOIN department " +
        " ON role.department_id = department.id " +
        " LEFT JOIN employee man" +
        " ON emp.manager_id = man.id"
    let dbPromise = dbAPIPromiseWrapper(SQL);
    let rows = await dbPromise;
    printTable(rows);
    return rows;
}

async function addDepartment() {
    const SQL = "INSERT INTO DEPARTMENT(name) VALUES (?)";
    await inquirer.prompt(
        [{
            type: 'text',
            name: 'department',
            message: 'What is the name of the department to add?'
        }]
    ).then(async (answers) => {
        //console.log(answers.department);
        let dbPromise = dbAPIPromiseWrapper(SQL, [answers.department]);
        let results = await dbPromise;
        //console.log(results);
        console.log("Department " + answers.department + " added");
    })
}

async function getDepartmentsArray() {
    let departments = await viewDepartments();
    // Add value key to the dept array and set to id since inquirer requires
    let choiceArray = new Array();
    departments.forEach((dept) => choiceArray.push({ "value": dept.id, "name": dept.name }));
    return choiceArray;
}

async function getRolesArray() {
    let roles = await viewRoles();
    // Add value key to the role array and set to id since inquirer requires
    let rolesArray = new Array();
    roles.forEach((role) => rolesArray.push({ "value": role.id, "name": role.title }));
    return rolesArray;
}

async function getEmployeeArray() {
    let employees = await viewEmployees();
    // Add value key to the employee array and set to id since inquirer requires
    let employeeArray = new Array();
    // Add none for cases where employee does not have a manager
    employeeArray.push({ "value": null, "name": "None" });
    employees.forEach((employee) => employeeArray.push({ "value": employee.id, "name": employee.first_name + " " + employee.last_name }));
    return employeeArray;
}

async function addRole() {
    let deptArray = await getDepartmentsArray();
    //console.log("Dept Array:" + JSON.stringify(deptArray));


    const SQL = "INSERT INTO ROLE(title,salary,department_id) VALUES (?,?,?)";
    await inquirer.prompt(
        [{
            type: 'text',
            name: 'title',
            message: 'What is the title of the role to add?'
        },
        {
            type: 'number',
            name: 'salary',
            message: 'What is the salary of the role to add?'
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Which department does the role belong to?',
            choices: deptArray
        },
        ]
    ).then(async (answers) => {
        //console.log(answers);
        let dbPromise = dbAPIPromiseWrapper(SQL, [answers.title, answers.salary, answers.department_id]);
        let results = await dbPromise;
        console.log("Role " + answers.title + " added");
    })
}

async function addEmployee() {
    let roleArray = await getRolesArray();
    //console.log("Dept Array:" + JSON.stringify(roleArray));

    let employeeArray = await getEmployeeArray();
    //console.log("Emp Array:" + JSON.stringify(employeeArray));


    const SQL = "INSERT INTO EMPLOYEE(first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)";
    await inquirer.prompt(
        [{
            type: 'text',
            name: 'firstName',
            message: 'What is the first name of the Employee to add?'
        },
        {
            type: 'text',
            name: 'lastName',
            message: 'What is the last name of the Employee to add?'
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'What is the role of the Employee to add?',
            choices: roleArray
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'What is the employee manager?',
            choices: employeeArray
        },
        ]
    ).then(async (answers) => {
        //console.log(answers);
        let dbPromise = dbAPIPromiseWrapper(SQL, [answers.firstName, answers.lastName, answers.role_id, answers.manager_id]);
        let results = await dbPromise;
        console.log("Employee " + answers.firstName + " " + answers.lastName + " added");
    })
}

async function updateEmployeeRole() {
    let roleArray = await getRolesArray();
    //console.log("role Array:" + JSON.stringify(roleArray));

    let employeeArray = await getEmployeeArray();
    //console.log("Emp Array:" + JSON.stringify(employeeArray));


    const SQL = "UPDATE employee SET role_id = ? " + 
                " WHERE id = ?";
    await inquirer.prompt(
        [{
            type: 'list',
            name: 'employee_id',
            message: 'Which employee role do you want to update?',
            choices: employeeArray
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Which role do you want to assign to the selected employee?',
            choices: roleArray
        }
        ]
    ).then(async (answers) => {
        //console.log(answers);
        let dbPromise = dbAPIPromiseWrapper(SQL, [answers.role_id, answers.employee_id]);
        let results = await dbPromise;
        console.log("Employee " + answers.firstName + " " + answers.lastName + " role updated");
    })
}
