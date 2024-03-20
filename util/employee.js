const {dbAPIPromiseWrapper} = require("./api-wrapper");
const inquirer = require('inquirer');
const {getRolesArray} = require("./role");

// Return all employee rows
const viewEmployees = async function viewEmployees() {
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
    //printTable(rows);
    return rows;
}

// return employee array for inquirer choice 
const getEmployeeArray = async function getEmployeeArray() {
    let employees = await viewEmployees();
    // Add value key to the employee array and set to id since inquirer requires
    let employeeArray = new Array();
    // Add none for cases where employee does not have a manager
    employeeArray.push({ "value": null, "name": "None" });
    employees.forEach((employee) => employeeArray.push({ "value": employee.id, "name": employee.first_name + " " + employee.last_name }));
    return employeeArray;
}

// add employee 
const addEmployee = async function addEmployee() {
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

// update employee role
const updateEmployeeRole = async function updateEmployeeRole() {
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
        console.log("Employee role updated");
    })
}

module.exports = {viewEmployees, getEmployeeArray, addEmployee, updateEmployeeRole}