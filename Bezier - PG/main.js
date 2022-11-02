const options = document.querySelector('.options');

let FLAG_CREATE_ENABLED = false;
let FLAG_SHOW_POINTS_ENABLED = true;
let FLAG_SHOW_LINES_ENABLED = true;
let FLAG_SHOW_CURVES_ENABLED = true;
let FLAG_ADD_ENABLED_POINTS = false;
let FLAG_ACTIVE_FIRST_BUTTON = true;
let FLAG_FIRST_ACTION = false;
let FLAG_FIRST_CURVE = false;

function start() {
    setup_interface();
}

function cursorType(style) {
    const cnv = document.getElementById('canvas');
    cnv.style.cursor = style;
}


function setup_interface() {
    let btn_title;
    let func;
    let checked;

    options.innerHTML = '';

    if (!FLAG_CREATE_ENABLED) {
        btn_title = 'Criar Nova';
        func = 'new_create()';
    } else {
        btn_title = 'Feito';
        func = 'done()';
    }
    add_btn(btn_title, func);

    btn_title = 'Limpar';
    func = 'reset_sketch()';
    add_btn(btn_title, func);

    func = 'trigger_show_points()';
    if (!FLAG_SHOW_POINTS_ENABLED) {
        btn_title = 'Exibir Pontos';
        checked = false;
    } else {
        btn_title = 'Ocultar Pontos';
        checked = true;
    }
    add_btn(btn_title, func, checked);

    func = 'trigger_show_lines()';
    if (!FLAG_SHOW_LINES_ENABLED) {
        btn_title = 'Exibir Linhas';
        checked = false;
    } else {
        btn_title = 'Ocultar Linhas';
        checked = true;
    }
    add_btn(btn_title, func, checked);

    func = 'trigger_show_curves()';
    if (!FLAG_SHOW_CURVES_ENABLED) {
        btn_title = 'Exibir Curvas';
        checked = false;
    } else {
        btn_title = 'Ocultar Curvas';
        checked = true;
    }
    add_btn(btn_title, func, checked);

    input();

    if (!FLAG_CREATE_ENABLED && points.length > 2 && !FLAG_ADD_ENABLED_POINTS) {
        btn_title = 'Selecionar Próxima';
        func = 'next_curve()';
        add_btn(btn_title, func);
    }

    if (!FLAG_CREATE_ENABLED && FLAG_FIRST_ACTION && points.length > 1) {
        if (!FLAG_ADD_ENABLED_POINTS) {
            btn_title = 'Adicionar Pontos';
            func = 'add_points()';
        } else {
            btn_title = 'Feito';
            func = 'done_add_points()';
        }
        add_btn(btn_title, func);
    }

    if (!FLAG_CREATE_ENABLED && selected != null && points[cursor].length > 3) {
        btn_title = 'Deletar Ponto';
        func = 'delete_p()';
        add_btn(btn_title, func);
    }

    if (!FLAG_CREATE_ENABLED && FLAG_FIRST_ACTION && points.length > 1 && !FLAG_ADD_ENABLED_POINTS) {
        btn_title = 'Deletar Curva';
        func = 'delete_c()';
        add_btn(btn_title, func);
    }
}



function add_btn(btn_title, func, checked = false) {
    const btn_cont = document.createElement('div');
    btn_cont.setAttribute('class', 'button-container');

    if (btn_title === 'Criar nova' || btn_title === 'Done')
        btn_cont.setAttribute('id', 'first-button');

    if (btn_title === 'Feito')
        btn_cont.setAttribute('id', 'done-adding-points');


    FLAG_ACTIVE_FIRST_BUTTON = (btn_title === 'Feito' && points[cursor].length < 2) || ((btn_title === 'Feito' || btn_title === 'Criar nova') && FLAG_ADD_ENABLED_POINTS) ? false : true;

    const disabledParameter = FLAG_ACTIVE_FIRST_BUTTON ? '' : 'disabled';


    const toHide = checked ? '' : '';

    btn_cont.innerHTML = `
    <button onclick="${func}" class="button-onclick" ${disabledParameter}>  
      ${toHide}
    </button>
    <div class="button-description">
      <p>${btn_title}</p>
    </div>
  `;

    options.appendChild(btn_cont);
}



function input() {
    const eval_points = document.getElementById('eval-number').value;

    t = eval_points;

    if (t < 1) {
        document.getElementById('eval-number').value = 100;
        t = 100;
    }
}



function new_create() {
    FLAG_CREATE_ENABLED = true;
    selected = null;

    cursorType('crosshair');

    if (!FLAG_FIRST_ACTION)
        FLAG_FIRST_ACTION = true;

    if (FLAG_FIRST_CURVE)
        cursor = points.length - 1;
}

function reset_sketch() {
    points = [
        []
    ];

    cursor = 0;
    selected = null;

    FLAG_CREATE_ENABLED = false;
    FLAG_SHOW_POINTS_ENABLED = true;
    FLAG_SHOW_LINES_ENABLED = true;
    FLAG_SHOW_CURVES_ENABLED = true;
    FLAG_ADD_ENABLED_POINTS = false;

    FLAG_ACTIVE_FIRST_BUTTON = true;

    FLAG_FIRST_CURVE = false;
}

function trigger_show_points() {
    FLAG_SHOW_POINTS_ENABLED = !FLAG_SHOW_POINTS_ENABLED;
}

function trigger_show_lines() {
    FLAG_SHOW_LINES_ENABLED = !FLAG_SHOW_LINES_ENABLED;
}

function trigger_show_curves() {
    FLAG_SHOW_CURVES_ENABLED = !FLAG_SHOW_CURVES_ENABLED;
}

function done() {
    if (FLAG_FIRST_ACTION && points[cursor].length > 1) {
        FLAG_CREATE_ENABLED = false;
        points[points.length] = [];

        FLAG_FIRST_CURVE = true;
    }
}

function next_curve() {
    cursor = (cursor + 1) % (points.length - 1);

    selected = null;
}

function add_points() {
    FLAG_ADD_ENABLED_POINTS = true;

    cursorType('crosshair');
}

function done_add_points() {
    FLAG_ADD_ENABLED_POINTS = false;
}

function delete_p() {
    const index = points[cursor].indexOf(selected);
    points[cursor].splice(index, 1);

    selected = null;
}

function delete_c() {
    points.splice(cursor, 1);
    next_curve();
}