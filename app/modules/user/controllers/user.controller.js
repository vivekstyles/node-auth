const userRepo = require('../repositories/user.repositories');

class UserContoller{
    
    constructor(){
        this.user = 'vivek'
    }

    async addNewUser(req){ 
        if (req.query.user && req.query.email && req.query.password) {
            var param = {
                user_name : req.query.user,
                email_id : req.query.email,
                password : req.query.password,
            }
            const res = await userRepo.addNewUser(param)  
            console.log(res)
            return res; 
        }
    }

    updateUser(req){ 
        
        if (req.query.email && req.query.new_email) {
            var param = {
                email_id : req.query.email,
                new_email_id : req.query.new_email,
            }
            const res = userRepo.updateUser(param)
            return res; 
        }
    }

    deleteUser(req){
        if (req.query.email_id) {
            var param = { 
                email_id : req.query.email_id
            }
            const res = userRepo.deleteUser(param)
            return res;
        }

    }

    async getUserData(req){
        if (req.query.email_id) {
            var param = {
                email_id : req.query.email_id
            }
            const res = userRepo.findUser(param)
            var data = await res.then(function(result) {
                return result
             })
            console.log(data)
            return data;
        }
    }

    async getAllUser(req){
            const res = userRepo.allUser()
            var data = await res.then(function(result) {
                return result
             })
            return data;
    }

    async signIn(req){
        if (req.query.email && req.query.password) {
            var param = {
                email_id : req.query.email,
                password : req.query.password,
            }

            const res = userRepo.signIn(param)
            var data = await res.then(function(result) {
                return result
             })

            return data
        }

    }

}

module.exports = new UserContoller()