import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { DisciplinaCard } from './disciplina-card';

export const OverviewGrade = (props) => {
  const { isMatutino } = props;
  const dias = ["", "Segunda", "Terça", "Quarta", "Quinta", "Sexta"]

  const renderMaterias = (index, horario) => {
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
          <Typography fontSize={20}>{horario}</Typography>
        </Grid>
      )

    return(
      <Grid
        item
        key={index}
        xs={1}
        sm={1}
        lg={1}
        height={100}
      >
        <DisciplinaCard disciplina={{nome: "Engenharia de Software", professores: "Fulana, Ciclana"}} />
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
          renderMaterias(index, isMatutino ? "8:00" : "19:00")
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
          renderMaterias(index, isMatutino ? "10:00" : "21:00")
        ))}
      </Grid>
    </>
  );
};

OverviewGrade.propTypes = {
  isMatutino: PropTypes.bool.isRequired,
};
