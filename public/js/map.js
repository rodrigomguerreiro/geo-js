const osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
}),

map = new L.Map('map', {
    center: new L.LatLng(-15.6605602, -56.1739732),
    zoom: 13
}),
featureGroup = L.featureGroup().addTo(map);
L.control.layers({
    'osm': osm.addTo(map),
    "google": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
        attribution: 'google'
    })
}, {
    'drawlayer': featureGroup,
}, {
    position: 'topleft',
    collapsed: false
}).addTo(map); 

 
//PT-BR
L.drawLocal = {
     format: {
         numeric: {
             delimiters: {
                 thousands: '.',
                 decimal: ','
             }
         }
     },
    draw: {
        toolbar: {
            actions: {
                title: 'Cancelar desenho',
                text: 'Cancelar'
            },
            finish: {
                title: 'Finalizar desenho',
                text: 'Finalizar'
            },
            undo: {
                title: 'Apagar último ponto desenhado',
                text: 'Apagar o último ponto'
            },
            buttons: {
                polyline: 'Desenhar Linha',
                polygon: 'Desenhar Polígono',
                rectangle: 'Desenhar Retangulo',
                circle: 'Desenhar Circulo',
                marker: 'Desenhar Marcador',
                //circlemarker: 'Draw a circlemarker'
            }
        },
        handlers: {
            circle: {
                tooltip: {
                    start: 'Clique e arraste para desenhar o círculo.'
                },
                radius: 'Radius'
            },
            circlemarker: {
                tooltip: {
                    start: 'Clique no mapa para colocar o marcador do círculo.'
                }
            },
            marker: {
                tooltip: {
                    start: 'Clique no mapa para colocar o marcador.'
                }
            },
            polygon: {
                tooltip: {
                    start: 'Clique para começar a desenhar a forma.',
                    cont: 'Clique para continuar desenhando a forma.',
                    end: 'Clique no primeiro ponto para fechar esta forma.'
                }
            },
            polyline: {
                error: '<strong>Erro:</strong> bordas da forma não podem cruzar!',
                tooltip: {
                    start: 'Clique para começar a desenhar a linha.',
                    cont: 'Clique para continuar desenhando a linha.',
                    end: 'Clique no último ponto para terminar a linha.'
                }
            },
            rectangle: {
                tooltip: {
                    start: 'Clique e arraste para desenhar um retângulo.'
                }
            },
            simpleshape: {
                tooltip: {
                    end: 'Solte o mouse para terminar de desenhar.'
                }
            }
        }
    },
    edit: {
        toolbar: {
            actions: {
                save: {
                    title: 'Salvar alterações.',
                    text: 'Salvar'
                },
                cancel: {
                    title: 'Cancelar edição, descartar todas alterações.',
                    text: 'Cancelar'
                },
                clearAll:{
                    title: 'Limpar todas as camadas.',
                    text: 'Limpar tudo.'
                }
            },
            buttons: {
                edit: 'Editar camadas.',
                editDisabled: 'Não há camadas para editar.',
                remove: 'Apagar camadas.',
                removeDisabled: 'Não há camadas para apagar.'
            }
        },
        handlers: {
            edit: {
                tooltip: {
                    text: 'Arraste os vétices ou o marcador para editar o recurso.',
                    subtext: 'Clique em cancelar para desfazer as alterações.'
                }
            },
            remove: {
                tooltip: {
                    text: 'Clique em um recurso para remover'
                }
            }
        }
    }
};

const drawControl = new L.Control.Draw({
    draw: {
        polygon: {
            shapeOptions: {
                color: '#7251C2'
            },
        },
        polyline: {
            shapeOptions: {
                color: '#7251C2'
            },
        },
        rectangle: {
            shapeOptions: {
                color: '#7251C2'
            },
        },
        circle: {
            shapeOptions: {
                color: '#7251C2'
            },
        },
    },
    
    edit: {
        featureGroup: featureGroup
    }
}).addTo(map);

