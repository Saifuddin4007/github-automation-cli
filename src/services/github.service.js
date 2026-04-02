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




    async createRepository(options){
        const {name, private: isPrivate} = options;

        try{
            const response= await this.client.post("/user/repos", {
                name: name,
                private: isPrivate
            });

            return {
                name: response.data.name,
                fullName: response.data.full_name,
                cloneUrl: response.data.clone_url,
                owner: response.data.owner.login,
                created: true
            };



        }catch(err){
            console.log("Github API Error:");
            //print full error
            if(err.response){
                console.log("Status:", err.response.status);
                console.log("Data:", err.response.data);
            }else{
                console.log(err.message);
            }

            //Handle specific cases
            if(err.response && err.response.status===401){
                throw new Error("Invalid github token");
            }

            if(err.response && err.response.status===422){
                throw new Error("Repo already exists on Github or Invalid data");
            }
            throw new Error("Failed to create Github repository");
        }

    }

    async deleteRepository(owner, repo){
        try{
            await this.client.delete(`/repos/${owner}/${repo}`);
            
        }
        catch(err){
            throw new Error ('Failed to rollback repository');
        }
    }
}

module.exports= GitHubService;