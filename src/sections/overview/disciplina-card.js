import PropTypes from 'prop-types';
import { Card, CardContent, Typography } from '@mui/material';

export const DisciplinaCard = (props) => {
  const { disciplina, horario, selected, onClick } = props;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        marginRight: "8px",
        cursor: 'pointer',
        backgroundColor: disciplina.cor,
        border: selected && selected.disciplina === disciplina.nome ? '2px solid black' : ''
      }}
      onClick={() => onClick(disciplina.nome, horario)}
    >
      <CardContent>
        <Typography
          align="center"
          gutterBottom
        >
          {disciplina.nome}
        </Typography>
        <Typography
          align="center"
          variant="body1"
        >
          {disciplina.professores}
        </Typography>
      </CardContent>
    </Card>
  );
};

DisciplinaCard.propTypes = {
  disciplina: PropTypes.object.isRequired,
  horario: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.object.isRequired
};
