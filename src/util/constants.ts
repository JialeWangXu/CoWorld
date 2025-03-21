export const CANDIDATE =0;
export const COMPANY = 1;
export const OPERATOR = 2;

export const MENTAL = 'mental';
export const FISICA = 'fisica';
export const AUDITIVA = 'auditiva';
export const INTELECTUAL = 'intelectual';
export const HABLAR = 'hablar';
export const PLURIDISCAPACIDAD = 'pluridiscapacidad';
export const VISUAL = 'visual';

export const JobFiltersOPTIONS ={
    city:["A Coruña","Álava","Albacete","Alicante","Almería","Asturias","Ávila","Badajoz","Barcelona","Burgos",
        "Cáceres","Cádiz","Cantabria","Castellón","Ceuta","Ciudad Real","Córdoba","Cuenca","Girona","Granada","Guadalajara",
        "Guipúzcoa","Huelva","Huesca","Islas Baleares","Jaén","La Rioja","Las Palmas","León","Lleida","Lugo","Madrid","Málaga","Melilla","Murcia",
        "Navarra","Ourense","Palencia","Pontevedra","Salamanca","Santa Cruz de Tenerife","Segovia","Sevilla","Tarragona",
        "Teruel","Toledo","Valencia","Valladolid","Vizcaya","Zamora","Zaragoza"],
    disabilities:[MENTAL,FISICA,AUDITIVA,INTELECTUAL,HABLAR,PLURIDISCAPACIDAD,VISUAL],
    mode:["Presencial","Híbrido","Remoto"],
    workHours:["Completa","Parcial - Mañana","Parcial - Tarde","Parcial - Noche"],
    workCategory:["Administración de empresas","Atención a clientes","Calidad, producción e I+D",
        "Compras, logística y almacén","Educación y formación","Informática y telecomunicaciones",
        "Ingenieros y técnicos","Inmobiliario y construcción","Profesiones, artes y oficios",
        "Sanidad y salud","Sector Farmacéutico","Turismo y restauración","Ventas al detalle","Otros"],
    experience:["No requerido","1 - 3 años","4 - 6 años","7 - 9 años","10 - 10+ años"],
    minumumEducation:["Sin estudios","Educación Secundaria Obligatoria","Bachillerato","Ciclo Formativo Grado Medio",
        "Ciclo Formativo Grado Superior","Enseñanzas artísticas (regladas)","Enseñanzas deportivas (regladas)",
        "Grado","Licenciatura","Diplomatura","Ingeniería Técnica","Ingeniería Superior","Postgrado","Máster"
        ,"Doctorado","Otros títulos, certificaciones y carnés","Otros cursos y formación no reglada",
        "Formación Profesional Grado Medio","Formación Profesional Grado Superior"]
    }

    export const DISABILITIES_INITIAL_VALUE= [{type:FISICA,degree:-1},
        {type:AUDITIVA,degree:-1},
        {type:VISUAL,degree:-1},
        {type:HABLAR,degree:-1},
        {type:MENTAL,degree:-1},
        {type:INTELECTUAL,degree:-1},
        {type:PLURIDISCAPACIDAD,degree:-1}]