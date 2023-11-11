class userDTO {
    constructor(user) {
        this.name = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.role = user.role;
        this.cartId = user.cartId;
    }
}

export { userDTO }