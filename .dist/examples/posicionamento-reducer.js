'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.posicionamentoReducer = posicionamentoReducer;

var _reduxUtils = require('../core-utils/redux-utils');

var reduxUtils = _interopRequireWildcard(_reduxUtils);

var _actions = require('../actions');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function posicionamentoReducer(state, action) {
    if (state === undefined) {
        state = stateDefault();
    }
    switch (action.type) {
        case _actions.Actions.POSICIONAMENTO_CLEAR_STATE:
            return stateDefault();

        case _actions.Actions.POSICIONAMENTO_SET_PECA_EM_ELABORACAO:
            return setPecaEmElaboracao(action, state);

        case _actions.Actions.POSICIONAMENTO_FETCH_PECA_EM_ELABORACAO + _reduxUtils.ActionsSuffix.SUCCESS:
            return fetchPecaEmElaboracaoSuccess(action, state);

        case _actions.Actions.POSICIONAMENTO_CREATE_ELABORACAO + _reduxUtils.ActionsSuffix.SUCCESS:
            return createElaboracaoSuccess(action, state);

        case _actions.Actions.POSICIONAMENTO_CLEAR_ELABORACAO:
            return clearElaboracaoSuccess(action, state);

        case _actions.Actions.POSICIONAMENTO_FETCH_MODELOS + _reduxUtils.ActionsSuffix.SUCCESS:
            return fetchModelosSuccess(action, state);

        case _actions.Actions.POSICIONAMENTO_FETCH_POSICIONAMENTO + _reduxUtils.ActionsSuffix.SUCCESS:
            return fetchPosicionamentoSuccess(action, state);

        case _actions.Actions.POSICIONAMENTO_DELETE_ELEMENTO + _reduxUtils.ActionsSuffix.SUCCESS:
            return deleteElementoSuccess(action, state);

        case _actions.Actions.POSICIONAMENTO_MOVE_ELEMENTO + _reduxUtils.ActionsSuffix.SUCCESS:
            return moveElementoSuccess(action, state);

        case _actions.Actions.POSICIONAMENTO_UPDATE_ELEMENTO_HTML + _reduxUtils.ActionsSuffix.SUCCESS:
            return updateElementoHtmlSuccess(action, state);

        case _actions.Actions.POSICIONAMENTO_UPDATE_POSICIONAMENTO_METADATA + _reduxUtils.ActionsSuffix.SUCCESS:
            return updatePosicionamentoMetadataSuccess(action, state);

        case _actions.Actions.POSICIONAMENTO_ADD_ELEMENTO + _reduxUtils.ActionsSuffix.SUCCESS:
            return addElementoSuccess(action, state);

        case _actions.Actions.POSICIONAMENTO_DELETE_POSICIONAMENTO + _reduxUtils.ActionsSuffix.SUCCESS:
            return deletePosicionamentoSuccess(action, state);

        case _actions.Actions.POSICIONAMENTO_SET_ELEMENTO_SELECIONANDO_MODELO:
            return setElementoSelecionandoModelo(action, state);

        case _actions.Actions.POSICIONAMENTO_UPDATE_MODELO + _reduxUtils.ActionsSuffix.SUCCESS:
            return updateModeloSuccess(action, state);

        case _actions.Actions.POSICIONAMENTO_CREATE_MODELO + _reduxUtils.ActionsSuffix.SUCCESS:
            return createModeloSuccess(action, state);

        default:
            return state;
    }
}

function stateDefault() {
    return {
        pecaEmElaboracao: null,
        elaboracaoPosicionamento: null,
        modelos: [],
        elementoSelecionandoModelo: null,
        modelo: null,
        verificandoModelo: false,
        modeloExistente: false
    };
}

function setPecaEmElaboracao(action, state) {
    return _extends({}, state, {
        pecaEmElaboracao: action.pecaEmElaboracao
    });
}

function fetchPecaEmElaboracaoSuccess(action, state) {
    return _extends({}, state, {
        pecaEmElaboracao: action.data
    });
}

function createElaboracaoSuccess(action, state) {
    return setElaboracaoPosicionamento(action.data.elaboracaoPosicionamento, state);
}

function clearElaboracaoSuccess(action, state) {
    return _extends({}, state, {
        elaboracaoPosicionamento: null
    });
}

function fetchModelosSuccess(action, state) {
    return _extends({}, state, {
        modelos: action.data
    });
}

function fetchPosicionamentoSuccess(action, state) {
    const newState = setElaboracaoPosicionamento(action.data, state);
    newState.modelo = action.data.modelo;
    return newState;
}

function setElaboracaoPosicionamento(data, state) {
    const elaboracao = data;
    const root = {
        id: elaboracao.id + '-main',
        elaboracaoId: elaboracao.id,
        tema: elaboracao.tema,
        orientacao: elaboracao.orientacao,
        html: elaboracao.html,
        children: elaboracao.children,
        tipo: 'POSICIONAMENTO_ELABORACAO',
        emPosicionamento: true,
        pedidoId: elaboracao.pedidoId,
        options: {
            deletable: false,
            draggable: false
        }
    };
    for (let child of elaboracao.children) {
        child.parent = root;
        adjustPecaData(child);
    }
    const items = [root];
    return _extends({}, state, {
        modelo: data.modelo,
        elaboracaoPosicionamento: items
    });
}

