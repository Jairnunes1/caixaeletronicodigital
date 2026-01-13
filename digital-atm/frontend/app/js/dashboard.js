const panels = document.querySelectorAll('.panel');
const buttons = document.querySelectorAll('nav button');

buttons.forEach(button => {
    button.addEventListener('click', panelActive);
}); 

function panelActive(event) {
    panels.forEach(panel => panel.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('nav-active'));

    const button = event.currentTarget;
    const targetId = button.dataset.target;
    const section = document.getElementById(targetId);
    
    button.classList.add('nav-active');
    section.classList.add('active');
}
