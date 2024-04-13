import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { DisciplinaCard } from './disciplina-card';

export const OverviewGrade = (props) => {
  const { isMatutino, materias, onClick } = props;
  const dias = ["", "Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
  const comeco = isMatutino ? "8" : "19"
  const intervalo = isMatutino ? "10" : "21"
  const fim = isMatutino ? "12" : "23"

  const getDisciplina = (horario) => {
    const disciplinas = materias.find(o => o.aulas.includes(horario) && o.escolhida)?.disciplinas
    const disciplina = disciplinas?.find(o => o.escolhida)
    const professor = disciplina?.professores.find(o => o.escolhida)
    return { nome: disciplina?.disciplina, professores: professor?.nome }
  }

  const renderMaterias = (index, dia, comeco, fim) => {
    if(index === 0)
      return(
        <Grid
          item
          key={index}
          xs={1}
          sm={1}
          lg={1}
          height={100}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography fontSize={20}>{comeco + ":00"}</Typography>
        </Grid>
      )
    const horario = dia + " " + comeco + "-" + fim
    return(
      <Grid
        item
        key={index}
        xs={1}
        sm={1}
        lg={1}
        height={100}
      >
        <DisciplinaCard 
          disciplina={getDisciplina(horario)}
          horario={horario}
          onClick={onClick} />
      </Grid>)
  }

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        textAlign="center"
        columns={dias.length}
      >
          {dias.map((dia, index) => (
            <Grid
              item
              key={index}
              xs={1}
              sm={1}
              lg={1}
            >
              <Typography fontSize={20}>{dia}</Typography>
            </Grid>
        ))}
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        columns={dias.length}
        marginTop="8px"
      >
        {dias.map((dia, index) => (
          renderMaterias(index, dia, comeco, intervalo)
        ))}
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        columns={dias.length}
        marginTop="8px"
      >
        {dias.map((dia, index) => (
          renderMaterias(index, dia, intervalo, fim)
        ))}
      </Grid>
    </>
  );
};

OverviewGrade.propTypes = {
  isMatutino: PropTypes.bool.isRequired,
  materias: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
};
