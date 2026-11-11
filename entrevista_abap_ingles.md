# Interview preparation: Senior ABAP Developer (English practice file)

Roberto Carlos Puma · Madrid · Interview in English

Each answer is in English (for practice). Under it, **ES** gives the idea in Spanish so you can check you understand it. Do not memorize word by word: learn the idea and the key phrases.

---

## How to practice (10 minutes a day)

1. **Read aloud** one answer, slowly.
2. **Record yourself** on your phone, without reading.
3. **Listen** and mark the words where you hesitate. Repeat only those.
4. Next day, answer **without looking** and compare.

## Honesty rule (everything must be defendable)

| Say this | When |
|---|---|
| **I did** | Your real work experience |
| **I built** | Your own RAP exercises and applications |
| **I understand / I know the concept** | Studied, not applied in a project (RAP extensions) |
| **I would** | What you would do in a real project |

## Emergency phrases

- *"Could you please repeat the question? I want to make sure I understand."*
- *"That's a good question. Let me think for a moment."*
- *"I haven't done this in a project yet, but I understand the concept, and I would check the documentation for the exact syntax."*
- *"Let me explain it with an example."*

---

## 1. Introduction (about 75 seconds)

> *"Thank you for the invitation. My name is Roberto, and I'm a senior ABAP developer with more than 15 years of experience in SAP, from R/3 to S/4HANA. My strength is integration: I've built many OData V2 services with SEGW and CDS, IDoc interfaces with legacy systems, PO web services, BAdIs, and Adobe Forms and Smartforms, in industries like energy, pulp and paper, and the public sector. I also work with modern ABAP: CDS, and I built small RAP applications on Z tables, and I'm certified in ABAP Cloud. I haven't applied RAP extensions in a project yet, but I understand the concepts and how they connect to clean core. I like clear, maintainable solutions, and I enjoy working close to the functional consultants."*

**ES:** 15+ años, fuerte en integración (OData V2, IDocs, PO, BAdIs, formularios), ABAP moderno (CDS, RAP sobre tablas Z, certificación ABAP Cloud), y honesto sobre las extensiones RAP.

---

## 2. Technical questions

### 2.1 Walk me through an OData V2 integration you built.

> *"At Naturgy I built an OData V2 service to create goods movements with MIGO from an inbound delivery. I modeled the data in a hierarchical CDS view, created the SEGW project, and implemented the logic in the DPC_EXT class, with a helper ABAP class that prepares the data and calls the standard process. I tested everything with POST requests from Postman. I built similar services for purchase requisitions with ME51N, and a function import to update the status of PM equipment. The services are used by external apps and mobile devices in the field."*

**ES:** Servicio MIGO con CDS jerárquico, SEGW, DPC_EXT y clase auxiliar; pruebas con Postman; servicios similares para ME51N y function import de equipos.

### 2.2 How are your OData V2 services built on CDS?

> *"In most of my SEGW services, I use a CDS entity as the data source reference, so the service is exposed through SADL. SADL takes care of reading, filtering, paging and navigation over the associations. For write operations, for example a deep insert on a hierarchical CDS model, I implement the logic in DPC_EXT with a helper class. This keeps the model in one place, in CDS, and the code focused on the business logic."*

**ES:** CDS como data source reference, expuesto vía SADL (lectura, filtros, paginación, navegación). La escritura, como el deep insert, va en DPC_EXT con clase auxiliar.

### 2.3 What importance do you give to CDS?

> *"A lot. CDS is the data model: I define entities, associations and parent-child relationships once, close to the database, and I reuse them for OData services, Fiori and RAP. It supports code pushdown on HANA, so I aggregate and filter in the database and not in ABAP loops. With DCL I can also control access by authorization. And it is the base of RAP, so the knowledge transfers directly."*

**ES:** CDS = modelo de datos único y reutilizable; code pushdown; DCL para acceso; base de RAP.

### 2.4 What did ABAP 7.4 introduce? Which improvements do you use?

> *"ABAP 7.40 changed the way we write ABAP, mainly to write less code and to push work to the database. The main improvements are: inline declarations, like DATA( ), so I declare a variable where I use it; constructor expressions such as VALUE, CORRESPONDING, CONV and COND, to build structures and tables in one statement; table expressions, to read a row without READ TABLE; string templates; iteration expressions with FOR; LOOP AT ... GROUP BY, to group internal tables without sorting and manual control-break logic; and ABAP SQL with expressions and joins for code pushdown. The result is shorter, more readable code."*

**ES:** Declaraciones inline, expresiones constructoras, expresiones de tabla, plantillas de texto, FOR, GROUP BY y ABAP SQL moderno.

