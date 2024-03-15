const mysql = require('mysql2');
const inquirer = require('inquirer');


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
})