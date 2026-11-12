# Speech de presentación: Roberto Puma, Desarrollador ABAP Senior

> Para leer en voz alta. Cada bloque tiene una **palabra ancla**: si te acuerdas de las anclas, te acuerdas del discurso.

```
 TRAYECTORIA ──► ESPECIALIDAD ──► VOLUMEN ──► MODERNO ──► EQUIPO ──► CIERRE
  (quién soy)    (integración)   (procesos)   (RAP/CDS)   (cómo trabajo) (qué aporto)
```

---

## 1. Versión corta (30 segundos)

> Para "preséntate brevemente" o el inicio de una llamada.

"Soy Roberto Puma, desarrollador ABAP senior con más de quince años de experiencia en proyectos SAP, desde R/3 y ECC hasta S/4HANA. Me he especializado en integraciones, sobre todo servicios OData, IDocs y web services, y en procesos de alto volumen. En los últimos años he trabajado en implantaciones de S/4HANA para energía y sector público, y estoy certificado en ABAP Cloud, con práctica propia en RAP. Lo que más me gusta es coger un proceso complejo y convertirlo en algo fiable y fácil de mantener."

---

## 2. Versión completa (2 minutos)

### ⚓ TRAYECTORIA

"Empecé con ABAP en 2007 y llevo más de quince años trabajando en SAP. Pasé casi nueve años en Globant, en Buenos Aires, y desde 2018 trabajo en Madrid, primero en Inetum, después en Viewnext y ahora de nuevo en Inetum. He trabajado en energía, industria, sector público y servicios, y he tocado prácticamente todos los módulos: FI, CO, SD, MM, PM, activos fijos y FI-CA."

### ⚓ ESPECIALIDAD: integración

"Si tuviera que quedarme con una especialidad, sería la integración: conseguir que SAP hable con otros sistemas. En mi último proyecto, la implantación de S/4HANA en Naturgy Nedgia, desarrollé servicios OData para que las apps móviles registraran directamente en SAP las entradas de mercancía, las solicitudes de pedido con adjuntos y el mantenimiento de equipos en campo. Usé deep insert multinivel sobre CDS jerárquicos y function imports. Antes, en las multas de tráfico del Ayuntamiento de Madrid, hice los web services SOAP con PO: uno para recibir los boletines y otro para publicarlos en el BOE. Y con IDocs llevo trabajando desde mis primeros años."

### ⚓ VOLUMEN: procesos masivos

"Otro punto fuerte son los procesos de alto volumen. Para la Comunidad de Madrid diseñé el cambio de estructura de activos fijos con una arquitectura en tres capas, procesamiento paralelo y balanceo entre servidores. Una tarea manual que llevaba semanas pasó a ser un proceso masivo, fiable y auditable. También he refactorizado procesos de 40.000 y 60.000 registros."

### ⚓ MODERNO: ABAP Cloud, RAP y CDS

"No me he quedado en el ABAP clásico. Estoy familiarizado con el ABAP nuevo, el de la 7.40 en adelante, y de hecho lo he usado en proyectos de cliente, como Naturgy Nedgia o el Ayuntamiento de Madrid: declaraciones inline, expresiones constructoras como VALUE, NEW, COND o REDUCE, el nuevo ABAP SQL y CDS. Lo uso porque el código sale más corto, más legible y más rápido, ya que el trabajo lo hace la base de datos. Además, estoy certificado como SAP Back-End Developer en ABAP Cloud y he construido mis propias aplicaciones RAP en BTP: managed, draft, validations, actions y side effects. Por ejemplo, tengo una app de informes de gastos que también expuse como API OData V4 y probé de principio a fin con Postman. Conozco los principios de clean core y los aplico: solo APIs liberadas."

### ⚓ EQUIPO: cómo trabajo

"En cuanto a cómo trabajo: me entiendo bien con los consultores funcionales, documento lo que hago y me gusta probar junto al usuario. Escribo código modular y orientado a objetos, pensando en quien lo tenga que mantener después. Y aprendo rápido: muchas veces me ha tocado entrar en un proyecto en marcha y hacer ingeniería inversa de código que no era mío."

### ⚓ CIERRE

"En resumen, puedo aportaros experiencia sólida en ABAP clásico, especialización en integraciones y una base real en ABAP Cloud y RAP para acompañar la transición a S/4HANA y clean core. Me encantaría saber más sobre vuestro proyecto."

---