| Before | With 7.4+ |
|---|---|
| `DATA lv_name TYPE string.` | `DATA(lv_name) = ...` |
| `READ TABLE lt INTO ls WITH KEY id = 1.` | `DATA(ls) = lt[ id = 1 ].` |
| `SORT` + `AT NEW` | `LOOP AT ... GROUP BY` |

*Detail Andreas likes:* a table expression raises an exception if the row does not exist. Use `line_exists( )` or `OPTIONAL`.

### 2.5 What does clean core mean for you as a developer?

> *"For me, clean core means we don't modify SAP standard objects, and we use only released APIs and extension points. In ABAP Cloud development, the language version restricts the code to released objects, so the tooling enforces it. The benefit is that upgrades are easier and cheaper, because SAP can change what is below without breaking my code. When there is no released API for what is needed, I would look for an alternative, like a released BAdI or a side-by-side solution."*

**ES:** No modificar el estándar, solo APIs y puntos de extensión liberados; upgrades más fáciles; alternativas: BAdI liberado o side-by-side.

### 2.6 Tell me about your experience with IDocs.

> *"I've worked with IDocs for many years. At Globant I created, updated and monitored IDocs. At Naturgy I implemented IDocs with legacy systems, and at Engie an inbound IDoc to bring purchase invoices into FI. In an inbound interface, the process code calls a function module that posts the data and sets the status, so errors are visible in monitoring. IDocs are asynchronous and robust, with monitoring built in, so they still fit well for integration with legacy systems."*

**ES:** IDocs en Globant, Naturgy y Engie; en entrada, el process code llama a un módulo que contabiliza y fija el estado.

### 2.7 Adobe Forms or Smartforms: what do you prefer and why?

> *"I've worked with Sapscript, Smartforms and Adobe Forms. Sapscript is the oldest. Smartforms is graphical, but less flexible for complex layouts. Adobe Forms uses an interface and a separate layout in Adobe LiveCycle Designer, so the data logic is separated from the design and I get precise PDF output. At Engie I built a sales form with Adobe Forms for invoice printing. For new developments I prefer Adobe Forms, and I keep Smartforms only for maintaining existing forms."*

**ES:** Adobe Forms separa lógica y diseño y da PDF preciso; Smartforms solo para mantener.

### 2.8 You extended the Accrual Engine with a BAdI. How is that different from RAP extensibility?

> *"At Engie I extended the Accrual Engine with a BAdI to add business fields to the accrual calculation. That is the classic extension model: SAP provides an enhancement spot and I implement it. RAP extensibility follows the same idea with a more modern model: released extension points in layers, which are the table, the CDS views, the projection and the behavior. I haven't applied RAP extensions in a project yet, but I understand the concepts: extension include, extend view entity, extend behavior through the BO interface, and the C0 release contract. The goal is the same: don't modify the standard, and stay upgrade-stable."*

**ES:** BAdI = extensión clásica; extensibilidad RAP = misma idea por capas con contrato C0. No lo he aplicado, pero entiendo los conceptos.

### 2.9 What did you build in RAP, and what changes compared with SEGW?

> *"I built small RAP applications on Z tables: CDS view entities, a managed behavior with draft, validations, determinations and actions, plus value help and an Excel upload. Compared with SEGW, I write much less plumbing: no DPC_EXT and no manual CRUD, and the framework gives me draft, locks and OData V4. My logic goes into determinations and validations. For a deep insert like the goods movement I did with SEGW, I would model the document as a root with item children, and because the MIGO logic already exists, I would use an unmanaged save to reuse the standard API."*

**ES:** Apps RAP managed con draft, validations, determinations, actions; menos código de base que SEGW; para MIGO usaría unmanaged save.

### 2.10 How do you think about performance in ABAP on HANA?

> *"On HANA the principle is code pushdown: do joins, aggregations and filters in the database, with CDS or ABAP SQL, and read only the fields you need. I avoid SELECT inside loops and I don't load big tables into internal tables just to filter them in ABAP. I worked on refactoring processes with 40,000 and 60,000 records, where volume really matters. When there is a performance problem, I would measure first, with SQL trace and the ABAP profiler, and not guess."*

**ES:** Code pushdown, sin SELECT en bucles, medir antes de optimizar. Procesos de 40.000 y 60.000 registros.

### 2.11 How do you test your RAP code?

> *"Honestly, I haven't written automated tests for RAP yet. In my learning path I focused on building the business object and testing it manually, through the Fiori preview and Postman. I understand the concept: ABAP Unit, with test doubles to isolate the database, so tests are fast and repeatable. In a real project I would start with unit tests for validations and determinations, and I would check the documentation for the exact classes."*

