import { Card, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export const OverviewHorarios = (props) => {
  const { horarios, onClick } = props;

  if(horarios.length === 0)
    return <></>

  return (
    <Card sx={{height:"224px", marginTop: "8px", backgroundColor: '#E9E8E8'}} >
      <Typography sx={{marginLeft: '16px', marginTop: '16px', fontSize: '24px'}}>Outros horários</Typography>
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
            marginTop: '8px',
            height: '48px',
            marginLeft: '8px',
            marginRight: '8px'
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
    </Card>
  );
};

OverviewHorarios.propTypes = {
  horarios: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
};
