    const express = require('express');
    const router = express.Router();
    // Datos de las carreras y las materias
    const TecnicoIngenieriaComputacion = [
        {
            codigoMateria: "PAL404",
            UV: 4,
            nombreMateria: "Programación de Algoritmos",
            requisitosMateria: ["Bachillerato"],
        },
        {
            codigoMateria: "LME404",
            UV: 4,
            nombreMateria: "Lenguajes de Marcado y Estilo Web",
            requisitosMateria: ["Bachillerato"],
        },
        {
            codigoMateria: "REC404",
            UV: 4,
            nombreMateria: "Redes de Comunicación",
            requisitosMateria: ["Bachillerato"],
        },
        {
            codigoMateria: "POO404",
            UV: 4,
            nombreMateria: "Programación Orientada a Objetos",
            requisitosMateria: ["PAL404"],
        },
        {
            codigoMateria: "DAW404",
            UV: 4,
            nombreMateria: "Desarrollo de Aplic. Web con Soft. Interpret. en el Cliente",
            requisitosMateria: ["LME404"],
        },
        {
            codigoMateria: "ASB404",
            UV: 4,
            nombreMateria: "Análisis y Diseño de Sistemas y Base de Datos",
            requisitosMateria: ["PAL404"],
        },
        {
            codigoMateria: "DPS441",
            UV: 4,
            nombreMateria: "Diseño y Programacion de software multiplataforma",
            requisitosMateria: ["DAW404"],
        },
        {
            codigoMateria: "DWF404",
            UV: 4,
            nombreMateria: "Desarollo de Apliaciones Web Framework",
            requisitosMateria: ["ASB404"],
        },
        {
            codigoMateria: "DSS4044",
            UV: 4,
            nombreMateria: "Desarollo Aplic .web con soft interprt en el servidor",
            requisitosMateria: ["DAW404"],
        },
        {
            codigoMateria: "SPP404",
            UV: 4,
            nombreMateria: "Servidores en plataformas propietarias",
            requisitosMateria: ["REC404"],
        },

    ];

    const IngenieriaenCienciasdelaComputacion = [
        {
            codigoMateria: "CAD941",
            UV: 4,
            nombreMateria: "Cálculo Diferencial",
            requisitosMateria: ["Bachillerato"],
        },
        {
            codigoMateria: "AVM941",
            UV: 4,
            nombreMateria: "Álgebra Vectorial y Matrices",
            requisitosMateria: ["Bachillerato"],
        },
        {
            codigoMateria: "PRE941",
            UV: 4,
            nombreMateria: "Programación Estructurada",
            requisitosMateria: ["Bachillerato"],
        },
        {
            codigoMateria: "MDB104",
            UV: 4,
            nombreMateria: "Modelo y Diseño de Base de Datos",
            requisitosMateria: ["PRE941"],
        },
        {
            codigoMateria: "POO104",
            UV: 4,
            nombreMateria: "Programacion Orientada a objectos",
            requisitosMateria: ["PRE941"],
        },
        {
            codigoMateria: "ADS104",
            UV: 4,
            nombreMateria: "Anañis y Diseño de sistemas informaticos",
            requisitosMateria: ["MDB104"],
        },
        {
            codigoMateria: "PED104",
            UV: 4,
            nombreMateria: "Programacion con estructura de Datos",
            requisitosMateria: ["POO104"],
        },
        {
            codigoMateria: "DMD104",
            UV: 4,
            nombreMateria: "Datawarehouse y Mineria de Datos",
            requisitosMateria: ["ADS104"],
        },
        {
            codigoMateria: "EYEM501",
            UV: 4,
            nombreMateria: "Electronica y ,Magnetismo",
            requisitosMateria: ["CDP501"],
        },
        {
            codigoMateria: "ACE",
            UV: 4,
            nombreMateria: "Analisis de circuitos Electricos",
            requisitosMateria: ["EYEM501"]
        },

    ];

    // Define un objeto para almacenar las carreras
    const carreras = {
        TecnicoIngenieriaComputacion,
        IngenieriaenCienciasdelaComputacion,
    };
    // Ruta para consultar prerrequisitos de una materia por código
    router.get('/api/materias/:carrera/prerrequisitos/:codigoMateria', (req, res) => {
        const { carrera, codigoMateria } = req.params;

        // Busca la carrera en los datos
        const carreraData = carreras[carrera];

        if (!carreraData) {
            return res.status(404).json({ mensaje: 'Carrera no encontrada' });
        }

        // Busca la materia por código en la carrera
        const materia = carreraData.find((m) => m.codigoMateria === codigoMateria);

        if (!materia) {
            return res.status(404).json({ mensaje: 'Materia no encontrada' });
        }

        // Responde con la información de los prerrequisitos
        res.json({ prerrequisitos: materia.requisitosMateria });
    });

    // Ruta para consultar materias por ciclo
    router.get('/api/materias/:carrera/ciclo/:ciclo', (req, res) => {
        const { carrera, ciclo } = req.params;

        // Busca la carrera en los datos
        const carreraData = carreras[carrera];

        if (!carreraData) {
            return res.status(404).json({ mensaje: 'Carrera no encontrada' });
        }

        // Filtra las materias por el ciclo especificado
        const materiasPorCiclo = carreraData.filter((m) => m.ciclo === parseInt(ciclo, 10));

        if (materiasPorCiclo.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron materias para el ciclo especificado' });
        }

        // Responde con la información de las materias encontradas
        res.json({ materias: materiasPorCiclo });
    });

    // Ruta para inscripción de materias
    router.post('/api/inscripciones/:carrera', (req, res) => {
        const { carrera } = req.params;
        const { materias } = req.body;

        // Verifica si la carrera existe en los datos
        const carreraData = carreras[carrera];

        if (!carreraData) {
            return res.status(404).json({ mensaje: 'Carrera no encontrada' });
        }

        // Calcula el número total de UV de las materias a inscribir
        const totalUV = materias.reduce((acc, codigoMateria) => {
            const materia = carreraData.find((m) => m.codigoMateria === codigoMateria);
            if (materia) {
                return acc + materia.UV;
            }
            return acc;
        }, 0);

        const limiteUV = 20; 

        // Verifica si el número total de UV no supera el límite permitido
        if (totalUV > limiteUV) {
            return res.status(400).json({ mensaje: 'Excede el límite de UV permitido' });
        }

        // Verifica si las materias existen y si se cumplen los requisitos de inscripción
        const materiasNoEncontradas = [];
        const requisitosNoCumplidos = [];

        materias.forEach((codigoMateria) => {
            const materia = carreraData.find((m) => m.codigoMateria === codigoMateria);

            if (!materia) {
                materiasNoEncontradas.push(codigoMateria);
            } else {
                const requisitos = materia.requisitosMateria;

                if (requisitos.some((req) => !materias.includes(req))) {
                    requisitosNoCumplidos.push(codigoMateria);
                }
            }
        });

        if (materiasNoEncontradas.length > 0 || requisitosNoCumplidos.length > 0) {
            return res.status(400).json({
                mensaje: 'No se pueden inscribir algunas materias',
                materiasNoEncontradas,
                requisitosNoCumplidos,
            });
        }

        //  mensaje de éxito
        res.json({ mensaje: 'Inscripción exitosa' });
    });

    // Ruta para eliminar inscripciones de materias
    router.delete('/api/inscripciones/:carrera', (req, res) => {
        const { carrera } = req.params;

        // Verifica si la carrera existe en los datos
        const carreraData = carreras[carrera];

        if (!carreraData) {
            return res.status(404).json({ mensaje: 'Carrera no encontrada' });
        }

        // Obtiene las materias a eliminar del cuerpo de la solicitud 
        const { materiasAEliminar } = req.body;

        // Verifica si se proporcionaron las materias a eliminar
        if (!materiasAEliminar || materiasAEliminar.length === 0) {
            return res.status(400).json({ mensaje: 'Debe proporcionar las materias a eliminar' });
        }

        // Filtra las materias inscritas para quedarse con las que no se van a eliminar
        const materiasInscritas = carreraData.filter((m) => !materiasAEliminar.includes(m.codigoMateria));

        // Actualiza los datos de las materias inscritas para la carrera
        carreras[carrera] = materiasInscritas;

        // Responde con un mensaje de éxito
        res.json({ mensaje: 'Inscripciones eliminadas con éxito' });
    });

    module.exports = router;