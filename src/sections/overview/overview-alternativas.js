import { Card, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export const OverviewAlternativas = (props) => {
  const { alternativas, onClick } = props;
  return (
    <>
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
                marginTop: '8px'
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
    </>
  );
};

OverviewAlternativas.propTypes = {
  alternativas: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
};
