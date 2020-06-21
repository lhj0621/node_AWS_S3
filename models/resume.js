const fs = require('fs');
const Sequelize = require('sequelize');
const config = require(__dirname+'/../config/config.json')['development'];

const AWS = require('aws-sdk');
AWS.config.loadFromPath('../aws_config.json');

const sequelize = new Sequelize({
    username: config.username,
    password: config.password,
    database: config.database,
    host: config.host,
    dialect: 'mysql' 
});

class resumes extends Sequelize.Model { }

resumes.init({
    title: Sequelize.STRING(40),
    img_url: Sequelize.STRING(100)
}, { tableName: 'resume', timestamps: false, sequelize });

class resume {
    constructor() {
        try {
            this.prepareModel();
        } catch (error) {
            console.error(error);
        }
    }

    async prepareModel() {
        try {
            await resumes.sync({ force: false });
        }
        catch (error) {
            console.log('country.sync Error ', error);
        }
    }
}

module.exports = new resume();