L.control.scale().addTo(map);

//Evento de criação dos desenhos no mapa
let type = '';
let areaPolygon = 0;
let areaRectangle = 0;
let areaPolyline = 0;
map.on('draw:created', (e) => {
    // sempre que for criado um desenho, é adicionado na coleção featureGroup 
    var content = `<span><b>Nome:</b></span><br/>
                    <input style="border-width: thin;" id="name" type="text"/><br/>
                    <span><b>Descrição<b/></span><br/>
                    <textarea style="border-width: thin;" id="description" cols="25" rows="5"></textarea><br/>
                    <br/><input type="button" id="okBtn" value="Salvar" onclick="saveNew()"/>`;
    
    switch(e.layerType){
        case 'rectangle':
        //console.log(new Intl.NumberFormat('pt').format(L.GeometryUtil.geodesicArea(e.layer.getLatLngs()[0])));
        areaRectangle = new Intl.NumberFormat('pt').format(L.GeometryUtil.geodesicArea(e.layer.getLatLngs()[0]));
        featureGroup.addLayer(e.layer).bindPopup(content);
        break;
    case 'polygon':
        //console.log(new Intl.NumberFormat('pt').format(L.GeometryUtil.geodesicArea(e.layer.getLatLngs()[0])));
        areaPolygon = new Intl.NumberFormat('pt').format(L.GeometryUtil.geodesicArea(e.layer.getLatLngs()[0]));
        featureGroup.addLayer(e.layer).bindPopup(content);
    break;
    case 'polyline':
        //console.log(new Intl.NumberFormat('pt').format(L.GeometryUtil.geodesicArea(e.layer.getLatLngs())));
        areaPolyline =  new Intl.NumberFormat('pt').format(L.GeometryUtil.geodesicArea(e.layer.getLatLngs()));
        featureGroup.addLayer(e.layer).bindPopup(content);
        break;
    default:
        area = null;
        featureGroup.addLayer(e.layer).bindPopup(content);
    }
            
    //featureGroup.addLayer(e.layer).bindPopup(content);
    type = e.layerType;
    
}); 

const newFeature = [];
saveNew = () => {
var name = document.getElementById('name').value;
var desc = document.getElementById('description').value;

if(!name) {
    alert();
}

var drawings = featureGroup.getLayers();  //Cointeiner de objetos desenhados
drawings[drawings.length - 1].title = name;
drawings[drawings.length - 1].content = desc;
drawings[drawings.length - 1].type = type;             
drawings[drawings.length - 1].area = null;


//Aplica valor atributo area(generalizado)
switch(drawings[drawings.length - 1].type){
    case 'rectangle':
        drawings[drawings.length - 1].area = areaRectangle;
        newFeature.push(drawings);
        break;
    case 'polygon':
        drawings[drawings.length - 1].area = areaPolygon;
        newFeature.push(drawings);
    break;
    case 'polyline':
        drawings[drawings.length - 1].area = areaPolyline;
        newFeature.push(drawings);
        break;
    default:
        area = null;
        newFeature.push(drawings);
    }

    //newFeature.push(drawings);
    if (drawings) {
        map.closePopup();
    }
}

// on click, clear all layers
document.getElementById('delete').onclick = (e) => {
    featureGroup.clearLayers();
}
    let talhao = '';
document.getElementById('salvar_talhao').onclick = (e) => {
     talhao = document.getElementById('nometalhao').value;
     $('#cadTalhao').modal('hide')
    console.log(talhao);
}

