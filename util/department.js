const {dbAPIPromiseWrapper} = require("./api-wrapper");
const inquirer = require('inquirer');


// Return all departments
const viewDepartments = async function viewDepartments() {
    const SQL = "SELECT id,name FROM DEPARTMENT";
    let dbPromise = dbAPIPromiseWrapper(SQL);
    let rows = await dbPromise;
    //printTable(rows);
    //console.log(rows);
    return rows;
}

// Add a department
const addDepartment = async function addDepartment() {
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

// Return department array for inquirer choice
const getDepartmentsArray = async function getDepartmentsArray() {
    let departments = await viewDepartments();
    // Add value key to the dept array and set to id since inquirer requires
    let choiceArray = new Array();
    departments.forEach((dept) => choiceArray.push({ "value": dept.id, "name": dept.name }));
    return choiceArray;
}

module.exports = {viewDepartments, addDepartment, getDepartmentsArray};