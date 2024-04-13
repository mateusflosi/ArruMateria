import { Card, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export const OverviewAlternativas = (props) => {
  const { alternativas, onClick } = props;
  return (
    <>
      {alternativas.filter(o => !o.escolhida).map((alternativa, index) => (
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
          onClick={() => onClick(alternativa.disciplina)}
        >
          <Typography 
            align="center"
            fontSize={20}>
              {alternativa.disciplina}
          </Typography>
        </Card>
        ))}
    </>
  );
};

OverviewAlternativas.propTypes = {
  alternativas: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
};