document.getElementById('save').onclick = (e) => {
    // GeoJson
    const data = featureGroup.toGeoJSON();

    //Novo container de desenhos
    const data1 = newFeature.pop();

    if(!data1) {
        alert('Defina um nome para o desenho');
        return;
    }
    
    const mappedData = data1.map(feature => {                
        return tmp = {
            Type: talhao,
            id: feature._leaflet_id,
            area: feature.area || feature._mRadius || null,
            geometryType: feature.type,
            title: feature.title,
            content: feature.content,
            coords: feature._latlngs || feature._latlng

        };
    });

    console.log(mappedData)
    //console.log(JSON.stringify(mappedData))


    // GeoJson para string
    //const convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
    //console.log(convertedData);
    return false;

    // Exportar o Geojson
    //document.getElementById('save').setAttribute('href', 'data:' + convertedData);
    //document.getElementById('save').setAttribute('download','data.geojson');
}


/* sidebar */
(function (window, undefined) {
    'use strict';
    var sideMenu = function (el) {
        var htmlSideMenu = el, htmlSideMenuPinTrigger = {}, htmlSideMenuPinTriggerImage = {}, htmlOverlay = {};
        var init = function () {
            htmlSideMenuPinTrigger = el.querySelector('.wui-side-menu-pin-trigger');
            htmlSideMenuPinTriggerImage = htmlSideMenuPinTrigger.querySelector('i.fa');
            htmlOverlay = document.querySelector('.wui-overlay');
            Array.prototype.forEach.call(document.querySelectorAll('.wui-side-menu-trigger'), function (elmt, i) {
                elmt.addEventListener('click', function (e) {
                    e.preventDefault();
                    toggleMenuState();
                }, false);
            });
            htmlSideMenuPinTrigger.addEventListener('click', function (e) {
                e.preventDefault();
                toggleMenuPinState();
            }, false);
            htmlOverlay.addEventListener("click", function (e) {
                htmlSideMenu.classList.remove('open');
            }, false);
            window.addEventListener("resize", checkIfNeedToCloseMenu, false);
            checkIfNeedToCloseMenu();
        };
        var toggleMenuState = function () {
            htmlSideMenu.classList.toggle('open');
            menuStateChanged(htmlSideMenu, htmlSideMenu.classList.contains('open'));
        };
        var toggleMenuPinState = function () {
            htmlSideMenu.classList.toggle('pinned');
            htmlSideMenuPinTriggerImage.classList.toggle('fa-rotate-90');
            if (htmlSideMenu.classList.contains('pinned') !== true) {
                htmlSideMenu.classList.remove('open');
            }
            menuPinStateChanged(htmlSideMenu, htmlSideMenu.classList.contains('pinned'));
        };
        var checkIfNeedToCloseMenu = function () {
            var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            if (width <= 767 && htmlSideMenu.classList.contains('open') === true) {
                htmlSideMenu.classList.remove('open');
                menuStateChanged(htmlSideMenu, htmlSideMenu.classList.contains('open'));
            }
            if (width > 767 && htmlSideMenu.classList.contains('pinned') === false) {
                htmlSideMenu.classList.remove('open');
                menuStateChanged(htmlSideMenu, htmlSideMenu.classList.contains('open'));
            }
        };
        var menuStateChanged = function (element, state) {
            var evt = new CustomEvent('menuStateChanged', { detail: { open: state} });
            element.dispatchEvent(evt);
        };
        var menuPinStateChanged = function (element, state) {
            var evt = new CustomEvent('menuPinStateChanged', { detail: { pinned: state} });
            element.dispatchEvent(evt);
        };
        init();
        return {
            htmlElement: htmlSideMenu,
            toggleMenuState: toggleMenuState,
            toggleMenuPinState: toggleMenuPinState
        };
    };
    
    window.SideMenu = sideMenu;
})(window);


var documentReady = function (fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

documentReady(function() {
  var sample = new SideMenu(document.querySelector('.wui-side-menu'))
  
});


map.on('load', () => {
    map.setView(

        L.polygon([
            [-15.641650930343621, -56.19008803681937],
            [-15.648262991930533, -56.15300917939749],
            [-15.664461639365355, -56.151979211135775],
            [-15.677684073086075, -56.17395186738577],
            [-15.681650636238848, -56.19832778291312],
            [-15.651073053388778, -56.195237878127955],
        ]).addTo(map)
    );
})