import PropTypes from 'prop-types';
import { Card, CardContent, Typography } from '@mui/material';

export const DisciplinaCard = (props) => {
  const { disciplina, horario, onClick } = props;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        marginLeft: "1px",
        marginRight: "1px",
        cursor: 'pointer'
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
  onClick: PropTypes.func.isRequired
};
