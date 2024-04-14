import { Card, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export const OverviewHorarios = (props) => {
  const { horarios, onClick } = props;
  return (
    <>
      {horarios.map((horario, index) => (
        <Card
          key={index} 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            marginLeft: "1px",
            marginRight: "1px",
            cursor: 'pointer',
            justifyContent: "center",
            marginTop: '8px'
          }}
          onClick={() => onClick(horario)}
        >
          <Typography 
            align="center"
            fontSize={20}>
              {horario.reduce((atual, str) => atual + " - " + str, "").substring(3)}
          </Typography>
        </Card>
        ))}
    </>
  );
};

OverviewHorarios.propTypes = {
  horarios: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
};
