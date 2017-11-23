import { ActionsSuffix } from '../core-utils/redux-utils';
import { Actions } from '../actions';
import {PEDIDO_STATUS} from '../processo/processo-constants';
import * as reduxUtils from '../core-utils/redux-utils';

export function raciocinioReducer(state, action) {
    if (state === undefined) {
        state = stateDefault();
    }
    switch (action.type) {
    case Actions.RACIOCINIO_CLEAR_STATE:
        return stateDefault();

    case Actions.RACIOCINIO_SET_ELEMENTOS:
        return setElementos(action, state);

    case Actions.RACIOCINIO_SET_CLONES_MAP:
        return setMapClonesByMarcacao(action, state);

    case Actions.RACIOCINIO_DELETE_ELEMENTO + ActionsSuffix.SUCCESS:
        return deleteElementoSuccess(action, state);

    case Actions.RACIOCINIO_UPDATE_ELEMENTO_HTML + ActionsSuffix.SUCCESS:
        return updateElementoHtmlSuccess(action, state);

    case Actions.RACIOCINIO_MOVE_ELEMENTO + ActionsSuffix.SUCCESS:
        return moveElementoSuccess(action, state);

    case Actions.RACIOCINIO_SELECT_ELEMENTO:
        return selectElemento(action, state);

    case Actions.RACIOCINIO_MARK_ELEMENTO:
        return selectElemento(action, state);

    case Actions.RACIOCINIO_CREATE_ELEMENTO:
        return createElemento(action, state);

    case Actions.RACIOCINIO_SCROLL_TO_ELEMENTO:
        return scrollRaciocinioViewToElemento(action, state);

    case Actions.RACIOCINIO_SET_PEDIDO_POSICIONAMENTO:
        return setPedidoPosicionamento(action, state);

    case Actions.RACIOCINIO_REMOVE_PEDIDO_POSICIONAMENTO:
        return removePedidoPosicionamento(action, state);

    case Actions.RACIOCINIO_OPEN_ELEMENTO:
        return openElemento(action, state);

    case Actions.RACIOCINIO_CLOSE_ELEMENTO:
        return closeElemento(action, state);

    case Actions.RACIOCINIO_ACCEPT_MARCACAO + ActionsSuffix.SUCCESS:
        return acceptMarcacaoSuccess(action, state);

    case Actions.RACIOCINIO_REJECT_MARCACAO + ActionsSuffix.SUCCESS:
        return rejectMarcacaoSuccess(action, state);

    case Actions.RACIOCINIO_CLONE_ELEMENTO + ActionsSuffix.SUCCESS:
        return cloneElemento(action, state);

    case Actions.RACIOCINIO_UPDATE_CLONES_MAP:
        return updateClonesMap(action, state);

    case Actions.RACIOCINIO_CREATE_ELEMENTOS_ARRAY:
        return createElementosArray(action, state);

    default:
        return state;
    }
}

function stateDefault() {
    return {
        isFetching: false,
        elementos: [],
        elementosById: {},
        elementosOpenedById: {},
        elementoSelecionado: {},
        collapse: false,
        error: undefined,
        elementoScroll: {},
        clonesByMarcacaoId: {},
        elementosArray: []
    };
}

function setElementos(action, state) {
    const elementosById = reduxUtils.createItemsTreeById(action.elementos);
    const elementos = prepareItems(action.elementos);

    return {
        ...state,
        elementos,
        elementosById
    };
}

function setMapClonesByMarcacao(action, state) {
    const clonesByMarcacaoId = action.clonesByMarcacaoId;
    return {
        ...state,
        clonesByMarcacaoId
    };
}

function deleteElementoSuccess(action, state) {
    let elemento = state.elementosById[action.elementoId];
    if (elemento.parent) {
        const parent = elemento.parent;
        const children = parent.children;
        const index = children.indexOf(elemento);
        children.splice(index, 1);
        state.elementos = [...state.elementos];
    } else {
        const children = state.elementos;
        const index = children.indexOf(elemento);
        children.splice(index, 1);
        state.elementos = [...children];
    }

    return {
        ...state,
        elementoSelecionado: null
    };
}

