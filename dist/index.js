import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';
await connectToDb();
const initQ = [
    {
        type: 'list',
        name: 'selection',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add department',
            'Add role',
            'Add employee',
            'quit'
        ]
    }
];
async function init() {
    const { selection } = await inquirer.prompt(initQ);
    switch (selection) {
        case 'View all departments':
            await viewDepartments();
            break;
        case 'View all roles':
            await viewRoles();
            break;
        case 'View all employees':
            await viewEmployees();
            break;
        case 'Add department':
            await addDepartment();
            break;
        case 'Add role':
            await addRole();
            break;
        case 'Add employee':
            await addEmployee();
            break;
        case 'quit':
            await quit();
            break;
        default:
            break;
    }
}
async function viewDepartments() {
    const result = await pool.query('SELECT * FROM department;');
    console.table(result.rows);
    await init();
}
async function viewRoles() {
    const result = await pool.query('SELECT * FROM role;');
    console.table(result.rows);
    await init();
}
async function viewEmployees() {
    const result = await pool.query('SELECT * FROM employee;');
    console.table(result.rows);
    await init();
}
async function addDepartment() {
    const response = await inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: ' What is the new department name?'
        }
    ]);
    await pool.query('INSERT INTO department (name) VALUES ($1)', [response.department_name]);
    console.log('Department added successfully');
    await init();
}
async function addRole() {
    const data = await pool.query('SELECT * FROM department');
    const departments = data.rows.map((d) => ({ name: d.name, value: d.id }));
    const response = await inquirer.prompt([
        {
            type: 'input',
            name: 'role_title',
            message: ' What is the new role title?'
        },
        {
            type: 'input',
            name: 'role_salary',
            message: ' What is the new role salary?'
        },
        {
            type: 'list',
            name: 'role_department',
            message: ' In which department is the new role?',
            choices: departments
        },
    ]);
    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1,$2,$3)', [response.role_title, response.role_salary, response.role_department]);
    console.log('Role added successfully');
    await init();
}
async function addEmployee() {
    const roleData = await pool.query('SELECT * FROM role');
    const roles = roleData.rows.map((d) => ({ name: d.title, value: d.id }));
    const employeeData = await pool.query('SELECT * FROM employee');
    const employees = employeeData.rows.map((d) => ({ name: d.first_name + ' ' + d.last_name, value: d.id }));
    employees.push({ name: 'no manager', value: null });
    const response = await inquirer.prompt([
        {
            type: 'input',
            name: 'employee_firstName',
            message: " What is the new employee's name?"
        },
        {
            type: 'input',
            name: 'employee_lastName',
            message: " What is the new employee's last name?"
        },
        {
            type: 'list',
            name: 'employee_role',
            message: " What is the new employee's role?",
            choices: roles
        },
        {
            type: 'list',
            name: 'employee_manager',
            message: " Who is the new employee's manager?",
            choices: employees
        },
    ]);
    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1,$2,$3, $4)', [response.employee_firstName, response.employee_lastName, response.employee_role, response.employee_manager]);
    console.log('Employee added successfully');
    await init();
}
async function quit() {
    console.log('Goodbye :)');
    process.exit();
}
init();