**ES:** Sinceridad: pruebas manuales por ahora; entiendo ABAP Unit con test doubles y empezaría por validations y determinations.

### 2.12 How do you handle authorizations in a RAP application?

> *"There are two levels. For reading, I have worked with DCL, which filters the data according to the user's authorizations. For changes, the behavior definition has global authorization, which doesn't depend on a record, and instance authorization, which depends on the data. I understand this concept, but I haven't implemented it in a customer project yet."*

**ES:** Lectura: DCL. Cambios: autorización global e de instancia (concepto entendido, no aplicado en cliente).

### 2.13 Do you use AI and agents?

> *"Yes, I use AI as an assistant, not as a replacement for my judgment. I use it to generate test cases and use cases, to cross-check a solution, and to clarify technical doubts. I always verify the result in the system, because AI can be wrong, especially with exact syntax or release states. I also respect confidentiality: I don't paste client code or data into tools the company hasn't approved. About agents, I understand the idea: a model that plans and uses tools in several steps, and I'm interested in how they can help in ABAP development."*

**ES:** IA como asistente, verifico siempre en el sistema, confidencialidad; sobre agentes, conozco el concepto.

*Follow-up to prepare:* "When did AI make a mistake and how did you find it?" Use a real example of yours, for example syntax that did not exist in your release and failed at activation.

---

## 3. Behavioral questions

### 3.1 Tell me about a project you are proud of. (STAR)

| | |
|---|---|
| **S**ituation | Community of Madrid: fixed assets had to move between structures after government changes. By hand it took weeks, with accounting risk. |
| **T**ask | Automate it so no asset ends in an inconsistent state. |
| **A**ction | Three-layer design (launcher, scheduler, applier), batches, server load balancing, validation at every phase, volume tests, documentation. |
| **R**esult | A manual task of weeks became a reliable, auditable mass process. |

> *"At the Community of Madrid, fixed assets had to be moved between organizational structures after government changes. Doing it manually took weeks and had a high risk of accounting errors. I designed a three-layer solution, with a launcher, a scheduler and an applier, that processes in batches and balances the load across servers. For each asset, it creates the target, retires the source and confirms, with validation at every phase. I also ran volume tests and wrote the documentation. The result was a manual task of weeks turned into a reliable and auditable mass process."*

### 3.2 How do you work with functional consultants when a requirement is unclear?

> *"I ask for a concrete example of the process, with real data if possible, and I confirm what the system should do in each case, including the exceptions. At Engie, for example, the business needed extra fields in the accrual calculation, so I first understood how the calculation worked, and only then I implemented the BAdI. I write down what we agree, and I test together with the consultant before the key users do."*

### 3.3 What is your biggest weakness?

> *"My spoken English. I read and write technical English every day, and I'm B2, but I'm less fluent when I speak. I'm working on it, and I prepared for this interview in English. If I don't understand something, I ask for clarification, because I prefer to be clear than to guess."*

### 3.4 Why this role?

> *"This role combines what I do best, ABAP development and integrations, with the modern direction of SAP: CDS, RAP and clean core. I like to learn by doing: I built my own RAP exercises and prepared my ABAP Cloud certification on my own. I want to keep growing in a team that works with modern ABAP."*

---

## 4. Diagram to draw and explain: interaction phase and save phase

```
 INTERACTION PHASE                      SAVE PHASE
 (transactional buffer)                 (save sequence)
┌──────────────────────────┐   ┌──────────────────────────────┐
│ create / update / delete │   │ finalize (determinations     │
│ actions                  │──▶│            on save)          │
│ authorization checks     │   │ check_before_save            │
│ determinations on modify │   │            (validations)     │
│ early numbering          │   │ adjust_numbers (late numbers)│
│ DB: nothing written      │   │ save  (writes to the DB)     │
└──────────────────────────┘   │ cleanup                      │
        ▲                      └──────────────────────────────┘
        └──── if a validation fails, the save is rejected ────┘
```

> *"In the interaction phase, changes stay in the transactional buffer and nothing is written to the database. In the save phase, determinations on save run, then validations. If one fails, the save is rejected and the user keeps editing. If everything is fine, the data is written to the database."*

Check the exact method names of the saver class in SAP Help before you quote them.

---

## 5. Questions for them

- *"How is the team split between classic ABAP and RAP?"*
- *"How do developers and functional consultants work together day to day?"*
- *"Which level of clean core do you apply in your landscape?"*
- *"What would the first three months look like?"*