function updateClonesMap(action, state) {
    const clonesByMarcacaoId = {...state.clonesByMarcacaoId};

    let elemento = state.elementosById[action.elementoId];
    const clonesByMarcacaoOfElement = clonesByMarcacaoId[elemento.marcacao.id];
    if (clonesByMarcacaoOfElement) {
        clonesByMarcacaoOfElement.elementCount += action.valueToSum;
    }

    return {
        ...state,
        clonesByMarcacaoId
    };
}

function createElementosArray(action, state) {
    const elementosArray = [];
    populateElementosArray(elementosArray, state.elementos);
    return {
        ...state,
        elementosArray
    };
}

function updateElementoHtmlSuccess(action, state) {
    let elemento = state.elementosById[action.elementoId];
    elemento.html = action.html;
    return {
        ...state,
        elementosById: {...state.elementosById }
    };
}

function moveElementoSuccess(action, state) {
    const elementos = [...state.elementos];
    const elemento = state.elementosById[action.elementoId];
    const newElemento = {...elemento};

    if (action.parentId) {
        const parentElemento = state.elementosById[action.parentId];
        parentElemento.children.splice(action.position, 0, newElemento);
        newElemento.parent = parentElemento;
    } else {
        elementos.splice(action.position, 0, newElemento);
        newElemento.parent = null;
    }

    if (elemento.parent) {
        const index = elemento.parent.children.indexOf(elemento);
        elemento.parent.children.splice(index, 1);
    } else {
        const index = elementos.indexOf(elemento);
        elementos.splice(index, 1);
    }

    const elementosById = {...state.elementosById};
    elementosById[newElemento.id] = newElemento;

    return {
        ...state,
        elementos,
        elementosById
    };
}

function selectElemento(action, state) {
    const elemento = state.elementosById[action.elementoId];
    return {
        ...state,
        elementoSelecionado: elemento
    };
}

function createElemento(action, state) {
    const { data } = action;
    const { elementos, elementosById } = state;

    const newElementos = elementos.slice();
    newElementos.push(data);

    const newElementosByIdItem = {
        ...elementosById,
        [data.id]: data
    };

    return {
        ...state,
        elementos: newElementos,
        elementosById: newElementosByIdItem,
    };
}

function scrollRaciocinioViewToElemento(action, state) {
    const elementosOpenedById = {...state.elementosOpenedById};
    const elementoScroll = state.elementosById[action.elementoId];
    let curElemento = elementoScroll.parent;
    while (curElemento) {
        elementosOpenedById[curElemento.id] = true;
        curElemento = curElemento.parent;
    }
    return {
        ...state,
        elementoScroll,
        elementosOpenedById
    };
}

function setPedidoPosicionamento(action, state) {
    const elementoPedido = state.elementosById[action.pedidoId];
    elementoPedido.children.unshift(action.posicionamento);
    elementoPedido.status = PEDIDO_STATUS.POSICIONAMENTO;
    if (elementoPedido.parent) {
        const indexPedido = elementoPedido.parent.children(elementoPedido);
        elementoPedido.parent.children[indexPedido] = {...elementoPedido};
    } else {
        const indexPedido = state.elementos.indexOf(elementoPedido);
        state.elementos[indexPedido] = {...elementoPedido};
    }
    action.posicionamento.peca.polo = 'JUIZ';
    action.posicionamento.html = '<p>Posicionamento em elaboração</p>';
    action.posicionamento.parent = elementoPedido;
    state.elementos = [...state.elementos];
    state.elementosById[action.posicionamento.id] = action.posicionamento;
    state.elementosById = {...state.elementosById};
    const elementosOpenedById = {...state.elementosOpenedById};
    elementosOpenedById[action.pedidoId] = true;
    const ui = {
        scrollTo: action.pedidoId
    };
    return {
        ...state,
        elementos: state.elementos,
        elementosById: state.elementosById,
        elementoSelecionado: action.posicionamento,
        elementosOpenedById,
        ui
    };
}

function removePedidoPosicionamento(action, state) {
    let elementoPedido = reduxUtils.findItemById(state.elementos, action.pedidoId);
    const indexPedido = state.elementos.indexOf(elementoPedido);
    elementoPedido = {...elementoPedido};
    const elementoPosicionamento = elementoPedido.children[0];
    let elementos = [...state.elementos];
    if (elementoPosicionamento.tipo === 'POSICIONAMENTO') {
        elementoPedido.status = PEDIDO_STATUS.PENDENTE;
        elementoPedido.children = [...elementoPedido.children];
        elementoPedido.children.splice(0, 1);
        elementos[indexPedido] = elementoPedido;
    }
    const elementosById = reduxUtils.createItemsTreeById(elementos);
    elementos = prepareItems(elementos);
    return {
        ...state,
        elementos,
        elementosById
    };
}

