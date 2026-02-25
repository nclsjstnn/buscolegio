// COD_DEPE → label
export const DEPENDENCIA: Record<number, string> = {
  1: 'Corporación Municipal',
  2: 'Municipal DAEM',
  3: 'Particular Subvencionado',
  4: 'Particular Pagado',
  5: 'Corporación Adm. Delegada',
  6: 'Servicio Local de Educación',
}

// COD_DEPE2 → label (grouped)
export const DEPENDENCIA2: Record<number, string> = {
  1: 'Municipal',
  2: 'Particular Subvencionado',
  3: 'Particular Pagado',
  4: 'Corp. Adm. Delegada',
  5: 'Servicio Local de Educación',
}

// COD_ENSE → label (Anexo II)
export const ENSEÑANZA: Record<number, string> = {
  0: 'No Aplica',
  10: 'Ed. Parvularia',
  110: 'Enseñanza Básica',
  160: 'Ed. Básica (Adultos)',
  163: 'Ed. Básica Adultos (CEBA)',
  165: 'Ed. Básica Especial/Diferencial',
  310: 'Ed. Media HC (Jóvenes)',
  360: 'Ed. Media HC (Adultos)',
  363: 'Ed. Media HC (Adultos)',
  410: 'Ed. Media TP (Jóvenes)',
  460: 'Ed. Media TP (Adultos)',
  463: 'Ed. Media TP (Adultos)',
  510: 'Ed. Media Artística (Jóvenes)',
  560: 'Ed. Especial/Diferencial',
  563: 'Ed. Especial (Media)',
  610: 'Ed. Básica (Adultos, D.584)',
  663: 'Ed. Media HC (Adultos, D.584)',
  715: 'Ed. Técnica de Nivel Superior',
}

// COD_ESPE → label (Anexo III — specialties técnico-profesionales)
export const ESPECIALIDAD: Record<number, string> = {
  0: 'Sin información',
  // Sector Administración y Comercio
  41001: 'Administración',
  41002: 'Contabilidad',
  41003: 'Secretariado',
  41004: 'Ventas',
  41005: 'Servicios de Administración Financiera',
  41006: 'Logística',
  41007: 'Marketing',
  // Sector Industrial
  52001: 'Mecánica Industrial',
  52002: 'Mecánica Automotriz',
  52003: 'Electricidad',
  52004: 'Electrónica',
  52005: 'Construcciones Metálicas',
  52006: 'Refrigeración y Climatización',
  52007: 'Mecánica de Maquinaria Pesada',
  52008: 'Operaciones Industriales',
  52009: 'Mecánica Automotriz y Motores',
  52010: 'Electricidad Industrial',
  52011: 'Electrónica (Industrial)',
  52012: 'Soldadura y Construcciones Metálicas',
  52013: 'Instalaciones Eléctricas',
  52014: 'Procesos Metalúrgicos',
  52015: 'Mecatrónica',
  // Sector Minero
  53001: 'Operación de Plantas de Procesos Mineros',
  53002: 'Perforación y Tronadura',
  53003: 'Topografía',
  53004: 'Geología',
  53014: 'Operaciones Mineras',
  53015: 'Procesos Mineros',
  // Sector Construcción
  54001: 'Construcción',
  54002: 'Edificación',
  54003: 'Instalaciones Sanitarias',
  // Sector Agropecuario
  61001: 'Agropecuario',
  61002: 'Agrícola',
  61003: 'Pecuario',
  61004: 'Fruticultura y Enología',
  61005: 'Procesamiento de Alimentos',
  // Sector Marítimo
  62001: 'Acuicultura',
  62002: 'Pesca Artesanal',
  62003: 'Náutica Pesquera',
  62004: 'Procesamiento de Productos del Mar',
  // Sector Alimentación
  63001: 'Gastronomía',
  63002: 'Servicios de Alimentación Colectiva',
  // Sector Forestal
  64001: 'Maderas',
  64002: 'Silvicultura',
  64003: 'Explotación Forestal',
  // Sector Gráfico
  65001: 'Dibujo Técnico y Digital',
  65002: 'Impresión',
  // Sector Química
  66001: 'Química Industrial',
  66002: 'Laboratorio Clínico',
  // Sector Telecomunicaciones
  67001: 'Telecomunicaciones',
  67002: 'Redes y Comunicaciones',
  // Sector Textil
  68001: 'Confección',
  68002: 'Vestuario',
  // Sector Turismo y Hotelería
  71001: 'Turismo',
  71002: 'Hotelería',
  71003: 'Gastronomía (Turismo)',
  // Sector Salud
  72001: 'Atención de Adultos Mayores',
  72002: 'Atención en Salud',
  72003: 'Servicios de Salud',
  72004: 'Auxiliar de Enfermería',
  72005: 'Dental',
  72006: 'Laboratorio Clínico',
  72007: 'Farmacia',
  // Sector Educación
  73001: 'Educación Diferencial',
  73002: 'Educación Parvularia',
  // Sector Diseño y Comunicación
  74001: 'Diseño Gráfico',
  74002: 'Comunicación Visual',
}

// ORI_RELIGIOSA → label
export const ORIENTACION_RELIGIOSA: Record<number, string> = {
  1: 'Laica',
  2: 'Católica',
  3: 'Evangélica',
  4: 'Musulmana',
  5: 'Judía',
  6: 'Budista',
  7: 'Otra',
  9: 'Sin información',
}

// ESTADO_ESTAB → label
export const ESTADO: Record<number, string> = {
  1: 'Funcionando',
  2: 'En receso',
  3: 'Cerrado',
  4: 'Autorizado sin matrícula',
}

// COD_REG_RBD → label
export const REGION: Record<number, string> = {
  1: 'Tarapacá',
  2: 'Antofagasta',
  3: 'Atacama',
  4: 'Coquimbo',
  5: 'Valparaíso',
  6: "O'Higgins",
  7: 'Maule',
  8: 'Biobío',
  9: 'La Araucanía',
  10: 'Los Lagos',
  11: 'Aysén',
  12: 'Magallanes',
  13: 'Metropolitana',
  14: 'Los Ríos',
  15: 'Arica y Parinacota',
  16: 'Ñuble',
}
