# `iShare`
![](https://img.shields.io/badge/Node.js-v12.17.0-green)
![](https://img.shields.io/badge/express-v4.17.1-red)
![](https://img.shields.io/badge/ejs-v3.1.5-blue)
![](https://img.shields.io/badge/Mongoose-v5.10.7-brightgreen)




[**Click Here To Visit**](https://dhaval-ishare.herokuapp.com) - [**https://dhaval-ishare.herokuapp.com**](https://dhaval-ishare.herokuapp.com)

iShare Is An Internet-Based Free File Transfer Service. Which Allows Users To Send Their Files Via Email or Download Link.

## How To Run

* First Clone Project
  
* Go to Server and Run **npm install**

### `npm install`
It will install all the project's dependancies.

* Go to Server folder and Run **npm run dev**

### `npm run dev`

It will run Server at **5000 Port** 

* Server will run : <span style='color:blue'>http://localhost:5000</span>



***
**Note**
* Before Perform Above Task,  User Have To Perform Following Step:

* 1. Goto **config** folder open keys.js file.
* 2. change 

    **process.env.NODE_MODE = 'production'** to **process.env.NODE_MODE = 'dev'**
* 3. create **dev.js** file in **config** folder.

* 4. export json object with below key.

module.exports =
    
    {
        PORT: 'set Port no',
        DB_URL: "Atlas MonogoDB URL OR Local",
        BASE_URL: 'http://localhost:5000',
        SMTP_SERVICE: 'smtp service provider',
        SMTP_USER: 'user name',
        SMTP_PASSWORD: 'password',
        ADMIN_PASSWORD: 'set password for delete all files'
    }
