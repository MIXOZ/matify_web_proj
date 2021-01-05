const testString = [["+(1;*(B;C))", "+(1;*(B;C))"], ["+(2;*(4;5))", "(22)"], ["+(3;*(6;7))", "(45)"],
    ["+(4;*(8;9))", "(76)"], ["+(5;*(10;11))", "(115)"], ["+(6;*(12;126))", "(1518)"],
    ["+(1;*(B;C))", "+(1;*(B;C))"], ["+(2;*(4;5))", "(22)"], ["+(3;*(6;7))", "(45)"],
    ["+(4;*(8;9))", "(76)"], ["+(5;*(10;11))", "(115)"], ["+(6;*(12;126))", "(1518)"],
    ["+(1;*(B;C))", "+(1;*(B;C))"], ["+(2;*(4;5))", "(22)"], ["+(3;*(6;7))", "(45)"],
    ["+(4;*(8;9))", "(76)"], ["+(5;*(10;11))", "(115)"], ["+(6;*(12;126))", "(1518)"],];
MakeMainMenu(testString);

//================================================================================

function MakeMainMenu(levelsList) {
    let app = new SVG().addTo('body').size(window.innerWidth, Math.max(100 * (levelsList.length), window.innerHeight));
    app.viewbox(0, 0, window.innerWidth, Math.max(100 * (levelsList.length), window.innerHeight));
    app.rect(window.innerWidth, Math.max(100 * (levelsList.length), window.innerHeight)).fill('#333938');
    let cont = app.group();

    function cleanMainMenu() {
        app.remove();
    }

    MakeLevelsButton(levelsList);

    function MakeLevelsButton(_levelsList) {
        let heightContOfConts = 0;
        for (let i = 0; i < _levelsList.length; ++i) {
            heightContOfConts += 80;
            let tmpCont = cont.group();
            let draw = tmpCont.group();

            tmpCont.add(interactive_button(draw, _levelsList[i][0], _levelsList[i][1], 1));
            draw.rect(500, 80).radius(10)
                .fill('#517d73').center(window.innerWidth / 2, 100 * i + 100 / 2);
            (PlainPrintTree(TWF_lib.api.structureStringToExpression_69c2cy$(_levelsList[i][0]),
                70, draw)).center(window.innerWidth / 2, 100 * i + 100 / 2);
        }

    }


    function interactive_button(cont, string = "", res, f = 0) {
        let tmp = cont;
        tmp.css('cursor', 'pointer');
        tmp
            .on('mousedown', () => onButtonDownButton(cont, string, res, f))
            .on('mouseup mouseover', () => onButtonOverButton(cont))
            .on('mouseout', () => onButtonOutButton(cont));
        return tmp;
    }

    function onButtonDownButton(con, string, res, f = 0) {
        if (f) {
            cleanMainMenu();
            MakeMenuOfLevel(string, [string, res]);
        }
        con.animate(300, '<>').fill('#ffbf00');
        for (let item of con.children()) {
            onButtonDownButton(item);
        }
    }

    function onButtonOverButton(con) {
        if (con.type === "text") return;
        con.animate(300, '<>').fill('#874141');
        for (let item of con.children()) {
            onButtonOverButton(item);
        }
    }

    function onButtonOutButton(con) {
        if (con.type === "text") return;
        con.animate(300, '<>').fill('#517d73');
        for (let item of con.children()) {
            onButtonOutButton(item);
        }
    }
}


//=================================================================================================


