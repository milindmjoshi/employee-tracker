
-- seed department table
INSERT INTO department(name)
VALUES
    ("Engineering"),
     ("Marketing"),
     ("Sales");

-- seed role table
INSERT INTO role (title,salary,department_id)
VALUES
   ("Associate Software Engineer",80000,1),
   ("Software Engineer",100000,1),
   ("Senior Software Engineer",120000,1),
   ("Software Development Manager",140000,1),
   ("Marketing Intern",50000,2),
   ("Marketing Manager",80000,2),
   ("VP of Marketing",130000,2),
   ("Sales Intern",55000,3),
   ("Sales Lead",80000,3),
   ("Sales Manager",100000,3);

-- seed employee table
INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES
    ("Milind","Joshi",4,NULL),
    ("Matt","Muller",7,NULL),
    ("Bettsy","Jones",10,NULL),
    ("Jane","Jacobs",8,NULL),
    ("Katty","Perry",9,NULL),
    ("Mitsy","Locry",10,NULL);
   