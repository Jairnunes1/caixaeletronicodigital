const panels = document.querySelectorAll('.panel');
const buttons = document.querySelectorAll('nav button');

buttons.forEach(button => {
    button.addEventListener('click', panelActive);
}); 

function panelActive(event) {
    panels.forEach(panel => panel.classList.remove('active'));

    const button = event.currentTarget;
    const targetId = button.dataset.target;
    const section = document.getElementById(targetId);

    section.classList.add('active');
}
