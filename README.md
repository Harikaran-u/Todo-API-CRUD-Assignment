# Todo List CRUD API
## This is a Todo List CRUD API with this API we can build a Todo APP and It can handle CRUD operations and User Authentication.

**API Functionality**
1. create user
2. login user
3. create todo
4. get all todos
5. update todo
6. delete todo

**Main API Link**
---
Todo List API - https://dull-blue-agouti-cuff.cyclic.app

**API Endpoints**
---
  - Register - https://dull-blue-agouti-cuff.cyclic.app/register
  - Login - https://dull-blue-agouti-cuff.cyclic.app/login
  - Create Todo - https://dull-blue-agouti-cuff.cyclic.app/newtodo
  - Get Todos - https://dull-blue-agouti-cuff.cyclic.app/alltodos
  - Update Todo - https://dull-blue-agouti-cuff.cyclic.app/update/todo_id
  - Delete Todo - https://dull-blue-agouti-cuff.cyclic.app/delete/todo_id

**Note - Instead of "todo_id" in the URL you should provide the actual todo id**
---
**todo_id is the path parameter**

# Important Notes

1. Register API
   1. Method - POST
   2. Body - User Credentials in JSON Format
   3. User Credentials - username, password
   4. Username & Password Lengths - Min_char(6) & Max_Char(25)
   5. Don't worry you will get valuable errors for any mistakes
2. Login API
   1. Method - POST
   2. Body - User Credentials in JSON Format
   3. User Credentials - username, password
   4. You will get valuable errors in case of any mistakes
   5. You will receive a JWT Token for further CRUD Operations
3. Create Todo API
   1. Method - POST
   2. Body - Todo object in JSON Format
   3. Headers - Should provide JWT Key in Authorization
   4. Todo Object - title, description, userId
   5. Title & Description Lengths - Title(4, 24) & Description(20, 400)
   6. You will get the Result as a new todo ID
   7. You will get valuable errors in case of any mistakes
4. Get All Todos API
   1. Method - GET
   2. Body - Should contain Headers
   3. Headers - Should provide JWT Key in Authorization
   4. You will get valuable errors in case of any mistakes
5. Update Todo API
   1. Method - PUT
   2. Body - Todo object in JSON Format
   3. Headers - Should provide JWT Key in Authorization
   4. Todo Object - title, description
   5. Path Parameter - todo_id is the path parameter value
   6. You will get valuable errors in case of any mistakes
6. Delete Todo API
   1. Method - DELETE
   2. Path Parameter - todo_id is the path parameter value
   3. You will get valuable errors in case of any mistakes

# About code
---
1. Follows software best practices
2. Easy to read
3. It uses Express Js Middleware for Authentication and Authorization
4. Passwords are encrypted using bcrypt
5. It uses JsonWebToken

# Third Party Packages
---
1. Mongoose
2. bcrypt
3. JsonWebToken

## About Developer 
  Hi, I'm Harikaran passionate web developer. Having practical experience with web technologies.

**Enjoy Your Todo App**
