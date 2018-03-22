'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.autosReducer = autosReducer;

var _reduxUtils = require('../core-utils/redux-utils');

var ReduxUtils = _interopRequireWildcard(_reduxUtils);

var _actions = require('../actions');

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var _fileUtils = require('../core-utils/file-utils');

var _stringUtils = require('../core-utils/string-utils');

var stringUtils = _interopRequireWildcard(_stringUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const ActionsSuffix = ReduxUtils.ActionsSuffix;
function autosReducer(state, action) {
    if (state === undefined) {
        state = stateDefault();
    }
    switch (action.type) {
        case _actions.Actions.AUTOS_CLEAR_STATE:
            return stateDefault();

        case _actions.Actions.AUTOS_SET_PECAS:
            return setPecas(action, state);

        case _actions.Actions.AUTOS_ADD_PECA:
            return addPeca(action, state);

        case _actions.Actions.AUTOS_SELECT_PECA:
            return selectPeca(action, state);

        case _actions.Actions.AUTOS_SELECT_PECA_PAGINA:
            return selectPecaPagina(action, state);

        case _actions.Actions.AUTOS_SET_PECA_PDF_URL:
            return setPecaPdfUrl(action, state);

        case _actions.Actions.AUTOS_FETCH_PECA_CONTEUDO_HTML + ActionsSuffix.SUCCESS:
            return fetchPecaConteudoHtmlSuccess(action, state);

        case _actions.Actions.AUTOS_DELETE_MARCACAO:
            return deleteMarcacao(action, state);

        case _actions.Actions.AUTOS_CREATE_MARCACAO + ActionsSuffix.SUCCESS:
            return createMarcacaoSuccess(action, state);

        case _actions.Actions.AUTOS_SELECT_MARCACAO:
            return selectMarcacao(action, state);

        case _actions.Actions.AUTOS_FETCH_MOVIMENTACOES + ActionsSuffix.SUCCESS:
            return fetchMovimentacoes(action, state);

        case _actions.Actions.AUTOS_REMOVE_PECA:
            return removePeca(action, state);

        case _actions.Actions.AUTOS_SELECT_FIRST_PECA:
            return selectFirstPeca(action, state);

        case _actions.Actions.AUTOS_SET_MARCACAO_SELECIONADA:
            return setMarcacaoSelecionada(action, state);

        case _actions.Actions.AUTOS_SCROLL_TO_MARCACAO:
            return scrollToMarcacao(action, state);

        case _actions.Actions.AUTOS_ACCEPT_MARCACAO + ActionsSuffix.SUCCESS:
            return acceptMarcacaoSuccess(action, state);

        case _actions.Actions.AUTOS_REJECT_MARCACAO + ActionsSuffix.SUCCESS:
            return rejectMarcacaoSuccess(action, state);

        case _actions.Actions.AUTOS_START_LINK:
            return startLink(action, state);

        case _actions.Actions.AUTOS_CANCEL_LINK:
            return cancelLink(action, state);

        case _actions.Actions.AUTOS_CONCLUIR_LINK + ActionsSuffix.SUCCESS:
            return concluirLinkSuccess(action, state);

        case _actions.Actions.AUTOS_ADD_PAGINA_TO_LINK:
            return addPaginaToLink(action, state);

        case _actions.Actions.AUTOS_GO_LINK + ActionsSuffix.SUCCESS:
            return goLinkSuccess(action, state);

        case _actions.Actions.AUTOS_CLOSE_LINK_BAR:
            return closeLinkBar(action, state);

        case _actions.Actions.AUTOS_BACK_TO_LINK_SUCCESS:
            return backToLinkSuccess(action, state);

        case _actions.Actions.AUTOS_CLEAR_ACTIVE_LINK_TO_SCROLL:
            return clearActiveLinkToScroll(action, state);

        case _actions.Actions.AUTOS_ZOOM_IN:
            return zoomIn(state);

        case _actions.Actions.AUTOS_ZOOM_OUT:
            return zoomOut(state);

        case _actions.Actions.AUTOS_ACTIVE_PAGE:
            return activePage(action, state);

        case _actions.Actions.AUTOS_START_PECA_EDIT:
            return startPecaEdit(action, state);

        case _actions.Actions.AUTOS_SAVE_PECA + ActionsSuffix.SUCCESS:
            return savePecaSuccess(action, state);

        case _actions.Actions.AUTOS_DELETE_LINK_SUCCESS:
            return deleteLinkSuccess(action, state);

        case _actions.Actions.AUTOS_CREATE_PECA_AVULSA + ActionsSuffix.SUCCESS:
            return createPecaAvulsaSuccess(action, state);

        case _actions.Actions.AUTOS_UPDATE_PECA_AVULSA:
            return updatePecaAvulsa(action, state);

        default:
            return state;
    }
}

function stateDefault() {
    return {
        isFetching: false,
        pecas: [],
        pecasById: {},
        pecaSelecionada: {},
        navContracted: false,
        error: undefined,
        movimentacoes: [],
        pecaConteudo: {
            mimeType: null,
            conteudo: null
        },
        marcacaoSelecionada: null,
        marcacaoScroll: null,
        linkEmConstrucao: null,
        numeroPaginaSelecionada: 1,
        zoom: 1,
        activePage: 1,
        activeLink: null,
        activeLinkPecaId: null,
        pecaEditingId: null,
        pecaAvulsa: null
    };
}

function setPecas(action, state) {
    const pecas = [...action.pecas];
    const pecasById = getElementosById(pecas);
    return _extends({}, state, {
        pecas: pecas,
        pecasById: pecasById
    });
}

function addPeca(action, state) {
    const pecas = [...state.pecas];
    pecas.push(action.peca);
    const pecasById = _extends({}, state.pecasById);
    pecasById[action.peca.id] = action.peca;
    return _extends({}, state, {
        pecas: pecas,
        pecasById: pecasById
    });
}

function selectPeca(action, state) {
    const peca = state.pecasById[action.pecaId];
    return _extends({}, state, {
        pecaSelecionada: _extends({}, peca),
        numeroPaginaSelecionada: 1
    });
}

function selectPecaPagina(action, state) {
    const peca = state.pecasById[action.pecaId];
    return _extends({}, state, {
        pecaSelecionada: _extends({}, peca),
        numeroPaginaSelecionada: action.numeroPagina,
        activePage: action.numeroPagina
    });
}

function setPecaPdfUrl(action, state) {
    let peca = state.pecasById[action.pecaId];
    peca = _extends({}, peca);
    if (peca.mimeType === _fileUtils.PecaMimeType.PDF) {
        let url = _constants2.default.BACKEND + '/service/processo/:processoId/peca/:pecaId/pdf';
        url = url.replace(':processoId', action.processoId).replace(':pecaId', peca.id);
        peca.url = url;
    }
    return _extends({}, state, {
        pecaSelecionada: peca
    });
}

function fetchPecaConteudoHtmlSuccess(action, state) {
    const pecasById = _extends({}, state.pecasById);
    let pecaSelecionada = pecasById[action.pecaId];
    const index = state.pecas.indexOf(pecaSelecionada);
    pecaSelecionada = _extends({}, pecaSelecionada);
    pecaSelecionada.conteudo = action.data;
    const pecas = [...state.pecas];
    pecas[index] = pecaSelecionada;
    pecasById[action.pecaId] = pecaSelecionada;
    return _extends({}, state, {
        pecas: pecas,
        pecasById: pecasById,
        pecaSelecionada: pecaSelecionada
    });
}

function deleteMarcacao(action, state) {
    let newState = _extends({}, state);
    let pecas = ReduxUtils.cloneProperty(newState, 'pecas');
    let peca = ReduxUtils.cloneItemArrayById(pecas, action.pecaId);
    let marcacoes = ReduxUtils.cloneProperty(peca, 'marcacoes');
    ReduxUtils.deleteItemArrayById(marcacoes, action.marcacaoId);
    let pecaSelecionada = ReduxUtils.cloneProperty(newState, 'pecaSelecionada');
    if (pecaSelecionada.id === peca.id) {
        pecaSelecionada.marcacoes = marcacoes;
    }
    let pecasById = ReduxUtils.cloneProperty(newState, 'pecasById');
    pecasById[action.pecaId] = peca;
    return newState;
}

function createMarcacaoSuccess(action, state) {
    let newState = _extends({}, state);
    const marcacao = action.data.marcacao;

    let pecaSelecionada = ReduxUtils.cloneProperty(newState, 'pecaSelecionada');
    let marcacoes = ReduxUtils.cloneProperty(pecaSelecionada, 'marcacoes');
    marcacoes.push(marcacao);
    pecaSelecionada.marcacoes = marcacoes;
    newState.marcacaoSelecionada = marcacao;
    newState.pecaSelecionada = pecaSelecionada;

    let pecas = ReduxUtils.cloneProperty(newState, 'pecas');
    let peca = ReduxUtils.cloneItemArrayById(pecas, action.data.peca.id);
    const index = pecas.indexOf(peca);
    pecas[index] = pecaSelecionada;

    newState.pecas = pecas;

    let pecasById = ReduxUtils.cloneProperty(newState, 'pecasById');
    pecasById[action.data.peca.id] = pecaSelecionada;

    newState.pecasById = pecasById;

    return newState;
}

function selectMarcacao(action, state) {
    const marcacoes = state.pecaSelecionada.marcacoes;
    const marcacaoSelecionada = ReduxUtils.findItemById(marcacoes, action.marcacaoId);
    return _extends({}, state, {
        marcacaoSelecionada: marcacaoSelecionada
    });
}

function fetchMovimentacoes(action, state) {
    return _extends({}, state, {
        movimentacoes: action.data
    });
}

function removePeca(action, state) {
    const peca = ReduxUtils.findItemById(state.pecas, action.pecaId);
    const indexPeca = state.pecas.indexOf(peca);
    const pecas = [...state.pecas];
    pecas.splice(indexPeca, 1);
    return _extends({}, state, {
        pecas: pecas
    });
}

function selectFirstPeca(action, state) {
    const peca = _extends({}, state.pecas[0]);
    return _extends({}, state, {
        pecaSelecionada: peca
    });
}

function setMarcacaoSelecionada(action, state) {
    const pecaSelecionada = state.pecaSelecionada;
    const marcacaoSelecionada = ReduxUtils.findItemById(pecaSelecionada.marcacoes, action.marcacaoId);
    return _extends({}, state, {
        marcacaoSelecionada: marcacaoSelecionada
    });
}

function scrollToMarcacao(action, state) {
    const pecaSelecionada = state.pecaSelecionada;
    const marcacaoScroll = ReduxUtils.findItemById(pecaSelecionada.marcacoes, action.marcacaoId);
    return _extends({}, state, {
        marcacaoScroll: marcacaoScroll
    });
}

function acceptMarcacaoSuccess(action, state) {
    let marcacaoId = action.marcacaoId,
        pecaId = action.pecaId;


    let newState = _extends({}, state);
    let pecas = ReduxUtils.cloneProperty(newState, 'pecas');
    let peca = ReduxUtils.cloneItemArrayById(pecas, pecaId);
    let marcacoes = ReduxUtils.cloneProperty(peca, 'marcacoes');
    let marcacao = ReduxUtils.cloneItemArrayById(marcacoes, marcacaoId);
    marcacao.sugerida = false;

    peca.marcacoes = marcacoes;
    newState.pecaSelecionada = peca;
    let pecasById = ReduxUtils.cloneProperty(newState, 'pecasById');
    pecasById[action.pecaId] = peca;
    return newState;
}

function rejectMarcacaoSuccess(action, state) {
    let marcacaoId = action.marcacaoId,
        pecaId = action.pecaId;


    let newState = _extends({}, state);
    let pecas = ReduxUtils.cloneProperty(newState, 'pecas');
    let peca = ReduxUtils.cloneItemArrayById(pecas, pecaId);
    let marcacoes = ReduxUtils.cloneProperty(peca, 'marcacoes');
    ReduxUtils.deleteItemArrayById(marcacoes, marcacaoId);

    peca.marcacoes = marcacoes;
    newState.pecaSelecionada = peca;
    let pecasById = ReduxUtils.cloneProperty(newState, 'pecasById');
    pecasById[action.pecaId] = peca;

    newState.marcacaoSelecionada = null;

    return newState;
}

function startLink(action, state) {
    const linkEmConstrucao = {
        pecaId: state.pecaSelecionada.id,
        selecao: action.selecao,
        totalAlvos: 0
    };
    return _extends({}, state, {
        linkEmConstrucao: linkEmConstrucao
    });
}

function cancelLink(action, state) {
    removePaginasEmConstrucao(state);
    const pecas = [...state.pecas];
    return _extends({}, state, {
        linkEmConstrucao: null,
        pecas: pecas
    });
}

function concluirLinkSuccess(action, state) {
    const linkEmConstrucao = state.linkEmConstrucao;
    const pecaId = linkEmConstrucao.pecaId;
    const peca = state.pecasById[pecaId];
    const link = action.data;
    peca.links.push(link);
    confirmPaginasEmConstrucao(state);
    const pecas = [...state.pecas];
    return _extends({}, state, {
        linkEmConstrucao: null,
        activeLinkToScroll: link,
        pecas: pecas
    });
}

function addPaginaToLink(action, state) {
    const linkEmConstrucao = _extends({}, state.linkEmConstrucao);
    const pecaSelecionada = _extends({}, state.pecaSelecionada);
    if (!pecaSelecionada.paginasAlvo) {
        pecaSelecionada.paginasAlvo = {};
    } else {
        pecaSelecionada.paginasAlvo = _extends({}, pecaSelecionada.paginasAlvo);
    }

    if (pecaSelecionada.paginasAlvo[action.numero]) {
        pecaSelecionada.paginasAlvo[action.numero].emConstrucao = true;
    } else {
        const descricao = stringUtils.upperFirst(linkEmConstrucao.selecao.conteudo);
        pecaSelecionada.paginasAlvo[action.numero] = {
            descricao: descricao,
            emConstrucao: true
        };
    }

    const index = getIndexPecaSelecionada(state);
    const pecas = [...state.pecas];
    pecas[index] = pecaSelecionada;
    const pecasById = getElementosById(pecas);

    linkEmConstrucao.totalAlvos++;

    return _extends({}, state, {
        linkEmConstrucao: linkEmConstrucao,
        pecaSelecionada: pecaSelecionada,
        pecas: pecas,
        pecasById: pecasById
    });
}

function goLinkSuccess(action, state) {
    const link = action.link;

    const firstAlvo = link.alvos[0];
    addPaginaInicialToAlvos(state, link.alvos);
    return _extends({}, state, {
        activeLink: link,
        activeLinkPecaId: action.pecaId,
        numeroPaginaSelecionada: firstAlvo.pagina,
        activePage: firstAlvo.pagina
    });
}

function closeLinkBar(action, state) {
    return _extends({}, state, {
        activeLink: null,
        activeLinkPecaId: null
    });
}

function backToLinkSuccess(action, state) {
    const pecaId = state.activeLinkPecaId;
    const pecasById = _extends({}, state.pecasById);
    const pecaSelecionada = _extends({}, pecasById[pecaId]);

    return _extends({}, state, {
        activeLink: null,
        activeLinkToScroll: state.activeLink,
        activeLinkPecaId: null,
        pecaSelecionada: pecaSelecionada
    });
}

function clearActiveLinkToScroll(action, state) {
    return _extends({}, state, {
        activeLinkToScroll: null
    });
}

function zoomIn(state) {
    let zoom = state.zoom += 0.1;
    zoom = zoom < 5 ? zoom : 5;
    return _extends({}, state, {
        zoom: zoom
    });
}

function zoomOut(state) {
    let zoom = state.zoom -= 0.1;
    zoom = zoom > 0.2 ? zoom : 0.2;
    return _extends({}, state, {
        zoom: zoom
    });
}

function activePage(action, state) {
    return _extends({}, state, {
        activePage: action.page
    });
}

function startPecaEdit(action, state) {
    return _extends({}, state, {
        pecaEditingId: action.pecaId
    });
}

function savePecaSuccess(action, state) {
    const pecaEdited = findPecaById(state, state.pecaEditingId);
    pecaEdited.descricao = action.descricao;
    const pecas = [...state.pecas];
    const index = pecas.indexOf(pecaEdited);
    pecas[index] = _extends({}, pecaEdited);
    const pecasById = getElementosById(pecas);
    return _extends({}, state, {
        pecaEditingId: null,
        pecas: pecas,
        pecasById: pecasById
    });
}

function deleteLinkSuccess(action, state) {
    const pecasAlvosDeletados = deletePaginaAlvo(action, state);
    const pecasLinksDeletados = deletePecaLink(pecasAlvosDeletados, state);

    return _extends({}, state, {
        'pecas': pecasLinksDeletados,
        'pecasById': getElementosById(pecasLinksDeletados),
        activeLink: null
    });
}

function createPecaAvulsaSuccess(action, state) {
    const pecaAvulsa = action.pecaAvulsa;
    const peca = {
        id: action.pecaAvulsa.id,
        descricao: 'Peca em Elaboração',
        polo: 'JUIZ',
        principal: true,
        data: Date.now(),
        marcacoes: []
    };
    const pecas = [...state.pecas];
    pecas.push(peca);
    return _extends({}, state, {
        pecaAvulsa: pecaAvulsa,
        pecas: pecas
    });
}

function updatePecaAvulsa(action, state) {
    const pecaAvulsa = action.pecaAvulsa;
    return _extends({}, state, {
        pecaAvulsa: pecaAvulsa
    });
}

function deletePaginaAlvo(action, state) {
    const alvosIdToDelete = action.data;
    const pecas = [];

    for (const peca of state.pecas) {
        let pecaAlterada = false;

        for (const pagina in peca.paginasAlvo) {
            const alvo = peca.paginasAlvo[pagina];

            if (alvosIdToDelete.includes(alvo.id)) {
                delete peca.paginasAlvo[pagina];
                pecaAlterada = true;
            }
        }

        if (pecaAlterada) {
            let pecaClone = _extends({}, peca);
            pecas.push(pecaClone);
        } else {
            pecas.push(peca);
        }
    }
    return pecas;
}

function deletePecaLink(pecas, state) {
    const peca = pecas.find(p => p.id === state.activeLinkPecaId);

    for (let i = 0; i < peca.links.length; i++) {
        const link = peca.links[i];

        if (link.id === state.activeLink.id) {
            peca.links.splice(i, 1);
        }
    }

    return pecas;
}

// uteis ====================

function getElementosById(elementos) {
    let elementosById = {};
    for (let i = 0; i < elementos.length; i++) {
        let elemento = elementos[i];
        elementosById[elemento.id] = elemento;
    }
    return elementosById;
}

function getIndexPecaSelecionada(state) {
    const pecaSelecionadaId = state.pecaSelecionada.id;
    for (let i = 0; i < state.pecas.length; i++) {
        if (state.pecas[i].id === pecaSelecionadaId) {
            return i;
        }
    }
    throw {
        type: 'ERROR',
        title: 'Não existe peça selecionada'
    };
}

function removePaginasEmConstrucao(state) {
    for (let i = 0; i < state.pecas.length; i++) {
        const peca = state.pecas[i];
        if (!peca.paginasAlvo) {
            continue;
        }
        for (const numero in peca.paginasAlvo) {
            const pagina = peca.paginasAlvo[numero];
            if (pagina.emConstrucao) {
                if (pagina.id) {
                    delete pagina.emConstrucao;
                } else {
                    delete peca.paginasAlvo[numero];
                }
            }
        }
    }
}

function confirmPaginasEmConstrucao(state) {
    for (let i = 0; i < state.pecas.length; i++) {
        const peca = state.pecas[i];
        if (!peca.paginasAlvo) {
            continue;
        }
        for (const numero in peca.paginasAlvo) {
            const pagina = peca.paginasAlvo[numero];
            if (pagina.emConstrucao) {
                pagina.emConstrucao = false;
                delete pagina.emConstrucao;
            }
        }
    }
}

function addPaginaInicialToAlvos(state, alvos) {
    const pecasById = state.pecasById;
    alvos.forEach(item => {
        item.paginaInicial = pecasById[item.pecaId].paginaInicial;
    });
}

function findPecaById(state, pecaId) {
    for (let i = 0; i < state.pecas.length; i++) {
        const peca = state.pecas[i];
        if (peca.id === pecaId) {
            return peca;
        }
    }
    return null;
}