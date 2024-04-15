import { Card, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export const OverviewAlternativas = (props) => {
  const { alternativas, onClick } = props;

  if(alternativas.length === 0)
    return <></>
  
    return (
    <Card sx={{height:"456px", backgroundColor: '#E9E8E8'}} >
      <Typography sx={{marginLeft: '16px', marginTop: '16px', fontSize: '24px'}}>Alternativas</Typography>
      {alternativas
        .map((bloco, index1) => 
          bloco.disciplinas
          .map((alternativa, index2) => (
            <Card
              key={index1 + "-" + index2} 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                marginLeft: "1px",
                marginRight: "1px",
                cursor: 'pointer',
                justifyContent: "center",
                marginTop: '16px',
                height: '64px',
                marginLeft: '8px',
                marginRight: '8px'
              }}
              onClick={() => onClick(bloco, alternativa.disciplina)}
            >
              <Typography 
                align="center"
                fontSize={20}>
                  {alternativa.disciplina}
              </Typography>
            </Card>
          )))}
    </Card>
  );
};

OverviewAlternativas.propTypes = {
  alternativas: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
};
