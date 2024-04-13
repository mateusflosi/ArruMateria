import { useState } from 'react';
import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewGrade } from 'src/sections/overview/overview-grade';

const Page = () => {
  const [bloco, setBloco] = useState(undefined);
  const [materia, setMateria] = useState(undefined)
  const obj = [{
    "aula1":"Segunda 8-10",
    "aula2":"Quarta 10-12",
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
             "Prof3",
             "Prof4"
          ],
          "escolhida":false
       },
       {
          "disciplina":"Grafos",
          "professores":[
             "Prof4",
             "Prof5"
          ],
          "escolhida":false
       }
    ]
 }]

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
              const newBloco = obj.find(o => (o.aula1 === horario || o.aula2 === horario) && o.escolhida)
              setBloco(newBloco)
              setMateria(newBloco?.disciplinas.find(o => o.disciplina == disciplina))
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