## 3. Habilidades en una frase

> Para cuando te pregunten por algo concreto.

| Te preguntan por… | Tú dices… |
|---|---|
| **OData** | "He hecho OData V2 en SEGW con deep insert multinivel, function imports, adjuntos y actualización masiva, y OData V4 con RAP." |
| **ABAP nuevo (7.40+)** | "Lo uso en proyectos de cliente: declaraciones inline, VALUE, NEW, COND, SWITCH, REDUCE, FOR y el nuevo ABAP SQL con expresiones y GROUP BY." |
| **CDS** | "Modelo CDS con asociaciones y jerarquías padre-hijo, y los he usado como base de servicios OData." |
| **RAP** | "Tengo práctica propia en BTP: managed, draft, validations, determinations, actions, side effects y feature control. Las extensiones RAP las conozco en teoría y aún no las he aplicado en un cliente." |
| **IDocs** | "Llevo años con IDocs: creación, actualización y monitorización, e integración con sistemas legados." |
| **Web services** | "He desarrollado y consumido SOAP con PO como orquestador, por ejemplo para publicar en el BOE." |
| **Rendimiento** | "Procesamiento paralelo, paquetes configurables y balanceo entre servidores, con procesos de hasta 60.000 registros." |
| **Formularios** | "Adobe Forms, Smartforms y Sapscript; por ejemplo, la factura de ventas de Engie en Adobe Forms." |
| **Mejoras estándar** | "BAdIs en MM42, en el Accrual Engine y una interfaz BAdI Z propia para el tratamiento de expedientes." |
| **IA** | "La uso para generar casos de prueba y validar soluciones, pero siempre verifico en el sistema y nunca meto datos del cliente." |

---

## 4. ABAP nuevo frente a ABAP clásico: qué se gana

> Por si te preguntan "¿y por qué usar la sintaxis nueva?".

```
 ABAP CLÁSICO                         ABAP NUEVO (7.40+)
 ─────────────                        ──────────────────
 DATA arriba, lejos del uso    ──►    declaración inline, donde se usa
 LOOP + APPEND + IF            ──►    VALUE / FOR / REDUCE / COND
 SELECT simple + lógica en ABAP──►    ABAP SQL con expresiones (code pushdown)
 SELECT en bucle               ──►    JOINs, CDS y asociaciones
 READ TABLE + sy-subrc         ──►    expresiones de tabla  itab[ ... ]
 CONCATENATE                   ──►    plantillas de texto  |...{ }...|
```

| Ganancia | Por qué |
|---|---|
| 📉 **Menos código** | Lo que antes ocupaba diez líneas ahora cabe en una o dos. |
| 👀 **Más legible** | La intención se ve directamente: "construyo esta tabla", "calculo esta suma". |
| 🐛 **Menos errores** | Menos variables auxiliares y menos `sy-subrc` olvidados. |
| ⚡ **Más rendimiento** | Con el *code pushdown*, la base de datos (HANA) hace el trabajo pesado. |
| ☁️ **Preparado para el futuro** | Es la base de ABAP Cloud, RAP y clean core. La sintaxis obsoleta ni siquiera compila en ABAP Cloud. |

**Para decirlo en voz alta:**

"El ABAP nuevo me permite escribir menos código y más claro: declaro las variables donde las uso, construyo tablas con VALUE o FOR, y las condiciones con COND en lugar de bloques IF largos. Pero la ganancia grande es el rendimiento: con el nuevo ABAP SQL y CDS llevo la lógica a la base de datos, que en HANA marca mucha diferencia. Y además es el camino obligado hacia ABAP Cloud y RAP."

---

## 5. Si te preguntan por puntos de mejora

> Honesto, pero mostrando cómo lo estás trabajando.

"RAP lo domino en práctica propia y con la certificación, pero aún no lo he aplicado en un proyecto productivo de cliente, y es justo lo que busco. Por eso sigo construyendo aplicaciones completas en BTP. Otro punto es el inglés: tengo un B2 y lo uso a diario en lectura y escritura técnica, y estoy trabajando la conversación."

---

## 6. Cómo aprenderlo

1. **Memoriza las seis anclas**, no las frases.
2. **Lee cada bloque en voz alta 3 veces** y después dilo sin mirar, con tus palabras.
3. **Grábate en el móvil:** la versión completa debería durar unos 2 minutos.
4. **Ensaya primero la corta**: es la que más vas a usar.
