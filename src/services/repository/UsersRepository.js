
class UserRepository {
    constructor(UserRepository) {
        this.UserRepository = UserRepository;
    }

    getAll = () => {
        return this.UserRepository.getAll();
    };

    Register = (user) => {
        return this.UserRepository.Register(user);
    };

    updateDocs = (userId, documents) => {
        return this.UserRepository.updateDocuments(userId, documents);
    };

    findByUsername = (username) => {
        return this.UserRepository.findByUsername({ email: username });
    };

    updateLastConnection = (userId) => {
        return this.UserRepository.updateLastConnection(userId);
    };

    deleteUserByEmail = (email) => {
        return this.UserRepository.deleteUserByEmail(email);
    };

    deleteInactiveUsers = () => {
        return this.UserRepository.deleteInactiveUsers();
    };
}

export default UserRepository;
;
  