
class UserRepository{
    constructor(UserRepository){
        this.UserRepository = UserRepository;
    }

    Register = (user) => {
        return this.UserRepository.Register(user);
    }
    updateDocs = (userId, documents) =>{
        return this.UserRepository.updateDocuments(userId, documents)
    }

    findByUsername = (username) => {
        return this.UserRepository.findByUsername({email: username});
    }
    
    updateLastConnection = (userId) => {
        return this.UserRepository.updateLastConnection(userId);
    }
    
}

  export default UserRepository;
  