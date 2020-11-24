const app = new SVG().addTo('body').size(window.innerWidth - 20, window.innerHeight - 20);
app.viewbox(0, 0, window.innerWidth - 20, window.innerHeight - 20);
app.rect(window.innerWidth, window.innerHeight).fill('#333938');


function MakeNode(node) {
    this.value = node.value;
    this.children = [];
    this.add = function(child_node) {
        this.children.push(child_node);
    }
    this.cont = app.nested();
    this.twfNode = node;
}

function MakeTree(node) {
    let cur_node = new MakeNode(node);
    for (let i = 0; i < node.children.size; i++) {
        cur_node.add(MakeTree(node.children.toArray()[i]));
    }
    return cur_node;
}

function interactive_text(value, cont) {
    let tmp = cont.nested().text(value).font({
        size: 50,
        family: 'u2000',
        fill: '#CCCCCC'
    });
    tmp.css('cursor', 'pointer');
    tmp
        .on('mousedown', (event) => onButtonDown(cont))
        .on('mouseup mouseover', (event) => onButtonOver(cont))
        .on('mouseout', (event) => onButtonOut(cont));
    return tmp;
}

let NewTreeRoot = TWF_lib.api.structureStringToExpression_69c2cy$("+(A;*(B;C))");

let TreeRoot = MakeTree(NewTreeRoot.children.toArray()[0]);

function PrintTree(v) {
    let delta = 0;
    let cur_cont = v.cont;
    if (v.value === "/") {
        Division(PrintTree(v.children[0]), PrintTree(v.children[1]), cur_cont);
    } else if (v.children.length > 1) {
        let first_child = PrintTree(v.children[0]);
        cur_cont.add(first_child);
        delta += first_child.bbox().width;
        for (let i = 1; i < v.children.length; i++) {
            let tmp = interactive_text(v.value, v.cont);
            tmp.dx(delta);
            cur_cont.add(tmp);
            delta += tmp.bbox().width;
            tmp = PrintTree(v.children[i]);
            tmp.dx(delta);
            cur_cont.add(tmp);
            delta += tmp.bbox().width;
        }
    } else if (v.children.length === 1) {
        let tmp = interactive_text(v.value + '(', v.cont);
        tmp.dx(delta);
        cur_cont.add(tmp);
        delta += tmp.bbox().width;
        tmp = PrintTree(v.children[0]);
        tmp.dx(delta);
        cur_cont.add(tmp);
        delta += tmp.bbox().width;
        tmp = interactive_text(')', v.cont);
        tmp.dx(delta);
        cur_cont.add(tmp);
    } else {
        let tmp = interactive_text(v.value, v.cont);
        cur_cont.add(tmp);
    }
    return cur_cont;
}

function onButtonDown(con, f = true) {
    con.fill('#00FFFF');
    for (let item of con.children()) {
        onButtonDown(item, false);
    }
    if (f) MakeMenu(["rejg","rejfger","reoge","rgnerog","roegnir","fier","erig","roegnir","fier","erig" ]);
}

function onButtonOver(con) {
    con.fill('#AAAAAA');
    for (let item of con.children()) {
        onButtonOver(item);
    }
}

function onButtonOut(con) {
    con.fill('#CCCCCC');
    for (let item of con.children()) {
        onButtonOut(item);
    }
}

//==========================================================

cont = app.nested();
height_cont = 640;
width_cont = 600;
height_inner_cont = 80;
width_inner_cont = 600;
cont.size(width_cont, height_cont)
    .move((window.innerWidth - 20 - width_cont),(window.innerHeight  - 20 - height_cont) / 2)
    .rect(width_cont, height_cont)
    .fill('#9e5252').radius(10);



function MakeMenu(listOfValues){
    cont.size(width_cont, height_cont)
        .move((window.innerWidth - 20 - width_cont) ,(window.innerHeight  - 20 - height_cont) / 2)
        .rect(width_cont, height_cont)
        .fill('#9e5252').radius(10);

    let contOfconts = cont.group()

    let heighContOfConts = 0;
    for (let i = 0; i < listOfValues.length; ++i) {
        heighContOfConts += height_inner_cont;
        let tmpCont = contOfconts.group();
        let draw = tmpCont.group();

        tmpCont.add(interactive_button(draw));
        draw.rect(width_inner_cont, height_inner_cont).radius(10)
            .fill('#517d73').dy(height_inner_cont * i);
        let curCont = tmpCont.group();
        curCont.add(interactive_text(listOfValues[i], curCont)
               .y(height_inner_cont * i));
    }

    contOfconts.on('scroll', function (e) {
        if (heighContOfConts < height_cont) return;
        //alert(cont.bbox().height);
        //alert(contOfconts.y());
        let tmp = e.detail.some;
        if (tmp > 0)
            contOfconts.animate(40, 0, 'now')
                       .dy(Math.min(tmp * 7, cont.y() - contOfconts.y() - 160));
        else
            contOfconts.animate(40, 0, 'now')
                .dy(Math.max(tmp * 7, cont.y() + height_cont - contOfconts.y() - heighContOfConts - 160));
    });

    function addHandler(object, event, handler) {
        if (object.addEventListener) {
            object.addEventListener(event, handler, false);
        } else if (object.attachEvent) {
            object.attachEvent('on' + event, handler);
        } else alert("Обработчик не поддерживается");
    }

    addHandler(window, 'DOMMouseScroll', wheel);
    addHandler(window, 'mousewheel', wheel);
    addHandler(document, 'mousewheel', wheel);


    function wheel(event) {
        let delta;
        event = event || window.event;
        if (event.wheelDelta) {
            delta = event.wheelDelta / 120;
            if (window.opera) delta = -delta;
        } else if (event.detail) {
            delta = -event.detail / 3;
        }
        if (event.preventDefault) event.preventDefault();
        event.returnValue = false;
        if (ins(cont, event.pageX, event.pageY)) {
            //alert([event.pageX, event.pageY]);
            contOfconts.fire('scroll', {some: delta})
        }
    }

}

function interactive_button(cont) {
    let tmp = cont;
    tmp.css('cursor', 'pointer');
    tmp
        .on('mousedown', (event) => onButtonDownButton(cont))
        .on('mouseup mouseover', (event) => onButtonOverButton(cont))
        .on('mouseout', (event) => onButtonOutButton(cont));
    return tmp;
}

function onButtonDownButton(con) {
    con.fill('#ffbf00');
    for (let item of con.children()) {
        onButtonDownButton(item);
    }
}

function onButtonOverButton(con) {
    con.fill('#874141');
    for (let item of con.children()) {
        onButtonOverButton(item);
    }
}

function onButtonOutButton(con) {

    con.fill('#517d73');
    for (let item of con.children()) {
        onButtonOutButton(item);
    }
}

function ins(cont, x, y) {
    return (x >= cont.x()) && (y >= cont.y()) && (x <= cont.x() + width_cont) && (y <= cont.y() + height_cont);
}

function MakeInnerCont (cont) {
    this.draw = cont.group();
}


let expr = PrintTree(TreeRoot);
expr.dx((window.innerWidth - 20 - expr.bbox().width) / 2);
expr.dy((window.innerHeight  - 20 - expr.bbox().height) / 4);
