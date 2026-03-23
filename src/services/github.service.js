const axios = require('axios');

class GitHubService {
    constructor(token){
        this.token= token;
        this.client= axios.create({
            baseURL: "https://api.github.com",
            headers:{
                Authorization: `token ${token}`
            }
        });

    }

    async getAuthenticatedUser(){
        try{
            const response= await this.client.get("/user");
            return {
                login: response.data.login
            };
        }catch(err){
            if(err.response && err.response.status===401){
                throw new Error("Invalid github token");
            }
            throw new Error("Github API error");

        }
    }
}

module.exports= GitHubService;