function deleteElementoSuccess(action, state) {
    const elaboracaoPosicionamento = [...state.elaboracaoPosicionamento];
    const children = [...elaboracaoPosicionamento[0].children];
    const elemento = reduxUtils.findItemById(children, action.elementoId);
    const index = children.indexOf(elemento);
    children.splice(index, 1);
    elaboracaoPosicionamento[0].children = children;
    const pecaEmElaboracao = setElaboracaoPosicionamentoInPecaEmElaboracao(state, elaboracaoPosicionamento);

    return _extends({}, state, {
        elaboracaoPosicionamento: elaboracaoPosicionamento,
        pecaEmElaboracao: pecaEmElaboracao
    });
}

function moveElementoSuccess(action, state) {
    const elaboracaoPosicionamento = [...state.elaboracaoPosicionamento];
    const children = [...elaboracaoPosicionamento[0].children];
    elaboracaoPosicionamento[0].children = children;
    const elemento = reduxUtils.findItemById(children, action.elementoId);
    const newElemento = _extends({}, elemento);
    children.splice(action.position, 0, newElemento);
    const index = children.indexOf(elemento);
    children.splice(index, 1);
    const pecaEmElaboracao = setElaboracaoPosicionamentoInPecaEmElaboracao(state, elaboracaoPosicionamento);
    return _extends({}, state, {
        elaboracaoPosicionamento: elaboracaoPosicionamento,
        pecaEmElaboracao: pecaEmElaboracao
    });
}

function updateElementoHtmlSuccess(action, state) {
    const elaboracaoPosicionamento = [...state.elaboracaoPosicionamento];
    const children = [...elaboracaoPosicionamento[0].children];
    const elemento = reduxUtils.findItemById(children, action.elementoId);
    elemento.html = action.html;
    const pecaEmElaboracao = setElaboracaoPosicionamentoInPecaEmElaboracao(state, elaboracaoPosicionamento);
    return _extends({}, state, {
        elaboracaoPosicionamento: elaboracaoPosicionamento,
        pecaEmElaboracao: pecaEmElaboracao
    });
}

function updatePosicionamentoMetadataSuccess(action, state) {
    const elaboracaoPosicionamento = [...state.elaboracaoPosicionamento];
    const firstChild = _extends({}, elaboracaoPosicionamento[0]);
    elaboracaoPosicionamento[0] = firstChild;
    firstChild.html = action.data.html;
    firstChild.tema = action.data.tema;
    firstChild.orientacao = action.data.orientacao;
    const pecaEmElaboracao = setElaboracaoPosicionamentoInPecaEmElaboracao(state, elaboracaoPosicionamento);
    return _extends({}, state, {
        elaboracaoPosicionamento: elaboracaoPosicionamento,
        pecaEmElaboracao: pecaEmElaboracao
    });
}

function addElementoSuccess(action, state) {
    if (action.data.length < 1) {
        return state;
    }
    const elaboracaoPosicionamento = [...state.elaboracaoPosicionamento];
    for (let elemento of action.data) {
        adjustPecaData(elemento);
        elemento.parent = elaboracaoPosicionamento[0];
        elaboracaoPosicionamento[0].children.push(elemento);
    }
    const pecaEmElaboracao = setElaboracaoPosicionamentoInPecaEmElaboracao(state, elaboracaoPosicionamento);
    return _extends({}, state, {
        elaboracaoPosicionamento: elaboracaoPosicionamento,
        pecaEmElaboracao: pecaEmElaboracao
    });
}

function deletePosicionamentoSuccess(action, state) {
    let pecaEmElaboracao = _extends({}, state.pecaEmElaboracao);
    const indexSecao = findIndexSecaoPecaEmElaboracao(pecaEmElaboracao, action.pedidoId);
    pecaEmElaboracao.secoes = [...pecaEmElaboracao.secoes];
    pecaEmElaboracao.secoes.splice(indexSecao, 1);
    return _extends({}, state, {
        elaboracaoPosicionamento: null,
        pecaEmElaboracao: pecaEmElaboracao
    });
}

function setElementoSelecionandoModelo(action, state) {
    return _extends({}, state, {
        elementoSelecionandoModelo: action.elemento
    });
}

function updateModeloSuccess(action, state) {
    return _extends({}, state, {
        modelo: action.data
    });
}

function createModeloSuccess(action, state) {
    return _extends({}, state, {
        modelo: action.data
    });
}

function setElaboracaoPosicionamentoInPecaEmElaboracao(state, elaboracaoPosicionamento) {
    const pecaEmElaboracao = _extends({}, state.pecaEmElaboracao);
    const pedidoId = elaboracaoPosicionamento[0].pedidoId;
    let indexSecao = findIndexSecaoPecaEmElaboracao(pecaEmElaboracao, pedidoId);
    pecaEmElaboracao.secoes[indexSecao].elaboracaoPosicionamento = elaboracaoPosicionamento[0];
    return pecaEmElaboracao;
}

function findIndexSecaoPecaEmElaboracao(pecaEmElaboracao, pedidoId) {
    let indexSecao = -1;
    for (let i = 0; i < pecaEmElaboracao.secoes.length; i++) {
        const secao = pecaEmElaboracao.secoes[i];
        if (secao.elaboracaoPosicionamento.pedidoId === pedidoId) {
            indexSecao = i;
        }
    }
    return indexSecao;
}

function adjustPecaData(elemento) {
    const descPeca = elemento.peca;
    elemento.peca = {
        descricao: descPeca,
        polo: elemento.polo
    };
    delete elemento.polo;
}