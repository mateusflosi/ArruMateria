import { useState } from 'react';
import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewGrade } from 'src/sections/overview/overview-grade';
import { OverviewProfessores } from 'src/sections/overview/overview-professores';
import { OverviewAlternativas } from 'src/sections/overview/overview-alternativas';
import { OverviewHorarios } from 'src/sections/overview/overview-horarios';

const Page = () => {
  const [isMatutino, setMatutino] = useState(true)
  const [bloco, setBloco] = useState(undefined);
  const [materia, setMateria] = useState(undefined)
  const [refresh, setRefresh] = useState(false)
  const [obj, setObj] = useState([{
    "aulas": ["Segunda 8-10", "Quarta 10-12"],
    "escolhida":true,
    "disciplinas":[
       {
          "disciplina":"Orientação a Objetos",
          "professores":[
            {
              "nome": "Prof1",
              "escolhida":false,
            },
            {
              "nome": "Prof2",
              "escolhida":false,
            },
          ],
          "escolhida":true
       },
       {
          "disciplina":"Redes",
          "professores":[
            {
              "nome": "Prof3",
              "escolhida":false,
            },
            {
              "nome": "Prof4",
              "escolhida":false,
            },
          ],
          "escolhida":false
       },
       {
          "disciplina":"Grafos",
          "professores":[
            {
              "nome": "Prof5",
              "escolhida":false,
            },
            {
              "nome": "Prof6",
              "escolhida":false,
            },
          ],
          "escolhida":false
       }
    ]
  },
  {
    "aulas": ["Segunda 8-10"],
    "escolhida": false,
    "disciplinas":[
       {
          "disciplina":"Computador, Ética e Sociedade",
          "professores":[
            {
              "nome": "Prof7",
              "escolhida":false,
            },
            {
              "nome": "Prof8",
              "escolhida":false,
            },
          ],
          "escolhida":false
       }
    ]
  },
  {
    "aulas": ["Segunda 10-12", "Quarta 8-10"],
    "escolhida":true,
    "disciplinas":[
       {
          "disciplina":"Orientação a Objetos",
          "professores":[
            {
              "nome": "Prof1",
              "escolhida":false,
            },
            {
              "nome": "Prof2",
              "escolhida":false,
            },
          ],
          "escolhida":false
       },
       {
          "disciplina":"Redes",
          "professores":[
            {
              "nome": "Prof3",
              "escolhida":false,
            },
            {
              "nome": "Prof4",
              "escolhida":false,
            },
          ],
          "escolhida":true
       },
       {
          "disciplina":"Grafos",
          "professores":[
            {
              "nome": "Prof5",
              "escolhida":false,
            },
            {
              "nome": "Prof6",
              "escolhida":false,
            },
          ],
          "escolhida":false
       }
    ]
  },
  ])

  const getHorarios = () => {
    const array = []
    const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
    const comeco = isMatutino ? "8" : "19"
    const intervalo = isMatutino ? "10" : "21"
    const fim = isMatutino ? "12" : "23"

    dias.forEach(dia => {
      array.push(dia + " " + comeco + "-" + intervalo)
      array.push(dia + " " + intervalo + "-" + fim)
    })

    return array
  }

  const getHorariosLivres = (blocoRef) => {
    const array = []
    const horarios = getHorarios()
    const horariosOcupados = obj
      .filter(o => o.escolhida)
      .map(o => o.aulas)
      .reduce((atual, array) => array.concat(atual), [])

    horarios.forEach(o => {
      if(!horariosOcupados.includes(o))
        array.push(o)
    })

    return array.concat(blocoRef.aulas)
  }

  const checkHoraios = (aulas, horariosLivres) => {
    var retorno = true
    aulas.forEach(o => {
      if(!horariosLivres.includes(o))
        retorno = false
    })

    return retorno
  }

  const filtraBloco = (bloco, disciplinasEscolhidas) => {
    const blocoSemRef = JSON.parse(JSON.stringify(bloco))
    blocoSemRef.disciplinas = blocoSemRef.disciplinas
      .filter(o => !disciplinasEscolhidas.includes(o.disciplina))
    return blocoSemRef
  }

  const getDisciplinasEscolhidas = () => {
    return obj
      .filter(o => o.escolhida)
      .map(o => o.disciplinas)
      .reduce((atual, array) => array.concat(atual), [])
      .filter(o => o.escolhida)
      .map(o => o.disciplina)
  }

  const getAlternativas = (blocoRef) => {
    if(!blocoRef) return []

    var disciplinasEscolhidas = getDisciplinasEscolhidas()
    const alternativas = [filtraBloco(blocoRef, disciplinasEscolhidas)]
    const horariosLivres = getHorariosLivres(blocoRef)

    obj
      .filter(o => !o.escolhida && checkHoraios(o.aulas, horariosLivres))
      .forEach(bloco => {
        const blocoSemRef = filtraBloco(bloco, disciplinasEscolhidas)
        if(blocoSemRef.disciplinas.length > 0){
          alternativas.push(blocoSemRef)
          disciplinasEscolhidas = disciplinasEscolhidas.concat(blocoSemRef.disciplinas)
        }
      })

    return alternativas
  }

  return (
  <>
    <Head>
      <title>
        ArruMateria
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={12}
          >
            <OverviewGrade 
              isMatutino={isMatutino} 
              materias={obj}
              onClick={(disciplina, horario) => {
                const newBloco = obj.find(o => o.aulas.includes(horario) && o.escolhida)
                setBloco(newBloco)
                setMateria(newBloco?.disciplinas.find(o => o.disciplina == disciplina))
              }}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            lg={6}
          >
            <OverviewProfessores
              professores={materia?.professores ?? []}
              onClick={(professor) => {
                const professores = bloco
                  .disciplinas.find(o => o.disciplina === materia.disciplina).professores
                professores.forEach(o => {
                  o.escolhida = !o.escolhida && o.nome === professor
                })
                setRefresh(!refresh)
              }}
            />
            <OverviewHorarios 
              horarios={obj
                .filter(o => o.disciplinas.some(o => o.disciplina === materia?.disciplina))
                .map(o => o.aulas)
                .filter(o => JSON.stringify(o) !== JSON.stringify(bloco?.aulas))}
              onClick={(horario) => {
                materia.escolhida = false
                bloco.escolhida = false
                
                obj
                  .filter(o => o.escolhida && o.aulas.some(a => horario.includes(a)))
                  .map(o => {
                    o.escolhida = false
                    o.disciplinas.map(a => a.escolhida = false)
                  })

                const newBloco = obj.find(o => JSON.stringify(o.aulas) === JSON.stringify(horario))
                newBloco.escolhida = true
                const newMateria = newBloco.disciplinas.find(o => o.disciplina === materia.disciplina)
                newMateria.escolhida = true

                setBloco(newBloco)
                setMateria(newMateria)

                while(true)
                {
                  const alternativas = getAlternativas(newBloco)
                    .filter(o => !o.aulas.some(a => horario.includes(a)))
                    .sort(o => o.aulas.length).reverse()

                  if(alternativas.length === 0){
                    setRefresh(!refresh)
                    break
                  }
                  
                  const blocoAlternativa = obj.find(o => JSON.stringify(o.aulas) === JSON.stringify(alternativas[0].aulas))
                  blocoAlternativa.escolhida = true
                  const disciplinasEscolhidas = getDisciplinasEscolhidas()
                  blocoAlternativa.disciplinas.filter(o => !disciplinasEscolhidas.includes(o.disciplina))[0].escolhida = true
                }
              }}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            lg={6}
          >
            <OverviewAlternativas
              alternativas={getAlternativas(bloco)}
              onClick={(newBloco, alternativa) => {
                materia.escolhida = false
                bloco.escolhida = false
                const blocoObj = obj.find(o => JSON.stringify(o.aulas) === JSON.stringify(newBloco.aulas))
                blocoObj.escolhida = true
                const newMateria = blocoObj.disciplinas.find(o => o.disciplina === alternativa)
                newMateria.escolhida = true
                setMateria(newMateria)
                setBloco(blocoObj)
              }}
            />
            </Grid>
        </Grid>
      </Container>
    </Box>
  </>
)};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
