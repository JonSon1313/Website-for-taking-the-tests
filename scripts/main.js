'use strict';

import { Controller } from "./controller.js";

$(document).ready(() => {
    console.log('Start -> OK');
    let controller = new Controller();
    controller.updateUserGreeting();

    //1 - реєстрація
    $('#register-form').submit(function (event) {
        event.preventDefault();
        const username = $('#register-username').val();
        const password = $('#register-password').val();
        const registrationSuccess = controller.registerUser(username, password);
        if (registrationSuccess) {
            window.location.href = 'login.html';
        }
    });
    
    //2 - лоігн
    $('#login-form').submit(function (event) {
        event.preventDefault();
        const username = $('#login-username').val();
        const password = $('#login-password').val();
        if (controller.loginUser(username, password)) {
            window.location.href = 'index.html';
        }
    });
    
    //3 - вихід
    $('#logout-button').click(function () {
        controller.logoutUser();
        window.location.href = 'login.html';
    });
    
    //4 - додавання питання
    $('#add-question').click(function () {
        controller.addQuestion();
    });
    
    //
    $('#register-button').click(function () {
        window.location.href = 'register.html';
    });
    
    //5 - збереження тестів 
    $('#test-form').submit(function (event) {
        event.preventDefault();
        controller.saveTest();
    });
    //6 - завантаження тестів
    $('#load-tests').click(function () {
        controller.loadTests();
    });
     //7- розпочати тестування
    $(document).on('click', '.start-test', function () {
        const testIndex = $(this).data('test-index');
        controller.startTest(testIndex);
    });
});
