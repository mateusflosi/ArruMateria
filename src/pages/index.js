import { useState } from 'react';
import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewGrade } from 'src/sections/overview/overview-grade';
import { OverviewProfessores } from 'src/sections/overview/overview-professores';
import { OverviewAlternativas } from 'src/sections/overview/overview-alternativas';

const Page = () => {
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
  }])

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
              isMatutino={true} 
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
                const professores = obj.find(o => o.aulas[0] === bloco.aulas[0] && o.escolhida)
                  .disciplinas.find(o => o.disciplina === materia.disciplina).professores
                professores.forEach(o => {
                  o.escolhida = !o.escolhida && o.nome === professor
                })
                setObj(obj)
                setRefresh(!refresh)
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
              alternativas={bloco?.disciplinas ?? []}
              onClick={(alternativa) => {
                const blocoObj = obj.find(o => o.aulas[0] === bloco.aulas[0] && o.escolhida)
                blocoObj.disciplinas.find(o => o.escolhida).escolhida = false
                const newMateria = blocoObj.disciplinas.find(o => o.disciplina === alternativa)
                newMateria.escolhida = true
                setObj(obj)
                setMateria(newMateria)
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
