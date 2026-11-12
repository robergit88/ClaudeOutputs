# Naturgy Nedgia: procesos de almacén, compras y mantenimiento expuestos como API OData

> Digitalicé la recepción de mercancía, las compras y el mantenimiento en campo de una distribuidora de gas, exponiendo SAP S/4HANA como servicios OData V2 para apps externas y móviles.

![Portada del proyecto](img/00-portada.png)

> ⏳ = dato pendiente de completar

## 1. Contexto

| Campo | Valor |
|---|---|
| **Cliente** | Naturgy Nedgia |
| **Sector** | Energía (distribución de gas) |
| **Consultora** | Viewnext |
| **Fechas** | 12/2025 – 08/2026 |
| **Sistema** | S/4HANA |
| **Módulos** | MM (inventario y compras) · PM (mantenimiento) |
| **Tipo de proyecto** | Implantación S/4HANA |

**Qué buscaba el cliente:**

- Que las apps externas y móviles pudieran registrar en SAP las recepciones, las solicitudes de pedido y las operaciones de mantenimiento.
- Mantener la integración con los sistemas legados mediante IDocs.

## 2. Mi rol

| Campo | Valor |
|---|---|
| **Puesto** | Desarrollador ABAP Senior |
| **Equipo** | ⏳ |
| **Metodología** | ⏳ |
| **Interlocutores** | ⏳ (funcionales MM/PM, equipo de las apps móviles…) |

**Mis responsabilidades:**

- Diseño y desarrollo de los servicios OData V2 en SEGW.
- Modelado CDS jerárquico para el deep insert.
- Pruebas de los servicios con Postman.
- Mantenimiento de IDocs con sistemas legados.

## 3. Arquitectura / flujo

```
[App externa / móvil]
        │  HTTP (OData V2)
        ▼
[Servicio SEGW] ──► [DPC_EXT] ──► [Clase auxiliar ABAP] ──► [BAPIs / S/4HANA]
        ▲                                                     MIGO · ME51N · ME52N · IW32
  [CDS jerárquico: cabecera → posiciones]

[Sistemas legados] ◄──── IDocs ────► [S/4HANA]
```

![Diagrama del flujo](img/01-flujo.png)

## 4. Desarrollos clave

✅ en producción · 🔧 en curso · 📦 entregado sin seguimiento

### 4.1 Movimientos de mercancía por entrega entrante (MIGO) ⏳

**Técnica:** `OData V2` · `SEGW` · `Deep insert multinivel` · `CDS jerárquico` · `DPC_EXT`

![Captura](img/04-1-migo.png)

**STAR**
- **S:** ⏳ (cómo se registraban antes las recepciones)
- **T:** permitir registrar la entrada de mercancía de una entrega entrante desde una app externa.
- **A:** servicio OData V2 con deep insert multinivel (cabecera y posiciones) sobre un CDS jerárquico, con la lógica en DPC_EXT y una clase auxiliar ABAP. Probado con POST desde Postman.
- **R:** ⏳

### 4.2 Solicitud de pedido (ME51N) y adjuntos (ME52N) ⏳

**Técnica:** `OData V2` · `Deep insert` · `Adjuntos`

**STAR**
- **S:** ⏳
- **T:** crear solicitudes de pedido desde fuera de SAP y añadirles documentos.
- **A:** servicio de creación de solicitudes de pedido con sus posiciones, más una operación para adjuntar ficheros a una solicitud existente.
- **R:** ⏳

### 4.3 Equipos de mantenimiento PM (IW32) y actualización masiva ⏳

**Técnica:** `OData V2` · `Function import` · `Actualización masiva`

**STAR**
- **S:** ⏳
- **T:** operar sobre órdenes y equipos PM desde campo, y actualizar muchos equipos a la vez.
- **A:** function import para la operación sobre equipos (IW32) y un servicio de actualización masiva de equipos.
- **R:** ⏳

### 4.4 IDocs con sistemas legados y equipos contadores ⏳

**Técnica:** `IDoc` · `ALE`

**STAR**
- **S:** ⏳
- **T:** mantener el proceso de creación de equipos contadores eléctricos y la integración con los sistemas legados.
- **A:** ⏳
- **R:** ⏳

## 5. Valor aportado

| Antes | Después | Cifra |
|---|---|---|
| ⏳ | Recepción, compras y mantenimiento registrados desde apps externas y móviles | ⏳ |

## 6. Tecnologías y objetos

| Área | Detalle |
|---|---|
| **ABAP** | CDS jerárquico · DPC_EXT · clase auxiliar ABAP · ABAP OO |
| **Integración** | OData V2 (SEGW): deep insert multinivel, function imports, adjuntos, actualización masiva · IDocs |
| **Transacciones** | MIGO · ME51N · ME52N · IW32 |
| **Herramientas** | SEGW · Postman · ⏳ |

## 7. Dificultades y cómo las resolví

| Problema | Solución |
|---|---|
| ⏳ | ⏳ |

## 8. Aprendido / mejoraría

- **Aprendí:** ⏳
- **Haría distinto:** ⏳

## 9. Cómo contarlo en una entrevista

> 30 segundos, en voz alta.

- "En Naturgy Nedgia, dentro de una implantación de S/4HANA, me encargué de exponer SAP a las apps externas y móviles. Desarrollé servicios OData V2 con deep insert multinivel para registrar entradas de mercancía y crear solicitudes de pedido con adjuntos, y function imports para el mantenimiento de equipos en campo. Además mantuve la integración con los sistemas legados mediante IDocs. El resultado: procesos que antes ⏳ ahora se registran directamente desde la app."

---

*Sin código ni datos del cliente: solo procesos, soluciones y resultados.*