function openElemento(action, state) {
    const elementosOpenedById = {...state.elementosOpenedById};
    elementosOpenedById[action.elementoId] = true;
    return {
        ...state,
        elementosOpenedById
    };
}

function closeElemento(action, state) {
    const elementosOpenedById = {...state.elementosOpenedById};
    elementosOpenedById[action.elementoId] = false;
    return {
        ...state,
        elementosOpenedById
    };
}

export function acceptMarcacaoSuccess(action, state) {
    let elementoId = action.elementoId;

    let newState = {...state};
    let elementos = reduxUtils.cloneProperty(newState, 'elementos');

    if (!elementos) {
        return state;
    }

    let elemento = reduxUtils.cloneItemArrayById(elementos, elementoId);

    if (!elemento) {
        return state;
    }

    elemento.marcacao.sugerida = false;

    newState.elementos = elementos;

    let elementosById = reduxUtils.cloneProperty(newState, 'elementosById');
    elementosById[elementoId] = elemento;
    newState.elementosById = elementosById;
    return newState;
}

export function rejectMarcacaoSuccess(action, state) {
    let elementoId = action.elementoId;

    let newState = {...state};

    let elementosById = reduxUtils.cloneProperty(newState, 'elementosById');

    if (!elementosById[elementoId]) {
        return state;
    }

    delete elementosById[elementoId];
    newState.elementosById = elementosById;

    let elementos = reduxUtils.cloneProperty(newState, 'elementos');
    reduxUtils.deleteItemArrayById(elementos, elementoId);
    newState.elementos = elementos;

    return newState;
}

export function cloneElemento(action, state) {
    let newState = {...state};

    let elementoClonado = action.data;
    let elementoOriginalId = action.elementoOriginalId;

    let elementosById = reduxUtils.cloneProperty(newState, 'elementosById');
    let elementosDaRaiz = reduxUtils.cloneProperty(newState, 'elementos');
    let clonesByMarcacaoId = reduxUtils.cloneProperty(newState, 'clonesByMarcacaoId');

    //atualiza elementos
    const elementoOriginal = elementosById[elementoOriginalId];
    const elementoOriginalParent = elementoOriginal.parent;

    let elementoClonadoParent = elementoOriginalParent;

    if (!elementoClonadoParent) {
        elementosDaRaiz.splice(elementoClonado.position, 0, elementoClonado);
    } else {
        let parentInElementosById = {...elementosById[elementoClonadoParent.id]};
        let elementosFilhos = parentInElementosById.children;
        elementosFilhos.splice(elementoClonado.position, 0, elementoClonado);

        elementosById[elementoClonadoParent.id] = parentInElementosById;
        elementoClonado.parent = {...parentInElementosById};
    }

    //atualiza elementosById
    elementosById[elementoClonado.id] = elementoClonado;

    //atualiza os clones
    let clonesByMarcacaoToUpdate = {...clonesByMarcacaoId[elementoClonado.marcacao.id]};

    if (!clonesByMarcacaoToUpdate.elementCount) {
        clonesByMarcacaoToUpdate.elementCount = [elementoClonado, elementoOriginal].length;
    } else {
        clonesByMarcacaoToUpdate.elementCount = elementoClonado.marcacao.elementCount;
    }

    clonesByMarcacaoId[elementoClonado.marcacao.id] = clonesByMarcacaoToUpdate;

    //atualiza novo estado
    newState.clonesByMarcacaoId = clonesByMarcacaoId;
    newState.elementos = elementosDaRaiz;
    newState.elementosById = elementosById;

    return newState;
}

// utils

function prepareItems(items) {
    items.forEach(item => {
        prepareItem(item);
    });
    return items;
}

function prepareItem(item, parentItem) {
    item.parent = parentItem;
    if(item.children) {
        item.children.forEach(child => {
            prepareItem(child, item);
        });
    }
}

function populateElementosArray(elementosArray, items) {
    items.forEach(item => {
        elementosArray.push(item);
        if (item.children) {
            populateElementosArray(elementosArray, item.children);
        }
    });
}
