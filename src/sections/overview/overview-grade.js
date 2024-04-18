import { Grid, Typography, Card } from '@mui/material';
import PropTypes from 'prop-types';
import { DisciplinaCard } from './disciplina-card';

export const OverviewGrade = (props) => {
  const { isMatutino, materias, selected, onClick } = props;
  const dias = ["", "Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
  const comeco = isMatutino ? "8" : "19"
  const intervalo = isMatutino ? "10" : "21"
  const fim = isMatutino ? "12" : "23"
  const cores = ["#87CEFA", "#EE82EE", "#3CB371", "#CD853F", "#FFDEAD", "#66CDAA", "#FA8072", "#F0E68C", "#FF69B4", "#6A5ACD"]
  
  const materiasResumo = materias.filter(o => o.escolhida).map((o, index) => ({
    aulas: o.aulas,
    disciplina: o.disciplinas.find(o => o.escolhida),
    cor: cores[index]
  }))

  const getDisciplina = (horario) => {
    const disciplina = materiasResumo.find(o => o.aulas.includes(horario))
    const professor = disciplina?.disciplina.professores.find(o => o.escolhida)
    return { nome: disciplina?.disciplina.disciplina, professores: professor?.nome, cor: disciplina?.cor }
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
        height={160}
      >
        <DisciplinaCard 
          disciplina={getDisciplina(horario)}
          selected={selected}
          horario={horario}
          onClick={onClick} />
      </Grid>)
  }

  return (
    <Card sx={{backgroundColor: '#E9E8E8'}}>
      <Typography sx={{marginLeft: '16px', marginTop: '16px', fontSize: '24px'}}>Grade</Typography>
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
        marginTop="4px"
        marginBottom="8px"
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
        marginTop="4px"
        marginBottom="16px"
      >
        {dias.map((dia, index) => (
          renderMaterias(index, dia, intervalo, fim)
        ))}
      </Grid>
    </Card>
  );
};

OverviewGrade.propTypes = {
  isMatutino: PropTypes.bool.isRequired,
  materias: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.object.isRequired
};
