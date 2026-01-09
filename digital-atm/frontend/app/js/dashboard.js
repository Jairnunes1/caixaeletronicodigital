const buttons = document.querySelectorAll('.dashboard-actions button');
const panels = document.querySelectorAll('.panel');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        panels.forEach(panel => panel.classList.remove('active'));
        document
            .getElementById(button.dataset.target)
            .classList.add('active');
    });
});