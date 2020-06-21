const fs = require('fs');
const Sequelize = require('sequelize');
const config = require(__dirname + '/../config/config.json')['production'];

const AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + '/../config/aws_config.json');


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
    img_name: Sequelize.STRING(40),
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

    async resumeList() {
        let returnval;
        await resumes.findAll({})
            .then(results => {
                returnval = results;
            })
            .catch(error => {
                console.error('Error :', error);
            });
        return returnval;
    }

    async addresume(data) {
        try {
            const ret = await resumes.create({
                title: data.title,
                img_name: data.img_name,
                img_url: data.img_url
            }, { logging: false });
            const newData = ret.dataValues;
            console.log(newData);
            console.log('Create success');
        }
        catch (error) {
            console.log('Error : ', error);
        }
    }
}

module.exports = new resume();