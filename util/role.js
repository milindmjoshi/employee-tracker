const {dbAPIPromiseWrapper} = require("./api-wrapper");
const inquirer = require('inquirer');
const {getDepartmentsArray} = require("./department");

// Return roles in database
const viewRoles = async function viewRoles() {
    const SQL = "SELECT role.id, role.title, role.salary, department.name AS 'department' FROM role " +
        "JOIN department " +
        "ON role.department_id = department.id;";
    let dbPromise = dbAPIPromiseWrapper(SQL);
    let rows = await dbPromise;
    //printTable(rows);
    return rows;
}

// return roles array for inquirer choice
const getRolesArray = async function getRolesArray() {
    let roles = await viewRoles();
    // Add value key to the role array and set to id since inquirer requires
    let rolesArray = new Array();
    roles.forEach((role) => rolesArray.push({ "value": role.id, "name": role.title }));
    return rolesArray;
}

const addRole = async function addRole() {
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


module.exports = { viewRoles, getRolesArray, addRole}
