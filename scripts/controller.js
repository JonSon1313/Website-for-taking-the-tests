'use strict';

export class Controller {
    
    //1 - Створення, збереження, вивідтесту
    addQuestion() {
        const questionNumber = $('#questions-container .question').length + 1;
        const questionHTML = `
            <div class="question">
                <label>Питання ${questionNumber}:</label>
                <input type="text" class="question-title" required>
                <label>Варіанти відповідей:</label>
                <div class="answers">
                    <input type="text" class="answer" required>
                    <input type="text" class="answer" required>
                    <input type="text" class="answer" required>
                    <input type="text" class="answer" required>
                </div>
                <label>Правильна відповідь (індекс):</label>
                <input type="number" class="correct-answer" required>
            </div>
        `;
        $('#questions-container').append(questionHTML);
    }

    // Збереження тесту в localStorage
    saveTest() {
        const testsKey = 'tests';
        const title = $('#test-title').val();
        const questions = [];

        $('#questions-container .question').each(function () {
            const questionTitle = $(this).find('.question-title').val();
            const answers = [];
            $(this).find('.answer').each(function () {
                answers.push($(this).val());
            });
            const correctIndex = parseInt($(this).find('.correct-answer').val());
            questions.push({ questionTitle, answers, correctIndex });
        });

        let tests = JSON.parse(localStorage.getItem(testsKey)) || [];
        tests.push({ title, questions });
        localStorage.setItem(testsKey, JSON.stringify(tests));

        console.log('Збережені тести:', tests);

        alert('Тест збережено');
        $('#test-form')[0].reset();
        $('#questions-container').empty();
    }

    // Завантаження тестів з localStorage і відображення
    loadTests() {
        const testsKey = 'tests';
        let tests = JSON.parse(localStorage.getItem(testsKey)) || [];
        $('#saved-tests').empty(); 
    
        tests.forEach((test, index) => {
            this.displayTest(test, '#saved-tests', index);
        });
    }
    
    // Відображення конкретного тесту з кнопкою для початку тестування
    displayTest(test, container, index) {
        const testHTML = `
            <div class="test">
                <h3>${test.title}</h3>
                <ul>
                    ${test.questions.map(question => `
                        <li>
                            <h4>${question.questionTitle}</h4>
                            <ul>
                                ${question.answers.map(answer => `
                                    <li>${answer}</li>
                                `).join('')}
                            </ul>
                        </li>
                    `).join('')}
                </ul>
                <button type="button" class="start-test" data-test-index="${index}">Почати тест</button>
            </div>
        `;
    
        $(container).append(testHTML);
    }
    
    // Початок тестування з вибором правильної відповіді
    startTest(testIndex) {
        if (!this.isAuthenticated()) {
            alert('Для початку тесту потрібно увійти до системи.');
            window.location.href = 'login.html';
            return;
        }

        const testsKey = 'tests';
        let tests = JSON.parse(localStorage.getItem(testsKey)) || [];

        if (testIndex < 0 || testIndex >= tests.length) {
            console.error(`Невірний індекс тесту: ${testIndex}`);
            return;
        }

        const test = tests[testIndex];

        const testHTML = `
            <div class="active-test">
                <h3>${test.title}</h3>
                <form id="test-form-${testIndex}">
                    <input type="hidden" id="test-index" value="${testIndex}">
                    <ol>
                        ${test.questions.map((question, qIndex) => `
                            <li>
                                <h4>${question.questionTitle}</h4>
                                ${question.answers.map((answer, aIndex) => `
                                    <div class="answer">
                                        <input type="radio" id="answer-${qIndex}-${aIndex}" name="answer-${qIndex}" value="${aIndex}">
                                        <label for="answer-${qIndex}-${aIndex}">${answer}</label>
                                    </div>
                                `).join('')}
                            </li>
                        `).join('')}
                    </ol>
                    <button type="button" class="submit-test">Закінчити тест</button>
                </form>
                <div id="test-result-${testIndex}"></div>
            </div>
        `;

        $('#test-container').html(testHTML);

        $('.submit-test').click(() => {
            this.submitTest(testIndex);
        });
    }

    // Перевірка результатів тестування
    submitTest(testIndex) {
        const testKey = `test-results-${testIndex}`;
        const selectedAnswers = [];

        $(`#test-form-${testIndex} li`).each(function (qIndex) {
            const selectedAnswerIndex = $(this).find('input:checked').val();
            selectedAnswers.push({ question: qIndex + 1, answerIndex: selectedAnswerIndex });
        });

        const test = JSON.parse(localStorage.getItem('tests'))[testIndex];
        const results = [];

        selectedAnswers.forEach((selected, index) => {
            const correctIndex = test.questions[index].correctIndex;

            if (selected.answerIndex == correctIndex) { 
                results.push({ question: index + 1, result: 'Вірно' });
            } else {
                results.push({ question: index + 1, result: 'Невірно' });
            }
        });

        const resultHTML = `
            <h3>Результати тесту:</h3>
            <ul>
                ${results.map(result => `
                    <li>Питання ${result.question}: ${result.result}</li>
                `).join('')}
            </ul>
        `;

        $(`#test-result-${testIndex}`).html(resultHTML);

        localStorage.setItem(testKey, JSON.stringify(selectedAnswers));

        alert(`Тест завершено! Результати нижче.`);
    }

    //2 - Реєстрація
     registerUser(username, password) {
        const usersKey = 'users';
        let users = JSON.parse(localStorage.getItem(usersKey)) || [];

        if (password.length < 8) {
            alert('Пароль повинен містити щонайменше 8 символів');
            return false;
        }
        if (!password.match(/[a-zA-Z]/) || !password.match(/[0-9]/)) {
            alert('Пароль повинен містити як мінімум одну букву та одну цифру');
            return false;
        }

        if (users.find(user => user.username === username)) {
            alert('Користувач з таким іменем вже існує');
            return false;
        }
        users.push({ username, password });
        localStorage.setItem(usersKey, JSON.stringify(users));
        alert('Реєстрація успішна');
        return true;
    }
    //3 - Авторизація
    loginUser(username, password) {
        const usersKey = 'users';
        let users = JSON.parse(localStorage.getItem(usersKey)) || [];

        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert('Авторизація успішна');
            return true;
        } else {
            alert('Невірне ім\'я користувача або пароль');
            return false;
        }
    }
    //-> Певірка і вивід користувача на головний екран
    updateUserGreeting() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            $('#user-greeting').text(`Привіт! - ${currentUser.username}`);
        } else {
            $('#user-greeting').text('');
        }
    }
    //4 - Вихід користувача 
    logoutUser() {
        localStorage.removeItem('currentUser');
        alert('Ви вийшли з системи');
    }
    //> Перевірка, чи є такий користвач 
     isAuthenticated() {
        return localStorage.getItem('currentUser') !== null;
    }

}
