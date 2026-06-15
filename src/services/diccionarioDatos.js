import api from "../utils/axiosInstance"

//este servicio nos sirve para obtener el lsitao de dcicionario dedatos segun el parametro
//para hacer los combo box de manera que consulten directamente asi evitamos que cuando crean crear
//un nueva opcion se consulte directamente de este servicio

const fetchParam = (param) => {
    return api.get("/v1/hparking/param/values/ordered", { params: { param } });

}

//estado entidades
export const getEntityStatus = () => fetchParam("EntityStatus");
//Estado usuarios
export const getUserStatus = () => fetchParam("UserStatus");
//parking
export const getParkingTypes = () => fetchParam("ParkingType");
//********************* */
//operaciones sistema
export const getParkingSystemOperationTypes = () => fetchParam("ParkingSystemOperationType");
//roles usuarios de aplicacion
export const getAppUserAuthority = () => fetchParam("AppUserAuthority");
//GRUPO usuarios de sistemas
export const getSystemUserAuthority = () => fetchParam("SystemUserAuthority");


//******En caso de que fallen los metodos******* */
export const FALLBACKS = {
    getEntityStatus: [
        { "key": "ACTIVE" },
        { "label": "Activo" },
    ],
    getParkingTypes: [
        { "key": "SIMPLE", "label": "Simple" },
        { "key": "STRUCTURED", "label": "Estructurado" },
    ],
    getParkingSystemOperationTypes: [
        { "key": "CHECKOUT", "label": "Consultar Valor a Pagar" },
        { "key": "CHARGE", "label": "Notificar Pago" },
        { "key": "AVAILABILITY", "label": "Consultar Disponibilidad" },
    ],
    getParkingStatus: [
        {
            "order": 0,
            "key": "ACTIVE",
            "label": "Activo"
        },
        {
            "order": 1,
            "key": "INACTIVE",
            "label": "Inactivo"
        },
        {
            "order": 2,
            "key": "MAINTENANCE",
            "label": "Mantenimiento"
        }
    ],
    getStatusUser: [
        {"key": "ACTIVE", "label": "Activo"},
        {"key": "INACTIVE","label": "Inactivo"},
        {"key": "BANNED" , "label": "Banned"},       

    ],
    getAppUserAuthority: [
        {
            "order": 0,
            "key": "ROLE_CITIZEN",
            "label": "Ciudadano"
        },
        {
            "order": 1,
            "key": "ROLE_OPERATOR",
            "label": "Operador"
        },
        {
            "order": 2,
            "key": "ROLE_ADMIN",
            "label": "Administrador"
        }
    ],
    getSystemUserAuthority: [
        {
            "order": 0,
            "key": "SYSTEM_SPARK",
            "label": "Grupo Spark"
        },
        {
            "order": 1,
            "key": "SYSTEM_EMOV",
            "label": "Grupo EMOV"
        }
    ]

}

//Ayuda a mostrar la palabra para el usuario en base al key, si no se encuetra muestra la key en base al diciconario
export const labelFromKey = (opciones, key) => {
    const encontrado = opciones.find((opt) => opt.key === key);
    return encontrado ? encontrado.label : key;
};