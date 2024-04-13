import { Card, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export const OverviewProfessores = (props) => {
  const { professores, onClick } = props;
  return (
    <>
      {professores.map((professor, index) => (
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
          onClick={() => onClick(professor.nome)}
        >
          <Typography 
            align="center"
            fontSize={20}>
              {professor.nome}
          </Typography>
        </Card>
      ))}
    </>
  );
};

OverviewProfessores.propTypes = {
  professores: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
};
