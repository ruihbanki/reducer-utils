import { ActionsSuffix } from '../core-utils/redux-utils';
import { Actions } from '../actions';
import * as reduxUtils from '../core-utils/redux-utils';

export function posicionamentoReducer(state, action) {
    if (state === undefined) {
        state = stateDefault();
    }
    switch(action.type) {
    case Actions.POSICIONAMENTO_CLEAR_STATE:
        return stateDefault();

    case Actions.POSICIONAMENTO_SET_PECA_EM_ELABORACAO:
        return setPecaEmElaboracao(action, state);

    case Actions.POSICIONAMENTO_FETCH_PECA_EM_ELABORACAO + ActionsSuffix.SUCCESS:
        return fetchPecaEmElaboracaoSuccess(action, state);

    case Actions.POSICIONAMENTO_CREATE_ELABORACAO + ActionsSuffix.SUCCESS:
        return createElaboracaoSuccess(action, state);

    case Actions.POSICIONAMENTO_CLEAR_ELABORACAO:
        return clearElaboracaoSuccess(action, state);

    case Actions.POSICIONAMENTO_FETCH_MODELOS + ActionsSuffix.SUCCESS:
        return fetchModelosSuccess(action, state);

    case Actions.POSICIONAMENTO_FETCH_POSICIONAMENTO + ActionsSuffix.SUCCESS:
        return fetchPosicionamentoSuccess(action, state);

    case Actions.POSICIONAMENTO_DELETE_ELEMENTO + ActionsSuffix.SUCCESS:
        return deleteElementoSuccess(action, state);

    case Actions.POSICIONAMENTO_MOVE_ELEMENTO + ActionsSuffix.SUCCESS:
        return moveElementoSuccess(action, state);

    case Actions.POSICIONAMENTO_UPDATE_ELEMENTO_HTML + ActionsSuffix.SUCCESS:
        return updateElementoHtmlSuccess(action, state);

    case Actions.POSICIONAMENTO_UPDATE_POSICIONAMENTO_METADATA + ActionsSuffix.SUCCESS:
        return updatePosicionamentoMetadataSuccess(action, state);

    case Actions.POSICIONAMENTO_ADD_ELEMENTO + ActionsSuffix.SUCCESS:
        return addElementoSuccess(action, state);

    case Actions.POSICIONAMENTO_DELETE_POSICIONAMENTO + ActionsSuffix.SUCCESS:
        return deletePosicionamentoSuccess(action, state);

    case Actions.POSICIONAMENTO_SET_ELEMENTO_SELECIONANDO_MODELO:
        return setElementoSelecionandoModelo(action, state);

    case Actions.POSICIONAMENTO_UPDATE_MODELO + ActionsSuffix.SUCCESS:
        return updateModeloSuccess(action, state);

    case Actions.POSICIONAMENTO_CREATE_MODELO + ActionsSuffix.SUCCESS:
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
    return {
        ...state,
        pecaEmElaboracao: action.pecaEmElaboracao
    };
}

function fetchPecaEmElaboracaoSuccess(action, state) {
    return {
        ...state,
        pecaEmElaboracao: action.data
    };
}

function createElaboracaoSuccess(action, state) {
    return setElaboracaoPosicionamento(action.data.elaboracaoPosicionamento, state);
}

function clearElaboracaoSuccess(action, state) {
    return {
        ...state,
        elaboracaoPosicionamento: null
    };
}

function fetchModelosSuccess(action, state) {
    return {
        ...state,
        modelos: action.data
    };
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
    return {
        ...state,
        modelo: data.modelo,
        elaboracaoPosicionamento: items
    };
}

function deleteElementoSuccess(action, state) {
    const elaboracaoPosicionamento = [...state.elaboracaoPosicionamento];
    const children = [...elaboracaoPosicionamento[0].children];
    const elemento = reduxUtils.findItemById(children, action.elementoId);
    const index = children.indexOf(elemento);
    children.splice(index, 1);
    elaboracaoPosicionamento[0].children = children;
    const pecaEmElaboracao = setElaboracaoPosicionamentoInPecaEmElaboracao(state, elaboracaoPosicionamento);

    return {
        ...state,
        elaboracaoPosicionamento,
        pecaEmElaboracao
    };
}

function moveElementoSuccess(action, state) {
    const elaboracaoPosicionamento = [...state.elaboracaoPosicionamento];
    const children = [...elaboracaoPosicionamento[0].children];
    elaboracaoPosicionamento[0].children = children;
    const elemento = reduxUtils.findItemById(children, action.elementoId);
    const newElemento = {...elemento};
    children.splice(action.position, 0, newElemento);
    const index = children.indexOf(elemento);
    children.splice(index, 1);
    const pecaEmElaboracao = setElaboracaoPosicionamentoInPecaEmElaboracao(state, elaboracaoPosicionamento);
    return {
        ...state,
        elaboracaoPosicionamento,
        pecaEmElaboracao
    };
}

function updateElementoHtmlSuccess(action, state) {
    const elaboracaoPosicionamento = [...state.elaboracaoPosicionamento];
    const children = [...elaboracaoPosicionamento[0].children];
    const elemento = reduxUtils.findItemById(children, action.elementoId);
    elemento.html = action.html;
    const pecaEmElaboracao = setElaboracaoPosicionamentoInPecaEmElaboracao(state, elaboracaoPosicionamento);
    return {
        ...state,
        elaboracaoPosicionamento,
        pecaEmElaboracao
    };
}

function updatePosicionamentoMetadataSuccess(action, state) {
    const elaboracaoPosicionamento = [...state.elaboracaoPosicionamento];
    const firstChild = {...elaboracaoPosicionamento[0]};
    elaboracaoPosicionamento[0] = firstChild;
    firstChild.html = action.data.html;
    firstChild.tema = action.data.tema;
    firstChild.orientacao = action.data.orientacao;
    const pecaEmElaboracao = setElaboracaoPosicionamentoInPecaEmElaboracao(state, elaboracaoPosicionamento);
    return {
        ...state,
        elaboracaoPosicionamento,
        pecaEmElaboracao
    };
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
    return {
        ...state,
        elaboracaoPosicionamento,
        pecaEmElaboracao
    };
}

function deletePosicionamentoSuccess(action, state) {
    let pecaEmElaboracao = {...state.pecaEmElaboracao};
    const indexSecao = findIndexSecaoPecaEmElaboracao(pecaEmElaboracao, action.pedidoId);
    pecaEmElaboracao.secoes = [...pecaEmElaboracao.secoes];
    pecaEmElaboracao.secoes.splice(indexSecao, 1);
    return {
        ...state,
        elaboracaoPosicionamento: null,
        pecaEmElaboracao
    };
}

function setElementoSelecionandoModelo(action, state) {
    return {
        ...state,
        elementoSelecionandoModelo: action.elemento
    };
}

function updateModeloSuccess(action, state) {
    return {
        ...state,
        modelo: action.data
    };
}

function createModeloSuccess(action, state) {
    return {
        ...state,
        modelo: action.data
    };
}

function setElaboracaoPosicionamentoInPecaEmElaboracao(state, elaboracaoPosicionamento) {
    const pecaEmElaboracao = {...state.pecaEmElaboracao};
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