function MakeMenuOfLevel(level, curLevel) {




    let app = new SVG().addTo('body').size(window.innerWidth, window.innerHeight);
    app.viewbox(0, 0, window.innerWidth, window.innerHeight);
    app.rect(window.innerWidth, window.innerHeight).fill('#333938');






    function initTimer(app, init_font_size) {
        const timer_colour = '#CCCCCC';
        let counter = 0;

        let txt = app.text("00:00").font({
            size: init_font_size,
            family: 'u2000',
            fill: timer_colour,
            leading: 0.9
        });

        txt.css('user-select', 'none');

        function updateTimer() {
            counter++;
            let time_passed = new Date(1000 * counter);

            txt.text(`${Math.floor(time_passed.getMinutes() / 10)}` +
                `${time_passed.getMinutes() % 10}:` +
                `${Math.floor(time_passed.getSeconds() / 10)}` +
                `${time_passed.getSeconds() % 10}`);
        }

        setInterval(updateTimer, 1000);

        return txt;
    }





    let contTree = app.nested();
    let expr = app.group();
    MakeExpression();

    {
        let tmp = PlainPrintTree(TWF_lib.api.structureStringToExpression_69c2cy$(curLevel[1]), 70, app)
            .center((window.innerWidth / 2), (window.innerHeight / 9 * 2));
        for (let item of tmp.children()) {
            item.css('cursor', 'default');
        }
    }
    function MakeExpression() {
        contTree.remove();
        expr.remove();
        contTree = app.nested();

        let NewTreeRoot = TWF_lib.api.structureStringToExpression_69c2cy$(level);

        compiledConfiguration = TWF_lib.api.createCompiledConfigurationFromExpressionSubstitutionsAndParams_aatmta$(
            [TWF_lib.api.expressionSubstitutionFromStructureStrings_l8d3dq$(level, level)])

        init(compiledConfiguration, level, MakeMenu);

        expr = PrintTree(NewTreeRoot, 100, app);
        expr.dx((window.innerWidth - expr.bbox().width) / 2);
        expr.dy(window.innerHeight / 5 * 2);
    }

    let cont = app.nested();
    let height_cont = window.innerHeight / 5 * 2 - 60;
    let width_cont = window.innerWidth - 200;
    let height_inner_cont = height_cont / 4;
    let width_inner_cont = width_cont / 8 * 8;
    cont.size(width_cont, height_cont)
        .move(100, (window.innerHeight / 5 * 3))
        .rect(width_cont, height_cont)
        .fill('#9e5252').radius(10);
    let contOfCont = cont.group()


    function MakeMenu(listOfValues, arrSubs, idArr) {
        cont.size(width_cont, height_cont)
            .move(100, (window.innerHeight / 5 * 3))
            .rect(width_cont, height_cont)
            .fill('#9e5252').radius(10);
        contOfCont.remove();
        contOfCont = cont.group()


        let heighContOfConts = 0;
        for (let i = 0; i < listOfValues.length; ++i) {
            heighContOfConts += height_inner_cont;
            let tmpCont = contOfCont.group();

            let draw = tmpCont.group();

            tmpCont.add(interactive_button_1(draw, false, i));

            draw.rect(width_inner_cont, height_inner_cont).radius(10)
                .fill('#517d73').y(height_inner_cont * i);

            let curCont = draw.group();

            (PlainPrintTree(TWF_lib.api.structureStringToExpression_69c2cy$(listOfValues[i][0]), 70, curCont)).y(height_inner_cont * i);
            let tmpWidth = curCont.width();
            curCont.group().text("\u27F6").font({
                size: 70,
                family: 'u2000',
                fill: '#CCCCCC'
            }).x(tmpWidth).y(height_inner_cont * i);
            tmpWidth = curCont.width();
            (PlainPrintTree(TWF_lib.api.structureStringToExpression_69c2cy$(listOfValues[i][1]), 70, curCont)).x(tmpWidth).y(height_inner_cont * i);
            draw.add(curCont);
        }

        function moveScrollUp(con, tmp) {
            con.animate(300, '<>')
                .dy(tmp * 2)
            if (con.y() > contOfCont.y() - 500) {
                con.animate(300, '<>').y(0);
            }
        }

        function moveScrollDown(con, tmp) {
            con.animate(300, '<>')
                .dy(tmp * 2);
            if (con.y() < cont.y() + height_cont - heighContOfConts) {
                con.animate(300, '<>').y(height_cont - heighContOfConts);
            }
        }

        contOfCont.on('scroll', function (e) {
            if (heighContOfConts < height_cont) return;
            let tmp = e.detail.some;
            if (tmp > 0) {
                moveScrollUp(contOfCont, tmp);
            } else {
                moveScrollDown(contOfCont, tmp);
            }
        });

        function addHandler(object, event, handler) {
            if (object.addEventListener) {
                object.addEventListener(event, handler, false, {passive: false});
            } else if (object.attachEvent) {
                object.attachEvent('on' + event, handler, {passive: false});
            } else alert("Обработчик не поддерживается");
        }

        addHandler(document, 'mousewheel', wheel);


        function onButtonDownButton1(con, f = false, index = -1) {
            if (con.type === "text") return;
            con.animate(300, '<>').fill('#ffbf00');
            for (let item of con.children()) {
                onButtonDownButton1(item);
            }
            if (index !== -1) {
                level = (TWF_lib.api.applySubstitutionInSelectedPlace_m5nb0p$(
                    TWF_lib.api.structureStringToExpression_69c2cy$(level),
                    idArr,
                    arrSubs[index].expressionSubstitution,
                    TWF_lib.api.createCompiledConfigurationFromExpressionSubstitutionsAndParams_aatmta$(
                        [TWF_lib.api.expressionSubstitutionFromStructureStrings_l8d3dq$(level, level)]),
                )).toString()
                if (level === curLevel[1]) {
                    cleanMenuOfLevel('win');
                    return;
                }
                cleanMenuOfLevel('level', level);
            }
            if (f) cleanMenuOfLevel('main');
        }

        function interactive_button_1(cont, f = false, index = -1) {
            let tmp = cont;
            tmp.css('cursor', 'pointer');
            tmp
                .on('mousedown', () => onButtonDownButton1(cont, f, index))
                .on('mouseup mouseover', () => onButtonOverButton(cont))
                .on('mouseout', () => onButtonOutButton(cont));
            return tmp;
        }

    }

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
            contOfCont.fire('scroll', {some: delta})
        }
    }

    function interactive_button(cont, f = 'false', index = -1) {
        let tmp = cont;
        tmp.css('cursor', 'pointer');
        tmp
            .on('mousedown', () => onButtonDownButton(cont, f, index))
            .on('mouseup mouseover', () => onButtonOverButton(cont))
            .on('mouseout', () => onButtonOutButton(cont));
        return tmp;
    }

    function onButtonDownButton(con, f = 'false', index) {
        con.animate(300, '<>').fill('#ffbf00');
        for (let item of con.children()) {
            onButtonDownButton(item);
        }
        if (index === 3) {
            cleanMenuOfLevel('level compl');
            return;
        }
        if (f === 'true') cleanMenuOfLevel('main');
        if (f === 'level') cleanMenuOfLevel('level');
        if (f === 'level compl') cleanMenuOfLevel('level compl');
    }


    function onButtonOverButton(con) {
        if (con.type === "text") return;
        con.animate(300, '<>').fill('#874141');
        for (let item of con.children()) {
            onButtonOverButton(item);
        }
    }

    function onButtonOutButton(con) {
        if (con.type === "text") return;
        con.animate(300, '<>').fill('#517d73');
        for (let item of con.children()) {
            onButtonOutButton(item);
        }
    }

    function ins(cont, x, y) {
        return (x >= cont.x()) && (y >= cont.y()) && (x <= cont.x() + width_cont) && (y <= cont.y() + height_cont);
    }




    let button_height = (window.innerHeight / 5 - 60) / 3 * 2;
    let button_width = (window.innerWidth - 200 - 30 * 4) / 5;

    let contOfButtons = app.group();

    let tmp = contOfButtons.group();

    tmp.size(button_width, button_height)
        .rect(button_width, button_height)
        .fill('#517d73').radius(10)
        .move(100 + 2 * (30 + button_width), 30 + (window.innerHeight / 5 - 60) / 3);

    tmp.add(initTimer(app, 100).font({
        size: 70,
        family: 'u2000',
        fill: '#d8ff00'
    }).center(100 + 2 * (30 + button_width) + (button_width / 2), 30 + (window.innerHeight / 5 - 60) / 3 + button_height / 2));

    for (let i = 0; i < 5; ++i) {
        if (i === 2) {
            continue;
        }
        if (i === 3) {
            let goBackButton = contOfButtons.group();

            goBackButton.size(button_width, button_height)
                .rect(button_width / 2 - 15, button_height)
                .fill('#517d73').radius(10)
                .move(100 + i * (30 + button_width), 30 + (window.innerHeight / 5 - 60) / 3);

            contOfButtons.add(interactive_button(goBackButton, 'false', i));

            goBackButton.group().text("\u27F2").font({
                size: 70,
                family: 'u2000',
                fill: '#d8ff00'
            }).center(100 + i * (30 + button_width) + (button_width / 2 - 20) / 2, 30 + (window.innerHeight / 5 - 60) / 3 + button_height / 2);

            let goBackButton1 = contOfButtons.group();

            goBackButton1.size(button_width, button_height)
                .rect(button_width / 2 - 15, button_height)
                .fill('#517d73').radius(10)
                .move(100 + i * (30 + button_width) + (button_width / 2) + 15, 30 + (window.innerHeight / 5 - 60) / 3);

            contOfButtons.add(interactive_button(goBackButton1, 'true'));
            continue;
        }
        let goBackButton = contOfButtons.group();

        goBackButton.size(button_width, button_height)
            .rect(button_width, button_height)
            .fill('#517d73').radius(10)
            .move(100 + i * (30 + button_width), 30 + (window.innerHeight / 5 - 60) / 3);

        contOfButtons.add(interactive_button(goBackButton, 'true'));
        if (i === 0) {
            goBackButton.group().text("Level Menu").font({
                size: 50,
                family: 'u2000',
                fill: '#CCCCCC'
            }).center(100 + i * (30 + button_width) + (button_width / 2), 30 + (window.innerHeight / 5 - 60) / 3 + (button_height / 2));
        }

    }

    function removeHandler(object, event, handler) {
        if (object.removeEventListener) {
            object.removeEventListener(event, handler, false);
        } else if (object.detachEvent) {
            object.detachEvent('on' + event, handler);
        } else alert("Remove handler is not supported");
    }


    function cleanMenuOfLevel(f = 'main', _level = "") {
        if (f === 'level') {
            MakeExpression();
            return;
        }
        removeHandler(document, 'mousewheel', wheel);
        if (f === 'win') {
            MakeWinMenu(app);
            return;
        }
        contOfButtons.remove();
        contOfCont.remove();
        cont.remove();
        contTree.remove();
        contOfButtons.remove();
        app.remove();

        if (f === 'main') MakeMainMenu(testString);
        if (f === 'level compl') {
            MakeMenuOfLevel(curLevel[0], curLevel);
        }
    }


    function MakeWinMenu() {
        let _cont = app.nested();
        _cont.size(window.innerWidth, window.innerHeight)
            .move(0, 0)
            .rect(window.innerWidth, window.innerHeight)
            .fill({color: '#1d55af', opacity: 0.6});

        {
            let tmp = _cont.group();

            tmp.size(button_width, button_height)
                .rect(500, 80)
                .fill('#517d73').radius(10)
                .center(window.innerWidth / 2, window.innerHeight / 2 - 60);

            _cont.add(interactive_button(tmp, 'true'));
            tmp.group().text("Level Menu").font({
                size: 50,
                family: 'u2000',
                fill: '#CCCCCC'
            }).center(window.innerWidth / 2, window.innerHeight / 2 - 60);
        }
        {
            let tmp = _cont.group();

            tmp.size(button_width, button_height)
                .rect(500, 80)
                .fill('#517d73').radius(10)
                .center(window.innerWidth / 2, window.innerHeight / 2 + 60);

            _cont.add(interactive_button(tmp, 'level compl'));
            tmp.group().text("Play Again").font({
                size: 50,
                family: 'u2000',
                fill: '#CCCCCC'
            }).center(window.innerWidth / 2, window.innerHeight / 2 + 60);
        }

    }
}
