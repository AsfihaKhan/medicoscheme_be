import app from './app';
import sequelize from './config/Database';

// Db connection
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Express server  
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`The server is running on port ${port} in ${process.env.STAGE} mode`);
});
