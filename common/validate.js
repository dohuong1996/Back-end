module.exports = {
    validateEmail: function (email) {
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let result =  email ? emailRegex.test(email.toString()) : true; 
        return result ? null : {validateEmail : true}
    },

    validateUserName: function(name) {
        let nameRegex = /^[a-zA-Z0-9'.\s]{1,20}$/;
        let result =  name ? nameRegex.test(name.toString()) : true; 
        return result ? null : {validateUserName : true}
    },

    validatePhone: function(number) {
        const valueNumber = number.replace(/[^\d]/g, '');
        let phoneNumberRegex = /^[0-9]{10}$/;
        let result =  valueNumber ? phoneNumberRegex.test(valueNumber.toString()) : true; 
        return result ? null : {validatePhone : true}
    }
}